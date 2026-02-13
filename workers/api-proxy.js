addEventListener("fetch", (event) => {
	event.respondWith(handle(event.request));
});

async function handle(request) {
	try {
		const url = new URL(request.url);

		// Construct backend URL: use HTTPS to the hostname (ensures SNI/TLS and Cloudflare routing work correctly)
		const BACKEND_HOST = "tracuuduoclamsang.vn";
		const backendUrl = `https://${BACKEND_HOST}${url.pathname}${url.search}`;

		const reqHeaders = new Headers(request.headers);
		// Ensure backend sees a valid Host header (Cloudflare blocks direct IP access)
		reqHeaders.set("host", BACKEND_HOST);
		// Set Origin/Referer so origin sees a browser-like request (helps with some WAF rules)
		reqHeaders.set("origin", `https://${BACKEND_HOST}`);
		reqHeaders.set("referer", `https://${BACKEND_HOST}`);

		console.log("proxying to", backendUrl, "Host:", reqHeaders.get("host"));

		const init = {
			method: request.method,
			headers: reqHeaders,
			body: ["GET", "HEAD"].includes(request.method)
				? undefined
				: await request.arrayBuffer(),
			redirect: "manual",
		};

		const resp = await fetch(backendUrl, init);

		// Copy status and body; forward most headers but ensure CORS is acceptable
		const headers = new Headers(resp.headers);
		// Allow browser access (adjust as needed)
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("Access-Control-Allow-Credentials", "true");

		if (resp.status >= 400) {
			const text = await resp.clone().text();
			console.error("Upstream error", resp.status, text.slice(0, 2000));
			return new Response(text, { status: resp.status, headers });
		}

		return new Response(resp.body, {
			status: resp.status,
			headers,
		});
	} catch (err) {
		return new Response("Proxy error", { status: 502 });
	}
}

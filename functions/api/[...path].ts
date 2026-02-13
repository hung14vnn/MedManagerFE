export async function onRequest(context: any) {
	const { request, params } = context;
	// params.path is the wildcard path segment (may include slashes)
	// If path is an array (when used with [...path]), join to string
	const path = Array.isArray(params?.path)
		? params.path.join("/")
		: params?.path || "";

	// Target backend (same as your previous Vercel rewrite)
	const backend = `https://tracuuduoclamsang.vn/api/${path}${
		new URL(request.url).search
	}`;

	const reqHeaders = new Headers(request.headers);
	// Remove host header to avoid issues
	reqHeaders.delete("host");

	const resp = await fetch(backend, {
		method: request.method,
		headers: reqHeaders,
		body: ["GET", "HEAD"].includes(request.method)
			? undefined
			: await request.arrayBuffer(),
	});

	// Copy headers (you can strip or map hop-by-hop headers if necessary)
	const resHeaders = new Headers(resp.headers);
	// Optional: set CORS or other headers for browser access
	resHeaders.set("Access-Control-Allow-Origin", "*");

	return new Response(resp.body, {
		status: resp.status,
		headers: resHeaders,
	});
}

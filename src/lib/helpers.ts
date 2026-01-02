// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	const debounced = (...args: Parameters<T>) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			timeoutId = undefined;
			func(...args);
		}, delay);
	};
	debounced.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
		}
	};
	return debounced;
}

export function formatDate(dateString: string | null | undefined): string {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return "Invalid date";
	}
}

export function getSeverityColor(severity: string): string {
	switch (severity.toLowerCase()) {
		case "severe":
			return "bg-red-100 text-red-800 border-red-300";
		case "moderate":
			return "bg-orange-100 text-orange-800 border-orange-300";
		case "mild":
			return "bg-yellow-100 text-yellow-800 border-yellow-300";
		case "none":
			return "bg-green-100 text-green-800 border-green-300";
		default:
			return "bg-gray-100 text-gray-800 border-gray-300";
	}
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
}

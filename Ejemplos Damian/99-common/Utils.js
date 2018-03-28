class Utils {
	static onFileChooser(event, onLoadFileHandler) {
		//Code from https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
		if (typeof window.FileReader !== 'function') {
			throw ("The file API isn't supported on this browser.");
		}
		let input = event.target;
		if (!input) {
			throw ("The browser does not properly implement the event object");
		}
		if (!input.files) {
			throw ("This browser does not support the 'files' property of the file input.");
		}
		if (!input.files[0]) {
			return undefined;
		}
		let file = input.files[0];
		let fileReader = new FileReader();
		fileReader.onload = onLoadFileHandler;
		fileReader.readAsText(file);
	}

	static reArrangeIndicesToRenderWithLines(indices) {
		let result = [];
		let count = indices.length;
		let index = 0;
		for (let i = 0; i < count; i = i + 3) {
			result.push(indices[i]);
			result.push(indices[i + 1]);
			result.push(indices[i + 1]);
			result.push(indices[i + 2]);
			result.push(indices[i + 2]);
			result.push(indices[i]);
		}
		return result;
	}
}
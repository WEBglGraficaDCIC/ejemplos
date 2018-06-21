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

	static hexToRgbInt(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		};
	}

	static hexToRgbFloat(hex) {
		let rgbInt = Utils.hexToRgbInt(hex);
		return {
			r: parseFloat(rgbInt.r) / 255.0,
			g: parseFloat(rgbInt.g) / 255.0,
			b: parseFloat(rgbInt.b) / 255.0,
		};
	}

	static hexToRgbFloatArray(hex) {
		let rgbFloat = Utils.hexToRgbFloat(hex);
		return [rgbFloat.r, rgbFloat.g, rgbFloat.b];
	}
}
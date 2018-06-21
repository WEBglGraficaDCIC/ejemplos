function onModelLoad(event) {
	let objFileContent = event.target.result;
	parsedOBJ = OBJParser.parseFile(objFileContent);
}

function onSliderPhi(slider, labelId) {
	let phi = parseFloat(slider.value);
	camera.setPhi(phi);
	writeValue(labelId, phi);
}

function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.setFovy(fovy);
	writeValue(labelId, fovy);
}

function onColorModel(picker, labelId) {
	modelColor1 = Utils.hexToRgbFloatArray(picker.value);
	writeValue(labelId, picker.value);
}

function onCheckboxSolid(checkbox) {
	isSolid = !isSolid;
}

function writeValue(labelId, value) {
	if (labelId) {
		document.getElementById(labelId).innerText = value;
	}
}

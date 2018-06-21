function onSliderRotation(slider, labelId) {
	angle = parseFloat(slider.value);
	writeValue(labelId, angle);
	onRender();
}

function onSliderScale(slider, labelId) {
	scale = parseFloat(slider.value);
	writeValue(labelId, scale);
	onRender();
}

function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.setFovy(fovy);
	writeValue(labelId, fovy);
	onRender();
}

function writeValue(labelId, value) {
	if (labelId) {
		document.getElementById(labelId).innerText = value;
	}
}
function onKeyDown(evt) {
	switch(evt.code) {
		case "KeyW":
			camera.moveForward();
			break;
		case "KeyS":
			camera.moveBackward();
			break;
		case "KeyA":
			camera.moveLeft();
			break;
		case "KeyD":
			camera.moveRight();
			break;
		case "KeyQ":
			camera.moveDown();
			break;
		case "KeyE":
			camera.moveUp();
			break;
		case "KeyJ":
			camera.yawLeft();
			break;
		case "KeyL":
			camera.yawRight();
			break;
		case "KeyI":
			camera.pitchUp();
			break;
		case "KeyK":
			camera.pitchDown();
			break;
		case "KeyU":
			camera.rollLeft();
			break;
		case "KeyO":
			camera.rollRight();
			break;
	}
	onRender();
}
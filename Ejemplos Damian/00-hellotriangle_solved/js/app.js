var gl = null;
//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)
var vaoExtension = null;

var shaderProgram  = null; //Shader program to use.
var vao = null; //Geometry to render (stored in VAO).
var indexCount = 0;

function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
	let vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

	let shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.validateProgram(shaderProgram);

	let success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
	if (!success) {
		let errorMsg = gl.getProgramInfoLog(shaderProgram);
		gl.deleteProgram(shaderProgram);
		throw 'Could not link program: ' + errorMsg;
	}
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	return shaderProgram;
}

function createShader(type, shaderSource) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		let name = 'UNKNOW';
		if (type == gl.VERTEX_SHADER) {
			name = 'VERTEX';
		} else if (type == gl.FRAGMENT_SHADER) {
			name = 'FRAGMENT';
		}
		let errorMsg = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw "Could not compile " + name + " shader: " + errorMsg;
	}
	return shader;
}

function createVBO(data) {
	let vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return vbo;
}

function createEBO(indices) {
	let ebo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	return ebo;
}

function createVAO(indices, positions, posLocation, colors, colLocation, colors2, colLocation2) {
	let vao = vaoExtension.createVertexArrayOES();
	let ebo = createEBO(indices);
	let vboPosition = createVBO(positions);
	let vboColor = createVBO(colors);
	let vboColor2 = createVBO(colors2);

	vaoExtension.bindVertexArrayOES(vao);
	//Configure EBO
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

	//Configure attribute Position.
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition);
	gl.enableVertexAttribArray(posLocation);
	gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

	//Configure attribute Color.
	gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
	gl.enableVertexAttribArray(colLocation);
	gl.vertexAttribPointer(colLocation, 3, gl.FLOAT, false, 0, 0);

	//Configure attribute Color2.
	gl.bindBuffer(gl.ARRAY_BUFFER, vboColor2);
	gl.enableVertexAttribArray(colLocation2);
	gl.vertexAttribPointer(colLocation2, 3, gl.FLOAT, false, 0, 0);

	vaoExtension.bindVertexArrayOES(null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return vao;
}

function getVertexShaderSource() {
return `
	uniform float percent;

	attribute vec3 vertexPos;
	attribute vec3 vertexCol;
	attribute vec3 vertexCol2;

	varying vec3 vColor;

	void main(void) {
		vColor = mix(vertexCol, vertexCol2, percent);
		gl_Position = vec4(vertexPos, 1.0);
	}
`;
}

function getFragmentShaderSource() {
return `
	precision mediump float;
	varying vec3 vColor;
	void main(void) {
		gl_FragColor = vec4(vColor, 1.0);
	}
`;
}

function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl');
	vaoExtension = gl.getExtension('OES_vertex_array_object');

	let vertexShaderSource = getVertexShaderSource();
	let fragmentShaderSource = getFragmentShaderSource();

	let positions = [
		-0.5, 0.5, 0,
		-0.5, -0.5, 0,
		0.5, -0.5, 0
	];
	let colors = [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	];
	let colors2 = [
		0, 1, 0,
		0, 0, 1,
		1, 0, 0
	];
	let indices = [0, 1, 2];
	indexCount = indices.length;

	shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);
	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	let colLocation = gl.getAttribLocation(shaderProgram, 'vertexCol');
	let colLocation2 = gl.getAttribLocation(shaderProgram, 'vertexCol2');
	percentLocation = gl.getUniformLocation(shaderProgram, 'percent');
	vao = createVAO(indices, positions, posLocation, colors, colLocation, colors2, colLocation2);

	gl.clearColor(0.18, 0.18, 0.18, 1.0);
onRender();
}

var percentLocation = null;
var percentValue = 0;

function onRender() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaderProgram);
	gl.uniform1f(percentLocation, percentValue);

	vaoExtension.bindVertexArrayOES(vao);
	gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

	vaoExtension.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function onSliderPercent(slider) {
	percentValue = parseFloat(slider.value) / 100;
	onRender();
}

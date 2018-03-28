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

function createVAO(indices, positions, posLocation /*other attributes*/) {
	let vao = vaoExtension.createVertexArrayOES();
	let ebo = createEBO(indices);
	let vboPosition = createVBO(positions);//VBO for attribute Position

	vaoExtension.bindVertexArrayOES(vao);
	//Configure EBO
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

	//Configure attribute Position.
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition);
	gl.enableVertexAttribArray(posLocation);
	gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

	//Configure Other attribute.



	vaoExtension.bindVertexArrayOES(null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return vao;
}

function getVertexShaderSource() {
return `
	attribute vec3 vertexPos;

	varying vec3 vColor;

	void main(void) {
		vColor = vec3(vertexPos.x + 1.0, vertexPos.y + 1.0, vertexPos.z + 1.0);
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

	let indices = [0, 1, 2,3];
	indexCount = indices.length;

	let positions = [
		-0.5, 0.5, 0,
		-0.5, -0.5, 0,
		0.5, -0.5, 0,
		0.1,0.5,0
	];

	shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);
	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	//Location of other attributes/uniforms

	vao = createVAO(indices, positions, posLocation);

	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	onRender();
}

function onRender() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaderProgram);

	vaoExtension.bindVertexArrayOES(vao);
	gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

	vaoExtension.bindVertexArrayOES(null);
	gl.useProgram(null);
}

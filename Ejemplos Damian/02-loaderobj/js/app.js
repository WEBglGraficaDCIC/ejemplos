var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

var shaderProgram  = null; //Shader program to use.
var vao = null; //Geometry to render (stored in VAO).
var indexCount = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;

//Uniform values.
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();

//Aux variables,
var angle = 0;
var scale = 1;
var parsedOBJ = null; //Parsed OBJ file

function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl');
	_gl = VAOHelper.getVaoExtension();

	let indices = parsedOBJ.indices;
	indexCount = indices.length;

	let positions = parsedOBJ.positions;
	let colors = parsedOBJ.positions;//Will use position coordinates as colors (as example)

	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	let colLocation = gl.getAttribLocation(shaderProgram, 'vertexCol');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	let vertexAttributeInfoArray = [
		new VertexAttributeInfo(positions, posLocation, 3),
		new VertexAttributeInfo(colors, colLocation, 3)
	];

	vao = VAOHelper.create(indices, vertexAttributeInfoArray);

	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Matrix de Vista y Proyeccion.
	let eye = [2, 2, 2];
	let target = [0, 0, 0];
	let up = [0, 1, 0];
	mat4.lookAt(viewMatrix, eye, target, up);

	let fovy = glMatrix.toRadian(50);
	let aspect = 1;
	let zNear = 0.1;
	let zFar = 10.0;
	mat4.perspective(projMatrix, fovy, aspect, zNear, zFar);

	gl.enable(gl.DEPTH_TEST);
}

function onRender() {
	let rotationMatrix = mat4.create();
	let scaleMatrix = mat4.create();
	mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle));
	mat4.fromScaling(scaleMatrix, [scale, scale, scale]);

	modelMatrix = mat4.create();
	mat4.multiply(modelMatrix, rotationMatrix, scaleMatrix);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaderProgram);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);

	_gl.bindVertexArrayOES(vao);
	gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function onSliderRotation(slider) {
	angle = parseFloat(slider.value);
	onRender();
}

function onSliderScale(slider) {
	let delta = parseFloat(slider.value) / 100.0;
	scale = 1 + delta;
	onRender();
}

function onModelLoad(event) {
	let objFileContent = event.target.result;
	parsedOBJ = OBJParser.parseFile(objFileContent);
}

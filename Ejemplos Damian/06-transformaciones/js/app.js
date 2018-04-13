// WebGL context and extensions
var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

//Shader program
var shaderProgram  = null; 

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Uniform values.
var modelColor = Utils.hexToRgbFloat("#FFFFFF");

//Models (OBJ)
var cubo;
var esfera;
var cilindro;
var cono;
var toroide;
var mono;
var ironman;

// Auxiliary objects
var axis;

// Camera
var camera;

// Flags
var isSolid = false;

function loadModels(pos_location) {
	// Load each model (OBJ) and generate the mesh
	mono = new Model(monoSource);
	mono.generateModel(pos_location);

	esfera = new Model(esferaSource);
	esfera.generateModel(pos_location);

	ironman = new Model(ironmanSource);
	ironman.generateModel(pos_location);

	cono = new Model(conoSource);
	cono.generateModel(pos_location);

}

function setModelsTransformations() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();

	// Set mono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [1.0, 0.0, 1.0]);
	mat4.multiply(matrix, translation, scaling);
	mono.setModelMatrix(matrix);

	// Set esfera model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-1.0, 0.0, 1.0]);
	mat4.multiply(matrix, translation, scaling);
	esfera.setModelMatrix(matrix);

	// Set ironman model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [1.0, 0.0, -1.0]);
	mat4.multiply(matrix, translation, scaling);
	ironman.setModelMatrix(matrix);

	// Set cono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-1.0, 0.0, -1.0]);
	mat4.multiply(matrix, translation, scaling);
	cono.setModelMatrix(matrix);
}

function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl');
	_gl = VAOHelper.getVaoExtension();

	//SHADERS
	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	u_modelColor = gl.getUniformLocation(shaderProgram, 'modelColor');

	// Load all the models
	loadModels(posLocation);
	
	// Set the models' transformations
	setModelsTransformations();

	// Set some WebGL properties
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create auxiliary models
	axis = new Axis();
	axis.load();
	
	// Create the camera using canvas dimension
	camera = new SphericalCamera(55, 800/600);
}

function onRender() {
	let modelMatrix = mat4.create(); 
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	// Set some WebGL properties
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Draw auxiliary models
	axis.render(projMatrix, viewMatrix);

	// Set shader and uniforms
	gl.useProgram(shaderProgram);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
	let _modelColor = vec3.fromValues(modelColor.r, modelColor.g, modelColor.b);
	gl.uniform3fv(u_modelColor, _modelColor);

	// Draw models
	mono.draw(isSolid, gl, _gl);
	esfera.draw(isSolid, gl, _gl);
	ironman.draw(isSolid, gl, _gl);
	cono.draw(isSolid, gl, _gl);

	// Clean
	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

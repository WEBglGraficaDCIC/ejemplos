var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

var shaderProgram  = null; //Shader program to use.
var vaoSolid = null; //Geometry to render (stored in VAO).
var vaoWire = null;
var isSolid = false;
var indexCountSolid = 0;
var indexCountWire = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Uniform values.
var modelColor1 = Utils.hexToRgbFloatArray("#FFFFFF");
var modelColor2 = Utils.hexToRgbFloatArray("#FFFF00");
//Modelling matrices.
var modelMatrix1 = mat4.create();
var modelMatrix2 = mat4.create();

var axis;//Objeto auxiliar "Ejes"
var camera;

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

	let parsedOBJ = OBJParser.parseFile(objFileContent);
	delete(objFileContent);

	//BUFFERS
	let indicesSolid = parsedOBJ.indices;
	let indicesWire = Utils.reArrangeIndicesToRenderWithLines(parsedOBJ.indices);
	indexCountSolid = indicesSolid.length;
	indexCountWire = indicesWire.length;
	let positions = parsedOBJ.positions;

	let vertexAttributeInfoArray = [
		new VertexAttributeInfo(positions, posLocation, 3)
	];
	vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);
	vaoWire = VAOHelper.create(indicesWire, vertexAttributeInfoArray);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new SphericalCamera(55, 800/600);//use canvas dimensions

	onLoadPhysics();
	requestAnimationFrame(onUpdate);
}

//Animation variables
var lastTimeInMillis = 0;
var thetaSpeed = 15; //Degrees per second.

function onUpdate(currentTimeInMillis) {
	let elapsedMillis = currentTimeInMillis - lastTimeInMillis;
	let elapsedSeconds = elapsedMillis / 1000;
	let currentTimeInSeconds = currentTimeInMillis / 1000;

	//Camera animation.
	let deltaRadius = Math.sin(currentTimeInSeconds);
	camera.setRadius(2.5 + deltaRadius);
	camera.setTheta(45 + currentTimeInSeconds * thetaSpeed);

	updatePhysics();

	//Update label, save lastTime and render!
	writeValue('lblTime', parseInt(currentTimeInMillis));
	lastTimeInMillis = currentTimeInMillis;
	onRender();

	requestAnimationFrame(onUpdate);
}

function onRender() {
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(projMatrix, viewMatrix);

	gl.useProgram(shaderProgram);

	// MODEL1
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix1);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
	gl.uniform3fv(u_modelColor, modelColor1);

	if (isSolid) {
		_gl.bindVertexArrayOES(vaoSolid);
		gl.drawElements(gl.TRIANGLES, indexCountSolid, gl.UNSIGNED_INT, 0);
	} else {
		_gl.bindVertexArrayOES(vaoWire);
		gl.drawElements(gl.LINES, indexCountWire, gl.UNSIGNED_INT, 0);
	}

	// MODEL2 (ONLY SET UNIFORMS THAT WE WANT TO CHANGE)
	gl.uniform3fv(u_modelColor, modelColor2);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix2);
	_gl.bindVertexArrayOES(vaoWire);
	gl.drawElements(gl.LINES, indexCountWire, gl.UNSIGNED_INT, 0);


	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

// -----------------------
// Physics
// -----------------------
var world;
var sphereBody1, sphereBody2;
var worldTimeStep = 1.0 / 60.0; // 60hz
var modelPosition = vec3.create();//holds a position
var modelOrientation = quat.create();

function onLoadPhysics() {
	world = new CANNON.World();
	world.gravity.set(0, 0, -9.82);
	world.broadphase = new CANNON.NaiveBroadphase();

	//Some materials
	let groundMaterial=new CANNON.Material();
	let mat1 = new CANNON.Material();
	let mat2= new CANNON.Material();
	let mat1_ground = new CANNON.ContactMaterial(groundMaterial, mat1, { friction: 0.0, restitution: 0.0 });
	let mat2_ground = new CANNON.ContactMaterial(groundMaterial, mat2, { friction: 0.0, restitution: 0.4});

	//Create sphere1
	let sphereShape = new CANNON.Sphere(0.25); //Radius
	sphereBody1 = new CANNON.Body({
		mass: 1, //Kg
		shape: sphereShape,
		material: mat1
	});
	sphereBody1.position.set(0, 0, 1.25);

	sphereBody2 = new CANNON.Body({
		mass: 1.3,
		shape: sphereShape,
		material: mat2
	});
	sphereBody2.position.set(0.1, 0.1, 2);

	//Plane, Static
	let planeBody = new CANNON.Body({
		mass: 0,
		shape: new CANNON.Plane(), //defaults to Z plane
		material: groundMaterial
	});

	world.add(planeBody);
	world.add(sphereBody1);
	world.add(sphereBody2);
	world.addContactMaterial(mat1_ground);
	world.addContactMaterial(mat2_ground);
}

function updatePhysics() {
	world.step(worldTimeStep); //Advance physics simulation

	//Update modelMatrices with position.
	let spherePos = sphereBody1.position;
	let sphereQuat = sphereBody1.quaternion;
	//vec3.set(modelPosition, spherePos.x, spherePos.y, spherePos.z);
	vec3.set(modelPosition, spherePos.x, spherePos.z, spherePos.y);
	quat.set(modelOrientation, sphereQuat.x, sphereQuat.y, sphereQuat.z, sphereQuat.w);
	mat4.fromRotationTranslation(modelMatrix1, modelOrientation, modelPosition);

	spherePos = sphereBody2.position;
	sphereQuat = sphereBody2.quaternion;
	//vec3.set(modelPosition, spherePos.x, spherePos.y, spherePos.z);
	vec3.set(modelPosition, spherePos.x, spherePos.z, spherePos.y);
	quat.set(modelOrientation, sphereQuat.x, sphereQuat.y, sphereQuat.z, sphereQuat.w);
	mat4.fromRotationTranslation(modelMatrix2, modelOrientation, modelPosition);
}
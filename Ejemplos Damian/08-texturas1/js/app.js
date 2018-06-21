var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

var shaderProgram  = null; //Shader program to use.
var vaoSolid = null; //Geometry to render (stored in VAO).
var indexCountSolid = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_texSampler;
//Modelling matrices.
var modelMatrix = mat4.create();

//Aux variables,
var angle = 0;
var scale = 1;

var axis;//Objeto auxiliar "Ejes"
var camera;

var texture;

function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl');
	_gl = VAOHelper.getVaoExtension();

	//SHADERS
	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	let texLocation = gl.getAttribLocation(shaderProgram, 'vertexTex');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	u_texSampler = gl.getUniformLocation(shaderProgram, 'textureSampler');

	let parsedOBJ = OBJParser.parseFile(objFileContent);
	delete(objFileContent);

	//BUFFERS
	let indicesSolid = parsedOBJ.indices;
	indexCountSolid = indicesSolid.length;

	let vertexAttributeInfoArray = [
		new VertexAttributeInfo(parsedOBJ.positions, posLocation, 3),
		new VertexAttributeInfo(parsedOBJ.textures, texLocation, 2)
	];
	vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new FreeCamera(55, 800/600);//use canvas dimensions

	//TEXTURE STUFF
	let textureImage = document.getElementById("textureImg");
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
	// WebGL1 has different requirements for power of 2 images vs non power of 2 images so check if the image is a
	// power of 2 in both dimensions.
	if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
		// Yes, it's a power of 2. Generate mips.
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		// No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
	onRender();
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function onRender() {
	updateModelMatrix();
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(projMatrix, viewMatrix);

	gl.useProgram(shaderProgram);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(u_texSampler, 0);

	_gl.bindVertexArrayOES(vaoSolid);
	gl.drawElements(gl.TRIANGLES, indexCountSolid, gl.UNSIGNED_INT, 0);

	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function updateModelMatrix() {
	let auxScale = scale / 10; //Dino model is Huge. Adding extra Scaling.
	let rotationMatrix = mat4.create();
	let scaleMatrix = mat4.create();
	mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle));
	mat4.fromScaling(scaleMatrix, [auxScale, auxScale, auxScale]);

	mat4.multiply(modelMatrix, rotationMatrix, scaleMatrix);
}

/*============= creamos el canvas ======================*/
var canvas = document.getElementById('mycanvas');
gl = canvas.getContext('experimental-webgl');
const DEG2RAD =Math.PI/180.0; 
const deltaTheta = 10;
const deltaPhi = 10;
const distance = 0.1;
/*========== Defining and storing the geometry ==========*/

var vertices = [
0.5, 0.5, -0.5,
0.5, -0.5, -0.5,
-0.5, -0.5, -0.5,
-0.5, 0.5, -0.5,
0.5, 0.5, 0.5,
0.5, -0.5, 0.5,
-0.5, -0.5, 0.5,
-0.5, 0.5, 0.5
];

// var colors = [
//    5,3,7,
//    5,3,7,
//    5,3,7,
//    5,3,7,

//    1,1,3,
//    1,1,3,
//    1,1,3,
//    1,1,3,

//    0,0,1,
//    0,0,1, 
//    0,0,1, 
//    0,0,1,
//    1,0,0, 
//    1,0,0, 
//    1,0,0, 
//    1,0,0,
//    1,1,0,
//    1,1,0, 
//    1,1,0,
//    1,1,0,
//    0,1,0,
//    0,1,0, 
//    0,1,0, 
//    0,1,0 
// ];

var indices = [
    0, 1, 2, 
    0, 2, 3,
    4, 5, 1,
    4, 1, 0,
    7, 6, 5,
    7, 5, 4,
    3, 2, 6,
    3, 6, 7,
    3, 7, 4,
    3, 4, 0,
    1, 5, 6,
    1, 6, 2
];
/////////////////////////////// BUFFERS //////////////////////////////////////

// Create and store data into vertex buffer
var vertex_buffer = gl.createBuffer ();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Create and store data into color buffer
// var color_buffer = gl.createBuffer ();
// gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

// Create and store data into index buffer
var index_buffer = gl.createBuffer ();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                                     
/*=================== SHADERS =================== */

var vertCode = 
   `attribute vec3 position;
   uniform mat4 Pmatrix;
   uniform mat4 Vmatrix;
   uniform mat4 Mmatrix;
   // 'attribute vec3 color;'+//the color of the point
    varying vec3 vColor;
   void main(void) { //pre-built function
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      vColor = position;
   }`;

var fragCode = 
   `precision mediump float;
   varying vec3 vColor;
   void main(void) {
      vec3 a=vec3(vColor.x+0.5,vColor.y+0.5,vColor.z+0.5);
      gl_FragColor = vec4(a, 1.0);
   }`;

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderprogram = gl.createProgram();
gl.attachShader(shaderprogram, vertShader);
gl.attachShader(shaderprogram, fragShader);
gl.linkProgram(shaderprogram);

/*======== Associating attributes to vertex shader =====*/
var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var _position = gl.getAttribLocation(shaderprogram, "position");
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
gl.enableVertexAttribArray(_position);

// gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
// var _color = gl.getAttribLocation(shaderprogram, "color");
// gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
// gl.enableVertexAttribArray(_color);
gl.useProgram(shaderprogram);

/*==================== MATRIX ====================== */

//////////////////////matriz de modelado ////////////////////////////////

const mo_matrix = mat4.create();
getModelMatrix();

function getModelMatrix(){
  mat4.identity(mo_matrix);
  const v = vec3.fromValues(0.5, 0.5, 0.5);
  mat4.scale(mo_matrix, mo_matrix, v);
}
//////////////////////matriz de vista //////////////////////////////
//Posicion inicial de la camara.
   var radius = 1.2;
   var theta = -45.0;
   var phi = 45.0;
   
  const eye = vec3.fromValues(0, 0, 0);
  const target = vec3.fromValues(0, 0, 0);
  const up = vec3.fromValues(0, 1.0, 0);  //vector unitario en y
  const view_matrix = mat4.create();

  getViewMatrix();

function toCartesian(){
  var Y = (radius * Math.cos( phi* DEG2RAD));
  var X = (radius * Math.sin( phi* DEG2RAD) * Math.cos(theta * DEG2RAD));
  var Z = (radius * Math.sin( phi* DEG2RAD) * Math.sin(theta * DEG2RAD));
  const position = vec3.fromValues(X, Y, Z);
  return position;
  }
function getViewMatrix(){   
  //Pasamos de sistema esferico, a sistema cartesiano
  var ojo = toCartesian();
  vec3.copy(eye,ojo);
  //modificamos la matriz de vista.
  mat4.lookAt(view_matrix,eye,target,up);
}
//////////////////////matriz de proyeccion //////////////////////////////
  const proj_matrix = mat4.create();
  getProjectionMatrix();
function getProjectionMatrix(){
  const fieldOfView = 50 * DEG2RAD;   // in radians
  const aspect = 1;
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective(proj_matrix,fieldOfView,aspect,zNear,zFar);
}


///////////////////////////////eventos teclado ///////////////////////////
document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  switch (event.key) {
    case "ArrowDown":
      phi = phi + deltaPhi;
      if (phi > 170)
      {
          phi = 170;
      }
      console.log(phi);
      dibujarEscena();
      break;
    case "ArrowUp":
      phi = phi - deltaPhi;
      if (phi > 170)
      {
          phi = 170;
      }
      dibujarEscena();
      break;
    case "ArrowLeft":
      theta = theta + deltaTheta;
      dibujarEscena();
      break;
    case "ArrowRight":
      theta = theta - deltaTheta;
      dibujarEscena();
      break;
    case "+":
      if ((distance > 0) && (radius-distance > 0)){
        radius = radius - distance;
      }
      dibujarEscena();
      break;
    case "-":
      if ((distance > 0) ){
        radius = radius + distance;
      }
      dibujarEscena();
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

////////////////////////////// Dibujado //////////////////////////////////////
dibujarEscena();

function dibujarEscena(){
   gl.enable(gl.DEPTH_TEST);
   // gl.depthFunc(gl.LEQUAL);
   gl.clearColor(0, 0, 0, 0.9); //color fondo
   gl.clearDepth(1.0);
   gl.viewport(0.0, 0.0, canvas.width, canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


   getModelMatrix();
   getViewMatrix();//genera la matrix de vista modificando view_matrix
   getProjectionMatrix();
   // const vectorEscalado=vec3.fromValues(0.1,0.1,0.1);
   // mat4.scale (mo_matrix,mo_matrix,vectorEscalado);
   gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
   gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
   gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
   //gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
   gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}


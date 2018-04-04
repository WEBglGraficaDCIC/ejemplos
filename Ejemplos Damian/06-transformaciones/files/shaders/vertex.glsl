// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderSource = `

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

attribute vec3 vertexPos;

void main(void) {
	gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1.0);
}
`
// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderSource = `

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

attribute vec3 vertexPos;
attribute vec2 vertexTex;

varying vec2 fragTexCoord;

void main(void) {
	gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1.0);
	fragTexCoord = vertexTex;
}
`
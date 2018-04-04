// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource = `

precision mediump float;
uniform vec3 modelColor;

void main(void) {
	gl_FragColor = vec4(modelColor, 1.0);
}
`
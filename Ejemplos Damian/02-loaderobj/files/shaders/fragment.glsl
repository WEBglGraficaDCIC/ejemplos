// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource = `

precision mediump float;

varying vec3 vColor;

void main(void) {
	gl_FragColor = vec4(vColor, 1.0);
}
`
// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource = `

precision mediump float;
uniform sampler2D textureSampler;

varying vec2 fragTexCoord;

void main(void) {
	gl_FragColor = texture2D(textureSampler, fragTexCoord);
}
`
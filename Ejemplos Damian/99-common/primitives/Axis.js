class Axis {

	_vertexShaderSource() {
		return `
		uniform mat4 projMatrix;
		uniform mat4 viewMatrix;
		attribute vec3 position;
		attribute vec3 color;
		varying vec3 vColor;
		void main(void) {
			vColor = color;
			gl_Position = projMatrix * viewMatrix * vec4(position, 1.0);
		}
		`;
	}

	_fragmentShaderSource() {
		return `
		precision mediump float;

		varying vec3 vColor;
		void main(void) {
			gl_FragColor = vec4(vColor, 1.0);
		}
		`;
	}

	load() {
		let positions = [
			0, 0, 0, 1, 0, 0, //+x
			0, 0, 0, 0, 1, 0, //-x
			0, 0, 0, 0, 0, 1, //+y
			0, 0, 0, -1, 0, 0, //-y
			0, 0, 0, 0, -1, 0, //+z
			0, 0, 0, 0, 0, -1 //-z
		];
		let negI = 0.3;
		let colors = [
			1, 0, 0, 1, 0, 0,
			0, 1, 0, 0, 1, 0,
			0, 0, 1, 0, 0, 1,
			negI, 0, 0, negI, 0, 0,
			0, negI, 0, 0, negI, 0,
			0, 0, negI, 0, 0, negI
		];
		let auxSlots = 4;
		let step = -1;
		for (let i = 0; i <= 2 * auxSlots; i++) {
			if (i != auxSlots) {
				positions.push(-1);
				positions.push(0);
				positions.push(step);

				positions.push(1);
				positions.push(0);
				positions.push(step);

				positions.push(step);
				positions.push(0);
				positions.push(-1);

				positions.push(step);
				positions.push(0);
				positions.push(1);
			}
			step = step + (1.0 / auxSlots);
		}
		for (let i = colors.length; i < positions.length; i++) {
			colors.push(0.5);
		}
		let indices = [];
		this._indexCount = positions.length / 3;
		for (let i = 0; i < this._indexCount; i++) {
			indices.push(i);
		}

		this._shaderProgram = ShaderProgramHelper.create(
			this._vertexShaderSource(),
			this._fragmentShaderSource()
		);
		let posLocation = gl.getAttribLocation(this._shaderProgram, 'position');
		let colLocation = gl.getAttribLocation(this._shaderProgram, 'color');
		this._u_projMatrix = gl.getUniformLocation(this._shaderProgram, 'projMatrix');
		this._u_viewMatrix = gl.getUniformLocation(this._shaderProgram, 'viewMatrix');
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, posLocation, 3),
			new VertexAttributeInfo(colors, colLocation, 3)
		];

		this._vao = VAOHelper.create(indices, vertexAttributeInfoArray);
	}

	render(projMatrix, viewMatrix) {
		gl.useProgram(this._shaderProgram);
		gl.uniformMatrix4fv(this._u_projMatrix, false, projMatrix);
		gl.uniformMatrix4fv(this._u_viewMatrix, false, viewMatrix);

		_gl.bindVertexArrayOES(this._vao);
		gl.drawElements(gl.LINES, this._indexCount, gl.UNSIGNED_INT, 0);
		_gl.bindVertexArrayOES(null);

		gl.useProgram(null);
	}
}
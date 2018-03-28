class VAOHelper {

	static getVaoExtension() {
		return gl.getExtension('OES_vertex_array_object');
	}

	static create(indices, vertexAttributeInfoArray) {
		let _gl = VAOHelper.getVaoExtension();
		let vao = _gl.createVertexArrayOES();
		let ebo = VAOHelper._createEBO(indices);

		//Create all VBOs
		let vboArray = [];
		let count = vertexAttributeInfoArray.length;
		for (let i = 0; i < count; i++) {
			let currentVBO = VAOHelper._createVBO(vertexAttributeInfoArray[i].data);
			vboArray.push(currentVBO);
		}

		_gl.bindVertexArrayOES(vao);
		//Configure EBO
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

		//Configure all attributes.
		for (let i = 0; i < count; i++) {
			let attrLocation = vertexAttributeInfoArray[i].location;
			let attrSize = vertexAttributeInfoArray[i].size;
			gl.bindBuffer(gl.ARRAY_BUFFER, vboArray[i]);
			gl.enableVertexAttribArray(attrLocation);
			gl.vertexAttribPointer(attrLocation, attrSize, gl.FLOAT, false, 0, 0);
		}

		_gl.bindVertexArrayOES(null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		return vao;
	}

	static _createVBO(data) {
		let vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}

	static _createEBO(indices) {
		let ebo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		return ebo;
	}
}
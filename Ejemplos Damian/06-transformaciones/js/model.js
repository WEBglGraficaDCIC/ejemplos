class Model {
	constructor(objectSource) {
		this.source = objectSource;
		this.vaoSolid = null; //Geometry to render (stored in VAO).
        this.vaoWire = null;
		this.indexCountSolid = 0;
        this.indexCountWire = 0;
        this.modelMatrix = mat4.create(); // Indentity matrix
	}

	generateModel(pos_location) {
		let parsedOBJ = OBJParser.parseFile(this.source);
		let indicesSolid = parsedOBJ.indices;
		let indicesWire = Utils.reArrangeIndicesToRenderWithLines(parsedOBJ.indices);
		this.indexCountSolid = indicesSolid.length;
		this.indexCountWire = indicesWire.length;
		let positions = parsedOBJ.positions;

		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, this.pos_location, 3)
		];
	
		this.vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);
		this.vaoWire = VAOHelper.create(indicesWire, vertexAttributeInfoArray);
	
		//Ya tengo los buffers cargados en memoria de la placa grafica, puedo borrarlo de JS
		parsedOBJ = null;
	}

	setModelMatrix(matrix) {
		this.modelMatrix = matrix;
	}

	draw(solid, gl, _gl) {
		// Set the model matrix of the object
		gl.uniformMatrix4fv(u_modelMatrix, false, this.modelMatrix);

		// Draw object
		if (solid) {
			_gl.bindVertexArrayOES(this.vaoSolid);
			gl.drawElements(gl.TRIANGLES, this.indexCountSolid, gl.UNSIGNED_INT, 0);	
		} else {
			_gl.bindVertexArrayOES(this.vaoWire);
			gl.drawElements(gl.LINES, this.indexCountWire, gl.UNSIGNED_INT, 0);
		}
		
	}

}
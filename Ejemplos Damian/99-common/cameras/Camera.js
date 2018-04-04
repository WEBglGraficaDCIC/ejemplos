class Camera {
	constructor(fovy, aspect) {
		this.fovy = fovy;
		this.aspect = aspect;
		this.zNear = 0.001;
		this.zFar = 100;

		this.projMatrix = mat4.create();
		this.viewMatrix = mat4.create();
	}

	getProjMatrix() {
		let fovyRadian = glMatrix.toRadian(this.fovy);

		mat4.perspective(this.projMatrix, fovyRadian, this.aspect, this.zNear, this.zFar);
		return this.projMatrix;
	}

	setFovy(fovy) {
		this.fovy = fovy;
	}

	setAspect(aspect) {
		this.aspect = aspect;
	}

	getViewMatrix() {
		throw "getViewMatrix: Must be implemented by subclasses!"
	}
}
class FreeCamera extends Camera {

	constructor(fovy, aspect) {
		super(fovy, aspect);
		//Position of camera.
		this.position = vec3.fromValues(2, 0.5, 0);
		//Unit vector. Forward direction
		this.forward = vec3.fromValues(-1, 0, 0);
		//Unit vector. Right direction.
		this.right = vec3.fromValues(0, 0, -1);
		//Number. Delta for position movement.
		this.deltaPos = 0.1;
		//Number. Delta for rotations.
		this.deltaRot = glMatrix.toRadian(5);
	}

	getViewMatrix() {
		let eye = this.position;
		let up = this._up();
		let target = vec3.create();
		vec3.add(target, eye, this.forward);

		mat4.lookAt(this.viewMatrix, eye, target, up);
		return this.viewMatrix;
	}

	_deltaVec(unitDirection) {
		let deltaVec = vec3.create();
		vec3.scale(deltaVec, unitDirection, this.deltaPos);
		return deltaVec;
	}

	_up() {
		let up = vec3.create();
		vec3.cross(up, this.right, this.forward);
		return vec3.normalize(up, up);
	}

	moveForward() {
		let deltaVec = this._deltaVec(this.forward);
		vec3.add(this.position, this.position, deltaVec);
	}

	moveBackward() {
		let deltaVec = this._deltaVec(this.forward);
		vec3.sub(this.position, this.position, deltaVec);
	}

	moveLeft() {
		let deltaVec = this._deltaVec(this.right);
		vec3.sub(this.position, this.position, deltaVec);
	}

	moveRight() {
		let deltaVec = this._deltaVec(this.right);
		vec3.add(this.position, this.position, deltaVec);
	}
	moveUp() {
		let up = this._up();
		let deltaVec = this._deltaVec(up);
		vec3.add(this.position, this.position, deltaVec);
	}

	moveDown() {
		let up = this._up();
		let deltaVec = this._deltaVec(up);
		vec3.sub(this.position, this.position, deltaVec);
	}

	yawLeft() {
		this._yaw(this.deltaRot);
	}

	yawRight() {
		this._yaw(-1 * this.deltaRot);
	}

	pitchUp() {
		this._pitch(this.deltaRot);
	}

	pitchDown() {
		this._pitch(-1 * this.deltaRot);
	}

	rollLeft() {
		this._roll(-1 * this.deltaRot);
	}

	rollRight() {
		this._roll(this.deltaRot);
	}

	_yaw(angle) {
		let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this._up());

		vec3.transformMat4(this.forward, this.forward, rotationMatrix);
		vec3.transformMat4(this.right, this.right, rotationMatrix);
		vec3.normalize(this.forward, this.forward);
		vec3.normalize(this.right, this.right);
	}


	_pitch(angle) {
		let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this.right);

		vec3.transformMat4(this.forward, this.forward, rotationMatrix);
		vec3.normalize(this.forward, this.forward);
	}

	_roll(angle) {
		let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, this.forward);

		vec3.transformMat4(this.right, this.right, rotationMatrix);
		vec3.normalize(this.right, this.right);
	}
}
/**
 * Heavily referenced, borderline copied, Ssatguru's BabylonJS-CharacterController https://github.com/ssatguru/BabylonJS-CharacterController
 * It's great :v you should check it out.
 */
class CharacterController extends EntityController {
    constructor(_id, _mesh, _entity) {
        super (_id, _mesh, _entity);

        // Mesh, attached to the 'FOCUS' bone, which will be the focus of the camera
        this.focus = undefined;
        this.root = undefined;
        // What EntityController this CharacterController is targeting
        this.targetController = null;
        // The CharacterControllers targeting this CharacterController
        this.targetedByControllers = new Set();
        // Ray which does the targeting
        this.targetRay = undefined;
        this.targetRayHelper = undefined;

        // Hard values calculated using the distance between the front heel and rear toe during the furthest stride in 24-frames per second, multiplied by the character's height. (then thrown out the window 'cause they were too damn slow)
        this.gravity = -Game.scene.gravity.y;
        this.minSlopeLimit = 30;
        this.maxSlopeLimit = 50;
        this.minSlopeLimitRads = BABYLON.Tools.ToRadians(this.minSlopeLimit);
        this.maxSlopeLimitRads = BABYLON.Tools.ToRadians(this.maxSlopeLimit);
        this._stepOffset = 0.25;
        this._vMoveTot = 0;
        this._vMovStartPos = BABYLON.Vector3.Zero();
        this.walkSpeed = 0.68 * this.mesh.scaling.z;
        this.runSpeed = this.walkSpeed * 5;
        this.sprintSpeed = this.walkSpeed * 2;
        this.backSpeed = this.walkSpeed * 0.5;
        this.jumpSpeed = this.mesh.scaling.y * 4;

        this.moveVector = new BABYLON.Vector3();
        this.avStartPos = BABYLON.Vector3.Zero();
        this.grounded = false;
        this.freeFallDist = 0;
        this.fallFrameCountMin = 50;
        this.fallFrameCount = 0;
        this.inFreeFall = false;
        this.wasWalking = false;
        this.wasRunning = false;
        this.wasSprinting = false;
        this.jumpStartPosY = 0;
        this.jumpTime = 0;
        this.movFallTime = 0;
        this.idleFallTime = 0;
        this.groundFrameCount = 0;
        this.groundFrameMax = 10;

        this.walk = new AnimData("walk");
        this.walkBack = new AnimData("walkBack");
        this.idle = new AnimData("idle");
        this.idleJump = new AnimData("idleJump");
        this.fall = new AnimData("fall");
        this.run = new AnimData("run");
        this.runJump = new AnimData("runJump");
        this.turnLeft = new AnimData("turnLeft");
        this.turnRight = new AnimData("turnRight");
        this.strafeLeft = new AnimData("strafeLeft");
        this.strafeRight = new AnimData("strafeRight");
        this.slideBack = new AnimData("slideBack");
        this.punch = new AnimData("punch");
        this.animations = this.animations.concat([this.walk, this.walkBack, this.idleJump, this.run, this.runJump, this.fall, this.turnLeft, this.turnRight, this.strafeLeft, this.strafeRight, this.slideBack]);

        this.punch.standalone = false;

        this.setWalkAnim("93_walkingKneesBent", 1.2, true);
        this.setRunAnim("94_runningKneesBent", 2, true);
        this.setWalkBackAnim("93_walkingBackwardKneesBent", 1, true);
        this.setIdleAnim("90_idle01", 1, true);
        this.setTurnLeftAnim("93_walkingKneesBent", 1, true);
        this.setTurnRightAnim("93_walkingKneesBent", 1, true);
        this.setIdleJumpAnim("95_jump", 1, false);
        this.setRunJumpAnim("95_jump", 1, false);
        this.setPunchAnim("71_punch01", 1, false);

        if (this.skeleton instanceof BABYLON.Skeleton) {
            this.checkAnims(this.skeleton);
            this._isAnimated = true;
        }
        else {
            this._isAnimated = false;
        }

        this.key = new ControllerMovementKey();
        this.prevKey = this.key.clone();
        var _this = this;
        this.renderer = function () { _this.moveAV(); };

        this._isEnabled = true;
        this._isLocked = false;
        this._isAnimated = true;

        this._showHelmet = true;

        /**
         * Map of bone IDs and the mesh attached to them.
         * @type {String, {String, BABYLON.Mesh}}
         */
        this._meshesAttachedToBones = {};
        /**
         * Map of mesh IDs and the bones they're attached to.
         * @type {String, {String, BABYLON.Bone}}
         */
        this._bonesAttachedToMeshes = {};

        Game.setCharacterController(this.id, this);
    }

    setSlopeLimit(minSlopeLimit, maxSlopeLimit) {
        this.minSlopeLimit = minSlopeLimit;
        this.maxSlopeLimit = maxSlopeLimit;
        this.minSlopeLimitRads = Math.PI * minSlopeLimit / 180;
        this.maxSlopeLimitRads = Math.PI * this.maxSlopeLimit / 180;
    }
    setStepOffset(stepOffset) {
        this._stepOffset = stepOffset;
    }
    setWalkSpeed(_n) {
        this.walkSpeed = _n;
    }
    setRunSpeed(_n) {
        this.runSpeed = _n;
    }
    setBackSpeed(_n) {
        this.backSpeed = _n;
    }
    setJumpSpeed(_n) {
        this.jumpSpeed = _n;
    }
    setGravity(_n) {
        this.gravity = _n;
    }
    setWalkAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.walk, _rangeName, _rate, _loop);
    }
    setRunAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.run, _rangeName, _rate, _loop);
    }
    setWalkBackAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.walkBack, _rangeName, _rate, _loop);
    }
    setSlideBackAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.slideBack, _rangeName, _rate, _loop);
    }
    setIdleAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.idle, _rangeName, _rate, _loop);
    }
    setIdleJumpAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.idleJump, _rangeName, _rate, _loop);
    }
    setTurnRightAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.turnRight, _rangeName, _rate, _loop);
    }
    setTurnLeftAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.turnLeft, _rangeName, _rate, _loop);
    }
    setStrafeRightAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.strafeRight, _rangeName, _rate, _loop);
    }
    setSrafeLeftAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.strafeLeft, _rangeName, _rate, _loop);
    }
    setRunJumpAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.runJump, _rangeName, _rate, _loop);
    }
    setFallAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.fall, _rangeName, _rate, _loop);
    }
    setPunchAnim(_rangeName, _rate, _loop) {
        this.setAnim(this.punch, _rangeName, _rate, _loop);
    }
    start() {
        if (this.started)
            return;
        this.started = true;
        this.key.reset();
        this.movFallTime = 0;
        this.idleFallTime = 0.001;
        this.grounded = false;
    }
    moveAV() {
        if (!(this.mesh instanceof BABYLON.Mesh)) {
            return this;
        }
        if (this._isLocked) {
            return this;
        }
        if (this.getParent() != undefined) {
            this.removeParent();
        }
        this.avStartPos.copyFrom(this.mesh.position);
        var anim = null;
        var dt = Game.engine.getDeltaTime() / 1000;
        if (this.key.jump && !this.inFreeFall) {
            this.grounded = false;
            this.idleFallTime = 0;
            anim = this.doJump(dt);
        }
        else if (this.anyMovement() || this.inFreeFall) {
            this.grounded = false;
            this.idleFallTime = 0;
            anim = this.doMove(dt);
        }
        else if (!this.inFreeFall) {
            anim = this.doIdle(dt);
        }
        this.beginAnimation(anim);
        if (Game.player == this.entity) {
            Game.updateCameraTarget();
        }
        return this;
    }
    doJump(dt) {
        var anim = null;
        anim = this.runJump;
        if (this.jumpTime === 0) {
            this.jumpStartPosY = this.mesh.position.y;
        }
        var js = this.jumpSpeed - this.gravity * this.jumpTime;
        var jumpDist = js * dt - 0.5 * this.gravity * dt * dt;
        this.jumpTime = this.jumpTime + dt;
        var forwardDist = 0;
        var disp;
        if (this == Game.player.getController() && Game.enableCameraAvatarRotation) {
            this.mesh.rotation.y = -4.69 - Game.camera.alpha;
        }
        if (this.wasSprinting || this.wasRunning || this.wasWalking) {
            if (this.wasRunning) {
                forwardDist = this.runSpeed * dt;
            }
            else if (this.wasWalking) {
                forwardDist = this.walkSpeed * dt;
            }
            else if (this.wasSprinting) {
                forwardDist = this.sprintSpeed * dt;
            }
            disp = this.moveVector.clone();
            disp.y = 0;
            disp = disp.normalize();
            disp.scaleToRef(forwardDist, disp);
            disp.y = jumpDist;
        }
        else {
            disp = new BABYLON.Vector3(0, jumpDist, 0);
            anim = this.idleJump;
        }
        this.mesh.moveWithCollisions(disp);
        if (jumpDist < 0) {
            if ((this.mesh.position.y > this.avStartPos.y) || ((this.mesh.position.y === this.avStartPos.y) && (disp.length() > 0.001))) {
                this.endJump();
            }
            else if (this.mesh.position.y < this.jumpStartPosY) {
                var actDisp = this.mesh.position.subtract(this.avStartPos);
                if (!(Game.areVectorsEqual(actDisp, disp, 0.001))) {
                    if (Game.verticalSlope(actDisp) <= this.minSlopeLimitRads) {
                        this.endJump();
                    }
                }
            }
        }
        return anim;
    }
    endJump() {
        this.key.jump = false;
        this.jumpTime = 0;
        this.wasWalking = false;
        this.wasRunning = false;
        this.wasSprinting = false;
    }
    doMove(dt) {
        var u = this.movFallTime * this.gravity;
        this.freeFallDist = u * dt + this.gravity * dt * dt / 2;
        this.movFallTime = this.movFallTime + dt;
        var moving = false;
        var anim = null;
        if (this.inFreeFall) {
            this.moveVector.y = -this.freeFallDist;
            moving = true;
        }
        else {
            this.moveVector.set(0,0,0);
            this.wasWalking = false;
            this.wasRunning = false;
            this.wasSprinting = false;
            var xDist = 0;
            var zDist = 0;
            if (this.key.forward) {
                if (this.key.shift) { // TODO: add option to toggle walking somewhere
                    this.wasSprinting = true;
                    zDist = this.sprintSpeed * dt;
                    anim = this.sprint;
                }
                else {
                    this.wasRunning = true;
                    zDist = this.runSpeed * dt;
                    anim = this.run;
                }
                moving = true;
            }
            else if (this.key.backward) { // TODO: also fix strafing and backwards 'running' speeds
                zDist = -(this.backSpeed * dt);
                anim = this.walkBack;
                moving = true;
            }
            if (this.key.strafeLeft) {
                anim = this.strafeLeft;
                xDist = -this.runSpeed * dt;
                moving = true;
            }
            else if (this.key.strafeRight) {
                anim = this.strafeRight;
                xDist = this.runSpeed * dt;
                moving = true;
            }
            else {
                if (this.key.turnLeft) {
                    this.mesh.addRotation(0, -0.022, 0);
                    if (this == Game.player.getController() && Game.enableCameraAvatarRotation) {
                        Game.camera.alpha = -this.mesh.rotation.y - 4.69;
                    }
                    if (!moving) {
                        anim = this.turnLeft;
                    }
                }
                else if (this.key.turnRight) {
                    this.mesh.addRotation(0, 0.022, 0);
                    if (this == Game.player.getController() && Game.enableCameraAvatarRotation) {
                        Game.camera.alpha = -this.mesh.rotation.y - 4.69;
                    }
                    if (!moving) {
                        anim = this.turnRight;
                    }
                }
            }
            this.moveVector = this.mesh.calcMovePOV(xDist, -this.freeFallDist, zDist);
        }
        /*
         *  Jittering in the Y direction caused by moveVector
         */
        if (moving) {
            if (this == Game.player.getController() && Game.enableCameraAvatarRotation && !(this.key.turnRight || this.key.turnLeft)) {
                this.mesh.rotation.y = -4.69 - Game.camera.alpha;
            }
            if (this.moveVector.length() > 0.001) {
                this.moveVector.x = Number(this.moveVector.x.toFixed(3));
                this.moveVector.y = Number(this.moveVector.y.toFixed(3));
                if (this.moveVector.y > 0) { // Effort to mitigate jittering; seems to work, and doesn't cause any floating when going down the stairs :v
                    this.moveVector.y = this.moveVector.y - 0.00075;
                }
                else {
                    this.moveVector.y = this.moveVector.y + 0.00075;
                }
                this.moveVector.z = Number(this.moveVector.z.toFixed(3));
                this.mesh.moveWithCollisions(this.moveVector);
                if (this.mesh.position.y > this.avStartPos.y) {
                    var actDisp = this.mesh.position.subtract(this.avStartPos);
                    var _sl = Game.verticalSlope(actDisp);
                    if (_sl >= this.maxSlopeLimitRads) {
                        if (this._stepOffset > 0) {
                            if (this._vMoveTot == 0) {
                                this._vMovStartPos.copyFrom(this.avStartPos);
                            }
                            this._vMoveTot = this._vMoveTot + (this.mesh.position.y - this.avStartPos.y);
                            if (this._vMoveTot > this._stepOffset) {
                                this._vMoveTot = 0;
                                this.mesh.position.copyFrom(this._vMovStartPos);
                                this.endFreeFall();
                            }
                        }
                        else {
                            this.mesh.position.copyFrom(this.avStartPos);
                            this.endFreeFall();
                        }
                    }
                    else {
                        this._vMoveTot = 0;
                        if (_sl > this.minSlopeLimitRads) {
                            this.fallFrameCount = 0;
                            this.inFreeFall = false;
                        }
                        else {
                            this.endFreeFall();
                        }
                    }
                }
                else if ((this.mesh.position.y) < this.avStartPos.y) {
                    var actDisp = this.mesh.position.subtract(this.avStartPos);
                    if (!(Game.areVectorsEqual(actDisp, this.moveVector, 0.001))) {
                        if (Game.verticalSlope(actDisp) <= this.minSlopeLimitRads) {
                            this.endFreeFall();
                        }
                        else {
                            this.fallFrameCount = 0;
                            this.inFreeFall = false;
                        }
                    }
                    else {
                        this.inFreeFall = true;
                        this.fallFrameCount++;
                        if (this.fallFrameCount > this.fallFrameCountMin) {
                            anim = this.fall;
                        }
                    }
                }
                else {
                    this.endFreeFall();
                }
            }
        }
        return anim;
    }
    endFreeFall() {
        this.movFallTime = 0;
        this.fallFrameCount = 0;
        this.inFreeFall = false;
    }
    doIdle(dt) {
        if (this.grounded) {
            return this.idle;
        }
        this.wasWalking = false;
        this.wasRunning = false;
        this.wasSprinting = false;
        this.movFallTime = 0;
        var anim = this.idle;
        this.fallFrameCount = 0;
        if (dt === 0) {
            this.freeFallDist = 5;
        }
        else {
            var u = this.idleFallTime * this.gravity;
            this.freeFallDist = u * dt + this.gravity * dt * dt / 2;
            this.idleFallTime = this.idleFallTime + dt;
        }
        if (this.freeFallDist < 0.01)
            return anim;
        var disp = new BABYLON.Vector3(0, -this.freeFallDist, 0);
        ;
        this.mesh.moveWithCollisions(disp);
        if ((this.mesh.position.y > this.avStartPos.y) || (this.mesh.position.y === this.avStartPos.y)) {
            this.groundIt();
        }
        else if (this.mesh.position.y < this.avStartPos.y) {
            var actDisp = this.mesh.position.subtract(this.avStartPos);
            if (!(Game.areVectorsEqual(actDisp, disp, 0.001))) {
                if (Game.verticalSlope(actDisp) <= this.minSlopeLimitRads) {
                    this.groundIt();
                    this.mesh.position.copyFrom(this.avStartPos);
                }
                else {
                    this.unGroundIt();
                    anim = this.slideBack;
                }
            }
        }
        return anim;
    }
    groundIt() {
        this.groundFrameCount++;
        if (this.groundFrameCount > this.groundFrameMax) {
            this.grounded = true;
            this.idleFallTime = 0;
        }
    }
    unGroundIt() {
        this.grounded = false;
        this.groundFrameCount = 0;
    }
    anyMovement() {
        return (this.key.forward || this.key.backward || this.key.turnLeft || this.key.turnRight || this.key.strafeLeft || this.key.strafeRight);
    }
    doPunch(dt) {
        for (var _i = 0; _i < this.animationBones["71_punch01"].length; _i++) {
            Game.scene.beginAnimation(this.skeleton.bones[this.animationBones["71_punch01"][_i]], this.punch.from, this.punch.to, this.punch.loop, this.punch.rate);
        }
    }
    getMovementKey() {
        return this.key;
    }
    setMovementKey(_key) {
        if (typeof _key[0] == "boolean" && typeof _key[7] == "boolean") {
            this.key.forward = _key[0];
            this.key.shift = _key[1];
            this.key.backward = _key[2];
            this.key.strafeLeft = _key[3];
            this.key.strafeRight = _key[4];
            this.key.turnLeft = _key[5];
            this.key.turnRight = _key[6];
            this.key.jump = _key[7];
        }
        return this;
    }
    keyMoveForward(_pressed = true) {
        if (_pressed === true) {
            this.key.forward = true;
            this.key.backward = false;
        }
        else {
            this.key.forward = false;
        }
        return this;
    }
    keyShift(_pressed = true) {
        if (_pressed === true) {
            this.key.shift = true;
        }
        else {
            this.key.shift = false;
        }
        return this;
    }
    keyMoveBackward(_pressed = true) {
        if (_pressed === true) {
            this.key.backward = true;
            this.key.forward = false;
        }
        else {
            this.key.backward = false;
        }
        return this;
    }
    keyTurnLeft(_pressed = true) {
        if (_pressed === true) {
            this.key.turnLeft = true;
            this.key.turnRight = false;
        }
        else {
            this.key.turnLeft = false;
        }
        return this;
    }
    keyTurnRight(_pressed = true) {
        if (_pressed === true) {
            this.key.turnRight = true;
            this.key.turnLeft = false;
        }
        else {
            this.key.turnRight = false;
        }
        return this;
    }
    keyStrafeLeft(_pressed = true) {
        if (_pressed === true) {
            this.key.strafeLeft = true;
            this.key.strafeRight = false;
        }
        else {
            this.key.strafeLeft = false;
        }
        return this;
    }
    keyStrafeRight(_pressed = true) {
        if (_pressed === true) {
            this.key.strafeLeft = false;
            this.key.strafeRight = true;
        }
        else {
            this.key.strafeRight = false;
        }
        return this;
    }
    keyJump(_pressed = true) {
        if (_pressed === true) {
            this.key.jump = true;
        }
        else {
            this.key.jump = false;
        }
        return this;
    }

    setTarget(_controller, _updateChild = true) {
        if (!(_controller instanceof EntityController)) {
            return this;
        }
        this.targetController = _controller;
        if (_updateChild) {
            _controller.addTargetedBy(this, false);
        }
        this.entity.setTarget(_controller.getEntity());
        return this;
    }
    removeTarget(_updateChild = true) {
        if (_updateChild && this.targetController instanceof EntityController) {
            this.targetController.removeTargetedBy(this, false);
        }
        this.targetController = null;
        this.entity.removeTarget();
        return this;
    }
    clearTarget(_updateChild = true) {
        this.removeTarget();
        return this;
    }
    getTarget() {
        return this.targetController;
    }

    hideMesh() {
        this.mesh.isVisible = false;
        this.hideAttachedMeshes();
        return this;
    }
    showMesh() {
        this.mesh.isVisible = true;
        this.showAttachedMeshes();
        return this;
    }
    hideAttachedMeshes() {
        for (var _bone in this._meshesAttachedToBones) {
            if (_bone == "FOCUS" || _bone == "ROOT") {}
            else if (this._showHelmet && _bone == "head") {}
            for (var _mesh in this._meshesAttachedToBones[_bone]) {
                if (this._meshesAttachedToBones[_bone][_mesh] instanceof BABYLON.AbstractMesh) {
                    this._meshesAttachedToBones[_bone][_mesh].isVisible = false;
                }
            }
        }
        return this;
    }
    showAttachedMeshes() {
        for (var _bone in this._meshesAttachedToBones) {
            if (_bone == "FOCUS" || _bone == "ROOT") {}
            else if (!this._showHelmet && _bone == "head") {}
            else {
                for (var _mesh in this._meshesAttachedToBones[_bone]) {
                    if (this._meshesAttachedToBones[_bone][_mesh] instanceof BABYLON.AbstractMesh) {
                        this._meshesAttachedToBones[_bone][_mesh].isVisible = true;
                    }
                }
            }
        }
        return this;
    }
    hideHelmet() {
        if (this._meshesAttachedToBones.hasOwnProperty("head")) {
            for (var _mesh in this._meshesAttachedToBones["head"]) {
                if (this._meshesAttachedToBones["head"][_mesh] instanceof BABYLON.AbstractMesh) {
                    this._meshesAttachedToBones["head"][_mesh].isVisible = false;
                }
            }
        }
        this._showHelmet = false;
        return this;
    }
    showHelmet() {
        if (this._meshesAttachedToBones.hasOwnProperty("head")) {
            for (var _mesh in this._meshesAttachedToBones["head"]) {
                if (this._meshesAttachedToBones["head"][_mesh] instanceof BABYLON.AbstractMesh) {
                    this._meshesAttachedToBones["head"][_mesh].isVisible = true;
                }
            }
        }
        this._showHelmet = true;
        return this;
    }

    getBone(_bone) {
        if (Game.debugEnabled) console.log("Running getBone");
        if (_bone instanceof BABYLON.Bone) {
            return _bone;
        }
        else if (typeof _bone == "string") {
            return this.getBoneByName(_bone);
        }
        else if (typeof _bone == "number") {
            return this.getBoneByID(_bone);
        }
        else {
            return null;
        }
    }
    getBoneByName(_string) {
        return this.mesh.skeleton.bones[this.mesh.skeleton.getBoneIndexByName(_string)];
    }
    getBoneByID(_int) {
        return this.mesh.skeleton.bones[_int];
    }
    /**
     * Attaches a mesh to a bone
     * @param  {BABYLON.AbstractMesh} _mesh               Mesh, or Mesh ID
     * @param  {BABYLON.Texture} _texture            Texture, or Texture ID
     * @param  {String} _bone               Bone name
     * @param  {BABYLON.Vector3} _position           Mesh position
     * @param  {BABYLON.Vector3} _rotation           Mesh rotation
     * @param  {BABYLON.Vector3} _scaling              Mesh scaling
     * @return {CharacterController}                     This character controller.
     */
    attachToBone(_mesh = "missingMesh", _texture = "missingTexture", _bone, _position = BABYLON.Vector3.Zero(), _rotation = BABYLON.Vector3.Zero(), _scaling = BABYLON.Vector3.One()) {
        if (Game.debugEnabled) console.log("Running attachToBone");
        if (!Game.hasMesh(_mesh)) {
            return this;
        }
        _bone = this.getBone(_bone);
        if (_bone == null) {
            return this;
        }
        if (!(_position instanceof BABYLON.Vector3)) {
            _position = Game.filterVector(_position);
        }
        if (!(_rotation instanceof BABYLON.Vector3)) {
            _rotation = Game.filterVector(_rotation);
        }
        if (!(_scaling instanceof BABYLON.Vector3)) {
            _scaling = Game.filterVector(_scaling);
        }
        if (_scaling.equals(BABYLON.Vector3.Zero())) {
            _scaling = BABYLON.Vector3.One();
        }
        if (!(Game.hasLoadedMesh(_mesh))) {
            Game.loadMesh(_mesh);
            Game.addAttachmentToCreate((this.id + _bone + _mesh), this, _mesh, _texture, _bone, _position, _rotation, _scaling);
            return this;
        }
        var _instance = Game.createMesh(undefined, _mesh, _texture, _position, _rotation, _scaling);
        if (!(_instance instanceof BABYLON.AbstractMesh)) {
            if (_mesh instanceof BABYLON.AbstractMesh) {
                console.log("Error creating mesh `" + _mesh.id + "` for Controller `" + this.id + "`");
            }
            else {
                console.log("Error creating mesh `" + _mesh + "` for Controller `" + this.id + "`");
            }
            return this;
        }
        _instance.attachToBone(_bone, this.mesh);
        _instance.position.copyFrom(_position);
        _instance.rotation.copyFrom(_rotation);
        if (!(_scaling instanceof BABYLON.Vector3)) {
            _instance.scaling.copyFrom(this.mesh.scaling);
        }
        if (this.prevAnim == undefined) {
            /*
            Because meshes became inverted when they were attached and scaled before actually being rendered for the first time, or something like that :v
             */
            _instance.scalingDeterminant = -1;
        }
        if (!(this._meshesAttachedToBones.hasOwnProperty(_bone.id))) {
            this._meshesAttachedToBones[_bone.id] = {};
        }
        this._meshesAttachedToBones[_bone.id][_instance.id] = _instance;
        if (!(this._bonesAttachedToMeshes.hasOwnProperty(_instance.id))) {
            this._bonesAttachedToMeshes[_instance.id] = {};
        }
        this._bonesAttachedToMeshes[_instance.id][_bone.id] = _bone;
        if (_bone.id == "FOCUS") {
            this.focus = _instance;
            _instance.isVisible = false;
        }
        else if (_bone.id == "ROOT") {
            this.root = _instance;
            _instance.isVisible = false;
        }
        return this;
    }
    detachFromBone(_bone) {
        return this.detachAllFromBone(_bone);
    }
    detachAllFromBone(_bone) {
        _bone = this.getBone(_bone);
        if (!(_bone instanceof BABYLON.Bone)) {
            return this;
        }
        if (!(this._meshesAttachedToBones.hasOwnProperty(_bone.id))) {
            return this;
        }
        for (var _mesh in this._meshesAttachedToBones[_bone.id]) {
            if (this._meshesAttachedToBones[_bone.id][_mesh] instanceof BABYLON.AbstractMesh) {
                this._meshesAttachedToBones[_bone.id][_mesh].detachFromBone();
                Game.removeMesh(this._meshesAttachedToBones[_bone.id][_mesh]);
                delete this._bonesAttachedToMeshes[_mesh][_bone.id];
            }
        }
        delete this._meshesAttachedToBones[_bone.id];
        return this;
    }
    detachMeshFromBone(_mesh, _bone = undefined) { // TODO: check what happens if we've got 2 of the same meshes on different bones :v
        _mesh = Game.getMesh(_mesh);
        if (!(_mesh instanceof BABYLON.AbstractMesh)) {
            return this;
        }
        if (!(this._bonesAttachedToMeshes.hasOwnProperty(_mesh.id))) {
            return this;
        }
        _bone = this.getBone(_bone);
        if (_bone instanceof BABYLON.Bone) {
            delete this._meshesAttachedToBones[_bone.id][_mesh.id];
        }
        else {
            for (var _boneWithAttachment in this._bonesAttachedToMeshes[_mesh.id]) {
                if (this._bonesAttachedToMeshes[_mesh.id][_boneWithAttachment] instanceof BABYLON.Bone) {
                    delete this._meshesAttachedToBones[_boneWithAttachment][_mesh.id];
                }
            }
        }
        delete this._bonesAttachedToMeshes[_mesh.id];
        _mesh.detachFromBone();
        Game.removeMesh(_mesh);
        return this;
    }
    detachFromAllBones() {
        for (var _bone in this._meshesAttachedToBones) {
            if (_bone == "FOCUS" || _bone == "ROOT") {}
            else {
                for (var _mesh in this._meshesAttachedToBones[_bone]) {
                    if (this._meshesAttachedToBones[_bone][_mesh] instanceof BABYLON.AbstractMesh) {
                        this._meshesAttachedToBones[_bone][_mesh].detachFromBone();
                        Game.removeMesh(this._meshesAttachedToBones[_bone][_mesh]);
                        delete this._bonesAttachedToMeshes[_mesh][_bone];
                    }
                }
                delete this._meshesAttachedToBones[_bone];
            }
        }
        return this;
    }
    attachToLeftEye(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "eye.l", BABYLON.Vector3.Zero(), new BABYLON.Vector3(BABYLON.Tools.ToRadians(-90), 0, 0));
    }
    attachToRightEye(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "eye.r", BABYLON.Vector3.Zero(), new BABYLON.Vector3(BABYLON.Tools.ToRadians(-90), 0, 0));
    }
    attachToHead(_mesh, _texture) {
        this.attachToBone(_mesh, _texture, "head", BABYLON.Vector3.Zero(), new BABYLON.Vector3(BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(180), 0));
        if (this._showHelmet) {
            this.showHelmet();
        }
        else {
            this.hideHelmet();
        }
        return this;
    }
    attachToFOCUS(_mesh) {
        return this.attachToBone(_mesh, undefined, "FOCUS");
    }
    attachToRightHand(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "hand.r", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90)));
    }
    detachFromRightHand() {
        return this.detachFromBone("hand.r");
    }
    attachToLeftHand(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "hand.l", BABYLON.Vector3.Zero(), new BABYLON.Vector3(BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90)));
    }
    detachFromLeftHand() {
        return this.detachFromBone("hand.l");
    }
    attachToLeftForearm(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "forearm.l", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(60), BABYLON.Tools.ToRadians(-90)));
    }
    detachFromLeftForearm() {
        return this.detachFromBone("forearm.l");
    }
    attachToRightForearm(_mesh, _texture) {
        return this.attachToBone(_mesh, _texture, "forearm.r", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(120), BABYLON.Tools.ToRadians(-90)));
    }
    detachFromRightForearm() {
        return this.detachFromBone("forearm.r");
    }

    dispose() {
        if (this == Game.player.getController()) {
            return false;
        }
        this.detachFromAllBones();
        this.mesh.controller = null;
        super.dispose();
        for (var _var in this) {
            this[_var] = null;
        }
        Game.removeCharacterController(this.id);
        return undefined;
    }
}
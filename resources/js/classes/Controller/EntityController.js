/**
 * Entity Controller
 * @class
 * @typedef {Object} EntityController
 * @property {string} id 
 * @property {string} entityID 
 * @property {string} texture 
 * @property {Object.<number, string>} textureStages 
 * @property {number} currentTextureStage 
 * @property {string} material 
 * @property {Object.<number, string>} materialStages 
 * @property {number} currentMaterialStage 
 * @property {string} mesh 
 * @property {ActionEnum} defaultAction 
 * @property {Object.<ActionEnum, boolean>} availableActions 
 * @property {Object.<ActionEnum, boolean>} hiddenAvailableActions 
 * @property {number} height 
 * @property {number} width 
 * @property {number} depth 
 * @property {BABYLON.Mesh} collisionMesh 
 * @property {Object.<number, string>} meshStages 
 * @property {number} currentMeshStage 
 * @property {string} networkID 
 * @property {boolean} propertiesChanged 
 * @property {Object.<>} animatables 
 * @property {Object.<>} animations 
 * @property {Object.<>} animationGroups 
 * @property {Object.<>} additiveAnimations 
 * @property {(BABYLON.Animation|null)} animationCurrent 
 * @property {(BABYLON.Animation|null)} animationPrevious 
 * @property {(BABYLON.Animation|null)} animationOverride 
 * @property {boolean} bAnimationOverride
 * @property {boolean} bAnimationStopped 
 * @property {number} animationTransitionCount 
 * @property {number} animationTransitionSpeed 
 * @property {(BABYLON.Skeleton|null)} skeleton 
 * @property {boolean} enabled 
 * @property {boolean} locked 
 * @property {boolean} disposing 
 * @property {boolean} animated 
 * @property {BABYLON.Ray} groundRay 
 * @property {boolean} grounded 
 * @property {boolean} falling 
 * @property {(string|null)} currentCell 
 * @property {Object.<>} bones 
 * @property {BABYLON.Mesh} focusMesh 
 * @property {BABYLON.Mesh} rootMesh 
 * @property {CompoundController} compoundController 
 * @property {number} animationPriority 
 * @property {boolean} animationPriorityUpdated 
 * @property {Object.<>} _meshesAttachedToBones 
 * @property {Object.<>} _bonesAttachedToMeshes 
 * @property {Set.<BABYLON.AbstractMesh>} _attachedMeshes 
 */
class EntityController extends AbstractController {
    /**
     * Creates an Entity Controller
     * @param {string} id 
     * @param {BABYLON.AbstractMesh} mesh 
     * @param {object} entityObject 
     */
    constructor(id = "", mesh = null, entityObject = {}) {
        super(id, mesh, entityObject);
        this.textureStages = [];
        this.currentTextureStage = 0;
        this.materialStages = [];
        this.currentMaterialStage = 0;
        this.defaultAction = 0;
        this.availableActions = {};
        this.hiddenAvailableActions = {};
        this.collisionMesh = null;
        this.meshStages = [];
        this.currentMeshStage = 0;
        this.networkID = null;
        this.propertiesChanged = true;
        this.animatables = {};
        this.animations = {};
        this.animationGroups = {};
        this.additiveAnimations = {};
        this.animationCurrent = null;
        this.animationPrevious = null;
        this.animationOverride = null;
        this.bAnimationOverride = false;
        this.animationTransitionCount = 0.0;
        this.animationTransitionSpeed = 0.1;
        this.skeleton = null;
        this.disposing = false;
        this.animated = false;
        this.groundRay = null;
        this.focusMesh = null;
        this.rootMesh = null;
        this.bones = {};
        this.bones["ROOT"] = null;
        this.bones["FOCUS"] = null;
        this.compoundController = null;
        /**
         * Priority for animations to be played; lower is higher priority.
         * 0 is showing all frames of the animations
         * 1 is throttled animations
         * 2 is not playing the animations
         * @type {number}
         */
        this.animationPriority = 0;
        this.animationPriorityUpdated = false;

        /**
         * Map of bone IDs and the mesh attached to them.
         * @type {string, {string, BABYLON.Mesh}}
         */
        this._meshesAttachedToBones = {};
        /**
         * Map of mesh IDs and the bones they're attached to.
         * @type {string, {string, BABYLON.Bone}}
         */
        this._bonesAttachedToMeshes = {};
        this._attachedMeshes = new Set();

        EntityController.set(this.id, this);
        this.setMesh(mesh);
        this.assign(entityObject, false);
        this.sendTransforms();
        if (EntityController.debugMode) console.info(`Finished creating new EntityController(${this.id})`);
        if (EntityController.debugMode) console.groupEnd();
    }
    getPosition() {
        if (this.collisionMesh instanceof BABYLON.AbstractMesh) {
            return this.collisionMesh.position;
        }
        return BABYLON.Vector3.Zero();
    }
    getRotation() {
        if (this.collisionMesh instanceof BABYLON.AbstractMesh) {
            return this.collisionMesh.rotation;
        }
        return BABYLON.Vector3.Zero();
    }
    getScaling() {
        if (this.collisionMesh instanceof BABYLON.AbstractMesh) {
            return this.collisionMesh.scaling
        }
        return BABYLON.Vector3.One();
    }
    setNetworkID(networkId) {
        this.networkID = networkId;
        return 0;
    }
    getNetworkID() {
        return this.networkID;
    }
    setCollisionMesh(mesh) {
        this.collisionMesh = mesh;
        this.mesh.setParent(this.collisionMesh);
    }
    setMesh(mesh, updateChild = false) {
        if (EntityController.debugMode) console.group(`Running {EntityController} ${this.id}.setMesh(meshObject, ${updateChild})`);
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            if (EntityController.debugMode) console.error(`meshObject wasn't an instance of BABYLON.AbstractMesh`);
            if (EntityController.debugMode) console.groupEnd();
            return 2;
        }
        if (this.mesh instanceof BABYLON.AbstractMesh && this.mesh != mesh) {
            this.unsetMesh(this.mesh);
        }
        this.mesh = mesh;
        if (this.mesh.skeleton instanceof BABYLON.Skeleton) {
            this.setSkeleton(this.mesh.skeleton);
        }
        this.mesh.isPickable = true;
        this.mesh.alwaysSelectAsActiveMesh = true;
        this.mesh.controller = this;
        this.propertiesChanged = true;
        if (this.meshStages.length == 0) {
            this.addMeshStage(mesh.name);
            if (mesh.hasOwnProperty("material") && mesh.material instanceof BABYLON.Material) {
                this.addMaterialStage(mesh.material.name);
                if (mesh.material.hasOwnProperty("diffuseTexture") && mesh.material.diffuseTexture instanceof BABYLON.Texture) {
                    this.addTextureStage(mesh.material.diffuseTexture.name);
                }
                else {
                    this.addTextureStage(mesh.material.name);
                }
            }
            else {
                this.addMaterialStage("missingMaterial");
                this.addTextureStage("missingTexture");
            }
            this.currentMeshStage = 0;
        }
        this._attachedMeshes.add(this.mesh);
        let position = this.mesh.position.clone();
        this.createCollisionMesh();
        if (this.hasCollisionMesh()) {
            this.collisionMesh.position.copyFrom(position);
            this.mesh.setParent(this.collisionMesh);
            this._attachedMeshes.add(this.collisionMesh);
        }
        this.height = this.mesh.getBoundingInfo().boundingBox.extendSize.y * 2;
        this.width = this.mesh.getBoundingInfo().boundingBox.extendSize.x * 2;
        this.width = this.mesh.getBoundingInfo().boundingBox.extendSize.z * 2;
        if (EntityController.debugMode) console.groupEnd();
        return 0;
    }
    unsetMesh(mesh = this.mesh) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 0;
        }
        if (this.hasMesh()) {
            this._attachedMeshes.remove(mesh);
            mesh.controller = null;
            mesh.setParent(null);
        }
        if (this.hasCollisionMesh()) {
            this._attachedMeshes.remove(this.collisionMesh);
            Game.removeMesh(this.collisionMesh);
            this.collisionMesh = null;
        }
        return 0;
    }
    createCollisionMesh() {
        //this.collisionMesh = Game.createAreaMesh(String(this.id).concat("-collisionMesh"), "CUBE", this.mesh.getBoundingInfo().boundingBox.extendSize.x * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.y * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.z * 2, this.mesh.position, this.mesh.rotation);
        return 0;
    }
    hasCollisionMesh() {
        if (!this.enabled) {
            return false;
        }
        return this.collisionMesh instanceof BABYLON.AbstractMesh;
    }
    createMesh(id = "", stageIndex = this.currentMeshStage, position = this.getPosition(), rotation = this.getRotation(), scaling = this.getScaling()) {
        if (this.mesh instanceof BABYLON.AbstractMesh) {
            return 1;
        }
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        return Game.createMesh(id, this.meshStages[stageIndex], this.materialStages[stageIndex], position, rotation, scaling);
    }
    sendTransforms() {
        if (this.hasCollisionMesh()) {
            Game.transformsWorkerPostMessage(
                "createEntity",
                0,
                {
                    "id": this.id,
                    "width": this.width,
                    "height": this.height,
                    "depth": this.depth,
                    "position": this.collisionMesh.position.toOtherArray(),
                    "rotation": this.collisionMesh.rotation.toOtherArray()
                }
            );
        }
        else if (this.hasMesh()) {
            Game.transformsWorkerPostMessage(
                "createEntity",
                0,
                {
                    "id": this.id,
                    "width": this.width,
                    "height": this.height,
                    "depth": this.depth,
                    "position": this.mesh.position.toOtherArray(),
                    "rotation": this.mesh.rotation.toOtherArray()
                }
            );
        }
        return 0;
    }
    updateTransforms() {
        if (this.hasCollisionMesh()) {
            Game.transformsWorkerPostMessage(
                "updateEntity",
                0,
                {
                    "id": this.id,
                    "timestamp": Game.currentTime,
                    "position": this.collisionMesh.position.toOtherArray(),
                    "rotation": this.collisionMesh.rotation.toOtherArray()
                }
            );
        }
        else if (this.hasMesh()) {
            Game.transformsWorkerPostMessage(
                "updateEntity",
                0,
                {
                    "id": this.id,
                    "timestamp": Game.currentTime,
                    "position": this.mesh.position.toOtherArray(),
                    "rotation": this.mesh.rotation.toOtherArray()
                }
            );
        }
        return 0;
    }

    hasBone(bone) {
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            return false;
        }
        if (bone instanceof BABYLON.Bone) {
            return this.skeleton.bones[this.skeleton.getBoneIndexByName(bone.id)] >= 0;
        }
        else if (typeof bone == "string") {
            return this.skeleton.getBoneIndexByName(bone) >= 0;
        }
        else if (typeof bone == "number") {
            return this.skeleton.bones.hasOwnProperty(number);
        }
        return false;
    }
    getBone(bone) {
        if (EntityController.debugMode) console.log("Running getBone");
        if (this.skeleton instanceof BABYLON.Skeleton) {
            if (bone instanceof BABYLON.Bone) {
                return bone;
            }
            else if (typeof bone == "string") {
                return this.getBoneByName(bone);
            }
            else if (typeof bone == "number") {
                return this.getBoneByID(bone);
            }
        }
        return null;
    }
    getBoneByName(string) {
        if (this.skeleton instanceof BABYLON.Skeleton) {
            return this.skeleton.bones[this.skeleton.getBoneIndexByName(string)];
        }
        return null;
    }
    getBoneByID(number) {
        if (this.skeleton instanceof BABYLON.Skeleton) {
            return this.skeleton.bones[number];
        }
        return null;
    }

    /**
     * Attaches a mesh to a bone
     * @param  {string} meshID Mesh ID
     * @param  {string} materialID Texture ID
     * @param  {string} boneID Bone name
     * @param  {BABYLON.Vector3} [position] Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @returns {CharacterController} This character controller.
     */
    attachMeshIDToBone(meshID = "missingMesh", materialID = "missingTexture", boneID, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (EntityController.debugMode) console.log("Running attachMeshIDToBone");
        if (!Game.hasMesh(meshID)) {
            if (EntityController.debugMode) console.log(`Couldn't find mesh:${meshID} to attach to bone:${boneID}`);
            return 2;
        }
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            if (EntityController.debugMode) console.log(`Couldn't find skeleton`);
            return 1;
        }
        if (!this.hasBone(boneID)) {
            if (EntityController.debugMode) console.log(`Couldn't find bone:${boneID}`);
            return 2;
        }
        let bone = this.getBone(boneID);
        position = Game.filterVector3(position);
        rotation = Game.filterVector3(rotation);
        scaling = Game.filterVector3(scaling);
        if (!(Game.hasLoadedMesh(meshID))) {
            Game.addBackloggedAttachment((this.id + bone.name + meshID), this, meshID, materialID, bone.name, position, rotation, scaling);
            if (EntityController.debugMode) console.log(`Loading mesh:${meshID} hashtag-soon.`)
            return 1;
        }
        if (materialID != "collisionMaterial") {
            options["createClone"] = true;
        }
        let loadedMesh = Game.createMesh(meshID.concat("Attachment").concat(this.id.capitalize()).concat(boneID), meshID, materialID, position, rotation, scaling, options);
        /*
        if the mesh is a billboard
         */
        if (loadedMesh.getBoundingInfo().boundingBox.maximum.z == 0) {
            loadedMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
            if (bone.name == "hand.r") {
                rotation.y -= BABYLON.Tools.ToRadians(90);
                rotation.z += BABYLON.Tools.ToRadians(90);
            }
            else if (bone.name == "hand.l") {
                rotation.y -= BABYLON.Tools.ToRadians(90);
                rotation.z += BABYLON.Tools.ToRadians(270);
            }
            loadedMesh.material.backFaceCulling = false;
        }
        return this.attachMeshToBone(loadedMesh, bone, position, rotation, scaling);
    }
    /**
     * Attaches a collision mesh to a bone
     * @param  {string} meshID Mesh ID
     * @param  {string} materialID Texture ID
     * @param  {string} boneID Bone name
     * @param  {BABYLON.Vector3} [position] Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options; used
     * @returns {CharacterController} This character controller.
     */
    attachCollisionMeshIDToBone(meshID = "missingMesh", materialID = "missingTexture", boneID, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (typeof options != "object") {
            options = {};
        }
        options["checkCollisions"] = true
        this.attachMeshIDToBone(meshID, materialID, boneID, position, rotation, scaling, options);
        return 0;
    }
    /**
     * Attaches a collision mesh to a bone
     * @param  {BABYLON.AbstractMesh} mesh Mesh
     * @param  {BABYLON.Bone} bone Bone
     * @param  {BABYLON.Vector3} [position] Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options; not used
     * @returns {CharacterController} This character controller.
     */
    attachMeshToBone(mesh, bone, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (!(bone instanceof BABYLON.Bone)) {
            return 2;
        }
        mesh.setParent(this.mesh);
        mesh.attachToBone(bone, this.mesh);
        mesh.controller = this;
        mesh.position.copyFrom(position);
        mesh.rotation.copyFrom(rotation);
        if (!(scaling instanceof BABYLON.Vector3)) {
            mesh.scaling.copyFrom(this.mesh.scaling);
        }
        if (this.animationPrevious == undefined) {
            /*
            Because meshes became inverted when they were attached and scaled before actually being rendered for the first time, or something like that :v
             */
            mesh.scalingDeterminant = -1;
        }
        if (!(this._meshesAttachedToBones.hasOwnProperty(bone.id))) {
            this._meshesAttachedToBones[bone.id] = {};
        }
        this._meshesAttachedToBones[bone.id][mesh.id] = mesh;
        if (!(this._bonesAttachedToMeshes.hasOwnProperty(mesh.id))) {
            this._bonesAttachedToMeshes[mesh.id] = {};
        }
        this._bonesAttachedToMeshes[mesh.id][bone.id] = bone;
        if (bone.id == "FOCUS") {
            this.focusMesh = mesh;
            mesh.isVisible = false;
        }
        else if (bone.id == "ROOT") {
            this.rootMesh = mesh;
            mesh.isVisible = false;
        }
        if (mesh.material.name != "collisionMaterial") {
            this._attachedMeshes.add(mesh);
        }
        return 0;
    }
    attachCollisionMeshToBone(mesh, bone, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {"checkCollisions": false}) {
        return this.attachMeshToBone(mesh, bone, position, rotation, scaling, true);
    }
    detachAllFromBone(bone, destroyMesh = true) {
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            return 1;
        }
        if (!(bone instanceof BABYLON.Bone)) {
            if (this.hasBone(bone)) {
                bone = this.getBone(bone);
            }
            else {
                return 2;
            }
        }
        if (!(this._meshesAttachedToBones.hasOwnProperty(bone.id))) {
            return 1;
        }
        for (let meshID in this._meshesAttachedToBones[bone.id]) {
            this.detachMeshFromBone(this._meshesAttachedToBones[bone.id][meshID], bone, destroyMesh);
        }
        return 0;
    }
    detachMeshID(meshID = "missingMesh", destroyMesh = true) {
        if (EntityController.debugMode) console.log("Running detachMeshID");
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            return 1;
        }
        if (!Game.hasMesh(meshID)) {
            if (EntityController.debugMode) console.log(`Couldn't find {AbstractMesh} ${meshID}`);
            return 2;
        }
        let mesh = null;
        this._attachedMeshes.forEach((attachedMesh) => {
            if (attachedMesh instanceof BABYLON.AbstractMesh) {
                if (attachedMesh.name == meshID || attachedMesh.id == meshID) {
                    mesh = attachedMesh;
                    return true;
                }
            }
            else {
                this._attachedMeshes.remove(attachedMesh);
            }
        });
        if (mesh == null) {
            return 1;
        }
        return this.detachMeshFromBone(mesh, null, destroyMesh);
    }
    detachMeshFromBone(mesh, bone = null, destroyMesh = true) { // TODO: check what happens if we've got 2 of the same meshes on different bones :v srsly, what if
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            return 1;
        }
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (!(this._bonesAttachedToMeshes.hasOwnProperty(mesh.id))) {
            return 1;
        }
        if (!(bone instanceof BABYLON.Bone)) {
            if (this.hasBone(bone)) {
                bone = this.getBone(bone);
            }
            else {
                bone = null;
            }
        }
        if (bone instanceof BABYLON.Bone) {
            this._meshesAttachedToBones[bone.id][mesh.id].controller = null;
            delete this._meshesAttachedToBones[bone.id][mesh.id];
        }
        else {
            for (let boneWithAttachment in this._bonesAttachedToMeshes[mesh.id]) {
                if (this._bonesAttachedToMeshes[mesh.id][boneWithAttachment] instanceof BABYLON.Bone) {
                    this._meshesAttachedToBones[boneWithAttachment][mesh.id].controller = null;
                    delete this._meshesAttachedToBones[boneWithAttachment][mesh.id];
                }
            }
        }
        mesh.controller = null;
        mesh.detachFromBone();
        delete this._bonesAttachedToMeshes[mesh.id];
        this._attachedMeshes.delete(mesh);
        if (destroyMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }
    detachFromAllBones(destroyMesh = true) {
        if (!(this.skeleton instanceof BABYLON.Skeleton)) {
            return 0;
        }
        for (let boneID in this._meshesAttachedToBones) {
            if (boneID == "FOCUS" || boneID == "ROOT") {}
            else {
                this.detachAllFromBone(boneID, destroyMesh);
            }
            if (this.organs.hasOwnProperty(boneID)) {
                this.organs[boneID]["meshID"] = null;
                this.organs[boneID]["materialID"] = null;
            }
            if (this.cosmetics.hasOwnProperty(boneID)) {
                this.cosmetics[boneID]["meshID"] = null;
                this.cosmetics[boneID]["materialID"] = null;
            }
        }
        return 0;
    }
    attachToROOT(mesh) {
        if (mesh instanceof BABYLON.AbstractMesh) {
            return this.attachMeshToBone(mesh, this.getBone("ROOT"));
        }
        return this.attachMeshIDToBone(mesh, undefined, "ROOT");
    }
    detachFromROOT() {
        return this.detachAllFromBone("ROOT", false)[0];
    }
    attachToFOCUS(mesh) {
        if (mesh instanceof BABYLON.AbstractMesh) {
            return this.attachMeshToBone(mesh, this.getBone("FOCUS"));
        }
        return this.attachMeshIDToBone(mesh, undefined, "FOCUS");
    }
    detachFromFOCUS() {
        return this.detachAllFromBone("FOCUS", false)[0];
    }

    setStage(index = 0) {
        if (!this.meshStages.hasOwnProperty(index)) {
            return 0;
        }
        if (this.currentMeshStage == index) {
            return 0;
        }
        if (!Game.hasLoadedMesh(this.meshStages[index])) {
            Game.addEntityStageToCreate(this.id, index);
            return 0;
        }
        this.setLocked(true);
        let position = this.getPosition();
        let rotation = this.getRotation();
        let scaling = this.getScaling();
        this.currentMeshStage = index;
        this.detachFromAllBones();
        Game.removeMesh(this.mesh);
        let mesh = this.createMesh(undefined, index, position, rotation, scaling);
        this.setMesh(mesh);
        this.generateAttachedMeshes();
        this.setLocked(false);
        return 0;
    }
    addMeshStage(meshID) {
        this.meshStages.push(meshID);
        return 0;
    }
    getMeshStage(index = this.currentMeshStage) {
        if (!this.meshStages.hasOwnProperty(index)) {
            index = this.currentMeshStage;
        }
        return this.meshStages[index];
    }
    addMaterialStage(materialID) {
        this.materialStages.push(materialID);
        return 0;
    }
    getMaterialStage(index = this.currentMaterialStage) {
        if (!this.materialStages.hasOwnProperty(index)) {
            index = this.currentMaterialStage;
        }
        return this.materialStages[index];
    }
    addTextureStage(textureID) {
        this.textureStages.push(textureID);
        return 0;
    }
    getTextureStage(index = this.currentTextureStage) {
        if (!this.textureStages.hasOwnProperty(index)) {
            index = this.currentTextureStage;
        }
        return this.textureStages[index];
    }
    setStages(stages) {
        return this.addStages(stages, true);
    }
    addStages(stages, overwrite = false) {
        if (!(stages instanceof Array)) {
            return 2;
        }
        if (stages.length == 0) {
            return 1;
        }
        if (overwrite) {
            this.meshStages.clear();
            this.materialStages.clear();
            this.textureStages.clear();
        }
        for (let i in stages) {
            if (stages[i] instanceof Array) {
                this.addMeshStage(stages[i][0]);
                if (stages[i].length > 1) {
                    this.addMaterialStage(stages[i][1]);
                }
                else {
                    if (this.meshStages.length == 1) {
                        this.addMaterialStage("missingMaterial");
                    }
                    else {
                        this.addMaterialStage(this.materialStages[i-1]);
                    }
                }
                if (stages[i].length > 2) {
                    this.addTextureStage(stages[i][2]);
                }
                else {
                    if (this.meshStages.length == 1) {
                        this.addTextureStage(this.materialStages[i]);
                    }
                    else {
                        this.addTextureStage(this.textureStages[i-1]);
                    }
                }
            }
        }
        return 0;
    }
    /**
     * Adds an available Action when interacting with this Entity
     * @param {ActionEnum} actionEnum ActionEnum
     * @param {boolean} [runOnce]
     */
    addAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        if (actionEnum == -1) {return 1;}
        this.availableActions[actionEnum] = true;
        return 0;
    }
    /**
     * Removes an available Action when interacting with this Entity
     * @param  {ActionEnum} actionEnum (ActionEnum)
     * @return {boolean} Whether or not the Action was removed
     */
    removeAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        delete this.availableActions[actionEnum];
        return 0;
    }
    getAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        return this.availableActions[actionEnum] || -1;
    }
    getAvailableActions() {
        return this.availableActions;
    }
    hasAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        return this.availableActions.hasOwnProperty(actionEnum);
    }

    /**
     * Adds a Hidden Available Action when interacting with this Entity
     * @param {ActionEnum} actionEnum (ActionEnum)
     */
    addHiddenAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        if (actionEnum == -1) {
            return 1;
        }
        this.hiddenAvailableActions[actionEnum] = true;
        return 0;
    }
    /**
     * Removes a Hidden Available Action when interacting with this Entity
     * @param  {ActionEnum} actionEnum (ActionEnum)
     * @return {boolean} Whether or not the Action was removed
     */
    removeHiddenAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        delete this.hiddenAvailableActions[actionEnum];
        return 0;
    }
    getHiddenAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        return this.hiddenAvailableActions[actionEnum] || -1;
    }
    getHiddenAvailableActions() {
        return this.hiddenAvailableActions;
    }
    hasHiddenAvailableAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        return this.hiddenAvailableActions.hasOwnProperty(actionEnum);
    }
    generateOrganMeshes() {
        if (!this.hasSkeleton()) {
            return 1;
        }
        return 0;
    }
    generateCosmeticMeshes() {
        if (!this.hasSkeleton()) {
            return 1;
        }
        return 0;
    }
    generateEquippedMeshes() {
        if (!this.hasSkeleton()) {
            return 1;
        }
        return 0;
    }
    populateFromEntity(entityObject) {
        if (EntityController.debugMode) console.group(`Running {EntityController} ${this.id}.populateFromEntity(entityObject)`);
        if (!(entityObject instanceof Object)) {
            if (EntityController.debugMode) console.warn(`entityObject was not an object`);
            if (EntityController.debugMode) console.groupEnd();
            return 2;
        }
        if (EntityController.debugMode) console.info(`Finished running {EntityController} ${this.id}.populateFromEntity(entityObject)`);
        if (EntityController.debugMode) console.groupEnd();
        return 0;
    }
    updateFromEntity(thatEntity) {
        return 0;
    }

    setCompoundController(instancedCompoundController) {
        instancedCompoundController = Tools.filterClass(instancedCompoundController, InstancedCompoundController, null);
        if (instancedCompoundController == null) {
            return 1;
        }
        this.compoundController = instancedCompoundController;
        return 0;
    }
    getCompoundController() {
        return this.compoundController;
    }
    hasCompoundController() {
        return this.compoundController instanceof InstancedCompoundController;
    }
    removeCompoundController(updateChild = true) {
        if (this.compoundController == null) {
            return 0;
        }
        if (typeof controller == "string" && this.controllers.hasOwnProperty(controller)) {
            if (this.controllers[controller] instanceof EntityController) {
                this.controllers[controller].removeCompoundController(this, false);
            }
            delete this.controllers[controller];
            return 0;
        }
        if (updateChild) {
            this.compoundController.removeController(this, false);
        }
        this.compoundController = null;
        return 0;
    }

    setAnimationPriority(number = 0) {
        this.animationPriority = number;
        this.animationPriorityUpdated = true;
        return 0;
    }
    getAnimationPriority() {
        return this.animationPriority;
    }

    doAttacked() {
        return 0;
    }

    /**
     * Returns the primary mesh associated with this controller.
     * @returns {BABYLON.AbstractMesh}
     */
    getMesh() {
        return this.mesh;
    }
    hasMesh() {
        return this.mesh instanceof BABYLON.AbstractMesh;
    }
    setSkeleton(skeleton) {
        if (skeleton instanceof BABYLON.Skeleton) {
            this.skeleton = skeleton;
            this.bones["ROOT"] = this.getBoneByName("ROOT") || null;
            this.bones["FOCUS"] = this.getBoneByName("FOCUS") || null;
            this.animated = true;
        }
        else {
            this.skeleton = null;
            this.bones["ROOT"] = null;
            this.bones["FOCUS"] = null;
            this.animated = false;
        }
        return 0;
    }
    getSkeleton() {
        return this.skeleton;
    }
    hasSkeleton() {
        return this.skeleton instanceof BABYLON.Skeleton;
    }
    setMeshSkeleton(skeleton) {
        if (skeleton instanceof BABYLON.Skeleton) {
            this.skeleton = skeleton;
            this.propertiesChanged = true;
        }
        return 0;
    }
    getMeshSkeleton() {
        return this.skeleton;
    }
    updateProperties() {
        this.propertiesChanged = false;
        return 0;
    }
    setParentByMesh(mesh) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            if (Game.hasMesh(mesh)) {
                mesh = Game.getMesh(mesh);
            }
            else {
                return 1;
            }
        }
        this.collisionMesh.setParent(mesh);
        return 0;
    }
    setParent(controller = null) {
        if (controller == null) {
            return this.removeParent();
        }
        if (!(controller instanceof EntityController)) {
            if (EntityController.has(controller)) {
                controller = EntityController.get(controller);
            }
            else {
                return 0;
            }
        }
        this.collisionMesh.setParent(controller.getMesh());
        return 0;
    }
    getParent() {
        return this.collisionMesh.parent;
    }
    removeParent() {
        this.collisionMesh.setParent(null);
        return 0;
    }
    createLookController() {
        return 0;
    }

    hasAnimatable(animatable) {
        return this.animatables.hasOwnProperty(animatable);
    }
    hasAnimation(animation) {
        return this.animations.hasOwnProperty(animation);
    }
    hasAnimationGroup(animationGroup) {
        return this.animationGroups.hasOwnProperty(animationGroup);
    }
    createAnimatableFromRangeName(id, rangeName, loopAnimation = true, speedRatio = 1.0) {
        if (this.skeleton == null) {
            return 2;
        }
        let animationRange = this.skeleton.getAnimationRange(rangeName);
        if (!(animationRange instanceof BABYLON.AnimationRange)) {
            return 1;
        }
        return this.createAnimatable(id, animationRange.from + 1, animationRange.to, loopAnimation, speedRatio);
    }
    createAnimatable(id, fromFrame = 0, toFrame = 0, loopAnimation = true, speedRatio = 1.0) {
        if (this.skeleton == null) {
            return 2;
        }
        //let animatable = new BABYLON.Animatable(Game.scene, this.skeleton, fromFrame, toFrame, loopAnimation, speedRatio);
        let animatable = Game.scene.beginWeightedAnimation(this.skeleton, fromFrame, toFrame, 0.0, loopAnimation, speedRatio);
        this.animatables[id] = animatable;
        return animatable;
    }
    setAnimatableWeight(id, weight = 1.0) {
        if (this.skeleton == null) {
            return 2;
        }
        if (!this.hasAnimatable(id)) {
            return 2;
        }
        this.animations[id].weight = weight;
        return 0;
    }
    /**
     * 
     * @param {string} id name of AnimationGroup to create
     * @param {string|array} animatables ID of animation group(s)
     * @param {number} weight 
     * @param {boolean} loop 
     * @param {number} speed 
     * @param {boolean} start 
     */
    createAnimationGroupFromAnimatables(id, animatables, weight = 0.0, loop = -1, speed = -1, start = true) {
        let hasValidAnimations = true;
        let animationGroup = new BABYLON.AnimationGroup(id);
        /*let maxFrameCount = 0;
        let minFrameCount = Number.MAX_SAFE_INTEGER;
        let tempFrameCount = 0;
        let maxFrame = 0;
        let minFrame = Number.MAX_SAFE_INTEGER;*/
        if (typeof animatables != "array") {
            animatables = [animatables];
        }
        for (let i = 0; i < animatables.length; i++) {
            let animatable = animatables[i];
            if (!(animatable instanceof BABYLON.Animation)) {
                if (this.hasAnimatable(animatable)) {
                    animatable = this.animatables[animatable];
                }
                else {
                    hasValidAnimations = false;
                    return 2;
                }
            }
            if (i == 0) {
                if (loop == -1) {
                    loop = animatable.loopAnimation;
                }
                if (speed == -1) {
                    speed = animatable._speedRatio;
                }
            }
            for (let animation of animatable.getAnimations()) {
                animationGroup.addTargetedAnimation(animation.animation, animation.target);
            }
            /*tempFrameCount = animatable.toFrame - animatable.fromFrame;
            if (tempFrameCount > maxFrameCount) {
                maxFrameCount = tempFrameCount;
            }
            if (tempFrameCount < minFrameCount) {
                minFrameCount = tempFrameCount;
            }
            if (animatable.toFrame > maxFrame) {
                maxFrame = animatable.toFrame;
            }
            if (animatable.fromFrame < minFrame) {
                minFrame = animatable.fromFrame;
            }*/
            animationGroup.normalize(animatable.fromFrame, animatable.toFrame);
        }
        if (!hasValidAnimations) {
            animationGroup.dispose();
            return 1;
        }
        if (loop === -1) {
            loop = true;
        }
        if (speed === -1) {
            speed = 1.0;
        }
        /*if (maxFrameCount != minFrameCount) {
            animationGroup.normalize(minFrame, maxFrame);
        }*/
        animationGroup.start(start);
        animationGroup.loopAnimation = loop;
        animationGroup.speedRatio = speed;
        if (start) {
            animationGroup.setWeightForAllAnimatables(weight);
        }
        this.animationGroups[id] = animationGroup;
        return animationGroup;
    }
    updateAnimation() {
        return 0;
    }
    /**
     * 
     * @param {(string|null)} animation 
     */
    stopAnimation(animation = null) {
        if (animation == null) {
            this.animation.setWeightForAllAnimatables(0);
        }
        else if (this.hasAnimationGroup(animation)) {
            this.animationGroups[animation].setWeightForAllAnimatables(0);
        }
        else {
            return 1;
        }
        return 0;
    }
    /**
     * 
     * @param {(string|null)} animation 
     */
    overrideAnimation(animation = null) {
        if (animation == null) {
            this.bAnimationOverride = false;
            this.animationOverride = null;
        }
        else if (this.hasAnimationGroup(animation)) {
            this.animationGroups[animation].setWeightForAllAnimatables(1);
            this.animationOverride = animation;
            this.beginAnimation(animation);
        }
        else {
            return 1;
        }
        return 0;
    }
    stopAllAnimations() {
        for (let id in this.animationGroups) {
            this.animationGroups[id].setWeightForAllAnimatables(0);
        }
        return 0;
    }
    pauseAllAnimations() {
        for (let id in this.animationGroups) {
            this.animationGroups[id].pause();
        }
        return 0;
    }
    unpauseAllAnimations() {
        for (let id in this.animationGroups) {
            this.animationGroups[id].play();
        }
        return 0;
    }
    /**
     * 
     * @param {BABYLON.Animation} animation 
     * @param {function} [callback] 
     */
    beginAnimation(animation, callback = null) {
        if (this.bAnimationStopped || this.animationPriority >= 2) {
            return 1;
        }
        if (!(animation instanceof BABYLON.AnimationGroup)) {
            if (this.hasAnimationGroup(animation)) {
                this.animation = this.animationGroups[animation];
            }
            else {
                return 1;
            }
        }
        if (animation != this.animationCurrent) {
            /* Prevents an animation from having its weight > 0 when it's swapped out before it reaches 0 */
            if (this.animationPrevious != null && animation != this.animationPrevious) {
                this.animationPrevious.setWeightForAllAnimatables(0.0);
            }
            this.animationPrevious = this.animationCurrent;
            this.animationCurrent = animation;
            this.animationTransitionCount = 0.0;
        }
        if (this.animationTransitionCount < 1) {
            this.animationTransitionCount += this.animationTransitionSpeed;
        }
        if (this.animationTransitionCount > 1) {
            this.animationTransitionCount = 1;
        }
        if (this.animationPrevious instanceof BABYLON.AnimationGroup) {
            this.animationPrevious.setWeightForAllAnimatables(1 - this.animationTransitionCount);
        }
        this.animationCurrent.setWeightForAllAnimatables(this.animationTransitionCount);
        return 0;
    }
    moveAV() {
        return 0;
    }
    /**
     * Returns all meshes associated with this controller.
     * @returns {Set<BABYLON.AbstractMesh>}
     */
    getMeshes() {
        return [this.collisionMesh, this.mesh];
    }
    setCell(cell) {
        if (cell instanceof Cell) {
            this.cell = cell;
        }
        else if (Game.hasCell(cell)) {
            this.cell = Game.getCell(cell);
        }
        else {
            return 2;
        }
        return 0;
    }
    getCell() {
        return this.cell;
    }
    hasCell() {
        return this.cell instanceof Cell;
    }
    updateGroundRay() {
        if (!(this.hasMesh())) {
            return 0;
        }
        if (!(this.groundRay instanceof BABYLON.Ray)) {
            this.groundRay = new BABYLON.Ray(this.collisionMesh.position, BABYLON.Vector3.Down(), 0.01);
        }
        this.groundRay.origin = this.collisionMesh.position;
        //this.groundRay.direction = this.collisionMesh.position.add(BABYLON.Vector3.Down());
        return 0;
    }

    generateAttachedMeshes() {
        return 0;
    }
    detachFromAllBones() {
        return 0;
    }

    setDefaultAction(actionEnum) {
        actionEnum = Tools.filterEnum(actionEnum, ActionEnum);
        this.defaultAction = actionEnum;
        return 0;
    }
    getDefaultAction() {
        return this.defaultAction;
    }

    isAnimated() {
        return this.animated;
    }
    setAnimated(animated = true) {
        this.animated = animated == true;
        return 0;
    }
    /**
     * Clones the controller's values over this; but not really anything important :v
     * @param {(EntityController|object)} controller 
     * @param {boolean} [verify] Set to false to skip verification
     */
    assign(controller, verify = true) {
        if (verify && !(controller instanceof EntityController)) {
            return 2;
        }
        super.assign(controller, verify);
        if (EntityController.debugMode) console.group(`Running {EntityController} ${this.id}.assign(controllerObject, ${verify})`);
        if (controller.hasOwnProperty("height")) this.height = controller.height;
        if (controller.hasOwnProperty("width")) this.width = controller.width;
        if (controller.hasOwnProperty("depth")) this.depth = controller.depth;
        if (controller.hasOwnProperty("defaultAction")) this.setDefaultAction(controller.defaultAction);
        if (controller.hasOwnProperty("availableActions")) {
            this.availableActions = {};
            for (let action in controller.availableActions) {
                this.addAvailableAction(action);
            }
        }
        if (controller.hasOwnProperty("hiddenAvailableActions")) {
            this.hiddenAvailableActions = {};
            for (let action in controller.hiddenAvailableActions) {
                this.addHiddenAvailableAction(action);
            }
        }
        if (EntityController.debugMode) console.groupEnd();
        return 0;
    }
    updateID(newID) {
        super.updateID(newID);
        EntityController.updateID(this.id, newID);
        return 0;
    }
    dispose() {
        this.setLocked(true);
        this.setEnabled(false);
        for (let boneName in this.bones) {
            this.bones[boneName] = null;
        }
        if (EditControls.pickedController == this) {
            EditControls.reset();
        }
        else if (EditControls.previousPickedController == this) {
            EditControls.previousPickedController = null;
        }
        this.propertiesChanged = false;
        if (this.hasCompoundController()) {
            this.removeCompoundController(true);
        }
        EntityController.remove(this.id);
        super.dispose();
        Game.removeMesh(this.collisionMesh);
        return null;
    }
    getClassName() {
        return "EntityController";
    }

    static initialize() {
        EntityController.entityControllerList = {};
        EntityController.debugMode = false;
        EntityController.debugVerbosity = 2;
    }
    static get(id) {
        if (EntityController.has(id)) {
            return EntityController.entityControllerList[id];
        }
        return 1;
    }
    static has(id) {
        return EntityController.entityControllerList.hasOwnProperty(id);
    }
    static set(id, entityController) {
        EntityController.entityControllerList[id] = entityController;
        return 0;
    }
    static remove(id) {
        delete EntityController.entityControllerList[id];
        return 0;
    }
    static list() {
        return EntityController.entityControllerList;
    }
    static clear() {
        for (let i in EntityController.entityControllerList) {
            EntityController.entityControllerList[i].dispose();
        }
        EntityController.entityControllerList = {};
        return 0;
    }
    static updateID(oldID, newID) {
        if (!EntityController.has(oldID)) {
            return 1;
        }
        EntityController.set(newID, EntityController.get(oldID));
        EntityController.remove(oldID);
        return 0;
    }
    static setDebugMode(debugMode) {
        if (debugMode == true) {
            EntityController.debugMode = true;
            for (let entityController in EntityController.entityControllerList) {
                EntityController.entityControllerList[entityController].debugMode = true;
            }
        }
        else if (debugMode == false) {
            EntityController.debugMode = false;
            for (let entityController in EntityController.entityControllerList) {
                EntityController.entityControllerList[entityController].debugMode = false;
            }
        }
        return 0;
    }
    static getDebugMode() {
        return EntityController.debugMode === true;
    }
}
EntityController.initialize();
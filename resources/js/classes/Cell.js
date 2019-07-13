class Cell {
    /**
     * Creates a Cell
     * @param  {string} id Unique ID, auto-generated if none given
     * @param  {string} name Name
     */
    constructor(id = "", name = "") {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        this.id = id;
        this.name = null;
        this.setName(name);
        this.cellType = CellTypeEnum.NONE;
        this.owner = null;
        this.skyboxMaterial = null;
        this.ambientLight = new BABYLON.HemisphericLight("cellAmbientLight", new BABYLON.Vector3(0, 1, 0), Game.scene);
        this.ambientLight.intensity = 0.9;
        this.hasBackloggedAdditions = false;
        this.backloggedCollisionPlanes = [];
        this.hasBackloggedCollisionPlanes = false;
        this.backloggedCollisionRamps = [];
        this.hasBackloggedCollisionRamps = false;
        this.backloggedCollisionWalls = [];
        this.hasBackloggedCollisionWalls = false;
        this.backloggedMeshes = [];
        this.hasBackloggedMeshes = false;
        this.backloggedDoors = [];
        this.hasBackloggedDoors = false;
        this.backloggedFurniture = [];
        this.hasBackloggedFurniture = false;
        this.backloggedLighting = [];
        this.hasBackloggedLighting = false;
        this.backloggedCharacters = [];
        this.hasBackloggedCharacters = false;
        this.backloggedItems = [];
        this.hasBackloggedItems = false;

        Game.setCell(this.id, this);
    }

    getID() {
        return this.id;
    }
    getType() {
        return this.cellType;
    }
    setType(cellType) {
        if (cellTypeEnum.properties.hasOwnProperty(cellType)) {
            this.cellType = cellType;
        }
        else {
            this.cellType = cellType.NONE;
        }
        return 0;
    }
    setName(name) {
        this.name = Tools.filterName(name);
        return 0;
    }
    getName() {
        return this.name;
    }
    getSkyboxMaterial() {
        return this.skyboxMaterial;
    }
    getSkybox() {
        return Game.skybox;
    }
    setSkybox(skyboxMaterial) {
        this.skyboxMaterial = skyboxMaterial;
        Game.skybox.material = skyboxMaterial;
    }

    /**
     * Sets Owner
     * @param {CharacterEntity} characterEntity Character, or undefined
     */
    setOwner(characterEntity) {
        if (!(characterEntity instanceof AbstractEntity)) {
            if (Game.hasInstancedEntity(characterEntity)) {
                characterEntity = Game.getInstancedEntity(characterEntity);
            }
            else if (Game.hasEntity(characterEntity)) {
                characterEntity = Game.getEntity(characterEntity);
            }
            else {
                return 2;
            }
        }
        this.owner = characterEntity;
        return 0;
    }
    getOwner() {
        return this.owner;
    }
    hasOwner() {
        return this.owner instanceof AbstractEntity;
    }
    removeOwner() {
        this.owner = null;
        return 0;
    }
    clearOwner() {
        return this.removeOwner();
    }

    addCollisionWall(...parameters) {
        if (Game.cell == this) {
            Game.createCollisionWall(...parameters);
            return 0;
        }
        this.backloggedCollisionWalls.push(parameters);
        this.hasBackloggedCollisionWalls = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    addCollisionPlane(...parameters) {
        if (Game.cell == this) {
            Game.createCollisionPlane(...parameters);
            return 0;
        }
        this.backloggedCollisionPlanes.push(parameters);
        this.hasBackloggedCollisionPlanes = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    addCollisionRamp(...parameters) {
        if (Game.cell == this) {
            Game.createCollisionRamp(...parameters);
            return 0;
        }
        this.backloggedCollisionRamps.push(parameters);
        this.hasBackloggedCollisionRamps = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a mesh from those stored in loadedMeshes
     * @param  {string} id New ID for BABYLON.Mesh and EntityController
     * @param  {string} meshID String ID of Mesh to create
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {number} Integer status code
     */
    addMesh(...parameters) {
        parameters = Game.filterCreateMesh(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[1])) {
                Game.createMesh(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[1]);
            }
        }
        this.backloggedMeshes.push(parameters);
        this.hasBackloggedMeshes = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a mesh from those stored in loadedMeshes
     * @param  {string} id New ID for BABYLON.Mesh and EntityController
     * @param  {string} meshID String ID of Mesh to create
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {number} Integer status code
     */
    addCollidableMesh(...parameters) {
        parameters = Game.filterCreateMesh(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[1])) {
                Game.createCollidableMesh(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[1]);
            }
        }
        parameters[6]["checkCollisions"] = true;
        this.backloggedMeshes.push(parameters);
        this.hasBackloggedMeshes = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a character mesh, and controller.
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {CharacterEntity} characterEntity Character entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scale
     * @param  {object} [options] Options
     * @return {number} Integer status code
     */
    addCharacter(...parameters) {
        parameters = Game.filterCreateCharacterInstance(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[1].getMeshID())) {
                Game.createCharacterInstance(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[1].getMeshID());
            }
        }
        this.backloggedCharacters.push(parameters);
        this.hasBackloggedCharacters = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a DoorController, DoorEntity, and BABYLON.InstancedMesh
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {string} [name] Name
     * @param  {object} [to] Future movement between cells
     * @param  {string} [meshID] Mesh ID
     * @param  {string} [materialID] Texture ID
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {number} Integer status code
     */
    addDoor(...parameters) {
        parameters = Game.filterCreateDoor(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[3])) {
                Game.createDoor(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[3]);
            }
        }
        this.backloggedDoors.push(parameters);
        this.hasBackloggedDoors = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a FurnitureController, FurnitureEntity, and BABYLON.InstancedMesh
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {FurnitureEntity} furnitureEntity Furniture entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {number} Integer status code
     */
    addFurniture(...parameters) {
        parameters = Game.filterCreateFurnitureInstance(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[1].getMeshID())) {
                Game.createFurnitureInstance(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[1].getMeshID());
            }
        }
        this.backloggedFurniture.push(parameters);
        this.hasBackloggedFurniture = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Creates a LightingEntity, LightingEntity, and BABYLON.InstancedMesh
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} meshID Mesh ID
     * @param {string} [materialID] Texture ID
     * @param {number} [lightingType] IDK yet :v; TODO: this
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {number} Integer status code
     */
    addLighting(...parameters) {
        parameters = Game.filterCreateLighting(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[2])) {
                Game.createLighting(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[2]);
            }
        }
        this.backloggedLighting.push(parameters);
        this.hasBackloggedLighting = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }
    /**
     * Places, or creates from an ItemEntity, an InstancedItemEntity in the world at the given position.
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {(AbstractEntity|string)} abstractEntity Abstract entity; preferably an InstancedItemEntity
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {number} Integer status code
     */
    addItem(...parameters) {
        parameters = Game.filterCreateItemInstance(...parameters);
        if (Game.cell == this) {
            if (Game.hasLoadedMesh(parameters[1].getMeshID())) {
                Game.createItemInstance(...parameters);
                return 0;
            }
            else {
                Game.loadMesh(parameters[1].getMeshID());
            }
        }
        this.backloggedItems.push(parameters);
        this.hasBackloggedItems = true;
        this.hasBackloggedAdditions = true;
        return 1;
    }

    createBackloggedAdditions() {
        if (this.hasBackloggedAdditions) {
            this.hasBackloggedAdditions = false;
            let array = null;
            if (this.hasBackloggedCollisionPlanes) {
                array = this.backloggedCollisionPlanes;
                this.hasBackloggedCollisionPlanes = false;
                this.backloggedCollisionPlanes = [];
                array.forEach((addition) => {this.addCollisionPlane(...addition);});
                array.clear();
            }
            if (this.hasBackloggedCollisionRamps) {
                array = this.backloggedCollisionRamps;
                this.hasBackloggedCollisionRamps = false;
                this.backloggedCollisionRamps = [];
                array.forEach((addition) => {this.addCollisionRamp(...addition);});
                array.clear();
            }
            if (this.hasBackloggedCollisionWalls) {
                array = this.backloggedCollisionWalls;
                this.hasBackloggedCollisionWalls = false;
                this.backloggedCollisionWalls = [];
                array.forEach((addition) => {this.addCollisionWall(...addition);});
                array.clear();
            }
            if (this.hasBackloggedMeshes) {
                array = this.backloggedMeshes;
                this.hasBackloggedMeshes = false;
                this.backloggedMeshes = [];
                array.forEach((addition) => {this.addMesh(...addition);});
                array.clear();
            }
            if (this.hasBackloggedDoors) {
                array = this.backloggedDoors;
                this.hasBackloggedDoors = false;
                this.backloggedDoors = [];
                array.forEach((addition) => {this.addDoor(...addition);});
                array.clear();
            }
            if (this.hasBackloggedFurniture) {
                array = this.backloggedFurniture;
                this.hasBackloggedFurniture = false;
                this.backloggedFurniture = [];
                array.forEach((addition) => {this.addFurniture(...addition);});
                array.clear();
            }
            if (this.hasBackloggedLighting) {
                array = this.backloggedLighting;
                this.hasBackloggedLighting = false;
                this.backloggedLighting = [];
                array.forEach((addition) => {this.addLighting(...addition);});
                array.clear();
            }
            if (this.hasBackloggedCharacters) {
                array = this.backloggedCharacters;
                this.hasBackloggedCharacters = false;
                this.backloggedCharacters = [];
                array.forEach((addition) => {this.addCharacter(...addition);});
                array.clear();
            }
            if (this.hasBackloggedItems) {
                array = this.backloggedItems;
                this.hasBackloggedItems = false;
                this.backloggedItems = [];
                array.forEach((addition) => {this.addItem(...addition);});
                array.clear();
            }
        }
    }

    dispose() {
        Game.removeCell(this.id);
        return undefined;
    }
}
class FurnitureController extends EntityController {
    constructor(id, mesh, entity) {
        super(id, mesh, entity);

        // containers, doors: opening, opened, closing, closed
        // maybe make 90_idle01 closed
        if (this.skeleton instanceof BABYLON.Skeleton) {
            this.createAnimatableFromRangeName("closed", "10_closed01", false);
            this.createAnimatableFromRangeName("open", "80_open01", false);
            this.createAnimatableFromRangeName("opened", "10_opened01", false);
            this.createAnimatableFromRangeName("close", "80_close01", false);
            this.createAnimationGroupFromAnimatables("closed", "closed", 1.0, false);
            this.createAnimationGroupFromAnimatables("open", "open", 0.0, false);
            this.createAnimationGroupFromAnimatables("opened", "opened", 0.0, false);
            this.createAnimationGroupFromAnimatables("close", "close", 0.0, false);
            this.animated = true;
        }

        FurnitureController.set(this.id, this);
    }

    createCollisionMesh() {
        this.collisionMesh = Game.createAreaMesh(String(this.id).concat("-collisionMesh"), "CUBE", this.mesh.getBoundingInfo().boundingBox.extendSize.x * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.y * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.z * 2, this.mesh.position, this.mesh.rotation);
        return this;
    }
    createMesh(id = "", stageIndex = this.currentMeshStage, position = this.getPosition(), rotation = this.getRotation(), scaling = this.getScaling()) {
        if (this.mesh instanceof BABYLON.AbstractMesh) {
            return 1;
        }
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        return Game.createFurnitureMesh(id, this.meshStages[stageIndex], this.materialStages[stageIndex], position, rotation, scaling);
    }

    moveAV() { // animate it :V
        /*var anim = null;
        var dt = Game.engine.getDeltaTime() / 1000;
        anim = this.doIdle(dt);
        this.beginAnimation(anim);*/
        return this;
    }

    dispose() {
        this.setLocked(true);
        this.setEnabled(false);
        FurnitureController.remove(this.id);
        super.dispose();
        return undefined;
    }
    getClassName() {
        return "FurnitureController";
    }

    static initialize() {
        FurnitureController.furnitureControllerList = {};
    }
    static get(id) {
        if (FurnitureController.has(id)) {
            return FurnitureController.furnitureControllerList[id];
        }
        return 1;
    }
    static has(id) {
        return FurnitureController.furnitureControllerList.hasOwnProperty(id);
    }
    static set(id, furnitureController) {
        FurnitureController.furnitureControllerList[id] = furnitureController;
        return 0;
    }
    static remove(id) {
        delete FurnitureController.furnitureControllerList[id];
        return 0;
    }
    static list() {
        return FurnitureController.furnitureControllerList;
    }
    static clear() {
        for (let i in FurnitureController.furnitureControllerList) {
            FurnitureController.furnitureControllerList[i].dispose();
        }
        FurnitureController.furnitureControllerList = {};
        return 0;
    }
}
FurnitureController.initialize();
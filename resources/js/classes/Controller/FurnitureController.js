/**
 * Furniture Controller
 */
class FurnitureController extends EntityController {
    /**
     * Creates a Furniture Controller
     * @param {string} id 
     * @param {BABYLON.AbstractMesh} mesh 
     * @param {object} entityObject 
     */
    constructor(id = "", mesh = null, entityObject = {}) {
        super(id, mesh, entityObject);
        if (!this.hasMesh()) {
            return undefined;
        }

        // containers, doors: opening, opened, closing, closed
        // maybe make 90_idle01 closed
        if (this.skeleton instanceof BABYLON.Skeleton) {
            this.createAnimatableFromRangeName("closed", "10_closed01", false);
            //this.createAnimatableFromRangeName("open", "80_open01", false);
            this.createAnimatableFromRangeName("opened", "10_opened01", false);
            //this.createAnimatableFromRangeName("close", "80_close01", false);
            if (this.hasAnimatable("opened") && this.hasAnimatable("closed")) {
                this.createAnimationGroupFromAnimatables("closed", "closed", 1.0, false);
                //this.createAnimationGroupFromAnimatables("open", "open", 0.0, false);
                this.createAnimationGroupFromAnimatables("opened", "opened", 0.0, false);
                //this.createAnimationGroupFromAnimatables("close", "close", 0.0, false);
                this.animated = true;
            }
        }

        FurnitureController.set(this.id, this);
    }

    createCollisionMesh() {
        let collisionMesh = Game.createAreaMesh(String(this.id).concat("-collisionMesh"), "CUBE", this.mesh.getBoundingInfo().boundingBox.extendSize.x * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.y * 2, this.mesh.getBoundingInfo().boundingBox.extendSize.z * 2, this.mesh.position, this.mesh.rotation);
        if (collisionMesh instanceof BABYLON.AbstractMesh) {
            this.collisionMesh = collisionMesh;
            return this.collisionMesh;
        }
        return null;
    }
    createMesh(id = "", stageIndex = this.currentMeshStage, position = this.getPosition(), rotation = this.getRotation(), scaling = this.getScaling()) {
        if (this.mesh instanceof BABYLON.AbstractMesh) {
            return null;
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
        return 0;
    }
    doOpen() {
        if (this.animated && this.hasAnimationGroup("opened") && this.hasAnimationGroup("closed")) {
            this.animationGroups["closed"].setWeightForAllAnimatables(0.0);
            //this.animationGroups["close"].setWeightForAllAnimatables(0.0);
            this.animationGroups["opened"].setWeightForAllAnimatables(1.0);
            //this.animationGroups["open"].setWeightForAllAnimatables(0.0);
            this.animationGroups["opened"].play(false);
        }
        this.removeHiddenAvailableAction(ActionEnum.CLOSE);
        this.setDefaultAction(ActionEnum.CLOSE);
        this.addHiddenAvailableAction(ActionEnum.OPEN);
        return 0;
    }
    doClose() {
        if (this.animated && this.hasAnimationGroup("opened") && this.hasAnimationGroup("closed")) {
            this.animationGroups["opened"].setWeightForAllAnimatables(0.0);
            //this.animationGroups["open"].setWeightForAllAnimatables(0.0);
            this.animationGroups["closed"].setWeightForAllAnimatables(1.0);
            //this.animationGroups["close"].setWeightForAllAnimatables(0.0);
            this.animationGroups["closed"].play(false);
        }
        this.setDefaultAction(ActionEnum.OPEN);
        this.removeHiddenAvailableAction(ActionEnum.OPEN);
        this.addHiddenAvailableAction(ActionEnum.CLOSE);
        return 0;
    }

    updateID(newID) {
        super.updateID(newID);
        FurnitureController.updateID(this.id, newID);
        return 0;
    }
    dispose() {
        this.setLocked(true);
        this.setEnabled(false);
        FurnitureController.remove(this.id);
        super.dispose();
        return null;
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
    static updateID(oldID, newID) {
        if (!FurnitureController.has(oldID)) {
            return 1;
        }
        FurnitureController.set(newID, FurnitureController.get(oldID));
        FurnitureController.remove(oldID);
        return 0;
    }
}
FurnitureController.initialize();
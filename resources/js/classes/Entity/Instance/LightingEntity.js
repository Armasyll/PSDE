/**
 * Instanced Lighting Entity
 */
class InstancedLightingEntity extends InstancedFurnitureEntity {
    /**
     * Creates an Instanced Lighting Entity
     * @param {string} id 
     * @param {LightingEntity} entity 
     * @param {(CreatureEntity|null)} [owner] 
     */
    constructor(id = "", entity = null, owner = null) {
        super(id, entity);
        if (!(this.entity instanceof Entity)) {
            this.dispose();
            return null;
        }

        this.lightOn = false;

        this.setOwner(owner);

        InstancedLightingEntity.set(this.id, this);
    }

    setLightOn(lightOn) {
        if (lightOn === true) {
            this.on();
        }
        else {
            this.off();
        }
        return 0;
    }
    getLightOn() {
        return this.lightOn;
    }
    on() {
        if (this.locked) {
            return this.lightOn;
        }
        this.lightOn = true;
    }
    off() {
        if (this.locked) {
            return this.lightOn;
        }
        this.lightOn = false;
    }
    toggle() {
        if (this.locked) {
            return this.lightOn;
        }
        if (this.lightOn) {
            this.off();
            return false;
        }
        else {
            this.on();
            return true;
        }
    }

    objectify() {
        let obj = super.objectify();
        obj["lightOn"] = this.lightOn;
        return obj;
    }
    objectifyMinimal() {
        let obj = super.objectifyMinimal();
        obj["lightOn"] = this.lightOn;
        return obj;
    }
    /**
     * Overrides InstancedFurnitureEntity.clone
     * @param  {string} id ID
     * @return {InstancedLightingEntity} new InstancedLightingEntity
     */
    clone(id = "") {
        if (!this.hasEntity()) {
            return 2;
        }
        let clone = new InstancedLightingEntity(id, this.entity, this.owner);
        clone.assign(this);
        if (this.hasContainer()) {
            clone.setContainer(this.container.clone(String(clone.id).concat("Container")));
        }
        return clone;
    }
    assign(entity) {
        if (verify && !(entity instanceof InstancedLightingEntity)) {
            return 2;
        }
        super.assign(entity);
        if (entity.hasOwnProperty("lightOn")) this.setLightOn(entity.lightOn);
        return 0;
    }
    updateID(newID) {
        super.updateID(newID);
        InstancedLightingEntity.updateID(this.id, newID);
        return 0;
    }
    dispose() {
        InstancedLightingEntity.remove(this.id);
        super.dispose();
        return undefined;
    }
    getClassName() {
        return "InstancedLightingEntity";
    }

    static initialize() {
        InstancedLightingEntity.instancedLightingEntityList = {};
    }
    static get(id) {
        if (InstancedLightingEntity.has(id)) {
            return InstancedLightingEntity.instancedLightingEntityList[id];
        }
        return 1;
    }
    static has(id) {
        return InstancedLightingEntity.instancedLightingEntityList.hasOwnProperty(id);
    }
    static set(id, instancedFurnitureEntity) {
        InstancedLightingEntity.instancedLightingEntityList[id] = instancedFurnitureEntity;
        return 0;
    }
    static remove(id) {
        delete InstancedLightingEntity.instancedLightingEntityList[id];
        return 0;
    }
    static list() {
        return InstancedLightingEntity.instancedLightingEntityList;
    }
    static clear() {
        for (let i in InstancedLightingEntity.instancedLightingEntityList) {
            InstancedLightingEntity.instancedLightingEntityList[i].dispose();
        }
        InstancedLightingEntity.instancedLightingEntityList = {};
        return 0;
    }
    static updateID(oldID, newID) {
        if (!InstancedLightingEntity.has(oldID)) {
            return 1;
        }
        InstancedLightingEntity.set(newID, InstancedLightingEntity.get(oldID));
        InstancedLightingEntity.remove(oldID);
        return 0;
    }
}
InstancedLightingEntity.initialize();
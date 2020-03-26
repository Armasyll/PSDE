class LightingEntity extends FurnitureEntity {
    /**
     * Creats Lighting
     * @param  {string}  id          Unique ID
     * @param  {string}  name        Name
     * @param  {string}  description Description
     * @param  {string}  iconID       Image ID
     */
    constructor(id = undefined, name = undefined, description = undefined, iconID = undefined, lightingType) {
        super(id, name, description, iconID, FurnitureEnum.LAMP);

        this.lightOn = true;

        this.addAvailableAction(ActionEnum.USE);
        this.setDefaultAction(ActionEnum.USE);

        LightingEntity.set(this.id, this);
    }

    on() {
        if (this.locked) {
            return this.lightOn;
        }
        this.lightOn = true;
        if (this.hasController()) {
            if (this.controller.hasLight()) {
                this.controller.getLight().setEnabled(true);
            }
        }
    }
    off() {
        if (this.locked) {
            return this.lightOn;
        }
        this.lightOn = false;
        if (this.hasController()) {
            if (this.controller.hasLight()) {
                this.controller.getLight().setEnabled(false);
            }
        }
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
    
    /**
     * Overrides FurnitureEntity.clone
     * @param  {string} id ID
     * @return {LightingEntity} new LightingEntity
     */
    clone(id = undefined) {
        return new LightingEntity(id, this.name, this.description, this.icon);
    }
    createInstance(id = "") {
        return new InstancedFurnitureEntity(id, this); // not really a door instance :v
    }
    /**
     * Clones the entity's values over this
     * @param {Entity} entity 
     * @param {boolean} [verify] Set to false to skip verification
     */
    assign(entity, verify = true) {
        if (verify && !(entity instanceof LightingEntity)) {
            return 2;
        }
        super.assign(entity, verify);
        if (entity.hasOwnProperty("lightOn")) {
            if (entity.lightOn === true) {
                this.on();
            }
            else {
                this.off();
            }
        }
        return 0;
    }
    dispose() {
        this.off();
        this.setLocked(true);
        this.setEnabled(false);
        LightingEntity.remove(this.id);
        super.dispose();
        return undefined;
    }
    getClassName() {
        return "LightingEntity";
    }

    static initialize() {
        LightingEntity.lightingEntityList = {};
    }
    static get(id) {
        if (LightingEntity.has(id)) {
            return LightingEntity.lightingEntityList[id];
        }
        return 1;
    }
    static has(id) {
        return LightingEntity.lightningEntityList.hasOwnProperty(id);
    }
    static set(id, lightEntity) {
        LightingEntity.lightingEntityList[id] = lightEntity;
        return 0;
    }
    static remove(id) {
        delete LightingEntity.lightingEntityList[id];
        return 0;
    }
    static list() {
        return LightingEntity.lightingEntityList;
    }
    static clear() {
        for (let i in LightingEntity.lightingEntityList) {
            LightingEntity.lightingEntityList[i].dispose();
        }
        LightingEntity.lightingEntityList = {};
        return 0;
    }
}
LightingEntity.initialize();
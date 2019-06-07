class InstancedClothingEntity extends InstancedEquipmentEntity {
    constructor(id = undefined, clothingEntity = undefined, owner = undefined) {
        super(id, clothingEntity);
        if (!(this.entity instanceof ClothingEntity)) {
            this.dispose();
            return undefined;
        }

        this.setOwner(owner);

        Game.setClothingInstance(this.id, this);
    }

    getArmourType() {
        return this.entity.getArmourType();
    }
    getArmourClass() {
        return this.entity.getArmourClass();
    }

    clone(id) {
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        return new InstancedClothingEntity(id, this.entity);
    }
    dispose() {
        Game.removeClothingInstance(this.id);
        super.dispose();
        return undefined;
    }
}
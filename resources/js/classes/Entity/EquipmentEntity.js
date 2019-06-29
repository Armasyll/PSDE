class EquipmentEntity extends ItemEntity {
    /**
     * Creats Equipment
     * @param  {string}  id          Unique ID
     * @param  {string}  name        Name
     * @param  {string}  description Description
     * @param  {string}  iconID       Image ID
     * @param  {ApparelSlotEnum}  equipmentSlot  Apparel slot enum
     */
    constructor(id = undefined, name = undefined, description = undefined, iconID = undefined, equipmentSlot = ApparelSlotEnum.NONE) {
        super(id, name, description, iconID);

        this.equipmentSlot = ApparelSlotEnum.NONE;

        this.addAvailableAction(ActionEnum.EQUIP);
        this.addAvailableAction(ActionEnum.UNEQUIP);
        this.setEquipmentSlot(equipmentSlot);
    }

    setEquipmentSlot(equipmentSlot) {
        if (ApparelSlotEnum.properties.hasOwnProperty(equipmentSlot)) {
            this.equipmentSlot = equipmentSlot;
        }
        else {
            this.equipmentSlot = ApparelSlotEnum.NONE;
        }
        return this;
    }
    getEquipmentSlot() {
        return this.equipmentSlot;
    }

    /**
     * Overrides ItemEntity.clone; not meant to be run.
     * @param  {string} id ID
     * @return {EquipmentEntity}     new EquipmentEntity
     */
    clone(id = undefined) {
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        var itemEntity = new EquipmentEntity(id, this.name, this.description, this.icon, this.equipmentSlot);
        // variables from AbstractEntity
        itemEntity.availableActions = Object.assign({}, this.availableActions);
        itemEntity.hiddenAvailableActions = Object.assign({}, this.hiddenAvailableActions);
        itemEntity.specialProperties = new Set(this.specialProperties);
        itemEntity.defaultAction = this.defaultAction;
        // variables from Entity
        itemEntity.weight.copyFrom(this.weight);
        itemEntity.price.copyFrom(this.price);
        itemEntity.health.copyFrom(this.health);
        // variables from ItemEntity
        itemEntity.itemType = this.itemType;
        return itemEntity;
    }
    /**
     * Overrides ItemEntity.createInstance; not meant to be run.
     * @param  {string} id ID
     * @return {InstancedEquipmentEntity}     new InstancedEquipmentEntity
     */
    createInstance(id = undefined) {
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        return new InstancedEquipmentEntity(id, this);
    }
    dispose() { // TODO: what about the instances :v
        super.dispose();
        for (var _var in this) {
            this[_var] = null;
        }
        return undefined;
    }
}
class WeaponEntity extends ItemEntity {
    /**
     * Creats Weapon
     * @param  {String}  _id          Unique ID
     * @param  {String}  _name        Name
     * @param  {String}  _description Description
     * @param  {String}  _image       Image path or base64
     * @param  {String}  _type        weaponType
     */
    constructor(_id = undefined, _name = undefined, _description = undefined, _image = undefined, _type = "club") {
        super(_id, _name, _description, _image);
        this.itemType = ItemEnum.WEAPON;

        this.equipmentSlot = ApparelSlotEnum.HANDS;

        this.addAvailableAction(ActionEnum.EQUIP);
        this.addAvailableAction(ActionEnum.UNEQUIP);
        this.setType(_type);

        Game.setWeaponEntity(this.id, this);
    }

    setType(_type) {
        if (Game.kWeaponTypes.has(_type)) {
            this.type = _type;
        }
        else {
            this.type = "club";
        }
        return this;
    }

    /**
     * Overrides ItemEntity.createInstance
     * @param  {[type]} _id [description]
     * @return {[type]}     [description]
     */
    createInstance(_id = undefined) {
        _id = Game.filterID(_id);
        if (typeof _id != "string") {
            _id = genUUIDv4();
        }
        return new InstancedWeaponEntity(_id, this);
    }
    dispose() {
        Game.removeWeaponEntity(this.id);
        super.dispose();
        for (var _var in this) {
            this[_var] = null;
        }
        return undefined;
    }
}
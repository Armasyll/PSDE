class ClothingEntity extends ItemEntity {
    /**
     * Creats Clothing
     * @param  {String}  _id          Unique ID
     * @param  {String}  _name        Name
     * @param  {String}  _description Description
     * @param  {String}  _image       Image path or base64
     * @param  {String}  _type        clothingType
     * @param  {Boolean} _plural      Whether or not the item is plural
     */
    constructor(_id = undefined, _name = undefined, _description = undefined, _image = undefined, _type = "shirt", _plural = false) {
        super(_id, _name, _description, _image, _plural);

        this.addAvailableAction("equip");
        this.addAvailableAction("unequip");
        this.setType(_type);

        Game.clothingEntities[this.id] = this;
    }
    setType(_type) {
        if (Game.kClothingTypes.has(_type)) {
            this.type = _type;
        }
        else {
            this.type = "shirt";
        }
        return this;
    }
	dispose() {
        delete Game.clothingEntities[this.id];
        super.dispose();
        for (var _var in this) {
            this[_var] = null;
        }
        return undefined;
	}
}
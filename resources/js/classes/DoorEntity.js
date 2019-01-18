class DoorEntity extends Entity {
    constructor(_id = undefined, _name = undefined, _description = undefined, _image = undefined, _key = undefined) {
        super(_id, _name, _description, _image);
        this.locked = false;
        this.key = undefined;
        this.addAvailableAction("close");
        this.addAvailableAction("open");

        Game.setDoorEntity(this.id, this);
	}
	setLocked(_locked) {
		this.locked = _locked == true;
	}
	getLocked() {
		return this.locked;
	}
	setKey(_itemEntity) {
		_itemEntity = Game.getProtoItemEntity(_itemEntity);
		if (_itemEntity == undefined) {return;}
		this.key = _itemEntity;
	}
	getKey() {
		return this.key;
	}
	dispose() {
        Game.removeDoorEntity(this.id);
        super.dispose();
        for (var _var in this) {
            this[_var] = null;
        }
        return undefined;
	}
}
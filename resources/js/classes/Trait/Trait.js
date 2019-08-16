class Trait {
    constructor(id = "", name = "", description = "", iconID = "genericItem") {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconID = iconID;
        /**
         * Object<string, function>
         */
        this.modifiers = {};
        this.priority = 1000;
        this.hidden = false;
        this.stackCount = 1;
        Game.setTrait(this.id, this);
    }
    addModifier(property, modification) { // TODO: what about unmodifying?
        if (this.allowedProperty(property)) {
            if (typeof modification == "function" && typeof modification(1) != "undefined") {
                this.modifiers[property] = modification;
            }
        }
        return this;
    }
    getModifier(property) {
        if (this.modifiers.hasOwnProperty(property)) {
            return this.modifiers[property];
        }
        return 1;
    }
    hasModifier(property) {
        return this.modifiers.hasOwnProperty(property);
    }
    getModifiers() {
        return this.modifiers;
    }
    getPriority() {
        return this.priority;
    }
    setPriority(number) {
        this.priority = number;
    }
    isHidden() {
        return this.hidden;
    }
    setHidden(boolean = true) {
        this.isHidden = boolean == true;
        return this;
    }
    getStackCount() {
        return this.stackCount;
    }
    setStackCount(number) {
        if (typeof number != "number") {number = Math.abs(Number.parseInt(number)) | 1;}
        else {number = number|0}
        this.stackCount = number;
        return this;
    }
    static allowedProperties() {
        return [
            "godMode",
            "essential",
            "health",
            "healthMaxOffset"
        ];
    }
    allowedProperty(property) {
        return Trait.allowedProperties().indexOf(property) != -1;
    }
}
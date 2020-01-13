class EquipmentEntityEffect extends ItemEntityEffect {
    constructor(id = "", name = "", description = "", iconID = "genericItem") {
        super(id, name, description, iconID);
    }
    static allowedProperties() {
        return super.allowedProperties().concat([
            "damageRollCountModifier",
            "damageRollModifier",
            "silveredModifier"
        ]);
    }
    allowedProperty(property) {
        return EquipmentEntityEffect.allowedProperties().indexOf(property) != -1;
    }
}
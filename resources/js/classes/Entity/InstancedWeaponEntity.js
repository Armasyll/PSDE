class InstancedWeaponEntity extends InstancedEquipmentEntity {
    constructor(id = undefined, weaponEntity = undefined, owner = undefined) {
        super(id, weaponEntity);
        if (!(this.entity instanceof WeaponEntity)) {
            this.dispose();
            return undefined;
        }

        this.setOwner(owner);

        Game.setWeaponInstance(this.id, this);
    }

    getWeaponCategory() {
        return this.entity.getWeaponCategory();
    }
    getThrownRange() {
        return this.entity.getThrownRange();
    }
    getAmmunitionRange() {
        return this.entity.getAmmunitionRange();
    }
    getDamageType() {
        return this.entity.getDamageType();
    }
    getDamageRoll() {
        return this.entity.getDamageRoll();
    }
    getDamageRollCount() {
        return this.entity.getDamageRollCount();
    }
    getWeaponType() {
        return this.entity.getWeaponType();
    }
    getWeaponProperties() {
        return this.entity.getWeaponProperties();
    }

    clone(id = "") {
        return new InstancedWeaponEntity(id, this.entity, this.owner);
    }
    dispose() {
        Game.removeWeaponInstance(this.id);
        super.dispose()
        for (var _var in this) {
            this[_var] = null;
        }
        return undefined;
    }
}
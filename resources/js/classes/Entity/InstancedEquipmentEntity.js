class InstancedEquipmentEntity extends InstancedItemEntity {
    constructor(_id = undefined, _entity = undefined, _owner = undefined) {
        super(_id, _entity);
        if (!(this.entity instanceof EquipmentEntity)) {
            this.dispose();
            return undefined;
        }

        this.setOwner(_owner);
    }

    getEquipmentSlot() {
        return this.entity.getEquipmentSlot();
    }
    hasAbilityScoreRequirement(...args) {
        return this.entity.hasAbilityScoreRequirement(...args);
    }
    getAbilityScoreRequirement(...args) {
        return this.entity.getAbilityScoreRequirement(...args);
    }
    hasAdvantageOn(...args) {
        return this.entity.hasAdvantageOn(...args);
    }
    getAdvantageOn() {
        return this.entity.getAdvantageOn();
    }
    hasDisadvantageOn(...args) {
        return this.entity.hasDisadvantageOn(...args);
    }
    getDisadvantageOn() {
        return this.entity.getDisadvantageOn();
    }

    /**
     * Overrides InstancedItemEntity.clone
     * @param  {string} id          ID
     * @return {Entity}             new InstancedEquipmentEntity
     */
    clone(id = "") {
        if (!this.hasEntity()) {
            return this;
        }
        let clone = new InstancedEquipmentEntity(id, this.entity, this.owner);
        clone.assign(this);
        return clone;
    }
    assign(entity, verify = true) {
        if (verify && !(entity instanceof InstancedEquipmentEntity)) {
            return 2;
        }
        super.assign(entity, verify);
        return 0;
    }
    dispose() {
        super.dispose();
        return undefined;
    }
}
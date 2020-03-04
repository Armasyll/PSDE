class AbstractEntity {
    /**
     * Creates an AbstractEntity
     * @param  {string} id Unique ID, auto-generated if none given
     * @param  {string} name Name
     * @param  {string} [description] Description
     * @param  {string} [iconID] Icon ID
     */
    constructor(id = "", name = "", description = "", iconID = "genericItem") {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        this.id = id;
        this.entityType = EntityEnum.ABSTRACT;
        this.name = "";
        this.setName(name);
        this.description = "";
        this.setDescription(description);
        this.iconID = "";
        this.setIcon(iconID);
        this.controller = null;
        this.owner = "";
        this.target = null;
        this.health = 10;
        this.healthModifier = 0;
        this.maxHealth = 10;
        this.maxHealthModifier = 0;
        this.availableActions = {};
        this.hiddenAvailableActions = {};
        this.specialProperties = {};
        this.defaultAction = null;
        this.godMode = false;
        this.godModeModifier = false;
        this.enabled = true;
        this.locked = false;
        this.essential = false;
        this.essentialModifier = false;
        this.inventory = null;
        /**
         * @type {object}
         * Object<EffectID: <"currentStack":StackNumber, "startTime":TimeStart, "endTime":TimeEnd>>
         */
        this.effects = {};
        /**
         * @type {object}
         * Object<number: Set<Effect>
         */
        this.effectsPriority = {};
        /**
         * Effects triggered on action
         * @type {object}
         * Object<TargetEntity: <ActionEnum:Effect>>
         */
        this.actionEffects = {};
        AbstractEntity.set(this.id, this);
    }

    setID(id) {
        this.locked = true;
        AbstractEntity.remove(this.id);
        id = Tools.filterID(id);
        this.id = id;
        AbstractEntity.set(this.id, this);
        this.locked = false;
        return 0;
    }
    getID() {
        return this.id;
    }
    setID(id) {
        if (this.locked) {
            id = Tools.filterID(id);
            if (id.length > 0) {
                this.id = id;
            }
            return 0;
        }
        return 1;
    }
    getType() {
        return this.entityType;
    }
    setName(name) {
        this.name = Tools.filterName(name);
        return 0;
    }
    getName() {
        return this.name;
    }
    setDescription(description) {
        this.description = Tools.filterName(description);
        return 0;
    }
    getDescription() {
        return this.description;
    }
    setIcon(iconID) {
        if (Game.hasIcon(iconID)) {
            this.iconID = iconID;
        }
        else {
            this.iconID = "missingIcon";
        }
        return 0;
    }
    getIcon() {
        return this.iconID;
    }

    setHealth(number) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        if (this.getGodMode()) {
            this.health = this.getMaxHealth();
            return 0;
        }
        if (number > this.getMaxHealth()) {
            number = this.getMaxHealth();
        }
        else if (number < 0) {
            number = 0;
        }
        if (this.isEssential()) {
            if (number < 1) {
                number = 1;
            }
        }
        this.health = number;
        if (this.health <= 0) {
            this.living = false;
            if (this.hasController()) {
                this.controller.doDeath();
            }
        }
        return 0;
    }
    modifyHealth(number = 1) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        return this.setHealth(this.health + number);
    }
    getHealth() {
        return this.health + this.healthModifier;
    }
    setHealthModifier(number) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        this.healthModifier = number; // TODO: figure out if the character is dead after this :v
        return 0;
    }

    setMaxHealth(number) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        if (number <= 0) {
            number = 1;
        }
        let oldMaxHealth = this.getMaxHealth();
        this.maxHealth = number;
        if (this.health > this.getMaxHealth()) {
            this.health = this.getMaxHealth();
        }
        this.recalculateHealthByModifiedMaxHealth(oldMaxHealth);
        return 0;
    }
    modifyMaxHealth(number = 1) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        return this.setMaxHealth(this.maxHealth + number);
    }
    getMaxHealth() {
        return this.maxHealth + this.maxHealthModifier;
    }
    setMaxHealthModifier(number) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        let oldMaxHealth = this.getMaxHealth();
        this.maxHealthModifier = number;
        this.recalculateHealthByModifiedMaxHealth(oldMaxHealth);
        return 0;
    }
    modifyMaxHealthModifier(number = 1) {
        if (typeof number != "number") {number = Number.parseInt(number) || 0;}
        else {number = number|0}
        return this.setMaxHealthModifier(this.maxHealthModifier + number);
    }
    recalculateHealthByModifiedMaxHealth(oldMaxHealth) {
        let multiplier = this.getMaxHealth() / oldMaxHealth;
        let health = Math.ceil(this.getHealth() * multiplier);
        if (health > this.getMaxHealth()) {
            health = this.getMaxHealth();
        }
        this.setHealth(health);
        return 0;
    }

    setGodMode(boolean = true) {
        this.godMode = boolean == true;
        return 0;
    }
    enableGodMode() {
        return this.setGodMode(true);
    }
    disableGodMode() {
        return this.setGodMode(false);
    }
    getGodMode() {
        return this.godMode || this.godModeModifier;
    }

    isEnabled() {
        return this.enabled == true;
    }
    setEnabled(isEnabled = true) {
        this.enabled = (isEnabled == true);
        return 0;
    }

    isLocked() {
        return this.locked == true;
    }
    setLocked(isLocked = true) {
        this.locked = (isLocked == true);
        return 0;
    }

    setController(entityController) {
        if (entityController instanceof EntityController) {
            this.controller = entityController;
            return 0;
        }
        return 2;
    }
    getController() {
        return this.controller;
    }
    hasController() {
        return this.controller instanceof EntityController;
    }
    removeController() {
        this.controller = undefined;
        return 0;
    }
    getPosition() {
        if (this.hasController()) {
            return this.controller.getPosition();
        }
        return BABYLON.Vector3.Zero();
    }
    getRotation() {
        if (this.hasController()) {
            return this.controller.getRotation();
        }
        return BABYLON.Vector3.Zero();
    }
    getScaling() {
        if (this.hasController()) {
            return this.controller.getScaling();
        }
        return BABYLON.Vector3.One();
    }

    /**
     * Sets Owner
     * @param {CharacterEntity} creatureEntity Character, or undefined
     */
    setOwner(creatureEntity) {
        if (!(creatureEntity instanceof CreatureEntity)) {
            if (CreatureEntity.has(creatureEntity)) {
                creatureEntity = CreatureEntity.get(creatureEntity);
            }
            else {
                return 2;
            }
        }
        this.owner = creatureEntity.id;
        return 0;
    }
    getOwner() {
        return this.owner;
    }
    hasOwner() {
        return CreatureEntity.has(this.owner);
    }
    removeOwner() {
        this.owner = null;
        return 0;
    }
    clearOwner() {
        return this.removeOwner();
    }

    setTarget(abstractEntity) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(characterEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        this.target = abstractEntity.id;
        return 0;
    }
    getTarget() {
        return this.target;
    }
    hasTarget() {
        return AbstractEntity.has(this.target);
    }
    removeTarget() {
        this.target = null;
        return 0;
    }
    clearTarget() {
        return this.removeTarget();
    }

    setEssential(isEssential = true) {
        this.essential = isEssential == true;
        if (this.essential) {
            Game.setEssentialEntity(this);
        }
        else {
            Game.removeEssentialEntity(this);
        }
        return 0;
    }
    isEssential() {
        return this.essential || this.essentialModifier;
    }

    kill() {
        this.setHealth(0);
        return 0;
    }
    resurrect(number = 1) {
        if (typeof number != "number") { number = Number.parseInt(number) | 1; }
        else { number = Math.abs(number | 0) || 1 }
        this.setHealth(number);
        this.living = true;
        return 0;
    }

    addEffect(effect) {
        if (!(effect instanceof Effect)) {
            if (Effect.has(effect)) {
                effect = Effect.get(effect);
            }
            else {
                return 2;
            }
        }
        if (Game.debugMode) console.log(`Running ${this.getID()}.addEffect(${effect.getID()})`);
        let id = effect.getID()
        if (this.effects.hasOwnProperty(id)) {
            if (this.effects[id]["currentStack"] < effect.getStackCount()) {
                this.effects[id]["currentStack"] += 1;
            }
        }
        else {
            this.effects[id] = {"currentStack":1, "timeStart":0, "timeEnd":0};
        }
        let priority = effect.getPriority();
        if (!this.effectsPriority.hasOwnProperty(priority)) {
            this.effectsPriority[priority] = new Set();
        }
        this.effectsPriority[priority].add(id);
        this.applyEffects();
        return 0;
    }
    removeEffect(effect) {
        if (!(effect instanceof Effect)) {
            if (Effect.has(effect)) {
                effect = Effect.get(effect);
            }
            else {
                return 2;
            }
        }
        if (Game.debugMode) console.log(`Running ${this.getID()}.removeEffect(${effect.getID()})`);
        let id = effect.getID()
        let priority = effect.getPriority();
        if (this.effectsPriority.hasOwnProperty(priority)) {
            if (this.effectsPriority[priority].has(id) && this.effects.hasOwnProperty(id)) {
                if (this.effects[id]["currentStack"] == 1) {
                    delete this.effects[id]["timeEnd"];
                    delete this.effects[id]["timeStart"];
                    delete this.effects[id]["currentStack"];
                    delete this.effects[id];
                    this.effectsPriority[priority].delete(id);
                }
                else {
                    this.effects[id]["currentStack"] -= 1;
                }
            }
            if (this.effectsPriority[priority].size == 0) {
                delete this.effectsPriority[priority];
            }
        }
        this.applyEffects();
        for (let modifier in effect.getModifiers()) {
            if (this.hasOwnProperty(modifier)) {
                switch (modifier) {
                    case "healthModifier":
                    case "maxHealthModifier": {
                        if (this.health > this.getMaxHealth()) {this.health = this.getMaxHealth();}
                        break;
                    }
                }
            }
        }
        return 0;
    }
    applyEffects() {
        if (Game.debugMode) console.log(`Running ${this.getID()}.applyEffects()`);
        this.resetModifiers();
        for (let priority in this.effectsPriority) {
            this.effectsPriority[priority].forEach((effectID) => {
                this.applyEffect(effectID);
            });
        }
        return 0;
    }
    /**
     * 
     * @param {Effect} effect 
     */
    applyEffect(effect) {
        if (!(effect instanceof Effect)) {
            if (Effect.has(effect)) {
                effect = Effect.get(effect);
            }
            else {
                return 2;
            }
        }
        if (Game.debugMode) console.log(`Running ${this.getID()}.applyEffect(${effect.getID()})`);
        for (let property in effect.getModifiers()) { // for every property modified
            for (let i = 0; i < this.effects[effect.getID()]["currentStack"]; i++) { // we apply for each number in the stack
                switch (property) {
                    case "healthModifier": {
                        this.setHealth(effect.calculateModifier(property, this));
                        break;
                    }
                    case "maxHealthModifier": {
                        this.setMaxHealthModifier(effect.calculateModifier(property, this));
                        break;
                    }
                    default: {
                        if (typeof this[property] == "number") {
                            this[property] = effect.calculateModifier(property, this);
                        }
                        else if (this[property] instanceof Set) {
                            if (effect.modifiers[property]["operation"] == OperationsEnum.ADD) {
                                this[property].add(effect.modifiers[property]["modification"]);
                            }
                            else if (effect.modifiers[property]["operation"] == OperationsEnum.SUBTRACT) {
                                this[property].delete(effect.modifiers[property]["modification"]);
                            }
                        }
                    }
                }
            }
        }
        if (effect.getInterval() == IntervalEnum.ONCE) {
            return 0;
        }
        Game.addScheduledEffect(effect, this);
        return 0;
    }
    getEffects() {
        return this.effects;
    }
    clearEffects() {
        for (let priority in this.effects) {
            obj[priority].clear();
            delete obj[priority];
        }
        this.resetModifiers();
        return 0;
    }

    hasInventory() {
        return this.inventory instanceof Inventory;
    }
    getInventory() {
        return this.inventory;
    }
    setInventory(inventory, updateChild = true) {
        if (this instanceof CharacterEntity || this instanceof InstancedFurnitureEntity) {
            if (inventory instanceof Inventory) {
                this.inventory = inventory;
                if (updateChild) {
                    inventory.addEntity(this);
                }
                return 0;
            }
            return 1;
        }
        else {
            if (Game.debugMode) console.log(`Running <${EntityEnum.properties[this.entityType].name}Entity> ${this.id}.setInventory(${inventory.id}, ${updateChild ? "true" : "false"})`);
            return 1;
        }
    }
    removeInventory(updateChild = true) {
        if (!this.hasInventory()) {
            return 1;
        }
        this.inventory.dispose();
        this.inventory = null;
        if (updateChild) {
            this.inventory.removeEntity(this, false);
        }
        return 0;
    }
    createInventory(maxSize = 9, maxWeight = 10) {
        if (this instanceof CharacterEntity || this instanceof InstancedFurnitureEntity) {
            return this.setInventory(new Inventory(this.id + "Inventory", "Inventory", maxSize, maxWeight));
        }
        else {
            if (Game.debugMode) console.log(`Running <${EntityEnum.properties[this.entityType].name}Entity> ${this.id}.createInventory(${maxSize}, ${maxWeight})`);
            return 1;
        }
    }
    addItem(...parameters) {
        if (!this.hasInventory()) {
            if (this.createInventory() != 0) {
                return Tools.fresponse(300, "Warning, can't create inventory.");
            }
        }
        let result = this.inventory.addItem(...parameters);
        if (result.meta.status == 200) {
            return 0;
        }
        else if (result.meta.status == 300) {
            /** If the item exists in 3D space, don't do anything */
            if (result.response.hasController()) {
                return 1;
            } /** Else if this, the entity trying to pick it up, has a controller, then create an instance of the item, or its own instance, in 3D space */
            else if (this.hasController()) {
                Game.createItemInstance(result.response.id, result.response, this.getPosition());
            }/** Else, if there were something else, eg. the character was locked and the item doesn't exist, don't do anything 'cause idk how to handle that :v */
            return 0;
        }
        return 2;
    }
    removeItem(...parameters) {
        if (!this.hasInventory()) {
            return 1;
        }
        return this.inventory.removeItem(...parameters);
    }
    hasItem(...parameters) {
        if (!this.hasInventory()) {
            return false;
        }
        return this.inventory.hasItem(...parameters);
    }
    getItem(...parameters) {
        if (!this.hasInventory()) {
            return 1;
        }
        return this.inventory.getItem(...parameters);
    }
    getItems() {
        if (!this.hasInventory()) {
            return 1;
        }
        return this.inventory.getItems();
    }

    resetModifiers() {
        this.godModeModifier = false;
        this.essentialModifier = false;
        this.healthModifier = 0;
        this.maxHealthModifier = 0;
        return 0;
    }

    /**
     * Clones
     * @param  {string} id ID
     * @return {AbstractEntity} new AbstractEntity
     */
    clone(id = undefined) {
        let clone = new AbstractEntity(id, this.name, this.description, this.icon, this.entityType);
        if (this.hasInventory()) {
            clone.setInventory(this.inventory.clone(String(id).concat("Inventory")));
        }
        clone.assign(this);
        return clone;
    }
    /**
     * Clones the entity's values over this
     * @param {AbstractEntity} entity 
     * @param {boolean} [verify] Set to false to skip verification
     */
    assign(entity, verify = true) {
        if (verify && !(entity instanceof AbstractEntity)) {
            return 2;
        }
        this.entityType = entity.entityType;
        this.setHealth(entity.health);
        this.setMaxHealth(entity.maxHealth);
        this.setOwner(entity.owner);
        if (entity.godMode) {
            this.setGodMode(true);
        }
        if (entity.essential) {
            this.setEssential(true);
        }
        for (let effect in entity.effects) {
            for (let i = 0; i < entity.effects[effect]["currentStack"]; i++) {
                this.addEffect(effect);
            }
        }
        return 0;
    }
    dispose() {
        this.setLocked(true);
        this.setEnabled(false);
        this.clearTarget();
        if (this.hasController()) {
            this.controller.setLocked(true);
            this.controller.setEnabled(false);
            this.controller.dispose();
        }
        if (this.hasInventory()) {
            this.inventory.removeEntity(this);
        }
        for (let action in this.availableActions) {
            if (this.availableActions[action] instanceof ActionData) {
                this.availableActions[action].dispose();
            }
        }
        AbstractEntity.remove(this.id);
        return undefined;
    }

    static initialize() {
        AbstractEntity.abstractEntityList = {};
    }
    static get(id) {
        if (AbstractEntity.has(id)) {
            return AbstractEntity.abstractEntityList[id];
        }
        return 1;
    }
    static has(id) {
        return AbstractEntity.abstractEntityList.hasOwnProperty(id);
    }
    static set(id, abstractEntity) {
        AbstractEntity.abstractEntityList[id] = abstractEntity;
        return 0;
    }
    static remove(id) {
        delete AbstractEntity.abstractEntityList[id];
        return 0;
    }
    static list() {
        return AbstractEntity.abstractEntityList;
    }
    static clear() {
        for (let i in AbstractEntity.abstractEntityList) {
            AbstractEntity.abstractEntityList[i].dispose();
        }
        AbstractEntity.abstractEntityList = {};
        return 0;
    }
}
AbstractEntity.initialize();
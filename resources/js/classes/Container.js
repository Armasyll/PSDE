/**
 * Container
 */
class Container {
    /**
     * Creates a Container
     * @param {string} id 
     * @param {string} name 
     * @param {number} [maxSize] 
     * @param {number} [maxWeight] 
     */
    constructor(id = "", name = "", maxSize = 9, maxWeight = 10) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        this.id = id;
        name = Tools.filterName(name);
        if (name.length == 0) {
            name = id;
        }
        this.name = name;
        /*
        Map of integers, related to item slots, and InstancedItemEntities
         */
        this.items = {};
        this.weight = 0;
        this.maxSize = 9;
        this.setMaxSize(maxSize);
        this.maxWeight = 10;
        this.setMaxWeight(maxWeight);
        this.entities = {};
        this.locked = false;
        this.enabled = true;

        Container.set(this.id, this);
    }

    setID(id) {
        this.locked = true;
        Container.remove(this.id);
        id = Tools.filterID(id);
        this.id = id;
        Container.set(this.id, this);
        this.locked = false;
        return 0;
    }
    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getSize() {
        return Object.keys(this.items).length;
    }
    getWeight() {
        return this.weight;
    }
    setMaxWeight(maxWeight) {
        this.maxWeight = maxWeight
        return 0;
    }
    getMaxWeight() {
        return this.maxWeight;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        return 0;
    }
    getMaxSize() {
        return this.maxSize;
    }
    getAvailableSlots() {
        return this.maxSize - this.getSize();
    }
    getAvailableWeight() {
        return this.maxWeight - this.weight;
    }
    calculateWeight() {
        let weight = 0;
        for (let slot in this.items) {
            weight += InstancedItemEntity.get(this.items[slot]).getWeight();
        }
        this.weight = weight;
        return weight;
    }

    /**
     * Gets the nth available spot.
     * @param {number} nth Nth
     * @returns {number}
     */
    getAvailableSlot(nth = 0) {
        if (isNaN(nth)) {
            nth = 0;
        }
        nth += 1;
        for (let i = 0; i < this.maxSize; i++) {
            if (this.items[i] == undefined) {
                nth--;
                if (nth <= 0) {
                    return i;
                }
            }
        }
        return -1;
    }
    /**
     * Adds the InstancedItemEntity to this entity's Item array
     * @param  {InstancedItemEntity} instancedItemEntity InstancedItemEntity, or ItemEntity, to be added
     * @return {number}
     */
    addItem(instancedItemEntity) {
        if (this.locked || !this.enabled) {
            return Tools.fresponse(423, "Error, container is locked.");
        }
        if (!(instancedItemEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(instancedItemEntity)) {
                instancedItemEntity = AbstractEntity.get(instancedItemEntity);
            }
            else {
                return Tools.fresponse(404, "Error, item doesn't exist.");
            }
        }
        if (instancedItemEntity instanceof InstancedEntity) {
            return this.addItemToSlot(instancedItemEntity, this.getAvailableSlot());
        }
        else if (instancedItemEntity instanceof ItemEntity) {
            return this.addItemToSlot(instancedItemEntity.createInstance(), this.getAvailableSlot());
        }
        if (Container.debugMode) console.log(`Failed to add item ${instancedItemEntity} to ${this.id}`);
        return Tools.fresponse(400, "Error");
    }
    addItemToSlot(instancedItemEntity, slot) {
        if (this.locked || !this.enabled) {
            return Tools.fresponse(423, "Error, container is locked.");
        }
        if (!(instancedItemEntity instanceof InstancedItemEntity)) {
            if (InstancedItemEntity.has(instancedItemEntity)) {
                instancedItemEntity = InstancedItemEntity.get(instancedItemEntity);
            }
            else {
                return Tools.fresponse(404, "Error, item doesn't exist.");
            }
        }
        if (typeof slot != "number") {slot = Number.parseInt(slot) || -1;}
        else {slot = slot|0}
        if (isNaN(slot) || slot == -1) {
            return Tools.fresponse(300, "Warning, item slot is invalid.", instancedItemEntity);
        }
        else if (this.items[slot] instanceof InstancedEntity) {
            return Tools.fresponse(300, "Warning, item slot is already occupied.", instancedItemEntity);
        }
        this.items[slot] = instancedItemEntity;
        this.weight += instancedItemEntity.getWeight();
        instancedItemEntity.setContainer(this);
        return Tools.fresponse(200, "OK", instancedItemEntity);
    }
    swapSlots(slotA, slotB) {
        if (this.locked || !this.enabled) {
            return Tools.fresponse(423, "Error, container is locked.");
        }
        slotA = Number.parseInt(slotA) || Number.MAX_SAFE_INTEGER;
        slotB = Number.parseInt(slotB) || Number.MAX_SAFE_INTEGER;
        /** Can't swap empty slots */
        if (!this.items.hasOwnProperty(slotA) && !this.items.hasOwnProperty(slotB)) {
            return Tools.fresponse(404, "Error, item slot is invalid.");
        }
        else if (slotA > this.maxSize || slotB > this.maxSize) {
            return Tools.fresponse(403, "Error, item slot is greater than max.");
        }
        else if (slotA < 0 || slotB < 0) {
            return Tools.fresponse(403, "Error, item slot is less than minimum.");
        }
        this.locked = true;
        let tempItem = this.items[slotA];
        this.items[slotA] = this.items[slotB];
        this.items[slotB] = tempItem;
        this.locked = false;
        return Tools.fresponse(200, "OK");
    }
    /**
     * Removes an AbstractEntity from this entity's Item array
     * @param  {AbstractEntity} instancedItemEntity AbstractEntity, or ItemEntity, to be removed
     * @return {this}
     */
    removeItem(instancedItemEntity) {
        if (this.locked || !this.enabled) {
            return Tools.fresponse(423, "Error, container is locked.");
        }
        if (!(instancedItemEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(instancedItemEntity)) {
                instancedItemEntity = AbstractEntity.get(instancedItemEntity);
            }
            else {
                return Tools.fresponse(404, "Error, item doesn't exist.");
            }
        }
        if (Container.debugMode) console.log(`Running <Container> ${this.id}.removeItem(${instancedItemEntity.getID()})`);
        let slot = this.getSlotByItem(instancedItemEntity);
        if (slot < 0) {
            return Tools.fresponse(410, "Error, container doesn't have item.");
        }
        return this.removeItemFromSlot(slot);
    }
    removeItemFromSlot(slot) {
        if (this.locked || !this.enabled) {
            return Tools.fresponse(423, "Error, container is locked.");
        }
        if (typeof slot != "number") {slot = Number.parseInt(slot) || -1;}
        else {slot = slot|0}
        if (isNaN(slot) || slot == -1) {
            return Tools.fresponse(300, "Warning, item slot is invalid.");
        }
        if (this.items.hasOwnProperty(slot)) {
            if (InstancedItemEntity.has(this.items[slot])) {
                let instancedItemEntity = InstancedItemEntity.get(this.items[slot]);
                this.weight -= instancedItemEntity.getWeight();
                instancedItemEntity.removeContainer(this);
            }
            delete this.items[slot];
        }
        return Tools.fresponse(200, "OK");
    }
    getItemBySlot(number) {
        if (this.items[number] && this.items[number] instanceof InstancedEntity) {
            return this.items[number];
        }
        return 2;
    }
    getSlotByItem(abstractEntity) {
        let slot = -1;
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return slot;
            }
        }
        if (abstractEntity instanceof InstancedEntity) {
            let instancedItemEntity = null;
            for (let slot in this.items) {
                instancedItemEntity = this.items[slot];
                if (instancedItemEntity == abstractEntity) {
                    return Number.parseInt(slot);
                }
            };
        }
        else if (abstractEntity instanceof Entity) {
            let instancedItemEntity = null;
            for (let slot in this.items) {
                instancedItemEntity = this.items[slot];
                if (instancedItemEntity instanceof InstancedEntity) {
                    if (instancedItemEntity.getEntity() == abstractEntity) {
                        return Number.parseInt(slot);
                    }
                }
            };
        }
        return slot;
    }
    /**
     * Returns the InstancedItemEntity of a passed ItemInstance or InstancedItemEntity, or their string IDs, if this entity has it in their Item array
     * @param  {(ItemEntity|InstancedItemEntity)} abstractEntity The ItemInstance or InstancedItemEntity to search for
     * @return {InstancedItemEntity} The InstancedItemEntity that is found, or null if it isn't
     */
    getItem(abstractEntity) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        if (abstractEntity instanceof InstancedEntity) {
            abstractEntity = abstractEntity.getEntity();
        }
        let instancedItemEntity = null;
        for (let slot in this.items) {
            instancedItemEntity = this.items[slot];
            if (instancedItemEntity instanceof InstancedEntity) {
                if (instancedItemEntity.getEntity() == abstractEntity) {
                    return instancedItemEntity;
                }
            }
        }
        return 1;
    }
    hasItem(abstractEntity) {
        return this.getItem(abstractEntity) instanceof AbstractEntity;
    }
    getItems() {
        return this.items;
    }

    hasEntity(abstractEntity) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        return this.entities.hasOwnProperty(abstractEntity.getID());
    }
    addEntity(abstractEntity, updateChild = false) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        this.entities[abstractEntity.getID()] = true;
        if (updateChild) {
            abstractEntity.setContainer(this, false);
        }
        return 0;
    }
    removeEntity(abstractEntity, updateChild = false) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        delete this.entities[abstractEntity];
        if (updateChild) {
            abstractEntity.removeContainer(false);
        }
        if (Object.keys(this.entities).length == 0) {
            this.dispose();
        }
        return 0;
    }
    hasEntities() {
        return Object.keys(this.entities).length > 0;
    }
    clearEntities() {
        for (let entity in this.entities) {
            this.removeEntity(entity, true);
        }
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

    clear() {
        this.isLocked = true;
        for (let slot in this.items) {
            let instancedItemEntity = InstancedItemEntity.get(this.items[slot]);
            instancedItemEntity.dispose();
            delete this.items[slot];
        }
        this.weight = 0;
        this.isLocked = false;
    }

    stringify(minimal = false) {
        return JSON.stringify(this.objectify());
    }
    objectifyMinimal() {
        return this.objectify();
    }
    objectify() {
        let obj = {};
        obj["className"] = this.getClassName();
        obj["id"] = this.id;
        obj["name"] = this.name;
        obj["items"] = {};
        for (let slot in this.items) {
            if (this.items[slot] instanceof InstancedItemEntity) {
                let item = this.items[slot].entity;
                obj["items"][slot] = {
                    "id": item.id,
                    "name": item.getName(),
                    "description": item.getDescription(),
                    "iconID": item.iconID
                }
            }
        }
        obj["maxSize"] = this.maxSize;
        obj["maxWeight"] = this.maxWeight;
        obj["size"] = Object.keys(this.items).length;
        obj["weight"] = this.weight;
        return obj;
    }

    clone(id = "") {
        let clone = new Container(id, this.name, this.maxSize, this.maxWeight);
        for (let slot in this.items) {
            clone.addItemToSlot(InstancedItemEntity.get(this.items[slot]).clone(), slot);
        }
        clone.assign(this);
        return clone;
    }
    /**
     * Clones the container's values over this
     * @param {Container} container 
     * @param {boolean} [verify] Set to false to skip verification
     */
    assign(container, verify = true) {
        if (verify && !(container instanceof Container)) {
            return 2;
        }
        this.setWeight(container.weight);
        this.setMaxSize(container.maxSize);
        this.setMaxWeight(container.maxWeight);
        return 0;
    }
    dispose() {
        if (this == Game.player.entity) {
            return false;
        }
        this.setLocked(true);
        this.setEnabled(false);
        this.clearEntities();
        this.clear();
        delete this.items;
        delete this.entities;
        return undefined;
    }
    getClassName() {
        return "Container";
    }

    static initialize() {
        Container.containerList = {};
        Container.debugMode = false;
    }
    static get(id) {
        if (Container.has(id)) {
            return Container.containerList[id];
        }
        return 1;
    }
    static has(id) {
        return Container.containerList.hasOwnProperty(id);
    }
    static set(id, lightEntity) {
        Container.containerList[id] = lightEntity;
        return 0;
    }
    static remove(id) {
        delete Container.containerList[id];
        return 0;
    }
    static list() {
        return Container.containerList;
    }
    static clear() {
        for (let i in Container.containerList) {
            Container.containerList[i].dispose();
        }
        Container.containerList = {};
        return 0;
    }
}
Container.initialize();
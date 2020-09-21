importScripts("../Overrides.js", "../classes/Tools.js", "../classes/DND.js", "../classes/DND5E.js");

importScripts("../classes/Enum.js");

importScripts("../classes/ActionData.js", "../classes/Dialogue.js", "../classes/Cell.js", "../classes/Cosmetic.js", "../classes/Container.js", "../classes/CharacterClass/CharacterClass.js", "../classes/CharacterClass/ClasslessClass.js", "../classes/CharacterClass/SorcererClass.js");

importScripts("../classes/Effect.js", "../classes/Spell.js");

importScripts("../classes/Entity/AbstractEntity.js", "../classes/Entity/SoulEntity.js", "../classes/Entity/Entity.js");
importScripts("../classes/Entity/FurnitureEntity.js", "../classes/Entity/LightingEntity.js", "../classes/Entity/DisplayEntity.js", "../classes/Entity/DoorEntity.js");
importScripts("../classes/Entity/CreatureEntity.js", "../classes/Entity/CharacterEntity.js");
importScripts("../classes/Entity/ItemEntity.js", "../classes/Entity/BookEntity.js");
importScripts("../classes/Entity/EquipmentEntity.js", "../classes/Entity/ClothingEntity.js", "../classes/Entity/WeaponEntity.js", "../classes/Entity/ShieldEntity.js", "../classes/Entity/KeyEntity.js");
importScripts("../classes/Entity/ConsumableEntity.js", "../classes/Entity/PlantEntity.js");

importScripts("../classes/Entity/Instance/Entity.js", "../classes/Entity/Instance/FurnitureEntity.js", "../classes/Entity/Instance/LightingEntity.js");
importScripts("../classes/Entity/Instance/ItemEntity.js", "../classes/Entity/Instance/BookEntity.js", "../classes/Entity/Instance/KeyEntity.js", "../classes/Entity/Instance/EquipmentEntity.js", "../classes/Entity/Instance/ClothingEntity.js", "../classes/Entity/Instance/WeaponEntity.js", "../classes/Entity/Instance/ShieldEntity.js");
importScripts("../classes/Entity/Instance/ConsumableEntity.js", "../classes/Entity/Instance/PlantEntity.js");

class EntityLogic {
    static initialize() {
        EntityLogic.tickPort = null;
        EntityLogic.transformsPort = null;
        EntityLogic.callbacks = {};

        EntityLogic.currentTime = 0;
        EntityLogic.currentTick = 0;
        EntityLogic.currentRound = 0;
        EntityLogic.currentTurn = 0;
        EntityLogic.gameTimeMultiplier = 10;
        EntityLogic.ticksPerTurn = 10;
        EntityLogic.turnsPerRound = 6;
        EntityLogic.turnTime = EntityLogic.ticksPerTurn * EntityLogic.gameTimeMultiplier;
        EntityLogic.roundTime = EntityLogic.turnTime * EntityLogic.turnsPerRound;
        EntityLogic.gameTimeMultiplier = 10;
        EntityLogic.roundTime = 6;
        EntityLogic.turnTime = 60;

        EntityLogic.playerEntity = null;

        EntityLogic.importEffects();
        EntityLogic.importClasses();
        EntityLogic.importSpells();
        EntityLogic.importItems();
        EntityLogic.importConsumables();
        EntityLogic.importBooks();
        EntityLogic.importCosmetics();
        EntityLogic.importFurniture();
        EntityLogic.importPlants();
        EntityLogic.importDialogues();
        EntityLogic.importCharacters();
        EntityLogic.importCells();
        addEventListener('message', EntityLogic.gameWorkerOnMessage, false);
    }
    static tickWorkerOnMessage(event) {
        if (EntityLogic.debugMode) console.group(`Running EntityLogic.tickWorkerOnMessage`);
        if (!event.data.hasOwnProperty("cmd") || !event.data.hasOwnProperty("msg")) {
            if (EntityLogic.debugMode) console.groupEnd();
            return 2;
        }
        let status = event.data["sta"];
        if (EntityLogic.debugMode) console.info(`with command (${event.data["cmd"]})`);
        let callbackID = event.data["callbackID"];
        if (EntityLogic.debugMode) console.info(`and callbackID (${callbackID})`);
        let message = event.data["msg"];
        if (EntityLogic.debugMode && message) console.info(`and message`);
        switch (event.data.cmd) {
            case "triggerScheduledEffect": {
                if (!Effect.has(message[0])) {
                    return 2;
                }
                if (!AbstractEntity.has(message[1])) {
                    return 2;
                }
                if (EntityLogic.debugMode) console.log(`Caught triggerScheduledEffect(${message[0]}, ${message[1]})`);
                let effect = Effect.get(message[0]);
                let abstractEntity = AbstractEntity.get(message[1]);
                abstractEntity.applyEffect(effect);
                break;
            }
            case "removeScheduledEffect": {
                if (!Effect.has(message[0])) {
                    return 2;
                }
                if (!AbstractEntity.has(message[1])) {
                    return 2;
                }
                if (EntityLogic.debugMode) console.log(`Caught removeScheduledEffect(${message[0]}, ${message[1]})`);
                let effect = Effect.get(message[0]);
                let abstractEntity = AbstractEntity.get(message[1]);
                abstractEntity.removeEffect(effect);
                break;
            }
            case "triggerScheduledCommand": {
                //console.log(e.data["msg"]);
                break;
            }
            case "tick": {
                EntityLogic.currentTick = message;
                break;
            }
            case "turn": {
                EntityLogic.currentTurn = message;
                break;
            }
            case "round": {
                EntityLogic.currentRound = message;
                break;
            }
        }
        return 0;
    }
    /**
     * 
     * @param {string} command 
     * @param {number} status 
     * @param {(Array<string>|object)} [message] 
     * @param {string} [callbackID] 
     * @param {object} [options] 
     */
    static tickWorkerPostMessage(command, status = 0, message, callbackID = null, options = null) {
        let obj = {"cmd": command, "sta": status, "msg": message};
        if (callbackID) {
            obj["callbackID"] = callbackID;
        }
        if (options) {
            EntityLogic.tickPort.postMessage(obj, options);
        }
        else {
            EntityLogic.tickPort.postMessage(obj);
        }
        return 0;
    }
    static transformsWorkerOnMessage(event) {
        if (EntityLogic.debugMode) console.group(`Running EntityLogic.transformsWorkerOnMessage`);
        if (!event.data.hasOwnProperty("cmd") || !event.data.hasOwnProperty("msg")) {
            if (EntityLogic.debugMode) console.groupEnd();
            return 2;
        }
        let status = event.data["sta"];
        if (EntityLogic.debugMode) console.info(`with command (${event.data["cmd"]})`);
        let callbackID = event.data["callbackID"];
        if (EntityLogic.debugMode) console.info(`and callbackID (${callbackID})`);
        let message = event.data["msg"];
        if (EntityLogic.debugMode && message) console.info(`and message`);
        switch (event.data["cmd"]) {
            case "inArea":
            case "inFrontOf":
            case "withinRange": {
                if (status == 0) {
                    EntityLogic.runCallback(callbackID, message);
                }
                else if (EntityLogic.hasCallback(callbackID)) {
                    EntityLogic.callbacks[callbackID]["hasRun"] = true;
                    EntityLogic.callbacks[callbackID]["status"] = 1;
                }
                break;
            }
        }
        return 0;
    }
    /**
     * 
     * @param {string} command 
     * @param {number} status 
     * @param {(Array<string>|object)} [message] 
     * @param {string} [callbackID] 
     * @param {object} [options] 
     */
    static transformsWorkerPostMessage(command, status = 0, message, callbackID = null, options = null) {
        let obj = {"cmd": command, "sta": status, "msg": message};
        if (callbackID) {
            obj["callbackID"] = callbackID;
        }
        if (options) {
            EntityLogic.transformsPort.postMessage(obj, options);
        }
        else {
            EntityLogic.transformsPort.postMessage(obj);
        }
        return 0;
    }
    static gameWorkerOnMessage(event) {
        if (EntityLogic.debugMode) console.group(`Running EntityLogic.gameWorkerOnMessage`);
        if (!event.data.hasOwnProperty("cmd") || !event.data.hasOwnProperty("msg")) {
            if (EntityLogic.debugMode) console.groupEnd();
            return 2;
        }
        let status = event.data["sta"];
        if (EntityLogic.debugMode) console.info(`with command (${event.data["cmd"]})`);
        let callbackID = event.data["callbackID"];
        if (EntityLogic.debugMode) console.info(`and callbackID (${callbackID})`);
        let message = event.data["msg"];
        if (EntityLogic.debugMode && message) console.info(`and message`);
        switch (event.data["cmd"]) {
            case "actionClose": {
                let actor = AbstractEntity.get(message["actorID"]);
                let target = AbstractEntity.get(message["targetID"]);
                if (target == 1 || actor == 1) {
                    EntityLogic.gameWorkerPostMessage("actionOpen", 1, false, callbackID);
                    break;
                }
                target.setOpen(false);
                EntityLogic.gameWorkerPostMessage("updateEntity", 0, target.stringify(true));
                EntityLogic.gameWorkerPostMessage("actionClose", 0, !target.getOpen(), callbackID);
                break;
            }
            case "actionEquip": {
                let actor = AbstractEntity.get(message["actorID"]);
                let target = AbstractEntity.get(message["targetID"]);
                if (actor == 1 || target == 1) {
                    EntityLogic.gameWorkerPostMessage("actionEquip", 1, null, callbackID);
                    break;
                }
                let result = actor.equip(target) == 0;
                EntityLogic.gameWorkerPostMessage("updateEntity", 0, target.stringify(true));
                EntityLogic.gameWorkerPostMessage("actionEquip", 0, result, callbackID);
                break;
            }
            case "actionOpen": {
                let actor = AbstractEntity.get(message["actorID"]);
                let target = AbstractEntity.get(message["targetID"]);
                if (target == 1 || actor == 1) {
                    EntityLogic.gameWorkerPostMessage("actionOpen", 1, false, callbackID);
                    break;
                }
                let canOpen = false;
                if (target.isEntityLocked()) {
                    if (actor.hasItem(target.getKey())) {
                        canOpen = true;
                    }
                }
                else {
                    canOpen = true;
                }
                if (canOpen) {
                    target.setOpen(true);
                    EntityLogic.gameWorkerPostMessage("updateEntity", 0, target.stringify(true));
                }
                EntityLogic.gameWorkerPostMessage("actionOpen", 0, target.getOpen(), callbackID);
                break;
            }
            case "actionTake": {
                let target = AbstractEntity.get(message["targetID"]);
                let actor = AbstractEntity.get(message["actorID"]);
                if (target == 1 || actor == 1) {
                    EntityLogic.gameWorkerPostMessage("actionTake", 1, null, callbackID);
                    break;
                }
                EntityLogic.actionTake(target, actor, callbackID);
                break;
            }
            case "actionTalk": {
                let actor = AbstractEntity.get(message["actorID"]);
                let target = AbstractEntity.get(message["targetID"]);
                if (target == 1 || actor == 1) {
                    EntityLogic.gameWorkerPostMessage("actionTalk", 1, false, callbackID);
                    break;
                }
                if (!target.hasDialogue()) {
                    EntityLogic.gameWorkerPostMessage("actionTalk", 1, false, callbackID);
                    break;
                }
                EntityLogic.gameWorkerPostMessage("actionTalk", 0, target.getDialogue(target).stringify(false, target, actor), callbackID);
                break;
            }
            case "addAllClothing": {
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addAllClothing", 2, {}, callbackID);
                    return 2;
                }
                let target = AbstractEntity.get(message["target"]);
                for (let item in ClothingEntity.list()) {
                    target.addItem(ClothingEntity.get(item));
                }
                EntityLogic.gameWorkerPostMessage("addAllClothing", 0, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "addAllItems": {
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addAllItems", 2, {}, callbackID);
                    return 2;
                }
                let target = AbstractEntity.get(message["target"]);
                for (let item in ItemEntity.list()) {
                    target.addItem(ItemEntity.get(item));
                }
                EntityLogic.gameWorkerPostMessage("addAllItems", 0, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "addAllKeys": {
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addAllKeys", 2, {}, callbackID);
                    return 2;
                }
                let target = AbstractEntity.get(message["target"]);
                for (let item in KeyEntity.list()) {
                    target.addItem(KeyEntity.get(item));
                }
                EntityLogic.gameWorkerPostMessage("addAllKeys", 0, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "addAllWeapons": {
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addAllWeapons", 2, {}, callbackID);
                    return 2;
                }
                let target = AbstractEntity.get(message["target"]);
                for (let item in WeaponEntity.list()) {
                    target.addItem(WeaponEntity.get(item));
                }
                EntityLogic.gameWorkerPostMessage("addAllWeapons", 0, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "addItem": {
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addItem", 2, {}, callbackID);
                    return 2;
                }
                if (!AbstractEntity.hasOwnProperty(message["item"])) {
                    EntityLogic.gameWorkerPostMessage("addItem", 2, {}, callbackID);
                    return 2;
                }
                let target = AbstractEntity.get(message["target"]);
                if (!target.hasContainer()) {
                    EntityLogic.gameWorkerPostMessage("addItem", 1, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                    return 1;
                }
                let item = AbstractEntity.get(message["item"]);
                if (item instanceof ItemEntity) {
                    for (let i = 0; i < amount; i++) {
                        target.addItem(item.createInstance());
                    }
                }
                else {
                    EntityLogic.gameWorkerPostMessage("addItem", 1, {"targetName": target.getName(), "targetID": target.id, "itemID": item.id}, callbackID);
                    return 1;
                }
                let amount = Number.parseInt(message["amount"]) || 1;
                EntityLogic.gameWorkerPostMessage("addItem", 0, {"targetName": target.getName(), "targetID": target.id, "amount": amount, "itemName": item.getName(), "itemID": item.id}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "addMoney": {
                let target = null;
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("addMoney", 2, {}, callbackID);
                    return 2;
                }
                target = AbstractEntity.get(message["target"]);
                if (!target.hasOwnProperty("money")) {
                    EntityLogic.gameWorkerPostMessage("addMoney", 1, {"targetName": target.getName(), "targetID": target.id, "amount": target.money}, callbackID);
                    return 1;
                }
                let amount = Number.parseInt(message["amount"]) || 1;
                target.modifyMoney(amount);
                EntityLogic.gameWorkerPostMessage("addMoney", 0, {"targetName": target.getName(), "targetID": target.id, "amount": target.money}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "connectTick": {
                EntityLogic.tickPort = event.ports[0];
                EntityLogic.tickPort.onmessage = EntityLogic.tickWorkerOnMessage;
                break;
            }
            case "connectTransforms": {
                EntityLogic.transformsPort = event.ports[0];
                EntityLogic.transformsPort.onmessage = EntityLogic.transformsWorkerOnMessage;
                break;
            }
            case "createCharacterEntity": {
                let entity = EntityLogic.createCharacterEntity(message["id"], message["name"], message["description"], message["iconID"], message["creatureType"], message["creatureSubType"], message["sex"], message["age"], message["meshID"], message["materialID"], message["options"]);
                if (entity instanceof CreatureEntity) {
                    EntityLogic.gameWorkerPostMessage("createCharacterEntity", 0, entity, callbackID);
                }
                else {
                    EntityLogic.gameWorkerPostMessage("createCharacterEntity", 1, null, callbackID);
                }
                break;
            }
            case "createCharacterInstance": {
                break;
            }
            case "createDoorEntity": {
                let entity = new DoorEntity(message["id"], message["name"], message["description"], message["iconID"], message["locked"], message["key"], message["opensInward"], message["open"]);
                entity.setMeshID(message["meshID"]);
                entity.setMaterialID(message["materialID"]);
                entity.assign(message["options"]);
                EntityLogic.gameWorkerPostMessage("createDoorEntity", 0, entity, callbackID);
                break;
            }
            case "createEntity": {
                break;
            }
            case "createFurnitureEntity": {
                let entity = new FurnitureEntity(message["id"], message["name"], message["description"], message["iconID"]);
                entity.setMeshID(message["meshID"]);
                entity.setMaterialID(message["materialID"]);
                entity.assign(message["options"]);
                EntityLogic.gameWorkerPostMessage("createFurnitureEntity", 0, entity, callbackID);
                break;
            }
            case "createFurnitureInstance": {
                let entity = FurnitureEntity.get(message["entityID"]);
                if (entity == 1) {
                    EntityLogic.gameWorkerPostMessage("createFurnitureInstance", 1, null, callbackID);
                    break;
                }
                let instance = entity.createInstance(message["instanceID"]);
                EntityLogic.gameWorkerPostMessage("createFurnitureInstance", 0, instance.objectifyMinimal(), callbackID);
                break;
            }
            case "createItemInstance": {
                let entity = null;
                if (ItemEntity.has(message["entityID"])) {
                    entity = ItemEntity.get(message["entityID"]).createInstance();
                }
                else if (InstancedItemEntity.has(message["entityID"])) {
                    entity = InstancedItemEntity.get(message["entityID"]).clone();
                }
                else {
                    EntityLogic.gameWorkerPostMessage("createItemInstance", 1, entity, callbackID);
                    break;
                }
                EntityLogic.gameWorkerPostMessage("createItemInstance", 0, entity.objectifyMinimal(), callbackID);
                break;
            }
            case "createLightingEntity": {
                let entity = new LightingEntity(message["id"], message["name"], message["description"], message["iconID"], message["lightingType"], message["lightingPositionOffset"]);
                entity.setMeshID(message["meshID"]);
                entity.setMaterialID(message["materialID"]);
                entity.assign(message["options"]);
                EntityLogic.gameWorkerPostMessage("createLightingEntity", 0, entity, callbackID);
                break;
            }
            case "createLightingInstance": {
                let entity = LightingEntity.get(message["entityID"]);
                if (entity == 1) {
                    EntityLogic.gameWorkerPostMessage("createLightingInstance", 1, null, callbackID);
                    break;
                }
                let instance = entity.createInstance(message["instanceID"]);
                EntityLogic.gameWorkerPostMessage("createLightingInstance", 0, instance.objectifyMinimal(), callbackID);
                break;
            }
            case "createPlantInstance": {
                break;
            }
            case "getCell": {
                let ids = {};
                message.forEach((entityID) => {
                    if (Cell.has(entityID)) {
                        ids[entityID] = Cell.get(entityID).stringify();
                    }
                    else {
                        ids[entityID] = 1;
                    }
                });
                EntityLogic.gameWorkerPostMessage("getCell", 0, ids, callbackID);
                break;
            }
            case "getCharacterEntity": {
                if (!(message instanceof Array)) {
                    break;
                }
                let ids = {};
                message.forEach((entityID) => {
                    if (CharacterEntity.has(entityID)) {
                        ids[entityID] = CharacterEntity.get(entityID).stringify();
                    }
                });
                if (Object.keys(ids).length == 0) {
                    EntityLogic.gameWorkerPostMessage("getCharacterEntity", 1, null, callbackID);
                }
                else {
                    EntityLogic.gameWorkerPostMessage("getCharacterEntity", 0, ids, callbackID);
                }
                break;
            }
            case "getDialogue": {
                if (!(message instanceof Object)) {
                    break;
                }
                let ids = {};
                let targetEntity = AbstractEntity.get(message["targetID"]);
                let actorEntity = AbstractEntity.get(message["actorID"]);
                message["dialogueID"].forEach((dialogueID) => {
                    if (Dialogue.has(dialogueID)) {
                        let dialogue = Dialogue.get(dialogueID);
                        ids[dialogueID] = dialogue.stringify(true, targetEntity, actorEntity);
                        for (let option in dialogue.options) {
                            let subDialogue = dialogue.options[option].dialogue;
                            ids[subDialogue.id] = subDialogue.stringify(true, targetEntity, actorEntity)
                        }
                    }
                });
                if (Object.keys(ids).length == 0) {
                    EntityLogic.gameWorkerPostMessage("getDialogue", 1, null, callbackID);
                }
                else {
                    EntityLogic.gameWorkerPostMessage("getDialogue", 0, ids, callbackID);
                }
                break;
            }
            case "getEntity": {
                if (!(message instanceof Array)) {
                    break;
                }
                let ids = {};
                message.forEach((entityID) => {
                    if (AbstractEntity.has(entityID)) {
                        ids[entityID] = AbstractEntity.get(entityID).stringify();
                    }
                });
                if (Object.keys(ids).length == 0) {
                    EntityLogic.gameWorkerPostMessage("getEntity", 1, null, callbackID);
                }
                else {
                    EntityLogic.gameWorkerPostMessage("getEntity", 0, ids, callbackID);
                }
                break;
            }
            case "getEquipment": {
                let obj = {};
                message.forEach((entityID) => {
                    let entity = AbstractEntity.get(entityID);
                    if (entity != 1 && entity.hasOwnProperty("equipment")) {
                        let entityObj = {};
                        entityObj["id"] = entity.id;
                        entityObj["controller"] = entity.controller;
                        entityObj["equipment"] = entity._objectifyProperty(entity.equipment);
                        obj[entityID] = JSON.stringify(entityObj);
                    }
                });
                EntityLogic.gameWorkerPostMessage("getEquipment", 0, obj, callbackID);
                break;
            }
            case "getInventory": {
                let obj = {};
                message.forEach((entityID) => {
                    let entity = AbstractEntity.get(entityID);
                    if (entity != 1 && entity.hasContainer()) {
                        let entityObj = {};
                        entityObj["id"] = entity.id;
                        entityObj["controller"] = entity.controller;
                        entityObj["container"] = entity.container.objectifyMinimal();
                        entityObj["money"] = entity.money;
                        obj[entityID] = JSON.stringify(entityObj);
                    }
                });
                EntityLogic.gameWorkerPostMessage("getInventory", 0, obj, callbackID);
                break;
            }
            case "getMoney": {
                let target = null;
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("getMoney", 2, {}, callbackID);
                    return 2;
                }
                target = AbstractEntity.get(message["target"]);
                if (!target.hasOwnProperty("money")) {
                    EntityLogic.gameWorkerPostMessage("getMoney", 1, {"targetName": target.getName(), "targetID": target.id}, callbackID);
                    return 1;
                }
                EntityLogic.gameWorkerPostMessage("getMoney", 0, {"targetName": target.getName(), "targetID": target.id, "amount": target.money}, callbackID);
                break;
            }
            case "hasCell": {
                let ids = {};
                message.forEach((entityID) => {
                    if (Cell.has(entityID)) {
                        ids[entityID] = true;
                    }
                    else {
                        ids[entityID] = false;
                    }
                });
                EntityLogic.gameWorkerPostMessage("hasCell", 0, ids, callbackID);
                break;
            }
            case "hasEntity": {
                let ids = {};
                message.forEach((entityID) => {
                    if (AbstractEntity.has(entityID)) {
                        ids[entityID] = true;
                    }
                    else {
                        ids[entityID] = false;
                    }
                });
                EntityLogic.gameWorkerPostMessage("hasEntity", 0, ids, callbackID);
                break;
            }
            case "hasInstancedEntity": {
                let ids = {};
                message.forEach((entityID) => {
                    if (InstancedEntity.has(entityID)) {
                        ids[entityID] = true;
                    }
                    else {
                        ids[entityID] = false;
                    }
                });
                EntityLogic.gameWorkerPostMessage("hasInstancedEntity", 0, ids, callbackID);
                break;
            }
            case "hasInventory": {
                let ids = {};
                message.forEach((entityID) => {
                    if (Container.has(entityID)) {
                        ids[entityID] = true;
                    }
                    else {
                        ids[entityID] = false;
                    }
                });
                EntityLogic.gameWorkerPostMessage("hasInventory", 0, ids, callbackID);
                break;
            }
            case "hasAvailableMesh": {
                break;
            }
            case "hasAvailableTexture": {
                break;
            }
            case "hasController": {
                break;
            }
            case "hasLoadedMesh": {
                break;
            }
            case "hasLoadedTexture": {
                break;
            }
            case "hasMesh": {
                break;
            }
            case "hasTexture": {
                break;
            }
            case "kill": {
                break;
            }
            case "removeController": {
                break;  
            }
            case "setEntityController": {
                if (AbstractEntity.has(message["entityID"])) {
                    AbstractEntity.get(message["entityID"]).setController(message["controllerID"]);
                }
                break;
            }
            case "setDialogue": {
                if (!(message instanceof Object)) {
                    break;
                }
                let dialogue = Dialogue.get(message["dialogueID"]);
                let targetEntity = AbstractEntity.get(message["targetID"]);
                let actorEntity = AbstractEntity.get(message["actorID"]);
                
                if (dialogue == 1 || targetEntity == 1 || actorEntity == 1) {
                    EntityLogic.gameWorkerPostMessage("setDialogue", 1, null, callbackID);
                }
                else {
                    EntityLogic.gameWorkerPostMessage("setDialogue", 0, dialogue.stringify(true, targetEntity, actorEntity), callbackID);
                }
                break;
            }
            case "setMoney": {
                let target = null;
                if (!AbstractEntity.has(message["target"])) {
                    EntityLogic.gameWorkerPostMessage("setMoney", 2, {}, callbackID);
                    return 2;
                }
                target = AbstractEntity.get(message["target"]);
                if (!target.hasOwnProperty("money")) {
                    EntityLogic.gameWorkerPostMessage("setMoney", 1, {"targetName": target.getName(), "targetID": target.id, "amount": target.money}, callbackID);
                    return 1;
                }
                let amount = Number.parseInt(message["amount"]) || 1;
                target.setMoney(amount);
                EntityLogic.gameWorkerPostMessage("setMoney", 0, {"targetName": target.getName(), "targetID": target.id, "amount": target.money}, callbackID);
                if (target == EntityLogic.playerEntity) {
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
            case "setPlayer": {
                if (AbstractEntity.has(message["entityID"])) {
                    EntityLogic.playerEntity = AbstractEntity.get(message["entityID"]);
                    EntityLogic.sendPlayerEntityUpdates();
                }
                break;
            }
        };
        console.groupEnd();
    }
    static actionTake(target, actor, parentCallbackID) {
        let callbackID = Tools.genUUIDv4();
        EntityLogic.createCallback(callbackID, parentCallbackID, [target, actor], EntityLogic.actionTakeResponse);
        EntityLogic.transformsWorkerPostMessage("withinRange", 0, [target.id, actor.id, 1.0], callbackID);
        return 0;
    }
    static actionTakeResponse(target, actor, response, callbackID) {
        actor.addItem(target);
        EntityLogic.gameWorkerPostMessage("removeItem", 0, target.controller);
        if (target == EntityLogic.playerEntity || actor == EntityLogic.playerEntity) {
            EntityLogic.sendPlayerEntityUpdates();
        }
        return 0;
    }
    /**
     * 
     * @param {string} command 
     * @param {number} status 
     * @param {(Array<string>|object)} [message] 
     * @param {string} [callbackID] 
     * @param {object} [options] 
     */
    static gameWorkerPostMessage(command, status = 0, message, callbackID = null, options = null) {
        let obj = {"cmd": command, "sta": status, "msg": message};
        if (callbackID) {
            obj["callbackID"] = callbackID;
        }
        if (options) {
            postMessage(obj, options);
        }
        else {
            postMessage(obj);
        }
        return 0;
    }
    static importScript(file, onload = null, onerror = null) {
        importScripts(file);
        return 0;
    }
    static importEffects() {
        return EntityLogic.importScript("../effects.js");
    }
    static importClasses() {
        return EntityLogic.importScript("../classes.js");
    }
    static importConsumables() {
        return EntityLogic.importScript("../consumables.js");
    }
    static importDialogues() {
        return EntityLogic.importScript("../dialogues.js");
    }
    static importBooks() {
        return EntityLogic.importScript("../books.js");
    }
    static importCells() {
        return EntityLogic.importScript("../cells.js");
    }
    static importItems() {
        return EntityLogic.importScript("../items.js");
    }
    static importFurniture() {
        return EntityLogic.importScript("../furniture.js");
    }
    static importPlants() {
        return EntityLogic.importScript("../plants.js");
    }
    static importSpells() {
        return EntityLogic.importScript("../spells.js");
    }
    static importCosmetics() {
        return EntityLogic.importScript("../cosmetics.js");
    }
    static importCharacters() {
        return EntityLogic.importScript("../characters.js");
    }

    /**
     * Creates a FurnitureEntity
     * @memberof module:furniture
     * @param {string} [id] Unique ID
     * @param {string} name Name
     * @param {string} [description] Description
     * @param {string} [iconID] Icon ID
     * @param {string} meshID Mesh ID
     * @param {string} textureID Texture ID
     * @param {FurnitureEnum} furnitureType FurnitureEnum
     * @param {number} weight Weight in kilograms
     * @param {number} price Price, non-decimal
     */
    static createFurnitureEntity(id, name = "", description = "", iconID = "", meshID = "missingMesh", textureID = "missingMaterial", furnitureType = FurnitureEnum.NONE, weight = 1, price = 1) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let entity = new FurnitureEntity(id, name, description, iconID, furnitureType);
        if (entity instanceof FurnitureEntity) {
            /**
             * TODO: allow setMeshID to handle arrays
             * eg, ["bathtub01", "showerPipes01"]
             */
            entity.setMeshID(meshID);
            entity.setTextureID(textureID);
            entity.setPrice(price);
            entity.setWeight(weight);
            return entity;
        }
        return 2;
    }
    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {string} [description] 
     * @param {string} [iconID] 
     * @param {string} meshID 
     * @param {string} textureID 
     */
    static createLightingEntity(id = "", name = "", description = "", iconID = "", meshID = "missingMesh", textureID = "missingMaterial", lightingType = null, lightingPositionOffset = [0, 0, 0]) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let entity = new LightingEntity(id, name, description, iconID, lightingType, lightingPositionOffset);
        if (entity instanceof LightingEntity) {
            entity.setMeshID(meshID);
            entity.setTextureID(textureID);
            return entity;
        }
        return 2;
    }
    /**
     * Creates a PlantEntity
     * @memberof module:plants
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {string} [name] Name
     * @param  {string} [meshID] Mesh ID
     * @param  {string} [materialID] Texture ID
     * @param  {array} [stages] Stages
     * @param  {object} [options] Options
     * @return {PlantEntity} 
     */
    static createPlantEntity(id = "", name = "Plant",  description = "", iconID = "missingIcon", meshID = "missingMesh", materialID = "missingMaterial", plantType = PlantEnum.GRASS, stages = [], options = {}) {
        id = Tools.filterID(id);
        if ((id.length == 0)) {
            id = Tools.genUUIDv4();
        }
        if (EntityLogic.debugMode) console.log(`Running EntityLogic.createPlantEntity(${id}, ${name}, ${description}, ${iconID}, ${meshID}, ${materialID}, ${plantType}, ${stages})`);
        let plantEntity = new PlantEntity(id, name, description, iconID, plantType, stages);
        plantEntity.setMeshID(meshID);
        plantEntity.setMaterialID(materialID);
        plantEntity.addStages(stages);
        return plantEntity;
    }
    /**
     * Creates an ItemEntity
     * @memberof module:items
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} [description] Description
     * @param {string} [iconID] Icon ID
     * @param {string} meshID Mesh ID
     * @param {string} textureID Texture ID
     * @param {ItemEnum} itemType ItemEnum
     * @param {number} [subType] Dependant on itemType
     * @param {number} [weight] Weight in kilograms
     * @param {number} [price] Price, non-decimal
     * @returns {(ItemEntity|number)} An ItemEntity or an integer status code
     */
    static createItemEntity(id, name = "", description = "", iconID = "", meshID = "missingMesh", textureID = "missingMaterial", itemType = ItemEnum.GENERAL, subType = 0, weight = 1, price = 0) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let itemEntity = null;
        switch (itemType) {
            case ItemEnum.GENERAL: {
                itemEntity = new ItemEntity(id, name, description, iconID);
                break;
            }
            case ItemEnum.APPAREL: {
                itemEntity = new ClothingEntity(id, name, description, iconID, subType);
                break;
            }
            case ItemEnum.WEAPON: {
                itemEntity = new WeaponEntity(id, name, description, iconID, subType);
                break;
            }
            case ItemEnum.SHIELDS: {
                itemEntity = new ShieldEntity(id, name, description, iconID);
                break;
            }
            case ItemEnum.KEY: {
                itemEntity = new KeyEntity(id, name, description, iconID);
                break;
            }
            case ItemEnum.BOOK: {
                itemEntity = new BookEntity(id, name, description, iconID);
                break;
            }
            case ItemEnum.CONSUMABLE: {
                itemEntity = new ConsumableEntity(id, name, description, iconID, subType);
                break;
            }
            default: {
                itemEntity = new ItemEntity(id, name, description, iconID);
            }
        }
        if (itemEntity instanceof ItemEntity) {
            itemEntity.setMeshID(meshID);
            itemEntity.setTextureID(textureID);
            return itemEntity;
        }
        return 2;
    }
    /**
     * 
     * @memberof module:characters
     * @param {string} id Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} [description] Description
     * @param {string} [iconID] Icon ID
     * @param {CreatureTypeEnum} [creatureType] Creature Type
     * @param {CreatureSubTypeEnum} [creatureSubType] Creature Sub-Type
     * @param {SexEnum} [sex] SexEnum
     * @param {number} [age] Age
     * @param {string} meshID Mesh ID
     * @param {string} materialID Material ID
     * @param {object} [options] Options
     */
    static createCharacterEntity(id = "", name = "", description = "", iconID = "genericCharacterIcon", creatureType = CreatureTypeEnum.HUMANOID, creatureSubType = CreatureSubTypeEnum.FOX, sex = SexEnum.MALE, age = 18, meshID = "missingMesh", materialID = "missingMaterial", options = {}) {
        id = Tools.filterID(id);
        if ((id.length == 0)) {
            id = Tools.genUUIDv4();
        }
        if (EntityLogic.debugMode) console.log(`Running EntityLogic.createCharacterEntity(${id}, ${name}, ${description}, ${iconID}, ${creatureType}, ${creatureSubType}, ${sex}, ${age}, ${meshID}, ${materialID})`);
        let characterEntity = new CharacterEntity(id, name, description, iconID, creatureType, creatureSubType, sex, age, undefined);
        let soul = new SoulEntity(id, name, description);
        soul.assign(characterEntity, false); // Assuming this soul is just initialized, copy over some needed properties from its body
        soul.setCharisma(10);
        soul.setIntelligence(10);
        soul.setWisdom(10);
        characterEntity.setSoul(soul, false); // Assign the body its soul, without updating its properties, because they've already been set
        if (typeof options == "object") {
            for (let i in options) {
                switch (i) {
                    case "eye":
                    case "eyes": {
                        characterEntity.setEyeType(options[i]);
                        break;
                    }
                    case "eyeColor":
                    case "eyesColor":
                    case "eyeColour":
                    case "eyesColour": {
                        characterEntity.setEyeColour(options[i]);
                        break;
                    }
                }
            }
        }
        if (meshID == "missingMesh" || meshID == undefined) {
            if (characterEntity.getCreatureType() == CreatureTypeEnum.HUMANOID) {
                if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.FOX) {
                    if (characterEntity.getSex() == SexEnum.MALE) {
                        characterEntity.setMeshID("foxM");
                    }
                    else {
                        characterEntity.setMeshID("foxF");
                    }
                }
                else if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.SHEEP) {
                    if (characterEntity.getSex() == SexEnum.MALE) {
                        characterEntity.setMeshID("sheepM");
                    }
                    else {
                        characterEntity.setMeshID("sheepF");
                    }
                }
            }
            else if (characterEntity.getCreatureType() == CreatureTypeEnum.UNDEAD) {
                if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.SKELETON) {
                    characterEntity.setMeshID("foxSkeletonN");
                }
            }
        }
        else {
            characterEntity.setMeshID(meshID);
        }
        if (materialID == "missingMaterial" || materialID == "missingTexture" || materialID == undefined) {
            let textureID = "";
            if (characterEntity.getCreatureType() == CreatureTypeEnum.HUMANOID) {
                if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.FOX) {
                    textureID = "foxRed";
                }
                else if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.SHEEP) {
                    textureID = "sheepWhite";
                }
            }
            else if (characterEntity.getCreatureType() == CreatureTypeEnum.UNDEAD) {
                if (characterEntity.getCreatureSubType() == CreatureSubTypeEnum.SKELETONFOX) {
                    textureID = "bone01";
                }
            }
            characterEntity.setTextureID(textureID);
            characterEntity.setMaterialID(textureID);
        }
        else {
            characterEntity.setTextureID(materialID);
            characterEntity.setMaterialID(materialID);
        }
        return characterEntity;
    }
    /**
     * Creates a Cosmetic
     * @memberof module:cosmetics
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} [description] Description
     * @param {string} [iconID] Icon ID
     * @param {string} meshID Mesh ID
     * @param {string} textureID Texture ID
     * @param {ApparelSlotEnum} equipmentSlot ApparelSlotEnum
     * @returns {(Cosmetic|number)} A Cosmetic or an integer status code
     */
    static createCosmetic(id, name = "", description = "", iconID = "", meshID = "missingMesh", textureID = "missingMaterial", equipmentSlot = ApparelSlotEnum.HEAD) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let cosmetic = new Cosmetic(id, name, description, iconID, meshID, textureID, equipmentSlot);
        if (cosmetic instanceof Cosmetic) {
            return cosmetic;
        }
        return 2;
    }
    /**
     * 
     * @memberof module:spells
     * @param {string} id 
     * @param {string} name 
     * @param {string} description 
     * @param {string} iconID 
     * @param {string} meshID 
     * @param {string} materialID 
     * @param {object} options 
     */
    static createSpell(id = "", name = "", description = "", iconID = "", meshID = "", materialID = "", options = {}) {
        let spell = new Spell(id, name, description, iconID);
        spell.setMeshID(meshID);
        spell.setMaterialID(materialID);
        spell.assign(options);
        return spell;
    }
    /**
     * 
     * @param {Effect} effect 
     * @param {AbstractEntity} abstractEntity 
     */
    static addScheduledEffect(effect, abstractEntity) {
        if (!(effect instanceof Effect)) {
            if (Effect.has(effect)) {
                effect = Effect.get(effect);
            }
            else {
                return 2;
            }
        }
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        EntityLogic.tickWorkerPostMessage(
            "addScheduledEffect",
            0,
            [
                effect.getID(),
                abstractEntity.getID(),
                effect.getDuration(),
                effect.getDurationInterval(),
                effect.getIntervalType(),
                effect.getIntervalNth(),
                effect.getPriority()
            ]
        );
    }
    /**
     * 
     * @param {Effect} effect 
     * @param {AbstractEntity} abstractEntity 
     */
    static removeScheduledEffect(effect, abstractEntity) {
        if (!(effect instanceof Effect)) {
            if (Effect.has(effect)) {
                effect = Effect.get(effect);
            }
            else {
                return 2;
            }
        }
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        EntityLogic.tickWorkerPostMessage(
            "removeScheduledEffect",
            0,
            [effect.getID(), abstractEntity.getID()]
        );
    }
    static addScheduledCommand(addTick, abstractEntityID, commandString) {
        addTick = (Number.parseInt(addTick)|0) + EntityLogic.currentTick;
        return EntityLogic.setScheduledCommand(addTick, abstractEntityID, commandString);
    }
    static setScheduledCommand(scheduledTick = 0, abstractEntityID, commandString = "") {
        if (EntityLogic.debugMode) {console.group(`Running EntityLogic.setScheduledCommand(...)`)}
        scheduledTick = Number.parseInt(scheduledTick);
        if (scheduledTick <= EntityLogic.currentTick) {
            if (EntityLogic.debugMode) {console.error("Tick was below or at current tick; cannot use."); console.groupEnd();}
            return 1;
        }
        if (abstractEntityID instanceof AbstractEntity) {
            abstractEntityID = abstractEntityID.getID();
        }
        else if (!AbstractEntity.has(abstractEntityID)) {
            if (EntityLogic.debugMode) {console.error(`Entity (${abstractEntityID}) doesn't exist.`); console.groupEnd();}
            return 1;
        }
        if (AbstractEntity.get(abstractEntityID).isDisabled()) {
            if (EntityLogic.debugMode) {console.warn(`Entity (${abstractEntityID}) is disabled and can't be used.`); console.groupEnd();}
            return 1;
        }
        commandString = String(commandString);
        if (commandString.length == 0) {
            if (EntityLogic.debugMode) {console.error("Command missing or invalid."); console.groupEnd();}
            return 1;
        }
        if (EntityLogic.debugMode) {
            console.log("Sending scheduled command with...");
            console.info(`tick: ${scheduledTick}`);
            console.info(`entity: ${abstractEntityID}`);
            console.info(`commandString: ${commandString}`);
            console.groupEnd();
        }
        EntityLogic.tickWorkerPostMessage(
            "setScheduledCommand",
            0,
            [scheduledTick, abstractEntityID, commandString]
        );
        return 0;
    }

    /**
     * 
     * @param {string} id Callback ID
     * @param {(string|undefined)} parentID ID of parent callback, if any
     * @param {function} callback Function to call
     * @param {object} params Params to pass
     */
    static createCallback(id = "", parentID = null, params = [], callback = null) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (!(params instanceof Array)) {
            params = [params];
        }
        if (EntityLogic.debugMode) console.log(`Running EntityLogic.createCallback(${id}, ${parentID}, ${params.toString()}, function())`);
        EntityLogic.callbacks[id] = {"parent":parentID, "params":params, "callback":callback, "hasRun":false, "status":0};
        return id;
    }
    static removeCallback(id) {
        delete EntityLogic.callbacks[id]["parent"];
        delete EntityLogic.callbacks[id]["params"];
        delete EntityLogic.callbacks[id]["callback"];
        delete EntityLogic.callbacks[id]["hasRun"];
        delete EntityLogic.callbacks[id];
        return 0;
    }
    static getCallback(id) {
        if (EntityLogic.callbacks.hasOwnProperty(id)) {
            return EntityLogic.callbacks[id];
        }
        return 1;
    }
    static getCallbacks(parent = null, callback = null, hasRun = null, status = null) {
        let obj = {};
        for (let entry in EntityLogic.callbacks) {
            if (
                (parent == null || parent == EntityLogic.callbacks[entry]["parent"]) &&
                (callback == null || callback == EntityLogic.callbacks[entry]["callback"]) &&
                (hasRun == null || hasRun == EntityLogic.callbacks[entry]["hasRun"]) &&
                (status == null || status == EntityLogic.callbacks[entry]["status"])
            ) {
                obj[entry] = EntityLogic.callbacks[entry];
            }
        }
        return obj;
    }
    static hasCallback(id) {
        return EntityLogic.callbacks.hasOwnProperty(id);
    }
    /**
     * 
     * @param {string} id 
     * @param {(object|null)} [response] 
     */
    static runCallback(id, response = null) {
        if (!EntityLogic.hasCallback(id)) {
            return 1;
        }
        let callback = EntityLogic.getCallback(id);
        if (callback["hasRun"]) {
            return 0;
        }
        callback["hasRun"] = true;
        if (EntityLogic.debugMode) console.group(`Running EntityLogic.runCallback(${id}, ${response})`);
        if (typeof callback["callback"] == "function") {
            callback["callback"](...callback["params"], response, id);
        }
        if (EntityLogic.debugMode) console.groupEnd();
        return 0;
    }
    /**
     * 
     * @param {string} id 
     * @param {(object|null)} [response] 
     */
    static runCallbackParent(id, response = null) {
        if (EntityLogic.callbacks.hasOwnProperty(id)) {
            if (EntityLogic.callbacks.hasOwnProperty(EntityLogic.callbacks[id]["parent"])) {
                EntityLogic.runCallback(EntityLogic.callbacks[id]["parent"], response);
            }
        }
        return 0;
    }
    static hasRunCallback(id) {
        return EntityLogic.callbacks.hasOwnProperty(id) && EntityLogic.callbacks[id]["hasRun"] === true;
    }
    static setHasRunCallback(id, hasRun = true) {
        if (EntityLogic.hasCallback(id)) {
            EntityLogic.getCallback(id)["hasRun"] = (hasRun === true);
        }
        return 0;
    }
    static sendPlayerEntityUpdates() {
        EntityLogic.gameWorkerPostMessage("updateEntity", 0, EntityLogic.playerEntity.stringify(true));
    }
}
EntityLogic.initialize();
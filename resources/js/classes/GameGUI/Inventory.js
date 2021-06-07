class InventoryGameGUI {
    static initialize() {
        if (Game.debugMode) BABYLON.Tools.Log("Initializing InventoryGameGUI");
        InventoryGameGUI.initialized = false;
        InventoryGameGUI.controller = null;
        InventoryGameGUI.titleBar = null;
        InventoryGameGUI.closeButton = null;
        InventoryGameGUI.bodyContainer = null;
        InventoryGameGUI.fullScreen = true;
        InventoryGameGUI.defaultWidthInPixels = 0;
        InventoryGameGUI.defaultHeightInPixels = 0;
        InventoryGameGUI.windowWidthInPixels = -1;
        InventoryGameGUI.windowHeightInPixels = -1;
        InventoryGameGUI.posX = 0;
        InventoryGameGUI.posY = 0;

        InventoryGameGUI.tabsAndItems = null;
        InventoryGameGUI.tabs = null;
        InventoryGameGUI.tabsAll = null;
        InventoryGameGUI.tabsClothing = null;
        InventoryGameGUI.tabsWeapons = null;
        InventoryGameGUI.tabsShields = null;
        InventoryGameGUI.tabsConsumables = null;
        InventoryGameGUI.tabsBooks = null;
        InventoryGameGUI.tabsKeys = null;
        InventoryGameGUI.tabsMisc = null;
        InventoryGameGUI.items = null;
        InventoryGameGUI.tabsAndItemsSummary = null;
        InventoryGameGUI.tAISWeightIcon = null;
        InventoryGameGUI.tAISWeight = null;
        InventoryGameGUI.tAISMoneyIcon = null;
        InventoryGameGUI.tAISMoney = null;
        InventoryGameGUI.selectedSummary = null;
        InventoryGameGUI.selectedName = null;
        InventoryGameGUI.selectedImage = null;
        InventoryGameGUI.selectedDescription = null;
        InventoryGameGUI.selectedDetails = null;
        InventoryGameGUI.selectedActions = null;
        InventoryGameGUI.isVisible = false;
        InventoryGameGUI.targetController = null;
        InventoryGameGUI.otherController = null;
        InventoryGameGUI.selectedEntity = null;
        InventoryGameGUI.selectedTab = ItemEnum.GENERAL;

        InventoryGameGUI.resetDefaultDimensions();
        InventoryGameGUI.generateController();
        return 0;
    }
    static resetDefaultDimensions() {
        InventoryGameGUI.defaultWidthInPixels = Game.renderWidth;
        InventoryGameGUI.defaultHeightInPixels = Game.renderHeight;
        return 0;
    }
    static resize() {
        if (InventoryGameGUI.initialized != true) {
            return 1;
        }
        InventoryGameGUI.resetDefaultDimensions();
        if (InventoryGameGUI.fullScreen) {
            InventoryGameGUI.windowWidthInPixels = Game.renderWidth;
            InventoryGameGUI.windowHeightInPixels = Game.renderHeight;
        }

        InventoryGameGUI.controller.widthInPixels = InventoryGameGUI.windowWidthInPixels;
        InventoryGameGUI.controller.heightInPixels = InventoryGameGUI.windowHeightInPixelsc;
        InventoryGameGUI.titleBar.widthInPixels = InventoryGameGUI.controller.widthInPixels;
        InventoryGameGUI.titleBar.heightInPixels = GameGUI.titleBarHeightInPixels;
        InventoryGameGUI.title.widthInPixels = InventoryGameGUI.titleBar.widthInPixels - GameGUI.getFontSizeInPixels(2);
        InventoryGameGUI.closeButton.width = GameGUI.getFontSize(2);
        InventoryGameGUI.closeButton.height = GameGUI.getFontSize(2);
        InventoryGameGUI.bodyContainer.widthInPixels = InventoryGameGUI.controller.widthInPixels;
        InventoryGameGUI.bodyContainer.heightInPixels = InventoryGameGUI.controller.heightInPixels - InventoryGameGUI.titleBar.heightInPixels;
        
        InventoryGameGUI.tabsAndItems.height = InventoryGameGUI.bodyContainer.height;
        InventoryGameGUI.tabsAndItems.widthInPixels = Math.floor((InventoryGameGUI.bodyContainer.widthInPixels / 3) * 2);
            InventoryGameGUI.tabs.height = GameGUI.getFontSize(4);
            InventoryGameGUI.tabs.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsAll);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsClothing);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsWeapons);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsShields);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsConsumables);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsBooks);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsKeys);
                InventoryGameGUI._resizeTabButton(InventoryGameGUI.tabsMisc);
            InventoryGameGUI.itemsContainer.heightInPixels = Math.floor(InventoryGameGUI.tabsAndItems.heightInPixels - InventoryGameGUI.tabs.heightInPixels * 2);
            InventoryGameGUI.itemsContainer.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI.items.height = "900px"
                InventoryGameGUI.items.width = InventoryGameGUI.itemsContainer.width;
            InventoryGameGUI.tabsAndItemsSummary.height = GameGUI.getFontSize(4);
            InventoryGameGUI.tabsAndItemsSummary.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI.tAISWeightContainer.height = InventoryGameGUI.tabsAndItemsSummary.height;
                InventoryGameGUI.tAISWeightContainer.widthInPixels = Math.floor(InventoryGameGUI.tabsAndItemsSummary.widthInPixels / 2);
                    InventoryGameGUI.tAISWeightIcon.height = InventoryGameGUI.tAISWeightContainer.height;
                    InventoryGameGUI.tAISWeightIcon.width = InventoryGameGUI.tAISWeightContainer.height;
                    InventoryGameGUI.tAISWeight.height = InventoryGameGUI.tAISWeightContainer.height;
                    InventoryGameGUI.tAISWeight.fontSize = InventoryGameGUI.tAISWeightContainer.height;
                InventoryGameGUI.tAISMoneyContainer.height = InventoryGameGUI.tabsAndItemsSummary.height;
                InventoryGameGUI.tAISMoneyContainer.widthInPixels = Math.floor(InventoryGameGUI.tabsAndItemsSummary.widthInPixels / 2);
                    InventoryGameGUI.tAISMoneyIcon.height = InventoryGameGUI.tAISMoneyContainer.height;
                    InventoryGameGUI.tAISMoneyIcon.width = InventoryGameGUI.tAISMoneyContainer.height;
                    InventoryGameGUI.tAISMoney.height = InventoryGameGUI.tAISMoneyContainer.height;
                    InventoryGameGUI.tAISMoney.fontSize = InventoryGameGUI.tAISMoneyContainer.height;
        InventoryGameGUI.selectedSummary.height = InventoryGameGUI.bodyContainer.height;
        InventoryGameGUI.selectedSummary.widthInPixels = Math.floor(InventoryGameGUI.bodyContainer.widthInPixels / 3);
            InventoryGameGUI.selectedName.width = InventoryGameGUI.selectedSummary.width;
            InventoryGameGUI.selectedName.height = GameGUI.getFontSize(2);
            InventoryGameGUI.selectedImage.width = InventoryGameGUI.selectedSummary.width;
            InventoryGameGUI.selectedImage.heightInPixels = Math.floor(InventoryGameGUI.bodyContainer.heightInPixels - GameGUI.getFontSizeInPixels(26));
            InventoryGameGUI.selectedDescription.width = InventoryGameGUI.selectedSummary.width;
            InventoryGameGUI.selectedDescription.height = GameGUI.getFontSize(8);
            InventoryGameGUI.selectedDetails.width = InventoryGameGUI.selectedSummary.width;
            InventoryGameGUI.selectedDetails.height = GameGUI.getFontSize(4);
            InventoryGameGUI.selectedActions.width = InventoryGameGUI.selectedSummary.width;
            InventoryGameGUI.selectedActions.height = GameGUI.getFontSize(12);
        return 0;
    }
    static generateController() {
        [InventoryGameGUI.controller, InventoryGameGUI.titleBar, InventoryGameGUI.title, InventoryGameGUI.closeButton, InventoryGameGUI.bodyContainer] = GameGUI.createWindow("inventory", "Inventory", InventoryGameGUI.defaultWidthInPixels, InventoryGameGUI.defaultHeightInPixels, 2);
        InventoryGameGUI.bodyContainer.isVertical = false;
        InventoryGameGUI.tabsAndItems = GameGUI.createStackPanel("tabsAndItems");
            InventoryGameGUI.tabsAndItems.height = InventoryGameGUI.bodyContainer.height;
            InventoryGameGUI.tabsAndItems.widthInPixels = Math.floor((InventoryGameGUI.bodyContainer.widthInPixels / 3) * 2);
            InventoryGameGUI.tabsAndItems.isVertical = true;
            InventoryGameGUI.tabs = GameGUI.createStackPanel("tabs");
                InventoryGameGUI.tabs.height = GameGUI.getFontSize(4);
                InventoryGameGUI.tabs.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI.tabs.isVertical = false;
                    InventoryGameGUI.tabsAll = InventoryGameGUI.createTabButton("tabsAll", "All", Game.getIcon("genericBagIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.GENERAL; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsAll);
                    InventoryGameGUI.tabsClothing = InventoryGameGUI.createTabButton("tabsClothing", "Clothing", Game.getIcon("genericShirtIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.APPAREL; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsClothing);
                    InventoryGameGUI.tabsWeapons = InventoryGameGUI.createTabButton("tabsWeapons", "Weapons", Game.getIcon("genericSwordIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.WEAPON; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsWeapons);
                    InventoryGameGUI.tabsShields = InventoryGameGUI.createTabButton("tabsShields", "Shields", Game.getIcon("genericShieldIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.SHIELDS; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsShields);
                    InventoryGameGUI.tabsConsumables = InventoryGameGUI.createTabButton("tabsConsumables", "Consumables", Game.getIcon("genericBagIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.CONSUMABLE; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsConsumables);
                    InventoryGameGUI.tabsBooks = InventoryGameGUI.createTabButton("tabsBooks", "Books", Game.getIcon("genericBagIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.BOOK; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsBooks);
                    InventoryGameGUI.tabsKeys = InventoryGameGUI.createTabButton("tabsKeys", "Keys", Game.getIcon("genericBagIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.KEY; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsKeys);
                    InventoryGameGUI.tabsMisc = InventoryGameGUI.createTabButton("tabsMisc", "Misc", Game.getIcon("genericBagIcon"), function() {InventoryGameGUI.selectedTab = ItemEnum.TRASH; InventoryGameGUI.update();});
                    InventoryGameGUI.tabs.addControl(InventoryGameGUI.tabsMisc);
                InventoryGameGUI.tabsAndItems.addControl(InventoryGameGUI.tabs);
            InventoryGameGUI.itemsContainer = new BABYLON.GUI.ScrollViewer("itemsContainer");
                InventoryGameGUI.itemsContainer.heightInPixels = Math.floor(InventoryGameGUI.tabsAndItems.heightInPixels - InventoryGameGUI.tabs.heightInPixels * 2);
                InventoryGameGUI.itemsContainer.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI.itemsContainer._horizontalBarSpace.isVisible = false;
                InventoryGameGUI.itemsContainer._horizontalBarSpace.isEnabled = false;
                InventoryGameGUI.items = GameGUI.createStackPanel("items");
                    InventoryGameGUI.items.heightInPixels = Math.floor(InventoryGameGUI.tabsAndItems.heightInPixels - InventoryGameGUI.tabs.heightInPixels * 2); // multiplied by two for both tabs, and summary
                    InventoryGameGUI.items.width = InventoryGameGUI.tabsAndItems.width;
                    InventoryGameGUI.items.horizontalAlignment = BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT;
                    InventoryGameGUI.items.isVertical = true;
                    InventoryGameGUI.itemsContainer.addControl(InventoryGameGUI.items);
                InventoryGameGUI.tabsAndItems.addControl(InventoryGameGUI.itemsContainer);
            InventoryGameGUI.tabsAndItemsSummary = GameGUI.createStackPanel("tabsAndItemsSummary");
                InventoryGameGUI.tabsAndItemsSummary.height = GameGUI.getFontSize(4);
                InventoryGameGUI.tabsAndItemsSummary.width = InventoryGameGUI.tabsAndItems.width;
                InventoryGameGUI.tabsAndItemsSummary.isVertical = false;
                InventoryGameGUI.tabsAndItems.addControl(InventoryGameGUI.tabsAndItemsSummary);
                InventoryGameGUI.tAISWeightContainer = GameGUI.createStackPanel("tAISWeightContainer");
                    InventoryGameGUI.tAISWeightContainer.height = InventoryGameGUI.tabsAndItemsSummary.height;
                    InventoryGameGUI.tAISWeightContainer.widthInPixels = Math.floor(InventoryGameGUI.tabsAndItemsSummary.widthInPixels / 2);
                    InventoryGameGUI.tAISWeightContainer.isVertical = false;
                    InventoryGameGUI.tAISWeightIcon = new BABYLON.GUI.Image("tAISWeightIcon", Game.getIcon("genericBagIcon"));
                        InventoryGameGUI.tAISWeightIcon.height = InventoryGameGUI.tAISWeightContainer.height;
                        InventoryGameGUI.tAISWeightIcon.width = InventoryGameGUI.tAISWeightContainer.height;
                        InventoryGameGUI.tAISWeightIcon.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                    InventoryGameGUI.tAISWeight = GameGUI.createTextBlock("tAISWeight", "0");
                        InventoryGameGUI.tAISWeight.height = InventoryGameGUI.tAISWeightContainer.height;
                        InventoryGameGUI.tAISWeight.widthInPixels = Math.floor(InventoryGameGUI.tAISWeightContainer.widthInPixels - InventoryGameGUI.tAISWeightIcon.widthInPixels);
                        InventoryGameGUI.tAISWeight.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        InventoryGameGUI.tAISWeight.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                        InventoryGameGUI.tAISWeight.fontSize = InventoryGameGUI.tAISWeightContainer.height;
                    InventoryGameGUI.tAISWeightContainer.addControl(InventoryGameGUI.tAISWeightIcon);
                    InventoryGameGUI.tAISWeightContainer.addControl(InventoryGameGUI.tAISWeight);
                InventoryGameGUI.tabsAndItemsSummary.addControl(InventoryGameGUI.tAISWeightContainer);
                InventoryGameGUI.tAISMoneyContainer = GameGUI.createStackPanel("tAISMoneyContainer");
                    InventoryGameGUI.tAISMoneyContainer.height = InventoryGameGUI.tabsAndItemsSummary.height;
                    InventoryGameGUI.tAISMoneyContainer.widthInPixels = Math.floor(InventoryGameGUI.tabsAndItemsSummary.widthInPixels / 2);
                    InventoryGameGUI.tAISMoneyContainer.isVertical = false;
                    InventoryGameGUI.tAISMoneyIcon = new BABYLON.GUI.Image("tAISMoneyIcon", Game.getIcon("genericMoneyIcon"));
                        InventoryGameGUI.tAISMoneyIcon.height = InventoryGameGUI.tAISMoneyContainer.height;
                        InventoryGameGUI.tAISMoneyIcon.width = InventoryGameGUI.tAISMoneyContainer.height;
                        InventoryGameGUI.tAISMoneyIcon.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                    InventoryGameGUI.tAISMoney = GameGUI.createTextBlock("tAISMoney", "0");
                        InventoryGameGUI.tAISMoney.height = InventoryGameGUI.tAISMoneyContainer.height;
                        InventoryGameGUI.tAISMoney.widthInPixels = Math.floor(InventoryGameGUI.tAISMoneyContainer.widthInPixels - InventoryGameGUI.tAISMoneyIcon.widthInPixels);
                        InventoryGameGUI.tAISMoney.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        InventoryGameGUI.tAISMoney.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                        InventoryGameGUI.tAISMoney.fontSize = InventoryGameGUI.tAISMoneyContainer.height;
                    InventoryGameGUI.tAISMoneyContainer.addControl(InventoryGameGUI.tAISMoneyIcon);
                    InventoryGameGUI.tAISMoneyContainer.addControl(InventoryGameGUI.tAISMoney);
                InventoryGameGUI.tabsAndItemsSummary.addControl(InventoryGameGUI.tAISMoneyContainer);
            InventoryGameGUI.bodyContainer.addControl(InventoryGameGUI.tabsAndItems);
            
            InventoryGameGUI.selectedSummary = GameGUI.createStackPanel("summary");
                InventoryGameGUI.selectedSummary.height = InventoryGameGUI.bodyContainer.height;
                InventoryGameGUI.selectedSummary.widthInPixels = Math.floor(InventoryGameGUI.bodyContainer.widthInPixels / 3);
                InventoryGameGUI.selectedSummary.isVertical = true;
                InventoryGameGUI.selectedName = GameGUI.createTextBlock("selectedName");
                    InventoryGameGUI.selectedName.width = InventoryGameGUI.selectedSummary.width;
                    InventoryGameGUI.selectedName.height = GameGUI.getFontSize(2);
                    InventoryGameGUI.selectedSummary.addControl(InventoryGameGUI.selectedName);
                InventoryGameGUI.selectedImage = new BABYLON.GUI.Image("selectedImage", "resources/images/blank.svg");
                    InventoryGameGUI.selectedImage.width = InventoryGameGUI.selectedSummary.width;
                    InventoryGameGUI.selectedImage.heightInPixels = Math.floor(InventoryGameGUI.bodyContainer.heightInPixels - GameGUI.getFontSizeInPixels(26));
                    InventoryGameGUI.selectedImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                    InventoryGameGUI.selectedSummary.addControl(InventoryGameGUI.selectedImage);
                InventoryGameGUI.selectedDescription = GameGUI.createTextBlock("selectedDescription");
                    InventoryGameGUI.selectedDescription.width = InventoryGameGUI.selectedSummary.width;
                    InventoryGameGUI.selectedDescription.height = GameGUI.getFontSize(8);
                    InventoryGameGUI.selectedDescription.paddingLeft = 0.1;
                    InventoryGameGUI.selectedDescription.paddingRight = 0.1;
                    InventoryGameGUI.selectedDescription.textWrapping = true;
                    InventoryGameGUI.selectedSummary.addControl(InventoryGameGUI.selectedDescription);
                InventoryGameGUI.selectedDetails = GameGUI.createTextBlock("selectedDetails");
                    InventoryGameGUI.selectedDetails.width = InventoryGameGUI.selectedSummary.width;
                    InventoryGameGUI.selectedDetails.height = GameGUI.getFontSize(4);
                    InventoryGameGUI.selectedSummary.addControl(InventoryGameGUI.selectedDetails);
                InventoryGameGUI.selectedActions = GameGUI.createStackPanel("actions");
                    InventoryGameGUI.selectedActions.width = InventoryGameGUI.selectedSummary.width;
                    InventoryGameGUI.selectedActions.height = GameGUI.getFontSize(12);
                    InventoryGameGUI.selectedSummary.addControl(InventoryGameGUI.selectedActions);
            InventoryGameGUI.bodyContainer.addControl(InventoryGameGUI.selectedSummary);
        
        InventoryGameGUI.closeButton.onPointerUpObservable.add(function() {
            InventoryGameGUI.clearSelected();
            InventoryGameGUI.hide();
        });
        
        InventoryGameGUI.controller.zIndex = 50;
        InventoryGameGUI.initialized = true;
        return InventoryGameGUI.controller;
    }
    static getController() {
        return InventoryGameGUI.controller;
    }
    static show() {
        InventoryGameGUI.controller.isVisible = true;
        InventoryGameGUI.isVisible = true;
    }
    static hide() {
        InventoryGameGUI.controller.isVisible = false;
        InventoryGameGUI.isVisible = false;
    }
    static update() {
        return InventoryGameGUI.set(InventoryGameGUI.targetController);
    }
    /**
     * Sets the inventory menu's content using an entity's inventory.
     * @param {AbstractEntity} entityController The Entity with the inventory.
     */
    static set(entityController = Game.playerController, parentCallbackID = null) {
        if (!(entityController instanceof EntityController)) {
            if (EntityController.has(entityController)) {
                entityController = EntityController.get(entityController);
            }
            else {
                return 2;
            }
        }
        let callbackID = Tools.genUUIDv4();
        Game.createCallback(callbackID, parentCallbackID, [entityController], InventoryGameGUI.setResponse);
        Game.entityLogicWorkerPostMessage("getInventory", 0, {"entityID":entityController.entityID, "filter":InventoryGameGUI.selectedTab}, callbackID);
        return 0;
    }
    static setResponse(entityController, response, parentCallbackID) {
        InventoryGameGUI.targetController = entityController;
        InventoryGameGUI.resize();
        for (let i = InventoryGameGUI.items.children.length - 1; i > -1; i--) {
            let entry = InventoryGameGUI.items.children[i];
            InventoryGameGUI.items.removeControl(entry);
            entry.dispose();
        }
        InventoryGameGUI.items.clearControls();
        if (Object.keys(response.container.items).length > 0) {
            let itemsHeightInPixels = 0;
            for (let id in response.container.items) {
                let itemEntity = response.container.items[id];
                let button = InventoryGameGUI.createInventoryItemsButton(itemEntity.id, itemEntity.name, Game.getIcon(itemEntity.iconID));
                button.onPointerUpObservable.add(function() {
                    InventoryGameGUI.setSelected(itemEntity.id, entityController, entityController);
                });
                InventoryGameGUI.items.addControl(button);
                itemsHeightInPixels += button.heightInPixels;
            };
            InventoryGameGUI.items.heightInPixels = Math.floor(itemsHeightInPixels);
            InventoryGameGUI.tAISWeight.text = String(response.container.size);
            InventoryGameGUI.tAISWeightContainer.isVisible = true;
            InventoryGameGUI.clearSelected();
        }
        else {
            InventoryGameGUI.tAISWeightContainer.isVisible = false;
        }
        if (response.hasOwnProperty("money")) {
            InventoryGameGUI.tAISMoney.text = String(response.money);
            InventoryGameGUI.tAISMoneyContainer.isVisible = true;
        }
        else {
            InventoryGameGUI.tAISMoneyContainer.isVisible = false;
        }
        return 0;
    }
    /**
     * Sets the inventory menu's selected item section.
     * @param {object} itemID 
     * @param {EntityController} targetController The EntityController storing the entityObject
     * @param {EntityController} actorController The EntityController viewing the entityObject; the player controller.
     */
    static setSelected(itemID, targetController = Game.playerController, actorController = Game.playerController, parentCallbackID = null) {
        if (typeof itemID == "string") {}
        else if (itemID.hasOwnProperty("id")) {
            itemID = itemID.id;
        }
        else {
            return 2;
        }
        targetController = Game.filterController(targetController);
        actorController = Game.filterController(actorController);
        if (actorController == -1) {
            return 1;
        }
        let callbackID = Tools.genUUIDv4();
        Game.createCallback(callbackID, parentCallbackID, [itemID, targetController, actorController], InventoryGameGUI.setSelectedResponsePhaseOne);
        Game.entityLogicWorkerPostMessage("hasItem", 0, {"target":targetController.entityID, "entityID":itemID}, callbackID);
        return 0;
    }
    static hasSelected() {
        return InventoryGameGUI.selectedEntity instanceof Object && InventoryGameGUI.selectedEntity.hasOwnProperty("id");
    }
    static updateSelected(useCachedEntity = false) {
        if (InventoryGameGUI.hasSelected()) {
            let itemID = InventoryGameGUI.selectedEntity.id;
            let targetController = InventoryGameGUI.targetController;
            let actorController = InventoryGameGUI.actorController;
            InventoryGameGUI.clearSelected();
            InventoryGameGUI.setSelected(itemID, targetController, actorController);
        }
        return 0;
    }
    static setSelectedResponsePhaseOne(itemID, targetController, actorController, response, parentCallbackID) {
        if (!response.hasItem) {
            InventoryGameGUI.clearSelected();
            return 1;
        }
        let callbackID = Tools.genUUIDv4();
        Game.createCallback(callbackID, parentCallbackID, [itemID, targetController, actorController], InventoryGameGUI.setSelectedResponsePhaseTwo);
        Game.entityLogicWorkerPostMessage("getEntity", 0, {"entityID":itemID}, callbackID);
        return 0;
    }
    static setSelectedResponsePhaseTwo(itemID, targetController, actorController, response, parentCallbackID) {
        InventoryGameGUI.selectedEntity = response;
        InventoryGameGUI.selectedName.text = response.name;
        InventoryGameGUI.selectedImage.source = Game.getIcon(response.iconID);
        InventoryGameGUI.selectedDescription.text = response.description;
        let weightString = "";
        if (response.weight < 1) {
            weightString = String(response.weight * 1000) + "g";
        }
        else {
            weightString = String(response.weight) + "kg";
        }
        InventoryGameGUI.selectedDetails.text = `Price: $${response.price}, Weight: ${weightString}`;
        for (let i = InventoryGameGUI.selectedActions.children.length - 1; i > -1; i--) {
            let child = InventoryGameGUI.selectedActions.children[i];
            InventoryGameGUI.selectedActions.removeControl(child);
            child.dispose();
        }
        for (let action in response.availableActions) {
            action = Tools.filterInt(action);
            let actionButton = null;
            switch (action) {
                case ActionEnum.CONSUME : {
                    actionButton = GameGUI.createButton("actionConsumeButton", ActionEnum.properties[action].name);
                    actionButton.onPointerUpObservable.add(function() {Game.actionConsume(response.id, actorController, InventoryGameGUI.setSelected);});
                    break;
                }
                case ActionEnum.DROP : {
                    actionButton = GameGUI.createButton("actionDropButton", ActionEnum.properties[action].name);
                    actionButton.onPointerUpObservable.add(function() {Game.actionDrop(response.id, actorController, InventoryGameGUI.setSelected);});
                    break;
                }
                case ActionEnum.EQUIP : {
                    if (response.equipped) {
                        actionButton = GameGUI.createButton("actionUnequipButton", ActionEnum.properties[ActionEnum.UNEQUIP].name);
                        actionButton.onPointerUpObservable.add(function() {Game.actionUnequip(response.id, actorController, InventoryGameGUI.setSelected);});
                    }
                    else {
                        actionButton = GameGUI.createButton("actionEquipButton", ActionEnum.properties[ActionEnum.EQUIP].name);
                        actionButton.onPointerUpObservable.add(function() {Game.actionEquip(response.id, actorController, InventoryGameGUI.setSelected);});
                    }
                    break;
                }
                case ActionEnum.HOLD : {
                    if (response.itemType == ItemEnum.WEAPON || response.itemType == ItemEnum.SHIELDS) {
                        break;
                    }
                    if (response.held) {
                        actionButton = GameGUI.createButton("actionReleaseButton", ActionEnum.properties[ActionEnum.RELEASE].name);
                        actionButton.onPointerUpObservable.add(function() {Game.actionRelease(itemID, actorController, InventoryGameGUI.setSelected);});
                    }
                    else {
                        actionButton = GameGUI.createButton("actionHoldButton", ActionEnum.properties[ActionEnum.HOLD].name);
                        actionButton.onPointerUpObservable.add(function() {Game.actionHold(itemID, actorController, InventoryGameGUI.setSelected);});
                    }
                    break;
                }
                case ActionEnum.LOOK : {
                    actionButton = GameGUI.createButton("actionLookButton", ActionEnum.properties[action].name);
                    break;
                }
                case ActionEnum.READ : {
                    actionButton = GameGUI.createButton("actionReadButton", ActionEnum.properties[action].name);
                    actionButton.onPointerUpObservable.add(function() {Game.actionRead(itemID, actorController);});
                    break;
                }
                case ActionEnum.PUT : {
                    if (actorController != Game.playerController) {
                        break;
                    }
                    else if (targetController.hasInventory) {
                        actionButton = GameGUI.createButton("actionPutButton", ActionEnum.properties[action].name);
                    }
                    break;
                }
                case ActionEnum.TAKE : {
                    if (actorController == Game.playerController) {}
                    else {
                        actionButton = GameGUI.createButton("actionTakeButton", ActionEnum.properties[action].name);
                    }
                    break;
                }
            }
            if (actionButton != null) {
                actionButton.onPointerUpObservable.add(InventoryGameGUI.updateSelected);
                InventoryGameGUI.selectedActions.addControl(actionButton);
                actionButton.top = ((InventoryGameGUI.selectedActions.children.length * 10) - 55) + "%";
            }
        }
    }
    /**
     * Clears the inventory menu's selected item section.
     */
    static clearSelected() {
        InventoryGameGUI.selectedEntity = null;
        InventoryGameGUI.selectedName.text = "";
        InventoryGameGUI.selectedImage.source = "";
        InventoryGameGUI.selectedDescription.text = "";
        InventoryGameGUI.selectedDetails.text = "";
        for (let i = InventoryGameGUI.selectedActions.children.length - 1; i >= 0; i--) {
            InventoryGameGUI.selectedActions.removeControl(InventoryGameGUI.selectedActions.children[i]);
        }
    }
    static createInventoryItemsButton(id = "", title = "", iconPath = null) {
        id = Game.filterID(id);
        let button = new BABYLON.GUI.Button(id);
            button.width = InventoryGameGUI.items.width;
            button.heightInPixels = Math.floor(InventoryGameGUI.items.heightInPixels / 10);
            button.thickness = 0;
            let container = GameGUI.createStackPanel(id + "StackPanel");
                container.width = button.width;
                container.height = button.height;
                container.isVertical = false;
                button.addControl(container);
                let image = new BABYLON.GUI.Image(id + "Image", iconPath);
                    image.width = button.height;
                    image.height = button.height;
                    image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                    image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    container.addControl(image);
                let text = GameGUI.createTextBlock(id + "TextBlock", title);
                    text.widthInPixels = Math.floor(button.widthInPixels - button.heightInPixels);
                    text.text = title;
                    text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    container.addControl(text);
        return button;
    }
    static createTabButton(id = "", title = "", iconPath = null, onClick = null) {
        id = Game.filterID(id);
        let button = new BABYLON.GUI.Button(id);
            button.widthInPixels = Math.floor(InventoryGameGUI.tabs.widthInPixels / 8);
            button.height = InventoryGameGUI.tabs.height;
            button.thickness = 0;
            let container = GameGUI.createStackPanel(id + "StackPanel");
                container.width = button.width;
                container.height = button.height;
                container.isVertical = false;
                button.addControl(container);
                if (typeof iconPath == "string") {
                    let image = new BABYLON.GUI.Image(id + "Image", iconPath);
                    image.width = button.height;
                    image.height = button.height;
                    image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                    image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    container.addControl(image);
                }
                let text = GameGUI.createTextBlock(id + "TextBlock", title);
                    text.widthInPixels = Math.floor(button.widthInPixels - button.heightInPixels);
                    text.text = title;
                    text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    container.addControl(text);
        if (onClick != null && typeof onClick == "function") {
            button.onPointerUpObservable.add(onClick);
        }
        return button;
    }
    static _resizeTabButton(tabButton) {
        tabButton.widthInPixels = Math.floor(InventoryGameGUI.tabs.widthInPixels / 8);
        tabButton.heightInPixels = Math.floor(InventoryGameGUI.tabs.heightInPixels);
        if (tabButton.children[0].children.length == 1) {
            tabButton.children[0].children[0].widthInPixels = Math.floor(tabButton.widthInPixels);
            tabButton.children[0].children[0].heightInPixels = Math.floor(tabButton.heightInPixels);
        }
        else if (tabButton.children[0].children.length == 2) {
            tabButton.children[0].children[0].widthInPixels = Math.floor(tabButton.heightInPixels);
            tabButton.children[0].children[0].heightInPixels = Math.floor(tabButton.heightInPixels);
            tabButton.children[0].children[1].widthInPixels = Math.floor(tabButton.widthInPixels - tabButton.heightInPixels);
            tabButton.children[0].children[1].heightInPixels = Math.floor(tabButton.heightInPixels);
        }
        return 0;
    }
}
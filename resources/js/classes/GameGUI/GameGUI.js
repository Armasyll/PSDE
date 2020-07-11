/**
 * Game GUI
 */
class GameGUI {
    /**
     * 
     */
    constructor() {
        GameGUI.initialized = false;
    }
    static className() {
        return "GameGUI";
    }
    static initialize() {
        GameGUI.fontSizeInPixels = 24;
        GameGUI.fontSizeSpacing = 8;
        GameGUI.fontSize = String(GameGUI.fontSizeInPixels).concat("px");
        GameGUI.fontSizeInPixelsWithSpacing = GameGUI.fontSizeInPixels + GameGUI.fontSizeSpacing;
        GameGUI.fontSizeWithSpacing = String(GameGUI.fontSizeInPixels + GameGUI.fontSizeSpacing).concat("px");
        GameGUI.fontSizeTinyInPixels = GameGUI.fontSizeInPixels - 12;
        GameGUI.fontSizeTiny = String(GameGUI.fontSizeTinyInPixels).concat("px");
        GameGUI.fontSizeSmallInPixels = GameGUI.fontSizeInPixels - 8;
        GameGUI.fontSizeSmall = String(GameGUI.fontSizeSmallInPixels).concat("px");
        GameGUI.fontSizeLargeInPixels = GameGUI.fontSizeInPixels + 8;
        GameGUI.fontSizeLarge = String(GameGUI.fontSizeLargeInPixels).concat("px");
        GameGUI.alpha = 0.75;
        GameGUI.containerAlpha = 0.75;
        GameGUI.color = "#c3c3c3";
        GameGUI.colorDanger = "#ffffff";
        GameGUI.background = "#0c0c0c";
        GameGUI.backgroundDisabled = "#030c0c";
        GameGUI.backgroundDanger = "#dc3545";
        GameGUI.focusedBackground = "#3c3c3c";
        GameGUI.focusedBackgroundDisabled = "#0c3c3c";

        GameGUI._nameInput = undefined;
        GameGUI._ageInput = undefined;
        GameGUI._menu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("menu");
        GameGUI._menu.rootContainer.isVisible = false;
        GameGUI._menu.rootContainer.zIndex = 5;
        GameGUI._hud = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("hud");
        GameGUI._hud.rootContainer.isVisible = false;
        GameGUI._hud.rootContainer.zIndex = 3;

        GameGUI.pointerLockEventFunction = GameGUI.pointerLockEvent

        GameGUI.actionTooltip = undefined;
        GameGUI.actionTooltipLocked = false;
        GameGUI.actionsMenu = undefined;
        GameGUI.actionsMenuOptions = new Array();
        GameGUI.dialogue = undefined;
        GameGUI._initHUD();

        GameGUI._characterChoiceMenu = undefined;
        GameGUI.inventoryMenu = undefined;
        GameGUI.characterStats = undefined;
        GameGUI._initMenu();
        GameGUI.debugMenu = undefined;

        GameGUI.locked = false;
        GameGUI.initialized = true;
        GameGUI.pointerLockedBeforeShown = Game.engine.isPointerLock;
        GameGUI.resize();
    }
    static _initHUD() {
        GameGUI._crosshair = GameGUI._generateCrosshair();
        GameGUI.actionTooltip = GameGUI._generateTargetActionTooltip();
        GameGUI.actionsMenu = GameGUI._generateActionsRadialMenu();
        GameGUI._hud.addControl(GameGUI._crosshair);
        GameGUI._hud.addControl(GameGUI.actionsMenu);
        GameGUI._hud.addControl(GameGUI.actionTooltip);

        GameGUI.debugMenu = DebugGameGUI;
        GameGUI.debugMenu.initialize();
        GameGUI._hud.addControl(GameGUI.debugMenu.getSkyboxController());
        GameGUI.chat = ChatGameGUI;
        GameGUI.chat.initialize();
        GameGUI._hud.addControl(GameGUI.chat.getController());
        GameGUI.dialogue = DialogueGameGUI;
        GameGUI.dialogue.initialize();
        GameGUI._hud.addControl(GameGUI.dialogue.getController());
        GameGUI.playerPortrait = PlayerPortraitGameGUI;
        GameGUI.playerPortrait.initialize();
        GameGUI._hud.addControl(GameGUI.playerPortrait.getController());
        GameGUI.targetPortrait = TargetPortraitGameGUI;
        GameGUI.targetPortrait.initialize();
        GameGUI._hud.addControl(GameGUI.targetPortrait.getController());
    }
    static _initMenu() {
        GameGUI._characterChoiceMenu = GameGUI._generateCharacterChoiceMenu()
        GameGUI._menu.addControl(GameGUI._characterChoiceMenu);

        GameGUI.inventoryMenu = InventoryGameGUI;
        GameGUI.inventoryMenu.initialize();
        GameGUI._menu.addControl(GameGUI.inventoryMenu.getController());
        GameGUI.characterStats = CharacterStatsGUI;
        GameGUI.characterStats.initialize();
        GameGUI._menu.addControl(GameGUI.characterStats.getController());
        GameGUI.book = BookGameGUI;
        GameGUI.book.initialize();
        GameGUI._menu.addControl(GameGUI.book.getController());
    }
    static resize() {
        if (!GameGUI.initialized) {
            return;
        }
        GameGUI.fontSizeInPixels = Math.max(Math.floor((window.innerWidth/16)/5), 24);
        GameGUI.fontSizeSpacing = Math.max(Math.ceil(GameGUI.fontSizeInPixels/3), 8);
        GameGUI.fontSize = String(GameGUI.fontSizeInPixels).concat("px");
        GameGUI.fontSizeInPixelsWithSpacing = GameGUI.fontSizeInPixels + GameGUI.fontSizeSpacing;
        GameGUI.fontSizeWithSpacing = String(GameGUI.fontSizeInPixels + GameGUI.fontSizeSpacing).concat("px");
        GameGUI.fontSizeTinyInPixels = GameGUI.fontSizeInPixels - 12;
        GameGUI.fontSizeTiny = String(GameGUI.fontSizeTinyInPixels).concat("px");
        GameGUI.fontSizeSmallInPixels = GameGUI.fontSizeInPixels - 8;
        GameGUI.fontSizeSmall = String(GameGUI.fontSizeSmallInPixels).concat("px");
        GameGUI.fontSizeLargeInPixels = GameGUI.fontSizeInPixels + 8;
        GameGUI.fontSizeLarge = String(GameGUI.fontSizeLargeInPixels).concat("px");
        GameGUI._hud.rootContainer.fontSize = GameGUI.fontSize;
        GameGUI._menu.rootContainer.fontSize = GameGUI.fontSize;
        GameGUI.inventoryMenu.resize();
        GameGUI.dialogue.resize();
        GameGUI.characterStats.resize();
        GameGUI.book.resize();
    }
    static getFontSizeInPixels(multiplier = 1) {
        return GameGUI.fontSizeInPixels * multiplier;
    }
    static getFontSize(multiplier = 1) {
        if (multiplier == 1 || isNaN(multiplier)) {
            return GameGUI.fontSize;
        }
        else {
            return String(GameGUI.fontSizeInPixels * multiplier).concat("px");
        }
    }
    static pointerLock() {
        Game.pointerLock();

        window.addEventListener("click", GameGUI.pointerLockEventFunction);
    }
    static pointerRelease() {
        Game.pointerRelease();
        window.removeEventListener("click", GameGUI.pointerLockEventFunction);
    }
    static pointerLockEvent(_event) {
        if (GameGUI._hud.rootContainer.isVisible) {
            Game.pointerLock();
        }
    }
    static showHUD(_updateChild = true) {
        if (Game.debugMode) console.log("Running GameGUI::showHUD");
        if (GameGUI.locked) {
            return;
        }
        Game.setInterfaceMode(InterfaceModeEnum.CHARACTER);
        if (_updateChild === true) {
            GameGUI.hideMenu(false);
        }
        GameGUI._hud.rootContainer.isVisible = true;
        GameGUI.pointerLock();
    }
    static hideHUD(_updateChild = false) {
        if (Game.debugMode) console.log("Running GameGUI::hideHUD");
        if (GameGUI.locked) {
            return;
        }
        if (_updateChild === true) {
            GameGUI.showMenu(false);
        }
        GameGUI._hud.rootContainer.isVisible = false;
    }
    static getHudVisible() {
        return GameGUI._hud.rootContainer.isVisible;
    }
    static setHudVisible(_boolean) {
        if (GameGUI.locked) {
            return;
        }
        if (_boolean === true) {
            GameGUI._hud.rootContainer.isVisible = true;
        }
        else {
            GameGUI._hud.rootContainer.isVisible = false;
        }
    }
    static showMenu(_updateChild = true) {
        if (Game.debugMode) console.log("Running GameGUI::showMenu");
        if (GameGUI.locked) {
            return;
        }
        Game.setInterfaceMode(InterfaceModeEnum.MENU);
        if (_updateChild === true) {
            GameGUI.hideHUD(false);
        }
        GameGUI._menu.rootContainer.isVisible = true;
    }
    static hideMenu(_updateChild = false) {
        if (Game.debugMode) console.log("Running GameGUI::hideMenu");
        if (GameGUI.locked) {
            return;
        }
        Game.setInterfaceMode(InterfaceModeEnum.CHARACTER);
        if (_updateChild === true) {
            GameGUI.showHUD(false);
        }
        GameGUI._menu.rootContainer.isVisible = false;
    }
    static _hideMenuChildren() {
        for (var _i = GameGUI._menu.rootContainer.children.length - 1; _i > -1; _i--) {
            GameGUI._menu.rootContainer.children[_i].isVisible = false;
        }
    }
    static getMenuVisible() {
        return GameGUI._menu.rootContainer.isVisible;
    }
    static setMenuVisible(_boolean) {
        if (GameGUI.locked) {
            return;
        }
        if (_boolean === true) {
            GameGUI._menu.rootContainer.isVisible = true;
        }
        else {
            GameGUI._menu.rootContainer.isVisible = false;
        }
    }
    static _generateCrosshair() {
        if (Game.debugMode) console.log("Running GameGUI::_generateCrosshair");
        let crosshair = new BABYLON.GUI.Ellipse("crosshair");
        crosshair.width = "15px";
        crosshair.background = "white";
        crosshair.height = "15px";
        crosshair.color = "black";
        crosshair.alpha = GameGUI.alpha;
        crosshair.isVisible = false;
        crosshair.zIndex = 10;
        return crosshair;
    }
    static showCrosshair() {
        if (GameGUI.locked) {
            return;
        }
        GameGUI._crosshair.isVisible = true;
    }
    static hideCrosshair() {
        if (GameGUI.locked) {
            return;
        }
        GameGUI._crosshair.isVisible = false;
    }
    static _generateCharacterChoiceMenu() {
        if (Game.debugMode) console.log("Running GameGUI::_generateCharacterChoiceMenu");
        let characterChoiceMenuContainer = new BABYLON.GUI.Grid("characterChoiceMenu");
        let nameLabel = GameGUI.createTextBlock("nameLabel");
        GameGUI._nameInput = GameGUI.createInputText("nameInput");
        let ageLabel = GameGUI.createTextBlock("ageLabel");
        GameGUI._ageInput = GameGUI.createInputText("ageInput");
        let buttonKBLayoutLabel = GameGUI.createTextBlock("kbLayoutLabel");
        let buttonKBLayoutContainer = new BABYLON.GUI.Grid("kbLayoutContainer");
        let buttonKBLayoutQwerty = GameGUI.createSimpleButton("kbLayoutQwerty", "QWERTY");
        let buttonKBLayoutDvorak = GameGUI.createSimpleButton("kbLayoutDvorak", "Dvorak");
        let buttonKBLayoutAzerty = GameGUI.createSimpleButton("kbLayoutAzerty", "AZERTY");
        let submitOnline = GameGUI.createSimpleButton("submitOnline", "Online");
        let submitOffline = GameGUI.createSimpleButton("submitOffline", "Offline");
        let urlLabel = GameGUI.createTextBlock("urlLabel");
        let urlButton = GameGUI.createSimpleButton("urlButton", "https://github.com/armasyll/psde");
        
        characterChoiceMenuContainer.zIndex = 90;
        characterChoiceMenuContainer.height = 0.75;
        characterChoiceMenuContainer.width = 0.75;
        characterChoiceMenuContainer.background = GameGUI.background;
        characterChoiceMenuContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        characterChoiceMenuContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        characterChoiceMenuContainer.addColumnDefinition(0.5, false);
        characterChoiceMenuContainer.addColumnDefinition(0.5, false);
        characterChoiceMenuContainer.addRowDefinition(GameGUI.fontSizeInPixels * 2, true);
        characterChoiceMenuContainer.addRowDefinition(GameGUI.fontSizeInPixels * 2, true);
        characterChoiceMenuContainer.addRowDefinition(GameGUI.fontSizeInPixels * 2, true);
        characterChoiceMenuContainer.addRowDefinition(GameGUI.fontSizeInPixels * 2, true);
        characterChoiceMenuContainer.addRowDefinition(GameGUI.fontSizeInPixels * 2, true);
        buttonKBLayoutContainer.addColumnDefinition(0.3, false);
        buttonKBLayoutContainer.addColumnDefinition(0.3, false);
        buttonKBLayoutContainer.addColumnDefinition(0.3, false);
        buttonKBLayoutContainer.addRowDefinition(1.0, false);

        urlLabel.text = "GitHub: ";
        urlLabel.width = 1.0;

        urlButton.width = 1.0;

        nameLabel.text = "Name: ";
        nameLabel.height = 1.0;
        nameLabel.width = 1.0;

        GameGUI._nameInput.text = "Player";
        GameGUI._nameInput.height = 1.0;
        GameGUI._nameInput.width = 1.0;

        ageLabel.text = "Age: ";
        ageLabel.height = 1.0;
        ageLabel.width = 1.0;

        GameGUI._ageInput.text = "18";
        GameGUI._ageInput.height = 1.0;
        GameGUI._ageInput.width = 1.0;

        buttonKBLayoutLabel.text = "Keyboard Layout: ";
        buttonKBLayoutLabel.height = 1.0;
        buttonKBLayoutLabel.width = 1.0;

        buttonKBLayoutQwerty.height = 1.0;
        buttonKBLayoutQwerty.width = 1.0;
        buttonKBLayoutDvorak.height = 1.0;
        buttonKBLayoutDvorak.width = 1.0;
        buttonKBLayoutAzerty.height = 1.0;
        buttonKBLayoutAzerty.width = 1.0;

        submitOffline.width = 1.0;

        submitOnline.width = 1.0;

        GameGUI._nameInput.onTextChangedObservable.add(function() {
            GameGUI._nameInput.text = Game.Tools.filterID(GameGUI._nameInput.text);
        });
        GameGUI._ageInput.onTextChangedObservable.add(function() {
            GameGUI._ageInput.text = String(Game.Tools.filterInt(GameGUI._ageInput.text));
        });
        buttonKBLayoutQwerty.onPointerUpObservable.add(function() {
            AbstractControls.initQwertyKeyboardControls();
            Game.updateMenuKeyboardDisplayKeys();
        });
        buttonKBLayoutDvorak.onPointerUpObservable.add(function() {
            AbstractControls.initDvorakKeyboardControls();
            Game.updateMenuKeyboardDisplayKeys();
        });
        buttonKBLayoutAzerty.onPointerUpObservable.add(function() {
            AbstractControls.initAzertyKeyboardControls();
            Game.updateMenuKeyboardDisplayKeys();
        });
        urlButton.onPointerUpObservable.add(function() {
            window.open('https://github.com/armasyll/psde', '_blank');
        });
        submitOnline.onPointerClickObservable.add(function() {
            let doNotPassGo = false;
            GameGUI._nameInput.text = Game.Tools.filterID(GameGUI._nameInput.text);
            GameGUI._ageInput.text = Game.Tools.filterInt(GameGUI._ageInput.text)
            if (GameGUI._nameInput.text.length < 1) {
                GameGUI._nameInput.color = GameGUI.colorDanger;
                GameGUI._nameInput.background = GameGUI.backgroundDanger;
                doNotPassGo = true;
            }
            else {
                GameGUI._nameInput.color = GameGUI.color;
                GameGUI._nameInput.background = GameGUI.background;
            }
            if (Number.parseInt(GameGUI._ageInput.text) <= 0) {
                GameGUI._ageInput.color = GameGUI.colorDanger;
                GameGUI._ageInput.background = GameGUI.backgroundDanger;
                doNotPassGo = true;
            }
            else {
                GameGUI._ageInput.color = GameGUI.color;
                GameGUI._ageInput.background = GameGUI.background;
            }
            if (!doNotPassGo) {
                if (!(Game.player instanceof AbstractEntity)) {
                    Game.setPlayerCell("apartmentCell");
                    Game.createPlayer("00000000-0000-0000-0000-000000000000", GameGUI._nameInput.text, undefined, undefined, CreatureTypeEnum.HUMANOID, CreatureSubTypeEnum.FOX, SexEnum.MALE, GameGUI._ageInput.text, "foxM", "foxRed", new BABYLON.Vector3(3, 0, -17), undefined, undefined, {eyes:EyeEnum.CIRCLE, eyesColour:"green"});
                }
                if (!Client.isOnline()) {
                    Client.connect();
                }
                GameGUI.hideCharacterChoiceMenu();
                GameGUI.hideMenu();
                GameGUI.showHUD();
            }
        });
        submitOffline.onPointerClickObservable.add(function() {
            let doNotPassGo = false;
            GameGUI._nameInput.text = Game.Tools.filterID(GameGUI._nameInput.text);
            GameGUI._ageInput.text = Game.Tools.filterInt(GameGUI._ageInput.text)
            if (GameGUI._nameInput.text.length < 1) {
                GameGUI._nameInput.color = GameGUI.colorDanger;
                GameGUI._nameInput.background = GameGUI.backgroundDanger;
                doNotPassGo = true;
            }
            else {
                GameGUI._nameInput.color = GameGUI.color;
                GameGUI._nameInput.background = GameGUI.background;
            }
            if (Number.parseInt(GameGUI._ageInput.text) <= 0) {
                GameGUI._ageInput.color = GameGUI.colorDanger;
                GameGUI._ageInput.background = GameGUI.backgroundDanger;
                doNotPassGo = true;
            }
            else {
                GameGUI._ageInput.color = GameGUI.color;
                GameGUI._ageInput.background = GameGUI.background;
            }
            if (!doNotPassGo) {
                if (!(Game.player instanceof AbstractEntity)) {
                    Game.setPlayerCell("apartmentCell");
                    Game.createPlayer("00000000-0000-0000-0000-000000000000", GameGUI._nameInput.text, undefined, undefined, CreatureTypeEnum.HUMANOID, CreatureSubTypeEnum.FOX, SexEnum.MALE, GameGUI._ageInput.text, "foxM", "foxRed", new BABYLON.Vector3(3, 0, -17), undefined, undefined, {eyes:EyeEnum.CIRCLE, eyesColour:"green"});
                }
                if (Client.isOnline()) {
                    Client.disconnect();
                }
                GameGUI.hideCharacterChoiceMenu();
                GameGUI.hideMenu();
                GameGUI.showHUD();
            }
        });

        characterChoiceMenuContainer.addControl(nameLabel, 0, 0);
        characterChoiceMenuContainer.addControl(GameGUI._nameInput, 0, 1);
        characterChoiceMenuContainer.addControl(ageLabel, 1, 0);
        characterChoiceMenuContainer.addControl(GameGUI._ageInput, 1, 1);
        characterChoiceMenuContainer.addControl(buttonKBLayoutLabel, 2, 0);
        characterChoiceMenuContainer.addControl(buttonKBLayoutContainer, 2, 1);
            buttonKBLayoutContainer.addControl(buttonKBLayoutQwerty, 0, 0);
            buttonKBLayoutContainer.addControl(buttonKBLayoutDvorak, 0, 1);
            buttonKBLayoutContainer.addControl(buttonKBLayoutAzerty, 0, 2);
        characterChoiceMenuContainer.addControl(submitOffline, 3, 0);
        characterChoiceMenuContainer.addControl(submitOnline, 3, 1);
        characterChoiceMenuContainer.addControl(urlLabel, 4, 0);
        characterChoiceMenuContainer.addControl(urlButton, 4, 1);
        characterChoiceMenuContainer.isVisible = false;
        return characterChoiceMenuContainer;
    }
    static showCharacterChoiceMenu() {
        if (Game.debugMode) console.log("Running GameGUI::showCharacterChoiceMenu");
        if (GameGUI.locked) {
            return;
        }
        GameGUI.hideHUD()
        GameGUI.showMenu();
        GameGUI._hideMenuChildren();
        GameGUI._characterChoiceMenu.isVisible = true;
    }
    static hideCharacterChoiceMenu() {
        if (GameGUI.locked) {
            return;
        }
        GameGUI.pointerLock();
        GameGUI._characterChoiceMenu.isVisible = false;
    }
    static createSimpleButton(...params) {
        let button = BABYLON.GUI.Button.CreateSimpleButton(...params);
        button.fontSize = GameGUI.fontSize;
        button.color = GameGUI.color;
        button.background = GameGUI.focusedBackground;
        button.thickness = 0;
        button.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        return button;
    }
    static createImageButton(...params) {
        let button = BABYLON.GUI.Button.CreateImageButton(...params);
        button.fontSize = GameGUI.fontSize;
        button.color = GameGUI.color;
        button.background = GameGUI.focusedBackground;
        button.thickness = 0;
        button.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        return button;
    }
    static createCheckbox(...params) {
        let checkbox = new BABYLON.GUI.Checkbox(...params);
        checkbox.color = GameGUI.color;
        checkbox.disabledColor = GameGUI.background;
        checkbox.disabledColorItem = GameGUI.color;
        checkbox.thickness = 0;
        checkbox.checkSizeRatio = 1.0;
        checkbox.isChecked = false;
        checkbox.background = null;
        return checkbox;
    }
    static createInputText(...params) {
        let inputText = new BABYLON.GUI.InputText(...params);
        inputText.fontSize = GameGUI.fontSize;
        inputText.color = GameGUI.color;
        inputText.focusedBackground = GameGUI.focusedBackground;
        inputText.disabledColorItem = GameGUI.color;
        inputText.thickness = 0;
        inputText.background = null;
        return inputText;
    }
    static createTextBlock(...params) {
        let textBlock = new BABYLON.GUI.TextBlock(...params);
        textBlock.fontSize = GameGUI.fontSize;
        textBlock.color = GameGUI.color;
        textBlock.disabledColorItem = GameGUI.color;
        textBlock.thickness = 0;
        textBlock.background = null;
        return textBlock;
    }
    static createRectangle(...params) {
        let rectangle = new BABYLON.GUI.Rectangle(...params);
        rectangle.color = GameGUI.color;
        rectangle.disabledColorItem = GameGUI.color;
        rectangle.thickness = 0;
        rectangle.background = GameGUI.background;
        return rectangle;
    }
    static createStackPanel(...params) {
        let stackPanel = new BABYLON.GUI.StackPanel(...params);
        stackPanel.color = GameGUI.color;
        stackPanel.disabledColorItem = GameGUI.color;
        stackPanel.thickness = 0;
        stackPanel.background = GameGUI.background;
        return stackPanel;
    }
    static _generateButton(_id = undefined, _title = undefined, _subTitle = undefined, _icon = undefined) {
        var _button = new BABYLON.GUI.Button(_id);
            _button.width = GameGUI.getFontSize(9);
            _button.height = GameGUI.getFontSize(2);
        var _buttonImage = new BABYLON.GUI.Image("", _icon);
            _buttonImage.width = GameGUI.getFontSize(2);
            _buttonImage.height = GameGUI.getFontSize(2);
            _buttonImage.left = "-40%";
            _buttonImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            _button.addControl(_buttonImage);
        var _buttonText = new BABYLON.GUI.TextBlock();
            _buttonText.width = GameGUI.getFontSize(7);
            _buttonText.height = GameGUI.getFontSize(2);
            _buttonText.top = "5%";
            _buttonText.left = "10%";
            _buttonText.text = _title;
            _buttonText.color = GameGUI.color;
            _button.addControl(_buttonText);
        return _button;
    }
    static _generateTargetActionTooltip() {
        if (Game.debugMode) console.log("Running GameGUI::_generateTargetActionTooltip");
        let tooltip = GameGUI.createRectangle("targetActionTooltip");
            tooltip.width = 0.125;
            tooltip.height = 0.075;
            tooltip.top = "3.75%";
            tooltip.left = "6.25%";
            tooltip.alpha = GameGUI.alpha;
            tooltip.isVertical = false;
        let keyName = GameGUI.createTextBlock();
            keyName.text = "E";
            keyName.top = 0;
            keyName.left = "10%";
            keyName.textHorizontalAlignment = BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT;
        let actionPanelActionName = GameGUI.createTextBlock();
            actionPanelActionName.text = "";
            actionPanelActionName.height = 0.5;
            //actionPanelActionName.top = "-25%";
            actionPanelActionName.left = "25%";
        let actionPanelTargetName = GameGUI.createTextBlock();
            actionPanelTargetName.text = "";
            actionPanelTargetName.height = 0.5;
            actionPanelTargetName.top = "25%";
            actionPanelTargetName.left = "25%";
        tooltip.addControl(keyName);
        tooltip.addControl(actionPanelActionName);
        tooltip.addControl(actionPanelTargetName);
        tooltip.isVisible = false;
        tooltip.zIndex = 12;
        return tooltip;
    }
    /**
     * Sets the action tooltip's letter corresponding to Game.useTargetedEntityCode.
     * @param {string} _string Top left character.
     */
    static setActionTooltipLetter(_string = String.fromCharCode(AbstractControls.useTargetedEntityCode)) {
        GameGUI.actionTooltip.children[0].text = _string;
    }
    /**
     * Sets the action tooltip's top right text.
     * @param {String} _string Top right text.
     */
    static setActionTooltipString(_string = "Use") {
        if (Game.debugMode) console.log("Running GameGUI::setActionTooltipString");
        if (typeof _string != "string") {
            _string = "Use";
        }
        else {
            _string = _string.capitalize();
        }
        GameGUI.actionTooltip.children[1].text = _string;
    }
    /**
     * Sets the action tooltip's bottom text. Not used, I think. :D
     * @param {String} _string Bottom text.
     */
    static setActionTooltipTarget(_string = "") {
        if (typeof _string != "string") {
            _string = "";
        }
        if (Game.debugMode) console.log("Running GameGUI::setActionTooltipTarget");
        GameGUI.actionTooltip.children[2].text = _string;
    }
    /**
     * Sets the action tooltip's top right and bottom text.
     * @param {String} _action Top right text.
     * @param {String} _target Bottom text.
     */
    static setActionTooltip(_action, _target = "") {
        GameGUI.setActionTooltipString(_action);
        GameGUI.setActionTooltipTarget(_target);
    }
    /**
     * Show the action tooltip.
     */
    static showActionTooltip() {
        if (GameGUI.locked) {
            return;
        }
        if (!GameGUI.actionTooltipLocked) {
            GameGUI.actionTooltip.isVisible = true;
        }
    }
    /**
     * Hide the action tooltip.
     */
    static hideActionTooltip() {
        if (GameGUI.locked) {
            return;
        }
        if (!GameGUI.actionTooltipLocked) {
            GameGUI.actionTooltip.isVisible = false;
        }
    }
    static lockActionTooltip() {
        GameGUI.actionTooltipLocked = true;
    }
    static unlockActionTooltip() {
        GameGUI.actionTooltipLocked = false;
    }
    /**
     * A group of circular buttons arranged in a circle.
     * @return {BABYLON.GUI.Container} Circular container of buttons.
     */
    static _generateActionsRadialMenu() {
        if (Game.debugMode) console.log("Running GameGUI::_generateActionsRadialMenu");
        let actionsRadialMenu = new BABYLON.GUI.Ellipse("actionsRadialMenu", 0);
        actionsRadialMenu.width = String(Game.engine.getRenderWidth() / 4) + "px";
        actionsRadialMenu.height = actionsRadialMenu.width;
        actionsRadialMenu.background = GameGUI.background;
        actionsRadialMenu.color = GameGUI.color;
        actionsRadialMenu.alpha = GameGUI.containerAlpha;
        actionsRadialMenu.isVisible = false;
        actionsRadialMenu.zIndex = 12;
        return actionsRadialMenu;
    }
    static populateActionsMenuWith(abstractEntity) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        GameGUI.actionsMenuOptions.clear();
        let actions = abstractEntity.getAvailableActions();
        for (let actionID in actions) {
            if (!abstractEntity.hasHiddenAvailableAction(actionID)) {
                GameGUI.addActionsMenuOption(actionID, abstractEntity);
            }
        }
        return 0;
    }
    static populateActionsMenuWithTarget() {
        if (Game.playerController.hasTarget()) {
            return GameGUI.populateActionsMenuWith(Game.playerController.getTarget().getEntity());
        }
        else {
            GameGUI.clearActionsMenu();
        }
    }
    static addActionsMenuOption(actionID, abstractEntity) {
        if (!ActionEnum.properties.hasOwnProperty(actionID)) {
            if (ActionEnum.hasOwnProperty(actionID)) {
                actionID = ActionEnum[actionID];
            }
            else {
                return 2;
            }
        }
        else {
            actionID = Number.parseInt(actionID);
        }
        if (!(abstractEntity instanceof AbstractEntity)) {
            if (AbstractEntity.has(abstractEntity)) {
                abstractEntity = AbstractEntity.get(abstractEntity);
            }
            else {
                return 2;
            }
        }
        GameGUI.actionsMenuOptions.push({
            action:actionID,
            target:abstractEntity
        });
        if (GameGUI.actionsMenu.isVisible) {
            GameGUI.updateActionsMenu();
        }
        return true;
    }
    static removeActionsMenuOption(actionID) {
        if (!ActionEnum.properties.hasOwnProperty(actionID)) {
            if (ActionEnum.hasOwnProperty(actionID)) {
                actionID = ActionEnum[actionID];
            }
            else {
                return 2;
            }
        }
        else {
            actionID = Number.parseInt(actionID);
        }
        for (var _i = 0; _i < GameGUI.actionsMenuOptions.length; _i++) {
            if (GameGUI.actionsMenuOptions[_i].action == actionID) {
                GameGUI.actionsMenuOptions.splice(_i, 1);
                _i = _actionsMenuOptions.length;
            }
        }
        if (GameGUI.actionsMenu.isVisible) {
            GameGUI.updateActionsMenu();
        }
        return true;
    }
    static clearActionsMenu() {
        for (let i = GameGUI.actionsMenu.children.length - 1; i >= 0; i--) {
            GameGUI.actionsMenu.children[i].dispose();
        }
        GameGUI.actionsMenuOptions.clear();
        return true;
    }
    static showActionsMenu(pointerRelease = true, updateChild = true) {
        if (GameGUI.locked) {
            return;
        }
        if (updateChild) {
            GameGUI.hideActionTooltip();
            GameGUI.lockActionTooltip();
        }
        GameGUI.actionsMenu.isVisible = true;
        if (pointerRelease) {
            GameGUI.pointerRelease();
        }
    }
    static hideActionsMenu(pointerLock = true, updateChild = true) {
        if (GameGUI.locked) {
            return;
        }
        GameGUI.actionsMenu.isVisible = false;
        if (updateChild) {
            GameGUI.unlockActionTooltip();
            GameGUI.showActionTooltip();
        }
        if (pointerLock) {
            GameGUI.pointerLock();
        }
    }
    static updateActionsMenu() {
        for (let i = GameGUI.actionsMenu.children.length - 1; i >= 0; i--) {
            GameGUI.actionsMenu.children[i].dispose();
        }
        let xPosition = 0;
        let yPosition = 0;
        let button = GameGUI.createSimpleButton("closeRadialMenu", "X");
        button.width = "24px";
        button.height = "24px";
        button.onPointerClickObservable.add(function() {
            GameGUI.hideActionsMenu();
            GameGUI.pointerLock();
        });
        button._moveToProjectedPosition(new BABYLON.Vector2(xPosition, yPosition));
        GameGUI.actionsMenu.addControl(button);
        if (GameGUI.actionsMenuOptions.length > 0) {
            for (let i = 0; i < GameGUI.actionsMenuOptions.length; i++) {
                xPosition = (GameGUI.actionsMenu.widthInPixels/3) * Math.cos(BABYLON.Tools.ToRadians(360/GameGUI.actionsMenuOptions.length*i - 90));
                yPosition = (GameGUI.actionsMenu.widthInPixels/3) * Math.sin(BABYLON.Tools.ToRadians(360/GameGUI.actionsMenuOptions.length*i - 90));
                button = GameGUI.createSimpleButton(undefined, ActionEnum.properties[GameGUI.actionsMenuOptions[i].action].name);
                button.width = "96px";
                button.height = "24px";
                button._moveToProjectedPosition(new BABYLON.Vector2(xPosition, yPosition));
                button.onPointerClickObservable.add(function() {
                    GameGUI.hideActionsMenu();
                    Game.doEntityActionFunction(GameGUI.actionsMenuOptions[i].target, Game.player, GameGUI.actionsMenuOptions[i].action);
                });
                GameGUI.actionsMenu.addControl(button);
            }
        }
    }
    static lock() {
        GameGUI.locked = true;
    }
    static unlock() {
        GameGUI.locked = false;
    }
    static setLocked(locked) {
        if (locked == true) {
            return GameGUI.lock();
        }
        return GameGUI.unlock();
    }
}
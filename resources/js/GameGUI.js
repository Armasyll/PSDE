class GameGUI {
    constructor() {
        GameGUI.initialized = false;
    }
    static initialize() {
        GameGUI.mainMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenu");
        GameGUI.hud = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("hud");
        GameGUI.initHUD();
        GameGUI.initMainMenu();

        GameGUI._chatInputFocused = false;

        GameGUI.initialized = true;
    }
    static initHUD() {
        GameGUI.hud.addControl(GameGUI._generateCrosshair());
        GameGUI.hud.addControl(GameGUI._generateChat());
        GameGUI.hud.addControl(GameGUI._generatePlayerPortrait());
        GameGUI.hud.addControl(GameGUI._generateTargetPortrait());
        GameGUI.hud.addControl(GameGUI._generateTargetActionTooltip());
        GameGUI.hideHUD();
    }
    static initMainMenu() {
        GameGUI.mainMenu.addControl(GameGUI._generateCharacterChoiceMenu());
        GameGUI.hideMainMenu();
    }
    static showHUD(_updateChild = true) {
        if (Game.debugEnabled) console.log("Running GameGUI::showHUD");
        if (_updateChild) {
            GameGUI.hideMainMenu(false);
        }
        GameGUI.hud.rootContainer.isVisible = true;
        Game.pointerLock();
        window.addEventListener("click", function(_event) {
            if (GameGUI.hud.rootContainer.isVisible) {
                Game.pointerLock();
            }
        });
    }
    static hideHUD() {
        if (Game.debugEnabled) console.log("Running GameGUI::hideHUD");
        GameGUI.hud.rootContainer.isVisible = false;
    }
    static hudVisible() {
        return GameGUI.hud.rootContainer.isVisible;
    }
    static showMainMenu(_updateChild = true) {
        if (Game.debugEnabled) console.log("Running GameGUI::showMainMenu");
        if (_updateChild) {
            GameGUI.hideHUD(false);
        }
        GameGUI.mainMenu.rootContainer.isVisible = true;
    }
    static hideMainMenu() {
        if (Game.debugEnabled) console.log("Running GameGUI::hideMainMenu");
        GameGUI.mainMenu.rootContainer.isVisible = false;
    }
    static mainMenuVisible() {
        return GameGUI.mainMenu.rootContainer.isVisible;
    }
    static _generateCrosshair() {
        if (Game.debugEnabled) console.log("Running GameGUI::_generateCrosshair");
        var crosshair = new BABYLON.GUI.Ellipse("crosshair");
        crosshair.width = "15px";
        crosshair.background = "white";
        crosshair.height = "15px";
        crosshair.color = "black";
        crosshair.alpha = 0.5;
        crosshair.isVisible = false;
        return crosshair;
    }
    static showCrosshair() {
        GameGUI.hud.rootContainer.getChildByName("crosshair").isVisible = true;
    }
    static hideCrosshair() {
        GameGUI.hud.rootContainer.getChildByName("crosshair").isVisible = false;
    }
    static _generateDemoMenu() {
        var bottomMenuContainer = new BABYLON.GUI.StackPanel("bottomMenuContainer");
        bottomMenuContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        bottomMenuContainer.isVertical = true;
        //GameGUI.gui.addControl(bottomMenuContainer);

        var firstRow = new BABYLON.GUI.StackPanel();
        firstRow.height = "64px";
        firstRow.isVertical = false;
        bottomMenuContainer.addControl(firstRow);
        
        var secondRow = new BABYLON.GUI.StackPanel();
        secondRow.height = "64px";
        secondRow.isVertical = false;
        bottomMenuContainer.addControl(secondRow);

        var thirdRow = new BABYLON.GUI.StackPanel();
        thirdRow.height = "64px";
        thirdRow.isVertical = false;
        bottomMenuContainer.addControl(thirdRow);

        var optionOne = new BABYLON.GUI.Button.CreateSimpleButton("optionOne", "1");
        optionOne.width = "25%";
        firstRow.addControl(optionOne);
        var optionTwo = new BABYLON.GUI.Button.CreateSimpleButton("optionTwo", "2");
        optionTwo.width = "25%";
        firstRow.addControl(optionTwo);
        var optionThree = new BABYLON.GUI.Button.CreateSimpleButton("optionThree", "3");
        optionThree.width = "25%";
        firstRow.addControl(optionThree);
        var optionFour = new BABYLON.GUI.Button.CreateSimpleButton("optionFour", "4");
        optionFour.width = "25%";
        firstRow.addControl(optionFour);

        var optionQ = new BABYLON.GUI.Button.CreateSimpleButton("optionQ", "Q");
        optionQ.width = "25%";
        secondRow.addControl(optionQ);
        var optionW = new BABYLON.GUI.Button.CreateSimpleButton("optionW", "W");
        optionW.width = "25%";
        secondRow.addControl(optionW);
        var optionE = new BABYLON.GUI.Button.CreateSimpleButton("optionE", "E");
        optionE.width = "25%";
        secondRow.addControl(optionE);
        var optionR = new BABYLON.GUI.Button.CreateSimpleButton("optionR", "R");
        optionR.width = "25%";
        secondRow.addControl(optionR);

        var optionA = new BABYLON.GUI.Button.CreateSimpleButton("optionA", "A");
        optionA.width = "25%";
        thirdRow.addControl(optionA);
        var optionS = new BABYLON.GUI.Button.CreateSimpleButton("optionS", "S");
        optionS.width = "25%";
        thirdRow.addControl(optionS);
        var optionD = new BABYLON.GUI.Button.CreateSimpleButton("optionD", "D");
        optionD.width = "25%";
        thirdRow.addControl(optionD);
        var optionF = new BABYLON.GUI.Button.CreateSimpleButton("optionF", "F");
        optionF.width = "25%";
        thirdRow.addControl(optionF);

        return bottomMenuContainer;
    }
    static _generateChat() {
        var chatBox = new BABYLON.GUI.Rectangle("chatBox");
        chatBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        chatBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        chatBox.height = 0.3;
        chatBox.width = 0.4;
        chatBox.isVertical = true;
            var chatOutputContainer = new BABYLON.GUI.Rectangle("chatOutputContainer");
            chatOutputContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            chatOutputContainer.height = 0.8;
            chatOutputContainer.width = 1.0;
            chatOutputContainer.background = "black";
            chatOutputContainer.thickness = 0;
            chatOutputContainer.alpha = 0.75;
                var chatOutput = new BABYLON.GUI.TextBlock("chatOutput");
                chatOutput.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                chatOutput.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                chatOutput.height = 1.0;
                chatOutput.width = 1.0;
                chatOutput.color = "white";
                chatOutput.textWrapping = true;
            var chatInput = new BABYLON.GUI.InputText("chatInput");
            chatInput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            chatInput.height = 0.2;
            chatInput.width = 1.0;
            chatInput.background = "black";
            chatInput.focusedBackground = "grey";
            chatInput.color = "white";
            chatInput.text = "";
            chatInput.thickness = 1;
            chatInput.alpha = 0.75;
        chatOutputContainer.addControl(chatOutput);
        chatBox.addControl(chatOutputContainer);
        chatBox.addControl(chatInput);
        chatInput.onBlurObservable.add(function() {
            Game.controlCharacterOnKeyDown(13); // onBlurObservable triggers before ActionManager, so we'll just send the enter key manually
        });
        chatInput.onFocusObservable.add(function() {
            GameGUI._chatInputFocused = true;
        });
        return chatBox;
    }
    static getChat() {
        return this.hud.rootContainer.getChildByName("chatBox");
    }
    static getChatOutput() {
        return this.hud.rootContainer.getChildByName("chatBox").children[0].children[0];
    }
    static getChatInput() {
        return this.hud.rootContainer.getChildByName("chatBox").children[1];
    }
    static _generateCharacterChoiceMenu() {
        var characterChoiceMenuContainer = new BABYLON.GUI.StackPanel("characterChoiceMenu");
            var nameContainer = new BABYLON.GUI.StackPanel();
                var nameLabel = new BABYLON.GUI.TextBlock();
                var nameInput = new BABYLON.GUI.InputText();
            var ageContainer = new BABYLON.GUI.StackPanel();
                var ageLabel = new BABYLON.GUI.TextBlock();
                var ageInput = new BABYLON.GUI.InputText();
            var speciesContainer = new BABYLON.GUI.StackPanel();
                var speciesLabel = new BABYLON.GUI.TextBlock();
                var speciesOptions = new BABYLON.GUI.StackPanel();
                    var speciesFox = BABYLON.GUI.Button.CreateSimpleButton("speciesFox", "Fox");
                    var speciesSkeleton = BABYLON.GUI.Button.CreateSimpleButton("speciesSkeleton", "Skeleton");
            var genderContainer = new BABYLON.GUI.StackPanel();
                var genderLabel = new BABYLON.GUI.TextBlock();
                var genderOptions = new BABYLON.GUI.StackPanel();
                    var genderMale = BABYLON.GUI.Button.CreateSimpleButton("genderMale", "Male");
                    var genderFemale = BABYLON.GUI.Button.CreateSimpleButton("genderFemale", "Female");
                    var genderNone = BABYLON.GUI.Button.CreateSimpleButton("genderNone", "None");
            var buttonKBLayoutContainer = new BABYLON.GUI.StackPanel();
                var buttonKBLayoutLabel = new BABYLON.GUI.TextBlock();
                var buttonKBLayoutOptions = new BABYLON.GUI.StackPanel();
                    var buttonKBLayoutQwerty = BABYLON.GUI.Button.CreateSimpleButton("kbLayoutQwerty", "QWERTY");
                    var buttonKBLayoutDvorak = BABYLON.GUI.Button.CreateSimpleButton("kbLayoutDvorak", "Dvorak");
                    var buttonKBLayoutAzerty = BABYLON.GUI.Button.CreateSimpleButton("kbLayoutAzerty", "AZERTY");
            var submitContainer = new BABYLON.GUI.StackPanel();
                var submitOnline = BABYLON.GUI.Button.CreateSimpleButton("submitOnline", "Online");
                var submitOffline = BABYLON.GUI.Button.CreateSimpleButton("submitOffline", "Offline");
        
        characterChoiceMenuContainer.isVertical = true;
        nameContainer.isVertical = false;
        ageContainer.isVertical = false;
        speciesContainer.isVertical = false;
            speciesOptions.isVertical = true;
        genderContainer.isVertical = false;
            genderOptions.isVertical = true;
        buttonKBLayoutContainer.isVertical = false;
            buttonKBLayoutOptions.isVertical = true;
        submitContainer.isVertical = false;

        characterChoiceMenuContainer.zIndex = 90;
        characterChoiceMenuContainer.height = 0.6
        characterChoiceMenuContainer.width = 0.5;
        characterChoiceMenuContainer.background = "black";
        characterChoiceMenuContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        characterChoiceMenuContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        nameContainer.height = 0.05;
            nameLabel.text = "Name: ";
            nameLabel.width = 0.3;
            nameLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            nameLabel.color = "white";

            nameInput.width = 0.7;
            nameInput.color = "white";
            nameInput.background = "grey";
            nameInput.text = "Fox";

        ageContainer.height = 0.05;
            ageLabel.text = "Age: ";
            ageLabel.width = 0.3;
            ageLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            ageLabel.color = "white";

            ageInput.width = 0.7;
            ageInput.color = "white";
            ageInput.background = "grey";
            ageInput.text = "18";

        speciesContainer.height = 0.10;
            speciesLabel.text = "Species: ";
            speciesLabel.width = 0.3;
            speciesLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            speciesLabel.color = "white";

            speciesOptions.width = 0.7;
                speciesFox.height = 0.5;
                speciesFox.background = "grey";
                speciesFox.color = "white";
                speciesSkeleton.height = 0.5;
                speciesSkeleton.background = "grey";
                speciesSkeleton.color = "white";

        genderContainer.height = 0.15;
            genderLabel.text = "Gender: ";
            genderLabel.width = 0.3;
            genderLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            genderLabel.color = "white";

            genderOptions.width = 0.7;
                genderMale.height = 0.3;
                genderMale.background = "grey";
                genderMale.color = "white";
                genderFemale.height = 0.3;
                genderFemale.background = "grey";
                genderFemale.color = "white";
                genderNone.height = 0.3;
                genderNone.background = "grey";
                genderNone.color = "white";

        buttonKBLayoutContainer.height = 0.15;
            buttonKBLayoutLabel.text = "Keyboard Layout: ";
            buttonKBLayoutLabel.width = 0.3;
            buttonKBLayoutLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            buttonKBLayoutLabel.color = "white";

            buttonKBLayoutOptions.width = 0.7;
                buttonKBLayoutQwerty.height = 0.3;
                buttonKBLayoutQwerty.background = "grey";
                buttonKBLayoutQwerty.color = "white";
                buttonKBLayoutDvorak.height = 0.3;
                buttonKBLayoutDvorak.background = "grey";
                buttonKBLayoutDvorak.color = "white";
                buttonKBLayoutAzerty.height = 0.3;
                buttonKBLayoutAzerty.background = "grey";
                buttonKBLayoutAzerty.color = "white";

        submitContainer.height = 0.05;
            submitOffline.width = 0.5;
            submitOffline.color = "white";
            submitOffline.background = "grey";
            submitOffline.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

            submitOnline.width = 0.5;
            submitOnline.color = "white";
            submitOnline.background = "grey";
            submitOnline.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

        buttonKBLayoutQwerty.onPointerDownObservable.add(function() {
            Game.initQwertyKeyboardControls();
        });
        buttonKBLayoutDvorak.onPointerDownObservable.add(function() {
            Game.initDvorakKeyboardControls();
        });
        buttonKBLayoutAzerty.onPointerDownObservable.add(function() {
            Game.initAzertyKeyboardControls();
        });
        submitOnline.onPointerDownObservable.add(function() {
            Game.player.entity.setName(nameInput.text);
            if (Client.isOnline()) {

            }
            else {
                Client.connect();
            }
            GameGUI.hideMainMenu();
            GameGUI.setPlayerPortrait(Game.player);
            GameGUI.showHUD();
        });
        submitOffline.onPointerDownObservable.add(function() {
            Game.player.entity.setName(nameInput.text);
            if (Client.isOnline()) {
                Client.disconnect();
            }
            else {

            }
            GameGUI.hideMainMenu();
            GameGUI.setPlayerPortrait(Game.player);
            GameGUI.showHUD();
        });

        characterChoiceMenuContainer.addControl(nameContainer);
            nameContainer.addControl(nameLabel);
            nameContainer.addControl(nameInput);
        characterChoiceMenuContainer.addControl(ageContainer);
            ageContainer.addControl(ageLabel);
            ageContainer.addControl(ageInput);
        characterChoiceMenuContainer.addControl(speciesContainer);
            speciesContainer.addControl(speciesLabel);
            speciesContainer.addControl(speciesOptions);
                speciesOptions.addControl(speciesFox);
                speciesOptions.addControl(speciesSkeleton);
        characterChoiceMenuContainer.addControl(genderContainer);
            genderContainer.addControl(genderLabel);
            genderContainer.addControl(genderOptions);
                genderOptions.addControl(genderMale);
                genderOptions.addControl(genderFemale);
                genderOptions.addControl(genderNone);
        characterChoiceMenuContainer.addControl(buttonKBLayoutContainer);
            buttonKBLayoutContainer.addControl(buttonKBLayoutLabel);
            buttonKBLayoutContainer.addControl(buttonKBLayoutOptions);
                buttonKBLayoutOptions.addControl(buttonKBLayoutQwerty);
                buttonKBLayoutOptions.addControl(buttonKBLayoutDvorak);
                buttonKBLayoutOptions.addControl(buttonKBLayoutAzerty);
        characterChoiceMenuContainer.addControl(submitContainer);
            submitContainer.addControl(submitOffline);
            submitContainer.addControl(submitOnline);

        return characterChoiceMenuContainer;
    }
    static _generatePlayerPortrait() {
        var portrait = new BABYLON.GUI.Rectangle("playerPortrait");
        portrait.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        portrait.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        portrait.height = 0.12;
        portrait.width = 0.24;
        portrait.top = 0;
        portrait.left = 0;
        portrait.thickness = 0;
            var portraitBackground = new BABYLON.GUI.Rectangle("portraitBackground");
            portraitBackground.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitBackground.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitBackground.height = 1;
            portraitBackground.width = 1;
            portraitBackground.top = 0;
            portraitBackground.left = 0;
            portraitBackground.thickness = 0;
            portraitBackground.background = "black";
            portraitBackground.alpha = 0.5;
            var portraitAvatarContainer = new BABYLON.GUI.Rectangle();
            portraitAvatarContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitAvatarContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitAvatarContainer.height = 1.0;
            portraitAvatarContainer.width = 0.33;
            portraitAvatarContainer.top = 0;
            portraitAvatarContainer.left = 0;
            portraitAvatarContainer.thickness = 0;
                var portraitAvatar = new BABYLON.GUI.Image("portraitAvatar", "resources/images/characters/genericCharacter.svg");
                portraitAvatar.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            var portraitStats = new BABYLON.GUI.StackPanel("portraitStats");
            portraitStats.isVertical = true;
            portraitStats.height = 1.0;
            portraitStats.width = 0.76;
            portraitStats.top = 0;
            portraitStats.left = "21%";
                var portraitName = new BABYLON.GUI.TextBlock("playerName");
                portraitName.text = "Your Name Here";
                portraitName.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                portraitName.height = 0.25;
                portraitName.width = 1.0;
                portraitName.color = "white";
                var portraitStatsLife = new BABYLON.GUI.TextBlock("portraitStatsLife");
                portraitStatsLife.text = "Life";
                portraitStatsLife.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                portraitStatsLife.height = 0.25;
                portraitStatsLife.width = 1.0;
                portraitStatsLife.color = "red";
                var portraitStatsMana = new BABYLON.GUI.TextBlock("portraitStatsMana");
                portraitStatsMana.text = "";
                portraitStatsMana.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                portraitStatsMana.height = 0.25;
                portraitStatsMana.width = 1.0;
                portraitStatsMana.color = "blue";
                var portraitStatsStamina = new BABYLON.GUI.TextBlock("portraitStatsStamina");
                portraitStatsStamina.text = "Stamina";
                portraitStatsStamina.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                portraitStatsStamina.height = 0.25;
                portraitStatsStamina.width = 1.0;
                portraitStatsStamina.color = "green";
        portrait.addControl(portraitBackground);
        portrait.addControl(portraitAvatarContainer);
        portraitAvatarContainer.addControl(portraitAvatar);
        portrait.addControl(portraitStats);
        portraitStats.addControl(portraitName);
        portraitStats.addControl(portraitStatsLife);
        portraitStats.addControl(portraitStatsMana);
        portraitStats.addControl(portraitStatsStamina);
        return portrait;
    }
    static _generateTargetPortrait() {
        var portrait = new BABYLON.GUI.Rectangle("targetPortrait");
        portrait.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        portrait.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        portrait.height = 0.12;
        portrait.width = 0.24;
        portrait.top = 0;
        portrait.left = "26%";
        portrait.thickness = 0;
        portrait.isVisible = false;
            var portraitBackground = new BABYLON.GUI.Rectangle("portraitBackground");
            portraitBackground.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitBackground.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitBackground.height = 1;
            portraitBackground.width = 1;
            portraitBackground.top = 0;
            portraitBackground.left = 0;
            portraitBackground.thickness = 0;
            portraitBackground.background = "black";
            portraitBackground.alpha = 0.5;
            var portraitAvatarContainer = new BABYLON.GUI.Rectangle();
            portraitAvatarContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitAvatarContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            portraitAvatarContainer.height = 1.0;
            portraitAvatarContainer.width = 0.33;
            portraitAvatarContainer.top = 0;
            portraitAvatarContainer.left = 0;
            portraitAvatarContainer.thickness = 0;
                var portraitAvatar = new BABYLON.GUI.Image("portraitAvatar", "resources/images/characters/genericCharacter.svg");
                portraitAvatar.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            var portraitStats = new BABYLON.GUI.StackPanel("portraitStats");
            portraitStats.isVertical = true;
            portraitStats.height = 1.0;
            portraitStats.width = 0.76;
            portraitStats.top = 0;
            portraitStats.left = "-21%";
                var portraitName = new BABYLON.GUI.TextBlock("portraitName");
                portraitName.text = "Your Name Here";
                portraitName.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                portraitName.height = 0.25;
                portraitName.width = 0.8;
                portraitName.color = "white";
                var portraitStatsLife = new BABYLON.GUI.TextBlock("portraitStatsLife");
                portraitStatsLife.text = "Life";
                portraitStatsLife.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                portraitStatsLife.height = 0.25;
                portraitStatsLife.width = 1.0;
                portraitStatsLife.color = "red";
                var portraitStatsMana = new BABYLON.GUI.TextBlock("portraitStatsMana");
                portraitStatsMana.text = "";
                portraitStatsMana.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                portraitStatsMana.height = 0.25;
                portraitStatsMana.width = 1.0;
                portraitStatsMana.color = "blue";
                var portraitStatsStamina = new BABYLON.GUI.TextBlock("portraitStatsStamina");
                portraitStatsStamina.text = "Stamina";
                portraitStatsStamina.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                portraitStatsStamina.height = 0.25;
                portraitStatsStamina.width = 1.0;
                portraitStatsStamina.color = "green";
        portrait.addControl(portraitBackground);
        portrait.addControl(portraitStats);
        portrait.addControl(portraitAvatarContainer);
        portraitAvatarContainer.addControl(portraitAvatar);
        portraitStats.addControl(portraitName);
        portraitStats.addControl(portraitStatsLife);
        portraitStats.addControl(portraitStatsMana);
        portraitStats.addControl(portraitStatsStamina);
        return portrait;
    }
    static showPlayerPortrait() {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").isVisible = true;
    }
    static hidePlayerPortrait() {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").isVisible = false;
    }
    static showTargetPortrait() {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").isVisible = true;
    }
    static hideTargetPortrait() {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").isVisible = false;
    }
    static setPlayerPortrait(_image = undefined, _name = undefined, _life = undefined, _mana = undefined, _stamina = undefined) {
        if (_image instanceof EntityController) {
            _name = _image.getEntity().getFullName();
            _life = _image.getEntity().getLife() + "/" + _image.getEntity().getLifeMax();
            if (_image.getEntity().getManaMax() == 0) {
                GameGUI.hidePlayerPortraitMana();
                _mana = undefined;
            }
            else {
                _mana = _image.getEntity().getMana() + "/" + _image.getEntity().getManaMax();
            }
            _stamina = _image.getEntity().getStamina() + "/" + _image.getEntity().getStaminaMax();
            _image = _image.getEntity().getImage();
        }
        this.setPlayerPortraitImage(_image);
        this.setPlayerPortraitName(_name);
        this.setPlayerPortraitLife(_life);
        this.setPlayerPortraitMana(_mana);
        this.setPlayerPortraitStamina(_stamina);
    }
    static setTargetPortrait(_image = undefined, _name = undefined, _life = "", _mana = "", _stamina = "") {
        if (_image instanceof CharacterController) {
            _name = _image.getEntity().getFullName();
            _life = _image.getEntity().getLife() + "/" + _image.getEntity().getLifeMax();
            if (_image.getEntity().getManaMax() == 0) {
                GameGUI.hidePlayerPortraitMana();
                _mana = "";
            }
            else {
                _mana = _image.getEntity().getMana() + "/" + _image.getEntity().getManaMax();
            }
            _stamina = _image.getEntity().getStamina() + "/" + _image.getEntity().getStaminaMax();
            _image = _image.getEntity().getImage();
        }
        else if (_image instanceof ItemController) {
            _name = _image.getEntity().getEntity().getName();
            _image = _image.getEntity().getImage();
        }
        else if (_image instanceof EntityController) {
            _name = _image.getEntity().getName();
            _image = _image.getEntity().getImage();
        }
        this.setTargetPortraitImage(_image);
        this.setTargetPortraitName(_name);
        this.setTargetPortraitLife(_life);
        this.setTargetPortraitMana(_mana);
        this.setTargetPortraitStamina(_stamina);
    }
    static setPlayerPortraitImage(_image = "resources/images/characters/genericCharacter.svg") {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[1].children[0].domImage.setAttribute("src", _image);
    }
    static setPlayerPortraitName(_string) {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[0].text = _string;
    }
    static setPlayerPortraitLife(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[1].text = _int;
    }
    static setPlayerPortraitStamina(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[3].text = _int;
    }
    static showPlayerPortraitMana() {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[2].isVisible = true;
    }
    static hidePlayerPortraitMana() {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[2].isVisible = false;
    }
    static setPlayerPortraitMana(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("playerPortrait").children[2].children[2].text = _int;
    }
    static setTargetPortraitImage(_image = "resources/images/items/genericItem.svg") {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[2].children[0].domImage.setAttribute("src", _image);
    }
    static setTargetPortraitName(_string) {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[0].text = _string;
    }
    static setTargetPortraitLife(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[1].text = _int;
    }
    static setTargetPortraitStamina(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[3].text = _int;
    }
    static showTargetPortraitMana() {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[2].isVisible = true;
    }
    static hideTargetPortraitMana() {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[2].isVisible = false;
    }
    static setTargetPortraitMana(_int = 100) {
        GameGUI.hud.rootContainer.getChildByName("targetPortrait").children[1].children[2].text = _int;
    }
    static chatInputFocus() {
        GameGUI.hud.moveFocusToControl(GameGUI.getChatInput());
    }
    static chatInputSubmit() {
        GameGUI._chatInputFocused = false;
        var _text = GameGUI.getChatInput().text.trim();
        if (_text.length == 0) {
            return;
        }
        if (Client.isOnline()) {
            Client.sendChatMessage(_text);
        }
        else {
            Game.chatCommands(_text);
        }
        GameGUI.chatInputClear();
    }
    static chatInputClear() {
        GameGUI.getChatInput().text = "";
    }
    static chatOutputClear() {
        GameGUI.getChatOutput().text = "";
    }
    static chatOutputAppend(_string) {
        GameGUI.getChatOutput().text += _string + "\n";
    }
    static chatOutputSet(_string) {
        GameGUI.chatOutputClear();
        GameGUI.chatOutputAppend(_string);
    }
    static showInventory(_characterEntityA, _characterEntityB = Game.player.entity) {
        if (!(_entity instanceof EntityWithStorage)) {
            _entity = Game.getEntity(_entity);
            if (!(_entity instanceof Entity)) {return undefined;}
        }

    }
    static hideInventory() {
        GameGUI.hud.rootContainer.getChildByName("inventory").isVisible = false;
    }
    static _generateTargetActionTooltip() {
        if (Game.debugEnabled) console.log("Running GameGUI::_generateTargetActionTooltip");
        var tooltip = new BABYLON.GUI.Rectangle("targetActionTooltip");
            tooltip.width = 0.125;
            tooltip.height = 0.075;
            tooltip.top = "3.75%";
            tooltip.left = "6.25%";
            tooltip.background = "black";
            tooltip.alpha = 0.5;
            tooltip.isVertical = false;
        var keyName = new BABYLON.GUI.TextBlock();
            keyName.text = "E";
            keyName.top = 0;
            keyName.left = "10%";
            keyName.textHorizontalAlignment = BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT;
            keyName.color = "white";
        var actionPanelActionName = new BABYLON.GUI.TextBlock();
            actionPanelActionName.text = "";
            actionPanelActionName.height = 0.5;
            //actionPanelActionName.top = "-25%";
            actionPanelActionName.left = "25%";
            actionPanelActionName.color = "white";
        var actionPanelTargetName = new BABYLON.GUI.TextBlock();
            actionPanelTargetName.text = "";
            actionPanelTargetName.height = 0.5;
            actionPanelTargetName.top = "25%";
            actionPanelTargetName.left = "25%";
            actionPanelTargetName.color = "white";
        tooltip.addControl(keyName);
        tooltip.addControl(actionPanelActionName);
        tooltip.addControl(actionPanelTargetName);
        tooltip.isVisible = true;
        return tooltip;
    }
    static setActionTooltipLetter(_string = String.fromCharCode(Game.useTargetedEntityCode)) {
        GameGUI.hud.rootContainer.getChildByName("targetActionTooltip").children[0].text = _string;
    }
    static setActionTooltipAction(_string = "Use") {
        if (Game.debugEnabled) console.log("Running GameGUI::setActionTooltipAction");
        if (typeof _string != "string") {
            _string = "Use";
        }
        else {
            _string = _string.capitalize();
        }
        GameGUI.hud.rootContainer.getChildByName("targetActionTooltip").children[1].text = _string;
    }
    static setActionTooltipTarget(_string = "") {
        if (typeof _string != "string") {
            _string = "";
        }
        if (Game.debugEnabled) console.log("Running GameGUI::setActionTooltipTarget");
        GameGUI.hud.rootContainer.getChildByName("targetActionTooltip").children[2].text = _string;
    }
    static setActionTooltip(_action, _target = "") {
        GameGUI.setActionTooltipAction(_action);
        GameGUI.setActionTooltipTarget(_target);
    }
    static showActionTooltip() {
        GameGUI.hud.rootContainer.getChildByName("targetActionTooltip").isVisible = true;
    }
    static hideActionTooltip() {
        GameGUI.hud.rootContainer.getChildByName("targetActionTooltip").isVisible = false;
    }
    static _generateTargetAvailableActionsRadialMenu() {
        return;
    }
    static _generateTargetAvailableActionsMenu() {
        return;
    }
}
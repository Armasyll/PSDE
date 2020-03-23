class PlayerPortraitGameGUI {
    static initialize() {
        PlayerPortraitGameGUI.playerName = null;
        PlayerPortraitGameGUI.playerIcon = null;
        PlayerPortraitGameGUI.playerHealthBar = null;
        PlayerPortraitGameGUI.playerHealthText = null;
        PlayerPortraitGameGUI.playerStaminaBar = null;
        PlayerPortraitGameGUI.playerStaminaText = null;
        PlayerPortraitGameGUI.isVisible = false;
        PlayerPortraitGameGUI.controller = PlayerPortraitGameGUI.generateController();
        PlayerPortraitGameGUI.initialized = true;
        PlayerPortraitGameGUI.containerAlpha = 0.75;
    }
    static generateController() {
        var portrait = GameGUI.createRectangle("playerPortrait");
        portrait.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        portrait.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        portrait.height = GameGUI.getFontSize(4);
        portrait.width = GameGUI.getFontSize(14);
        portrait.top = 0;
        portrait.left = 0;
            var portraitBackground = GameGUI.createRectangle("portraitBackground");
            portraitBackground.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitBackground.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitBackground.height = GameGUI.getFontSize(4);
            portraitBackground.width = 1;
            portraitBackground.top = 0;
            portraitBackground.left = 0;
            portraitBackground.alpha = PlayerPortraitGameGUI.containerAlpha;
            var portraitAvatarContainer = GameGUI.createRectangle();
            portraitAvatarContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitAvatarContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitAvatarContainer.height = GameGUI.getFontSize(4);
            portraitAvatarContainer.width = 0.33;
            portraitAvatarContainer.top = 0;
            portraitAvatarContainer.left = 0;
                var portraitAvatar = new BABYLON.GUI.Image("portraitAvatar", "resources/images/icons/characters/genericCharacter.svg");
                portraitAvatar.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            var portraitStats = new BABYLON.GUI.StackPanel("portraitStats");
            portraitStats.isVertical = true;
            portraitStats.height = GameGUI.getFontSize(4);
            portraitStats.width = GameGUI.getFontSize(10);
            portraitStats.top = 0;
            portraitStats.left = "21%";
                var portraitName = GameGUI.createTextBlock("playerName");
                portraitName.text = "Your Name Here";
                portraitName.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                portraitName.height = GameGUI.getFontSize();
                portraitName.width = 1.0;
                var portraitStatsHealthContainer = GameGUI.createRectangle("portraitStatsHealthContainer");
                portraitStatsHealthContainer.height = GameGUI.getFontSize();
                portraitStatsHealthContainer.width = 0.85;
                    var portraitStatsHealthText = GameGUI.createTextBlock("portraitStatsHealthText");
                    portraitStatsHealthText.text = "";
                    portraitStatsHealthText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    portraitStatsHealthText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    var portraitStatsHealthSlider = new BABYLON.GUI.Slider("portraitStatsHealth");
                    portraitStatsHealthSlider.minimum = 0;
                    portraitStatsHealthSlider.maximum = 100;
                    portraitStatsHealthSlider.isVertical = false;
                    portraitStatsHealthSlider.displayThumb = false;
                    portraitStatsHealthSlider.left = "16px";
                    portraitStatsHealthSlider.height = GameGUI.getFontSize(1.5);
                    portraitStatsHealthSlider.thumbWidth = 0;
                    portraitStatsHealthSlider.isEnabled = false;
                    portraitStatsHealthSlider.color = "red";
                var portraitStatsStaminaContainer = GameGUI.createRectangle("portraitStatsStaminaContainer");
                portraitStatsStaminaContainer.height = GameGUI.getFontSize();
                portraitStatsStaminaContainer.width = 0.85;
                    var portraitStatsStaminaText = GameGUI.createTextBlock("portraitStatsStaminaText");
                    portraitStatsStaminaText.text = "";
                    portraitStatsStaminaText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    portraitStatsStaminaText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    var portraitStatsStaminaSlider = new BABYLON.GUI.Slider("portraitStatsStaminaSlider");
                    portraitStatsStaminaSlider.minimum = 0;
                    portraitStatsStaminaSlider.maximum = 100;
                    portraitStatsStaminaSlider.isVertical = false;
                    portraitStatsStaminaSlider.displayThumb = false;
                    portraitStatsStaminaSlider.left = "16px";
                    portraitStatsStaminaSlider.height = GameGUI.getFontSize(1.5);
                    portraitStatsStaminaSlider.thumbWidth = 0;
                    portraitStatsStaminaSlider.isEnabled = false;
                    portraitStatsStaminaSlider.color = "green";
        portrait.addControl(portraitBackground);
        portrait.addControl(portraitAvatarContainer);
        portraitAvatarContainer.addControl(portraitAvatar);
        portrait.addControl(portraitStats);
        portraitStats.addControl(portraitName);
        portraitStatsHealthContainer.addControl(portraitStatsHealthSlider);
        portraitStatsHealthContainer.addControl(portraitStatsHealthText);
        portraitStats.addControl(portraitStatsHealthContainer);
        portraitStatsStaminaContainer.addControl(portraitStatsStaminaSlider);
        portraitStatsStaminaContainer.addControl(portraitStatsStaminaText);
        portraitStats.addControl(portraitStatsStaminaContainer);
        portrait.zIndex = 10;
        PlayerPortraitGameGUI.playerName = portraitName;
        PlayerPortraitGameGUI.playerIcon = portraitAvatar;
        PlayerPortraitGameGUI.playerHealthBar = portraitStatsHealthSlider;
        PlayerPortraitGameGUI.playerHealthText = portraitStatsHealthText;
        PlayerPortraitGameGUI.playerStaminaBar = portraitStatsStaminaSlider;
        PlayerPortraitGameGUI.playerStaminaText = portraitStatsStaminaText;
        return portrait;
    }
    static show() {
        PlayerPortraitGameGUI.controller.isVisible = true;
        PlayerPortraitGameGUI.isVisible = true;
    }
    static hide() {
        PlayerPortraitGameGUI.controller.isVisible = false;
        PlayerPortraitGameGUI.isVisible = false;
    }
    static set(abstractEntity = Game.player) {
        if (abstractEntity instanceof EntityController) {
            abstractEntity = abstractEntity.getEntity();
        }
        else if (!(abstractEntity instanceof AbstractEntity)) {
            return undefined;
        }
        if (!abstractEntity.isEnabled()) {
            return undefined;
        }
        PlayerPortraitGameGUI.updateWith(abstractEntity);
        PlayerPortraitGameGUI.setImage(abstractEntity.getIcon());
        PlayerPortraitGameGUI.setName(abstractEntity.getName());
    }
    static update() {
        return PlayerPortraitGameGUI.updateWith(Game.player);
    }
    static updateWith(abstractEntity = Game.player) {
        if (abstractEntity instanceof EntityController) {
            abstractEntity = abstractEntity.getEntity();
        }
        else if (!(abstractEntity instanceof AbstractEntity)) {
            return undefined;
        }
        if (!abstractEntity.isEnabled()) {
            return undefined;
        }
        PlayerPortraitGameGUI.setHealthSlider(abstractEntity.getHealth()/abstractEntity.getMaxHealth()*100);
        PlayerPortraitGameGUI.setHealthText(abstractEntity.getHealth() + "/" + abstractEntity.getMaxHealth());
        PlayerPortraitGameGUI.setStaminaSlider((abstractEntity.getHealth()-abstractEntity.getStamina())/abstractEntity.getHealth()*100);
        let number = abstractEntity.getHealth() - abstractEntity.getStamina();
        if (number < 0) {
            number = 0;
        }
        PlayerPortraitGameGUI.setStaminaText(number + "/" + abstractEntity.getHealth());
    }
    static setImage(iconID = "genericCharacter") {
        PlayerPortraitGameGUI.playerIcon.domImage.setAttribute("src", Game.getIcon(iconID));
    }
    static setName(string) {
        PlayerPortraitGameGUI.playerName.text = string;
    }
    static setHealthSlider(int = 100) {
        PlayerPortraitGameGUI.playerHealthBar.value = int;
    }
    static setHealthText(text = "") {
        PlayerPortraitGameGUI.playerHealthText.text = text;
    }
    static setStaminaSlider(int = 100) {
        PlayerPortraitGameGUI.playerStaminaBar.value = int;
    }
    static setStaminaText(text = "") {
        PlayerPortraitGameGUI.playerStaminaText.text = text;
    }
    static getController() {
        return PlayerPortraitGameGUI.controller;
    }
}
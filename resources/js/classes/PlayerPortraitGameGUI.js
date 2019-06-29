class PlayerPortraitGameGUI {
    static initialize() {
        PlayerPortraitGameGUI.playerName = null;
        PlayerPortraitGameGUI.playerIcon = null;
        PlayerPortraitGameGUI.playerHealthBar = null;
        PlayerPortraitGameGUI.playerHealthText = null;
        PlayerPortraitGameGUI.playerManaBar = null;
        PlayerPortraitGameGUI.playerManaText = null;
        PlayerPortraitGameGUI.playerStaminaBar = null;
        PlayerPortraitGameGUI.playerStaminaText = null;
        PlayerPortraitGameGUI.controller = PlayerPortraitGameGUI.generateController();
        PlayerPortraitGameGUI.initialized = true;
    }
    static generateController() {
        var portrait = new BABYLON.GUI.Rectangle("playerPortrait");
        portrait.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        portrait.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        portrait.height = GameGUI.getFontSizePx(4);
        portrait.width = GameGUI.getFontSizePx(14);
        portrait.top = 0;
        portrait.left = 0;
        portrait.thickness = 0;
            var portraitBackground = new BABYLON.GUI.Rectangle("portraitBackground");
            portraitBackground.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitBackground.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitBackground.height = GameGUI.getFontSizePx(4);
            portraitBackground.width = 1;
            portraitBackground.top = 0;
            portraitBackground.left = 0;
            portraitBackground.thickness = 0;
            portraitBackground.background = GameGUI.background;
            portraitBackground.alpha = 0.5;
            var portraitAvatarContainer = new BABYLON.GUI.Rectangle();
            portraitAvatarContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            portraitAvatarContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            portraitAvatarContainer.height = GameGUI.getFontSizePx(4);
            portraitAvatarContainer.width = 0.33;
            portraitAvatarContainer.top = 0;
            portraitAvatarContainer.left = 0;
            portraitAvatarContainer.thickness = 0;
                var portraitAvatar = new BABYLON.GUI.Image("portraitAvatar", "resources/images/icons/characters/genericCharacter.svg");
                portraitAvatar.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            var portraitStats = new BABYLON.GUI.StackPanel("portraitStats");
            portraitStats.isVertical = true;
            portraitStats.height = GameGUI.getFontSizePx(4);
            portraitStats.width = GameGUI.getFontSizePx(10);
            portraitStats.top = 0;
            portraitStats.left = "21%";
                var portraitName = new BABYLON.GUI.TextBlock("playerName");
                portraitName.text = "Your Name Here";
                portraitName.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                portraitName.height = GameGUI.fontSizePx;
                portraitName.width = 1.0;
                portraitName.color = GameGUI.color;
                var portraitStatsHealthContainer = new BABYLON.GUI.Rectangle("portraitStatsHealthContainer");
                portraitStatsHealthContainer.height = GameGUI.fontSizePx;
                portraitStatsHealthContainer.width = 0.85;
                portraitStatsHealthContainer.thickness = 0;
                    var portraitStatsHealthText = new BABYLON.GUI.TextBlock("portraitStatsHealthText");
                    portraitStatsHealthText.text = "";
                    portraitStatsHealthText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    portraitStatsHealthText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    portraitStatsHealthText.color = GameGUI.color;
                    var portraitStatsHealthSlider = new BABYLON.GUI.Slider("portraitStatsHealth");
                    portraitStatsHealthSlider.minimum = 0;
                    portraitStatsHealthSlider.maximum = 100;
                    portraitStatsHealthSlider.isVertical = false;
                    portraitStatsHealthSlider.displayThumb = false;
                    portraitStatsHealthSlider.left = "16px";
                    portraitStatsHealthSlider.height = GameGUI.getFontSizePx(1.5);
                    portraitStatsHealthSlider.thumbWidth = 0;
                    portraitStatsHealthSlider.isEnabled = false;
                    portraitStatsHealthSlider.color = "red";
                var portraitStatsManaContainer = new BABYLON.GUI.Rectangle("portraitStatsManaContainer");
                portraitStatsManaContainer.height = GameGUI.fontSizePx;
                portraitStatsManaContainer.width = 0.85;
                portraitStatsManaContainer.thickness = 0;
                    var portraitStatsManaText = new BABYLON.GUI.TextBlock("portraitStatsManaText");
                    portraitStatsManaText.text = "";
                    portraitStatsManaText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    portraitStatsManaText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    portraitStatsManaText.color = GameGUI.color;
                    var portraitStatsManaSlider = new BABYLON.GUI.Slider("portraitStatsManaSlider");
                    portraitStatsManaSlider.minimum = 0;
                    portraitStatsManaSlider.maximum = 100;
                    portraitStatsManaSlider.isVertical = false;
                    portraitStatsManaSlider.displayThumb = false;
                    portraitStatsManaSlider.left = "16px";
                    portraitStatsManaSlider.height = GameGUI.getFontSizePx(1.5);
                    portraitStatsManaSlider.thumbWidth = 0;
                    portraitStatsManaSlider.isEnabled = false;
                    portraitStatsManaSlider.color = "blue";
                var portraitStatsStaminaContainer = new BABYLON.GUI.Rectangle("portraitStatsStaminaContainer");
                portraitStatsStaminaContainer.height = GameGUI.fontSizePx;
                portraitStatsStaminaContainer.width = 0.85;
                portraitStatsStaminaContainer.thickness = 0;
                    var portraitStatsStaminaText = new BABYLON.GUI.TextBlock("portraitStatsStaminaText");
                    portraitStatsStaminaText.text = "";
                    portraitStatsStaminaText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    portraitStatsStaminaText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    portraitStatsStaminaText.color = GameGUI.color;
                    var portraitStatsStaminaSlider = new BABYLON.GUI.Slider("portraitStatsStaminaSlider");
                    portraitStatsStaminaSlider.minimum = 0;
                    portraitStatsStaminaSlider.maximum = 100;
                    portraitStatsStaminaSlider.isVertical = false;
                    portraitStatsStaminaSlider.displayThumb = false;
                    portraitStatsStaminaSlider.left = "16px";
                    portraitStatsStaminaSlider.height = GameGUI.getFontSizePx(1.5);
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
        portraitStatsManaContainer.addControl(portraitStatsManaSlider);
        portraitStatsManaContainer.addControl(portraitStatsManaText);
        portraitStats.addControl(portraitStatsManaContainer);
        portraitStatsStaminaContainer.addControl(portraitStatsStaminaSlider);
        portraitStatsStaminaContainer.addControl(portraitStatsStaminaText);
        portraitStats.addControl(portraitStatsStaminaContainer);
        portrait.zIndex = 10;
        PlayerPortraitGameGUI.playerName = portraitName;
        PlayerPortraitGameGUI.playerIcon = portraitAvatar;
        PlayerPortraitGameGUI.playerHealthBar = portraitStatsHealthSlider;
        PlayerPortraitGameGUI.playerHealthText = portraitStatsHealthText;
        PlayerPortraitGameGUI.playerManaBar = portraitStatsManaSlider;
        PlayerPortraitGameGUI.playerManaText = portraitStatsManaText;
        PlayerPortraitGameGUI.playerStaminaBar = portraitStatsStaminaSlider;
        PlayerPortraitGameGUI.playerStaminaText = portraitStatsStaminaText;
        return portrait;
    }
    static show() {
        PlayerPortraitGameGUI.controller.isVisible = true;
    }
    static hide() {
        PlayerPortraitGameGUI.controller.isVisible = false;
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
        if (abstractEntity.getMaxMana() == 0) {
            PlayerPortraitGameGUI.hideMana();
        }
        else {
            PlayerPortraitGameGUI.showMana();
            PlayerPortraitGameGUI.setManaSlider(abstractEntity.getMana()/abstractEntity.getMaxMana()*100);
            PlayerPortraitGameGUI.setManaText(abstractEntity.getMana() + "/" + abstractEntity.getMaxMana());
        }
        PlayerPortraitGameGUI.setStaminaSlider(abstractEntity.getStamina()/abstractEntity.getMaxStamina()*100);
        PlayerPortraitGameGUI.setStaminaText(abstractEntity.getStamina() + "/" + abstractEntity.getMaxStamina());
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
    static showMana() {
        PlayerPortraitGameGUI.playerManaBar.parent.isVisible = true;
        PlayerPortraitGameGUI.playerManaBar.parent.isEnabled = true;
    }
    static hideMana() {
        PlayerPortraitGameGUI.playerManaBar.parent.isVisible = false;
        PlayerPortraitGameGUI.playerManaBar.parent.isEnabled = false;
    }
    static setManaSlider(int = 100) {
        PlayerPortraitGameGUI.playerManaBar.value = int;
    }
    static setManaText(text = "") {
        PlayerPortraitGameGUI.playerManaText.text = text;
    }
    static getController() {
        return PlayerPortraitGameGUI.controller;
    }
}
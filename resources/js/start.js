window.addEventListener('resize', function(){
    Game.engine.resize();
    GameGUI.resizeText();
});
window.addEventListener("DOMContentLoaded", function() {
    console.log("Initializing game.");
    Game.initialize();

    Game.engine.runRenderLoop(function() {
        Game.scene.render();
        if (!Game.finishedFirstLoad()) {
            if (Game.finishedLoadingFiles()) {
                if (!Game.finishedInitializing()) {
                    if (Game.debugEnabled) console.log("Finished loading assets.");
                    Game.importProtoItems();
                    Game._finishedInitializing = true;

                    Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                        Game.controlCharacterOnKeyDown(evt.sourceEvent.keyCode);
                    }));
                    Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                        Game.controlCharacterOnKeyUp(evt.sourceEvent.keyCode);
                    }));
                }
                else if (Game.finishedInitializing()) {
                    Game._finishedFirstLoad = true;
                    Client.initialize();
                    GameGUI.resizeText();
                    GameGUI.showCharacterChoiceMenu();
                }
            }
        }
    });
    Game.scene.registerBeforeRender(function() {
        if (!(Game.player instanceof CharacterController))
            return null;
        for (_character in Game.characterControllers) {
            if (Game.entityControllers[_character] instanceof CharacterController) {
                Game.entityControllers[_character].moveAV();
            }
            if (_character.propertiesChanged) {
                _character.updateProperties();
            }
        }
    });
    Game.scene.registerAfterRender(function() {
        Game._createBackloggedMeshes();
        Game._createBackloggedBoundingCollisions();
        Game._createBackloggedFurniture();
        Game._createBackloggedDoors();
        Game._createBackloggedCharacters();
    })
});
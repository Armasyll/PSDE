_map = {};
charlie = undefined;
rosie = undefined;

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
function unsafeExec(_executableString = undefined) {
    if (Game.debugEnabled) console.log("Running unsafeExec");
    var _return = undefined;
    
    fn = new Function(_executableString);
    try {
        _return = fn();
    }
    catch (err) {
        if (Game.debugEnabled) console.log(err);
    }
    
    if (_return == undefined)
        return true;
    else
        return _return;
}
function genUUIDv4() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid.toUpperCase();
}

window.addEventListener('resize', function(){
    Game.engine.resize();
});
window.addEventListener("DOMContentLoaded", function() {
    if (Game.debugEnabled) console.log("Initializing game.");
    Game.initialize();

    Game.engine.runRenderLoop(function() {
        Game.scene.render();
        if (!Game._finishedLoading) {
            if (Game._loadedFurniture && Game._loadedSurfaces && Game._loadedCharacters && Game._loadedItems) {
                if (Game.debugEnabled) console.log("Finished loading assets.");
                generateApartmentScene();
                Game.initPlayer("foxSkeletonN", 1);
                Game._finishedLoading = true;

                for (var _key in Game.keyboardControls) {
                    _map[_key] = false;
                }

                Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                    _map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
                }));
                Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                    _map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
                }));

                Client.initialize();
                Game.guis["characterChoiceMenu"].isVisible = true;
            }
        }
    });

    Game.scene.registerBeforeRender(function() {
        for (var _i in Game.characterInstances) {
            if (Game.characterInstances[_i].characterController instanceof CharacterController) {
                if (Game.characterInstances[_i].characterController.moveForward || Game.characterInstances[_i].characterController.moveBackward) {
                    Game.characterInstances[_i].characterController.stopAnimation("80_idle01");
                    Game.characterInstances[_i].characterController.runAnimation("93_walkingKneesBent", 1.0, 1.2);
                }
                else {
                    Game.characterInstances[_i].characterController.stopAnimation("93_walkingKneesBent");
                    Game.characterInstances[_i].characterController.runAnimation("80_idle01");
                }
            }
        };
    });
    Game.scene.registerAfterRender(function() {
        if (!(Game.player instanceof BABYLON.Mesh) || !(Game.player.characterController instanceof CharacterController))
            return null;
        for (var _key in Game.keyboardControls) {
            if (_map[_key]) {
                unsafeExec(Game.keyboardControls[_key]);
            }
            else {
                switch(Game.keyboardControls[_key].split('(')[0]) {
                    case "Game.player.characterController.doMoveForward": {
                        Game.player.characterController.moveForward = false;
                        break;
                    }
                    case "Game.player.characterController.doMoveBackward": {
                        Game.player.characterController.moveBackward = false;
                        break;
                    }
                    case "Game.player.characterController.doRunForward": {
                        Game.player.characterController.runForward = false;
                        break;
                    }
                    case "Game.player.characterController.doRunBackward": {
                        Game.player.characterController.runBackward = false;
                        break;
                    }
                    case "Game.player.characterController.doTurnLeft": {
                        Game.player.characterController.turnLeft = false;
                        break;
                    }
                    case "Game.player.characterController.doTurnRight": {
                        Game.player.characterController.turnRight = false;
                        break;
                    }
                    case "Game.player.characterController.doStrafeLeft": {
                        Game.player.characterController.strafeLeft = false;
                        break;
                    }
                    case "Game.player.characterController.doStrafeRight": {
                        Game.player.characterController.strafeRight = false;
                        break;
                    }
                    case "Game.player.characterController.doJump": {
                        Game.player.characterController.jump = false;
                        break;
                    }
                }
            }
        }
    });
});

/*window.addEventListener("click", function (e) {
    var canvas = document.getElementById("canvas");
    canvas.requestPointerLock = canvas.requestPointerLock ||
            canvas.mozRequestPointerLock ||
            canvas.webkitRequestPointerLock;

    // Ask the browser to lock the pointer)
    canvas.requestPointerLock();
    Game.engine.isPointerLock = true;
    e.preventDefault();
    switch (e.which) {
        case 0 :
            break;
        case 1 : { // leftClick
            break;
        }
        case 2 : { // middleClick
            //var _pickResult = Game.scene.pick(Game.scene.pointerX, Game.scene.pointerY);
            var _pickResult = Game.scene.pick(Game.canvas.width / 2, Game.canvas.height / 2);

            if (Game.currentSelectedMesh != undefined && Game.currentSelectedMesh.showBoundingBox)
                Game.currentSelectedMesh.showBoundingBox = false;

            if (_pickResult.pickedMesh != Game.currentSelectedMesh) {
                Game.previousSelectedMesh = Game.currentSelectedMesh;
                Game.currentSelectedMesh = _pickResult.pickedMesh;
                Game.currentSelectedMesh.showBoundingBox = !(Game.currentSelectedMesh.showBoundingBox);
            }
            else {
                Game.previousSelectedMesh = Game.currentSelectedMesh;
                Game.currentSelectedMesh = undefined;
                Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshLabel"));
                Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshText"));
                Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshLine"));
            Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshOrigin"));
                return undefined;
            }

            Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshLabel"));
            Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshText"));
            Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshLine"));
            Game.gui.removeControl(Game.gui._rootContainer.getChildByName("selectedMeshOrigin"));

            var labelText = new BABYLON.GUI.TextBlock("selectedMeshText");
            var label = new BABYLON.GUI.Rectangle("selectedMeshLabel");
            var labelLine = new BABYLON.GUI.Line("selectedMeshLine");
            var labelLineStart = new BABYLON.GUI.Ellipse("selectedMeshOrigin");

            label.background = "black"
            label.height = "30px";
            label.alpha = 0.5;
            label.width = "200px";
            label.cornerRadius = 20;
            label.thickness = 1;
            label.linkOffsetY = 30;
            label.top = "10%";
            label.zIndex = 5;
            label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            Game.gui.addControl(label);

            labelText.text = Game.currentSelectedMesh.name;
            labelText.color = "white";
            label.addControl(labelText);

            labelLine.alpha = 0.5;
            labelLine.lineWidth = 5;
            labelLine.dash = [5, 10];
            Game.gui.addControl(labelLine);
            labelLine.linkWithMesh(Game.currentSelectedMesh);
            labelLine.connectedControl = label;

            labelLineStart.width = "10px";
            labelLineStart.background = "black";
            labelLineStart.height = "10px";
            labelLineStart.color = "white";
            Game.gui.addControl(labelLineStart);
            labelLineStart.linkWithMesh(Game.currentSelectedMesh);
            break;
        }
        case 3 : { // rightClick
            // Setting `dom.event.contextmenu.enabled` to `true` in firefox
            var _pickResult = Game.scene.pick(Game.scene.pointerX, Game.scene.pointerY);
            //var _pickResult = Game.scene.pick(document.getElementById("canvas").width/2, document.getElementById("canvas").height/2);

            if (Game.currentSelectedMesh != undefined && Game.currentSelectedMesh.showBoundingBox)
                Game.currentSelectedMesh.showBoundingBox = false;

            Game.contextMenu(Game.currentSelectedMesh);
            break;
        }
    }
});*/
/*window.addEventListener("keypress", function(e) {
    e.preventDefault();
    switch (e.which) {
        case 96 : Game.controlsDebug(); break;
    }
});*/


function generateApartmentScene() {
    if (Game.debugEnabled) console.log("Running generateApartmentScene");
    if (Game.physicsEnabled) {
        var _ground = BABYLON.Mesh.CreateGround("ground", 1024,  1024, 1, Game.scene);
        _ground.material = new BABYLON.Material();
        _ground.position.y = 0.0;
        _ground.material.alpha = 0;
        Game.assignPlanePhysicsToMesh(_ground);
    }
    else {
        Game.addCollisionPlane({x:-512, z:-512}, {x:512, z:512}, 0);
    }

    var _ambientLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), Game.scene);
    _ambientLight.intensity = 0.9;

    var packStreetApartmentBuildingTexture = new BABYLON.StandardMaterial("packStreetApartmentBuildingTexture", Game.scene);
    packStreetApartmentBuildingTexture.diffuseTexture = new BABYLON.Texture("resources/images/packStreetApartmentBuildingGroundFloor.png", Game.scene);
    packStreetApartmentBuildingTexture.specularColor = new BABYLON.Color3(0, 0, 0);
    packStreetApartmentBuildingTexture.backFaceCulling = false;
    var packStreetApartmentBuildingMap = new BABYLON.Mesh.CreatePlane("packStreetApartmentBuildingMap", 2, Game.scene);
    packStreetApartmentBuildingMap.position.x = 5.6;
    packStreetApartmentBuildingMap.position.y = 1.5;
    packStreetApartmentBuildingMap.position.z = -17.06;
    packStreetApartmentBuildingMap.scaling.x = 0.6;
    packStreetApartmentBuildingMap.material = packStreetApartmentBuildingTexture;

    var nooo = new BABYLON.StandardMaterial("", Game.scene);
    nooo.diffuseTexture = new BABYLON.Texture("resources/images/noooo.jpg", Game.scene);
    nooo.specularColor = new BABYLON.Color3(0, 0, 0);
    nooo.backFaceCulling = true;
    var noooMesh = new BABYLON.Mesh.CreatePlane("noooMesh", 2, Game.scene);
    noooMesh.position.set(4, 1, -27);
    noooMesh.scaling.x = 0.6;
    noooMesh.material = nooo;

    /*var yipyipyipTexture = new BABYLON.StandardMaterial("yipyipyipTexture", Game.scene);
    yipyipyipTexture.diffuseTexture = new BABYLON.VideoTexture("yipyipyipVideo", ["resources/videos/20180420_yipyipyip.mp4", "resources/videos/20180420_yipyipyip.webm"], Game.scene, true);
    yipyipyipTexture.emissiveColor = new BABYLON.Color3(0, 0, 0);
    var yipyipyipMesh = new BABYLON.Mesh.CreatePlane("yipyipyipPlayer", 2, Game.scene);
    yipyipyipMesh.position.set(1, 1.5, -17.06);
    yipyipyipMesh.scaling.set(0.75, 0.5, 0.5);
    yipyipyipMesh.material = yipyipyipTexture;*/

    var floorMaterial = new BABYLON.StandardMaterial("floorMaterial", Game.scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture("resources/data/rug.png", Game.scene);
    floorMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    var floorMesh = new BABYLON.MeshBuilder.CreateTiledGround("floorMesh", {xmin:0.0125, zmin:-26, xmax: 16, zmax: 2, subdivisions: {w:8, h:12}}, Game.scene);
    floorMesh.material = floorMaterial;
    floorMesh.position.y = -0.0025;
    floorMesh.position.x -= 1;
    floorMesh.position.z -= 1;
    if (Game.debugEnabled) console.log(floorMesh.getBoundingInfo().boundingBox);

    var ceilingMaterial = new BABYLON.StandardMaterial("ceilingMaterial", Game.scene);
    ceilingMaterial.diffuseTexture = new BABYLON.Texture("resources/data/wall.png", Game.scene);
    ceilingMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ceilingMaterial.backFaceCulling = false;
    var ceilingMesh = new BABYLON.MeshBuilder.CreateTiledGround("ceilingMesh", {xmin:0.0125, zmin:-26, xmax: 16, zmax: 2, subdivisions: {w:8, h:12}}, Game.scene);
    ceilingMesh.material = ceilingMaterial;
    ceilingMesh.position.y = 3;
    ceilingMesh.position.x -= 1;
    ceilingMesh.position.z -= 1;

    Game.addCollisionWall({x:-1, y:0, z:1}, {x:15, y:0, z:1}); // Back floor wall
    Game.addCollisionWall({x:-1, y:0, z:1}, {x:-1, y:0, z:-27}); // Left floor wall
    Game.addCollisionWall({x:15, y:0, z:1}, {x:15, y:0, z:-27}); // Right floor wall
    Game.addCollisionWall({x:-1, y:0, z:-27}, {x:3, y:0, z:-27}); // Front floor wall, left
    Game.addCollisionWall({x:5, y:0, z:-27}, {x:15, y:0, z:-27}); // Front floor wall, right

    Game.addCollisionWall({x:9, y:0, z:1}, {x:9, y:0, z:-5}); // Side wall between Ozzy's bathroom and Landlord's apartment
    Game.addCollisionWall({x:5, y:0, z:-1}, {x:5, y:0, z:-7}); // Side wall between Ozzy's apartment and Landlord's bathroom
    Game.addCollisionWall({x:7, y:0, z:-7}, {x:7, y:0, z:-13}); // Side wall between Ozzy's and Landord's kitchenettes

    Game.addCollisionWall({x:5, y:0, z:-3}, {x:9, y:0, z:-3}); // Front wall between Ozzy's and Landlord's bathrooms
    Game.addCollisionWall({x:5, y:0, z:-7}, {x:9, y:0, z:-7}); // Front wall between Landlord's bathroom and Landlord's and Ozzy's kitchenettes
    Game.addCollisionWall({x:5, y:0, z:-13}, {x:9, y:0, z:-13}); // Front wall between Landlord's kitchenette and Landlord's entrance

    Game.addCollisionWall({x:-1, y:0, z:-13}, {x:3, y:0, z:-13}); // Front wall between Commons and Ozzy's apartment
    Game.addCollisionWall({x:5, y:0, z:-13}, {x:5, y:0, z:-15}); // Side wall between Commons and Landlord's apartment
    Game.addCollisionWall({x:5, y:0, z:-17}, {x:15, y:0, z:-17}); // Front wall between Commons and Landlord's apartment

    Game.addCollisionWall({x:5, y:0, z:-25}, {x:5, y:0, z:-27}); // Side wall between Commons and building entrance

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:0});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:0});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:0, y:0, z:0});
    Game.addMesh("wall", undefined,                 {x:2, y:0, z:0});
    Game.addMesh("frontDoorLeftWall", undefined,    {x:4, y:0, z:0}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftDoor", undefined,    {x:6, y:0, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:6, y:0, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:8, y:0, z:0}, {x:0, y:90, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:8, y:0, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:10, y:0, z:0});
    Game.addMesh("wall", undefined,                 {x:12, y:0, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:14, y:0, z:0}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-2});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-2});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-2});
    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-2}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:4, y:0, z:-2}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-2}, {x:0, y:-90, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:6, y:0, z:-2});
    Game.addMesh("frontWallLeftWall", undefined,    {x:8, y:0, z:-2}, {x:0, y:-180, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:8, y:0, z:-2});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-2}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-2}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-4});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-4});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-4});
    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-4}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:4, y:0, z:-4}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-4});
    Game.addMesh("floorLinoleum", undefined,        {x:6, y:0, z:-4});
    Game.addMesh("frontWallLeftWall", undefined,    {x:8, y:0, z:-4}, {x:0, y:90, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:8, y:0, z:-4});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-4}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-4}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-6});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-6});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-6});
    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-6}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:4, y:0, z:-6}, {x:0, y:90, z:0});
    Game.addFurnitureMesh("bookshelfThin", "bookShelfThinInstance01", {},      {x:4, y:0, z:-6}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-6}, {x:0, y:-90, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:6, y:0, z:-6});
    Game.addMesh("frontWallLeftDoor", undefined,    {x:8, y:0, z:-6}, {x:0, y:180, z:0});
    Game.addMesh("floorLinoleum", undefined,        {x:8, y:0, z:-6});
    Game.addMesh("doorway", undefined,              {x:10, y:0, z:-6}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-6}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-8});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-8});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-8});
    Game.addMesh("floorWoodDark", undefined,        {x:6, y:0, z:-8});
    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-8}, {x:0, y:-90, z:0});
    Game.addMesh("corner", undefined,               {x:4, y:0, z:-8}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-8}, {x:0, y:90, z:0});
    Game.addMesh("refrigerator", undefined,         {x:6, y:0, z:-8}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:8, y:0, z:-8});
    Game.addMesh("corner", undefined,               {x:10, y:0, z:-8});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-8}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-10});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-10});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-10});
    Game.addMesh("floorWoodDark", undefined,        {x:6, y:0, z:-10});
    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-10}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:6, y:0, z:-10}, {x:0, y:90, z:0});
    Game.addFurnitureMesh("trashBagFull", "trashBagFullInstance01", {mass:4.5}, {x:6.4, y:0, z:-9.8});
    Game.addFurnitureMesh("trashCan", "trashCanInstance01", {mass:4.0}, {x:5.8, y:0, z:-10.2});
    Game.addFurnitureMesh("trashBagFull", "trashBagFullInstance02", {mass:4.0}, {x:6.5, y:0, z:-10.6}, {x:0, y:90, z:0});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-10}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-10}, {x:0, y:90, z:0});

    Game.addMesh("floorWoodDark", undefined,        {x:0, y:0, z:-12});
    Game.addMesh("floorWoodDark", undefined,        {x:2, y:0, z:-12});
    Game.addMesh("floorWoodDark", undefined,        {x:4, y:0, z:-12});
    Game.addMesh("floorWoodDark", undefined,        {x:6, y:0, z:-12});
    Game.addMesh("frontWallLeftWall", undefined,    {x:0, y:0, z:-12}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:2, y:0, z:-12}, {x:0, y:180, z:0});
    Game.addMesh("doorway", undefined,              {x:4, y:0, z:-12}, {x:0, y:180, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-12}, {x:0, y:180, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:8, y:0, z:-12}, {x:0, y:-90, z:0});
    Game.addMesh("corner", undefined,               {x:10, y:0, z:-12}, {x:0, y:270, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-12}, {x:0, y:90, z:0});

    Game.addMesh("frontWallLeftWall", undefined,    {x:0, y:0, z:-14});
    Game.addMesh("wall", undefined,                 {x:2, y:0, z:-14});
    Game.addMesh("frontWallLeftDoor", undefined,    {x:4, y:0, z:-14}, {x:0, y:90, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-14});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-14});
    Game.addMesh("corner", undefined,               {x:10, y:0, z:-14});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-14}, {x:0, y:90, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-16}, {x:0, y:-90, z:0});
    Game.addMesh("doorway", undefined,              {x:4, y:0, z:-16}, {x:0, y:90, z:0});
    Game.addMesh("frontDoorLeftWall", undefined,    {x:6, y:0, z:-16}, {x:0, y:-90, z:0});
    Game.addMesh("door", undefined,                 {x:6, y:0, z:-16}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-16}, {x:0, y:180, z:0});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-16}, {x:0, y:180, z:0});
    Game.addMesh("wall", undefined,                 {x:12, y:0, z:-16}, {x:0, y:180, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:14, y:0, z:-16}, {x:0, y:180, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-18}, {x:0, y:-90, z:0});
    Game.addMesh("corner", undefined,               {x:4, y:0, z:-18}, {x:0, y:90, z:0});
    Game.addMesh("wall", undefined,                 {x:6, y:0, z:-18});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-18});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-18});
    Game.addMesh("wall", undefined,                 {x:12, y:0, z:-18});
    Game.addMesh("frontWallLeftWall", undefined,    {x:14, y:0, z:-18}, {x:0, y:90, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-20}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-20}, {x:0, y:90, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-22}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-22}, {x:0, y:90, z:0});
    Game.addFurnitureMesh("diningTable", "tableInstance01", {mass:25,restitution:0.1}, {x:10, y:0, z:-22});
    Game.addItemMesh("knife", "knifeInstance01", {mass:0.8,restitution:0.1}, {x:10, y:2, z:-22});
    Game.addItemMesh("cross", "crossInstance01", {mass:0.8,restitution:0.1}, {x:10, y:2, z:-22});
    Game.addItemMesh("plate", "planeInstance01", {mass:0.8,restitution:0.1}, {x:9.7, y:2, z:-22});
    Game.addItemMesh("plate", "plateInstance02", {mass:0.8,restitution:0.1}, {x:10.3, y:2, z:-22});
    Game.addItemMesh("bookHardcoverClosed01", "packstreet23StrangeNewDay", {mass:0.8,restitution:0.1}, {x:10.3, y:1, z:-23}, {x:0, y:180, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-24}, {x:0, y:-90, z:0});
    Game.addMesh("corner", undefined,               {x:4, y:0, z:-24}, {x:0, y:180, z:0});
    Game.addMesh("corner", undefined,               {x:6, y:0, z:-24}, {x:0, y:270, z:0});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-24}, {x:0, y:90, z:0});

    Game.addMesh("frontWallLeftWall", undefined,    {x:0, y:0, z:-26}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:2, y:0, z:-26}, {x:0, y:180, z:0});
    Game.addMesh("frontDoorLeftWall", undefined,    {x:4, y:0, z:-26}, {x:0, y:180, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:6, y:0, z:-26}, {x:0, y:-90, z:0});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-26}, {x:0, y:180, z:0});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-26}, {x:0, y:180, z:0});
    Game.addMesh("wall", undefined,                 {x:12, y:0, z:-26}, {x:0, y:180, z:0});
    Game.addMesh("frontWallLeftWall", undefined,    {x:14, y:0, z:-26}, {x:0, y:180, z:0});

    Game.addMesh("wall", undefined,                 {x:0, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:2, y:0, z:-28});
    Game.addMesh("doorway", undefined,              {x:4, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:6, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:8, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:10, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:12, y:0, z:-28});
    Game.addMesh("wall", undefined,                 {x:14, y:0, z:-28});

    rosie = Game.addCharacterMesh("foxF", "Rosie", undefined, {x:2.5, y:0, z:-19}, undefined, {x:0.7, y:0.7, z:0.7});
    charlie = Game.addCharacterMesh("foxF", "Charlie", undefined, {x:3, y:0, z:-19}, undefined, {x:0.9, y:0.9, z:0.9});
    _corsacMaterial = new BABYLON.StandardMaterial();
    _corsacMaterial.diffuseTexture = new BABYLON.Texture("/resources/data/foxCorsac.png");
    _corsacMaterial.specularColor.set(0,0,0);
    charlie.material = _corsacMaterial;
    Game.addCharacterMesh("foxM", "Nick", undefined, {x:3.5, y:0, z:-19});
    Game.addCharacterMesh("foxSkeletonN", "Fox Skeleton", undefined, {x:4, y:0, z:-19});
    Game.addCharacterMesh("foxSkeletonM", "Fox Neutered Skeleton", undefined, {x:4.5, y:0, z:-19});
    Game.addCharacterMesh("nullSkeletonN", "Null Neutered Skeleton", undefined, {x:5, y:0, z:-19});
    //Game.camera.position.set(3.6193964911424654, 0.6644999999999996, -17.102033408967316);
    //Game.camera.rotation.set(0.01304271019466829, 3.0824392834662313, 0);
}
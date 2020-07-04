/**
 * Main, static Game class
 */
class Game {
    constructor() {
        this.initialized = false;
        Game.debugMode = false;
        Game.godMode = false;
    }
    static preInitialize() {}
    static initialize() {
        let initStart = new Date();
        Game.initialized = false;
        Game.postInitialized = false;
        Game.postLoaded = false;
        Game.SECONDS_IN_DAY = 86400;
        Game.SECONDS_IN_HOUR = 3600;
        Game.RAD_0 = 0.0;
        Game.RAD_1_HALF = BABYLON.Tools.ToRadians(1 / 2);
        Game.RAD_1_3RD = BABYLON.Tools.ToRadians(1 / 3);
        Game.RAD_1_4TH = BABYLON.Tools.ToRadians(1 / 4);
        Game.RAD_1 = BABYLON.Tools.ToRadians(1);
        Game.RAD_45 = BABYLON.Tools.ToRadians(45);
        Game.RAD_90 = BABYLON.Tools.ToRadians(90);
        Game.RAD_135 = BABYLON.Tools.ToRadians(135);
        Game.RAD_180 = BABYLON.Tools.ToRadians(180);
        Game.RAD_225 = BABYLON.Tools.ToRadians(225);
        Game.RAD_270 = BABYLON.Tools.ToRadians(270);
        Game.RAD_315 = BABYLON.Tools.ToRadians(315);
        Game.RAD_360 = 6.28318529;
        Game.currentTime = 0;
        Game.useRigidBodies = true;
        Game.useControllerGroundRay = true;
        Game.debugMode = false;
        Game.godMode = false;
        Game.physicsEnabled = false;
        Game.Tools = Tools;

        Game.loadingCells = true;
        Game.loadingCell = false;

        if (Game.debugMode) console.log("Running initialize");
        Game.canvas = document.getElementById("canvas");
        Game.canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        Game.canvas.exitPointerLock = canvas.exitPointerLock || canvas.mozExitPointerLock;
        Game.engine = new BABYLON.Engine(Game.canvas, false, null, false);
        Game.engine.enableOfflineSupport = false; // Disables .manifest file errors
        Game.engine.isPointerLock = false;
        Game.scene = new BABYLON.Scene(Game.engine);
        Game.scene.autoClear = false;
        Game.scene.autoClearDepthAndStencil = false;
        Game.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        Game.scene.actionManager = new BABYLON.ActionManager(Game.scene);
        if (Game.physicsEnabled) {
            Game.initPhysics();
        }
        else {
            Game.scene.collisionsEnabled = true;
            Game.scene.workerCollisions = false;
        }
        Game.camera = null;
        Game.cameraFocus = null;

        Game.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), Game.scene);
        Game.skybox = new BABYLON.MeshBuilder.CreateBox("skybox", {size:1024.0}, Game.scene);

        Game.assignBoundingBoxCollisionQueue = new Set();

        Game._filesToLoad = 1;
        Game.loadedFiles = new Set();

        /**
         * Map of Mesh file locations per ID
         * eg, {"foxM":"resources/meshes/characters/fox.babylon"}
         * @type {<string, string>}
         */
        Game.meshLocations = {
            "block": "resources/meshes/static/blocks.babylon",
            "blockSlabHorizontal": "resources/meshes/static/blocks.babylon",
            "blockSlabVertical": "resources/meshes/static/blocks.babylon",
            "blockStairs": "resources/meshes/static/blocks.babylon",
            "billboardPyramidHalfBase": "resources/meshes/static/blocks.babylon",
            "billboardHalfInside2": "resources/meshes/static/blocks.babylon",
            "billboardHalfInside2PyramidHalfBase": "resources/meshes/static/blocks.babylon",
            "billboardInside2": "resources/meshes/static/blocks.babylon",
            "billboardInside2PyramidHalfBase": "resources/meshes/static/blocks.babylon",
            "billboardInside2PyramidBase": "resources/meshes/static/blocks.babylon",
            "billboardCubeInside2": "resources/meshes/static/blocks.babylon",
            "billboardCubeInside4": "resources/meshes/static/blocks.babylon",
            "billboardCubeInside6": "resources/meshes/static/blocks.babylon",
            "stopSign": "resources/meshes/static/misc.babylon",
            "twoByFourByEight": "resources/meshes/static/misc.babylon",
            "twoByFourByThree": "resources/meshes/static/misc.babylon",
            "twoByFourBySix": "resources/meshes/static/misc.babylon",
            "tombstone02": "resources/meshes/graveyard.babylon",
            "icosphere30": "resources/meshes/static/misc.babylon",
            "scroll01": "resources/meshes/static/misc.babylon",
            "displayPlatform": "resources/meshes/static/misc.babylon",
            "questionMark": "resources/meshes/static/misc.babylon",
            "exclamationMark": "resources/meshes/static/misc.babylon",
            "tombstone01": "resources/meshes/graveyard.babylon",
            "obelisk02": "resources/meshes/graveyard.babylon",
            "obelisk01": "resources/meshes/graveyard.babylon",
            "scroll02": "resources/meshes/static/misc.babylon",
            "coffinLid01": "resources/meshes/static/furniture.babylon",
            "coffin01": "resources/meshes/static/furniture.babylon",
            "coffinClosed01": "resources/meshes/static/furniture.babylon",
            "bedMattressFrame01": "resources/meshes/static/furniture.babylon",
            "bedFrame01": "resources/meshes/static/furniture.babylon",
            "mattress01": "resources/meshes/static/furniture.babylon",
            "bookshelfThin": "resources/meshes/static/furniture.babylon",
            "couch02": "resources/meshes/static/furniture.babylon",
            "nightstandDoubleDrawer": "resources/meshes/static/furniture.babylon",
            "nightstandSingleDrawer": "resources/meshes/static/furniture.babylon",
            "bedsideTableDoubleDrawer": "resources/meshes/static/furniture.babylon",
            "chair01": "resources/meshes/static/furniture.babylon",
            "loveseat01": "resources/meshes/static/furniture.babylon",
            "bookshelf": "resources/meshes/static/furniture.babylon",
            "lamp01": "resources/meshes/static/furniture.babylon",
            "couch01": "resources/meshes/static/furniture.babylon",
            "trashCanLid": "resources/meshes/static/furniture.babylon",
            "trashBagFull": "resources/meshes/static/furniture.babylon",
            "trashBagInCan": "resources/meshes/static/furniture.babylon",
            "trashCan": "resources/meshes/static/furniture.babylon",
            "consoleTable": "resources/meshes/static/furniture.babylon",
            "sawhorse": "resources/meshes/static/furniture.babylon",
            "bedsideTableSingleDrawer": "resources/meshes/static/furniture.babylon",
            "diningTable": "resources/meshes/static/furniture.babylon",
            "coffeeTable": "resources/meshes/static/furniture.babylon",
            "cheeseWheel": "resources/meshes/items/food01.babylon",
            "cheeseWheelSansWedge": "resources/meshes/items/food01.babylon",
            "cheeseWedge": "resources/meshes/items/food01.babylon",
            "stick01": "resources/meshes/items/misc.babylon",
            "stick03": "resources/meshes/items/misc.babylon",
            "stick04": "resources/meshes/items/misc.babylon",
            "ingot01": "resources/meshes/items/misc.babylon",
            "trumpet01": "resources/meshes/items/misc.babylon",
            "mountainChocolateBar01": "resources/meshes/items/food01.babylon",
            "mountainChocolateWrapper01": "resources/dmeshes/items/food01.babylon",
            "hornsCurved01": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved02": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved03": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved04": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved05": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved07": "resources/meshes/cosmetics/hornsCurved.babylon",
            "hornsCurved06": "resources/meshes/cosmetics/hornsCurved.babylon",
            "cup01": "resources/meshes/items/dishware01.babylon",
            "currencyCoinQuarter": "resources/meshes/items/misc.babylon",
            "currencyCoinDime": "resources/meshes/items/misc.babylon",
            "currencyCoinNickel": "resources/meshes/items/misc.babylon",
            "bottle06": "resources/meshes/items/dishware01.babylon",
            "bottle05": "resources/meshes/items/dishware01.babylon",
            "bottle04": "resources/meshes/items/dishware01.babylon",
            "bottle03": "resources/meshes/items/dishware01.babylon",
            "bottle02": "resources/meshes/items/dishware01.babylon",
            "bottle01": "resources/meshes/items/dishware01.babylon",
            "ring01": "resources/meshes/items/rings01.babylon",
            "ring02": "resources/meshes/items/rings01.babylon",
            "ring03": "resources/meshes/items/rings01.babylon",
            "ring04": "resources/meshes/items/rings01.babylon",
            "ring09": "resources/meshes/items/rings01.babylon",
            "bookHardcoverOpen01": "resources/meshes/items/misc.babylon",
            "key99": "resources/meshes/items/misc.babylon",
            "currencyCoinPenny": "resources/meshes/items/misc.babylon",
            "currencyNoteDollar": "resources/meshes/items/misc.babylon",
            "key01": "resources/meshes/items/misc.babylon",
            "boneRib01": "resources/meshes/gibs.babylon",
            "bone02": "resources/meshes/gibs.babylon",
            "boneMeat02": "resources/meshes/gibs.babylon",
            "bone01": "resources/meshes/gibs.babylon",
            "bookHardcoverClosed01": "resources/meshes/items/misc.babylon",
            "goblet01": "resources/meshes/items/dishware01.babylon",
            "foxhead01": "resources/meshes/gibs.babylon",
            "glass01": "resources/meshes/items/dishware01.babylon",
            "gem03": "resources/meshes/items/misc.babylon",
            "gem04": "resources/meshes/items/misc.babylon",
            "gem05": "resources/meshes/items/misc.babylon",
            "gem06": "resources/meshes/items/misc.babylon",
            "gem08": "resources/meshes/items/misc.babylon",
            "plate01": "resources/meshes/items/dishware01.babylon",
            "eye01": "resources/meshes/gibs.babylon",
            "eye02": "resources/meshes/gibs.babylon",
            "_cD": "resources/meshes/items/misc.babylon",
            "foxhead02": "resources/meshes/gibs.babylon",
            "foxhead03": "resources/meshes/gibs.babylon",
            "foxSkull02": "resources/meshes/gibs.babylon",
            "heart01": "resources/meshes/gibs.babylon",
            "sack01": "resources/meshes/items/misc.babylon",
            "craftsmanCorner": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanCornerNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanDoor": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanDoorway": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanDoorwayNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanFloorRailing": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanFloorRailingLeft": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanFloorRailingRight": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairBaseTrimLeftBottom": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairBaseTrimLeftMiddle": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairBaseTrimLeftTop": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairCrownTrimLeftBottom": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairCrownTrimLeftTop": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairs": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairsRailingLeft": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairsRailingRight": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairWallCorner": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairWallCornerNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairWallSide": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanStairWallSideNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWall": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWallCeilingFloorGap": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWallNoBaseboard": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWallNoCrown": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWallNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWindow": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWindowDouble": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWindowframe": "resources/meshes/static/craftsmanWalls.babylon",
            "craftsmanWindowframeNoTrim": "resources/meshes/static/craftsmanWalls.babylon",
            "stairsCollision": "resources/static/craftsmanWalls.babylon",
            "aardwolfM": "resources/meshes/characters/aardwolf.babylon",
            "spiritN": "resources/meshes/characters/spiritN.babylon",
            "foxF": "resources/meshes/characters/fox.babylon",
            "foxSkeletonN": "resources/meshes/characters/fox.babylon",
            "foxM": "resources/meshes/characters/fox.babylon",
            "sheepF": "resources/meshes/characters/sheep.babylon",
            "sheepM": "resources/meshes/characters/sheep.babylon",
            "hitbox.canine": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.head": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.neck": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.chest": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.upperArm.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.forearm.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.hand.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.upperArm.r": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.forearm.r": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.hand.r": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.spine": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.pelvis": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.this.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.shin.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.foot.l": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.this.r": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.shin.r": "resources/meshes/hitboxes/canine.babylon",
            "hitbox.canine.foot.r": "resources/meshes/hitboxes/canine.babylon",
            "spider": "resources/meshes/arachnids.babylon",
            "borb": "resources/meshes/borb.babylon",
            "animatedPylon01": "resources/meshes/animatedPylon01.babylon",
            "animatedRefrigerator01": "resources/meshes/animatedRefrigerator01.babylon",
            "animatedCoffin01": "resources/meshes/animatedCoffin01.babylon",
            "animatedBarrel01": "resources/meshes/animatedBarrel01.babylon",
            "animatedToilet01": "resources/meshes/animatedToilet01.babylon",
            "animatedFaucet01": "resources/meshes/animatedFaucet01.babylon",
            "sink01": "resources/meshes/static/sink01.babylon",
            "sinkFaucet01": "resources/meshes/static/sink01.babylon",
            "sink01StandCeramic": "resources/meshes/static/sink01.babylon",
            "bathtub01": "resources/meshes/static/bathtub01.babylon",
            "showerPipes01": "resources/meshes/static/bathtub01.babylon",
            "animatedDoor01": "resources/meshes/animatedDoor01.babylon",
            "chair02": "resources/meshes/static/furniture.babylon",
            "chair03": "resources/meshes/static/furniture.babylon",
            "grass01": "resources/meshes/nature.babylon",
            "mushroom01": "resources/meshes/nature.babylon",
            "mushroom02": "resources/meshes/nature.babylon",
            "mushroom03": "resources/meshes/nature.babylon",
            "tombstone03": "resources/meshes/graveyard.babylon",
            "graveyardWallCap01": "resources/meshes/graveyard.babylon",
            "graveyardWallEndShortHalf01": "resources/meshes/graveyard.babylon",
            "graveyardWallEndShort01": "resources/meshes/graveyard.babylon",
            "graveyardWallEndMedium01": "resources/meshes/graveyard.babylon",
            "graveyardWallEndTall01": "resources/meshes/graveyard.babylon",
            "graveyardWallEndVeryTall01": "resources/meshes/graveyard.babylon",
            "graveyardFence01": "resources/meshes/graveyard.babylon",
            "graveyardFenceShort01": "resources/meshes/graveyard.babylon",
            "graveyardFencePike01": "resources/meshes/graveyard.babylon",
            "graveyardFenceWithPillar01": "resources/meshes/graveyard.babylon",
            "graveyardFenceWithPillarShort01": "resources/meshes/graveyard.babylon",
            "graveyardFencePillar01": "resources/meshes/graveyard.babylon",
            "cap01": "resources/meshes/items/armour.babylon",
            "birdMask01": "resources/meshes/items/armour.babylon",
            "birdMaskJaw01": "resources/meshes/items/armour.babylon",
            "wizardHat02": "resources/meshes/items/armour.babylon",
            "barbute01": "resources/meshes/items/armour.babylon",
            "roundShield01": "resources/meshes/items/armour.babylon",
            "parmaShield01": "resources/meshes/items/armour.babylon",
            "heaterShield01": "resources/meshes/items/armour.babylon",
            "heaterShield02": "resources/meshes/items/armour.babylon",
            "heaterShield03": "resources/meshes/items/armour.babylon",
            "scutumShield01": "resources/meshes/items/armour.babylon",
            "barbuteHorned01": "resources/meshes/items/armour.babylon",
            "protohelmet": "resources/meshes/items/armour.babylon",
            "bracer01.l": "resources/meshes/items/armour.babylon",
            "bracer01.r": "resources/meshes/items/armour.babylon",
            "pauldron01.l": "resources/meshes/items/armour.babylon",
            "pauldron01.r": "resources/meshes/items/armour.babylon",
            "knife01": "resources/meshes/items/weapons.babylon",
            "spear01": "resources/meshes/items/weapons.babylon",
            "glaive01": "resources/meshes/items/weapons.babylon",
            "battleAxe01": "resources/meshes/items/weapons.babylon",
            "axe03": "resources/meshes/items/weapons.babylon",
            "axe02": "resources/meshes/items/weapons.babylon",
            "axe01": "resources/meshes/items/weapons.babylon",
            "sword01": "resources/meshes/items/weapons.babylon",
            "sword01Broken00": "resources/meshes/items/weapons.babylon",
            "sword01Broken01": "resources/meshes/items/weapons.babylon",
            "sword01Broken02": "resources/meshes/items/weapons.babylon",
            "sword01Broken03": "resources/meshes/items/weapons.babylon",
            "scythe03": "resources/meshes/items/weapons.babylon",
            "glaive01": "resources/meshes/items/weapons.babylon",
            "forgeHammer01": "resources/meshes/items/weapons.babylon",
            "forgeHammer02": "resources/meshes/items/weapons.babylon",
            "warHammer01": "resources/meshes/items/weapons.babylon",
            "mallet01": "resources/meshes/items/weapons.babylon",
            "pickaxe01": "resources/meshes/items/weapons.babylon",
            "spear01": "resources/meshes/items/weapons.babylon",
            "shovel01": "resources/meshes/items/weapons.babylon",
            "shortSword01": "resources/meshes/items/weapons.babylon",
            "staff05": "resources/meshes/items/weapons.babylon",
            "staff04": "resources/meshes/items/weapons.babylon",
            "staff03": "resources/meshes/items/weapons.babylon",
            "staff02": "resources/meshes/items/weapons.babylon",
            "staff01": "resources/meshes/items/weapons.babylon",
            "cross01": "resources/meshes/items/weapons.babylon",
            "gladius01": "resources/meshes/items/weapons.babylon",
            "harpe01": "resources/meshes/items/weapons.babylon",
            "executionerSword01": "resources/meshes/items/weapons.babylon",
            "cudgel01": "resources/meshes/items/weapons.babylon",
            "morningstar01": "resources/meshes/items/weapons.babylon",
            "greatSword01": "resources/meshes/items/weapons.babylon",
            "katana01": "resources/meshes/items/weapons.babylon",
            "wand01": "resources/meshes/items/weapons.babylon",
            "wand02": "resources/meshes/items/weapons.babylon",
            "wand03": "resources/meshes/items/weapons.babylon",
            "animatedChest01": "resources/meshes/animatedChest01.babylon",
            "apple01": "resources/meshes/items/food01.babylon",
            "cheeseSandwich": "resources/meshes/items/grilledCheeseSandwich.babylon",
            "grilledCheeseSandwich": "resources/meshes/items/grilledCheeseSandwich.babylon",
            "flatScreenMonitor01": "resources/meshes/static/flatScreenMonitor01.babylon",
            "flatScreenMonitor01Screen": "resources/meshes/static/flatScreenMonitor01.babylon",
            "flatScreenMonitor01Stand": "resources/meshes/static/flatScreenMonitor01.babylon",
            "1980Computer": "resources/meshes/static/1980Computer.babylon",
            "1980Monitor": "resources/meshes/static/1980Computer.babylon",
            "1980Screen": "resources/meshes/static/1980Computer.babylon",
            "1980Keyboard": "resources/meshes/static/1980Computer.babylon"
        };
        /**
         * Map of Meshes per ID
         * eg, {"ring01":{ring01 Mesh}, "ring02":{...}}
         * @type {<string, BABYLON.Mesh>}
         */
        Game.loadedMeshes = {};
        /**
         * Map of Texture file locations per ID
         * eg, {"foxRed":"resources/images/textures/characters/foxRed.svg"}
         * @type {<string, string>}
         */
        Game.textureLocations = {
            "packStreetApartmentBuildingGroundFloor": "resources/images/textures/static/packStreetApartmentBuildingGroundFloor.png",
            "carpetPink01": "resources/images/textures/static/carpet/carpetPink01.png",
            "carpetBlack01": "resources/images/textures/static/carpet/carpetBlack01.png",
            "carpet02-pink": "resources/images/textures/static/carpet/Carpet13_pink.png",
            "carpet02-black": "resources/images/textures/static/carpet/Carpet13_black.png",
            "carpet02-NORMAL": "resources/images/textures/static/carpet/Carpet13_nrm.png",
            "noooo": "resources/images/textures/static/noooo.jpg",
            "packStreetChapter23": "resources/images/textures/items/packStreetChapter23.svg",
            "packStreetChapter24": "resources/images/textures/items/packStreetChapter24.svg",
            "foxCorsac": "resources/images/textures/characters/foxCorsac.svg",
            "cross01": "resources/images/textures/items/cross01.svg",
            "spirit": "resources/images/textures/characters/spirit.png",
            "ring02GoldBrokenRuby": "resources/images/textures/items/ring02GoldBrokenRuby.svg",
            "ring02Gold": "resources/images/textures/items/ring02Gold.svg",
            "ring02Silver": "resources/images/textures/items/ring02Silver.svg",
            "ring02SilverBrokenRuby": "resources/images/textures/items/ring02SilverBrokenRuby.svg",
            "fireSplatter": "resources/images/textures/effects/fireSplatter.svg",
            "fireOpacity": "resources/images/textures/effects/fireOpacity.svg",
            "fireDistortion": "resources/images/textures/effects/fireDistortion.png",
            "bottle03RedSarcophagusJuice": "resources/images/textures/items/bottle03RedSarcophagusJuice.svg",
            "bottle03Red": "resources/images/textures/items/bottle03Red.svg",
            "bottle03Blue": "resources/images/textures/items/bottle03Blue.svg",
            "bottle03Purple": "resources/images/textures/items/bottle03Purple.svg",
            "bottle03White": "resources/images/textures/items/bottle03White.svg",
            "bookshelfBlackPlywood": "resources/images/textures/furniture/bookshelfBlackPlywood.svg",
            "TheMagicalCircleOfKingSolomon": "resources/images/textures/effects/TheMagicalCircleOfKingSolomon.svg",
            "theLesserKeyOfSolomon": "resources/images/textures/items/theLesserKeyOfSolomon.svg",
            "metalIron01": "resources/images/textures/items/metalIron01.png",
            "foxRed": "resources/images/textures/characters/foxRed.svg",
            "foxRinehart": "resources/images/textures/characters/foxRinehart.svg",
            "sheepWhite": "resources/images/textures/characters/sheepWhite.svg",
            "dice": "resources/images/textures/items/dice.svg",
            "vChocolateV": "resources/images/textures/items/vChocolateV.svg",
            "missingTexture": "resources/images/textures/static/missingTexture.svg",
            "woodenMallet": "resources/images/textures/items/woodenMallet.svg",
            "metalTool01": "resources/images/textures/items/metalTool01.svg",
            "cheeseWheel": "resources/images/textures/items/cheeseWheel.svg",
            "stick01": "resources/images/textures/items/stick01.svg",
            "rock01": "resources/images/textures/items/rock01.png",
            "bone01": "resources/images/textures/items/bone01.svg",
            "icosphere30": "resources/images/textures/static/icosphere30.svg",
            "fireOpacityPNG": "resources/images/textures/effects/fireOpacity.png",
            "fire": "resources/images/textures/effects/fire.png",
            "greenWallpaper": "resources/images/textures/static/greenWallpaper.png",
            "trimWood": "resources/images/textures/static/trimWood.png",
            "plainDoor": "resources/images/textures/static/plainDoor.svg",
            "pinkWallpaperPlainWood": "resources/images/textures/static/pinkWallpaperPlainWood.png",
            "yellowWallpaperPlainWood": "resources/images/textures/static/yellowWallpaperPlainWood.png",
            "stahpSign": "resources/images/textures/items/stahpSign.svg",
            "stopSign": "resources/images/textures/items/stopSign.svg",
            "blackWallpaperPlainWood": "resources/images/textures/static/blackWallpaperPlainWood.png",
            "blueWallpaperPlainWood": "resources/images/textures/static/blueWallpaperPlainWood.png",
            "checkerLinoleumFloor01": "resources/images/textures/static/checkerLinoleumFloor01.png",
            "greenWallpaperPlainWood": "resources/images/textures/static/greenWallpaperPlainWood.png",
            "whitePanelGrayStone": "resources/images/textures/static/whitePanelGrayStone.png",
            "whiteWallpaperPlainWood": "resources/images/textures/static/whiteWallpaperPlainWood.png",
            "woodenFloorDark01-BUMP": "resources/images/textures/static/woodenFloorDark01-BUMP.png",
            "woodenFloorDark01-DIFFUSE": "resources/images/textures/static/woodenFloorDark01-DIFFUSE.png",
            "woodenFloorDark01-NORMAL": "resources/images/textures/static/woodenFloorDark01-NORMAL.png",
            "woodenFloorDark26-BUMP": "resources/images/textures/static/woodenFloorDark26-BUMP.png",
            "woodenFloorDark26-DIFFUSE": "resources/images/textures/static/woodenFloorDark26-DIFFUSE.png",
            "woodenFloorDark26-NORMAL": "resources/images/textures/static/woodenFloorDark26-NORMAL.png",
            "stripped-BUMP": "resources/images/textures/static/stripped-BUMP.png",
            "stripped-NORMAL": "resources/images/textures/static/stripped-NORMAL.png",
            "stoneTexture01": "resources/images/textures/static/stoneTexture01.png",
            "stoneTexture01-NORMAL": "resources/images/textures/static/stoneTexture01-NORMAL.png",
            "dice01Texture": "resources/images/textures/items/dice01.svg",
            "birdMask01": "resources/images/textures/items/birdMask01.svg",
            "chest01": "resources/images/textures/furniture/chest01.svg",
            "apple01": "resources/images/textures/items/apple01.svg",
            "circularEyeBlue": "resources/images/textures/items/circularEyeBlue.svg",
            "circularEyeGreen": "resources/images/textures/items/circularEyeGreen.svg",
            "circularEyeViolet": "resources/images/textures/items/circularEyeViolet.svg",
            "circularEye": "resources/images/textures/items/circularEye.svg",
            "feralEye": "resources/images/textures/items/feralEye.svg",
            "feralEyeViolet": "resources/images/textures/items/feralEyeViolet.svg",
            "feralEyeBlue": "resources/images/textures/items/feralEyeBlue.svg",
            "feralEyeGreen": "resources/images/textures/items/feralEyeGreen.svg",
            "feralEyeYellow": "resources/images/textures/items/feralEyeYellow.svg",
            "oblongEye": "resources/images/textures/items/oblongEye.svg",
            "circularEyeBrown": "resources/images/textures/items/circularEyeBrown.svg",
            "feralEyeBrown": "resources/images/textures/items/feralEyeBrown.svg",
            "circularEyeYellow": "resources/images/textures/items/circularEyeYellow.svg",
            "oblongEyeYellow": "resources/images/textures/items/oblongEyeYellow.svg",
            "oblongEyeBrown": "resources/images/textures/items/oblongEyeBrown.svg",
            "oblongEyeBlue": "resources/images/textures/items/oblongEyeBlue.svg",
            "oblongEyeGreen": "resources/images/textures/items/oblongEyeGreen.svg",
            "oblongEyeViolet": "resources/images/textures/items/oblongEyeViolet.svg",
            "heart01": "resources/images/textures/items/heart01.png",
            "cheeseSandwich01": "resources/images/textures/items/cheeseSandwich01.svg",
            "grilledCheeseSandwich01": "resources/images/textures/items/grilledCheeseSandwich01.svg",
            "1980Computer": "resources/images/textures/static/1980Computer-notCC0.png",
            "californiaKnockdown01": "resources/images/textures/static/californiaKnockdown01.png",
            "californiaKnockdown02": "resources/images/textures/static/californiaKnockdown02.png",
            "ceramicsAndPipes": "resources/images/textures/static/ceramicsAndPipes.png",
            "wheat_stage_0": "resources/images/textures/blocks/wheat_stage_0.png",
            "wheat_stage_1": "resources/images/textures/blocks/wheat_stage_1.png",
            "wheat_stage_2": "resources/images/textures/blocks/wheat_stage_2.png",
            "wheat_stage_3": "resources/images/textures/blocks/wheat_stage_3.png",
            "wheat_stage_4": "resources/images/textures/blocks/wheat_stage_4.png",
            "wheat_stage_5": "resources/images/textures/blocks/wheat_stage_5.png",
            "wheat_stage_6": "resources/images/textures/blocks/wheat_stage_6.png",
            "wheat_stage_7": "resources/images/textures/blocks/wheat_stage_7.png"
        };
        Game.loadedSVGDocuments = {};
        Game.loadedImages = {};
        /**
         * Map of Textures per ID
         * eg, {"ring01Silver":{ring01Silver Texture}, "ring01Gold":{...}}
         * @type {<string, BABYLON.Texture>}
         */
        Game.loadedTextures = {};
        /**
         * Map of Materials per ID
         * @type {<string, BABYLON.Material>}
         */
        Game.loadedMaterials = {};
        /**
         * Map of Icon file locations per ID
         * eg, {"rosie":"resources/images/icons/characters/rosie.png"}
         * @type {<string, string>}
         */
        Game.iconLocations = {
            "rosieIcon": "resources/images/icons/characters/rosie.png",
            "charlieIcon": "resources/images/icons/characters/charlie.svg",
            "genericItemIcon": "resources/images/icons/items/genericItem.svg",
            "genericCharacterIcon": "resources/images/icons/characters/genericCharacter.svg",
            "genericRabbitIcon": "resources/images/icons/characters/genericRabbit.svg",
            "pandorasBoxLocationKeyIcon": "resources/images/icons/items/pandorasBoxLocationKey.svg",
            "keyIcon": "resources/images/icons/items/key.svg",
            "nickWildeIcon": "resources/images/icons/characters/nickWilde.svg",
            "packstreet23StrangeNewDayIcon": "resources/images/icons/items/packstreet23StrangeNewDay.png",
            "cross01Icon": "resources/images/icons/items/cross01.png",
            "ring01SilverIcon": "resources/images/icons/items/ring01Silver.png",
            "ring02SilverIcon": "resources/images/icons/items/ring02Silver.png",
            "ring03SilverDRubyIcon": "resources/images/icons/items/ring03GoldDRuby.png",
            "ring01GoldIcon": "resources/images/icons/items/ring01Gold.png",
            "ring02GoldIcon": "resources/images/icons/items/ring02Gold.png",
            "ring03GoldDRubyIcon": "resources/images/icons/items/ring03GoldDRuby.png",
            "fireIcon": "resources/images/icons/effects/fire.png",
            "bottle05RedSarcophagusJuiceIcon": "resources/images/icons/items/bottle05RedSarcophagusJuice.png",
            "bottle04RedSarcophagusJuiceIcon": "resources/images/icons/items/bottle04RedSarcophagusJuice.png",
            "bottle03RedSarcophagusJuiceIcon": "resources/images/icons/items/bottle03RedSarcophagusJuice.png",
            "bottle03JarateIcon": "resources/images/icons/items/bottle03Jarate.png",
            "theLesserKeyOfSolomonIcon": "resources/images/icons/items/theLesserKeyOfSolomon.png",
            "mountainChocolate01Icon": "resources/images/icons/items/mountainChocolate01.png",
            "knife01Icon": "resources/images/icons/items/knife01.png",
            "missingIcon": "resources/images/icons/static/missingIcon.svg",
            "cudgelIcon": "resources/images/icons/items/cudgel.png",
            "morningstar01Icon": "resources/images/icons/items/morningstar01.png",
            "wizardHat02Icon": "resources/images/icons/items/wizardHat02.png",
            "barbuteHorned01Icon": "resources/images/icons/items/barbuteHorned01.png",
            "heaterShield02Icon": "resources/images/icons/items/heaterShield02.png",
            "heaterShield01Icon": "resources/images/icons/items/heaterShield01.png",
            "roundShieldIcon": "resources/images/icons/items/roundShield.png",
            "parmaShieldIcon": "resources/images/icons/items/parmaShield.png",
            "scutumShieldIcon": "resources/images/icons/items/scutumShield.png",
            "mallet01Icon": "resources/images/icons/items/mallet01.png",
            "shovel01Icon": "resources/images/icons/items/shovel01.png",
            "pickaxe01Icon": "resources/images/icons/items/pickaxe01.png",
            "warHammer01Icon": "resources/images/icons/items/warHammer01.png",
            "harpeIcon": "resources/images/icons/items/harpe.png",
            "gladiusIcon": "resources/images/icons/items/gladius.png",
            "plate01Icon": "resources/images/icons/items/plate01.png",
            "glass01Icon": "resources/images/icons/items/glass01.png",
            "gem03Icon": "resources/images/icons/items/glass03Icon.png",
            "gem04Icon": "resources/images/icons/items/glass04Icon.png",
            "gem05Icon": "resources/images/icons/items/glass05Icon.png",
            "gem06Icon": "resources/images/icons/items/glass06Icon.png",
            "gem08Icon": "resources/images/icons/items/glass08Icon.png",
            "goblet01Icon": "resources/images/icons/items/goblet01.png",
            "cup01Icon": "resources/images/icons/items/cup01.png",
            "staff01Icon": "resources/images/icons/items/staff01.png",
            "staff04Icon": "resources/images/icons/items/staff04.png",
            "staff02Icon": "resources/images/icons/items/staff02.png",
            "staff03Icon": "resources/images/icons/items/staff03.png",
            "staff05Icon": "resources/images/icons/items/staff05.png",
            "wand01Icon": "resources/images/icons/items/wand01.png",
            "wand02Icon": "resources/images/icons/items/wand02.png",
            "wand03Icon": "resources/images/icons/items/wand03.png",
            "shortSword01Icon": "resources/images/icons/items/shortSword01.png",
            "sword01Icon": "resources/images/icons/items/sword01.png",
            "katana01Icon": "resources/images/icons/items/katana01.png",
            "greatSword01Icon": "resources/images/icons/items/greatSword01.png",
            "executionerSword01Icon": "resources/images/icons/items/executionerSword01.png",
            "key01Icon": "resources/images/icons/items/key01.png",
            "key02Icon": "resources/images/icons/items/key02.png",
            "foxFfoxCorsacIcon": "resources/images/icons/characters/foxFfoxCorsac.png",
            "foxMfoxRedIcon": "resources/images/icons/characters/foxMfoxRed.png",
            "foxMfoxCorsacIcon": "resources/images/icons/characters/foxMfoxCorsac.png",
            "foxFfoxRedIcon": "resources/images/icons/characters/foxFfoxRed.png",
            "aardwolfMfoxCorsacIcon": "resources/images/icons/characters/aardwolfMfoxCorsac.png",
            "spiritNIcon": "resources/images/icons/characters/spiritN.png",
            "skeletonNIcon": "resources/images/icons/characters/skeletonN.png",
            "foxSkeletonHeadIcon": "resources/images/icons/items/foxSkeletonHead.png",
            "foxM01HeadIcon": "resources/images/icons/items/foxM01Head.png",
            "foxM02HeadIcon": "resources/images/icons/items/foxM02Head.png",
            "cap01Icon": "resources/images/icons/items/cap01.png",
            "trumpet01Icon": "resources/images/icons/items/trumpet01.png",
            "birdMask01Icon": "resources/images/icons/items/birdMask01.png",
            "spiderIcon": "resources/images/icons/characters/spider.png",
            "plainDoorIcon": "resources/images/icons/static/plainDoor.png",
            "craftsmanWall01Icon": "resources/images/icons/static/craftsmanWall01.png",
            "yellowWallpaperPlainWoodIcon.craftsmanWall01": "resources/images/icons/static/yellowWallpaperPlainWood.craftsmanWall01.png",
            "greenWallpaperPlainWoodIcon.craftsmanWall01": "resources/images/icons/static/greenWallpaperPlainWood.craftsmanWall01.png",
            "pinkWallpaperPlainWoodIcon.craftsmanWall01": "resources/images/icons/static/pinkWallpaperPlainWood.craftsmanWall01.png",
            "stopSignIcon": "resources/images/icons/items/stopSign.png",
            "frigeratorIcon": "resources/images/icons/items/frigerator.png",
            "cheeseWheelIcon": "resources/images/icons/items/cheeseWheel.png",
            "cheeseWheelSansWedgeIcon": "resources/images/icons/items/cheeseWheelSansWedge.png",
            "cheeseWedgeIcon": "resources/images/icons/items/cheeseWedge.png",
            "stick01Icon": "resources/images/icons/items/stick01.png",
            "stick03Icon": "resources/images/icons/items/stick03.png",
            "stick04Icon": "resources/images/icons/items/stick04.png",
            "stick02Icon": "resources/images/icons/items/stick02.png",
            "rock01Icon": "resources/images/icons/items/rock01.png",
            "sink01Icon": "resources/images/icons/items/sink01.png",
            "toilet01Icon": "resources/images/icons/items/toilet01.png",
            "mattress01Icon": "resources/images/icons/items/mattress01.png",
            "couch01Icon": "resources/images/icons/items/couch01Icon.png",
            "couch02Icon": "resources/images/icons/items/couch02Icon.png",
            "loveseat01Icon": "resources/images/icons/items/loveseat01Icon.png",
            "chair01Icon": "resources/images/icons/items/chair01Icon.png",
            "chair02Icon": "resources/images/icons/items/chair02Icon.png",
            "chair03Icon": "resources/images/icons/items/chair03Icon.png",
            "dice01Icon": "resources/images/icons/items/dice01.png",
            "apple01Icon": "resources/images/icons/items/apple01.png",
            "axe01Icon": "resources/images/icons/items/axe01.png",
            "axe02Icon": "resources/images/icons/items/axe02.png",
            "axe03Icon": "resources/images/icons/items/axe03.png",
            "battleAxe01Icon": "resources/images/icons/items/battleAxe01.png",
            "forgeHammer01Icon": "resources/images/icons/items/forgeHammer01.png",
            "forgeHammer02Icon": "resources/images/icons/items/forgeHammer02.png",
            "cudgel01Icon": "resources/images/icons/items/cudgel01.png",
            "cheeseSandwich01Icon": "resources/images/icons/items/cheeseSandwich01Icon.png",
            "grilledCheeseSandwich01Icon": "resources/images/icons/items/grilledCheeseSandwich01Icon.png",
            "genericSwordIcon": "resources/images/icons/genericSwordIcon.svg",
            "genericShirtIcon": "resources/images/icons/genericShirtIcon.svg",
            "genericBagIcon": "resources/images/icons/genericBagIcon.svg",
            "genericMoneyIcon": "resources/images/icons/genericMoneyIcon.svg"
        };
        /**
         * Map of Sound file locations per ID; one to one
         * eg, {"openDoor":"resources/sounds/Open Door.mp3"}
         * @type {<string, string>}
         */
        Game.soundLocations = {
            "openDoor": "resources/sounds/Open Door.mp3",
            "hit": "resources/sounds/Hit.mp3",
            "slice": "resources/sounds/Slice.mp3"
        };
        /**
         * Map of Sounds per ID; one to one
         * @type {<string, BABYLON.Sound>}
         */
        Game.loadedSounds = {};
        /**
         * Map of Video file locations per ID
         * eg, {"missingVideo":"resources/videos/missingVideo.mp4"}
         * @type {<string, string | [string]>}
         */
        Game.videoLocations = {
            "missingVideo": ["resources/videos/missingVideo.webm", "resources/videos/missingVode.mp4"]
        };
        /**
         * Map of BABYLON.VideoTextures per ID; one to one
         * @type {<string, BABYLON.VideoTexture>}
         */
        Game.loadedVideos = {};
        /**
         * Map of Video IDs to BABYLON.VideoTexture(s); one to many
         * @type {<string, [BABYLON.VideoTexture]>}
         */
        Game.videoClones = {};
        /**
         * Map of Meshes per Texture IDs per Mesh IDs; one to many
         * eg, {"ring01":{"ring01Silver":{ring01 Mesh with ring01Silver Texture}, "ring01Gold":{ring01 Mesh with ring01Gold Texture}}, "ring02":{...}}
         * @type {<string, <string, BABYLON.Mesh>>}
         */
        Game.loadedMeshMaterials = {};
        /**
         * Map of Instanced Meshes per ID; one to one
         * @type {<string, BABYLON.InstancedMesh>}
         */
        Game.instancedMeshes = {};
        /**
         * Map cloned Meshes per ID; one to one
         * @type {<string, BABYLON.Mesh>}
         */
        Game.clonedMeshes = {};
        /**
         * Map of meshMaterials to cloned and instanced meshes; one to many
         * @type {<string, <string, BABYLON.AbstractMesh>>}
         */
        Game.meshMaterialMeshes = {};
        /**
         * Map of Meshes that are waiting to be created; one to many
         * @type {<string, <Objects...>>}
         */
        Game.meshesToCreate = {};
        Game.meshesToCreateCounter = 0;
        Game.texturesToCreate = {};
        Game.texturesToCreateCounter = 0;
        Game.materialsToCreate = {};
        Game.materialsToCreateCounter = 0;
        Game.entityStagesToCreate = {};
        Game.entityStagesToCreateCounter = 0;
        /**
         * Map of Furniture that are waiting to be created
         * @type {<string, <string:id, string:name, string:mesh, string:texture, string:type, string:position, string:rotation, string:scaling, object:options>}
         */
        Game.furnitureToCreateCounter = 0;
        Game.furnitureToCreate = {};
        /**
         * Map of Lighting that are waiting to be created;
         * it's basically the same as furnitureToCreate :v
         * @type {<string, <string:id, string:name, string:mesh, string:texture, string:type, string:position, string:rotation, string:scaling, object:options>}
         */
        Game.lightingToCreateCounter = 0;
        Game.lightingToCreate = {};
        /**
         * Map of Displays that are waiting to be created;
         * it's basically the same as furnitureToCreate :v
         * @type {<string, <string:id, string:name, string:mesh, string:texture, string:video, string:position, string:rotation, string:scaling, object:options>}
         */
        Game.displaysToCreateCounter = 0;
        Game.displaysToCreate = {};
        /**
         * Map of Doors that are waiting to be created;
         * it's basically the same as furnitureToCreate :v
         * @type {<string, <string:id, string:name, Forgot:to, string:mesh, string:texture, string:position, string:rotation, string:scaling, object:options>}
         */
        Game.doorsToCreateCounter = 0;
        Game.doorsToCreate = {};
        /**
         * Map of Characters that are waiting to be created;
         * it's basically the same as furnitureToCreate :v
         * @type {<string, <string:id, string:name, string:description, string:icon, Number:age, Number:sex, string:creatureType, string:creatureSubType, string:mesh, string:texture, string:options, string:rotation, string:scaling, object:options>}
         */
        Game.charactersToCreateCounter = 0;
        Game.charactersToCreate = {};
        Game.playerToCreate = null;
        Game.itemsToCreateCounter = 0;
        Game.itemsToCreate = {};
        Game.attachmentsToCreateCounter = 0;
        Game.attachmentsToCreate = {};

        Game.hasBackloggedEntities = false;
        Game.hasBackloggedPlayer = false;

        Game.meshToEntityController = {};

        Game.essentialEntities = new Set();

        Game.meshProperties = {
            "animatedCoffin01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.1995, 0.011719, -1.101), new BABYLON.Vector3(1.1995, 0.011719, 1.101)]
                ]
            },
            "chair01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.44505, 0.375, -0.525), new BABYLON.Vector3(0.44505, 0.375, 0.1725)]
                ]
            },
            "chair02": {
                usableArea: [
                    [new BABYLON.Vector3(-0.312497, 0.375, -0.385357), new BABYLON.Vector3(0.312497, 0.375, 0.122455)]
                ]
            },
            "chair03": {
                usableArea: [
                    [new BABYLON.Vector3(-0.312497, 0.375, -0.385357), new BABYLON.Vector3(0.312497, 0.375, 0.122455)]
                ]
            },
            "coffin01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.1995, 0.011719, -1.101), new BABYLON.Vector3(1.1995, 0.011719, 1.101)]
                ]
            },
            "couch01": {
                usableArea: [
                    [new BABYLON.Vector3(-1.2888, 0.375, -0.525), new BABYLON.Vector3(1.2888, 0.375, 0.1725)], // Cushions
                    [new BABYLON.Vector3(-1.4808, 0.675, -0.54), new BABYLON.Vector3(-1.2888, 0.675, 0.1875)], // Left arm
                    [new BABYLON.Vector3(1.2888, 0.675, -0.54), new BABYLON.Vector3(1.4808, 0.675, 0.1875)] // Right arm
                ]
            },
            "couch02": {
                usableArea: [
                    [new BABYLON.Vector3(-1.2888, 0.375, -0.525), new BABYLON.Vector3(1.2888, 0.375, 0.1725)],
                    [new BABYLON.Vector3(-1.4808, 0.675, -0.54), new BABYLON.Vector3(-1.2888, 0.675, 0.1875)],
                    [new BABYLON.Vector3(1.2888, 0.675, -0.54), new BABYLON.Vector3(1.4808, 0.675, 0.1875)]
                ]
            },
            "lovesea01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.82005, 0.375, -0.525), new BABYLON.Vector3(0.82005, 0.375, 0.1725)]
                ]
            },
            "mattress01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.575258, 0.195, -1.10144), new BABYLON.Vector3(0.575258, 0.195, 0.195)]
                ]
            },
            "bedMattressFrame01": {
                usableArea: [
                    [new BABYLON.Vector3(-0.575258, 0.375, -1.10144), new BABYLON.Vector3(0.575258, 0.375, 0.195)]
                ]
            },
            "flatScreenMonitor01": {
                videoMeshPosition: new BABYLON.Vector3(0, 0.490128, -0.0715),
                videoMeshWidth: 0.98,
                videoMeshHeight: 0.6250
            }
        };

        Game._finishedInitializing = false;
        Game._finishedConfiguring = false;

        Game.player = null;
        Game.playerController = null;
        Game.playerCell = null;
        Game.castRayTargetIntervalFunction = undefined;
        Game.castRayTargetInterval = 250;
        Game.pointerLockTimeoutVar = undefined;
        Game.previousSelectedMesh = undefined;
        Game.currentSelectedMesh = undefined;
        Game.playerPortraitStatsUpdateIntervalFunction = undefined;
        Game.playerPortraitStatsUpdateInterval = 100;

        Game.enableFirstPerson = true;
        Game.enableCameraAvatarRotation = true;

        Game.defaultPipeline = null;

        Game.highlightEnabled = false;
        Game.highlightLayer = undefined;
        Game.highlightedController = undefined;

        Game.xhr = new XMLHttpRequest();
        Game.parser = new DOMParser();
        Game.serializer = new XMLSerializer();
        Game.loadDefaultTextures();
        Game.loadDefaultMaterials();
        Game.loadDefaultMeshes();
        Game.loadDefaultSounds();
        Game.loadDefaultVideos();
        Game.loadDefaultItems();

        /*
            Which function handles the function of the key presses;
            controlerCharacter, controlMenu
         */
        Game.controls = AbstractControls;
        Game.updateMenuKeyboardDisplayKeys();
        Game.doEntityActionFunction = Game.doEntityAction;
        Game.actionAttackFunction = Game.actionAttack;
        Game.actionCloseFunction = Game.actionClose;
        Game.actionConsumeFunction = Game.actionConsume;
        Game.actionDropFunction = Game.actionDrop;
        Game.actionEquipFunction = Game.actionEquip;
        Game.actionHoldFunction = Game.actionHold;
        Game.actionLayFunction = Game.actionLay;
        Game.actionLookFunction = Game.actionLook;
        Game.actionOpenFunction = Game.actionOpen;
        Game.actionReadFunction = Game.actionRead;
        Game.actionReleaseFunction = Game.actionRelease;
        Game.actionSitFunction = Game.actionSit;
        Game.actionTakeFunction = Game.actionTake;
        Game.actionTalkFunction = Game.actionTalk;
        Game.actionUnequipFunction = Game.actionUnequip;
        Game.actionUseFunction = Game.actionUse;

        /**
         * @type {GameGUI} GameGUI; alternative is HtmlGUI
         */
        Game.gui = GameGUI;
        Game.gui.initialize();
        Game.initFreeCamera();
        Game.initPostProcessing();
        window.addEventListener("contextmenu", Game.controls.onContext);

        Game.currentTick = 0;
        Game.currentRound = 0;
        Game.currentTurn = 0;
        Game.gameTimeMultiplier = 10;
        Game.ticksPerTurn = 10;
        Game.turnsPerRound = 6;
        Game.turnTime = Game.ticksPerTurn * Game.gameTimeMultiplier;
        Game.roundTime = Game.turnTime * Game.turnsPerRound;
        Game.tickWorker = new Worker("resources/js/workers/tick.worker.js");
        Game.tickWorker.onmessage = function (e) {
            if (!e.data.hasOwnProperty("cmd")) {
                return 2;
            }
            switch (e.data.cmd) {
                case "sendInfo": {
                    // TODO: recalculate all scheduled events, or find a way so I don't have to (by using ticks, rounds, and turns) :v
                    Game.gameTimeMultiplier = e.data["msg"]["gameTimeMultiplier"];
                    Game.ticksPerTurn = e.data["msg"]["ticksPerTurn"];
                    Game.turnsPerRound = e.data["msg"]["turnsPerRound"];
                    Game.turnTime = e.data["msg"]["turnTime"];
                    Game.roundTime = e.data["msg"]["roundTime"];
                    break;
                }
                case "sendTimestamp": {
                    Game.currentTime = e.data["msg"];
                    if (Game.playerCell instanceof Cell) {
                        Game.playerCell.updateSkybox();
                    }
                    break;
                }
                case "entityToggler": {
                    Game.entityLocRotWorker.postMessage({ cmd: "toggleEntities" });
                    break;
                }
                case "triggerScheduledEffect": {
                    if (!Effect.has(e.data.msg["effectID"])) {
                        return 2;
                    }
                    if (!AbstractEntity.has(e.data.msg["abstractEntityID"])) {
                        return 2;
                    }
                    if (Game.debugMode) console.log(`Caught triggerScheduledEffect(${e.data.msg["effectID"]}, ${e.data.msg["abstractEntityID"]})`);
                    let effect = Effect.get(e.data.msg["effectID"]);
                    let abstractEntity = AbstractEntity.get(e.data.msg["abstractEntityID"]);
                    abstractEntity.applyEffect(effect);
                    break;
                }
                case "removeScheduledEffect": {
                    if (!Effect.has(e.data.msg["effectID"])) {
                        return 2;
                    }
                    if (!AbstractEntity.has(e.data.msg["abstractEntityID"])) {
                        return 2;
                    }
                    if (Game.debugMode) console.log(`Caught removeScheduledEffect(${e.data.msg["effectID"]}, ${e.data.msg["abstractEntityID"]})`);
                    let effect = Effect.get(e.data.msg["effectID"]);
                    let abstractEntity = AbstractEntity.get(e.data.msg["abstractEntityID"]);
                    abstractEntity.removeEffect(effect);
                    break;
                }
                case "triggerScheduledCommand": {
                    console.log(e.data.msg);
                    break;
                }
                case "tick": {
                    Game.currentTick = e.data.msg;
                    break;
                }
                case "turn": {
                    Game.currentTurn = e.data.msg;
                    break;
                }
                case "round": {
                    Game.currentRound = e.data.msg;
                    break;
                }
            }
        }
        Game.entityLocRotWorker = new Worker("resources/js/workers/entityLocationRotation.worker.js");
        Game.entityLocRotWorker.onmessage = function (e) {
            if (!e.data.hasOwnProperty(0) || !e.data.hasOwnProperty(1)) {
                return 2;
            }
            if (e.data[0] == 0) {
                if (!EntityController.has(e.data[1])) {
                    return 1;
                }
                EntityController.get(e.data[1]).setEnabled(true);
            }
            else if (e.data[0] == 1) {
                if (!EntityController.has(e.data[1])) {
                    return 1;
                }
                EntityController.get(e.data[1]).setEnabled(false);
            }
        }
        Game.gameTimeMultiplier = 10;
        Game.roundTime = 6;
        Game.turnTime = 60;
        Game._filesToLoad -= 1;
        Game.interfaceMode = InterfaceModeEnum.NONE;
        Game.previousInterfaceMode = null;
        let initEnd = new Date();
        console.log(`Time to initialize: ${initEnd.getTime() - initStart.getTime()}ms`);
        Game.initialized = true;
        Game.engine.runRenderLoop(Game._renderLoopFunction);
        Game.scene.registerBeforeRender(Game._beforeRenderFunction);
        Game.scene.registerAfterRender(Game._afterRenderFunction);
        Game.postInitialize();
    }
    static postInitialize() {
        if (Game.postInitialized) {
            return 0;
        }
        Game.postInitialized = true;
        Cell.createLimbo();
        Soul.createSoulless();
        let url = new URL(window.location.href);
        let urlMap = new Map(url.searchParams);
        urlMap.forEach(function(val, key) {
            switch(key) {
                case "tgm": {
                    Game.toggleGodMode();
                    break;
                }
            }
        });
        return 0;
    }
    static postLoad() {
        if (Game.postLoaded) {
            return 0;
        }
        Game.postLoaded = true;
        let url = new URL(window.location.href);
        let urlMap = new Map(url.searchParams);
        urlMap.forEach(function(val, key) {
            switch(key) {
                case "debugBook": {
                    GameGUI.hideCharacterChoiceMenu();
                    BookGameGUI.show();
                    setTimeout(function() {
                        BookGameGUI.updateWith(BookEntity.get("linedUp"), 1);
                    }, 1000);
                    break;
                }
                case "cell": {
                    let cellID = "limbo";
                    if (Cell.has(val)) {
                        cellID = val;
                    }
                    Game.loadCell(cellID);
                    Game.createPlayer("00000000-0000-0000-0000-000000000000", "Player", undefined, undefined, CreatureTypeEnum.HUMANOID, CreatureSubTypeEnum.FOX, SexEnum.MALE, 18, "foxM", "foxRed", new BABYLON.Vector3(3, 0, -17), undefined, undefined, {eyes:EyeEnum.CIRCLE, eyesColour:"green"});
                    GameGUI.hideCharacterChoiceMenu(true);
                    GameGUI.hideMenu(true);
                }
            }
        });
        return 0;
    }
    static _renderLoopFunction() {
        if (!Game.initialized) {
            return 1;
        }
        Game.scene.render();
        if (Game.loadingCell) {
            if (Game.hasBackloggedEntities || !Game.hasPlayerCell()) {
                Game.engine.displayLoadingUI();
                return 1;
            }
            else {
                Game.loadingCell = false;
                Game.engine.hideLoadingUI();
            }
        }
        if (!Game._finishedConfiguring) {
            if (Game._filesToLoad == 0) {
                if (!Game._finishedInitializing) {
                    if (Game.debugMode) console.log("Finished loading assets.");
                    Game.importDefaultMaterials();
                    Game.importDefaultMeshes();
                    Game.importEffects();
                    Game.importClasses();
                    Game.importItems();
                    Game.importConsumables();
                    Game.importBooks();
                    Game.importCosmetics();
                    Game.importFurniture();
                    Game.importDialogues();
                    Game.importCharacters();
                    Game.importCells();
                    Game._finishedInitializing = true;
                    Game.postInitialize();

                    Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                        Game.controls.onKeyDown(evt.sourceEvent);
                    }));
                    Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                        Game.controls.onKeyUp(evt.sourceEvent);
                    }));
                    Game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLongPressTrigger, function (evt) {
                        Game.controls.onLongPress(evt.sourceEvent);
                    }));
                    Game.scene.onPointerObservable.add((e) => {
                        switch (e.type) {
                            case BABYLON.PointerEventTypes.POINTERDOWN:
                                if (e.event.button == 0) {
                                    Game.controls.onMouseDown(e.event);
                                }
                                else if (e.event.button == 1) { }
                                else if (e.event.button == 2) { }
                                break;
                            case BABYLON.PointerEventTypes.POINTERUP:
                                if (e.event.button == 0) {
                                    Game.controls.onMouseUp(e.event);
                                }
                                else if (e.event.button == 1) { }
                                else if (e.event.button == 2) { }
                                break;
                            case BABYLON.PointerEventTypes.POINTERMOVE:
                                Game.controls.onMove(e.event);
                                break;
                            case BABYLON.PointerEventTypes.POINTERWHEEL:
                                Game.controls.onScroll(e.event);
                                break;
                            case BABYLON.PointerEventTypes.POINTERPICK:
                                break;
                            case BABYLON.PointerEventTypes.POINTERTAP:
                                if (e.event.button == 0) {
                                    Game.controls.onClick(e.event);
                                }
                                else if (e.event.button == 1) { }
                                else if (e.event.button == 2) {
                                    Game.controls.onContext(e.event);
                                }
                                break;
                            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                                break;
                        }
                    });
                }
                else {
                    Client.initialize();
                    Game.gui.resize();
                    Game._finishedConfiguring = true;
                }
            }
        }
        if (!Game.loadingCells && !Game.postLoaded) {
            Game.postLoad();
        }
    }
    static _beforeRenderFunction() {
        if (!Game.initialized) {
            return 1;
        }
        if (!(Game.player instanceof CharacterEntity) || !(Game.player.getController() instanceof CharacterController)) {
            return 1;
        }
        if (Game.camera instanceof BABYLON.Camera) {
            Game.camera.alpha = Game.Tools.moduloRadians(Game.camera.alpha);
            if (Game.camera.beta < 0.087) {
                Game.camera.beta = 0.087;
            }
            else if (Game.camera.beta > 3.054) {
                Game.camera.beta = 3.054;
            }
        }
        if (Game.player.controller.mesh instanceof BABYLON.AbstractMesh) {
            Game.player.controller.mesh.rotation.y = Game.Tools.moduloRadians(Game.player.controller.mesh.rotation.y);
        }
        for (let characterController in CharacterController.characterControllerList) {
            if (CharacterController.characterControllerList[characterController].animated) {
                CharacterController.characterControllerList[characterController].moveAV();
                if (CharacterController.characterControllerList[characterController].propertiesChanged) {
                    CharacterController.characterControllerList[characterController].updateProperties();
                }
            }
        }
        if (Game.defaultPipeline instanceof BABYLON.PostProcessRenderPipeline && Game.defaultPipeline.imageProcessing.vignetteEnabled) {
            Game.defaultPipeline.imageProcessing.vignetteWeight = 5 + (100 - (Game.player.getHealth() / Game.player.getMaxHealth() * 100));
        }
    }
    static _afterRenderFunction() {
        if (!Game.initialized) {
            return 1;
        }
        if (Game.hasBackloggedEntities) {
            Game.createBackloggedMeshes();
            Game.createBackloggedBoundingCollisions();
            Game.createBackloggedFurniture();
            Game.createBackloggedLighting();
            Game.createBackloggedDisplays();
            Game.createBackloggedDoors();
            Game.createBackloggedItems();
            Game.createBackloggedCharacters();
            Game.createBackloggedPlayer();
            Game.createBackloggedAttachments();
            if (Game._filesToLoad == 0) {
                Game.hasBackloggedEntities = false;
            }
        }
        if (Game.playerCell instanceof Cell && Game.playerCell.hasBackloggedAdditions) {
            Game.playerCell.createBackloggedAdditions();
        }
        if (Client.isOnline()) {
            if (Client.hasPlayerToCreate()) {
                Client.createBackloggedPlayers();
            }
            if (Client.hasPlayerToUpdate()) {
                Client.updateBackloggedPlayers();
            }
        }
    }

    static importScene(file, callback = undefined) {
        BABYLON.SceneLoader.ImportMesh(
            undefined,
            file.substr(0, file.lastIndexOf("/") + 1),
            file.substr(file.lastIndexOf("/") + 1),
            Game.scene,
            function (meshes, particleSystems, skeletons) {
                if (typeof callback == "function") {
                    callback(meshes);
                }
            }
        );
    }
    static importMeshes(file, meshIDs = undefined, callback = undefined) {
        if (file == undefined) {
            return 1;
        }
        if (Game.loadedFiles.has(file)) {
            return 0;
        }
        else {
            Game.loadedFiles.add(file);
        }
        if (Game.debugMode) console.log(`Running importMeshes(${file})`);
        let importedMeshes = {};
        Game._filesToLoad += 1;
        BABYLON.SceneLoader.ImportMesh(
            undefined, // meshNames
            file.substr(0, file.lastIndexOf("/") + 1), // rootUrl
            file.substr(file.lastIndexOf("/") + 1), // sceneFilename
            Game.scene, // scene
            function (meshes, particleSystems, skeletons) { // onSuccess
                for (let i = 0; i < meshes.length; i++) {
                    meshes[i].name = meshes[i].id;
                    meshes[i].setEnabled(false);
                    meshes[i].material = Game.loadedMaterials["default"];
                    importedMeshes[meshes[i].id] = meshes[i];
                    if (skeletons[i] != undefined) {
                        meshes[i].skeleon = skeletons[i];
                    }
                    Game.loadedMeshes[meshes[i].id] = meshes[i];
                    if (Game.debugMode) console.log("Importing mesh " + meshes[i].id + " from " + file + ".");
                }
                Game._filesToLoad -= 1;
                if (typeof callback == "function") {
                    callback(importedMeshes);
                }
            },
            function () { // onProgress
                if (Game.debugMode) console.log("Importing meshes from " + file + "...");
            },
            function () { // onError
                if (Game.debugMode) console.log("Error while importing meshes from " + file);
                Game._filesToLoad -= 1;
            }
        );
        return 0;
    }

    static initPhysics() {
        Game.physicsPlugin = new BABYLON.CannonJSPlugin();
        Game.scene.enablePhysics(Game.scene.gravity, Game.physicsPlugin);
        Game.physicsEnabled = true;
    }
    static initFollowCamera(offset = BABYLON.Vector3.Zero()) {
        if (Game.camera instanceof BABYLON.Camera) {
            Game.camera.dispose();
        }
        if (!(Game.player.getController() instanceof EntityController) || !(Game.player.getController().getBoneByName("FOCUS") instanceof BABYLON.Bone)) {
            return 1;
        }
        Game.camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Game.player.getController().getMesh().rotation.y - 4.69,
            Math.PI / 2.5,
            3,
            Game.player.getController().getBoneByName("FOCUS").getAbsolutePosition(Game.player.getController().getMesh()),
            Game.scene);
        Game.camera.collisionRadius = new BABYLON.Vector3(0.1, 0.1, 0.1);
        Game.camera.checkCollisions = true;
        Game.camera.wheelPrecision = 100;
        Game.camera.upperRadiusLimit = 2;
        Game.camera.lowerRadiusLimit = 0.1;
        Game.camera.angularSensibilityX = 3500;
        Game.camera.angularSensibilityY = 3500;
        Game.camera.keysLeft = [];
        Game.camera.keysRight = [];
        Game.camera.keysUp = [];
        Game.camera.keysDown = [];
        Game.camera.attachControl(Game.canvas, false);

        Game.camera.minZ = 0.001;
        Game.camera.lockedTarget = Game.player.getController().focus;
        Game.initPostProcessing();
    }
    static initFreeCamera(applyGravity = true) {
        if (Game.debugMode) console.log("Running initFreeCamera");
        if (Game.camera instanceof BABYLON.Camera) {
            Game.camera.dispose();
        }
        Game.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(2, 0.8, -20), Game.scene);
        Game.camera.radius = 2;
        Game.camera.minZ = 0.001;
        Game.camera.heightOffset = 1;
        Game.camera.rotationOffset = 0;
        Game.camera.speed = 0.25;
        Game.camera.attachControl(Game.canvas, true);
        if (Game.physicsEnabled) { }
        else {
            Game.camera.applyGravity = applyGravity;
            Game.camera.ellipsoid = new BABYLON.Vector3(0.1, 1.1, 0.1);
            Game.camera.checkCollisions = true;
        }
        Game.initPostProcessing();
    }
    static updateMenuKeyboardDisplayKeys() {
        if (Game.debugMode) console.log("Running Game::updateMenuKeyboardDisplayKeys()");
        if (Game.initialized && Game.gui.initialized) {
            Game.gui.setActionTooltipLetter();
        }
        return 0;
    }
    static initPostProcessing() {
        if (Game.defaultPipeline instanceof BABYLON.PostProcessRenderPipeline) {
            Game.defaultPipeline.dispose();
        }
        Game.defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", false, Game.scene, [Game.camera]);
        Game.defaultPipeline.samples = 2;
        Game.defaultPipeline.fxaaEnabled = true; // if true, breaks on Chrome 80.0.3987.132 with nvidia driver 440 on GNU/Linux
        Game.defaultPipeline.cameraFov = Game.camera.fov;
        Game.defaultPipeline.imageProcessing.vignetteEnabled = true;
        return 0;
    }
    static loadDefaultImages() {
        Game.loadSVG("missingTexture");
        Game.loadSVG("circularEye");
        Game.loadSVG("feralEye");
        Game.loadSVG("oblongEye");
        return 0;
    }
    static loadDefaultTextures() {
        Game.loadedTextures["default"] = new BABYLON.Texture(null, Game.scene);
        Game.loadTexture("missingTexture");
        return 0;
    }
    static loadDefaultMaterials() {
        Game.setLoadedMaterial("default", new BABYLON.StandardMaterial("default", Game.scene));
        Game.setLoadedMaterial("collisionMaterial", new BABYLON.Material("collisionMaterial", Game.scene));
        Game.setLoadedMaterial("missingMaterial", new BABYLON.StandardMaterial("missingMaterial", Game.scene));
        Game.setLoadedMaterial("loadingMaterial", new BABYLON.StandardMaterial("loadingMaterial", Game.scene));
        Game.setLoadedMaterial("missingMaterial", "missingTexture");
        Game.loadedMaterials["default"].specularColor.set(0, 0, 0);
        Game.loadedMaterials["missingMaterial"].specularColor.set(0, 0, 0);
        Game.loadedMaterials["loadingMaterial"].specularColor.set(0, 0, 0);
        Game.loadedMaterials["loadingMaterial"].diffuseColor.set(1, 0.85, 1);
        return 0;
    }
    static loadDefaultMeshes() {
        Game.setLoadedMesh("missingMesh", BABYLON.MeshBuilder.CreateBox("missingMesh", { height: 0.3, width: 0.3, depth: 0.3 }, Game.scene));
        Game.setLoadedMesh("loadingMesh", BABYLON.MeshBuilder.CreateSphere("loadingMesh", { diameter: 0.6 }, Game.scene));
        Game.setLoadedMesh("cameraFocus", BABYLON.MeshBuilder.CreateBox("cameraFocus", { height: 0.05, width: 0.05, depth: 0.05 }, Game.scene));
        Game.loadedMeshes["missingMesh"].material = Game.loadedMaterials["missingMaterial"];
        Game.loadedMeshes["missingMesh"].setEnabled(false);
        Game.loadedMeshes["loadingMesh"].setEnabled(false);
        Game.loadedMeshes["cameraFocus"].isVisible = false;
        Game.setMeshMaterial("missingMesh", "missingMaterial");
        return 0;
    }
    static loadDefaultSounds() {
        Game.setLoadedSound("missingSound", new BABYLON.Sound("missingSound", "resources/sounds/Spell Miss.mp3", Game.scene));
        Game.setLoadedSound("hit", new BABYLON.Sound("hit", "resources/sounds/Hit.mp3", Game.scene));
        Game.setLoadedSound("openDoor", new BABYLON.Sound("openDoor", "resources/sounds/Open Door.mp3", Game.scene));
        return 0;
    }
    static loadDefaultVideos() {
        Game.setLoadedVideo("missingVideo", new BABYLON.VideoTexture("missingVideo", ["resources/videos/missingVideo.webm", "resources/videos/missingVideo.mp4"], Game.scene, true, true, BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, {}));
        return 0;
    }
    /**
     * Loads and creates a BABYLON.Sound
     * @param {string} soundID Sound ID
     * @returns {number} Integer status code
     */
    static loadSound(soundID = "") {
        soundID = Tools.filterID(soundID);
        if (soundID.length == 0) {
            return 2;
        }
        if (Game.hasLoadedSound(soundID)) {
            return 0;
        }
        else if (Game.hasAvailableSound(soundID)) {
            let loadedSound = new BABYLON.Sound(soundID, Game.soundLocations[soundID], Game.scene);
            loadedSound.name = soundID;
            Game.setLoadedSound(soundID, loadedSound);
            return 0;
        }
        return 1;
    }
    static setLoadedVideo(videoID, videoTexture) {
        videoID = Tools.filterID(videoID);
        if (videoID.length == 0) {
            return 2;
        }
        if (!(videoTexture instanceof BABYLON.VideoTexture)) {
            return 2;
        }
        Game.loadedVideos[videoID] = videoTexture;
        return 0;
    }
    static getLoadedVideo(videoID) {
        if (!Game.hasLoadedVideo(videoID) && Game.hasAvailableVideo(videoID)) {
            Game.loadVideo(videoID);
        }
        if (!Game.hasLoadedVideo(videoID)) {
            return 2;
        }
        return Game.loadedVideos[videoID];
    }
    static hasAvailableVideo(videoID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.videoLocations.hasOwnProperty(videoID);
    }
    static hasLoadedVideo(videoID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.loadedVideos.hasOwnProperty(videoID);
    }
    static hasVideo(videoID) {
        if (!Game.initialized) {
            return false;
        }
        if (Game.hasLoadedVideo(videoID)) {
            return true;
        }
        else if (Game.hasAvailableVideo(videoID)) {
            Game.loadVideo(videoID);
            return true;
        }
        return false;
    }
    static addVideo(videoID, location) {
        if (!Game.hasVideo(videoID)) {
            return 2;
        }
        Game.videoLocations[videoID] = location;
        return 0;
    }
    static getVideo(videoID) {
        if (Game.hasLoadedVideo(videoID)) {
            return Game.loadedVideos[videoID];
        }
        else if (Game.hasAvailableVideo(videoID)) {
            Game.loadVideo(videoID);
            return Game.loadedVideos["missingVideo"];
        }
        else {
            return Game.loadedVideos["missingVideo"];
        }
    }
    static loadVideo(videoID = "") {
        videoID = Tools.filterID(videoID);
        if (videoID.length == 0) {
            return 2;
        }
        if (Game.hasLoadedVideo(videoID)) {
            return 0;
        }
        else if (Game.hasAvailableVideo(videoID)) {
            // TODO: commented out until VideoTexture.clone() returns a VideoTexture instead of a Texture
            /*let loadedVideo = new BABYLON.VideoTexture(videoID, Game.videoLocations[videoID], Game.scene);
            loadedVideo.name = videoID;
            Game.setLoadedVideo(videoID, loadedVideo);*/
            return 0;
        }
        return 1;
    }
    static createVideo(id = "", videoID = "", width = 1.0, height = 1.0) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        videoID = Tools.filterID(videoID);
        if (!Game.hasAvailableVideo(videoID)) {
            return 1;
        }
        let videoTexture = Game.cloneVideo(videoID);
        if (!(videoTexture instanceof BABYLON.VideoTexture)) {
            return 2;
        }
        let videoMaterial = new BABYLON.StandardMaterial(id.concat("Material"), Game.scene);
        videoMaterial.name = id.concat("Material");
        videoMaterial.diffuseTexture = videoTexture;
        videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        let videoMesh = BABYLON.MeshBuilder.CreatePlane(id.concat("Mesh"), { "width": width, "height": height }, Game.scene);
        videoMesh.name = id.concat("Mesh");
        videoMesh.material = videoMaterial;
        return videoMesh;
    }
    static cloneVideo(videoID = "") {
        if (!Game.hasAvailableVideo(videoID)) {
            return 1;
        }
        let videoTexture = new BABYLON.VideoTexture(videoID, Game.videoLocations[videoID], Game.scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE, { autoplay: false, autoUpdateTexture: true, loop: true });
        Game.setVideoClone(videoID, videoTexture);
        return videoTexture;
    }
    static setVideoClone(videoID = "", videoTextureClone) {
        if (!Game.videoClones.hasOwnProperty(videoID)) {
            Game.videoClones[videoID] = new Array();
        }
        videoTextureClone.name = videoID;
        Game.videoClones[videoID].push(videoTextureClone);
        return 0;
    }
    static removeVideoClone(videoTextureClone) {
        if (!(videoTextureClone instanceof BABYLON.VideoTexture)) {
            return 2;
        }
        if (!Game.videoClones.hasOwnProperty(videoID)) {
            return 1;
        }
        Game.videoClones[videoTextureClone.name].some((videoTexture) => {
            if (videoTextureClone.uid == videoTexture.uid) {
                Game.videoClones[videoTextureClone.name].remove(videoTextureClone);
                return true;
            }
        });
        return 0;
    }
    /**
     * Loads and creates an XML(SVG)Document
     * @param {string} imageID Image ID to load, and set the new XML(SVG)Document to
     * @returns {number} Integer status code
     */
    static loadSVG(imageID) {
        Game.xhr.open("GET", Game.textureLocations[imageID], true);
        Game.xhr.overrideMimeType("image/svg+xml");
        Game.xhr.onload = (e) => {
            if (e.target.status == 200) {
                Game.loadedSVGDocuments[imageID] = Game.parser.parseFromString(e.target.response, "image/svg+xml");
            }
            else {
                Game.textureLocations[imageID] = Game.textureLocations["missingTexture"];
            }
        };
        Game.xhr.onerror = (e) => {
            if (e.target.status == 404) {
                Game.textureLocations[imageID] = Game.textureLocations["missingTexture"];
            }
        };
        Game.xhr.send();
        return 0;
    }
    /**
     * Modifies a given SVG Document, by ID, and create an IMG
     * @param {string} imageID SVG Document ID
     * @param {string} newImageID new Image ID
     * @param {object} elementStyles eg. {iris:{background:green}, sclera:{background:#fff}}
     * @returns {SVGElement}
     */
    static modifySVG(imageID, newImageID, elementStyles) {
        if (!Game.loadedSVGDocuments.hasOwnProperty(imageID)) {
            return 2;
        }
        let newSVGDocument = Game.loadedSVGDocuments[imageID].cloneNode(true);
        for (let element in elementStyles) {
            if (newSVGDocument.hasChildNodes(element)) {
                for (let style in elementStyles[element]) {
                    newSVGDocument.getElementById(element).style.setProperty(style, elementStyles[element][style]);
                }
            }
        }
        let markup = Game.serializer.serializeToString(newSVGDocument);
        let newImage = new Image();
        newImage.src = 'data:image/svg+xml,' + encodeURIComponent(markup);
        Game.loadedImages[newImageID] = newImage;
        return newImage;
    }
    /**
     * Loads and creates a BABYLON.Texture
     * @param {string} textureID Texture ID
     * @param {object} options Options
     * @returns {number} Integer status code
     */
    static loadTexture(textureID = "", options = {}) {
        textureID = Tools.filterID(textureID);
        if (textureID.length == 0) {
            return 2;
        }
        if (Game.hasLoadedTexture(textureID)) {
            return 0;
        }
        else if (Game.hasAvailableTexture(textureID)) {
            let loadedTexture = new BABYLON.Texture(Game.textureLocations[textureID], Game.scene);
            loadedTexture.name = textureID;
            if (options.hasOwnProperty("hasAlpha")) {
                loadedTexture.hasAlpha = options["hasAlpha"] == true;
            }
            Game.setLoadedTexture(textureID, loadedTexture);
            return 0;
        }
        return 2;
    }
    /**
     * Loads and creates a BABYLON.Material
     * @param {string} materialID Material ID
     * @param {string} diffuseTextureID Texture ID for diffuse texture
     * @param {string} bumpTextureID Texture ID for bump/normal map
     * @param {object} options Options
     * @returns {number} Integer status code
     */
    static loadMaterial(materialID = "", diffuseTextureID = "", bumpTextureID = "", options = {}) {
        materialID = Tools.filterID(materialID);
        if (materialID.length == 0) {
            return 2;
        }
        diffuseTextureID = Tools.filterID(diffuseTextureID);
        if (diffuseTextureID.length > 0 && Game.hasAvailableTexture(diffuseTextureID) && !Game.hasLoadedTexture(diffuseTextureID)) {
            Game.loadTexture(diffuseTextureID);
        }
        else if (Game.hasAvailableTexture(materialID)) {
            diffuseTextureID = materialID;
        }
        else {
            diffuseTextureID = "missingTexture";
        }
        bumpTextureID = Tools.filterID(bumpTextureID);
        if (bumpTextureID.length > 0 && Game.hasAvailableTexture(bumpTextureID) && !Game.hasLoadedTexture(bumpTextureID)) {
            Game.loadTexture(bumpTextureID);
        }
        let loadedMaterial = new BABYLON.StandardMaterial(materialID)
        loadedMaterial.name = materialID;
        loadedMaterial.diffuseTexture = Game.getLoadedTexture(diffuseTextureID);
        if (Game.hasLoadedTexture(bumpTextureID)) {
            loadedMaterial.bumpTexture = Game.getLoadedTexture(bumpTextureID);
        }
        loadedMaterial.specularColor.set(0, 0, 0);
        if (typeof options == "object") {
            if (options.hasOwnProperty("backFaceCulling")) {
                loadedMaterial.backFaceCulling = Game.getLoadedTexture(options["backFaceCulling"]);
            }
            if (options.hasOwnProperty("opacityTexture")) {
                loadedMaterial.opacityTexture = Game.getLoadedTexture(options["opacityTexture"]);
            }
            if (options.hasOwnProperty("specularTexture")) {
                loadedMaterial.specularTexture = Game.getLoadedTexture(options["specularTexture"]);
            }
            if (options.hasOwnProperty("distortionTexture")) {
                loadedMaterial.distortionTexture = Game.getLoadedTexture(options["distortionTexture"]);
            }
            if (options.hasOwnProperty("specularColor")) {
                loadedMaterial.specularColor.copyFrom(options["specularColor"]);
            }
        }
        Game.setLoadedMaterial(materialID, loadedMaterial);
        return 0;
    }
    /**
     * 
     * @param {string} materialID Material ID
     * @param {string} replacementMaterialID Material ID
     * @returns {number} Integer status code
     */
    static changeMaterial(materialID, replacementMaterialID) {
        materialID = Game.Tools.filterID(materialID);
        if (!Game.hasMaterial(materialID)) {
            return 1;
        }
        replacementMaterialID = Game.Tools.filterID(replacementMaterialID);
        if (Game.hasMaterial(replacementMaterialID)) {
            Game.loadMaterial(replacementMaterialID);
        }
        else {
            return 2;
        }
        let material = Game.getLoadedMaterial(materialID);
        let replacementMaterial = Game.getLoadedMaterial(replacementMaterialID);
        for (let meshID in Game.meshMaterialMeshes) {
            if (Game.meshMaterialMeshes[meshID].hasOwnProperty(materialID)) {
                if (!Game.meshMaterialMeshes[meshID].hasOwnProperty(replacementMaterialID)) {
                    Game.meshMaterialMeshes[meshID][replacementMaterialID] = {};
                }
                for (let childMeshID in Game.meshMaterialMeshes[meshID][materialID]) {
                    if (Game.meshMaterialMeshes[meshID][materialID][childMeshID] instanceof BABYLON.InstancedMesh) {
                        Game.meshMaterialMeshes[meshID][materialID][childMeshID].sourceMesh.material = replacementMaterial;
                    }
                    else {
                        Game.meshMaterialMeshes[meshID][materialID][childMeshID].material = replacementMaterial;
                    }
                    Game.meshMaterialMeshes[meshID][replacementMaterialID][childMeshID] = Game.meshMaterialMeshes[meshID][materialID][childMeshID];
                    delete Game.meshMaterialMeshes[meshID][materialID][childMeshID];
                }
                delete Game.meshMaterialMeshes[meshID][materialID];
            }
        }
        for (let meshID in Game.clonedMeshes) {
            if (Game.clonedMeshes[meshID].material === material) {
                Game.clonedMeshes[meshID].material = replacementMaterial;
            }
        }
        return 0;
    }
    /**
     * 
     * @param {string} materialID Material ID
     * @returns {number} Integer status code
     */
    static unloadMaterial(materialID) {
        materialID = Game.Tools.filterID(materialID);
        if (!Game.hasLoadedMaterial(materialID)) {
            return 1;
        }
        Game.changeMaterial(materialID, "missingMaterial");
        let material = Game.loadedMaterials[materialID];
        delete Game.loadedMaterials[materialID];
        material.dispose();
        return 0;
    }
    /**
     * Loads and create a BABYLON.Mesh
     * @param {string} meshID Mesh ID
     * @returns {number} Integer status code
     */
    static loadMesh(meshID) {
        meshID = Tools.filterID(meshID);
        if (meshID.length == 0) {
            return 2;
        }
        if (Game.hasLoadedMesh(meshID)) {
            return 0;
        }
        else if (Game.hasAvailableMesh(meshID)) {
            if (Game.debugMode) console.log(`Running Game::loadMesh(${meshID})`);
            switch (meshID) {
                case "aardwolfM":
                case "aardwolfF":
                case "foxM":
                case "foxF":
                case "foxSkeletonN": {
                    Game.importMeshes("resources/meshes/hitboxes/canine.babylon");
                    break;
                }
                case "missingMesh":
                case "loadingMesh":
                case "cameraFocus": {
                    return 1;
                    break;
                }
            }
            Game.importMeshes(Game.meshLocations[meshID]);
            return 1;
        }
        return 2;
    }
    static setLoadedMesh(meshID, mesh, options = undefined) {
        meshID = Tools.filterID(meshID);
        if (meshID.length == 0) {
            return 2;
        }
        if (!(mesh instanceof BABYLON.Mesh)) {
            return 2;
        }
        mesh.isVisible = false;
        mesh.setEnabled(false);
        Game.loadedMeshes[meshID] = mesh;
        return 0;
    }
    static getLoadedMesh(meshID) {
        if (!Game.hasLoadedMesh(meshID) && Game.hasAvailableMesh(meshID)) {
            Game.loadMesh(meshID);
        }
        if (!Game.hasLoadedMesh(meshID)) {
            return 2;
        }
        return Game.loadedMeshes[meshID];
    }
    static updateLoadedMesh(meshID, options) {
        meshID = Tools.filterID(meshID);
        if (meshID.length == 0) {
            return 2;
        }
        if (!Game.loadedMeshes.hasOwnProperty(meshID)) {
            return 2;
        }
        if (!(Game.loadedMeshes[meshID] instanceof BABYLON.Mesh)) {
            return 2;
        }
        let loadedMesh = Game.loadedMeshes[meshID];
        if (typeof options == "object") {
            if (options.hasOwnProperty("billboardMode")) {
                loadedMesh.billboardMode = options["billboardMode"];
            }
            if (options.hasOwnProperty("material")) {
                if (options["material"] instanceof BABYLON.Material) {
                    loadedMesh.material = options["material"];
                }
                else if (Game.hasLoadedMaterial(options["material"])) {
                    loadedMesh.material = Game.getLoadedMaterial(options["material"]);
                }
                else if (Game.hasAvailableMaterial(options["material"])) {
                    Game.loadMaterial(options["material"]);
                    loadedMesh.material = Game.getLoadedMaterial(options["material"]);
                }
            }
        }
        return 0;
    }
    static setLoadedSound(soundID, sound) {
        soundID = Tools.filterID(soundID);
        if (soundID.length == 0) {
            return 2;
        }
        if (!(sound instanceof BABYLON.Sound)) {
            return 2;
        }
        Game.loadedSounds[soundID] = sound;
        return 0;
    }
    static getLoadedSound(soundID) {
        if (!Game.hasLoadedSound(soundID) && Game.hasAvailableSound(soundID)) {
            Game.loadSound(soundID);
        }
        if (!Game.hasLoadedSound(soundID)) {
            return 2;
        }
        return Game.loadedSounds[soundID];
    }
    static setLoadedTexture(textureID, texture) {
        textureID = Tools.filterID(textureID);
        if (textureID.length == 0) {
            return 2;
        }
        if (!(texture instanceof BABYLON.Texture)) {
            return 2;
        }
        Game.loadedTextures[textureID] = texture;
        return 0;
    }
    static getLoadedTexture(textureID) {
        if (!Game.hasLoadedTexture(textureID) && Game.hasAvailableTexture(textureID)) {
            Game.loadTexture(textureID);
        }
        if (!Game.hasLoadedTexture(textureID)) {
            return 2;
        }
        return Game.loadedTextures[textureID];
    }
    static setLoadedMaterial(materialID, material, options) {
        materialID = Tools.filterID(materialID);
        if (materialID.length == 0) {
            return 2;
        }
        if (!(material instanceof BABYLON.Material)) {
            return 2;
        }
        Game.loadedMaterials[materialID] = material;
        return 0;
    }
    static getLoadedMaterial(materialID) {
        return Game.loadedMaterials[materialID];
    }
    static updateLoadedMaterial(materialID, options) {
        materialID = Tools.filterID(materialID);
        if (materialID.length == 0) {
            return 2;
        }
        if (!Game.loadedMaterials.hasOwnProperty(materialID)) {
            return 2;
        }
        if (!(Game.loadedMaterials[materialID] instanceof BABYLON.Material)) {
            return 2;
        }
        let loadedMaterial = Game.loadedMaterials[materialID];
        if (typeof options == "object") {
            if (options.hasOwnProperty("diffuseTexture")) {
                loadedMaterial.diffuseTexture = Game.getLoadedTexture(options["diffuseTexture"]);
            }
            if (options.hasOwnProperty("opacityTexture")) {
                loadedMaterial.opacityTexture = Game.getLoadedTexture(options["opacityTexture"]);
            }
            if (options.hasOwnProperty("specularTexture")) {
                loadedMaterial.specularTexture = Game.getLoadedTexture(options["specularTexture"]);
            }
            if (options.hasOwnProperty("distortionTexture")) {
                loadedMaterial.distortionTexture = Game.getLoadedTexture(options["distortionTexture"]);
            }
            if (options.hasOwnProperty("speed")) {
                loadedMaterial.speed = options["speed"];
            }
            if (options.hasOwnProperty("specularColor")) {
                loadedMaterial.specularColor.copyFrom(options["specularColor"]);
            }
        }
        return 0;
    }
    static setMeshMaterial(mesh, material) {
        if (!(mesh instanceof BABYLON.Mesh) || !(material instanceof BABYLON.Material)) {
            if (Game.hasLoadedMesh(mesh) && Game.hasLoadedMaterial(material)) {
                mesh = Game.getLoadedMesh(mesh);
                material = Game.getLoadedMaterial(material);
            }
            else {
                return 2;
            }
        }
        if (Game.debugMode) console.log(`Running setMeshMaterial(${mesh.name}, ${material.name})`);
        if (!Game.loadedMeshMaterials.hasOwnProperty(mesh.name)) {
            Game.loadedMeshMaterials[mesh.name] = {};
        }
        Game.loadedMeshMaterials[mesh.name][material.name] = mesh;
        mesh.material = material;
        return 0;
    }
    static addClonedMesh(mesh, newMeshID = undefined) {
        newMeshID = Tools.filterID(newMeshID);
        if (!(mesh instanceof BABYLON.Mesh)) {
            return 2;
        }
        if (newMeshID.length == 0) {
            newMeshID = mesh.id;
        }
        Game.clonedMeshes[newMeshID] = mesh;
        return 0;
    }
    static getClonedMesh(meshID) {
        if (Game.hasClonedMesh(meshID)) {
            return Game.clonedMeshes[meshID];
        }
        return 2;
    }
    static hasClonedMesh(meshID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.clonedMeshes.hasOwnProperty(meshID);
    }
    static addInstancedMesh(mesh, newMeshID = undefined) {
        newMeshID = Tools.filterID(newMeshID);
        if (!(mesh instanceof BABYLON.InstancedMesh)) {
            return 2;
        }
        if (newMeshID.length == 0) {
            newMeshID = mesh.id;
        }
        Game.instancedMeshes[newMeshID] = mesh;
        return 0;
    }
    static getInstancedMesh(meshID) {
        if (Game.hasInstancedMesh(meshID)) {
            return Game.instancedMeshes[meshID];
        }
        return 2;
    }
    static hasInstancedMesh(meshID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.instancedMeshes.hasOwnProperty(meshID);
    }
    static addMeshMaterialMeshes(meshID, materialID, childMesh) {
        if (!Game.meshMaterialMeshes.hasOwnProperty(meshID)) {
            Game.meshMaterialMeshes[meshID] = {};
            Game.meshMaterialMeshes[meshID][materialID] = {};
        }
        else if (!Game.meshMaterialMeshes[meshID].hasOwnProperty(materialID)) {
            Game.meshMaterialMeshes[meshID][materialID] = {};
        }
        Game.meshMaterialMeshes[meshID][materialID][childMesh.id] = childMesh;
        return 0;
    }
    static removeMeshMaterialMeshes(meshID, materialID, childMeshID) {
        if (!Game.meshMaterialMeshes.hasOwnProperty(meshID)) {
            return 1;
        }
        if (!Game.meshMaterialMeshes[meshID].hasOwnProperty(materialID)) {
            return 1;
        }
        if (Game.debugMode) console.log(`Running Game::removeMeshMaterialMeshes(${meshID},${materialID},${childMeshID})`);
        if (Game.meshMaterialMeshes.hasOwnProperty(meshID)) {
            if (Game.meshMaterialMeshes[meshID].hasOwnProperty(materialID)) {
                if (Game.meshMaterialMeshes[meshID][materialID].hasOwnProperty(childMeshID)) {}
                else {
                    if (Game.debugMode) console.log(`${meshID}:${materialID}:${childMeshID} doesn't exist`);
                    return 1;
                }
            }
            else {
                if (Game.debugMode) console.log(`${meshID}:${materialID} doesn't exist`);
                return 1;
            }
        }
        else {
            if (Game.debugMode) console.log(`${meshID} doesn't exist`);
            return 1;
        }
        let mesh = Game.meshMaterialMeshes[meshID][materialID][childMeshID];
        if (mesh.hasController()) {
            mesh.controller.dispose();
        }
        if (mesh instanceof BABYLON.InstancedMesh) {
            delete Game.instancedMeshes[childMeshID];
        }
        else if (mesh instanceof BABYLON.Mesh) {
            delete Game.clonedMeshes[childMeshID];
        }
        else {
            return 2; // can't do anything :v
        }
        delete Game.meshMaterialMeshes[meshID][materialID][childMeshID];
        mesh.dispose();
        if (Object.keys(Game.meshMaterialMeshes[meshID][materialID]).length == 0) {
            delete Game.meshMaterialMeshes[meshID][materialID];
        }
        if (Object.keys(Game.meshMaterialMeshes[meshID]).length == 0) {
            delete Game.meshMaterialMeshes[meshID];
        }
        return 0;
    }
    static getMeshLocation(meshID) {
        if (Game.meshLocations.hasOwnProperty(meshID)) {
            return Game.meshLocations[meshID];
        }
        else {
            return 2;
        }
    }
    static getMesh(meshID) {
        if (meshID == undefined) {
            return 2;
        }
        else if (meshID instanceof BABYLON.AbstractMesh) {
            return meshID;
        }
        else if (typeof meshID == "string") {
            if (Game.hasLoadedMesh(meshID)) {
                return Game.loadedMeshes[meshID];
            }
            else if (Game.hasClonedMesh(meshID)) {
                return Game.clonedMeshes[meshID];
            }
            else if (Game.hasInstancedMesh(meshID)) {
                return Game.instancedMeshes[meshID];
            }
        }
        return 2;
    }
    static hasIcon(iconID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.iconLocations.hasOwnProperty(iconID);
    }
    static addIcon(iconID, location) {
        if (Game.hasIcon(iconID)) {
            return 2;
        }
        Game.iconLocations[iconID] = location;
        return 0;
    }
    static getIcon(iconID) {
        if (Game.hasIcon(iconID)) {
            return Game.iconLocations[iconID];
        }
        else {
            return Game.iconLocations["missingIcon"];
        }
    }
    static importScript(file, onload = null, onerror = null) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = file;
        if (typeof onload == "function") {
            script.onload = onload;
        }
        if (typeof onerror == "function") {
            script.onerror = onerror;
        }
        document.body.appendChild(script);
        return 0;
    }
    static importDefaultMaterials() {
        return Game.importScript("resources/js/materials.js");
    }
    static importDefaultMeshes() {
        return Game.importScript("resources/js/meshes.js");
    }
    static importEffects() {
        return Game.importScript("resources/js/effects.js");
    }
    static importClasses() {
        return Game.importScript("resources/js/classes.js");
    }
    static importConsumables() {
        return Game.importScript("resources/js/consumables.js");
    }
    static importDialogues() {
        return Game.importScript("resources/js/dialogues.js");
    }
    static importBooks() {
        return Game.importScript("resources/js/books.js");
    }
    static importCells() {
        return Game.importScript("resources/js/cells.js", function() {Game.loadingCells = false;});
    }
    /**
     * Creates a primitive wall for collision
     * @param {BABYLON.Vector3} start 
     * @param {BABYLON.Vector3} end 
     * @param {number} yRotation 
     */
    static createCollisionWall(start = BABYLON.Vector3.Zero(), end = BABYLON.Vector3.Zero(), yRotation = 0) {
        if (Game.debugMode) console.log("Running Game::createCollisionWallX");
        if (yRotation != 0 && Tools.isInt(yRotation)) {
            yRotation = BABYLON.Tools.ToRadians(yRotation);
        }
        let wallWidth = 0.125;
        if (start.x == end.x) {
            yRotation += BABYLON.Tools.ToRadians(90);
            wallWidth = Math.abs(end.z - start.z);
        }
        else if (start.z == end.z) {
            wallWidth = Math.abs(end.x - start.x);
        }
        else {
            return 1;
        }
        let xPosition = (start.x + end.x) / 2;
        let yPosition = (start.y + end.y) / 2;
        let zPosition = (start.z + end.z) / 2;
        let wall = BABYLON.MeshBuilder.CreateBox("wall", { "height": end.y - start.y, "depth": 0.125, "width": wallWidth }, Game.scene);
        wall.material = Game.loadedMaterials["collisionMaterial"];
        wall.position.set(xPosition, yPosition, zPosition);
        wall.rotation.y = yRotation;
        if (Game.physicsEnabled) {
            Game.assignBoxPhysicsToMesh(wall, { mass: 0 });
        }
        else {
            wall.checkCollisions = true;
        }
        return wall;
    }
    /**
     * Creates a primitive floor for collision
     * @param {BABYLON.Vector3} start 
     * @param {BABYLON.Vector3} end 
     * @param {number} yPosition 
     */
    static createCollisionPlane(start = { x: 0, z: 0 }, end = { x: 0, z: 0 }, yPosition = 0) {
        if (Game.debugMode) console.log("Running Game::createCollisionPlane");
        if (start instanceof BABYLON.AbstractMesh) {
            let xRadius = start.getBoundingInfo().boundingBox.extendSize.x * start.scaling.x;
            let zRadius = start.getBoundingInfo().boundingBox.extendSize.z * start.scaling.z;
            let newStart = { x: 0, z: 0 };
            newStart.x = start.position.x;
            newStart.z = start.position.z;
            end.x = start.position.x + xRadius * 2;
            end.z = start.position.z + zRadius * 2;
            yPosition = start.position.y;
            start = newStart;
        }
        let width = Math.abs(end.x - start.x);
        let depth = Math.abs(end.z - start.z);
        let xPosition = (start.x + end.x) / 2;
        yPosition = yPosition - 0.06125;
        let zPosition = (start.z + end.z) / 2;
        let floor = BABYLON.MeshBuilder.CreateBox("wall", { "height": 0.125, "depth": depth, "width": width }, Game.scene);
        floor.material = Game.loadedMaterials["collisionMaterial"];
        floor.position.set(xPosition, yPosition, zPosition);
        if (Game.physicsEnabled) {
            Game.assignBoxPhysicsToMesh(floor, { mass: 0 });
        }
        else {
            floor.checkCollisions = true;
        }
        return floor;
    }
    /**
     * Creates a primitive ramp for collision
     * @param {BABYLON.Vector3} start 
     * @param {BABYLON.Vector3} end 
     * @param {number} yPosition 
     */
    static createCollisionRamp(start = BABYLON.Vector3.Zero(), end = BABYLON.Vector3.Zero(), yRotation = 0) {
        if (typeof start != "object" || typeof end != "object" || !start.hasOwnProperty("z") || !end.hasOwnProperty("z")) {
            return 2;
        }
        if (start.x == end.x || start.y == end.y || start.z == end.z) {
            return 1;
        }
        if (Game.debugMode) console.log("Running Game::createCollisionRamp");
        if (start.y > end.y) {
            let tempVector = start;
            start = end;
            end = tempVector;
        }
        let oppositeSide = end.y - start.y;
        let width = 0;
        let adjacentSide = 0;
        if (end.z - start.z > end.x - start.x) { // Z-based ramp
            width = end.x - start.x;
            adjacentSide = end.z - start.z;
        }
        else { // X-based ramp
            width = end.z - start.z;
            adjacentSide = end.x - start.x;
        }
        let hypotenuseAngle = Math.acos(oppositeSide / adjacentSide);
        let hypotenuseSide = oppositeSide * (1 / Math.cos(hypotenuseAngle)); // height
        let ramp = BABYLON.MeshBuilder.CreateBox("ramp", { "height": hypotenuseSide, "depth": 0.125, "width": width }, Game.scene);
        ramp.position.set((end.x + start.x) / 2 - 1, (end.y + start.y) / 2 - 0.125 / 2, (end.z + start.z) / 2 - 1);
        ramp.rotation.set(hypotenuseAngle, BABYLON.Tools.ToRadians(yRotation), 0);
        ramp.material = Game.loadedMaterials["collisionMaterial"];
        if (Game.physicsEnabled) {
            Game.assignBoxPhysicsToMesh(ramp, { mass: 0 });
        }
        else {
            ramp.checkCollisions = true;
        }
        return ramp;
    }
    static assignPlanePhysicsToMesh(mesh) {
        if (Game.debugMode) console.log("Running Game::assignPlanePhysicsToMesh");
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, Game.scene);
        return 0;
    }
    static assignCylinderPhysicsToMesh(mesh, options) {
        if (Game.debugMode) console.log("Running Game::assignCylinderPhysicsToMesh");
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (typeof options != "object") {
            options = { mass: 0.8, restitution: 0.1 };
        }
        mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, options, Game.scene);
        return 0;
    }
    static assignBoxPhysicsToMesh(mesh, options) {
        if (Game.debugMode) console.log("Running Game::assignBoxPhysicsToMesh");
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (typeof options != "object") {
            options = { mass: 0.8, restitution: 0.1 };
        }
        mesh.physicsImposter = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, options, Game.scene);
        return 0;
    }
    static assignBoxPhysicsToBone(bone, options) {
        if (Game.debugMode) console.log("Running Game::assignBoxPhysicsToBone");
        if (!(bone instanceof BABYLON.Bone)) {
            return 2;
        }
        if (typeof options != "object") {
            options = { mass: 0.8, restitution: 0.1 };
        }
        // bone boxes :v idk yet
        return 2;
    }
    static assignBoxCollisionToMesh(mesh) {
        if (Game.debugMode) console.log("Running Game::assignBoxCollisionToMesh");
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        Game.assignBoundingBoxCollisionQueue.add(mesh);
        return 0;
    }
    static assignBoundingBoxCollisionToMesh(mesh) {
        if (Game.debugMode) console.log("Running Game::assignBoundingBoxCollisionToMesh");
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        Game.assignBoundingBoxCollisionQueue.delete(mesh);
        let collisionMesh = BABYLON.MeshBuilder.CreateBox(mesh.id + "-collisionBox", { width: mesh.getBoundingInfo().boundingBox.vectors[1].x - mesh.getBoundingInfo().boundingBox.vectors[0].x, height: mesh.getBoundingInfo().boundingBox.vectors[1].y - mesh.getBoundingInfo().boundingBox.vectors[0].y, depth: mesh.getBoundingInfo().boundingBox.vectors[1].z - mesh.getBoundingInfo().boundingBox.vectors[0].z }, Game.scene);
        collisionMesh.material = Game.loadedMaterials["collisionMaterial"];
        collisionMesh.checkCollisions = true;
        collisionMesh.setParent(mesh);
        let controller = collisionMesh.controller;
        if (controller instanceof DoorController) {
            if (mesh.collisionMesh.scaling.x > mesh.collisionMesh.scaling.z) {
                mesh.collisionMesh.scaling.z += mesh.collisionMesh.scaling.z * 0.1;
            }
            else {
                mesh.collisionMesh.scaling.x += mesh.collisionMesh.scaling.x * 0.2;
            }
        }
        collisionMesh.setParent(mesh);
        return 0;
    }
    static createBackloggedBoundingCollisions() {
        if (Game.assignBoundingBoxCollisionQueue.size > 0) {
            Game.assignBoundingBoxCollisionQueue.forEach(function (meshID) {
                Game.assignBoundingBoxCollisionToMesh(meshID);
            });
        }
        return 0;
    }
    static removeInstancedMesh(abstractMesh) {
        return Game.removeMesh(abstractMesh);
    }
    static removeClonedMesh(abstractMesh) {
        return Game.removeMesh(abstractMesh);
    }
    static removeMesh(abstractMesh) {
        if (abstractMesh instanceof BABYLON.AbstractMesh) {}
        else if (typeof abstractMesh == "string") {
            if (Game.clonedMeshes.hasOwnProperty(abstractMesh)) {
                abstractMesh = Game.clonedMeshes[abstractMesh];
            }
            else if (Game.instancedMeshes.hasOwnProperty(abstractMesh)) {
                abstractMesh = Game.instancedMeshes[abstractMesh];
            }
            else if (Game.loadedMeshes.hasOwnProperty(abstractMesh)) {
                abstractMesh = Game.loadedMeshes[abstractMesh];
            }
            else {
                return 2;
            }
        }
        else {
            return 2;
        }
        if (Game.debugMode) console.log(`Running Game::removeMesh(${abstractMesh.id}`);
        if (abstractMesh == EditControls.pickedMesh) {
            EditControls.reset();
        }
        else if (abstractMesh == EditControls.previousPickedMesh) {
            EditControls.previousPickedMesh = null;
        }
        if (abstractMesh.skeleton instanceof BABYLON.Skeleton) {
            if (abstractMesh.hasController()) {
                abstractMesh.controller.dispose();
            }
            if (Game.clonedMeshes.hasOwnProperty(abstractMesh.id)) {
                delete Game.clonedMeshes[abstractMesh.id];
            }
            abstractMesh.dispose();
        }
        else if (Game.meshMaterialMeshes.hasOwnProperty(abstractMesh.name)) {
            if (Game.meshMaterialMeshes[abstractMesh.name].hasOwnProperty(abstractMesh.material.name)) {
                Game.removeMeshMaterialMeshes(abstractMesh.name, abstractMesh.material.name, abstractMesh.id);
            }
        }
        return 0;
    }
    static removeMeshMaterial(meshID, materialID) {
        if (Game.hasMeshMaterial(meshID, materialID)) {
            for (let childMeshID in Game.meshMaterialMeshes[meshID][materialID]) {
                Game.removeMeshMaterialMeshes(meshID, materialID, childMeshID);
            }
            Game.loadedMeshMaterials[meshID][materialID].dispose();
            delete Game.loadedMeshMaterials[meshID][materialID];
            return 0;
        }
        return 1;
    }
    static getMeshMaterial(meshID, materialID) {
        if (Game.hasMeshMaterial(meshID, materialID)) {
            return Game.loadedMeshMaterials[meshID][materialID];
        }
        return 2;
    }
    static hasMeshMaterial(meshID, materialID) {
        if (!Game.initialized) {
            return false;
        }
        if (Game.loadedMeshMaterials.hasOwnProperty(meshID)) {
            return Game.loadedMeshMaterials[meshID].hasOwnProperty(materialID);
        }
        return false;
    }
    static hasAvailableMesh(meshID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.meshLocations.hasOwnProperty(meshID);
    }
    static hasLoadedMesh(meshID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.loadedMeshes.hasOwnProperty(meshID);
    }
    static hasMesh(meshID) {
        if (!Game.initialized) {
            return false;
        }
        if (Game.hasLoadedMesh(meshID)) {
            return true;
        }
        else if (Game.hasAvailableMesh(meshID)) {
            return true;
        }
        return false;
    }
    static hasAvailableSound(soundID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.soundLocations.hasOwnProperty(soundID);
    }
    static hasLoadedSound(soundID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.loadedSounds.hasOwnProperty(soundID);
    }
    static hasSound(soundID) {
        if (!Game.initialized) {
            return false;
        }
        if (Game.hasLoadedSound(soundID)) {
            return true;
        }
        else if (Game.hasAvailableSound(soundID)) {
            Game.loadSound(soundID);
            return true;
        }
        return false;
    }
    static addSound(soundID, location) {
        if (!Game.hasSound(soundID)) {
            return 2;
        }
        Game.soundLocations[soundID] = location;
        return 0;
    }
    static getSound(soundID) {
        if (Game.hasLoadedSound(soundID)) {
            return Game.loadedSounds[soundID];
        }
        else if (Game.hasAvailableSound(soundID)) {
            Game.loadSound(soundID);
            return Game.loadedSounds["missingSound"];
        }
        else {
            return Game.loadedSounds["missingSound"];
        }
    }
    static playSound(soundID) {
        if (!Game.hasSound(soundID)) {
            Game.loadedSounds["missingSound"].play()
            return 2;
        }
        soundID = Game.getSound(soundID);
        if (soundID instanceof BABYLON.Sound && soundID.name != "missingSound") {
            soundID.play();
        }
        return 0;
    }
    static hasAvailableTexture(textureID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.textureLocations.hasOwnProperty(textureID);
    }
    static hasLoadedTexture(textureID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.loadedTextures.hasOwnProperty(textureID);
    }
    static hasTexture(textureID) {
        if (!Game.initialized) {
            return false;
        }
        if (Game.hasLoadedTexture(textureID)) {
            return true;
        }
        else if (Game.hasAvailableTexture(textureID)) {
            Game.loadTexture(textureID);
            return true;
        }
        return false;
    }
    static hasAvailableMaterial(materialID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.hasLoadedMaterial(materialID);
    }
    static hasLoadedMaterial(materialID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.loadedMaterials.hasOwnProperty(materialID);
    }
    static hasMaterial(materialID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.hasLoadedMaterial(materialID);
    }
    /**
     * Filters the creation of a mesh from those stored in loadedMeshes
     * @param  {string} id New ID for BABYLON.Mesh and EntityController
     * @param  {string} meshID String ID of Mesh to create
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {array}
     */
    static filterCreateMesh(id = "", meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (Game.debugMode) console.log(`Running Game::filterCreateMesh(${id}, ${meshID}, ${materialID})`);
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
        }
        options["filtered"] = true;
        if (options.hasOwnProperty("checkCollisions")) {
            options["checkCollisions"] = options["checkCollisions"] == true;
        }
        else {
            options["checkCollisions"] = false;
        }
        if (options.hasOwnProperty("createClone")) {
            options["createClone"] = options["createClone"] == true;
        }
        else {
            options["createClone"] = false;
        }
        if (!Game.hasLoadedMaterial(materialID)) {
            if (!Game.hasAvailableTexture(materialID) && !Game.hasLoadedTexture(materialID)) {
                if (Game.debugMode) console.log(`\tMaterial ${materialID} doesn't exist`);
                materialID = "missingMaterial";
            }
        }
        if (!Game.hasAvailableMesh(meshID) && !Game.hasLoadedMesh(meshID)) {
            if (Game.debugMode) console.log(`\tMesh ${meshID} doesn't exist`);
            meshID = "missingMesh";
        }
        return [id, meshID, materialID, position, rotation, scaling, options];
    }
    /**
     * Creates a billboard mesh
     * @param  {string} id New ID for BABYLON.Mesh and EntityController
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {BABYLON.AbstractMesh|array|number} The created mesh
     */
    static createBillboard(id = "", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let mesh = BABYLON.Mesh.CreatePlane(id, 1, Game.scene);
        mesh.id = id;
        mesh.name = name;
        Game.setLoadedMesh(id, mesh);
        mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        mesh = Game.createMesh(id, id, materialID, position, rotation, scaling, options);
        mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        mesh.material.backFaceCulling = false;
        if (options["billboardMode"]) {
            mesh.billboardMode = options["billboardMode"];
        }
        return mesh;
    }
    /**
     * Creates a mesh from those stored in loadedMeshes
     * @param  {string} id New ID for BABYLON.Mesh and EntityController
     * @param  {string} meshID String ID of Mesh to create
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {BABYLON.AbstractMesh|array|number} The created mesh
     */
    static createMesh(id = "", meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateMesh(id, meshID, materialID, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, meshID, materialID, position, rotation, scaling] = filteredParameters;
        }
        if (!Game.hasLoadedMaterial(materialID)) {
            if (Game.hasAvailableTexture(materialID)) {
                if (!Game.hasLoadedTexture(materialID)) {
                    Game.loadTexture(materialID);
                }
                Game.loadMaterial(materialID, materialID);
            }
            else if (Game.hasLoadedTexture(materialID)) {
                Game.loadMaterial(materialID, materialID);
            }
            else {
                materialID = "missingMaterial";
            }
        }
        if (meshID == "craftsmanStairs") {
            Game.createMesh(id + "-CollisionMesh", "stairsCollision", "collisionMaterial", position, rotation, scaling, { checkCollisions: true });
            options["checkCollisions"] = false;
        }
        if (!Game.hasLoadedMesh(meshID)) {
            if (Game.debugMode) console.log(`\tMesh ${meshID} exists and will be loaded`);
            Game.addMeshToCreate(id, meshID, materialID, position, rotation, scaling, options);
            return [id, meshID, materialID, position, rotation, scaling, options];
        }
        if (Game.debugMode) console.log(`\tMesh ${meshID} exists and is loaded`);
        let mesh = Game.getLoadedMesh(meshID);
        let material = Game.getLoadedMaterial(materialID);
        if (mesh.skeleton instanceof BABYLON.Skeleton) {
            let meshSkeleton = mesh.skeleton.clone(id);
            mesh = mesh.clone(id);
            mesh.makeGeometryUnique();
            mesh.id = id;
            mesh.material = material;
            mesh.name = meshID;
            mesh.skeleton = meshSkeleton;
            Game.addClonedMesh(mesh, id);
            Game.setMeshMaterial(mesh, material);
        }
        else {
            if (!Game.loadedMeshMaterials.hasOwnProperty(meshID)) {
                Game.loadedMeshMaterials[meshID] = {};
            }
            if (!Game.loadedMeshMaterials[meshID].hasOwnProperty(materialID)) {
                mesh = mesh.clone(meshID + materialID);
                mesh.makeGeometryUnique();
                mesh.id = id;
                mesh.material = material;
                mesh.name = meshID;
                if (Game.debugMode) console.log("Creating master clone of " + meshID + " with " + materialID);
                mesh.setEnabled(false);
                mesh.position.set(0, -4095, 0);
                Game.setMeshMaterial(mesh, material);
            }
            if (options["createClone"]) {
                if (Game.debugMode) console.log("  Creating clone...");
                mesh = Game.loadedMeshMaterials[meshID][materialID].clone(id);
                mesh.id = id;
                mesh.material = material;
                mesh.name = meshID;
                Game.addClonedMesh(mesh, id);
                Game.addMeshMaterialMeshes(mesh.name, material.name, mesh);
            }
            else {
                if (Game.debugMode) console.log(`  Creating instance of Mesh:(${meshID}), Material:(${materialID})...`);
                mesh = Game.loadedMeshMaterials[meshID][materialID].createInstance(id);
                mesh.id = id;
                mesh.name = meshID;
                Game.addInstancedMesh(mesh, id);
                Game.addMeshMaterialMeshes(mesh.name, material.name, mesh);
            }
        }
        mesh.isVisible = true;
        mesh.position.copyFrom(position);
        mesh.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(rotation.x), BABYLON.Tools.ToRadians(rotation.y), BABYLON.Tools.ToRadians(rotation.z));
        mesh.scaling.copyFrom(scaling);
        mesh.setEnabled(true);
        if (options["checkCollisions"]) {
            if (Game.physicsEnabled) {
                Game.assignBoxPhysicsToMesh(mesh);
            }
            else {
                //Game.assignBoxCollisionToMesh(mesh);
                mesh.checkCollisions = true;
            }
        }
        if (options["isHitbox"]) {
            mesh.isHitbox = options["isHitbox"];
        }
        return mesh;
    }
    /**
     * 
     * @param {string} id 
     * @param {string} shape 
     * @param {number} diameter 
     * @param {number} height 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} [rotation] 
     * @param {BABYLON.Vector3} [scaling] 
     */
    static createAreaMesh(id = "", shape = "CUBE", diameter = 1.0, height = 1.0, depth = 1.0, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One()) {
        let mesh = null;
        switch (shape) {
            case "CYLINDER": {
                mesh = BABYLON.MeshBuilder.CreateCylinder(id, {"diameter": diameter, "height": height, "tessellation": 8}, Game.scene);
                break;
            }
            case "CONE": {
                mesh = BABYLON.MeshBuilder.CreateCylinder(id, {"diameterTop": 0, "diameterBottom": diameter, "height": height, "tessellation": 8}, Game.scene);
                break;
            }
            case "SPHERE": {
                mesh = BABYLON.MeshBuilder.CreateSphere(id, {"diameter": diameter, "diameterY": height, "diameterZ": depth, "segments": 8}, Game.scene);
                break;
            }
            case "CUBE": {}
            default: {
                mesh = BABYLON.MeshBuilder.CreateBox(id, {"width": diameter, "height": height, "depth": depth}, Game.scene);
            }
        }

        let pivotAt = new BABYLON.Vector3(0, height / 2, 0);
        mesh.bakeTransformIntoVertices(BABYLON.Matrix.Translation(pivotAt.x, pivotAt.y, pivotAt.z));
        
        mesh.id = id;
        mesh.name = id;
        mesh.material = Game.loadedMaterials["collisionMaterial"];
        Game.setLoadedMesh(id, mesh);
        Game.setMeshMaterial(mesh, Game.loadedMaterials["collisionMaterial"]);
        if (position instanceof BABYLON.Vector3) {
            mesh.position.copyFrom(position);
        }
        if (rotation instanceof BABYLON.Vector3) {
            mesh.rotation.copyFrom(rotation);
        }
        if (scaling instanceof BABYLON.Vector3) {
            mesh.scaling.copyFrom(scaling);
        }
        mesh.isVisible = true;
        mesh.setEnabled(true);

        return mesh;
    }
    /**
     * Creates a mesh from those stored in loadedMeshes
     * @param  {string} meshIndexID New ID for BABYLON.Mesh and EntityController
     * @param  {string} meshID String ID of Mesh to create
     * @param  {string} [materialID] String ID of Material to apply to Mesh
     * @param  {BABYLON.Vector3} position Mesh position
     * @param  {BABYLON.Vector3} [rotation] Mesh rotation
     * @param  {BABYLON.Vector3} [scaling] Mesh scaling
     * @param  {object} [options] Options
     * @return {BABYLON.AbstractMesh} The created mesh
     */
    static createCollidableMesh(meshIndexID = undefined, meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (typeof options != "object") {
            options = {};
        }
        options["checkCollisions"] = true;
        return Game.createMesh(meshIndexID, meshID, materialID, position, rotation, scaling, options);
    }
    static addMeshToCreate(meshIndexID, meshID, materialID, position, rotation, scaling, options) {
        if (Game.hasMeshToCreate(meshIndexID)) {
            return true;
        }
        Game.loadMesh(meshID);
        Game.meshesToCreate[meshIndexID] = {
            0: meshIndexID,
            1: meshID,
            2: materialID,
            3: position,
            4: rotation,
            5: scaling,
            6: options
        };
        Game.meshesToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    static removeMeshToCreate(meshIndexID) {
        if (!Game.hasMeshToCreate(meshIndexID)) {
            return true;
        }
        delete Game.meshesToCreate[meshIndexID];
        Game.meshesToCreateCounter -= 1;
        return true;
    }
    static hasMeshToCreate(meshIndexID) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.meshesToCreateCounter != "object") {
            return true;
        }
        return Game.meshesToCreateCounter > 0 && Game.meshesToCreate.hasOwnProperty(meshIndexID);
    }
    static createBackloggedMeshes() {
        if (Game.meshesToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.meshesToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.meshesToCreate[i][1])) {
                Game.createMesh(
                    Game.meshesToCreate[i][0],
                    Game.meshesToCreate[i][1],
                    Game.meshesToCreate[i][2],
                    Game.meshesToCreate[i][3],
                    Game.meshesToCreate[i][4],
                    Game.meshesToCreate[i][5],
                    Game.meshesToCreate[i][6]
                );
                Game.removeMeshToCreate(i);
            }
        }
    }

    static updateEntityID(currentID, newID) {
        if (!Entity.has(currentID)) {
            return 1;
        }
        let entity = Entity.get(currentID);
        if (entity.hasController()) {
            entity.getController().setLocked(true);
            entity.getController().setEnabled(false);
        }
        entity.setLocked(true);
        entity.setEnabled(false);
        if (entity instanceof AbstractEntity) {
            AbstractEntity.remove(currentID);
            if (entity instanceof Entity) {
                Entity.remove(currentID);
                if (entity instanceof CharacterEntity) {
                    CharacterEntity.remove(currentID);
                    CharacterEntity.set(newID, entity);
                }
                else if (entity instanceof DoorEntity) {
                    DoorEntity.remove(currentID);
                    DoorEntity.set(newID, entity);
                }
                else if (entity instanceof ItemEntity) {
                    ItemEntity.remove(currentID);
                    ItemEntity.set(newID, entity);
                    if (entity instanceof EquipmentEntity) {
                        /*EquipmentEntity.remove(currentID);
                        EquipmentEntity.set(newID, entity);*/
                        if (entity instanceof ClothingEntity) {
                            ClothingEntity.remove(currentID);
                            ClothingEntity.set(newID, entity);
                        }
                        else if (entity instanceof WeaponEntity) {
                            WeaponEntity.remove(currentID);
                            WeaponEntity.set(newID, entity);
                        }
                    }
                    else if (entity instanceof KeyEntity) {
                        KeyEntity.remove(currentID);
                        KeyEntity.set(newID, entity);
                    }
                }
                else if (entity instanceof FurnitureEntity) {
                    FurnitureEntity.remove(currentID);
                    FurnitureEntity.set(newID, entity);
                    if (entity instanceof LightingEntity) {
                        LightingEntity.remove(currentID);
                        LightingEntity.set(newID, entity);
                    }
                }
                else if (entity instanceof Spell) {
                    Spell.remove(currentID);
                    Spell.set(newID, entity);
                }
                entity.setID(newID);
                Entity.set(newID, entity);
            }
            else if (entity instanceof InstancedEntity) {
                InstancedEntity.remove(currentID);
                if (entity instanceof InstancedFurnitureEntity) {
                    InstancedFurnitureEntity.remove(currentID);
                    InstancedFurnitureEntity.set(newID, entity);
                }
                else if (entity instanceof InstancedItemEntity) {
                    InstancedItemEntity.remove(currentID);
                    InstancedItemEntity.set(newID, entity);
                    if (entity instanceof InstancedEquipmentEntity) {
                        /*InstancedEquipmentEntity.remove(currentID);
                        InstancedEquipmentEntity.set(newID, entity);*/
                        if (entity instanceof InstancedClothingEntity) {
                            InstancedClothingEntity.remove(currentID);
                            InstancedClothingEntity.set(newID, entity);
                        }
                        else if (entity instanceof InstancedWeaponEntity) {
                            InstancedWeaponEntity.remove(currentID);
                            InstancedWeaponEntity.set(newID, entity);
                        }
                    }
                }
                entity.setID(newID);
                Entity.setInstance(newID, entity);
            }
            AbstractEntity.set(newID, entity);
        }
        else {
            return 2;
        }
        if (entity.hasController()) {
            let controller = entity.getController();
            let mesh = controller.getMesh();
            mesh.controller = null;
            EntityController.remove(controller.getID());
            if (controller instanceof CharacterController) {
                CharacterController.remove(controller.getID());
                CharacterController.set(newID, controller);
            }
            else if (controller instanceof DoorController) {
                DoorController.remove(controller.getID());
                DoorController.set(newID, controller);
            }
            else if (controller instanceof FurnitureController) {
                FurnitureController.remove(controller.getID());
                FurnitureController.set(newID, controller);
                if (controller instanceof LightingController) {
                    LightingController.remove(controller.getID());
                    LightingController.set(newID, controller);
                }
            }
            else if (controller instanceof ItemController) {
                ItemController.remove(controller.getID());
                ItemController.set(newID, controller);
            }
            controller.setID(newID);
            Entity.setController(newID, controller);
            mesh.controller = controller;
        }
        entity.setEnabled(true);
        entity.setLocked(false);
        if (entity.hasController()) {
            entity.getController().setEnabled(true);
            entity.getController().setLocked(false);
        }
        return 0;
    }

    /**
     * @module entityStages
     */
    /**
     * 
     * @memberof module:entityStages
     * @param {string} entityControllerID 
     * @param {number} stageIndex 
     */
    static addEntityStageToCreate(entityControllerID, stageIndex) {
        if (Game.hasEntityStageToCreate(entityControllerID, stageIndex)) {
            return true;
        }
        let meshID = "";
        let materialID = "";
        if (EntityController.hasOwnProperty(entityControllerID)) {
            let controller = EntityController.get(entityControllerID);
            meshID = controller.getMeshStage(stageIndex);
            materialID = controller.getMaterialStage(stageIndex);
            Game.loadMesh(meshID);
            if (!Game.hasLoadedMaterial(materialID)) {
                Game.loadMaterial(materialID);
            }
        }
        else {
            return false;
        }
        if (!Game.entityStagesToCreate.hasOwnProperty(entityControllerID)) {
            Game.entityStagesToCreate[entityControllerID] = {};
        }
        Game.entityStagesToCreate[entityControllerID][stageIndex] = {
            0: meshID,
            1: materialID
        };
        Game.entityStagesToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @param {string} entityControllerID 
     * @param {number} stageIndex 
     */
    static removeEntityStageToCreate(entityControllerID, stageIndex = 0) {
        if (!Game.hasEntityStageToCreate(entityControllerID, stageIndex)) {
            return true;
        }
        delete Game.entityStagesToCreate[entityControllerID][stageIndex][1];
        delete Game.entityStagesToCreate[entityControllerID][stageIndex][0];
        delete Game.entityStagesToCreate[entityControllerID][stageIndex];
        if (Object.keys(Game.entityStagesToCreate[entityControllerID]).length == 0) {
            delete Game.entityStagesToCreate[entityControllerID];
        }
        Game.entityStagesToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:entityStages
     * @param {string} entityControllerID 
     * @param {number} stageIndex 
     */
    static hasEntityStageToCreate(entityControllerID, stageIndex = 0) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.entityStagesToCreateCounter != "object") {
            return true;
        }
        return Game.entityStagesToCreateCounter > 0 && Game.entityStagesToCreate.hasOwnProperty(entityControllerID) && Game.entityStagesToCreate[entityControllerID].hasOwnProperty(stageIndex);
    }
    /**
     * 
     * @memberof module:entityStages
     */
    static createBackloggedEntityStages() {
        if (Game.entityStagesToCreateCounter == 0) {
            return true;
        }
        for (let entityControllerID in Game.entityStagesToCreate) {
            if (EntityController.has(entityControllerID)) {
                let entityController = EntityController.get(entityControllerID);
                for (let stageIndex in Game.entityStagesToCreate[entityControllerID]) {
                    let entry = Game.entityStagesToCreate[entityControllerID][stageIndex];
                    if (Game.loadedMeshes.hasOwnProperty(entry[0])) {
                        entityController.setMeshStage(stageIndex);
                        Game.removeEntityStageToCreate(entityControllerID, stageIndex);
                    }
                }
            }
        }
    }

    /**
     * @module furniture
     */
    /**
     * 
     * @memberof module:furniture
     */
    static importFurniture() {
        return Game.importScript("resources/js/furniture.js");
    }
    /**
     * 
     * @memberof module:furniture
     * @param {string} furnitureID 
     * @param {string} meshID 
     * @param {string} materialID 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} rotation 
     * @param {BABYLON.Vector3} scaling 
     * @param {object} options 
     */
    static createFurnitureMesh(furnitureID = undefined, meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: false, checkCollisions: true }) {
        if (Game.debugMode) console.log("Running Game::createFurnitureMesh");
        let instancedMesh = Game.createMesh(furnitureID, meshID, materialID, position, rotation, scaling, options);
        if (!(instancedMesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        return instancedMesh;
    }
    /**
     * 
     * @memberof module:furniture
     * @param {string} furnitureInstanceID 
     * @param {FurnitureInstance} furnitureInstance 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} rotation 
     * @param {BABYLON.Vector3} scaling 
     * @param {object} options 
     */
    static addFurnitureToCreate(furnitureInstanceID, furnitureInstance = undefined, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (Game.hasFurnitureToCreate(furnitureInstanceID)) {
            return true;
        }
        if (!(furnitureInstance instanceof InstancedFurnitureEntity) && InstancedFurnitureEntity.has(furnitureInstance)) {
            furnitureInstance = InstancedFurnitureEntity.get(furnitureInstance);
        }
        Game.loadMesh(furnitureInstance.getMeshID());
        Game.furnitureToCreate[furnitureInstanceID] = {
            0: furnitureInstanceID,
            1: furnitureInstance,
            2: position,
            3: rotation,
            4: scaling,
            5: options
        };
        Game.furnitureToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:furniture
     * @param {string} furnitureInstanceID 
     */
    static removeFurnitureToCreate(furnitureInstanceID) {
        if (!Game.hasFurnitureToCreate(furnitureInstanceID)) {
            return true;
        }
        delete Game.furnitureToCreate[furnitureInstanceID];
        Game.furnitureToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:furniture
     * @param {string} furnitureInstanceID 
     */
    static hasFurnitureToCreate(furnitureInstanceID) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.furnitureToCreateCounter != "object") {
            return true;
        }
        return Game.furnitureToCreateCounter > 0 && Game.furnitureToCreate.hasOwnProperty(furnitureInstanceID);
    }
    /**
     * 
     * @memberof module:furniture
     */
    static createBackloggedFurniture() {
        if (Game.furnitureToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.furnitureToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.furnitureToCreate[i][1].getMeshID())) {
                Game.createFurnitureInstance(
                    Game.furnitureToCreate[i][0],
                    Game.furnitureToCreate[i][1],
                    Game.furnitureToCreate[i][2],
                    Game.furnitureToCreate[i][3],
                    Game.furnitureToCreate[i][4],
                    Game.furnitureToCreate[i][5]
                );
                Game.removeFurnitureToCreate(i);
            }
        }
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
        let furnitureEntity = new FurnitureEntity(id, name, description, iconID, furnitureType);
        if (furnitureEntity instanceof FurnitureEntity) {
            furnitureEntity.setMeshID(meshID);
            furnitureEntity.setTextureID(textureID);
            furnitureEntity.setPrice(price);
            furnitureEntity.setWeight(weight);
            return furnitureEntity;
        }
        return 2;
    }
    /**
     * Filters the creation of a FurnitureController, FurnitureEntity, and BABYLON.InstancedMesh
     * @memberof module:furniture
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {FurnitureEntity} furnitureEntity Furniture entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {(array|number)} A FurnitureController or an integer status code
     */
    static filterCreateFurnitureInstance(id = "", furnitureEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: false, checkCollisions: true }) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (furnitureEntity instanceof FurnitureEntity) {
            furnitureEntity = furnitureEntity.createInstance(id);
        }
        else if (furnitureEntity instanceof InstancedFurnitureEntity) {
            furnitureEntity = furnitureEntity.clone(id);
        }
        else if (typeof furnitureEntity == "string" && FurnitureEntity.has(furnitureEntity)) {
            furnitureEntity = FurnitureEntity.get(furnitureEntity).createInstance(id);
        }
        else if (typeof furnitureEntity == "string" && InstancedFurnitureEntity.has(furnitureEntity)) {
            furnitureEntity = InstancedFurnitureEntity.get(furnitureEntity).clone(id);
        }
        else {
            return 2;
        }
        if (Game.debugMode) console.log(`Running Game::filterCreateFurnitureInstance(${id}, ${furnitureEntity.getID()})`);
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
        }
        options["filtered"] = true;
        return [id, furnitureEntity, position, rotation, scaling, options];
    }
    /**
     * Creates a FurnitureController, FurnitureEntity, and BABYLON.InstancedMesh
     * @memberof module:furniture
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {FurnitureEntity} furnitureEntity Furniture entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {(FurnitureController|number)} A FurnitureController or an integer status code
     */
    static createFurnitureInstance(id = "", furnitureEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: false, checkCollisions: true }) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateFurnitureInstance(id, furnitureEntity, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, furnitureEntity, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(furnitureEntity.getMeshID()))) {
            Game.loadMesh(furnitureEntity.getMeshID());
            Game.loadTexture(furnitureEntity.getTextureID());
            Game.loadMaterial(furnitureEntity.getTextureID()); // TODO: Work out a real system of materials :v
            Game.addFurnitureToCreate(id, furnitureEntity, position, rotation, scaling);
            return [id, furnitureEntity, position, rotation, scaling];
        }
        let loadedMesh = Game.createMesh(id, furnitureEntity.getMeshID(), furnitureEntity.getTextureID(), position, rotation, scaling, options);
        loadedMesh.checkCollisions = true;
        let furnitureController = new FurnitureController(id, loadedMesh, furnitureEntity);
        if (furnitureEntity.hasAvailableAction(ActionEnum.OPEN)) {
            if (furnitureEntity.hasAvailableAction(ActionEnum.CLOSE)) {
                furnitureEntity.addHiddenAvailableAction(ActionEnum.CLOSE);
            }
        }
        return furnitureController;
    }
    /**
     * Removes a FurnitureEntity, its FurnitureController, and its BABYLON.InstancedMesh
     * @memberof module:furniture
     * @param {(FurnitureController|string)} furnitureController A FurnitureController, or its string ID
     * @returns {number} Integer status code
     */
    static removeFurniture(furnitureController) {
        if (!(furnitureController instanceof FurnitureController)) {
            if (!FurnitureController.has(furnitureController)) {
                return 2;
            }
            furnitureController = FurnitureController.get(furnitureController);
        }
        let mesh = furnitureController.getMesh();
        furnitureController.entity.dispose();
        furnitureController.dispose();
        if (mesh instanceof BABYLON.InstancedMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }

    /**
     * @module doors
     * @memberof module:furniture
     */
    /**
     * 
     * @memberof module:doors
     */
    static addDoorToCreate(doorIndexID, name = "", to = "", meshID = "missingMesh", textureID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (Game.hasDoorsToCreate(doorIndexID)) {
            return true;
        }
        Game.loadMesh(meshID);
        Game.doorsToCreate[doorIndexID] = {
            0: doorIndexID,
            1: name,
            2: to,
            3: meshID,
            4: textureID,
            5: position,
            6: rotation,
            7: scaling,
            8: options
        };
        Game.doorsToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:doors
     */
    static removeDoorToCreate(doorIndexID) {
        if (!Game.hasDoorsToCreate(doorIndexID)) {
            return true;
        }
        delete Game.doorsToCreate[doorIndexID];
        Game.doorsToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:doors
     */
    static hasDoorsToCreate(doorIndexID) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.doorsToCreateCounter != "object") {
            return true;
        }
        return Game.doorsToCreateCounter > 0 && Game.doorsToCreate.hasOwnProperty(doorIndexID);
    }
    /**
     * 
     * @memberof module:doors
     */
    static createBackloggedDoors() {
        if (Game.doorsToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.doorsToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.doorsToCreate[i][3])) {
                Game.createDoor(
                    Game.doorsToCreate[i][0],
                    Game.doorsToCreate[i][1],
                    Game.doorsToCreate[i][2],
                    Game.doorsToCreate[i][3],
                    Game.doorsToCreate[i][4],
                    Game.doorsToCreate[i][5],
                    Game.doorsToCreate[i][6],
                    Game.doorsToCreate[i][7],
                    Game.doorsToCreate[i][8]
                );
                Game.removeDoorToCreate(i);
            }
        }
    }
    /**
     * Filters the creation of a DoorController, DoorEntity, and BABYLON.InstancedMesh
     * @memberof module:doors
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {string} [name] Name
     * @param  {object} [to] Future movement between cells
     * @param  {string} [meshID] Mesh ID
     * @param  {string} [materialID] Texture ID
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {array}
     */
    static filterCreateDoor(id = "", name = "Door", to = undefined, meshID = "door", materialID = "plainDoor", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { locked: false, key: null, opensInward: false, open: false, checkCollisions: true }) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (Game.debugMode) console.log(`Running Game::filterCreateDoor(${id}, ${meshID}, ${materialID})`);
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (!Game.hasLoadedMaterial(materialID)) {
            if (Game.hasAvailableTexture(materialID)) {
                if (!Game.hasLoadedTexture(materialID)) {
                    Game.loadTexture(materialID);
                }
                Game.loadMaterial(materialID, materialID);
            }
            else {
                materialID = "plainDoor";
            }
        }
        if (!Game.hasAvailableMesh(meshID)) {
            if (Game.debugMode) console.log(`\tMesh ${meshID} doesn't exist`);
            meshID = "door";
        }
        if (typeof options != "object") {
            options = {};
        }
        options["filtered"] = true;
        if (options.hasOwnProperty("locked") && options["locked"] == true) {
            options["locked"] = true;
        }
        else {
            options["locked"] = false;
        }
        if (options.hasOwnProperty("key")) {
            if (options["key"] instanceof ItemEntity) { }
            else if (ItemEntity.has(options["key"])) {
                options["key"] = ItemEntity.get(options["key"]);
            }
            else {
                options["key"] = null;
            }
        }
        else {
            options["key"] = null;
        }
        if (options.hasOwnProperty("opensInward") && options["opensInward"] == true) {
            options["opensInward"] = true;
        }
        else {
            options["opensInward"] = false;
        }
        if (options.hasOwnProperty("open") && options["open"] == true) {
            options["open"] = true;
        }
        else {
            options["open"] = false;
        }
        return [id, name, to, meshID, materialID, position, rotation, scaling, options];
    }
    /**
     * Creates a DoorController, DoorEntity, and BABYLON.InstancedMesh
     * @memberof module:doors
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {string} [name] Name
     * @param  {object} [to] Future movement between cells
     * @param  {string} [meshID] Mesh ID
     * @param  {string} [materialID] Texture ID
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scaling
     * @param  {object} [options] Options
     * @return {(EntityController|array)} A DoorController or an integer status code
     */
    static createDoor(id = "", name = "Door", to = undefined, meshID = "door", materialID = "plainDoor", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { locked: false, key: null, opensInward: false, open: false, checkCollisions: true }) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateDoor(id, name, to, meshID, materialID, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, name, to, meshID, materialID, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(meshID))) {
            Game.loadMesh(meshID);
            Game.addDoorToCreate(id, name, to, meshID, materialID, position, rotation, scaling, options);
            return [id, name, to, meshID, materialID, position, rotation, scaling, options];
        }
        let doorEntity = new DoorEntity(id, name, undefined, undefined, options["locked"], options["key"], options["opensInward"], options["open"]);
        let radius = Game.getMesh(meshID).getBoundingInfo().boundingBox.extendSize.x * scaling.x;
        let xPosition = radius * (Math.cos(rotation.y * Math.PI / 180) | 0);
        let yPosition = radius * (Math.sin(rotation.y * Math.PI / 180) | 0);
        let loadedMesh = Game.createMesh(id, meshID, materialID, position.add(new BABYLON.Vector3(xPosition, 0, -yPosition)), rotation, scaling, options);
        let doorController = new DoorController(id, loadedMesh, doorEntity);
        return doorController;
    }
    /**
     * Removes a DoorEntity, its DoorController, and its BABYLON.InstancedMesh
     * @memberof module:doors
     * @param {(DoorController|string)} doorController A DoorController, or its string ID
     * @returns {number} Integer status code
     */
    static removeDoor(doorController) {
        if (!(doorController instanceof DoorController)) {
            if (!DoorController.has(doorController)) {
                return 2;
            }
            doorController = Entity.getController(doorController);
        }
        let mesh = doorController.getMesh();
        doorController.entity.dispose();
        doorController.dispose();
        if (mesh instanceof BABYLON.InstancedMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }

    /**
     * @module displays
     * @memberof module:furniture
     */
    /**
     * 
     * @memberof module:displays
     */
    static addDisplayToCreate(displayIndexID, name = "", meshID = "missingMesh", materialID = "missingMaterial", videoID = "missingVideo", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { checkCollisions: true, videoMeshWidth: 0, videoMeshHeight: 0, videoMeshPosition: BABYLON.Vector3.Zero() }) {
        if (Game.hasDisplayToCreate(displayIndexID)) {
            return true;
        }
        Game.loadMesh(meshID);
        Game.displaysToCreate[displayIndexID] = {
            0: displayIndexID,
            1: name,
            2: meshID,
            3: materialID,
            4: videoID,
            5: position,
            6: rotation,
            7: scaling,
            8: options
        };
        Game.displaysToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:displays
     */
    static removeDisplayToCreate(displayIndexID) {
        if (!Game.hasDisplayToCreate(displayIndexID)) {
            return true;
        }
        delete Game.displaysToCreate[displayIndexID];
        Game.displaysToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:displays
     */
    static hasDisplayToCreate(displayIndexID) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.displaysToCreateCounter != "object") {
            return true;
        }
        return Game.displaysToCreateCounter > 0 && Game.displaysToCreate.hasOwnProperty(displayIndexID);
    }
    /**
     * 
     * @memberof module:displays
     */
    static createBackloggedDisplays() {
        if (Game.displaysToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.displaysToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.displaysToCreate[i][2])) {
                Game.createDisplay(
                    Game.displaysToCreate[i][0],
                    Game.displaysToCreate[i][1],
                    Game.displaysToCreate[i][2],
                    Game.displaysToCreate[i][3],
                    Game.displaysToCreate[i][4],
                    Game.displaysToCreate[i][5],
                    Game.displaysToCreate[i][6],
                    Game.displaysToCreate[i][7],
                    Game.displaysToCreate[i][8]
                );
                Game.removeDisplayToCreate(i);
            }
        }
    }
    /**
     * 
     * @memberof module:displays
     * @param {string} id 
     * @param {string} name 
     * @param {string} meshID 
     * @param {string} [materialID] 
     * @param {string} [videoID] 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} [rotation] 
     * @param {BABYLON.Vector3} [scaling] 
     * @param {object} [options] 
     * @returns {array}
     */
    static filterCreateDisplay(id = "", name = "", meshID, materialID = "missingMaterial", videoID = "missingVideo", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: true, checkCollisions: true, videoMeshWidth: 0, videoMeshHeight: 0, videoMeshPosition: BABYLON.Vector3.Zero() }) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (!Game.hasMesh(meshID)) {
            return 2;
        }
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
        }
        if (Game.meshProperties.hasOwnProperty(meshID)) {
            Object.assign(options, Game.meshProperties[meshID]);
        }
        options["filtered"] = true;
        return [id, name, meshID, materialID, videoID, position, rotation, scaling, options];
    }
    /**
     * 
     * @memberof module:displays
     * @param {string} id 
     * @param {string} name 
     * @param {string} meshID 
     * @param {string} [materialID] 
     * @param {string} [videoID] 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} [rotation] 
     * @param {BABYLON.Vector3} [scaling] 
     * @param {object} [options] 
     * @returns {DisplayController}
     */
    static createDisplay(id = "", name = "", meshID, materialID = "missingMaterial", videoID = "missingVideo", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: true, checkCollisions: true, videoMeshWidth: 1, videoMeshHeight: 0.75, videoMeshPosition: BABYLON.Vector3.Zero() }) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateDisplay(id, name, meshID, materialID, videoID, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, name, meshID, materialID, videoID, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(meshID))) {
            Game.loadMesh(meshID);
            Game.addDisplayToCreate(id, name, meshID, materialID, videoID, position, rotation, scaling, options);
            return [id, name, meshID, materialID, videoID, position, rotation, scaling, options];
        }
        let loadedMesh = Game.createMesh(id, meshID, materialID, position, rotation, scaling, options);
        let displayEntity = new DisplayEntity(id, name, undefined, undefined);
        let displayController = new DisplayController(id, loadedMesh, displayEntity, videoID, options["videoMeshWidth"], options["videoMeshHeight"], options["videoMeshPosition"]);
        return displayController;
    }
    /**
     * 
     * @memberof module:displays
     * @param {DisplayController} displayController 
     * @returns {number} Integer status code
     */
    static removeDisplay(displayController) {
        if (!(displayController instanceof DisplayController)) {
            if (!(DisplayController.has(displayController))) {
                return 2;
            }
            displayController = DisplayController.get(displayController);
        }
        let mesh = displayController.getMesh();
        displayController.entity.dispose();
        displayController.dispose();
        if (mesh instanceof BABYLON.InstancedMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }

    /**
     * 
     * @module mirrors
     * @memberof module:furniture
     */
    /**
     * 
     * @memberof module:mirrors
     * @param {string} id 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} rotation 
     * @param {BABYLON.Vector3} scaling 
     * @param {object} options 
     */
    static createMirror(id, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { width: 5, height: 5 }) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        //Creation of a glass plane
        let abstractMesh = BABYLON.MeshBuilder.CreatePlane(id, { width: options["width"], height: options["height"] }, Game.scene);
        abstractMesh.position.copyFrom(position);
        abstractMesh.rotation.copyFrom(rotation);
        abstractMesh.scaling.copyFrom(scaling);

        //Ensure working with new values for glass by computing and obtaining its worldMatrix
        abstractMesh.computeWorldMatrix(true);

        return Game.createMirrorFrom(abstractMesh, Game.scene.meshes, options);
    }
    /**
     * 
     * @memberof module:mirrors
     * @param {BABYLON.AbstractMesh} abstractMesh 
     * @param {array} renderList 
     * @param {object} options 
     */
    static createMirrorFrom(abstractMesh, renderList = [], options = {}) {
        if (abstractMesh instanceof BABYLON.AbstractMesh) { }
        else {
            return 2;
        }
        //Obtain normals for plane and assign one of them as the normal
        let glass_vertexData = abstractMesh.getVerticesData("normal");
        let glassNormal = new BABYLON.Vector3(glass_vertexData[0], glass_vertexData[1], glass_vertexData[2]);
        //Use worldMatrix to transform normal into its current value
        glassNormal = new BABYLON.Vector3.TransformNormal(glassNormal, abstractMesh.getWorldMatrix())

        //Create reflecting surface for mirror surface
        let reflector = new BABYLON.Plane.FromPositionAndNormal(abstractMesh.position, glassNormal.scale(-1));

        //Create the mirror material
        let mirrorMaterial = new BABYLON.StandardMaterial("mirror", Game.scene);
        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, Game.scene, true);
        mirrorMaterial.reflectionTexture.mirrorPlane = reflector;
        mirrorMaterial.reflectionTexture.renderList = renderList;
        mirrorMaterial.reflectionTexture.level = 1;

        abstractMesh.material = mirrorMaterial;

        return abstractMesh;
    }

    /**
     * @module lighting
     * @memberof module:furniture
     */
    /**
     * 
     * @memberof module:lighting
     */
    static addLightingToCreate(lightingIndexID, name = "", meshID = "missingMesh", textureID = "missingMaterial", lightingType = "", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { checkCollisions: true, lightPositionOffset: BABYLON.Vector3.Zero() }) {
        if (Game.hasLightingToCreate(lightingIndexID)) {
            return true;
        }
        Game.loadMesh(meshID);
        Game.lightingToCreate[lightingIndexID] = {
            0: lightingIndexID,
            1: name,
            2: meshID,
            3: textureID,
            4: lightingType,
            5: position,
            6: rotation,
            7: scaling,
            8: options
        };
        Game.lightingToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:lighting
     */
    static removeLightingToCreate(lightingIndexID) {
        if (!Game.hasLightingToCreate(lightingIndexID)) {
            return true;
        }
        delete Game.lightingToCreate[lightingIndexID];
        Game.lightingToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:lighting
     */
    static hasLightingToCreate(lightingIndexID) {
        if (!Game.initialized) {
            return false;
        }
        if (typeof Game.lightingToCreateCounter != "object") {
            return true;
        }
        return Game.lightingToCreateCounter > 0 && Game.lightingToCreate.hasOwnProperty(lightingIndexID);
    }
    /**
     * 
     * @memberof module:lighting
     */
    static createBackloggedLighting() {
        if (Game.lightingToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.lightingToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.lightingToCreate[i][2])) {
                Game.createLighting(
                    Game.lightingToCreate[i][0],
                    Game.lightingToCreate[i][1],
                    Game.lightingToCreate[i][2],
                    Game.lightingToCreate[i][3],
                    Game.lightingToCreate[i][4],
                    Game.lightingToCreate[i][5],
                    Game.lightingToCreate[i][6],
                    Game.lightingToCreate[i][7],
                    Game.lightingToCreate[i][8]
                );
                Game.removeLightingToCreate(i);
            }
        }
    }
    /**
     * Filters the creation of a LightingController, LightingEntity, and BABYLON.InstancedMesh
     * @memberof module:lighting
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} meshID Mesh ID
     * @param {string} [materialID] Texture ID
     * @param {number} [lightingType] IDK yet :v; TODO: this
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {array}
     */
    static filterCreateLighting(id = "", name = "", meshID, materialID, lightingType, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: true, checkCollisions: true, lightingPositionOffset: BABYLON.Vector3.Zero() }) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (!Game.hasMesh(meshID)) {
            return 2;
        }
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
            options["lightingPositionOffset"] = BABYLON.Vector3.Zero();
        }
        else if (!options.hasOwnProperty("lightingPositionOffset")) {
            options["lightingPositionOffset"] = BABYLON.Vector3.Zero();
        }
        options["filtered"] = true;
        return [id, name, meshID, materialID, lightingType, position, rotation, scaling, options];
    }
    /**
     * Creates a LightingController, LightingEntity, and BABYLON.InstancedMesh
     * @memberof module:lighting
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {string} name Name
     * @param {string} meshID Mesh ID
     * @param {string} [materialID] Texture ID
     * @param {number} [lightingType] IDK yet :v; TODO: this
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {(LightingController|array|number)} A LightingController or an integer status code
     */
    static createLighting(id = "", name = "", meshID, materialID, lightingType, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: true, checkCollisions: true, lightingPositionOffset: BABYLON.Vector3.Zero() }) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateLighting(id, name, meshID, materialID, lightingType, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, name, meshID, materialID, lightingType, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(meshID))) {
            Game.loadMesh(meshID);
            Game.addLightingToCreate(id, name, meshID, materialID, lightingType, position, rotation, scaling, options);
            return [id, name, meshID, materialID, lightingType, position, rotation, scaling, options];
        }
        let loadedMesh = Game.createMesh(id, meshID, materialID, position, rotation, scaling, options);
        let lightingEntity = new LightingEntity(id, name, undefined, undefined, lightingType);
        let lightingController = new LightingController(id, loadedMesh, lightingEntity, lightingType, options["lightingPositionOffset"]);
        lightingEntity.off(); // set because lighting is bad
        return lightingController;
    }
    /**
     * Removes a LightingEntity, its LightingController, and its BABYLON.InstancedMesh
     * @memberof module:lighting
     * @param {(LightingController|string)} lightingController A LightingController, or its string ID
     * @returns {number} Integer status code
     */
    static removeLighting(lightingController) {
        if (!(lightingController instanceof LightingController)) {
            if (!(LightingController.has(lightingController))) {
                return 2;
            }
            lightingController = LightingController.get(lightingController);
        }
        let mesh = lightingController.getMesh();
        lightingController.entity.dispose();
        lightingController.dispose();
        if (mesh instanceof BABYLON.InstancedMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }

    /**
     * @module cosmetics
     */
    /**
     * 
     * @memberof module:cosmetics
     */
    static importCosmetics() {
        return Game.importScript("resources/js/cosmetics.js");
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
     * @memberof module:cosmetics
     */
    static addAttachmentToCreate(attachmentIndexID, attachToController, meshID, materialID, bone, position, rotation, scaling, options) {
        if (!Game.hasMesh(meshID)) {
            return false;
        }
        if (Game.hasAttachmentToCreate(attachmentIndexID)) {
            return true;
        }
        Game.loadMesh(meshID);
        Game.attachmentsToCreate[attachmentIndexID] = {
            0: attachmentIndexID,
            1: attachToController,
            2: meshID,
            3: materialID,
            4: bone,
            5: position,
            6: rotation,
            7: scaling,
            8: options
        };
        Game.attachmentsToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * @memberof module:cosmetics
     */
    static removeAttachmentToCreate(attachmentIndexID) {
        if (!Game.hasAttachmentToCreate(attachmentIndexID)) {
            return true;
        }
        delete Game.attachmentsToCreate[attachmentIndexID];
        Game.attachmentsToCreateCounter -= 1;
        return true;
    }
    /**
     * @memberof module:cosmetics
     */
    static hasAttachmentToCreate(attachmentIndexID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.attachmentsToCreateCounter > 0 && Game.attachmentsToCreate.hasOwnProperty(attachmentIndexID);
    }
    /**
     * @memberof module:cosmetics
     */
    static createBackloggedAttachments() {
        if (Game.attachmentsToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.attachmentsToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.attachmentsToCreate[i][2])) {
                if (Game.attachmentsToCreate[i][1] instanceof CharacterController) {
                    Game.attachmentsToCreate[i][1].attachMeshIDToBone(
                        Game.attachmentsToCreate[i][2],
                        Game.attachmentsToCreate[i][3],
                        Game.attachmentsToCreate[i][4],
                        Game.attachmentsToCreate[i][5],
                        Game.attachmentsToCreate[i][6],
                        Game.attachmentsToCreate[i][7],
                        Game.attachmentsToCreate[i][8]
                    );
                }
                Game.removeAttachmentToCreate(i);
            }
        }
    }

    /**
     * @module items
     */
    /**
     * 
     * @memberof module:items
     */
    static loadDefaultItems() {
        Game.createItemEntity("genericItem", "Generic Item", "It's so perfectly generic.", "genericItemIcon", "missingMesh", "loadingMaterial", ItemEnum.GENERAL);
        return 0;
    }
    /**
     * 
     * @memberof module:items
     */
    static importItems() {
        return Game.importScript("resources/js/items.js");
    }
    /**
     * 
     * @memberof module:items
     * @param {string} itemID 
     * @param {string} meshID 
     * @param {string} materialID 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} rotation 
     * @param {BABYLON.Vector3} scaling 
     * @param {object} options 
     */
    static createItemMesh(itemID = undefined, meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: false, checkCollisions: true }) {
        if (Game.debugMode) console.log("Running Game::createItemMesh");
        let instancedMesh = Game.createMesh(itemID, meshID, materialID, position, rotation, scaling, options);
        if (!(instancedMesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (Game.physicsEnabled) {
            Game.assignBoxPhysicsToMesh(instancedMesh, options);
        }
        return instancedMesh;
    }

    /**
     * 
     * @memberof module:items
     */
    static addItemToCreate(itemIndexID, itemEntity = undefined, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (Game.hasItemToCreate(itemIndexID)) {
            return true;
        }
        Game.loadMesh(itemEntity.getMeshID());
        Game.itemsToCreate[itemIndexID] = {
            0: itemIndexID,
            1: itemEntity,
            2: position,
            3: rotation,
            4: scaling,
            5: options
        };
        Game.itemsToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:items
     */
    static removeItemToCreate(itemIndexID) {
        if (!Game.hasItemToCreate(itemIndexID)) {
            return true;
        }
        delete Game.itemsToCreate[itemIndexID];
        Game.itemsToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:items
     */
    static hasItemToCreate(itemIndexID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.itemsToCreateCounter > 0 && Game.itemsToCreate.hasOwnProperty(itemIndexID);
    }
    /**
     * 
     * @memberof module:items
     */
    static createBackloggedItems() { // It's InstancedItemEntities :v
        if (Game.itemsToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.itemsToCreate) {
            if (Game.hasLoadedMesh(Game.itemsToCreate[i][1].getMeshID())) {
                Game.createItemInstance(
                    Game.itemsToCreate[i][0],
                    Game.itemsToCreate[i][1],
                    Game.itemsToCreate[i][2],
                    Game.itemsToCreate[i][3],
                    Game.itemsToCreate[i][4],
                    Game.itemsToCreate[i][5]
                );
                Game.removeItemToCreate(i);
            }
        }
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
     * Filters the creation of an InstancedItemEntity in the world at the given position.
     * @memberof module:items
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {(AbstractEntity|string)} abstractEntity Abstract entity; preferably an InstancedItemEntity
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {(array|number)} An EntityController or an integer status code
     */
    static filterCreateItemInstance(id = "", abstractEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        if (abstractEntity instanceof InstancedItemEntity) { }
        else if (abstractEntity instanceof ItemEntity) {
            abstractEntity = abstractEntity.createInstance(id);
        }
        else if (typeof abstractEntity == "string") {
            if (ItemEntity.has(abstractEntity)) {
                abstractEntity = ItemEntity.get(abstractEntity).createInstance(id);
            }
            else if (InstancedItemEntity.has(abstractEntity)) {
                abstractEntity = InstancedItemEntity.get(abstractEntity);
            }
            else {
                if (Game.debugMode) console.log(`\tThe abstract entity (${abstractEntity}) couldn't be found.`);
                return 2;
            }
        }
        else {
            if (Game.debugMode) console.log(`\tThe abstract entity was neither a valid string, InstancedItemEntity, or an ItemEntity.`);
            return 2;
        }
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
        }
        options["filtered"] = true;
        return [id, abstractEntity, position, rotation, scaling, options];
    }
    /**
     * Places, or creates from an ItemEntity, an InstancedItemEntity in the world at the given position.
     * @memberof module:items
     * @param {string} [id] Unique ID, auto-generated if none given
     * @param {(AbstractEntity|string)} abstractEntity Abstract entity; preferably an InstancedItemEntity
     * @param {BABYLON.Vector3} position Position
     * @param {BABYLON.Vector3} [rotation] Rotation
     * @param {BABYLON.Vector3} [scaling] Scaling
     * @param {object} [options] Options
     * @returns {(ItemController|array|number)} An EntityController or an integer status code
     */
    static createItemInstance(id = "", abstractEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateItemInstance(id, abstractEntity, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, abstractEntity, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(abstractEntity.getMeshID()))) {
            Game.loadMesh(abstractEntity.getMeshID());
            Game.loadTexture(abstractEntity.getTextureID());
            Game.loadMaterial(abstractEntity.getTextureID()); // TODO: Work out a real system of materials :v
            Game.addItemToCreate(id, abstractEntity, position, rotation, scaling, options);
            if (Game.debugMode) console.log(`\tThe item's mesh needs to be loaded. Inserting it into the qeueu.`);
            return [id, abstractEntity, position, rotation, scaling, options];
        }
        let mesh = Game.createItemMesh(id, abstractEntity.getMeshID(), abstractEntity.getTextureID(), position, rotation, scaling, options);
        if (abstractEntity instanceof Entity) {
            abstractEntity = abstractEntity.createInstance(id);
        }
        let itemController = new ItemController(id, mesh, abstractEntity);
        abstractEntity.setController(itemController);
        return itemController;
    }
    /**
     * Removes an InstancedItemEntity, its ItemController, and its BABYLON.InstancedMesh
     * @memberof module:items
     * @param {(ItemController|string)} instancedItemEntity An ItemController, or its string ID
     * @returns {number} Integer status code
     */
    static removeItem(instancedItemEntity) {
        if (!(instancedItemEntity instanceof InstancedItemEntity)) {
            if (!InstancedItemEntity.has(instancedItemEntity)) {
                return 2;
            }
            instancedItemEntity = InstancedItemEntity.get(instancedItemEntity);
        }
        if (Game.removeItemInSpace(instancedItemEntity) == 0) {
            instancedItemEntity.dispose();
            return 0;
        }
        return 1;
    }
    /**
     * Removes an InstancedItemEntity's ItemController, and its BABYLON.InstancedMesh
     * @memberof module:items
     * @param {(ItemController|string)} instancedItemEntity An ItemController, or its string ID
     * @returns {number} Integer status code
     */
    static removeItemInSpace(instancedItemEntity) {
        if (!(instancedItemEntity instanceof InstancedItemEntity)) {
            if (!InstancedItemEntity.has(instancedItemEntity)) {
                return 2;
            }
            instancedItemEntity = InstancedItemEntity.get(instancedItemEntity);
        }
        if (Game.debugMode) console.log(`Game.removeItemInSpace(${instancedItemEntity.getID()})`);
        if (instancedItemEntity.hasController() && instancedItemEntity.getController().hasMesh()) {
            let mesh = instancedItemEntity.getController().getMesh();
            instancedItemEntity.getController().dispose();
            Game.removeMesh(mesh);
            return 0;
        }
        else {
            return 1;
        }
    }

    /**
     * @module characters
     */
    /**
     * 
     * @memberof module:characters
     */
    static importCharacters() {
        return Game.importScript("resources/js/characters.js");
    }
    /**
     * 
     * @memberof module:characters
     * @param {string} characterID 
     * @param {string} meshID 
     * @param {string} materialID 
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} rotation 
     * @param {BABYLON.Vector3} scaling 
     * @param {object} options 
     */
    static createCharacterMesh(characterID = undefined, meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = { createClone: false, checkCollisions: true }) {
        if (Game.debugMode) console.log(`Running Game::createCharacterMesh(${characterID}, ${meshID}, ${materialID})`);
        if (typeof options != "object") {
            options = { mass: 0.8, restitution: 0.1 };
        }
        let instancedMesh = Game.createMesh(characterID, meshID, materialID, position, rotation, scaling, options);
        if (!(instancedMesh instanceof BABYLON.AbstractMesh)) {
            return 2;
        }
        if (Game.physicsEnabled) {
            Game.assignBoxPhysicsToMesh(instancedMesh, options);
        }
        else {
            if (options.hasOwnProperty("checkCollisions")) {
                //Game.assignBoxCollisionToMesh(instancedMesh);
                instancedMesh.checkCollisions = options["checkCollisions"] == true;
            }
            else {
                instancedMesh.checkCollisions = true;
            }
            /*
                Using X for Z size 'cause the tail throws my collision box size off
             */
            instancedMesh.ellipsoid.set(instancedMesh.getBoundingInfo().boundingBox.extendSize.x * scaling.x, instancedMesh.getBoundingInfo().boundingBox.extendSize.y * scaling.y, instancedMesh.getBoundingInfo().boundingBox.extendSize.x * scaling.z);
            instancedMesh.ellipsoidOffset.set(0, instancedMesh.ellipsoid.y, -0.1);
        }
        return instancedMesh;
    }
    /**
     * 
     * @memberof module:characters
     */
    static addCharacterToCreate(id, characterEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (Game.hasCharacterToCreate(id)) {
            return true;
        }
        Game.loadMesh(characterEntity.getMeshID());
        Game.charactersToCreate[id] = {
            0: id,
            1: characterEntity,
            2: position,
            3: rotation,
            4: scaling,
            5: options
        };
        Game.charactersToCreateCounter += 1;
        Game.hasBackloggedEntities = true;
        return true;
    }
    /**
     * 
     * @memberof module:characters
     */
    static removeCharacterToCreate(characterIndexID) {
        if (!Game.hasCharacterToCreate(characterIndexID)) {
            return true;
        }
        delete Game.charactersToCreate[characterIndexID];
        Game.charactersToCreateCounter -= 1;
        return true;
    }
    /**
     * 
     * @memberof module:characters
     */
    static hasCharacterToCreate(characterIndexID) {
        if (!Game.initialized) {
            return false;
        }
        return Game.charactersToCreateCounter > 0 && Game.charactersToCreate.hasOwnProperty(characterIndexID);
    }
    /**
     * 
     * @memberof module:characters
     */
    static createBackloggedCharacters() {
        if (Game.charactersToCreateCounter == 0) {
            return true;
        }
        for (let i in Game.charactersToCreate) {
            if (Game.loadedMeshes.hasOwnProperty(Game.charactersToCreate[i][1].getMeshID())) {
                Game.createCharacterInstance(
                    Game.charactersToCreate[i][0],
                    Game.charactersToCreate[i][1],
                    Game.charactersToCreate[i][2],
                    Game.charactersToCreate[i][3],
                    Game.charactersToCreate[i][4],
                    Game.charactersToCreate[i][5]
                );
                Game.removeCharacterToCreate(i);
            }
        }
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
        if (Game.debugMode) console.log(`Running Game::createCharacterEntity(${id}, ${name}, ${description}, ${iconID}, ${creatureType}, ${creatureSubType}, ${sex}, ${age}, ${meshID}, ${materialID})`);
        let characterEntity = new CharacterEntity(id, name, description, iconID, creatureType, creatureSubType, sex, age, undefined);
        let soul = new Soul(id, name, description);
        soul.assign(characterEntity, false); // Assuming this soul is just initialized, copy over some needed properties from its body
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
                    case "isEssential": {
                        characterEntity.setEssential(options[i]);
                        break;
                    }
                }
            }
        }
        if (Game.hasAvailableMesh(meshID) && meshID != "missingMesh" && meshID != "loadingMesh") {
            characterEntity.setMeshID(meshID);
        }
        else {
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
        if (Game.hasLoadedMaterial(materialID) && materialID != "missingMaterial" && materialID != "loadingMaterial") {
            characterEntity.setMaterialID(materialID);
            if (Game.getLoadedMaterial(materialID).diffuseTexture instanceof BABYLON.Texture) {
                characterEntity.setTextureID(Game.getLoadedMaterial(materialID).diffuseTexture.name);
            }
        }
        else if (Game.hasAvailableTexture(materialID)) {
            if (!Game.hasLoadedTexture(materialID)) {
                Game.loadTexture(materialID);
            }
            characterEntity.setTextureID(materialID);
            Game.loadMaterial(materialID, materialID);
            characterEntity.setMaterialID(materialID);
        }
        else {
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
            if (!Game.hasLoadedTexture(textureID)) {
                Game.loadTexture(textureID);
            }
            characterEntity.setTextureID(textureID);
            Game.loadMaterial(textureID, textureID);
            characterEntity.setMaterialID(textureID);
        }
        return characterEntity;
    }
    /**
     * Filters the creation of a character mesh, and controller.
     * @memberof module:characters
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {CharacterEntity} characterEntity Character entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scale
     * @param  {object} [options] Options
     * @return {array|number} Character Controller
     */
    static filterCreateCharacterInstance(id, characterEntity, position, rotation, scaling, options) {
        if (!(characterEntity instanceof CharacterEntity)) {
            if (CharacterEntity.has(characterEntity)) {
                characterEntity = CharacterEntity.get(characterEntity);
            }
            else {
                return 2;
            }
        }
        id = Game.Tools.filterID(id);
        if (id.length == 0) {
            id = characterEntity.getID();
        }
        if (!(position instanceof BABYLON.Vector3)) {
            position = Tools.filterVector(position);
        }
        if (!(rotation instanceof BABYLON.Vector3)) {
            if (typeof rotation == "number") {
                rotation = new BABYLON.Vector3(0, rotation, 0);
            }
            else {
                rotation = Tools.filterVector(rotation);
            }
        }
        if (!(scaling instanceof BABYLON.Vector3)) {
            if (typeof scaling == "number") {
                scaling = new BABYLON.Vector3(scaling, scaling, scaling);
            }
            else {
                scaling = Tools.filterVector(scaling);
            }
        }
        if (scaling.equals(BABYLON.Vector3.Zero())) {
            scaling = BABYLON.Vector3.One();
        }
        if (typeof options != "object") {
            options = {};
        }
        options["filtered"] = true;
        return [id, characterEntity, position, rotation, scaling, options];
    }
    /**
     * Creates a character mesh, and controller.
     * @memberof module:characters
     * @param  {string} [id] Unique ID, auto-generated if none given
     * @param  {CharacterEntity} characterEntity Character entity
     * @param  {BABYLON.Vector3} position Position
     * @param  {BABYLON.Vector3} [rotation] Rotation
     * @param  {BABYLON.Vector3} [scaling] Scale
     * @param  {object} [options] Options
     * @return {CharacterController} Character Controller
     */
    static createCharacterInstance(id, characterEntity, position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (typeof options != "object" || !options.hasOwnProperty("filtered")) {
            let filteredParameters = Game.filterCreateCharacterInstance(id, characterEntity, position, rotation, scaling, options);
            if (typeof filteredParameters == "number") {
                return 2;
            }
            [id, characterEntity, position, rotation, scaling, options] = filteredParameters;
        }
        if (!(Game.hasLoadedMesh(characterEntity.getMeshID()))) {
            Game.loadMesh(characterEntity.getMeshID());
            Game.addCharacterToCreate(id, characterEntity, position, rotation, scaling, options);
            return [id, characterEntity, position, rotation, scaling, options];
        }
        let loadedMesh = Game.createCharacterMesh(characterEntity.getID(), characterEntity.getMeshID(), characterEntity.getMaterialID(), position, rotation, scaling, options);
        let characterController = null;
        if (Game.useRigidBodies) {
            characterController = new CharacterControllerRigidBody(characterEntity.getID(), loadedMesh, characterEntity);
        }
        else {
            characterController = new CharacterControllerTransform(characterEntity.getID(), loadedMesh, characterEntity);
        }
        if (characterEntity.getCreatureType() == CreatureTypeEnum.UNDEAD && characterEntity.getCreatureSubType() == CreatureSubTypeEnum.SKELETON) {
            characterController.setDeathAnim("91_death99");
        }
        switch (characterEntity.getMeshID()) {
            case "aardwolfM":
            case "aardwolfF":
            case "foxM":
            case "foxF":
            case "foxSkeletonN": {
                characterController.attachToROOT("hitbox.canine", "collisionMaterial");
                characterController.attachToHead("hitbox.canine.head", "collisionMaterial", { isHitbox: true });
                characterController.attachToNeck("hitbox.canine.neck", "collisionMaterial", { isHitbox: true });
                characterController.attachToChest("hitbox.canine.chest", "collisionMaterial", { isHitbox: true });
                characterController.attachToLeftHand("hitbox.canine.hand.l", "collisionMaterial", { isHitbox: true });
                characterController.attachToRightHand("hitbox.canine.hand.r", "collisionMaterial", { isHitbox: true });
                characterController.attachToSpine("hitbox.canine.spine", "collisionMaterial", { isHitbox: true });
                characterController.attachToPelvis("hitbox.canine.pelvis", "collisionMaterial", { isHitbox: true });
                break;
            }
        }
        let newScaling = characterEntity.height / characterEntity.baseHeight;
        loadedMesh.scaling.set(newScaling, newScaling, newScaling);
        return characterEntity;
    }
    /**
     * Removes a CharacterEntity, its CharacterController, and its BABYLON.InstancedMesh
     * @memberof module:characters
     * @param {(CharacterController|string)} characterController A CharacterController, or its string ID
     * @returns {number} Integer status code
     */
    static removeCharacter(characterController) {
        if (!(characterController instanceof CharacterController)) {
            if (!CharacterController.has(characterController)) {
                return 2;
            }
            characterController = CharacterController.get(characterController);
        }
        if (characterController == Game.player.getController()) {
            return 1;
        }
        let mesh = characterController.getMesh();
        let entity = characterController.getEntity();
        characterController.dispose();
        if (entity instanceof AbstractEntity) {
            entity.dispose();
        }
        if (mesh instanceof BABYLON.InstancedMesh) {
            Game.removeMesh(mesh);
        }
        return 0;
    }

    /**
     * @module player
     * @memberof module:character
     */
    /**
     * 
     * @memberof module:player
     */
    static addPlayerToCreate(characterID) {
        if (Game.hasPlayerToCreate()) {
            return 0;
        }
        if (CharacterEntity.has(characterID)) {
            Game.playerToCreate = characterID;
            Game.hasBackloggedPlayer = true;
            return 0;
        }
        return 2;
    }
    /**
     * 
     * @memberof module:player
     */
    static removePlayerToCreate() {
        Game.playerToCreate = null;
        Game.hasBackloggedPlayer = false;
        return 0;
    }
    /**
     * 
     * @memberof module:player
     */
    static hasPlayerToCreate() {
        if (!Game.initialized) {
            return false;
        }
        return Game.playerToCreate != null;
    }
    /**
     * 
     * @memberof module:player
     */
    static createBackloggedPlayer() {
        if (Game.hasPlayerToCreate()) {
            if (!CharacterEntity.has(Game.playerToCreate)) {
                return 2;
            }
            if (Game.assignPlayer(CharacterEntity.get(Game.playerToCreate)) == 0) {
                Game.removePlayerToCreate();
            }
        }
        return 0;
    }
    /**
     * 
     * @memberof module:player
     * @param {string} id 
     * @param {string} name 
     * @param {string} [description] 
     * @param {string} [iconID] Icon ID
     * @param {CreatureTypeEnum} creatureType Creature Type
     * @param {CreatureSubTypeEnum} creatureSubType Creture Sub-Type
     * @param {SexEnum} sex 
     * @param {number} age 
     * @param {string} meshID Mesh ID
     * @param {string} [materialID] Material ID
     * @param {BABYLON.Vector3} position 
     * @param {BABYLON.Vector3} [rotation] 
     * @param {BABYLON.Vector3} [scaling] 
     * @param {object} [options] 
     */
    static createPlayer(id = "", name = "", description = "", iconID = undefined, creatureType = CreatureTypeEnum.HUMANOID, creatureSubType = CreatureSubTypeEnum.FOX, sex = SexEnum.MALE, age = 18, meshID = "missingMesh", materialID = "missingMaterial", position = BABYLON.Vector3.Zero(), rotation = BABYLON.Vector3.Zero(), scaling = BABYLON.Vector3.One(), options = {}) {
        if (Game.debugMode) console.log("Running createPlayer");
        id = Tools.filterID(id);
        if (id.length == 0) {
            id = Tools.genUUIDv4();
        }
        let characterEntity = Game.createCharacterEntity(id, name, description, iconID, creatureType, creatureSubType, sex, age, meshID, materialID, options);
        let characterController = Game.createCharacterInstance(id, characterEntity, position, rotation, scaling, options);
        if (characterController instanceof CharacterEntity && characterController.hasController() && characterController.getController().hasMesh()) {
            Game.assignPlayer(characterEntity);
        }
        else {
            Game.addPlayerToCreate(id);
        }
        return 0;
    }
    /**
     * 
     * @memberof module:player
     * @param {CharacterEntity} characterEntity 
     */
    static assignPlayer(characterEntity) { // TODO: allow for reassigning player :v
        if (!(characterEntity instanceof CharacterEntity)) {
            if (CharacterEntity.has(characterEntity)) {
                characterEntity = CharacterEntity.get(characterEntity);
            }
            else {
                return 2;
            }
        }
        if (!characterEntity.hasController() || !characterEntity.getController().hasMesh() || !characterEntity.getController().hasSkeleton()) {
            return 1;
        }
        if (Game.player instanceof AbstractEntity) {
            Game.player.getController().detachFromFOCUS();
            Game.player.getController().getMesh().isPickable = true;
        }
        else {
            Game.cameraFocus = Game.createMesh("cameraFocus", "cameraFocus", "collisionMaterial");
        }
        Game.player = characterEntity;
        Game.playerController = Game.player.getController();
        Game.player.getController().attachToFOCUS(Game.cameraFocus); // and reassigning an instanced mesh without destroying it
        Game.player.getController().getMesh().isPickable = false;
        Game.gui.playerPortrait.set(Game.player);
        Game.initFollowCamera();
        Game.initCastRayInterval();
        Game.initPlayerPortraitStatsUpdateInterval();
        Game.entityLocRotWorker.postMessage({ cmd: "setPlayer", msg: Game.player.getID() });
        return 0;
    }
    /**
     * 
     * @memberof module:player
     * @param {string} id 
     */
    static setPlayerID(id) {
        Entity.setID(Game.player.getID(), id);
    }
    /**
     * 
     * @memberof module:player
     * @param {EntityController} entityController 
     */
    static setPlayerTarget(entityController) {
        if (Game.debugMode) console.group("Running Game::setPlayerTarget()");
        if (!(Game.player.hasController())) {
            if (Game.debugMode) {
                console.error("Player doesn't have a controller; returning 1");
                console.groupEnd();
            }
            return 1;
        }
        if (!(entityController instanceof EntityController)) {
            if (EntityController.has(entityController)) {
                entityController = EntityController.get(entityController);
            }
            else {
                if (Game.debugMode) {
                    console.error("Target doesn't have a controller; returning 1");
                    console.groupEnd();
                }
                return 1;
            }
        }
        if (!entityController.isEnabled()) {
            if (Game.debugMode) {
                console.info("Target has a controller, but it is disabled; returning 0");
                console.groupEnd();
            }
            if (entityController == Game.playerController.getTarget()) {
                Game.clearPlayerTarget();
            }
            return 0;
        }
        if (entityController == Game.playerController.getTarget()) {
            if (Game.debugMode) {
                console.info("Somehow the player was trying to target itself.");
                console.groupEnd();
            }
            Game.gui.targetPortrait.updateWith(entityController.getEntity());
            return 0;
        }
        if (Game.highlightEnabled) {
            Game.highlightController(entityController);
        }
        Game.playerController.setTarget(entityController);
        Game.gui.targetPortrait.set(entityController.getEntity());
        Game.gui.targetPortrait.show();
        Game.gui.setActionTooltip(ActionEnum.properties[entityController.getEntity().getDefaultAction()].name);
        Game.gui.showActionTooltip();
        if (Game.debugMode) console.groupEnd();
        return 0;
    }
    /**
     * 
     * @memberof module:player
     */
    static clearPlayerTarget() {
        if (!(Game.playerController instanceof CreatureController)) {
            return 1;
        }
        if (!Game.playerController.hasTarget()) {
            return 0;
        }
        if (Game.highlightEnabled) {
            Game.clearHighlightedController();
        }
        Game.playerController.clearTarget();
        Game.gui.targetPortrait.hide();
        Game.gui.hideActionTooltip();
        return 0;
    }
    /**
     * 
     * @memberof module:player
     * @param {Cell} cell 
     */
    static setPlayerCell(cell) {
        if (cell instanceof Cell) { }
        else if (Cell.has(cell)) {
            cell = Cell.get(cell);
        }
        else {
            return 2;
        }
        if (Game.playerCell != cell) {
            Game.loadingCell = true;
        }
        Game.playerCell = cell;
        if (Game.playerCell instanceof Cell) {
            cell.meshIDDifference(Game.playerCell).forEach(function (meshID) {
                if (Game.meshMaterialMeshes.hasOwnProperty(meshID)) {
                    for (let i in Game.meshMaterialMeshes[meshID]) {
                        for (let j in Game.meshMaterialMeshes[meshID][i]) {
                            Game.removeMesh(Game.meshMaterialMeshes[meshID][i][j]);
                        }
                    }
                }
            });
        }
        Game.loadCell(cell);
        return 0;
    }
    /**
     * @memberof module:player
     */
    static hasPlayerCell() {
        return Game.playerCell instanceof Cell;
    }

    /** */
    static enableHighlighting() {
        Game.highlightEnabled = true;
        Game.initHighlighting();
        return 0;
    }
    static disableHighlighting() {
        Game.clearHighlightedController();
        Game.highlightEnabled = false;
        Game.highlightLayer.dispose();
        return 0;
    }
    static initHighlighting() {
        Game.highlightLayer = new BABYLON.HighlightLayer("hl1", Game.scene);
        Game.highlightLayer.outerGlow = true;
        Game.highlightLayer.innerGlow = false;
        return 0;
    }
    static highlightEntity(abstractEntity) {
        if (!(abstractEntity instanceof AbstractEntity)) {
            return 2;
        }
        if (abstractEntity.hasController()) {
            return highlightController(abstractEntity.getController());
        }
        return 2;
    }
    static highlightController(entityController) {
        if (!(entityController instanceof EntityController)) {
            return 2;
        }
        if (!Game.highlightEnabled || Game.highlightedController == entityController) {
            return 0;
        }
        let color = BABYLON.Color3.Gray();
        if (entityController instanceof CharacterController) {
            color = BABYLON.Color3.White();
        }
        else if (entityController instanceof ItemController) { // implying its entity is an instance
            if (entityController.getEntity().getOwner() != Game.player) {
                color = BABYLON.Color3.Red();
            }
            else {
                color = BABYLON.Color3.White();
            }
        }
        entityController.getMeshes().forEach(function (mesh) {
            if (mesh instanceof BABYLON.Mesh) {
                Game.highlightLayer.addMesh(mesh, color)
            }
        });
        Game.highlightedController = entityController;
        return 0;
    }
    static clearHighlightedController() {
        if (!Game.highlightEnabled || !(Game.highlightedController instanceof EntityController)) {
            return 0;
        }
        for (let i in Game.highlightLayer._meshes) {
            Game.highlightLayer.removeMesh(Game.highlightLayer._meshes[i]["mesh"]);
        }
        Game.highlightedController = null;
        return 0;
    }
    static castRayTarget() {
        if (!Game.player.hasController() || !Game.player.controller.hasMesh() || !Game.player.controller.hasSkeleton()) {
            return 1;
        }
        let ray = Game.camera.getForwardRay(2 * Game.player.controller.mesh.scaling.y, Game.camera.getWorldMatrix(), Game.player.controller.focus.getAbsolutePosition());
        if (Game.player.controller.targetRay == undefined) {
            Game.player.controller.targetRay = ray;
        }
        else {
            Game.player.controller.targetRay.origin = ray.origin;
            Game.player.controller.targetRay.direction = ray.direction;
        }
        if (Game.debugMode) {
            if (Game.player.controller.targetRayHelper != undefined) {
                Game.player.controller.targetRayHelper.dispose();
            }
            Game.player.controller.targetRayHelper = new BABYLON.RayHelper(Game.player.controller.targetRay);
            Game.player.controller.targetRayHelper.show(Game.scene);
        }
        let hit = Game.scene.pickWithRay(Game.player.controller.targetRay, function (pickedMesh) {
            if (pickedMesh.controller == null || pickedMesh.controller == Game.playerController) {
                return false;
            }
            return true;
        });
        if (hit.hit) {
            Game.setPlayerTarget(hit.pickedMesh.controller);
        }
        else {
            Game.clearPlayerTarget();
        }
        return 0;
    }
    static initCastRayInterval() {
        clearInterval(Game.castRayTargetIntervalFunction);
        Game.castRayTargetIntervalFunction = setInterval(Game.castRayTarget, Game.castRayTargetInterval);
        return 0;
    }
    static setCastRayInterval(interval = 250) {
        if (interval > 0) {
            Game.castRayTargetInterval = interval;
        }
        Game.initCastRayInterval();
        return 0;
    }
    static initPlayerPortraitStatsUpdateInterval() {
        clearInterval(Game.playerPortraitStatsUpdateIntervalFunction);
        Game.playerPortraitStatsUpdateIntervalFunction = setInterval(Game.gui.playerPortrait.update, Game.playerPortraitStatsUpdateInterval);
        return 0;
    }
    static setPlayerPortraitStatsUpdateInterval(interval = 100) {
        if (interval > 0) {
            Game.playerPortraitStatsUpdateInterval = interval;
        }
        Game.initPlayerPortraitStatsUpdateInterval();
        return 0;
    }
    static pointerLock(event) {
        if (Game.engine.isPointerLock) {
            return 0;
        }
        Game.canvas.requestPointerLock();
        Game.engine.isPointerLock = true;
        Game.pointerLockTimeoutVar = setTimeout(function () { document.addEventListener("pointerlockchange", Game.pointerRelease); }, 121);
        return 0;
    }
    static pointerRelease(event) {
        clearTimeout(Game.pointerLockTimeoutVar);
        document.removeEventListener("pointerlockchange", Game.pointerRelease);
        document.exitPointerLock();
        Game.engine.isPointerLock = false;
        return 0;
    }
    static parseChat(chatString) {
        if (chatString.slice(0, 1) == "/") {
            return Game.chatCommands(chatString.slice(1));
        }
        else {
            return Game.gui.chat.appendOutput(`${new Date().toLocaleTimeString({ hour12: false })} ${Game.player.name}: ${chatString}`);
        }
    }
    static sendChatMessage() {
        let chatString = Game.gui.chat.getInput();
        if (chatString.length == 0) {
            return 1;
        }
        if (Client.isOnline()) {
            Client.sendChatMessage(chatString);
        }
        else {
            Game.parseChat(chatString);
        }
        Game.gui.chat.clearInput();
        Game.gui.chat.setFocused(false);
        return 0;
    }
    static chatCommands(command, ...parameters) {
        if (command == undefined || typeof command != "string") {
            return 2;
        }
        if (command.slice(0, 1) == "/") {
            command = command.slice(1);
        }
        let commandArray = command.split(" ");
        if (commandArray.length == 0 || typeof commandArray[0] != "string" || commandArray[0].length <= 0) {
            commandArray.push("help");
        }
        switch (commandArray[0].toLowerCase()) {
            case "help": {
                Game.gui.chat.appendOutput("Possible commands are: help, clear, menu, login, logout, quit, save, and load.\n");
                break;
            }
            case "clear": {
                Game.gui.chat.clearOutput();
                break;
            }
            case "menu": {
                Game.gui.showCharacterChoiceMenu();
                break;
            }
            case "login": {
                break;
            }
            case "logout": {
                Client.disconnect();
                break;
            }
            case "exit":
            case "quit": {
                break;
            }
            case "save": {
                break;
            }
            case "load": {
                break;
            }
            case "additem": {
                for (let i = 1; i < commandArray.length; i++) {
                    if (ItemEntity.has(commandArray[i])) {
                        Game.player.addItem(commandArray[i]);
                    }
                }
                break;
            }
            case "addallitems": {
                for (let i in ItemEntity.list()) {
                    Game.player.addItem(i);
                }
                break;
            }
            case "addallweapons": {
                for (let i in WeaponEntity.list()) {
                    Game.player.addItem(i);
                }
                break;
            }
            case "addallarmour":
            case "addallarmor":
            case "addallclothing": {
                for (let i in ClothingEntity.list()) {
                    Game.player.addItem(i);
                }
                break;
            }
            case "addmoney": {
                let money = Tools.filterInt(commandArray[1]) || 1;
                Game.player.addMoney(money);
                Game.gui.chat.appendOutput(`Added \$${money} to your wallet.`);
                break;
            }
            case "setmoney": {
                let money = Tools.filterInt(commandArray[1]) || 1;
                Game.player.setMoney(money);
                Game.gui.chat.appendOutput(`Set your wallet to \$${money}.`);
                break;
            }
            case "getmoney": {
                Game.gui.chat.appendOutput(`You have \$${Game.player.getMoney()} in your wallet.`);
                break;
            }
            case "kill": {
                let target = Game.player;
                if (typeof commandArray[1] == "string" && CharacterEntity.has(commandArray[1])) {
                    target = CharacterEntity.get(commandArray[1]);
                }
                target.setHealth(0);
                break;
            }
            case ":v":
            case "v:":
            case ":V":
            case "V:": {
                if (Game.controls == EditControls) {
                    Game.gui.chat.appendOutput("\n    Bye, super powers v:\n");
                    Game.setInterfaceMode(InterfaceModeEnum.CHARACTER);
                }
                else {
                    Game.gui.chat.appendOutput("\n    A developer is you :V\n");
                    Game.setInterfaceMode(InterfaceModeEnum.EDIT);
                }
                break;
            }
            case "showdebug": {
                Game.gui.debug.show();
                break;
            }
            default: {
                Game.gui.chat.appendOutput(`Command "${command}" not found.\n`);
                return 0;
            }
        }
        return 0;
    }
    static updateCameraTarget() {
        if (!(Game.camera instanceof BABYLON.ArcRotateCamera)) {
            return 2;
        }
        if (!Game.player.hasController() || !Game.player.getController().hasMesh() || !Game.player.getController().hasSkeleton()) {
            return 1;
        }
        if (Game.enableFirstPerson && Game.camera.radius <= 0.5) {
            if (Game.player.getController().getMesh().isVisible) {
                Game.player.getController().hideMesh();
                Game.camera.checkCollisions = false;
                Game.camera.inertia = 0.75;
                Game.gui.showCrosshair();
            }
        }
        else if (!Game.player.getController().getMesh().isVisible) {
            Game.player.getController().showMesh();
            Game.camera.checkCollisions = true;
            Game.camera.inertia = 0.9;
            Game.gui.hideCrosshair();
        }
        return 0;
    }
    static doEntityAction(entity, actor = Game.player, actionID = null) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!ActionEnum.properties.hasOwnProperty(actionID)) {
            if (ActionEnum.hasOwnProperty(actionID)) {
                actionID = ActionEnum[actionID];
            }
            else {
                actionID = entity.getDefaultAction();
            }
        }
        else {
            actionID = Number.parseInt(actionID);
        }
        if (Game.debugMode) console.log(`Running Game::doEntityAction(${entity.id}, ${actor.id}, ${actionID})`);
        switch (actionID) {
            case ActionEnum.USE: {
                if (entity instanceof LightingEntity) {
                    entity.toggle();
                }
                break;
            }
            case ActionEnum.LOOK: {
                Game.actionLook(entity, actor);
                break;
            }
            case ActionEnum.READ: {
                Game.actionRead(entity, actor);
                break;
            }
            case ActionEnum.LAY: {
                Game.actionLay(entity, actor);
                break;
            }
            case ActionEnum.SIT: {
                Game.actionSit(entity, actor);
                break;
            }
            case ActionEnum.TAKE: {
                if (entity instanceof InstancedItemEntity) {
                    Game.actionTake(entity, actor);
                }
                break;
            }
            case ActionEnum.OPEN: {
                if (entity instanceof DoorEntity || entity instanceof FurnitureEntity || entity instanceof InstancedFurnitureEntity) {
                    Game.actionOpen(entity, actor);
                }
                break;
            }
            case ActionEnum.CONSUME: {
                Game.actionConsume(entity, actor);
                break;
            }
            case ActionEnum.CLOSE: {
                if (entity instanceof DoorEntity || entity instanceof FurnitureEntity || entity instanceof InstancedFurnitureEntity) {
                    Game.actionClose(entity, actor);
                }
                break;
            }
            case ActionEnum.TALK: {
                if (entity instanceof CharacterEntity) {
                    Game.actionTalk(entity, actor);
                }
                break;
            }
            case ActionEnum.ATTACK: {
                if (entity instanceof AbstractEntity) {
                    Game.actionAttack(entity, actor);
                }
                break;
            }
        }
        return 0;
    }
    static actionTake(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasInventory()) {
            return 1;
        }
        if (Game.debugMode) console.log(`Game.actionTake(${entity.getID()}, ${actor.getID()})`);
        if (actor.addItem(entity) == 0) {
            Game.removeItemInSpace(entity);
            if (typeof callback == "function") {
                callback(entity, undefined, actor);
            }
            return 0;
        }
        return 1;
    }
    /**
     * 
     * @param {AbstractEntity} entity 
     * @param {CharacterEntity} actor 
     * @param {WeaponEntity|InstancedWeaponEntity} [weapon] 
     * @param {function} [callback] 
     */
    static actionAttack(entity = null, actor = Game.player, weapon = null, callback = undefined) {
        if (Game.debugMode) console.group("Running Game::actionAttack");
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                if (Game.debugMode) { console.error("but the entity doesn't exist."); console.groupEnd(); }
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                if (Game.debugMode) { console.error("but the actor doesn't exist."); console.groupEnd(); }
                return 2;
            }
        }
        if (actor.getController().isAttacking) {
            if (Game.debugMode) { console.info("but the actor is already attacking."); console.groupEnd(); }
            return 1;
        }
        if (!(weapon instanceof AbstractEntity)) {
            if (AbstractEntity.has(weapon)) {
                weapon = AbstractEntity.get(weapon);
            }
            else {
                let weaponL = AbstractEntity.get(actor.getEquipment()[ApparelSlotEnum.HAND_L]);
                let weaponR = AbstractEntity.get(actor.getEquipment()[ApparelSlotEnum.HAND_R]);
                if (actor.isLeftHanded() && weaponL instanceof InstancedWeaponEntity) {
                    weapon = weaponL;
                }
                else if (weaponR instanceof InstancedWeaponEntity) {
                    weapon = weaponR;
                }
                else {
                    weapon = WeaponEntity.get("weaponHand");
                }
            }
        }
        if (Game.debugMode) console.info(`with (${entity.getID()}, ${actor.getID()}, ${weapon.getID()})`);
        if (!(entity instanceof AbstractEntity) || !(actor instanceof CharacterEntity)) {
            if (Game.debugMode) { console.warn("but either the entity or actor weren't entities."); console.groupEnd(); }
            return 0;
        }
        if (!Game.withinRange(actor, entity, 1.6) || !Game.inFrontOf(actor, entity)) {
            if (Game.debugMode) { console.warn("but either the actor wasn't within range of the entity, or the entity wasn't in front of the actor."); console.groupEnd(); }
            return 0;
        }
        let attackRoll = Game.calculateAttack(actor, weapon);
        if (attackRoll == 1) { }
        else if (entity instanceof CreatureEntity && attackRoll > entity.getArmourClass()) {
            let damage = Game.calculateDamage(entity, actor, weapon, attackRoll >= 20);
            if (weapon instanceof AbstractEntity) {
                entity.modifyHealth(-damage);
            }
            else if (actor.isArmed()) {
                entity.modifyHealth(-damage);
            }
            else {
                entity.modifyStamina(damage);
            }
        }
        if (Game.debugMode) { console.info("and everything was successful."); console.groupEnd(); }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    /**
     * 
     * @param {AbstractEntity} entity 
     * @param {CharacterEntity} actor 
     * @param {function} callback 
     */
    static actionDrop(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasItem(entity)) {
            return 1;
        }
        if (actor instanceof CharacterController && actor.hasEquipment(entity)) {
            if (actor.unequip(entity) != 0) {
                if (typeof callback == "function") {
                    callback();
                }
                return 0;
            }
        }
        if (actor.removeItem(entity) == 0) {
            if (actor == Game.player) {
                Game.gui.inventoryMenu.updateWith(actor);
            }
            if (entity.hasController() && entity.getController().hasMesh()) { // it shouldn't have an EntityController :v but just in case
                entity.getController().setParent(null);
                entity.getController().getMesh().position = actor.getController().getMesh().position.clone().add(
                    new BABYLON.Vector3(0, Game.getMesh(entity.getMeshID()).getBoundingInfo().boundingBox.extendSize.y, 0)
                );
            }
            else {
                Game.createItemInstance(undefined, entity, actor.getController().getMesh().position.clone(), actor.getController().getMesh().rotation.clone());
            }
        }
        if (typeof callback == "function") {
            callback();
        }
        return 0;
    }
    /**
     * 
     * @param {AbstractEntity} entity 
     * @param {CharacterEntity} actor 
     * @param {function} callback 
     */
    static actionClose(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (entity.getController() instanceof FurnitureController) {
            entity.getController().currAnim = entity.getController().closed;
            entity.getController().beginAnimation(entity.getController().close);
            entity.setDefaultAction(ActionEnum.OPEN);
            entity.addHiddenAvailableAction(ActionEnum.CLOSE);
            entity.removeHiddenAvailableAction(ActionEnum.OPEN);
        }
        else if (entity.getController() instanceof DoorController) {
            entity.setClose();
            Game.playSound("openDoor");
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionConsume(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (entity instanceof InstancedConsumableEntity) {
            for (let effect in entity.getActionEffects(ActionEnum.CONSUME)) {
                actor.addEffect(effect);
            }
            if (entity.getStackCount() > 1) {
                entity.modifyStackCount(-1);
            }
            else if (entity.getStackCount() == -1) {}
            else {
                Game.removeItemInSpace(entity);
                entity.dispose();
            }
        }
        else if (actor == Game.player && entity instanceof CharacterEntity && entity.getCreatureSubType() == actor.getCreatureSubType()) {
            Game.gui.chat.appendOutput("Cannabalism is wrong :O");
        }
        else if (actor == Game.player) {
            Game.gui.chat.appendOutput("You can't eat that.");
        }
        if (typeof callback == "function") {
            if (Game.interfaceMode == InterfaceModeEnum.MENU) {
                callback(actor);
            }
            else {
                callback(entity, undefined, actor);
            }
        }
        return 0;
    }
    static actionHold(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasItem(entity)) {
            if (typeof callback == "function") {
                callback();
            }
            return 1;
        }
        if (actor instanceof CharacterEntity) {
            if (actor.hold(entity) != 0) {
                return 1
            }
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionEquip(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasItem(entity)) {
            if (typeof callback == "function") {
                callback();
            }
            return 1;
        }
        if (actor instanceof CharacterEntity) {
            if (actor.equip(entity) != 0) {
                return 1;
            }
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionUnequip(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasItem(entity)) {
            if (typeof callback == "function") {
                callback();
            }
            return 1;
        }
        if (actor instanceof CharacterEntity) {
            if (actor.unequip(entity) != 0) {
                return 1;
            }
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionRelease(entity, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (!actor.hasItem(entity)) {
            if (typeof callback == "function") {
                callback();
            }
            return 1;
        }
        if (actor instanceof CharacterEntity) {
            if (actor.unequip(entity) != 0) {
                return 1;
            }
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionOpen(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (entity.getController() instanceof DoorController) {
            if (entity.isDoorLocked()) {
                if (!actor.hasItem(entity.getKey())) {
                    return 1;
                }
                entity.setLocked(false);
            }
            entity.setOpen();
            Game.playSound("openDoor");
        }
        else if (entity.getController() instanceof FurnitureController) {
            entity.getController().currAnim = entity.getController().opened;
            entity.getController().beginAnimation(entity.getController().open);
            entity.setDefaultAction(ActionEnum.CLOSE);
            entity.addHiddenAvailableAction(ActionEnum.OPEN);
            entity.removeHiddenAvailableAction(ActionEnum.CLOSE);
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionUse(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        if (entity.getController() instanceof LightingController) {
            entity.getController().toggle();
        }
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionLook(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        //...
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionRead(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        //...
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionLay(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        actor.setStance(StanceEnum.LAY);
        actor.getController().setParent(entity.getController().getMesh());
        if (Game.meshProperties.hasOwnProperty(entity.getController().getMesh().name)) {
            let posArray = Game.meshProperties[entity.getController().getMesh().name]["usableArea"];
            let newPos = new BABYLON.Vector3(0, posArray[0][0].y, 0);
            if (entity.getFurnitureType() == FurnitureEnum.BED) {
                newPos.x = posArray[0][1].x - (0.0625 + actor.getController().getMesh().getBoundingInfo().boundingBox.center.z * (entity.getCharacters().size + 1));
            }
            else if (entity.getFurnitureType() == FurnitureEnum.COUCH) {
                newPos.x = posArray[0][1].x - (0.0625 + actor.getController().getMesh().getBoundingInfo().boundingBox.center.z * (entity.getCharacters().size + 1));
            }
            actor.getController().getMesh().position.copyFrom(newPos);
        }
        else {
            let seatingBoundingBox = Game.getMesh(entity.getController().getMesh().name).getBoundingInfo().boundingBox;
            let seatingWidth = (seatingBoundingBox.extendSize.x * entity.getController().getMesh().scaling.x);
            actor.getController().getMesh().position.set(seatingWidth / 2, 0.4, 0);
        }
        actor.getController().getMesh().rotation.copyFrom(entity.getController().getMesh().rotation.add(new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(270), 0)));
        actor.setFurniture(entity);
        actor.getController().doLay();
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    /**
     * Places the actpr near the entity, and sets its parent to the entity
     * TODO: Add actual placement of Characters based on their width
     * @param  {InstancedFurnitureEntity} entity Furniture
     * @param  {AbstractEntity} actor Entity to be placed
     */
    static actionSit(entity = null, actor = Game.player, callback = undefined) {
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                return 2;
            }
        }
        actor.setFurniture(entity);
        actor.setStance(StanceEnum.SIT);
        let seatingBoundingBox = Game.getMesh(entity.getController().getMesh().name).getBoundingInfo().boundingBox;
        let seatingWidth = (seatingBoundingBox.extendSize.x * entity.getController().getMesh().scaling.x);
        actor.getController().getMesh().position.set(seatingWidth / 2, 0, -0.45);
        actor.getController().getMesh().rotation.set(0, 0, 0);
        actor.getController().doSit();
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }
    static actionTalk(entity = null, actor = Game.player, callback = undefined) {
        if (Game.debugMode) console.group(`Running Game::actionTalk(${typeof entity == "object" ? (entity instanceof AbstractEntity ? entity.id : "UNK") : entity}, ${typeof actor == "object" ? (actor instanceof AbstractEntity ? actor.id : "UNK") : actor})`)
        if (!(entity instanceof AbstractEntity)) {
            if (AbstractEntity.has(entity)) {
                entity = AbstractEntity.get(entity);
            }
            else {
                if (Game.debugMode) {
                    console.error("Target entity was invalid.");
                    console.groupEnd();
                }
                return 2;
            }
        }
        if (!(actor instanceof AbstractEntity)) {
            if (AbstractEntity.has(actor)) {
                actor = AbstractEntity.get(actor);
            }
            else {
                if (Game.debugMode) {
                    console.error("Actor entity was invalid.");
                    console.groupEnd();
                }
                return 2;
            }
        }
        if (!(entity.hasDialogue())) {
            if (Game.debugMode) {
                console.error("Target entity doesn't have a dialogue.");
                console.groupEnd();
            }
            return 2;
        }
        Game.gui.dialogue.setDialogue(entity.getDialogue(), entity, actor);
        Game.gui.dialogue.show();
        if (typeof callback == "function") {
            callback(entity, undefined, actor);
        }
        return 0;
    }

    static setEssentialEntity(abstractEntity) {
        abstractEntity.setEssential(true);
        Game.essentialEntities.add(abstractEntity)
        return 0;
    }
    static removeEssentialEntity(abstractEntity) {
        abstractEntity.setEssential(false);
        Game.essentialEntities.delete(abstractEntity);
        return 0;
    }
    static clearEssentialEntities() {
        Game.essentialEntities.forEach(function (abstractEntity) {
            abstractEntity.setEssential(false);
        });
        Game.essentialEntities.clear();
        return 0;
    }

    /**
     * 
     * @param {Cell|string} cell Cell
     * @returns {number}
     */
    static unloadCell(cell) {
        if (!(cell instanceof Cell)) {
            if (Cell.has(cell)) {
                cell = Cell.get(cell);
            }
            else {
                return 2;
            }
        }
        AbstractNode.clear();
        cell.getMeshIDs().forEach(function (meshID) {
            if (Game.meshMaterialMeshes.hasOwnProperty(meshID)) {
                for (let i in Game.meshMaterialMeshes[meshID]) { // for each master mesh...
                    for (let j in Game.meshMaterialMeshes[meshID][i]) { // and for each of the textures applied...
                        Game.removeMesh(Game.meshMaterialMeshes[meshID][i][j]); // to its child meshes, remove them
                    }
                }
            }
        });
        Game.playerCell.meshIDs.forEach((meshID) => {
            Game.removeMesh(meshID);
        });
        Game.playerCell.collisionMeshIDs.forEach((meshID) => {
            Game.removeMesh(meshID);
        });
        Game.playerCell.meshes.forEach((mesh) => {
            Game.removeMesh(mesh);
        });
        return 0;
    }
    static loadCell(cell) {
        if (!(cell instanceof Cell)) {
            if (Cell.has(cell)) {
                cell = Cell.get(cell);
            }
            else {
                return 2;
            }
        }
        Game.loadingCell = true;
        if (Game.playerCell instanceof Cell) {
            Game.unloadCell(Game.playerCell);
        }
        if (cell.skybox == "dayNightCycle") {
            Game.loadSkyMaterial();
            Game.skybox.material.azimuth = cell.skyboxAzimuth;
            Game.skybox.material.inclination = cell.skyboxInclination;
            Game.ambientLight.intensity = cell.ambientLightIntensity;
        }
        else {
            Game.unloadMaterial("dayNightCycle");
        }
        cell.createBackloggedAdditions();
        Game.playerCell = cell;
        return 0;
    }
    static loadSkyMaterial() {
        if (Game.hasLoadedMaterial("dayNightCycle")) {
            return 0;
        }
        let dayNightCycle = new BABYLON.SkyMaterial("dayNightCycle", Game.scene);
        Game.setLoadedMaterial("dayNightCycle", dayNightCycle);
        dayNightCycle.backFaceCulling = false;
        dayNightCycle.azimuth = 0.25;
        dayNightCycle.inclination = 0.0;
        Game.skybox.material = dayNightCycle;
        return 0;
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
        Game.tickWorker.postMessage({
            cmd: "addScheduledEffect",
            msg: {
                "effect":effect.getID(),
                "entity":abstractEntity.getID(),
                "duration":effect.getDuration(),
                "durationInterval":effect.getDurationInterval(),
                "intervalType":effect.getIntervalType(),
                "intervalNth":effect.getIntervalNth(),
                "priority":effect.getPriority()
            }
        });
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
        Game.tickWorker.postMessage({
            cmd: "removeScheduledEffect",
            msg: {
                "effect":effect.getID(),
                "entity":abstractEntity.getID()
            }
        });
    }
    static addScheduledCommand(addTick, abstractEntityID, commandString) {
        addTick = (Number.parseInt(addTick)|0) + Game.currentTick;
        return Game.setScheduledCommand(addTick, abstractEntityID, commandString);
    }
    static setScheduledCommand(scheduledTick = 0, abstractEntityID, commandString = "") {
        if (Game.debugMode) {console.group(`Running Game.setScheduledCommand(...)`)}
        scheduledTick = Number.parseInt(scheduledTick);
        if (scheduledTick <= Game.currentTick) {
            if (Game.debugMode) {console.error("Tick was below or at current tick; cannot use."); console.groupEnd();}
            return 1;
        }
        if (abstractEntityID instanceof AbstractEntity) {
            abstractEntityID = abstractEntityID.getID();
        }
        else if (!AbstractEntity.has(abstractEntityID)) {
            if (Game.debugMode) {console.error(`Entity (${abstractEntityID}) doesn't exist.`); console.groupEnd();}
            return 1;
        }
        if (AbstractEntity.get(abstractEntityID).isDisabled()) {
            if (Game.debugMode) {console.warn(`Entity (${abstractEntityID}) is disabled and can't be used.`); console.groupEnd();}
            return 1;
        }
        commandString = String(commandString);
        if (commandString.length == 0) {
            if (Game.debugMode) {console.error("Command missing or invalid."); console.groupEnd();}
            return 1;
        }
        if (Game.debugMode) {
            console.log("Sending scheduled command with...");
            console.info(`tick: ${scheduledTick}`);
            console.info(`entity: ${abstractEntityID}`);
            console.info(`commandString: ${commandString}`);
            console.groupEnd();
        }
        Game.tickWorker.postMessage({
            cmd: "setScheduledCommand",
            msg: {
                "tick":scheduledTick,
                "entity":abstractEntityID,
                "commandString":commandString
            }
        });
        return 0;
    }
    static setDebugMode(debugMode) {
        Game.debugMode = debugMode == true;
    }
    static enableDebugMode() {
        return Game.setDebugMode(true);
    }
    static disableDebugMode() {
        return Game.setDebugMode(false);
    }
    static setInterfaceMode(interfaceMode = InterfaceModeEnum.NONE) {
        if (Game.interfaceMode == interfaceMode) {
            return 0;
        }
        if (InterfaceModeEnum.properties.hasOwnProperty(interfaceMode)) { }
        else if (isNaN(interfaceMode) && InterfaceModeEnum.hasOwnProperty(interfaceMode)) {
            interfaceMode = InterfaceModeEnum[interfaceMode];
        }
        else {
            return 2;
        }
        if (Game.debugMode) console.log(`Running Game::setInterfaceMode(${InterfaceModeEnum.properties[interfaceMode].name})`);
        if (interfaceMode == InterfaceModeEnum.WRITING) {
            Game.interfaceMode = InterfaceModeEnum.WRITING;
            return 0;
        }
        Game.previousInterfaceMode = Game.interfaceMode;
        Game.interfaceMode = interfaceMode;
        if (Game.interfaceMode == InterfaceModeEnum.EDIT) {
            EditControls.clearPickedMesh();
            EditControls.clearPickedController();
        }
        switch (Game.interfaceMode) {
            case InterfaceModeEnum.CHARACTER: {
                Game.controls = CharacterControls;
                break;
            }
            case InterfaceModeEnum.DIALOGUE: {
                Game.controls = DialogueControls;
                break;
            }
            case InterfaceModeEnum.MENU: {
                Game.controls = MenuControls;
                break;
            }
            case InterfaceModeEnum.EDIT: {
                Game.controls = EditControls;
                break;
            }
        }
        return 0;
    }
    static getInterfaceMode() {
        return Game.interfaceMode;
    }
    static setMeshScaling(mesh, scaling = BABYLON.Vector3.One()) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            if (!Game.hasMesh(mesh)) {
                return 2;
            }
            mesh = Game.getMesh(mesh);
        }
        mesh.scaling.copyFrom(scaling);
        return 0;
    }
    static setMeshRotation(mesh, rotation = BABYLON.Vector3.Zero()) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            if (!Game.hasMesh(mesh)) {
                return 2;
            }
            mesh = Game.getMesh(mesh);
        }
        mesh.rotation.copyFrom(rotation);
        return 0;
    }
    static setMeshPosition(mesh, position = BABYLON.Vector3.Zero()) {
        if (!(mesh instanceof BABYLON.AbstractMesh)) {
            if (!Game.hasMesh(mesh)) {
                return 2;
            }
            mesh = Game.getMesh(mesh);
        }
        mesh.position.copyFrom(position);
        return 0;
    }

    static getSkillAbility(proficiencyEnum) {
        if (!ProficiencyEnum.properties.hasOwnProperty(proficiencyEnum)) {
            if (ProficiencyEnum.hasOwnProperty(proficiencyEnum)) {
                proficiencyEnum = ProficiencyEnum[proficiencyEnum];
            }
            else {
                return 0;
            }
        }
        switch (proficiencyEnum) {
            case ProficiencyEnum.ATHLETICS: {
                return AbilityEnum.STRENGTH;
            }
            case ProficiencyEnum.ACROBATICS:
            case ProficiencyEnum.SLEIGHT_OF_HAND:
            case ProficiencyEnum.STEALTH: {
                return AbilityEnum.DEXTERITY;
            }
            case ProficiencyEnum.ARCANA:
            case ProficiencyEnum.HISTORY:
            case ProficiencyEnum.INVESTIGATION:
            case ProficiencyEnum.NATURE:
            case ProficiencyEnum.RELIGION: {
                return AbilityEnum.INTELLIGENCE;
            }
            case ProficiencyEnum.ANIMAL_HANDLING:
            case ProficiencyEnum.INSIGHT:
            case ProficiencyEnum.MEDICINE:
            case ProficiencyEnum.PERCEPTION:
            case ProficiencyEnum.SURVIVAL: {
                return AbilityEnum.WISDOM;
            }
            case ProficiencyEnum.DECEPTION:
            case ProficiencyEnum.INTIMIDATION:
            case ProficiencyEnum.PERFORMANCE:
            case ProficiencyEnum.PERSUASION: {
                return AbilityEnum.CHARISMA;
            }
        }
        return 0;
    }
    static calculateProficiencyByLevel(level) {
        return Math.floor((level + 7) / 4);
    }
    static calculateProficiencyByExperience(experience) {
        return Game.calculateProficiencyByLevel(Game.calculateLevel(experience));;
    }
    static calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }
    static calculateLevel(experiencePoints) {
        experiencePoints = Tools.filterInt(experiencePoints);
        if (experiencePoints >= 355000) {
            return 20;
        }
        else if (experiencePoints >= 305000) {
            return 19;
        }
        else if (experiencePoints >= 265000) {
            return 18;
        }
        else if (experiencePoints >= 225000) {
            return 17;
        }
        else if (experiencePoints >= 195000) {
            return 16;
        }
        else if (experiencePoints >= 165000) {
            return 15;
        }
        else if (experiencePoints >= 140000) {
            return 14;
        }
        else if (experiencePoints >= 120000) {
            return 13;
        }
        else if (experiencePoints >= 100000) {
            return 12;
        }
        else if (experiencePoints >= 85000) {
            return 11;
        }
        else if (experiencePoints >= 64000) {
            return 10;
        }
        else if (experiencePoints >= 48000) {
            return 9;
        }
        else if (experiencePoints >= 34000) {
            return 8;
        }
        else if (experiencePoints >= 23000) {
            return 7;
        }
        else if (experiencePoints >= 14000) {
            return 6;
        }
        else if (experiencePoints >= 6500) {
            return 5;
        }
        else if (experiencePoints >= 2700) {
            return 4;
        }
        else if (experiencePoints >= 900) {
            return 3;
        }
        else if (experiencePoints >= 300) {
            return 2;
        }
        else if (experiencePoints >= 0) {
            return 1;
        }
        return 0;
    }
    static calculateAttack(attacker, weapon = undefined, advantage = undefined) {
        let attackRoll = Game.roll(1, 20);
        if (advantage === true) {
            let tempRoll = Game.roll(1, 20);
            if (tempRoll > attackRoll) {
                attackRoll = tempRoll;
            }
        }
        else if (advantage === false) {
            let tempRoll = Game.roll(1, 20);
            if (tempRoll < attackRoll) {
                attackRoll = tempRoll;
            }
        }
        if (attackRoll == 20) {
            return 20;
        }
        else if (attackRoll == 1) {
            return 1;
        }
        if (weapon == undefined) {
            if (attacker.isRightHanded() && attacker.getEquipment()[ApparelSlotEnum.HAND_R] instanceof InstancedWeaponEntity) {
                weapon = attacker.getEquipment()[ApparelSlotEnum.HAND_R] || attacker.getEquipment()[ApparelSlotEnum.HAND_L];
            }
            else if (attacker.isLeftHanded() && attacker.getEquipment()[ApparelSlotEnum.HAND_L] instanceof InstancedWeaponEntity) {
                weapon = attacker.getEquipment()[ApparelSlotEnum.HAND_L] || attacker.getEquipment()[ApparelSlotEnum.HAND_R];
            }
        }
        if (weapon instanceof InstancedWeaponEntity || weapon instanceof WeaponEntity) {
            if (attacker.hasProficiency(weapon)) {
                attackRoll += attacker.getProficiencyBonus();
            }
            if (weapon.isFinesse()) {
                if (attacker.getDexterity() > attacker.getStrength()) {
                    attackRoll += Game.calculateAbilityModifier(attacker.getDexterity());
                }
                else {
                    attackRoll += Game.calculateAbilityModifier(attacker.getStrength());
                }
            }
            else if (weapon.isRange()) {
                attackRoll += Game.calculateAbilityModifier(attacker.getDexterity());
            }
            else if (weapon.getWeaponCategory() == WeaponCategoryEnum.SIMPLE_MELEE || weapon.getWeaponCategory() == WeaponCategoryEnum.MARTIAL_MELEE) {
                attackRoll += Game.calculateAbilityModifier(attacker.getStrength());
            }
        }
        return attackRoll;
    }
    static calculateDamage(target, attacker, weapon, critical = false) {
        let damageRoll = 0;
        if (weapon instanceof InstancedWeaponEntity || weapon instanceof WeaponEntity) {
            damageRoll = Game.calculateDamageWithWeapon(target, attacker, weapon, critical);
        }
        else if (weapon instanceof Spell) {
            damageRoll = Game.calculateDamageWithSpell(target, attacker, weapon, critical);
        }
        else {
            damageRoll = Game.calculateDamageWithUnarmed(target, attacker, critical);
        }
        return damageRoll;
    }
    static calculateDamageWithWeapon(target, attacker, weapon, critical = false) {
        let damageRoll = 0;
        if (weapon.getHealth() == 0) { // It's basically an improvised weapon at this point
            damageRoll = Game.roll(1, 4); // roll 1d4
        }
        else {
            damageRoll = Game.roll(weapon.getDamageRollCount() * (critical ? 2 : 1), weapon.getDamageRoll());
            if (weapon.isFinesse()) {
                if (attacker.getDexterity() > attacker.getStrength()) {
                    damageRoll += Game.calculateAbilityModifier(attacker.getDexterity());
                }
                else {
                    damageRoll += Game.calculateAbilityModifier(attacker.getStrength());
                }
            }
            else {
                let weaponCategory = weapon.getWeaponCategory();
                if (weaponCategory == WeaponCategoryEnum.SIMPLE_RANGED) {
                    damageRoll += Game.calculateAbilityModifier(attacker.getDexterity());
                }
                else if (weaponCategory == WeaponCategoryEnum.MARTIAL_RANGED) {
                    damageRoll += Game.calculateAbilityModifier(attacker.getDexterity());
                }
                else if (weaponCategory == WeaponCategoryEnum.SIMPLE_MELEE) {
                    damageRoll += Game.calculateAbilityModifier(attacker.getStrength());
                }
                else if (weaponCategory == WeaponCategoryEnum.MARTIAL_MELEE) {
                    damageRoll += Game.calculateAbilityModifier(attacker.getStrength());
                }
            }
        }
        if (target.isImmuneTo(weapon.getDamageType())) {
            damageRoll = 0;
        }
        else if (target.isResistantTo(weapon.getDamageType())) {
            damageRoll /= 2;
        }
        else if (target.isVulnerableTo(weapon.getDamageType())) {
            damageRoll *= 2;
        }
        return damageRoll;
    }
    static calculateDamageWithSpell(target, attacker, spell, critical = false) {
        let damageRoll = 0;
        damageRoll = Game.roll(spell.getDamageRollCount(), spell.getDamageRoll());
        damageRoll += Game.calculateAbilityModifier(attacker.getIntelligence());
        return damageRoll;
    }
    static calculateDamageWithUnarmed(target, attacker, critical = false) {
        let damageRoll = 0;
        switch (attacker.getSize()) {
            case SizeEnum.FINE:
            case SizeEnum.DIMINUTIVE: { damageRoll = 0; }
            case SizeEnum.SMALL: { damageRoll = Game.roll(1, 2) }
            case SizeEnum.MEDIUM: { damageRoll = Game.roll(1, 3) }
            case SizeEnum.LARGE: { damageRoll = Game.roll(1, 4) }
            case SizeEnum.HUGE: { damageRoll = Game.roll(1, 6) }
            case SizeEnum.GARGANTUAN: { damageRoll = Game.roll(1, 8) }
            case SizeEnum.COLOSSAL: { damageRoll = Game.roll(2, 6) }
        }
        return damageRoll;
    }
    /**
     * Roll a die
     * @param {number} die Number of times to roll
     * @param {number} faces Number of faces
     * @param {RollEnum} rollType
     */
    static roll(die = 1, faces = 6, rollType = RollEnum.TOTAL) {
        switch (rollType) {
            case RollEnum.TOTAL: {
                let total = 0;
                for (let i = 0; i < die; i++) {
                    total += Math.ceil(Math.random() * faces);
                }
                return Number.parseFloat(total);
            }
            case RollEnum.MIN: {
                let min = 1;
                let roll = 0;
                for (let i = 0; i < die; i++) {
                    roll = Math.ceil(Math.random() * faces);
                    if (roll < min) {
                        min = roll;
                    }
                }
                return Number.parseFloat(min);
            }
            case RollEnum.AVG: {
                let total = 0;
                for (let i = 0; i < die; i++) {
                    total += Math.ceil(Math.random() * faces);
                }
                return Number.parseFloat(total / die);
            }
            case RollEnum.MAX: {
                let max = 1;
                let roll = 0;
                for (let i = 0; i < die; i++) {
                    roll = Math.ceil(Math.random() * faces);
                    if (roll > max) {
                        max = roll;
                    }
                }
                return Number.parseFloat(max);
            }
        }
        return 1.0;
    }
    /**
     * Returns whether or not entityB is within distance of entityA
     * @param {AbstractEntity} entityA The entity, with an EntityController
     * @param {AbstractEntity} entityB Its target, with an EntityController
     * @param {number} distance Distance
     * @returns {boolean} Whether or not they're within smacking distance
     */
    static withinRange(entityA, entityB, distance = 0.6) {
        if (!(entityA instanceof AbstractEntity)) {
            entityA = InstancedEntity.get(entityA) || InstancedEntity.get(entityA);
            if (!(entityA instanceof AbstractEntity)) {
                return false;
            }
        }
        if (!(entityB instanceof AbstractEntity)) {
            entityB = InstancedEntity.get(entityB) || InstancedEntity.get(entityB);
            if (!(entityB instanceof AbstractEntity)) {
                return false;
            }
        }
        if (!entityA.hasController() || !entityB.hasController()) {
            return false;
        }
        else if (!entityA.getController().hasMesh() || !entityB.getController().hasMesh()) {
            return false;
        }
        if (distance <= 0) {
            distance = entityA.getHeight();
            if (entityB.getHeight() > distance) {
                distance = entityB.getHeight();
            }
            distance = distance * 0.75; // assuming arm length is half of the body length, idk
        }
        return entityA.controller.mesh.position.equalsWithEpsilon(entityB.controller.mesh.position, distance);
    }
    /**
     * Whether or not entityB is in entityA's point of view (epislon value)
     * @param {AbstractEntity} entityA The entity that's looking, with an EntityController
     * @param {AbstractEntity} entityB Its target, with an EntityController
     * @param {number} epsilon Episode in radians
     * @returns {boolean} Whether or not they're withing the point of view
     */
    static inFrontOf(entityA, entityB, epsilon = 0.3926991) {
        if (!(entityA instanceof AbstractEntity)) {
            entityA = InstancedEntity.get(entityA) || InstancedEntity.get(entityA);
            if (!(entityA instanceof AbstractEntity)) {
                return false;
            }
        }
        if (!(entityB instanceof AbstractEntity)) {
            entityB = InstancedEntity.get(entityB) || InstancedEntity.get(entityB);
            if (!(entityB instanceof AbstractEntity)) {
                return false;
            }
        }
        if (!entityA.hasController() || !entityB.hasController()) {
            return false;
        }
        else if (!entityA.getController().hasMesh() || !entityB.getController().hasMesh()) {
            return false;
        }
        let aPos = new BABYLON.Vector2(entityA.controller.mesh.position.x, entityA.controller.mesh.position.z);
        let bPos = entityA.controller.mesh.calcMovePOV(0, 0, 1);
        bPos = aPos.add(new BABYLON.Vector2(bPos.x, bPos.z));
        let cPos = new BABYLON.Vector2(entityB.controller.mesh.position.x, entityB.controller.mesh.position.z);
        let bAng = BABYLON.Angle.BetweenTwoPoints(aPos, bPos);
        let aAng = BABYLON.Angle.BetweenTwoPoints(aPos, cPos);
        if (aAng.radians() - bAng.radians() <= epsilon) {
            return true;
        }
        return false;
    }
}
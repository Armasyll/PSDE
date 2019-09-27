console.log("Initializing items...");

Game.createItemEntity("alBuildingLocationKey", "Pack Street Bldg 3 Key", "A simple key to Pack Street Bldg 3", "keyIcon", "key01", "key", ItemEnum.KEY);
Game.createItemEntity("pandorasBoxLocationKey", "Key to Pandora's Box", "A complex brass key meant for digitigrade mammals to Pandora's Box.", "pandorasBoxLocationKeyIcon", "key01", undefined, ItemEnum.KEY);

Game.createItemEntity("packstreet23StrangeNewDay", "Pack Street Chapter 23", "In the wake of Bellwether's arrest, Remmy takes stock of a changed city.", "packstreet23StrangeNewDayIcon", "bookHardcoverClosed01", "packStreetChapter23", ItemEnum.BOOK);
Game.createItemEntity("packstreet24PaintJob", "Pack Street Chapter 24", "Remmy finds himself doing community service.", "packstreet24StrangeNewDayIcon", "bookHardcoverClosed01", "packStreetChapter24", ItemEnum.BOOK);
Game.createItemEntity("theLesserKeyOfSolomon", "The Lesser Key of Solomon", "The Lesser Key of Solomon, also known as Clavicula Salomonis Regis or Lemegeton, is an anonymous grimoire on demonology. It was compiled in the mid-17th century, mostly from materials a couple of centuries older.", "theLesserKeyOfSolomonIcon", "bookHardcoverClosed01", "theLesserKeyOfSolomon", ItemEnum.BOOK);
Game.createItemEntity("bottle03RedSarcophagusJuice", "Red Sarcophagus Juice", "A small sample of some red liquid from the bottom of an obsidian sarcophagus.", "bottle03RedSarcophagusJuiceIcon", "bottle03", "bottle03RedSarcophagusJuice", ItemEnum.CONSUMABLE);
Game.createItemEntity("bottle04RedSarcophagusJuice", "Red Sarcophagus Juice", "A flask of some red liquid from the bottom of an obsidian sarcophagus.", "bottle04RedSarcophagusJuiceIcon", "bottle04", "bottle03RedSarcophagusJuice", ItemEnum.CONSUMABLE);
Game.createItemEntity("bottle05RedSarcophagusJuice", "Red Sarcophagus Juice", "A bottle of some red liquid from the bottom of an obsidian sarcophagus.", "bottle05RedSarcophagusJuiceIcon", "bottle05", "bottle03RedSarcophagusJuice", ItemEnum.CONSUMABLE);
Game.createItemEntity("mountainChocolateWrapper", "Giant Toblerone", "A giant, delicious toblerone! You don't deserve it, though.", "mountainChocolate01Icon", "mountainChocolateWrapper01", "vChocolateV", ItemEnum.CONSUMABLE);
Game.createItemEntity("mountainChocolateBar", "Giant Toblerone", "A giant, delicious toblerone! You don't deserve it, though.", "mountainChocolate01Icon", "mountainChocolateBar01", "vChocolateV", ItemEnum.CONSUMABLE);
Game.createItemEntity("cheeseWheel", "Cheese Wheel", "A wheel of cheese.", "cheeseWheelIcon", "cheeseWheel", "cheeseWheel", ItemEnum.CONSUMABLE, ConsumableEnum.FOOD);
Game.createItemEntity("cheeseWheelSansWedge", "Partial Cheese Wheel", "A partially cut wheel of cheese.", "cheeseWheelSansWedgeIcon", "cheeseWheelSansWedge", "cheeseWheel", ItemEnum.CONSUMABLE, ConsumableEnum.FOOD);
Game.createItemEntity("cheeseWedge", "Cheese Wedge", "A wedge of cheese.", "cheeseWedgeIcon", "cheeseWedge", "cheeseWheel", ItemEnum.CONSUMABLE, ConsumableEnum.FOOD);
Game.createItemEntity("apple01", "Apple", "An apple.", "apple01Icon", "apple01", "apple01", ItemEnum.CONSUMABLE, ConsumableEnum.FOOD);

Game.createItemEntity("barbute01", "Barbute", "", "barbute01Icon", "barbute01", undefined, ItemEnum.APPAREL, ApparelSlotEnum.HEAD);
Game.createItemEntity("barbuteHorned01", "Horned Barbute", "", "barbuteHorned01Icon", "barbuteHorned01", undefined, ItemEnum.APPAREL, ApparelSlotEnum.HEAD);
Game.createItemEntity("birdMask01", "Bird Mask", "A mask resembling a bird's beak.", "birdMask01Icon", "birdMask01", "birdMask01", ItemEnum.APPAREL, ApparelSlotEnum.HEAD);
Game.createItemEntity("wizardHat02", "Wizard Hat", "A silly, wide-brimmed hat.", "wizardHat02Icon", "wizardHat02", undefined, ItemEnum.APPAREL, ApparelSlotEnum.HEAD);
Game.createItemEntity("bracer01l", "Left Bracer", "Left iron bracer.", undefined, "bracer01.l", undefined, ItemEnum.APPAREL, ApparelSlotEnum.FOREARM_L);
Game.createItemEntity("bracer01r", "Right Bracer", "Right iron bracer.", undefined, "bracer01.r", undefined, ItemEnum.APPAREL, ApparelSlotEnum.FOREARM_R);
Game.createItemEntity("pauldron01l", "Left Pauldron", "Left iron pauldron.", undefined, "pauldron01.l", undefined, ItemEnum.APPAREL, ApparelSlotEnum.SHOULDER_L);
Game.createItemEntity("pauldron01r", "Right Pauldron", "Right iron pauldron.", undefined, "pauldron01.r", undefined, ItemEnum.APPAREL, ApparelSlotEnum.SHOULDER_R);

Game.createItemEntity("ring01Silver", "Silver Ring", "A simple silver ring.", "ring01SilverIcon", "ring01", "ring02Silver", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);
Game.createItemEntity("ring01Gold", "Gold Ring", "A simple gold ring.", "ring01GoldIcon", "ring01", "ring02Gold", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);
Game.createItemEntity("ring02SilverRuby", "Silver Ruby Ring", "A silver ring with an inset ruby.", "ring02SilverIcon", "ring02", "ring02Silver", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);
Game.createItemEntity("ring02GoldRuby", "Gold Ruby Ring", "A gold ring with an inset ruby.", "ring02GoldIcon", "ring02", "ring02Gold", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);
Game.createItemEntity("ring03SilverDRuby", "Damaged Silver Ruby Ring", "A silver ring with a damaged inset ruby.", "ring03SilverDRubyIcon", "ring03", "ring02SilverBrokenRuby", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);
Game.createItemEntity("ring03GoldDRuby", "Damaged Gold Ruby Ring", "A gold ring with a damaged inset ruby.", "ring03GoldDRubyIcon", "ring03", "ring02GoldBrokenRuby", ItemEnum.APPAREL, ApparelSlotEnum.FINGERS);

Game.createItemEntity("bottle01", "Bottle", "A simple bottle.", "bottle01Icon", "bottle01", undefined, ItemEnum.GENERAL);
Game.createItemEntity("cup01", "Cup", "A simple cup.", "cup01Icon", "cup01", undefined, ItemEnum.GENERAL);
Game.createItemEntity("glass01", "Glass", "A simple glass.", "glass01Icon", "glass01", undefined, ItemEnum.GENERAL);
Game.createItemEntity("plate01", "Plate", "A simple plate.", "plate01Icon", "plate01", undefined, ItemEnum.GENERAL);
Game.createItemEntity("trumpet01", "Trumpet", "A simple trumpet.", "trumpet01Icon", "trumpet01", undefined, ItemEnum.GENERAL);
Game.createItemEntity("dice01", "Die", "A beige die.", "dice01Icon", "cube", "dice01Texture", ItemEnum.GENERAL);

Game.createItemEntity("axe03", "Cheap Axe", "", "axe03Icon", "axe03", "metalTool01", ItemEnum.WEAPON, WeaponEnum.HANDAXE);
Game.createItemEntity("axe01", "Axe", "", "axe01Icon", "axe01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.HANDAXE);
Game.createItemEntity("axe02", "Curved Axe", "", "axe02Icon", "axe02", "metalTool01", ItemEnum.WEAPON, WeaponEnum.HANDAXE);
Game.createItemEntity("battleAxe01", "Double-headed Axe", "A double-headed axe.", "battleAxe01Icon", "battleAxe01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.BATTLEAXE);
Game.createItemEntity("cross01", "Cross", "A metal-capped cross.", "cross01Icon", "cross01", "cross01", ItemEnum.WEAPON, WeaponEnum.CLUB);
Game.createItemEntity("cudgel01", "Cudgel", "A chunk of metal attached to a stick.", "cudgel01Icon", "cudgel01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.CLUB);
Game.createItemEntity("forgeHammer01", "Blacksmith's Hammer", "", "forgeHammer01Icon", "forgeHammer01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.LIGHTHAMMER);
Game.createItemEntity("forgeHammer02", "Blacksmith's Hammer", "", "forgeHammer02Icon", "forgeHammer02", "metalTool01", ItemEnum.WEAPON, WeaponEnum.LIGHTHAMMER);
Game.createItemEntity("gladius01", "Gladius", "", "gladius01Icon", "gladius01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.SHORTSWORD);
Game.createItemEntity("glaive01", "Glaive", "", "glaive01Icon", "glaive01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.GLAIVE);
Game.createItemEntity("harpe", "Harpe", "A Sword with a curved falange. Not a harp, the instrument.", "harpeIcon", "harpe", "metalTool01", ItemEnum.WEAPON, WeaponEnum.SHORTSWORD);
Game.createItemEntity("katana01", "Katana", "", "katana01Icon", "katana01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.LONGSWORD);
Game.createItemEntity("knife01", "Knife", "A dull knife.", "knife01Icon", "knife01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.DAGGER);
Game.createItemEntity("morningstar", "Morningstar", "A spiked mace.", "morningstarIcon", "morningstar", "metalTool01", ItemEnum.WEAPON, WeaponEnum.MORNINGSTAR);
Game.createItemEntity("shortSword01", "Short Sword", "A simple short Sword.", "shortSword01Icon", "shortSword01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.SHORTSWORD);
Game.createItemEntity("shovel01", "Shovel", "A plain shovel.", "shovel01Icon", "shovel01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.CLUB);
Game.createItemEntity("spear01", "Spear", "A wooden spear with a metal tip.", "spear01Icon", "spear01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.SPEAR);
Game.createItemEntity("staff01", "Staff", "A plain staff.", "staff01Icon", "staff01", undefined, ItemEnum.WEAPON);
Game.createItemEntity("staff02", "Staff", "A staff with a forked, circular head.", "staff02Icon", "staff02", undefined, ItemEnum.WEAPON);
Game.createItemEntity("staff03", "Staff", "A staff with a full circle head.", "staff03Icon", "staff03", undefined, ItemEnum.WEAPON);
Game.createItemEntity("staff04", "Staff", "A staff with a hooked head.", "staff04Icon", "staff04", undefined, ItemEnum.WEAPON);
Game.createItemEntity("staff05", "Staff", "A staff with a snake's head.", "staff05Icon", "staff05", undefined, ItemEnum.WEAPON);
Game.createItemEntity("sword01", "Sword", "A simple Sword.", "sword01Icon", "sword01", "metalTool01", ItemEnum.WEAPON);
Game.createItemEntity("wand01", "Wand", "A simple Sword.", "wand01Icon", "wand01", undefined, ItemEnum.WEAPON);
Game.createItemEntity("wand02", "Wand", "A fine Sword.", "wand02Icon", "wand02", undefined, ItemEnum.WEAPON);
Game.createItemEntity("wand03", "Gnarled Wand", "A gnarled wand.", "wand03Icon", "wand03", undefined, ItemEnum.WEAPON);
Game.createItemEntity("warhammer01", "Warhammer", "A dangerous looking, spiked hammer.", "warhammer01Icon", "warhammer01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.WARHAMMER);
Game.createItemEntity("woodenMallet", "Wooden Mallet", "A mallet made from unrefined wood.", "mallet01Icon", "mallet01", "woodenMallet", ItemEnum.WEAPON, WeaponEnum.LIGHTHAMMER);
Game.createItemEntity("pickaxe01", "Pickaxe", "A pickaxe.", "pickaxe01Icon", "pickaxe01", "metalTool01", ItemEnum.WEAPON, WeaponEnum.WARPICK);
Game.createItemEntity("stick01", "Short Stick", "A short stick.", "stick01Icon", "stick01", "stick01", ItemEnum.WEAPON);
Game.createItemEntity("stick03", "Stick", "A stick.", "stick03Icon", "stick03", "stick01", ItemEnum.WEAPON);
Game.createItemEntity("stick04", "Long Stick", "A long stick.", "stick04Icon", "stick04", "stick01", ItemEnum.WEAPON);
Game.createItemEntity("stick02", "Broad Stick", "A broad stick.", "stick02Icon", "stick02", "woodenMallet", ItemEnum.WEAPON);
Game.createItemEntity("sticc", "Stick", "A stick.", "stick01Icon", "stick01", "stick01", ItemEnum.WEAPON);
Game.createItemEntity("rocc", "Rock", "A rock.", "rock01Icon", "rock01", "rock01", ItemEnum.WEAPON);
Game.createItemEntity("kokiriSword", "Small Sword", "A treasured sword.", undefined, "kokiriSword", "kokiriSword", ItemEnum.WEAPON);

Game.createItemEntity("dekuShield", "Small Shield", "A wooden shield.", undefined, "dekuShield", "dekuShield", ItemEnum.SHIELD);

Game.createItemEntity("flawedGem", "Flawed Grey Gem", "A grey gem with a minor imperfection.", "gem03Icon", "gem03", undefined, ItemEnum.GENERAL);
Game.createItemEntity("regularGem", "Regular Grey Gem", "A grey gem of passing quality.", "gem04Icon", "gem04", undefined, ItemEnum.GENERAL);
Game.createItemEntity("exceptionalGem", "Exceptional Grey Gem", "An exceptional, grey-coloured gem.", "gem05Icon", "gem05", undefined, ItemEnum.GENERAL);
Game.createItemEntity("flawlessGem", "Flawless Grey Gem", "A flawless grey gem.", "gem06Icon", "gem06", undefined, ItemEnum.GENERAL);
Game.createItemEntity("perfectGem", "Perfect Grey Gem", "A grey gem of perfect quality.", "gem08Icon", "gem08", undefined, ItemEnum.GENERAL);
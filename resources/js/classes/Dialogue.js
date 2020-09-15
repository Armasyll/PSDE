/**
 * Dialogue
 */
class Dialogue {
    /**
     * Creates a Dialogue
     * @param {string} id       Unique ID
     * @param {string} title    Title
     * @param {string} text     String, or Function, with the parameters _them and _you, that returns a String
     * @param {...Dialogue} _options  Dialogue, Dialogue and Function array, or a Dialogue, Title, and Function array, with the function returning true or false deciding whether or not the Dialogue is shown.
     * @returns {Dialogue}  Dialogue
     * @example new Dialogue("exampleA", "Example A", "This is a test!")
     * @example new Dialogue("exampleB", "Example B", "This is another test!")
     * @example new Dialogue("exampleC", "Example C", "Yet another test!", ["exampleA", function(){return true;}], exampleB, ["exampleB", "Overrides ExampleB Title", function(){return (1 == 1 ? true : false);}])
     * @example new Dialogue("exampleD", "Example D", function(_them, _you) {return `Last example, ${_you.getFullName()}, I swear!`;}, "exampleA", "exampleB", "exampleC")
     */
    constructor(id = "", title = "", text = "") {
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        if (typeof text != "string" && typeof text != "function") {
            return null;
        }

        this.id = id;
        this.title = "";
        this.text = "";
        this.textType = 0;
        this.options = {};
        this.optionsCount = 0;
        this.parentOptions = {};
        this.parentOptionsCount = 0;
        this.enabled = true;

        this.setTitle(title);
        this.setText(text);

        Dialogue.set(this.id, this);
    }
    getID() {
        return this.id;
    }
    setTitle(title) {
        title = Tools.filterName(title);
        if (typeof title != "string") {
            title = "";
        }
        this.title = title;
        return this;
    }
    getTitle() {
        return this.title;
    }
    setText(text) {
        if (typeof text == "string") {
            this.text = text;
            this.textType = 0;
        }
        else if (typeof text == "function") {
            this.text = text;
            this.textType = 1;
        }
        else {
            this.text = "";
            this.textType = 0;
        }
        return this;
    }
    getText(them = undefined, you) {
        if (typeof this.text == "string") {
            return this.text;
        }
        else if (typeof this.text == "function") {
            if (!(them instanceof AbstractEntity)) {
                if (Entity.has(them)) {
                    them = Entity.get(them);
                }
                else {
                    them = undefined;
                }
            }
            if (!(you instanceof AbstractEntity)) {
                if (Entity.has(you)) {
                    you = Entity.get(you);
                }
            }
            return this.text(them, you);
        }
        else {
            return "";
        }
    }
    /**
     * Returns a numerical value representing this dialogue's type of text.
     * @return {number} 0: String, 1: Function.
     */
    getTextType() {
        return this.textType || 0;
    }
    hasOptions() {
        return this.optionsCount > 0;
    }
    getOptions() {
        return this.options;
    }
    setOption(id = undefined, dialogue, title, condition) {
        let dialogueOption = new DialogueOption(id, dialogue, title, condition);
        if (!(dialogueOption instanceof DialogueOption)) {
            return undefined;
        }
        this.options[dialogueOption.getID()] = dialogueOption;
        this.optionsCount += 1;
        return dialogueOption;
    }
    removeOption(dialogueOption) {
        if (dialogueOption instanceof DialogueOption) {
            dialogueOption = dialogueOption.getID();
        }
        dialogueOption = Tools.filterID(dialogueOption);
        if (!(this.options.hasOwnProperty(dialogueOption))) {
            return true;
        }
        if (this.options[dialogueOption].getDialogue() instanceof Dialogue) {
            this.options[dialogueOption].getDialogue().removeParentOption(dialogueOption);
        }
        this.options[dialogueOption].dispose();
        delete this.options[dialogueOption];
        this.optionsCount -= 1;
        return true;
    }
    setParentOption(dialogueOption) {
        if (!(dialogueOption instanceof DialogueOption)) {
            return undefined;
        }
        this.parentOptions[dialogueOption.getID()] = dialogueOption;
        this.parentOptionsCount += 1;
    }
    removeParentOption(dialogueOption) {
        if (dialogueOption instanceof DialogueOption) {
            dialogueOption = dialogueOption.getID();
        }
        dialogueOption = Tools.filterID(dialogueOption);
        if (!(this.parentOptions.hasOwnProperty(dialogueOption))) {
            return true;
        }
        this.parentOptions[dialogueOption].dispose();
        delete this.parentOptions[dialogueOption];
        this.parentOptionsCount -= 1;
        return true;
    }
    isEnabled() {
        return this.enabled == true;
    }
    setEnabled(isEnabled = true) {
        this.enabled = (isEnabled == true);
        return this;
    }
    dispose() {
        this.enabled = false;
        for (let option in this.parentOptions) {
            this.parentOptions[option].dispose();
            delete this.parentOptions[option];
        }
        for (let option in this.options) {
            this.options[option].dispose();
            delete this.options[option];
        }
        Dialogue.remove(this.id);
        return 0;
    }
    getClassName() {
        return "Dialogue";
    }

    static initialize() {
        Dialogue.dialogueList = {};
    }
    static get(id) {
        if (Dialogue.has(id)) {
            return Dialogue.dialogueList[id];
        }
        return 1;
    }
    static has(id) {
        return Dialogue.dialogueList.hasOwnProperty(id);
    }
    static set(id, dialogue) {
        Dialogue.dialogueList[id] = dialogue;
        return 0;
    }
    static remove(id) {
        delete Dialogue.dialogueList[id];
        return 0;
    }
    static list() {
        return Dialogue.dialogueList;
    }
    static clear() {
        for (let i in Dialogue.dialogueList) {
            Dialogue.dialogueList[i].dispose();
        }
        Dialogue.dialogueList = {};
        return 0;
    }
}
Dialogue.initialize();
class DialogueOption {
    constructor(id = undefined, dialogue, title = undefined, condition = undefined) {
        id = Tools.filterID(id);
        if (typeof id != "string") {
            id = Tools.genUUIDv4();
        }
        this.id = id;
        this.dialogue = undefined;
        this.title = undefined;
        this.condition = undefined;
        this.setDialogue(dialogue);
        if (typeof title == "string") {
            this.setTitle(title);
        }
        else {
            this.setTitle(this.dialogue.getTitle());
        }
        if (typeof condition == "function") {
            this.setCondition(condition);
        }
        this.enabled = true;
    }
    getID() {
        return this.id;
    }
    setDialogue(dialogue) {
        if (!(dialogue instanceof Dialogue)) {
            if (Dialogue.has(dialogue)) {
                dialogue = Dialogue.get(dialogue);
            }
            else {
                return 2;
            }
        }
        this.dialogue = dialogue;
        this.dialogue.setParentOption(this);
        return this;
    }
    getDialogue() {
        return this.dialogue;
    }
    setTitle(title) {
        title = Tools.filterName(title);
        if (typeof title == "string") {
            this.title = title;
        }
        else {
            this.title = "";
        }
        return this;
    }
    getTitle() {
        return this.title;
    }
    setCondition(condition) {
        if (!(this.dialogue instanceof Dialogue)) {
            return this;
        }
        if (typeof condition == "function") {
            this.condition = condition;
        }
        else {
            this.condition = undefined;
        }
        return this;
    }
    getCondition(them = undefined, you = undefined) {
        if (typeof this.condition == "function") {
            return this.condition(them, you);
        }
        else {
            return true;
        }
    }
    isEnabled() {
        return this.enabled == true;
    }
    setEnabled(isEnabled = true) {
        this.enabled = (isEnabled == true);
        return this;
    }
    dispose() {
        this.enabled = false;
        delete this.condition;
        this.dialogue.removeOption(this);
        return undefined;
    }

    static createFromArray(oArray) {
        if (!(oArray instanceof Array)) {
            return;
        }
        if (oArray.length == 0) {
            return;
        }
        if (oArray[0] instanceof Dialogue) {
            var tempDialogue = oArray[0];
        }
        else if (typeof oArray[0] == "string" && Dialogue.has(oArray[0])) {
            var tempDialogue = Dialogue.get(oArray[0]);
        }
        else {
            return 2;
        }
        let tempDialogueOption = new DialogueOption(undefined, tempDialogue);
        if (oArray.length > 2) {
            if (typeof oArray[1] == "string") {
                tempDialogueOption.setTitle(oArray[1]);
            }
            if (typeof oArray[2] == "function") {
                tempDialogueOption.setCondition(oArray[2]);
            }
        }
        else if (oArray.length > 1) {
            if (typeof oArray[1] == "function") {
                tempDialogueOption.setCondition(oArray[1]);
            }
            else if (typeof oArray[1] == "string") {
                tempDialogueOption.setTitle(oArray[1]);
            }
        }
        return tempDialogueOption;
    }
}

__checkDialogue = function() {
    var _exampleA = new Dialogue("exampleA", "Example A", "This is a test!");
    var _exampleB = new Dialogue("exampleB", "Example B", "This is another test!");
    var _exampleC = new Dialogue("exampleC", "Example C", "This is yet another test!", "exampleA", ["exampleB", function(){return true;}]);

    console.log("Checking if the first inserted option's title in Dialogue exampleC is equal to exampleA's title, which it should be.");
    console.log(Dialogue.get("exampleC").getOptions()[0].getTitle() == _exampleA.getTitle() ? "It is." : "It isn't.");
    console.log("Checking if the second inserted option's title in Dialogue exampleC is equal to exampleB's title, which it should be.");
    console.log(Dialogue.get("exampleC").getOptions()[1].getTitle() == _exampleB.getTitle() ? "It is." : "It isn't.");
}
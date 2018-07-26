class Client {
	static initialize() {
        /**
         * Map of Network IDs to CharacterControllers
         * @type {String: CharacterController}
         */
        this.networkCharacterMap = {};
        this.online = false;
        this.initialized = true;
        this.sendCount = 1;
	}
	static connect() {
		if (!this.initialized) {this.initialize();}
		NetworkController.initialize();
	}
	static disconnect(_updateChild = true) {
        var _timestamp = new Date().toLocaleTimeString({ hour12: false });
        this.removeAllPlayers();
        this.setOnline(false);
        GameGUI.chatOutputAppend(`${_timestamp} Server: Connection Closed.`);
        if (_updateChild) {
            NetworkController.initialized = false;
            NetworkController.socket = undefined;
        }
	}
    static isOnline() {
        return this.online;
    }
	static setOnline(_boolean) {
		this.online = (_boolean === true ? true : false);
	}
    static setPlayerEntry(_networkID) {
    	console.log("Client::setPlayerEntry(" + _networkID + ")");
        this.setEntry(Game.player, _networkID);
    }
    static setEntry(_character, _networkID) {
    	console.log("Client::setEntry(" + _character.id + ", " + _networkID + ")");
        if (!(_character instanceof CharacterController)) {
        	_character = Game.getCharacterController(_character);
        	if (!(_character instanceof CharacterController)) {return undefined;}
        }

        this.removeEntry(_character);
        
        this.networkCharacterMap[_networkID] = _character;
        _character.setNetworkID(_networkID);
    }
    static getNetworkID(_character = Game.player) {
    	if (_character instanceof CharacterController) {
    		return _character.networkID;
    	}
        else if (_character instanceof CharacterEntity) {
            return _character.controller.networkID;
        }
        else if (_character instanceof BABYLON.Mesh || _character instanceof BABYLON.InstancedMesh) {
            if (_character.hasOwnProperty("controller") && _character.controller instanceof CharacterController) {
                return _character.controller.networkID;
            }
            else {
                return undefined;
            }
        }
    	else if (typeof _character == "string") {
			return Game.getCharacterController(_character).networkID;
    	}
    	else {
    		return undefined;
    	}
    }
    static getCharacterController(_id) {
    	if (isInt(_id)) {
    		return Client.networkCharacterMap[_id];
    	}
    	else {
    		return Game.getCharacterController(_id);
    	}
    }
    static removeEntry(_character) {
        if (!(_character instanceof CharacterController)) {
        	_character = Client.getCharacterController(_character);
        	if (!(_character instanceof CharacterController)) {return undefined;}
        }
        delete this.networkCharacterMap[_character.networkID];
        _character.networkID = undefined;
    }
    static getState() {
        if (!Client.online) {
            return "NONE";
        }
        switch (NetworkController.socket.readyState) {
            case 0 : return "CONNECTING";
            case 1 : return "OPEN";
            case 2 : return "CLOSING";
            case 3 : return "CLOSED";
        }
        return ;
    }
    static sendMessage(_message) {
        if (!Client.online) {
            return null;
        }
        if (!(_message instanceof Object)) {
            return undefined;
        }
        _message.sendCount = Client.sendCount
        NetworkController.socket.send(
            JSON.stringify(_message)
        );
        if (Client.sendCount >= Number.MAX_SAFE_INTEGER) {
        	Client.sendCount = 1;
        }
        else {
	        Client.sendCount++;
	    }
    }
    static requestJoinServer() {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_REQUEST_JOIN_SERVER",
            content: "lemme in :v"
        });
    }
    static sendChatMessage(_message) {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_CHAT_MESSAGE",
            content: _message
        });
    }
    static requestUUID(_message) {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_REQUEST_UUID",
            content: _message
        });
    }
    static initializeSelf() {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_INIT_SELF",
            content: {
            	id:Game.player.id,
                name:Game.player.entity.getName(),
                age:Game.player.entity.getAge(),
                sex:Game.player.entity.getSex(),
                species:Game.player.entity.getSpecies(),
                skin:Game.player.skin,
                mesh:Game.player.avatar.name,
                position:Game.player.avatar.position,
                rotation:Game.player.avatar.rotation,
                scaling:Game.player.avatar.scaling,
            	movementKeys:Game.player.key
			}
        });
    }
    static updateLocRotScaleSelf() {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_UPDATE_LOCROTSCALE_SELF",
            content: [
                Game.player.avatar.position,
                Game.player.avatar.rotation,
                Game.player.avatar.scaling,
                Game.player.key
            ]
        });
    }
    static updateMovementKeysSelf() {
        if (!Client.online) {
            return null;
        }
        Client.sendMessage({
            type: "P_UPDATE_MOVEMENTKEYS_SELF",
            content: [
                Game.player.key
            ]
        });
    }
    static requestPlayerByNetworkID(_message) {
        if (!Client.online) {
            return null;
        }
        console.log("requestPlayerByNetworkID(" + _message + ")");
        Client.sendMessage({
            type: "P_REQUEST_PLAYER",
            content: _message
        });
    }
    static requestAllPlayers() {
        console.log("requestAllPlayers()");
        Client.sendMessage({
            type: "P_REQUEST_ALL_PLAYERS",
            content: ""
        });
    }
    static removeAllPlayers() {
        for (var _networkID in this.networkCharacterMap) {
            if (_networkID != Game.player.networkID) {
                Client.removeEntry(_data.content);
                Game.removeCharacter(_data.content);
            }
        }
    }
}
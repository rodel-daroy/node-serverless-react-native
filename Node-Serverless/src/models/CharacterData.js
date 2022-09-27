let CharacterItem = require('./CharacterItem');

class CharacterData {
  constructor() {
    this.code = "";
    this.name = "";
    this.summary = "";
    this.image = "";
    this.introvert = new CharacterItem();
    this.extrovert = new CharacterItem();
    this.observant = new CharacterItem();
    this.intuitive = new CharacterItem();
    this.thinking = new CharacterItem();
    this.feeling = new CharacterItem();
    this.judging = new CharacterItem();
    this.prospecting = new CharacterItem();
  }
}

module.exports = CharacterData;
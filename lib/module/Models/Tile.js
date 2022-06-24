function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Tile {
  constructor(name) {
    _defineProperty(this, "name", void 0);

    this.name = name;
  }

}
//# sourceMappingURL=Tile.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Location = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Location {
  constructor(id, name, state) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "state", void 0);

    this.id = id;
    this.name = name;
    this.state = state;
  }

}

exports.Location = Location;
//# sourceMappingURL=Location.js.map
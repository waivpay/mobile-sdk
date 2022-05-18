"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppConfig = void 0;

var _ServerEndPoints = require("../util/ServerEndPoints");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AppConfig {
  constructor(client_id, client_secret, app_id, environment) {
    _defineProperty(this, "client_id", void 0);

    _defineProperty(this, "client_secret", void 0);

    _defineProperty(this, "app_id", void 0);

    _defineProperty(this, "environment", void 0);

    this.client_id = client_id;
    this.client_secret = client_secret;
    this.app_id = app_id;
    this.environment = environment;
  }

}

exports.AppConfig = AppConfig;
//# sourceMappingURL=AppConfig.js.map
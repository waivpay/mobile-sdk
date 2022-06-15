"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardCallBackResponse = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CardCallBackResponse {
  constructor(creationTime, modifiedTime, id, cardNumber, panFirst6, panLast4, state, sequenceNumber, cardProfileName, pinFailCount, reissue, expiry, customerNumber, embossedName, programName, pan, cvv2) {
    _defineProperty(this, "creationTime", void 0);

    _defineProperty(this, "modifiedTime", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "cardNumber", void 0);

    _defineProperty(this, "panFirst6", void 0);

    _defineProperty(this, "panLast4", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "sequenceNumber", void 0);

    _defineProperty(this, "cardProfileName", void 0);

    _defineProperty(this, "pinFailCount", void 0);

    _defineProperty(this, "reissue", void 0);

    _defineProperty(this, "expiry", void 0);

    _defineProperty(this, "customerNumber", void 0);

    _defineProperty(this, "embossedName", void 0);

    _defineProperty(this, "programName", void 0);

    _defineProperty(this, "pan", void 0);

    _defineProperty(this, "cvv2", void 0);

    this.creationTime = creationTime;
    this.modifiedTime = modifiedTime;
    this.id = id;
    this.cardNumber = cardNumber;
    this.panFirst6 = panFirst6;
    this.panLast4 = panLast4;
    this.state = state;
    this.sequenceNumber = sequenceNumber;
    this.cardProfileName = cardProfileName;
    this.pinFailCount = pinFailCount;
    this.reissue = reissue;
    this.expiry = expiry;
    this.customerNumber = customerNumber;
    this.embossedName = embossedName;
    this.programName = programName;
    this.pan = pan;
    this.cvv2 = cvv2;
  }

}

exports.CardCallBackResponse = CardCallBackResponse;
//# sourceMappingURL=CardCallBackResponse.js.map
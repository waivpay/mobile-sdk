"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndPointsCashBack = exports.EndPoints = void 0;
const EndPoints = {
  host_staging: 'https://webstores-staging.herokuapp.com',
  host_prod: 'https://webstores.herokuapp.com',
  accessToken: '/oauth/token',
  appSpecific: '/api/apps/',
  getVerificationCode: '/verifications',
  confirmVerificationCode: '',
  catalogue: '/products',
  cards: '/cards',
  balance: '/balance',
  transaction: '/transactions',
  sendTwoFactor: '/verifications',
  users: '/users',
  orders: '/orders'
};
exports.EndPoints = EndPoints;
const EndPointsCashBack = {
  host_staging: 'https://cashback-engine-staging.herokuapp.com',
  host_prod: 'https://cashback-engine.herokuapp.com',
  accessToken: '/oauth/token',
  api: '/api/',
  _api: '/api',
  orgSpecific: '/api/organisations/',
  promotions: '/promotions',
  claims: '/claims',
  fileUpload: '/fileuploads'
};
exports.EndPointsCashBack = EndPointsCashBack;
//# sourceMappingURL=ServerEndPoints.js.map
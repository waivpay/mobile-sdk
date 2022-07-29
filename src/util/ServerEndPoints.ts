export const EndPoints = {
    host_staging: 'https://webstores-staging.herokuapp.com',
    host_prod: 'https://webstore.egivv.com',
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
    orders: '/orders',
  };

  export const EndPointsCashBack = {
    host_staging: 'https://cashback-engine-staging.herokuapp.com',
    host_prod: 'https://engine.cashback.com.au',
    accessToken: '/oauth/token',
    api: '/api/',
    _api: '/api',
    orgSpecific: '/api/organisations/',
    promotions: '/promotions',
    claims: '/claims',
    fileUpload: '/fileuploads',
  };

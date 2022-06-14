#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WaivpayKartaSdk, NSObject)

RCT_EXTERN_METHOD(addCard:(NSString *)cardId withC:(NSString *)cardSuffix withB:(NSString *)cardHolder  withE:(NSString *)env withD:(NSString *)deliveryEmail withA:(NSString *)appId withT:(NSString *)accessToken
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cardExists:(NSString *)cardId withResolver:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)

@end

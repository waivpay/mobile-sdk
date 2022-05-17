#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WaivpayKartaSdk, NSObject)

RCT_EXTERN_METHOD(addCard:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end

#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>

// Frameworks the Swift class conforms to via delegate protocols. The generated
// Swift header references these protocol names, so they must be available.
#import <PassKit/PassKit.h>
#import <WatchConnectivity/WatchConnectivity.h>

// Codegen-generated spec header (ObjC++). Produced by `use_react_native!`
// during pod install under Pods/Headers/Public/ReactCodegen/waivpayKartaSdk/.
// Declares the NativeWaivpayKartaSdkSpec ObjC protocol the Swift class conforms to.
#import <ReactCodegen/waivpayKartaSdk/waivpayKartaSdk.h>

// Generated Swift header exposing the @objc(WaivpayKartaSdk) class interface
// (declares `@interface WaivpayKartaSdk : NSObject <PKAddPaymentPassViewControllerDelegate,
// WCSessionDelegate>`). The class is defined in WaivpayKartaSdk.swift.
#import "waivpay_karta_sdk-Swift.h"

// Add formal conformance to the Codegen-generated NativeWaivpayKartaSdkSpec
// protocol. The Swift class implements the @objc methods; this category only
// marks the class as conforming so the TurboModule dispatcher recognises it.
@interface WaivpayKartaSdk (Spec) <NativeWaivpayKartaSdkSpec>
@end

// Module registration. We inline what RCT_EXPORT_MODULE_NO_LOAD does instead of
// using RCT_EXTERN_MODULE, because RCT_EXTERN_MODULE re-declares
// `@interface WaivpayKartaSdk : NSObject` which would duplicate the declaration
// already emitted by the generated Swift header above.
RCT_EXTERN void RCTRegisterModule(Class);
@implementation WaivpayKartaSdk (RCTRegistration)
+ (NSString *)moduleName {
  return @"WaivpayKartaSdk";
}
@end

__attribute__((constructor)) static void RCTInitializeWaivpayKartaSdk(void) {
  RCTRegisterModule([WaivpayKartaSdk class]);
}

// Legacy bridge method exports (Old Architecture). On New Architecture the
// Codegen-generated NativeWaivpayKartaSdkSpec drives dispatch and the
// RCT_EXTERN_METHOD declarations below are ignored.
RCT_EXTERN_METHOD(addCard:(NSString *)cardId
             cardSuffix:(NSString *)cardSuffix
             cardHolder:(NSString *)cardHolder
                    env:(NSString *)env
          deliveryEmail:(NSString *)deliveryEmail
                  appId:(NSString *)appId
            accessToken:(NSString *)accessToken
                    url:(NSString *)url
                 header:(NSDictionary *)header
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cardExists:(NSString *)cardId
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkIfReadyToPay:(NSString *)jsonReq
                          environment:(NSString *)environment
                              resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startBeacon:(NSString *)sessionToken
                         shop:(NSString *)shop
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateToken:(NSString *)sessionToken
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(beaconLogRequest:(NSString *)requestUrl
                       resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject)

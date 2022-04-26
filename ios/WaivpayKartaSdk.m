#import "WaivpayKartaSdk.h"
#import <React/RCTLog.h>
#import <Foundation/Foundation.h>

@implementation WaivpayKartaSdk

RCT_EXPORT_METHOD(testLoggingEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create   an event %@ at %@", name, location);
}
RCT_EXPORT_METHOD(authorize:(NSString *)clientId)
{

  RCTLogInfo(@"Authorize %@ at %@", clientId);
  dispatch_semaphore_t sema = dispatch_semaphore_create(0);

  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://webstores-staging.herokuapp.com/oauth/token"]
    cachePolicy:NSURLRequestUseProtocolCachePolicy
    timeoutInterval:10.0];
  NSDictionary *headers = @{
    @"Content-Type": @"application/x-www-form-urlencoded"
  };

  [request setAllHTTPHeaderFields:headers];
  NSMutableData *postData = [[NSMutableData alloc] initWithData:[@"grant_type=client_credentials" dataUsingEncoding:NSUTF8StringEncoding]];
  [postData appendData:[@"&client_id=QKacTTUWmMR-Jw_NxCY-0TwRfo2oUeZLw_gI5jtWnFU" dataUsingEncoding:NSUTF8StringEncoding]];
  [postData appendData:[@"&client_secret=Mdw5gmPZqxUYDcN5SBV70L1S4D9mQFcYgufuvNvkqrk" dataUsingEncoding:NSUTF8StringEncoding]];
  [request setHTTPBody:postData];

  [request setHTTPMethod:@"POST"];

  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request
  completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error) {
      NSLog(@"%@", error);
      dispatch_semaphore_signal(sema);
    } else {
      NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
      NSError *parseError = nil;
      NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];
      NSLog(@"%@",responseDictionary);
      RCTLogInfo(@"responseDictionary: %@", responseDictionary);
      RCTLogInfo(@"Response: %@", response);
      RCTLogInfo(@"parseError: %@", parseError);
      RCTLogInfo(@"data: %@", data);

      dispatch_semaphore_signal(sema);
    }
  }];
  [dataTask resume];
  dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
}
RCT_EXPORT_METHOD(createInAppProvEvent:(NSString *)cardId)
{
  dispatch_semaphore_t sema = dispatch_semaphore_create(0);

  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://webstores-staging.herokuapp.com/api/apps/1/cards/\(cardId)/provision"]
    cachePolicy:NSURLRequestUseProtocolCachePolicy
    timeoutInterval:10.0];
  NSDictionary *headers = @{
    @"Authorization": @"Bearer xhEkjQYKuUrtkTA6Azc69MkSBd-OuFyUc4l09jDnBdc",
    @"Content-Type": @"application/json"
  };

  [request setAllHTTPHeaderFields:headers];
  NSData *postData = [[NSData alloc] initWithData:[@"{\n  \"wallet_type\": \"android\",\n  \"nonce\": \"abc100\",\n  \"nonce_signature\": \"abc100\",\n  \"certificate_leaf\": \"MIIabc100=\",\n  \"certificate_root\": \"MIIabc100=\"\n}" dataUsingEncoding:NSUTF8StringEncoding]];
  [request setHTTPBody:postData];

  [request setHTTPMethod:@"POST"];

  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request
  completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error) {
      NSLog(@"%@", error);
      dispatch_semaphore_signal(sema);
    } else {
      NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
      NSError *parseError = nil;
      NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];
      NSLog(@"%@",responseDictionary);
      dispatch_semaphore_signal(sema);
    }
  }];
  [dataTask resume];
  dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
}
RCT_EXPORT_METHOD(createInAppProvMicrogiftsEvent:(NSString *)cardId)
{
  RCTLogInfo(@"calling microgifts api %@ ", cardId);
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];

        NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:nil delegateQueue:nil];

        NSURL *url = [NSURL URLWithString:@"https://sit.microgifts.com/api/1.0.0/accounts"];

        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url

                                                               cachePolicy:NSURLRequestUseProtocolCachePolicy

                                                           timeoutInterval:60.0];

        [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];

        [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];

            [request addValue:@"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcGktdXNlckA5NDRhZDNkNzgwZTI2MjRiZjY1ZDc3NDllZmIzYzc0ZiIsImV4cCI6MTY1MTEyMDM5MiwiaWF0IjoxNjUwNTE1NTkyfQ.cNca1rc168ftqqDkSdMg-olzaMB_VmsRGc2olER90VVPsNUaJq7cmB3zASgmZnPid50DV8dPSP5f_AGSTWA65g" forHTTPHeaderField:@"Authorization"];



    NSString*_Nullable method = @"GET";

        [request setHTTPMethod:method.uppercaseString];

  //      if (params) {

  //          NSError *error;

  //          NSData *body = [NSJSONSerialization dataWithJSONObject:params options:0 error:&error];

  //          [request setHTTPBody:body];

  //      }

        [[session dataTaskWithRequest:request

                    completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {

                        if (error) {

                          //  completionHandler(nil, error);

                          RCTLogInfo(@"Error: %@", error);

                            return;

                        }

                        NSError* error1;

                        id json = [NSJSONSerialization JSONObjectWithData:data

                                                                  options:kNilOptions

                                                                    error:&error1];

                        dispatch_async(dispatch_get_main_queue(), ^{

                           // completionHandler(json, error1);

                          RCTLogInfo(@"Response: %@", json);

                          RCTLogInfo(@"Error1: %@", error1);

                        });

                    }] resume];
}
RCT_EXPORT_MODULE(WaivpayKartaSdk);
@end

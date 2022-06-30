import Foundation
import PassKit
import WatchConnectivity
import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

struct KartaPaymentPassResponse: Codable {
    let activationData: String
    let ephemeralPublicKey: String
    let encryptedPassData: String
}

extension Data {
    func hexEncodedString() -> String {
        return map { String(format: "%02hhx", $0) }.joined()
    }
}
 
@objc(WaivpayKartaSdk)
class WaivpayKartaSdk: NSObject, PKAddPaymentPassViewControllerDelegate, WCSessionDelegate {
    
    var environment = "";
    var appid = "";
    var cardNumber = "";
    var cardSfx = "";
    var delEmail = "";
    let host_staging = "https://webstores-staging.herokuapp.com/";
    let host_production = "https://webstores.herokuapp.com/";
    var token = "";
    var returnResult = false;
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func addPaymentPassViewController(_ controller: PKAddPaymentPassViewController, generateRequestWithCertificateChain certificates: [Data], nonce: Data, nonceSignature: Data, completionHandler handler: @escaping (PKAddPaymentPassRequest) -> Void) {
        
        _ = String(decoding: nonce, as: UTF8.self)
        _ = String(decoding: nonceSignature, as: UTF8.self)
        let nonce_hex = nonce.hexEncodedString()
        let nonceSignature_hex = nonceSignature.hexEncodedString()
        
        let cert_leaf = certificates[0].base64EncodedString();
        let cert_root = certificates[1].base64EncodedString();

        var host = "";
        if(environment == "staging")
        {
            host = host_staging + "api/apps/" + appid + "/cards/" + cardNumber + "/provision";
        }
        else if(environment == "prod")
        {
            host = host_production + "api/apps/" + appid + "/cards/" + cardNumber + "/provision";
        }

        let parameters = "{\n\"wallet_type\": \"ios\",\n\"delivery_email\": \"" + delEmail + "\",\n\"nonce\": \"" + nonce_hex + "\",\n\"nonce_signature\": \"" + nonceSignature_hex + "\",\n\"certificate_leaf\": \"" + cert_leaf + "\",\n\"certificate_root\": \"" + cert_root + "\"\n}"
        let postData = parameters.data(using: .utf8)

        var request = URLRequest(url: URL(string: host)!,timeoutInterval: Double.infinity)
        request.addValue("Bearer " + token, forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        request.httpMethod = "POST"
        request.httpBody = postData

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
          guard let data = data else {
            print(String(describing: error))
            return
          }
            do {
                let decoder = JSONDecoder();
                let addResponse = try decoder.decode(KartaPaymentPassResponse.self, from: data);
                let paymentPassRequest = PKAddPaymentPassRequest();
                    paymentPassRequest.activationData = Data(base64Encoded: addResponse.activationData, options: []);
                    paymentPassRequest.ephemeralPublicKey = Data(base64Encoded: addResponse.ephemeralPublicKey, options: []);
                    paymentPassRequest.encryptedPassData = Data(base64Encoded: addResponse.encryptedPassData, options: []);
                
                handler(paymentPassRequest);
                
            } catch {
                
            }
        }
        
        task.resume();
        

    }

    func addPaymentPassViewController(_ controller: PKAddPaymentPassViewController, didFinishAdding pass: PKPaymentPass?, error: Error?) {
        controller.dismiss(animated: true, completion: nil);
        returnResult = true;
    }

    @objc(addCard:withC:withB:withE:withD:withA:withT:withResolver:withRejecter:)
    func addCard(cardId: String, cardSuffix: String, cardHolder: String, env: String, deliveryEmail: String, appId: String, accessToken: String, resolve: RCTPromiseResolveBlock,reject: RCTPromiseRejectBlock) -> Void {
        
         environment = env;
         appid = appId;
         cardNumber = cardId;
        cardSfx = cardSuffix;
         delEmail = deliveryEmail;
        token = accessToken;
        
        let requestConfig = PKAddPaymentPassRequestConfiguration.init(encryptionScheme: PKEncryptionScheme.ECC_V2);
        requestConfig?.cardholderName = cardHolder;
        requestConfig?.primaryAccountSuffix = cardSuffix;
        requestConfig?.paymentNetwork = PKPaymentNetwork(rawValue: "MASTERCARD");
        requestConfig?.primaryAccountIdentifier = getCardFPAN(cardSuffix);
   
        let passkitViewController = PKAddPaymentPassViewController.init(requestConfiguration: requestConfig!, delegate: self);
        DispatchQueue.main.async {
            var topMostViewController = UIApplication.shared.keyWindow?.rootViewController;
            while let presentedViewController = topMostViewController?.presentedViewController {
                topMostViewController = presentedViewController
            }
            topMostViewController?.present(passkitViewController!, animated:true, completion: nil);
        }

        while (!returnResult) {
 
        }
        returnResult = false;
        resolve(true);
    }
    
    func getCardFPAN(_ cardSuffix: String?) -> String? {
            let passLibrary = PKPassLibrary()
            var paymentPasses = passLibrary.passes(of: .payment)
            for pass in paymentPasses {
                let paymentPass = pass.paymentPass
                if paymentPass?.primaryAccountNumberSuffix == cardSuffix {
                    return paymentPass?.primaryAccountIdentifier
                }
            }
            
            paymentPasses = passLibrary.remotePaymentPasses()
            for pass in paymentPasses {
                let paymentPass = pass.paymentPass
                if paymentPass?.primaryAccountNumberSuffix == cardSuffix {
                    return paymentPass?.primaryAccountIdentifier
                }
            }
            return nil
        }
    
    func getCardExists(_ cardSuffix: String?) ->  Bool {
        var existsOnPhone = false;
        var existsOnWatch = false;
        
        if WCSession.isSupported() {
//            print("2. Supported");
            // check if the device support to handle an Apple Watch
            let session = WCSession.default;
//            print("2.1. Setup delegate");
            session.delegate = self;
//            print("3. Session");
            session.activate();
//            print("4. Activate")
        }

        let passLibrary = PKPassLibrary()
        var paymentPasses = passLibrary.passes(of: .payment)
        for pass in paymentPasses {
            let paymentPass = pass.paymentPass
            if paymentPass?.primaryAccountNumberSuffix == cardSuffix {
                existsOnPhone = true
            }
            
        }
        
//        print("1. Before call");
        if WCSession.isSupported() {
//            print("2. Supported");
            // check if the device support to handle an Apple Watch
            let session = WCSession.default;
//            print("2.1. Setup delegate");
            session.delegate = self;
//            print("3. Session");
            session.activate();
//            print("4. Activate");
            if session.isPaired {
//                print("5. Paired");
                // check if the iPhone is paired with the Apple Watch
                paymentPasses = passLibrary.remotePaymentPasses()
                for pass in paymentPasses {
                    let paymentPass = pass.paymentPass
                    if paymentPass?.primaryAccountNumberSuffix == cardSuffix {
//                        print("6. Matched");
                        existsOnWatch = true
                    }
                }
            } else {
//                print("7. Not paired");
                existsOnWatch = true
            }
        } else {
//            print("8. Not supported");
            existsOnWatch = true
        }
//        print("existsOnPhone " + String(existsOnPhone));
//        print("existsOnWatch " + String(existsOnWatch));
//        print("answer " + String(!existsOnPhone || !existsOnWatch));
        return (!existsOnPhone || !existsOnWatch);
    }
    
    @objc(cardExists:withResolver:withRejecter:)
    func cardExists(cardId: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(getCardExists(cardId));
    }
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
//        print("session");
    }
    
    func sessionDidBecomeInactive(_ session: WCSession) {
//        print("sessionDidBecomeInactive");
    }
    
    func sessionDidDeactivate(_ session: WCSession) {
//        print("sessionDidDeactivate");
    }
    
}

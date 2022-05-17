import Foundation
import PassKit
 

@objc(WaivpayKartaSdk)
class WaivpayKartaSdk: NSObject, PKAddPaymentPassViewControllerDelegate {
    
    func addPaymentPassViewController(_ controller: PKAddPaymentPassViewController, generateRequestWithCertificateChain certificates: [Data], nonce: Data, nonceSignature: Data, completionHandler handler: @escaping (PKAddPaymentPassRequest) -> Void) {
      // Call Karta API

        let paymentPassRequest = PKAddPaymentPassRequest();
        paymentPassRequest.activationData = Data(base64Encoded: "Activation Data", options: []);
        paymentPassRequest.ephemeralPublicKey = Data(base64Encoded: "Ephemeral Public Key", options: []);
        paymentPassRequest.encryptedPassData = Data(base64Encoded: "Encrypted Pass Data", options: []);
        handler(paymentPassRequest);
    }

    func addPaymentPassViewController(_ controller: PKAddPaymentPassViewController, didFinishAdding pass: PKPaymentPass?, error: Error?) {
        controller.dismiss(animated: true, completion: nil);
    }

    @objc(addCard:withB:withResolver:withRejecter:)
    func addCard(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        
        let requestConfig = PKAddPaymentPassRequestConfiguration.init(encryptionScheme: PKEncryptionScheme.ECC_V2);
        requestConfig?.cardholderName = "John Appleseed";
        requestConfig?.primaryAccountSuffix = "4444";
        requestConfig?.primaryAccountIdentifier = "232123221";
        requestConfig?.localizedDescription = "Special Gift Card";
        requestConfig?.paymentNetwork = PKPaymentNetwork(rawValue: "MASTERCARD");
        
        let passkitViewController = PKAddPaymentPassViewController.init(requestConfiguration: requestConfig!, delegate: self);
        DispatchQueue.main.async {
            var topMostViewController = UIApplication.shared.keyWindow?.rootViewController;
            while let presentedViewController = topMostViewController?.presentedViewController {
                topMostViewController = presentedViewController
            }
            topMostViewController?.present(passkitViewController!, animated:true, completion: nil);
        }
        resolve(6);
    }
}

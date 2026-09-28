require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "waivpay-karta-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.1" }
  s.source       = { :git => "https://git-codecommit.ap-southeast-2.amazonaws.com/v1/repos/WaivpayKartaSDK.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  install_modules_dependencies(s)
  s.dependency "RiskifiedBeaconXCFramework", "~> 1.6.4"
end

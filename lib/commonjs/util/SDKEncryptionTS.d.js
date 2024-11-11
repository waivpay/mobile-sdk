"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encryptFromSDK2 = encryptFromSDK2;
function encryptFromSDK2(val, key) {
  var ewayPublicKeyAttribute = "data-eway-encrypt-key";
  var ewayEncryptAttribute = "data-eway-encrypt-name";
  var modalCallback = null;
  var amexECCallback = null;
  var lastButtonName = null;
  var lastButtonValue = null;
  var PUBLIC_KEY_N = null;
  var PUBLIC_KEY_E = b64tohex("AQAB");

  // API Entrypoint for Encryption function, Will use key passed in, or the form's key if not supplied.
  // returns null if no key
  function encryptValueApi(val, key) {
    if (typeof val == 'number' && val < 10000) {
      //Valid CVN should be less than 10000 in number format.
      val = val.toString();
    }
    if (typeof val != 'string') {
      throw new Error("The value to be encrypted must be a string type.");
    }
    var keyToUse = null;
    if (key) keyToUse = b64tohex(key);
    if (!keyToUse) keyToUse = PUBLIC_KEY_N;
    if (keyToUse) {
      var rsa = new RSAKey();
      rsa.setPublic(keyToUse, PUBLIC_KEY_E);
      return "eCrypted:" + rsa.encrypt(val);
    } else return null;
  }

  //API Entrypoint to create and show a shared page Modal Payment, calling the given function when the payment completes.
  function showModalPaymentApi(config, callback) {
    // only open if not already one open
    if (!modalCallback) {
      // create iFrame
      var ifrm = createIFrame("modal");
      ifrm.src = getModalUrl(config);
      bodyFreezeScroll();
      modalCallback = callback; // set callback
    }
    return false;
  }

  // This one's called by the handler on the form submit (setup by Init)
  function encryptForm(event) {
    event = event || window.event; // event is undefined in IE
    var target = event.target || event.srcElement; // IE uses srcElement, everything else uses target
    return submitForm(target);
  }

  // Functions to get and save global Vars and Constants
  function initVars() {
    if (!window.ewayPNVars) {
      window.ewayPNVars = {
        endpoints: {
          "X": "https://localhost:44300",
          "Y": "http://rapid-shared-sa.sa.ewaylabs.cloud/sharedpage",
          "T": "http://staging.secure.ewaypayments.com/sharedpage",
          "U": "https://staging.secure-uk.ewaypayments.com/sharedpage",
          "V": "http://api.sandbox.ewaypayments.com/staging-au/sharedpage",
          "W": "https://api.sandbox.ewaypayments.com/staging-uk/sharedpage",
          "A": "https://secure.ewaypayments.com/sharedpage",
          "B": "https://secure-uk.ewaypayments.com/sharedpage",
          "C": "https://secure-au.sandbox.ewaypayments.com/sharedpage",
          "D": "https://secure-uk.sandbox.ewaypayments.com/sharedpage"
        },
        defaultEndpoint: "A",
        modalEndpoints: {
          "production": "https://secure.ewaypayments.com/sharedpage",
          "sandbox": "https://secure-au.sandbox.ewaypayments.com/sharedpage",
          "production-uk": "https://secure-uk.ewaypayments.com/sharedpage",
          "sandbox-uk": "https://secure-uk.sandbox.ewaypayments.com/sharedpage"
        }
      };
    }
  }
  function getVar(name) {
    initVars();
    return window.ewayPNVars[name];
  }
  function setVar(name, value) {
    initVars();
    window.ewayPNVars[name] = value;
    return;
  }

  // var $body = window.document.body;

  function bodyFreezeScroll() {
    var bodyWidth = $body.offsetWidth;
    var css = $body.style;
    setVar("saveMarginR", css.marginRight);
    setVar("saveMarginT", css.marginTop);
    setVar("saveOverflow", css.overflow);
    css.overflow = "hidden";
    css.marginTop = "0px"; // Stop IE jump
    css.marginRight = (css.marginRight ? '+=' : '') + ($body.offsetWidth - bodyWidth);
  }
  function bodyUnfreezeScroll() {
    var bodyWidth = $body.offsetWidth;
    var css = $body.style;
    var oldMarginR = getVar("saveMarginR");
    var oldMarginT = getVar("saveMarginT");
    var oldOverflow = getVar("saveOverflow");
    css.marginRight = oldMarginR ? oldMarginR : "";
    css.marginTop = oldMarginT ? oldMarginT : "";
    css.overflow = oldOverflow ? oldOverflow : "";
  }
  function checkKey(key) {
    var retval = null;
    if (key && key.match("epk-[0-9,A-F][A-Z][0-9,A-F]*")) {
      // simple luhn style check using hex digits
      var input = key.substr(4).replace(/[-,G-Z]/g, "");
      var sum = 0;
      var numdigits = input.length;
      var parity = numdigits % 2;
      for (var i = 0; i < numdigits; i++) {
        var digit = parseInt(input.charAt(i), 16);
        if (i % 2 == parity) digit *= 2;
        if (digit > 15) digit -= 15;
        sum += digit;
      }
      retval = sum % 16 == 0;
    }
    return retval;
  }

  // Get a PayNowbutton endpoint from the key and the array.
  function getEndpoint(key, canDefault) {
    var endpoints = getVar("endpoints");
    var retval = null;
    if (checkKey(key)) {
      retval = endpoints[key.charAt(5)];
    }

    // defualt if we can (i.e. non critical)
    if (!retval && canDefault) retval = endpoints[getVar("defaultEndpoint")];
    return retval;
  }

  //Create a Rapid shared page modal URL from an access code and the settings. will return null on any error.
  function getModalUrl(config) {
    var modalEndpoints = getVar("modalEndpoints");
    var url = null;
    // First check for a full URL, and sub 
    if (config && config["sharedPaymentUrl"]) {
      url = config["sharedPaymentUrl"];
      url = url.replace(/sharedpayment\?/, "sharedpayment?v=2&") + "&View=Modal";
    } else {
      // Try access code and endpoint
      if (config && config["accessCode"]) {
        var endpoint = !config["endpoint"] ? "production" : config["endpoint"];
        url = modalEndpoints[endpoint.toLowerCase()];
        if (!url) url = endpoint.replace(/\/$/, ""); // no match? use it raw.
        if (!url.match(/^http/)) url = "https://" + url;
        url += "/sharedpayment?v=2&AccessCode=" + config["accessCode"] + "&View=Modal";
      }
    }
    return url;
  }
  function findPayNowTagFromButton(button) {
    // Mods V1.2 Button can now be it's own tag, so we will return the tag with the config info (which may be the button)
    if (button && getAmount(button)) {
      return button;
    } else {
      if (button && button.previousSibling) {
        if (button.previousSibling.nodeName == "SCRIPT" && button.previousSibling.getAttribute("class") == "eway-paynow-button") return button.previousSibling;
      }
    }
    return null;
  }

  // returns the shared page base URL (for this tag)
  function getBaseUrl(tag) {
    var base = tag.src;
    if (base.match(/sharedpage/i)) {
      base = base.replace(/sharedpage.*/i, "sharedpage");
    } else {
      base = getEndpoint(getPublicAPIKey(tag), true);
    }
    return base;
  }
  function findNodesForm(node) {
    var max = 50; // saftey
    while (node && node.nodeName != "FORM" && max-- > 0) {
      node = node.parentNode;
    }
    return node;
  }
  function setButtonProcessed(message) {
    if (window.ewayActivePayNowButton) {
      var tag = findPayNowTagFromButton(window.ewayActivePayNowButton);
      var btnColor = getButtonProcessedColor(tag);
      var btnTextColor = getButtonTextColor(tag);
      window.ewayActivePayNowButton.className = "eway-button processed";
      var span = window.ewayActivePayNowButton.firstChild;
      var buttonText = window.ewayActivePayNowButton.firstChild ? window.ewayActivePayNowButton.firstChild.firstChild : null;
      if (buttonText) buttonText.nodeValue = "Processing Complete";
      if (span) {
        span.style.cssText = "display: block; min-height:30px;";
        if (btnColor) span.style.cssText += " background: " + btnColor;
        if (btnTextColor) span.style.cssText += " color: " + btnTextColor;
      }
      window.ewayActivePayNowButton.onclick = null; // disable
      // Show the transaction ID/receipt num
      createInfoIcon(window.ewayActivePayNowButton, "Your transaction has been accepted for processing. " + message.replace("ID:", "Receipt Number:").replace(/,AC:.*/, ""));
      // two options Redirect to result page with Access Code in URL if specified) or submit
      var resultUrl = getResultURL(tag);
      if (resultUrl) {
        window.location.href = resultUrl + (resultUrl.match(/\?/) ? '&' : '?') + 'AccessCode=' + message.replace(/ID:.*,AC:/, "");
      } else {
        // submit the form if specified
        var tag = findPayNowTagFromButton(window.ewayActivePayNowButton);
        var buttonsForm = findNodesForm(window.ewayActivePayNowButton);
        var submitForm = getSubmitForm(tag);
        if (buttonsForm && !(submitForm == "false" || submitForm == "no")) {
          addFormAC(buttonsForm, message);
          buttonsForm.submit();
        }
      }
    }
  }
  function setButtonError(message) {
    if (window.ewayActivePayNowButton) {
      var tag = findPayNowTagFromButton(window.ewayActivePayNowButton);
      var btnColor = getButtonErrorColor(tag);
      var btnTextColor = getButtonTextColor(tag);
      window.ewayActivePayNowButton.className = "eway-button error";
      var span = window.ewayActivePayNowButton.firstChild;
      var buttonText = window.ewayActivePayNowButton.firstChild ? window.ewayActivePayNowButton.firstChild.firstChild : null;
      if (buttonText) buttonText.nodeValue = "Processing Error";
      if (span) {
        span.style.cssText = "display: block; min-height:30px;";
        if (btnColor) span.style.cssText += " background: " + btnColor;
        if (btnTextColor) span.style.cssText += " color: " + btnTextColor;
      }
      window.ewayActivePayNowButton.onclick = null; // disable
      // Show the transaction ID/receipt num
      createInfoIcon(window.ewayActivePayNowButton, "Unable to process Transaction. Error Message: " + message);
    }
  }
  function setButtonProcessing() {
    if (window.ewayActivePayNowButton) {
      window.ewayActivePayNowButton.className = "eway-button processing";
      var buttonText = window.ewayActivePayNowButton.firstChild ? window.ewayActivePayNowButton.firstChild.firstChild : null;
      if (buttonText) buttonText.nodeValue = "Loading Payment...";
    }
  }
  function setButtonCancelled() {
    if (window.ewayActivePayNowButton) {
      window.ewayActivePayNowButton.className = "eway-button";
      var buttonText = window.ewayActivePayNowButton.firstChild ? window.ewayActivePayNowButton.firstChild.firstChild : null;
      if (buttonText) buttonText.nodeValue = getButtonText(findPayNowTagFromButton(window.ewayActivePayNowButton));
    }
  }
  function setButtonDisabled(message) {
    if (window.ewayActivePayNowButton) {
      var tag = findPayNowTagFromButton(window.ewayActivePayNowButton);
      var btnColor = getButtonDisabledColor(tag);
      var btnTextColor = getButtonTextColor(tag);
      window.ewayActivePayNowButton.className = "eway-button disabled";
      window.ewayActivePayNowButton.style.cssText = "visibility: visible;" + btnColor ? " background: " + btnColor : "";
      var span = window.ewayActivePayNowButton.firstChild;
      if (span) {
        span.style.cssText = "display: block; min-height:30px;";
        if (btnColor) span.style.cssText += " background: " + btnColor;
        if (btnTextColor) span.style.cssText += " color: " + btnTextColor;
      }
      window.ewayActivePayNowButton.onclick = null; // disable
      createInfoIcon(window.ewayActivePayNowButton, message);
    }
  }
  function addListener() {
    if (!window.ewayListenerConnected) {
      if (window.addEventListener) {
        addEventListener("message", listenForResult, false);
      } else {
        attachEvent("onmessage", listenForResult);
      }
      window.ewayListenerConnected = true;
    }
  }

  //This is the main handler for all browser messages (from Paynow buttons and Modals)
  function listenForResult(event) {
    // will fire once for every button that is clicked or modal that's created
    if (modalCallback) {
      handleModalMessage(event);
    } else if (amexECCallback && (event.data.match(/amexec/g) || event.data.match(/error_code/g))) {
      handleAmexECMessage(event);
    } else {
      handlePayNowMessage(event);
    }
  }

  //Handle a message from AmexEC button.
  function handleAmexECMessage(event) {
    var result = "";
    var err = "";
    if ((event.origin.match(/ewaypayments.com/) || event.origin.match(/localhost:44300/) || event.origin.match(/ewaylabs.cloud$/)) && !event.data.match(/error_code/g) && event.data.match(/amexec/g) && event.data.length > 6) {
      setVar("FrameLoad", "ok");
      result = "Complete";
      err = "";
    } else {
      // clear iFrame, restore page, set errors
      result = "Error";
      err = "Sorry we were unable to process the payment, please select an alternative payment method.";
      setVar("FrameLoad", "error");
      removeIFrame("amex_ec");
    }
    if (amexECCallback) {
      amexECCallback(result, err, event.data);
      amexECCallback = null;
    }
  }

  //Handle a message from a result page for a Pay Now button.
  function handlePayNowMessage(event) {
    var tag = findPayNowTagFromButton(window.ewayActivePayNowButton);
    if (tag) {
      // ignore LoadOK
      if (!event.data.match(/^LoadOK/i)) {
        var key = getPublicAPIKey(tag);
        if (event.origin.match(/ewaypayments.com/) || event.origin.match(/localhost:44300/) || event.origin.match(/ewaylabs.cloud$/)) {
          if (event.data == "Cancel") {
            setButtonCancelled();
          } else if (event.data.match(/^Error:/i)) {
            setButtonError(event.data.replace(/^Error:/, ""));
          } else {
            setButtonProcessed(event.data);
          }
          // clear iFrame 
          removeIFrame("eway-payment-window");
        }
      }
    }
  }

  //Handle a Modal message (both from the result page, and the load page to detect 401's)
  function handleModalMessage(event) {
    // will fire once for the first appropriate message that comes in.
    if (event.origin.match(/ewaypayments.com/) || event.origin.match(/localhost:44300/) || event.origin.match(/ewaylabs.cloud$/)) {
      // ignore LoadOK
      if (event.data.match(/^LoadOK/i)) {
        setVar("FrameLoad", "ok");
      } else {
        // clear iFrame restore page
        setVar("FrameLoad", "ok");
        removeIFrame("eway-payment-window");
        // decode message and fire the call back, then clear the variable
        var result = "Complete";
        var err = "";
        var tranid = "";
        if (event.data == "Cancel") {
          result = "Cancel";
        } else if (event.data.match(/^Error:/i)) {
          result = "Error";
          err = event.data.replace(/^Error:/, "");
        } else {
          tranid = event.data.match(/^ID:([0-9]*),AC:.*/) ? event.data.match(/^ID:([0-9]*),AC:.*/)[1] : "";
        }
        if (modalCallback) {
          modalCallback(result, tranid, err);
          modalCallback = null;
        }
      }
    }
  }

  //This function checks for a loadOK message from the iFrame. will retry while it's pending
  // It only starts once the frame is loaded, so should be set to a reasonable time 
  function checkFrameLoad(count, id) {
    var loadStatus = getVar("FrameLoad");
    if (count-- > 0 && loadStatus && loadStatus == "pending") {
      setTimeout(checkFrameLoad, 250, count); //wait some more
    } else {
      // Done waiting or state change, still pending? close frame and call callback
      if (loadStatus && loadStatus == "pending") {
        removeIFrame(id);
        if (modalCallback) {
          modalCallback("Error", "", "Error loading payment modal, Invalid or missing access code.");
          modalCallback = null;
        }
        if (amexECCallback) {
          amexECCallback("Error", "", "Error loading AmexEC button, Invalid or missing access code.");
          amexECCallback = null;
        }
      }
    }
  }
  function addPayNowButton(tag) {
    var pk = getPublicAPIKey(tag);
    var endpoint = getEndpoint(pk);
    if (endpoint) {
      var button = createButton(tag, getButtonText(tag), getButtonColor(tag), getButtonTextColor(tag));
      button.onclick = function () {
        window.ewayActivePayNowButton = button;
        setButtonProcessing();
        // create iFrame
        var ifrm = createIFrame("modal");
        var url = endpoint + "/sharedpayment?PublicAPIKey=" + getPublicAPIKey(tag) + addParam("Amount", getAmount(tag)) + addParam("Currency", getCurrency(tag)) + addParam("InvoiceRef", getInvoiceRef(tag)) + addParam("Email", getEmail(tag)) + addParam("Phone", getPhone(tag)) + addParam("Edit", getAllowEdit(tag)) + addParam("ResultUrl", getResultURL(tag)) + addParam("InvoiceDesc", getInvoiceDesc(tag));
        ifrm.src = url;
        bodyFreezeScroll();
        return false;
      };
    } else {
      // no endpoint means an error in Config somewhere, show a disabled Button
      var button = createButton(tag, getButtonText(tag), getButtonDisabledColor(tag), getButtonTextColor(tag));
      window.ewayActivePayNowButton = button;
      setButtonDisabled("Configuration Error: Invalid or missing Public API Key");
    }
  }
  function getButtonText(tag) {
    var label = getLabel(tag);
    if (!label) label = "Pay Now";
    if (!label.match(/#amount#/i)) label += " (#amount#)";
    return label.replace(/#amount#/ig, formatMoney(getAmount(tag) / 100.0, getCurrency(tag)));
  }
  function addParam(name, value) {
    return value ? "&" + name + "=" + encodeURIComponent(value) : "";
  }
  function getAmount(tag) {
    return tag.getAttribute("data-amount");
  }
  function getCurrency(tag) {
    var curr = tag.getAttribute("data-currency");
    return curr == undefined ? "" : curr;
  }
  function getPublicAPIKey(tag) {
    return tag.getAttribute("data-publicapikey");
  }
  function getInvoiceRef(tag) {
    return tag.getAttribute("data-invoiceref");
  }
  function getEmail(tag) {
    return tag.getAttribute("data-email");
  }
  function getPhone(tag) {
    return tag.getAttribute("data-phone");
  }
  function getInvoiceDesc(tag) {
    return tag.getAttribute("data-invoicedescription");
  }
  function getAllowEdit(tag) {
    return tag.getAttribute("data-allowedit");
  }
  function getResultURL(tag) {
    return tag.getAttribute("data-resulturl");
  }
  function getLabel(tag) {
    return !tag ? null : tag.getAttribute("data-label");
  }
  function getSubmitForm(tag) {
    if (!tag || !tag.getAttribute("data-submitform")) return "true";
    return tag.getAttribute("data-submitform");
  }
  function getButtonColor(tag) {
    return tag.getAttribute("data-buttoncolor");
  }
  function getButtonErrorColor(tag) {
    return tag.getAttribute("data-buttonerrorcolor");
  }
  function getButtonProcessedColor(tag) {
    return tag.getAttribute("data-buttonprocessedcolor");
  }
  function getButtonDisabledColor(tag) {
    return tag.getAttribute("data-buttondisabledcolor");
  }
  function getButtonTextColor(tag) {
    return tag.getAttribute("data-buttontextcolor");
  }
  function formatMoney(n, curr) {
    return (curr == "GBP" ? "\u00A3" : "$$") + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  // Start Encrypt
  function extractPublicKey(f) {
    PUBLIC_KEY_N = b64tohex(f.getAttribute(ewayPublicKeyAttribute));
  }
  function cloneForm(oldForm) {
    var newForm = oldForm.cloneNode(true);
    copySelectLists(oldForm, newForm);
    copyTextAreas(oldForm, newForm);
    copyCheckboxAndRadioValues(oldForm, newForm);
    addButton(oldForm, newForm);
    return newForm;
  }
  function copySelectLists(oldForm, newForm) {
    var selectElementsOld = oldForm.getElementsByTagName('Select');
    var selectElementsNew = newForm.getElementsByTagName('Select');
    for (var i = 0; i < selectElementsOld.length; i++) {
      selectElementsNew[i].selectedIndex = selectElementsOld[i].selectedIndex;
    }
  }
  function copyTextAreas(oldForm, newForm) {
    var textElementsOld = oldForm.getElementsByTagName('TextArea');
    var textElementsNew = newForm.getElementsByTagName('TextArea');
    for (var i = 0; i < textElementsOld.length; i++) {
      textElementsNew[i].value = textElementsOld[i].value;
    }
  }
  function copyCheckboxAndRadioValues(oldForm, newForm) {
    var inputsOld = oldForm.getElementsByTagName('input');
    var inputsNew = newForm.getElementsByTagName('input');
    for (var i = 0; i < inputsOld.length; i++) {
      if (inputsOld[i].type === 'checkbox' || inputsOld[i].type === 'radio') {
        inputsNew[i].checked = inputsOld[i].checked; // Need this for IE
        inputsNew[i].value = inputsOld[i].value; // Need this for IE10
      }
    }
  }
  function encryptElement(element, rsa) {
    if (element.id) {
      element.id = "EWAY_ENCRYPTED_" + element.id;
    }
    element.name = element.getAttribute(ewayEncryptAttribute);
    element.value = "eCrypted:" + rsa.encrypt(element.value);
  }
  function addSubmitEvent(frm) {
    var oldonsubmit = frm.onsubmit;
    if (typeof frm.onsubmit != 'function') {
      frm.onsubmit = encryptForm;
    } else {
      frm.onsubmit = function (e) {
        if (!oldonsubmit(e)) {
          return false;
        }
        return encryptForm(e);
      };
    }
  }

  //Event attached to each submit button
  function saveButtonDetails(e) {
    if (e.target) {
      lastButtonName = e.target.name; // normal sensible browsers
      lastButtonValue = e.target.value;
    } else {
      lastButtonName = e.srcElement.name; // IE8-9 :-(
      lastButtonValue = e.srcElement.value;
    }
  }

  // Start jsbn.js
  var dbits;

  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = (canary & 0xffffff) == 0xefcafe;

  // (public) Constructor
  function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);else if (b == null && "string" != typeof a) this.fromString(a, 256);else this.fromString(a, b);
  }

  // return new, unset BigInteger
  function nbi() {
    return new BigInteger(null);
  }
  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 0x4000000);
      w[j++] = v & 0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
      xh = x >> 15;
    while (--n >= 0) {
      var l = this[i] & 0x7fff;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
      xh = x >> 14;
    while (--n >= 0) {
      var l = this[i] & 0x3fff;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 0xfffffff;
    }
    return c;
  }
  if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
    BigInteger.prototype.am = am2;
    dbits = 30;
  } else if (j_lm && navigator.appName != "Netscape") {
    BigInteger.prototype.am = am1;
    dbits = 26;
  } else {
    // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;

  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr, vv;
  rr = "0".charCodeAt(0);
  for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) {
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    return BI_RM.charAt(n);
  }
  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  }

  // (protected) copy this to r
  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }

  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0) this[0] = x;else if (x < -1) this[0] = x + this.DV;else this.t = 0;
  }

  // return bigint initialized to value
  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  }

  // (protected) set from string and radix
  function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else {
      this.fromRadix(s, b);
      return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length,
      mi = false,
      sh = 0;
    while (--i >= 0) {
      var x = k == 8 ? s[i] & 0xff : intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this[this.t++] = x >> this.DB - sh;
      } else this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB) sh -= this.DB;
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
      this.s = -1;
      if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
  }

  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c) --this.t;
  }

  // (public) return string representation in given radix
  function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else return this.toRadix(b);
    var km = (1 << k) - 1,
      d,
      m = false,
      r = "",
      i = this.t;
    var p = this.DB - i * this.DB % k;
    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }
      while (i >= 0) {
        if (p < k) {
          d = (this[i] & (1 << p) - 1) << k - p;
          d |= this[--i] >> (p += this.DB - k);
        } else {
          d = this[i] >> (p -= k) & km;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if (d > 0) m = true;
        if (m) r += int2char(d);
      }
    }
    return m ? r : "0";
  }

  // (public) -this
  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  }

  // (public) |this|
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }

  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return this.s < 0 ? -r : r;
    while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
    return 0;
  }

  // returns bit length of the integer x
  function nbits(x) {
    var r = 1,
      t;
    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }
    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }
    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }
    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }
    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }
    return r;
  }

  // (public) return the number of bits in "this"
  function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
  }

  // (protected) r = this << n*DB
  function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i) r[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
  }

  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }

  // (protected) r = this << n
  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
      c = this.s << bs & this.DM,
      i;
    for (i = this.t - 1; i >= 0; --i) {
      r[i + ds + 1] = this[i] >> cbs | c;
      c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }

  // (protected) r = this >> n
  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
      r.t = 0;
      return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }
    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }

  // (protected) r = this - a
  function bnpSubTo(a, r) {
    var i = 0,
      c = 0,
      m = Math.min(a.t, this.t);
    while (i < m) {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c -= a.s;
      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }

  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a, r) {
    var x = this.abs(),
      y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
  }

  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);
      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }

  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q != null) q.fromInt(0);
      if (r != null) this.copyTo(r);
      return;
    }
    if (r == null) r = nbi();
    var y = nbi(),
      ts = this.s,
      ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
      d2 = (1 << this.F1) / yt,
      e = 1 << this.F2;
    var i = r.t,
      j = i - ys,
      t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later
    while (y.t < ys) y[y.t++] = 0;
    while (--j >= 0) {
      // Estimate quotient digit
      var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r[i] < --qd) r.subTo(t, r);
      }
    }
    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
    if (ts < 0) BigInteger.ZERO.subTo(r, r);
  }

  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
  }

  // Modular reduction using "classic" algorithm
  function Classic(m) {
    this.m = m;
  }
  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);else return x;
  }
  function cRevert(x) {
    return x;
  }
  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }
  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2
    y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4
    y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8
    y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return y > 0 ? this.DV - y : -y;
  }

  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  }

  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
  }

  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while (x.t <= this.mt2)
    // pad x so am has enough room later
    x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i] & 0x7fff;
      var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      // propagate carry
      while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  }

  // r = "x^2/R mod m"; x != r
  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }

  // r = "xy/R mod m"; x,y != r
  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;

  // (protected) true iff this is even
  function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0;
  }

  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
      r2 = nbi(),
      g = z.convert(this),
      i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0) z.mulTo(r2, g, r);else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }
    return z.revert(r);
  }

  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);else z = new Montgomery(m);
    return this.exp(e, z);
  }

  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;

  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;

  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);

  // prng4.js - uses Arcfour as a PRNG

  function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array();
  }

  // Initialize arcfour context from key, an array of ints, each from [0..255]
  function ARC4init(key) {
    var i, j, t;
    for (i = 0; i < 256; ++i) this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
      j = j + this.S[i] + key[i % key.length] & 255;
      t = this.S[i];
      this.S[i] = this.S[j];
      this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
  }
  function ARC4next() {
    var t;
    this.i = this.i + 1 & 255;
    this.j = this.j + this.S[this.i] & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[t + this.S[this.i] & 255];
  }
  Arcfour.prototype.init = ARC4init;
  Arcfour.prototype.next = ARC4next;

  // Plug in your RNG constructor here
  function prng_newstate() {
    return new Arcfour();
  }

  // Pool size must be a multiple of 4 and greater than 32.
  // An array of bytes the size of the pool will be passed to init()
  var rng_psize = 256;
  var rng_state;
  var rng_pool;
  var rng_pptr;

  // Mix in a 32-bit integer into the pool
  function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= x >> 8 & 255;
    rng_pool[rng_pptr++] ^= x >> 16 & 255;
    rng_pool[rng_pptr++] ^= x >> 24 & 255;
    if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
  }

  // Mix in the current time (w/milliseconds) into the pool
  function rng_seed_time() {
    rng_seed_int(new Date().getTime());
  }

  // Initialize the pool with junk if needed.
  if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if (window.crypto && window.crypto.getRandomValues) {
      // Use webcrypto if available
      var ua = new Uint8Array(32);
      window.crypto.getRandomValues(ua);
      for (t = 0; t < 32; ++t) rng_pool[rng_pptr++] = ua[t];
    }
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
      // Extract entropy (256 bits) from NS4 RNG if available
      var z = window.crypto.random(32);
      for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
    }
    while (rng_pptr < rng_psize) {
      // extract some randomness from Math.random()
      t = Math.floor(65536 * Math.random());
      rng_pool[rng_pptr++] = t >>> 8;
      rng_pool[rng_pptr++] = t & 255;
    }
    rng_pptr = 0;
    rng_seed_time();
  }
  function rng_get_byte() {
    if (rng_state == null) {
      rng_seed_time();
      rng_state = prng_newstate();
      rng_state.init(rng_pool);
      for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
      rng_pptr = 0;
      //rng_pool = null;
    }
    return rng_state.next();
  }
  function rng_get_bytes(ba) {
    var i;
    for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
  }
  function SecureRandom() {}
  SecureRandom.prototype.nextBytes = rng_get_bytes;
  function parseBigInt(str, r) {
    return new BigInteger(str, r);
  }
  function linebrk(s, n) {
    var ret = "";
    var i = 0;
    while (i + n < s.length) {
      ret += s.substring(i, i + n) + "\n";
      i += n;
    }
    return ret + s.substring(i, s.length);
  }
  function byte2Hex(b) {
    if (b < 0x10) return "0" + b.toString(16);else return b.toString(16);
  }

  // PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
  function pkcs1pad2(s, n) {
    if (n < s.length + 11) {
      alert("Message too long for RSA");
      return null;
    }
    var ba = new Array();
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
      var c = s.charCodeAt(i--);
      if (c < 128) {
        // encode using utf-8
        ba[--n] = c;
      } else if (c > 127 && c < 2048) {
        ba[--n] = c & 63 | 128;
        ba[--n] = c >> 6 | 192;
      } else {
        ba[--n] = c & 63 | 128;
        ba[--n] = c >> 6 & 63 | 128;
        ba[--n] = c >> 12 | 224;
      }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while (n > 2) {
      // random non-zero pad
      x[0] = 0;
      while (x[0] == 0) rng.nextBytes(x);
      ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
  }

  // "empty" RSA key constructor
  function RSAKey() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
  }

  // Set the public key fields N and e from hex strings
  function RSASetPublic(N, E) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = parseBigInt(N, 16);
      this.e = parseInt(E, 16);
    } else alert("Invalid RSA public key");
  }

  // Perform raw public operation on "x": return x^e (mod n)
  function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n);
  }

  // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
  function RSAEncrypt(text) {
    var m = pkcs1pad2(text, this.n.bitLength() + 7 >> 3);
    if (m == null) return null;
    var c = this.doPublic(m);
    if (c == null) return null;
    var h = c.toString(16);
    if ((h.length & 1) == 0) return hex2b64(h);else return hex2b64("0" + h);
  }

  // protected
  RSAKey.prototype.doPublic = RSADoPublic;

  // public
  RSAKey.prototype.setPublic = RSASetPublic;
  RSAKey.prototype.encrypt = RSAEncrypt;

  // base64.js

  var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var b64padchar = "=";
  function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
      c = parseInt(h.substring(i, i + 3), 16);
      ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
      c = parseInt(h.substring(i, i + 1), 16);
      ret += b64map.charAt(c << 2);
    } else if (i + 2 == h.length) {
      c = parseInt(h.substring(i, i + 2), 16);
      ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) ret += b64padchar;
    return ret;
  }

  // convert a base64 string to hex
  function b64tohex(s) {
    var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b64padchar = "=";
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop;
    for (i = 0; i < s.length; ++i) {
      if (s.charAt(i) == b64padchar) break;
      v = b64map.indexOf(s.charAt(i));
      if (v < 0) continue;
      if (k == 0) {
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 1;
      } else if (k == 1) {
        ret += int2char(slop << 2 | v >> 4);
        slop = v & 0xf;
        k = 2;
      } else if (k == 2) {
        ret += int2char(slop);
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 3;
      } else {
        ret += int2char(slop << 2 | v >> 4);
        ret += int2char(v & 0xf);
        k = 0;
      }
    }
    if (k == 1) ret += int2char(slop << 2);
    return ret;
  }

  // convert a base64 string to a byte/number array
  function b64toBA(s) {
    //piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = new Array();
    for (i = 0; 2 * i < h.length; ++i) {
      a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
  }
  return encryptValueApi(val, key);
}
//# sourceMappingURL=SDKEncryptionTS.d.js.map
export class CardCallBackResponse {
    creationTime;
    modifiedTime;
    id;
    cardNumber;
    panFirst6;
    panLast4;
    state;
    sequenceNumber;
    cardProfileName;
    pinFailCount;
    reissue;
    expiry;
    customerNumber;
    embossedName;
    programName;
    pan;
    cvv2;

    constructor(creationTime, 
        modifiedTime, 
        id, 
        cardNumber, 
        panFirst6, 
        panLast4, 
        state, 
        sequenceNumber, 
        cardProfileName, 
        pinFailCount, 
        reissue, 
        expiry, 
        customerNumber, 
        embossedName, 
        programName, 
        pan, 
        cvv2) {
            this.creationTime = creationTime;
            this.modifiedTime = modifiedTime;
            this.id = id;
            this.cardNumber = cardNumber;
            this.panFirst6 = panFirst6;
            this.panLast4 = panLast4;
            this.state = state;
            this.sequenceNumber = sequenceNumber;
            this.cardProfileName = cardProfileName;
            this.pinFailCount = pinFailCount;
            this.reissue = reissue;
            this.expiry = expiry;
            this.customerNumber = customerNumber;
            this.embossedName = embossedName;
            this.programName = programName;
            this.pan = pan;
            this.cvv2 = cvv2;
  
    }
  }
  
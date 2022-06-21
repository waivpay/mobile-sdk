export class CardCallBackResponse {
    creationTime: string;
    modifiedTime: string;
    id: string;
    cardNumber: string;
    panFirst6: string;
    panLast4: string;
    state: string;
    sequenceNumber: number;
    cardProfileName: string;
    pinFailCount: number;
    reissue: boolean;
    expiry: string;
    customerNumber: string;
    embossedName: string;
    programName: string;
    pan: string;
    cvv2: string;

    constructor(creationTime: string,
        modifiedTime: string,
        id: string,
        cardNumber: string,
        panFirst6: string,
        panLast4: string,
        state: string,
        sequenceNumber: number,
        cardProfileName: string,
        pinFailCount: number,
        reissue: boolean,
        expiry: string,
        customerNumber: string,
        embossedName: string,
        programName: string,
        pan: string,
        cvv2: string) {
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
  
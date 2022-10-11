import {Hmac} from "crypto";

export class SumsubAPISignature {
    constructor(readonly signature: Hmac, readonly timestamp: number) {}
}
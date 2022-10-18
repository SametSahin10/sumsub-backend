import axios from "axios";
import {createHmac, Hmac} from "crypto";
import FormData from "form-data";
import {SUMSUB_ROOT_URL} from "./constants";
import {SumsubAPISignature} from "./models/sumsub_api_signature";

type SumsubAPIRequest = {
    url: string, method: string, queryParams: any, body?: any,
};

export class SumsubAPISignatureService {
    private SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;

    constructor(readonly request: SumsubAPIRequest) {}

    createSignature(): SumsubAPISignature {
        if (this.SUMSUB_SECRET_KEY === undefined) {
            throw Error(
                "Cannot create signature. SUMSUB_SECRET_KEY is undefined."
            );
        }

        const signature = createHmac("SHA256", this.SUMSUB_SECRET_KEY);
        const timestamp = this.createTimestamp();
        const valueToSign = this.createTheValueToSign(timestamp);
        signature.update(valueToSign);
        this.updateSignatureAccordingToRequestConfigData(signature);
        return new SumsubAPISignature(signature, timestamp);
    }

    private createTheValueToSign(timestamp: number) {
        const urlWithQueryParams = axios.getUri({
            url: this.request.url, params: this.request.queryParams
        });
        const urlWithoutSumsubRootURL =
            urlWithQueryParams.replace(SUMSUB_ROOT_URL, "");
        return timestamp +
            this.request.method.toUpperCase() +
            urlWithoutSumsubRootURL;
    }

    private updateSignatureAccordingToRequestConfigData(signature: Hmac) {
        const requestBody = this.request.body;

        if (requestBody instanceof FormData) {
            signature.update(requestBody.getBuffer());
        } else if (requestBody) {
            signature.update(requestBody);
        }
    }

    private createTimestamp() {
        const now = Date.now();
        return Math.floor(now / 1000);
    }
}
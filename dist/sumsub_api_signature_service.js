"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SumsubAPISignatureService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const form_data_1 = __importDefault(require("form-data"));
const constants_1 = require("./constants");
const sumsub_api_signature_1 = require("./models/sumsub_api_signature");
class SumsubAPISignatureService {
    constructor(request) {
        this.request = request;
        this.SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
    }
    createSignature() {
        if (this.SUMSUB_SECRET_KEY === undefined) {
            throw Error("Cannot create signature. SUMSUB_SECRET_KEY is undefined.");
        }
        const signature = (0, crypto_1.createHmac)("SHA256", this.SUMSUB_SECRET_KEY);
        const timestamp = this.createTimestamp();
        const valueToSign = this.createTheValueToSign(timestamp);
        signature.update(valueToSign);
        this.updateSignatureAccordingToRequestConfigData(signature);
        return new sumsub_api_signature_1.SumsubAPISignature(signature, timestamp);
    }
    createTheValueToSign(timestamp) {
        const urlWithQueryParams = axios_1.default.getUri({
            url: this.request.url, params: this.request.queryParams
        });
        const urlWithoutSumsubRootURL = urlWithQueryParams.replace(constants_1.SUMSUB_ROOT_URL, "");
        return timestamp +
            this.request.method.toUpperCase() +
            urlWithoutSumsubRootURL;
    }
    updateSignatureAccordingToRequestConfigData(signature) {
        const requestBody = this.request.body;
        if (requestBody instanceof form_data_1.default) {
            signature.update(requestBody.getBuffer());
        }
        else if (requestBody) {
            signature.update(requestBody);
        }
    }
    createTimestamp() {
        const now = Date.now();
        return Math.floor(now / 1000);
    }
}
exports.SumsubAPISignatureService = SumsubAPISignatureService;

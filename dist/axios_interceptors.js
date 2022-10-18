"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndAddHeadersRequiredForSumsubAPI = void 0;
const sumsub_api_signature_service_1 = require("./sumsub_api_signature_service");
function createAndAddHeadersRequiredForSumsubAPI(config) {
    const canAddHeadersRequiredForSumsubAuth = config.url !== undefined &&
        config.method !== undefined &&
        config.headers !== undefined;
    if (canAddHeadersRequiredForSumsubAuth) {
        addHeadersRequiredForSumsubAuth(config.url, config.method, config.headers, config.params);
    }
    return config;
}
exports.createAndAddHeadersRequiredForSumsubAPI = createAndAddHeadersRequiredForSumsubAPI;
function addHeadersRequiredForSumsubAuth(url, method, headers, queryParams) {
    const sumsubAPISignatureService = new sumsub_api_signature_service_1.SumsubAPISignatureService({
        url: url,
        method: method,
        queryParams: queryParams,
    });
    const sumsubAPISignature = sumsubAPISignatureService.createSignature();
    if (headers !== undefined) {
        headers["X-App-Access-Ts"] = sumsubAPISignature.timestamp;
        headers["X-App-Access-Sig"] =
            sumsubAPISignature.signature.digest("hex");
        const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
        headers["X-App-Token"] = SUMSUB_APP_TOKEN;
        headers["Accept"] = "application/json";
    }
}

import {AxiosRequestConfig, RawAxiosRequestHeaders} from "axios";
import {SumsubAPISignatureService} from "./sumsub_api_signature_service";

export function createAndAddHeadersRequiredForSumsubAPI(
    config: AxiosRequestConfig
) {
    const canAddHeadersRequiredForSumsubAuth = config.url !== undefined &&
        config.method !== undefined &&
        config.headers !== undefined;

    if (canAddHeadersRequiredForSumsubAuth) {
        addHeadersRequiredForSumsubAuth(
            config.url!, config.method!, config.headers!, config.params,
        );
    }

    return config;
}

function addHeadersRequiredForSumsubAuth(
    url: string,
    method: string,
    headers: RawAxiosRequestHeaders,
    queryParams: any,
) {
    const sumsubAPISignatureService = new SumsubAPISignatureService({
        url: url,
        method: method,
        queryParams: queryParams,
    });
    const sumsubAPISignature = sumsubAPISignatureService.createSignature();

    if (headers !== undefined) {
        headers["X-App-Access-Ts"] = sumsubAPISignature.timestamp;
        headers["X-App-Access-Sig"] =
            sumsubAPISignature.signature.digest("hex");
        const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN
        headers["X-App-Token"] = SUMSUB_APP_TOKEN;
        headers["Accept"] = "application/json";
    }
}
import axios, {AxiosRequestConfig, RawAxiosRequestHeaders} from "axios";
import {SumsubAPISignatureService} from "./sumsub_api_signature_service";
import {SUMSUB_ROOT_URL} from "./constants";

function createAndAddHeadersRequiredForSumsubAPI(config: AxiosRequestConfig) {
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

axios.interceptors.request.use(createAndAddHeadersRequiredForSumsubAPI);

function addHeadersRequiredForSumsubAuth(
    url: string, method: string,
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

export async function getAccessToken(userID: string): Promise<string> {
    const url = `${SUMSUB_ROOT_URL}/resources/accessTokens`;

    const requestConfig: AxiosRequestConfig = {
        url: url,
        method: "POST",
        data: null,
        params: {
            userId: userID,
            levelName: "basic-kyc-level",
        }
    };

    const response = await axios(requestConfig);
    if (response.status !== 200) throw Error(response.data);
    return response.data.token;
}
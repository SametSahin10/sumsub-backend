import axios, {AxiosRequestConfig} from "axios";
import {createAndAddHeadersRequiredForSumsubAPI} from "./axios_interceptors";
import {SUMSUB_ROOT_URL} from "./constants";

axios.interceptors.request.use(createAndAddHeadersRequiredForSumsubAPI);

export async function getAccessToken(userID: string): Promise<string> {
    const url = `${SUMSUB_ROOT_URL}/resources/accessTokens`;
    const requestConfig = createAxiosRequestConfigToGetAccessToken(url, userID);
    const response = await axios(requestConfig);
    if (response.status !== 200) throw Error(response.data);
    return response.data.token;
}

function createAxiosRequestConfigToGetAccessToken(
    url: string, userID: string
): AxiosRequestConfig<any> {
    return {
        url: url,
        method: "POST",
        data: null,
        params: {
            userId: userID,
            levelName: "basic-kyc-level",
        }
    };
}

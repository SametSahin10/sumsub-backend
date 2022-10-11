"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const sumsub_api_signature_service_1 = require("./sumsub_api_signature_service");
const constants_1 = require("./constants");
function createAndAddHeadersRequiredForSumsubAPI(config) {
    const canAddHeadersRequiredForSumsubAuth = config.url !== undefined &&
        config.method !== undefined &&
        config.headers !== undefined;
    if (canAddHeadersRequiredForSumsubAuth) {
        addHeadersRequiredForSumsubAuth(config.url, config.method, config.headers, config.params);
    }
    return config;
}
axios_1.default.interceptors.request.use(createAndAddHeadersRequiredForSumsubAPI);
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
function getAccessToken(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${constants_1.SUMSUB_ROOT_URL}/resources/accessTokens`;
        const requestConfig = {
            url: url,
            method: "POST",
            data: null,
            params: {
                userId: userID,
                levelName: "basic-kyc-level",
            }
        };
        const response = yield (0, axios_1.default)(requestConfig);
        if (response.status !== 200)
            throw Error(response.data);
        return response.data.token;
    });
}
exports.getAccessToken = getAccessToken;

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
const axios_interceptors_1 = require("./axios_interceptors");
const constants_1 = require("./constants");
axios_1.default.interceptors.request.use(axios_interceptors_1.createAndAddHeadersRequiredForSumsubAPI);
function getAccessToken(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${constants_1.SUMSUB_ROOT_URL}/resources/accessTokens`;
        const requestConfig = createAxiosRequestConfigToGetAccessToken(url, userID);
        const response = yield (0, axios_1.default)(requestConfig);
        if (response.status !== 200)
            throw Error(response.data);
        return response.data.token;
    });
}
exports.getAccessToken = getAccessToken;
function createAxiosRequestConfigToGetAccessToken(url, userID) {
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

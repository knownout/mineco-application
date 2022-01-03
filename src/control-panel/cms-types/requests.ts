/**
 * Server response type
 */
export interface Response<T = any> {
    success: boolean,
    errorCodes?: string[],
    responseContent?: T
}

/**
 * Server requests list
 */
const RequestOptions = {
    recaptchaToken: "recaptchaToken",
    accountLogin: "accountLogin",
    accountHash: "accountHash"
};

export { RequestOptions };
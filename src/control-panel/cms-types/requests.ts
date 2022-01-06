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
    accountHash: "accountHash",
    uploadFile: "uploadFile"
};

export const MaterialSearchRequests = {
    title: "find:materialTitle",
    description: "find:materialDescription",
    tags: "find:materialTags",
    datetimeFrom: "find:materialDatetimeFrom",
    datetimeTo: "find:materialDatetimeTo",
    identifier: "find:materialIdentifier",
    limit: "find:limit",
    content: "find:materialContent"
};

export const FileSearchRequests = {
    filename: "find:fileName"
};

export { RequestOptions };
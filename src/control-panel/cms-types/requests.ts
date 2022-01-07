/**
 * Server response type
 */
export interface Response<T = any> {
    success: boolean,
    errorCodes?: string[],
    responseContent?: T
}

/**
 * Common server POST requests list
 */
const RequestOptions = {
    recaptchaToken: "recaptchaToken",
    accountLogin: "accountLogin",
    accountHash: "accountHash",
    uploadFile: "uploadFile",
    getFilePreview: "getFilePreview",
    limitSearchResponse: "find:limit",
    deleteFile: "deleteFile"
};

/**
 * POST requests list for the material search
 * with /app/materials/search server endpoint
 */
export const MaterialSearchOptions = {
    title: "find:materialTitle",
    description: "find:materialDescription",
    tags: "find:materialTags",
    datetimeFrom: "find:materialDatetimeFrom",
    datetimeTo: "find:materialDatetimeTo",
    identifier: "find:materialIdentifier",
    content: "find:materialContent"
};

/**
 * POST requests list for the files search
 * with /app/materials/search server endpoint
 */
export const FileSearchOptions = {
    filename: "find:fileName",

    datetimeFrom: "find:fileDatetimeFrom",
    datetimeTo: "find:fileDatetimeTo",
    identifier: "find:fileIdentifier",
    extension: "find:fileExtension"
};

export const VariableSearchOptions = {
    variableName: "find:variableName"
};

export { RequestOptions };
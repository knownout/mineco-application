/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { ItemObject } from "../../control-panel/components/root-form/item-object-renderers/renderers";

/**
 * Server response type
 */
export interface Response<T = any>
{
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


    // Files
    uploadFile: "uploadFile",
    getFilePreview: "getFilePreview",
    deleteFile: "deleteFile",


    // Materials
    getMaterial: "getMaterial",
    deleteMaterial: "deleteMaterial",
    updateMaterialData: "material:updateContent",
    updateMaterialText: "material:updateText",
    updateMaterial: "material:updateIdentifier",


    // Other
    limitSearchResponse: "find:limit",
    searchOffset: "find:offset"
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
    content: "find:materialContent",
    excludeTags: "find:materialExcludeTags",
    pinned: "find:materialPinned",
    excludeEmpty: "material:excludeEmpty"
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

export const VariableOptions = {
    variableName: "variable:variableName",
    updateVariableName: "variable:variableName",
    updateVariableValue: "variable:updateVariable"
};

/**
 * Type for material data server response
 */
export type MaterialDataResponse = { data: ItemObject.Material, content: unknown, tags: string[] }

export { RequestOptions };

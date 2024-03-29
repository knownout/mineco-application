/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Application server root location
 */
export const serverRoot = process.env.BACKEND_PATH === "local-based" ? (window.location.protocol + "//" + window.location.hostname) : process.env.BACKEND_PATH as string;

/**
 * Server routes list
 */
export const serverRoutesList = {
    auth: "/app/auth/index.php",

    searchMaterials: "/app/materials/search/index.php",
    searchFiles: "/app/files/search/index.php",
    searchVariables: "/app/variables/search/index.php",

    getTotalMaterials: "/app/materials/get-total/index.php",

    uploadFile: "/app/files/upload/index.php",
    getFilePreview: "/app/files/preview/index.php",
    deleteFile: "/app/files/delete/index.php",

    updateVariable: "/app/variables/update/index.php",

    getMaterial: "/app/materials/get/index.php",
    deleteMaterial: "/app/materials/delete/index.php",
    updateMaterial: "/app/materials/update/index.php",

    sendMail: "/app/send-mail.php",

    getFile: (file: string, download: boolean) => makeRoute("/app/files/get/index.php?file=" + file + (download
        ? "&amp;download=true" : ""))
};

/**
 * Application routes list
 */
export const appRoutesList = {
    auth: "/control-panel/auth",
    cms: "/control-panel",
    material: "/view/"
};

/**
 * Function for creating paths from the relative path and root
 * @param path relative path
 * @param root root path
 */
export function makeRoute (path: string, root: string = serverRoot) {
    return root + path;
}

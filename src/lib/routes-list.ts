/**
 * Application server root location
 */
export const serverRoot = window.location.protocol + "//" + window.location.hostname;

/**
 * Server routes list
 */
export const serverRoutesList = {
    auth: "/app/auth",

    searchMaterials: "/app/materials/search",
    searchFiles: "/app/files/search",
    searchVariables: "/app/variables/search",

    uploadFile: "/app/files/upload",
    getFileContent: "/app/files/preview"
};

/**
 * Application routes list
 */
export const appRoutesList = {
    auth: "/control-panel/auth",
    cms: "/control-panel"
};

/**
 * Function for creating paths from the relative path and root
 * @param path relative path
 * @param root root path
 */
export function makeRoute (path: string, root: string = serverRoot) {
    return root + path;
}
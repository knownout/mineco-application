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

    getTotalMaterials: "/app/materials/get-total",

    uploadFile: "/app/files/upload",
    getFilePreview: "/app/files/preview",
    deleteFile: "/app/files/delete",

    updateVariable: "/app/variables/update",

    getMaterial: "/app/materials/get",
    deleteMaterial: "/app/materials/delete",
    updateMaterial: "/app/materials/update",
    
    sendMail: "/app/send-mail.php",

    getFile: (file: string, download: boolean) => makeRoute("/app/files/get/?file=" + file + (download
        ? "&download=true" : ""))
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

export namespace Requests
{
    export enum ActionsList
    {
        getTagsList,
        getPinnedMaterial,
        getMaterials,
        updateMaterial,
        removeMaterial,
        changePassword,
        uploadFile,
        getFilesList,
        getImagesList,
        getFullMaterial
    }

    export const TypesList = {
        Action: "Request:Action",
        AccountLogin: "Account:Login",
        AccountHash: "Account:Hash",
        AccountNewHash: "Account:NewHash",

        DataTag: "Data:Tag",
        DataLimit: "Data:Limit",
        DataFindPinned: "Data:FindPinned",
        DataTitle: "Data:Title",
        DataTimeStart: "Data:TimeStart",
        DataTimeEnd: "Data:TimeEnd",
        DataIdentifier: "Data:Identifier",

        UpdateIdentifier: "Update:Identifier",
        UpdateContent: "Update:Content",
        UpdatePinned: "Update:Pinned",
        UpdateTitle: "Update:Title",
        UpdateTime: "Update:Time",
        UpdateTags: "Update:Tags",
        UpdateShort: "Update:Short"
    };
}
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
        getFullMaterial,
        verifyAccountData,
        verifyCaptchaRequest,
        getFromProperties,
        updateProperty,
        removeFile
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
        DataOffset: "Data:Offset",
        DataShort: "Data:Short",

        CaptchaToken: "Captcha:ResponseToken",

        Property: "Database:Property",
        PropertyValue: "Database:PropertyValue",

        FileName: "File:Name",
        FileDate: "File:Date",

        UpdateIdentifier: "Update:Identifier",
        UpdateContent: "Update:Content",
        UpdatePinned: "Update:Pinned",
        UpdateTitle: "Update:Title",
        UpdateTime: "Update:Time",
        UpdateTags: "Update:Tags",
        UpdateShort: "Update:Short",

        UploadFileToken: "24DE53B2C0A9E15844AE9B37E9B52EC8"
    };

    export interface RequestResult<T = any>
    {
        success: boolean
        meta: T
    }
}

export namespace Material
{
    interface RawCore
    {
        title: string
        tags: string
        time: string
        preview: string
    }

    export interface PreviewRaw extends RawCore
    {
        identifier: string
        short: string
        pinned: string
    }

    export interface Full<T = PreviewRaw>
    {
        content: { [key: string]: any }
        data: T
    }

    export interface Preview extends Omit<PreviewRaw, "tags" | "time" | "pinned">
    {
        tags: string[]
        time: number
        pinned: boolean
    }
}

export interface IAccountData
{
    name: string
    password: string
    login: string
}

export interface IHashedAccountData
{
    login: string
    hash: CryptoJS.lib.WordArray
}

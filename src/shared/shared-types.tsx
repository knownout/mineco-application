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
        verifyAccountData
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

        CaptchaToken: "Captcha:ResponseToken",

        UpdateIdentifier: "Update:Identifier",
        UpdateContent: "Update:Content",
        UpdatePinned: "Update:Pinned",
        UpdateTitle: "Update:Title",
        UpdateTime: "Update:Time",
        UpdateTags: "Update:Tags",
        UpdateShort: "Update:Short"
    };

    export interface RequestResult<T = any>
    {
        success: boolean,
        meta: T
    }
}

export namespace Material
{
    export interface Core
    {
        title: string,
        tags: string[],
        time: number,
    }

    export interface Preview extends Core
    {
        identifier: string,
        short: string,
        pinned: number
    }

    export interface Full
    {
        content: { [key: string]: any },
        data: Core
    }
}

export interface IAccountData
{
    name: string;
    password: string;
    login: string;
}

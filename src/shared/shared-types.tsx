/**
 * Requests types
 */
export namespace Requests
{
    /**
     * List of all available for Action request entry values
     */
    export enum ActionsList
    {
        /** Get all tags from database */
        getTagsList,

        /** Get latest pinned material */
        getPinnedMaterial,

        /** Get list of specifically sorted materials */
        getMaterials,

        /** Update material at server */
        updateMaterial,

        /** Remove material from server */
        removeMaterial,

        /** Change password for the current user account */
        changePassword,

        /** Upload one file to the server */
        uploadFile,

        /** Get uploaded files (including images) list */
        getFilesList,

        /** Get uploaded images (jpeg) list */
        getImagesList,

        /** Get both metadata and content of the material */
        getFullMaterial,

        /** Compare stored user account data with database entries */
        verifyAccountData,

        /** Verify Google Recaptcha token */
        verifyCaptchaRequest,

        /** Get value from properties database */
        getFromProperties,

        /** Update property value at properties database */
        updateProperty,

        /** Remove file from user storage (uploaded files only) */
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

    /**
     * Result of the request to the server (response)
     */
    export interface RequestResult<T = any>
    {
        success: boolean
        meta: T
    }
}

/**
 * Namespace for the material-like objects
 */
export namespace Material
{
    /** Internal interface for core properties of the material preview data */
    interface RawCore<T = string>
    {
        title: T
        tags: T
        time: T
        preview: T
    }

    /** Raw material preview data from server (need to be processed) */
    export interface PreviewRaw<T = string> extends RawCore<T>
    {
        identifier: T
        short: T
        pinned: T
    }

    /** Full material data (metadata and content) */
    export interface Full<T = PreviewRaw>
    {
        content: { [key: string]: any }
        data: T
    }

    /** Processed material preview data */
    export interface Preview extends Omit<PreviewRaw, "tags" | "time" | "pinned">
    {
        tags: string[]
        time: number
        pinned: boolean
    }

    /** Material preview data with stub property for image lazy-load */
    export interface LazyPreview extends Preview
    {
        stub: string
    }

    /** Request result, that will be returned from server after material update */
    export interface AffectResult extends PreviewRaw<boolean | null>
    {
        content: boolean | null
    }
}

/**
 * User account data interface
 */
export interface IAccountData
{
    /** User name (not login) */
    name: string

    /** User raw password (not hashed) */
    password: string

    /** User login */
    login: string
}

/**
 * Interface for user account data prepared for authentication
 */
export interface IHashedAccountData
{
    /** User login */
    login: string

    /** Hashed user password */
    hash: CryptoJS.lib.WordArray
}

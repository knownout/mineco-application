/**
 * Namespace for the Account types
 */
export namespace Account {
    /**
     * Account data from server or cache
     */
    export interface Response {
        login: string,
        hash: string,
        fullname: string
    }
}
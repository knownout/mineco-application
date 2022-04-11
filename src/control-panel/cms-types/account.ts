/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Namespace for the Account types
 */
export namespace Account
{
    /**
     * Account data from server or cache
     */
    export interface Response
    {
        login: string,
        hash: string,
        fullname: string
    }
}

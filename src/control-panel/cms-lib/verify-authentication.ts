import useRecaptcha from "../../lib/use-recaptcha";
import { makeRoute, serverRoutesList } from "../../lib/routes-list";
import MakeFormData from "../../lib/make-form-data";

import { Account } from "../cms-types/account";
import CacheController, { cacheKeysList } from "../../lib/cache-controller";
import { RequestOptions, Response } from "../cms-types/requests";

import { MD5 } from "crypto-js";

/**
 * Function for verification account data with ability of checking local storage
 * for locally cached account data
 *
 * Search for cached account data performed only if login or password not
 * specified
 *
 * @param login account login
 * @param password account password
 * @param hash set false if password already hashed
 */
export default async function verifyAuthentication (login?: string, password?: string, hash: boolean = true) {
    const cacheController = new CacheController(localStorage);

    // Get account data from cache if exist
    const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);

    // If login and password specified, remove cached account data
    if (login && password) cacheController.removeItem(cacheKeysList.accountData);
    else {
        // If no account data, exit
        if (!accountData) return false;

        // Get account data from cache
        login = accountData.login;
        password = accountData.hash;
        hash = false;
    }

    // Get Google reCAPTCHA client token
    const token = await useRecaptcha();

    const formData = new MakeFormData({
        [RequestOptions.recaptchaToken]: token,
        [RequestOptions.accountLogin]: login,
        [RequestOptions.accountHash]: hash ? MD5(password as string) : password
    });

    // Require account verification through server
    const response = await fetch(makeRoute(serverRoutesList.auth), formData.fetchObject)
        .then(response => response.json()) as Response<Account.Response>;
    
    // If response successful, cache account data
    if (response.success) cacheController.setItem<Account.Response>(
        cacheKeysList.accountData, response.responseContent as Account.Response
    );

    return response.success;
}
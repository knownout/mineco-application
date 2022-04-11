/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import verifyAuthentication from "../control-panel/cms-lib/verify-authentication";
import { Account } from "../control-panel/cms-types/account";
import CacheController, { cacheKeysList } from "./cache-controller";
import { appRoutesList } from "./routes-list";
import useRecaptcha from "./use-recaptcha";
import { RequestOptions } from "./types/requests";

/**
 * Function for requiring full authentication data and recaptcha token
 */
export async function useFullAuthentication () {
    const cacheController = new CacheController(localStorage);

    // Verify is user authorized and get fresh account data
    const authResult = await verifyAuthentication();
    const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);

    // Verify authentication
    if (!authResult || !accountData) {
        cacheController.removeItem(cacheKeysList.accountData);
        window.location.href = appRoutesList.auth;

        throw new Error("Не удалось проверить данные аккаунта");
    }

    const token = await useRecaptcha();
    const formDataEntries = {
        [RequestOptions.recaptchaToken]: token,
        [RequestOptions.accountLogin]: accountData.login,
        [RequestOptions.accountHash]: accountData.hash
    };

    return { token, accountData, formDataEntries };
}

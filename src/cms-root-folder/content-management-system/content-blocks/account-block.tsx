// Library import
import React from "react";
// Helpers import
import CacheController, { CacheKeys } from "../../../shared/cache-controller";
import { IAccountData, Requests } from "../../../shared/shared-types";
import * as Shared from "../../../shared/shared-content";
import { defaultPathsList, useForceUpdate } from "../../../shared/shared-content";
import { MD5 } from "crypto-js";
// Internal components import
import Group from "../../../shared/group-component";
import TextInput, { FilterPreset } from "../../../shared/text-input/text-input";
import Button from "../../../shared/button-component/button-component";
import PageWrapper from "../../../shared/page-wrapper";

/**
 * Action block for display user account data with ability of password changing
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function AccountBlock ()
{
    const cacheController = new CacheController(window.localStorage);
    const forceUpdate = useForceUpdate();

    // Account data from localStorage
    const accountData = cacheController.fromCache<IAccountData>(CacheKeys.accountData) as IAccountData;

    // State for new password input field
    // const [ password, setPassword ] = React.useState<string>();
    const passwordInputRef = React.createRef<HTMLInputElement>();

    const passwordButtonReference = React.createRef<HTMLButtonElement>();

    // New password field input handler
    const onTextInputReturn = () =>
    {
        if (passwordButtonReference.current)
        {
            passwordButtonReference.current.focus();
            passwordButtonReference.current.click();
        }
    };

    // Password change button click handler
    const onPasswordButtonClick = async () =>
    {
        // Return promise for button onAsyncClick property
        return await new Promise<void>((resolve, reject) =>
        {
            if (!accountData || !accountData.password)
                window.location.href = defaultPathsList.contentManagementSystemAuth;

            if (!passwordInputRef.current) return reject("no password input reference");

            const password = passwordInputRef.current.value.trim();

            // If password is too short or no account data provided, reject
            if (!password || password.length < 5 || !accountData || !accountData.password)
                reject("new password too short or no account data");
            else
            {
                const body = new Shared.RequestBody({
                    [Requests.TypesList.Action]: [ Requests.ActionsList.changePassword ],
                    [Requests.TypesList.AccountNewHash]: MD5(password),
                    [Requests.TypesList.AccountLogin]: accountData.login,
                    [Requests.TypesList.AccountHash]: MD5(accountData.password)
                });

                // Not necessary, but executing request with recaptcha security
                Shared.executeWithRecaptcha("login").then(token =>
                {
                    // Add captcha token to request body
                    body.push({ [Requests.TypesList.CaptchaToken]: token });

                    // Send request to server
                    fetch(Shared.defaultPathsList.request, body.postFormData).then(request => request.json())
                        .then((result: Requests.RequestResult) =>
                        {
                            if (!result.success) reject(result.meta);
                            else
                            {
                                accountData.password = password;
                                cacheController.cacheContent(CacheKeys.accountData, accountData);
                                if (passwordInputRef.current)
                                {
                                    passwordInputRef.current.value = "";
                                    if (passwordInputRef.current.parentElement)
                                        passwordInputRef.current.parentElement.classList.add("active");
                                }

                                forceUpdate();
                                resolve();
                            }
                        }).catch(reject);
                }).catch(resolve);
            }
        });
    };

    // If no account data in cache, redirect to authentication page
    if (!accountData)
    {
        window.location.href = defaultPathsList.contentManagementSystemAuth;
        return null;
    }

    // Check if user at normal account
    const nonDeveloperAccount = !accountData.name.includes("[backdoor]");

    const logoutButtonClick = () =>
    {
        cacheController.removeCachedContent(CacheKeys.accountData)
            .removeCachedContent(CacheKeys.cmsMenuRouterPage);

        window.location.href = defaultPathsList.contentManagementSystemAuth;
    };

    const containerClassNames = Shared.classNames("account-block content-block", {
        "backdoor": accountData.name.includes("[backdoor]")
    });

    return <PageWrapper className="content-block files-block">
        <div className={ containerClassNames }>
            <span className="block-title">Параметры аккаунта</span>
            <Group className="semi-transparent name" title="Имя пользователя" children={ accountData.name } />

            <Group condition={ nonDeveloperAccount } className="cluster">
                <Group className="semi-transparent login" title="Имя аккаунта" children={ accountData.login } />

                <Group className="semi-transparent password" title="Пароль"
                       children={
                           accountData.password.slice(0, Math.floor(accountData.password.length / 2))
                           + new Array(Math.ceil(accountData.password.length / 2)).fill("•").join("")
                       } />
            </Group>

            <button onClick={ logoutButtonClick }>Выйти из аккаунта
            </button>

            { nonDeveloperAccount && <span className="block-title">Изменить пароль</span> }
            <Group className="border-only" condition={ nonDeveloperAccount }>
                <TextInput placeholder="Новый пароль" filters={ FilterPreset.latinWithSymbols }
                           icon={ Shared.createBootstrapIcon("key") }
                           onReturn={ onTextInputReturn }
                           inputRef={ passwordInputRef } />
                <Button reference={ passwordButtonReference } onAsyncClick={ onPasswordButtonClick }>
                    Изменить пароль
                </Button>
            </Group>
        </div>
    </PageWrapper>;
}

import React from "react";

import CacheController, { CacheKeys } from "../../../shared/cache-controller";
import { IAccountData } from "../../../shared/shared-types";
import {
    classNames,
    createBootstrapIcon,
    defaultPathsList,
    executeWithRecaptcha,
    RequestBody
} from "../../../shared/shared-content";
import { Requests } from "../../../shared/shared-types";
import { MD5 } from "crypto-js";

import Group from "../../../shared/group-component";
import TextInput, { FilterPreset } from "../../../shared/text-input/text-input";
import Button from "../../../shared/button-component/button-component";

import "./content-blocks.scss";
import RequestResult = Requests.RequestResult;

export default function AccountBlock ()
{
    const cacheController = new CacheController(window.localStorage);
    const accountData = cacheController.fromCache<IAccountData>(CacheKeys.accountData) as IAccountData;
    const [ password, setPassword ] = React.useState<string | null>(null);

    const passwordButtonReference = React.createRef<HTMLButtonElement>();

    const onTextInputReturn = () =>
    {
        if (passwordButtonReference.current)
        {
            passwordButtonReference.current.focus();
            passwordButtonReference.current.click();
        }
    };

    const onPasswordButtonClick = async () =>
    {
        return await new Promise<void>((resolve, reject) =>
        {
            if (!password || password.length < 5 || !accountData || !accountData.password) reject();
            else
            {
                const body = new RequestBody({
                    [Requests.TypesList.Action]: [ Requests.ActionsList.changePassword ],
                    [Requests.TypesList.AccountNewHash]: MD5(password),
                    [Requests.TypesList.AccountLogin]: accountData.login,
                    [Requests.TypesList.AccountHash]: MD5(accountData.password)
                });

                executeWithRecaptcha("login").then(token =>
                {
                    body.push({ [Requests.TypesList.CaptchaToken]: token });
                    fetch(defaultPathsList.request, body.postFormData).then(request => request.json())
                        .then((result: RequestResult) =>
                        {
                            console.log(result);
                            if (!result.success) reject();
                            else
                            {
                                accountData.password = password;
                                cacheController.cacheContent(CacheKeys.accountData, accountData);
                                setPassword(null);

                                resolve();
                            }
                        }).catch(reject);
                }).catch(resolve);
            }
        });
    };

    if (!accountData)
    {
        window.location.href = "/content-management-system/auth";
        return null;
    }

    return <div className={
        classNames("account-block content-block", { "backdoor": accountData.name.includes("[backdoor]") })
    }>
        <span className="block-title">Параметры аккаунта</span>
        <Group className="semi-transparent name" title="Имя пользователя">
            { accountData.name }
        </Group>
        { !accountData.name.includes("[backdoor]") && <Group className="semi-transparent login" title="Имя аккаунта">
            { accountData.login }
        </Group> }
        { !accountData.name.includes("[backdoor]") && <Group className="semi-transparent password" title="Пароль">
            {
                accountData.password.slice(0, Math.floor(accountData.password.length / 2))
                + new Array(Math.ceil(accountData.password.length / 2)).fill("•").join("")
            }
        </Group> }
        <button onClick={ () =>
        {
            cacheController.removeCachedContent(CacheKeys.accountData);
            cacheController.removeCachedContent(CacheKeys.cmsMenuRouterPage);

            window.location.href = "/content-management-system/auth";
        } }>Выйти из аккаунта
        </button>

        <span className="block-title">Изменить пароль</span>
        <Group className="border-only">
            <TextInput placeholder="Новый пароль" filters={ FilterPreset.latinWithSymbols }
                       icon={ createBootstrapIcon("key") }
                       onInput={ (element, value) => setPassword(value) }
                       onReturn={ onTextInputReturn } />
            <Button reference={ passwordButtonReference } onAsyncClick={ onPasswordButtonClick }>
                Изменить пароль
            </Button>
        </Group>
    </div>;
}

// Import library
import React from "react";
// Context data import
import { IAccountData, Requests } from "../../shared/shared-types";
// Import helper functions
import {
    createBootstrapIcon,
    defaultPathsList,
    executeWithRecaptcha,
    RequestBody,
    verifyStoredAccountData
} from "../../shared/shared-content";

import { MD5 } from "crypto-js";
// Import internal components
import Input, { FilterPreset } from "../../shared/input/input";
import Button from "../../shared/button/button";
import PageWrapper from "../../shared/page-wrapper";
// Import stylesheets
import "./authentication-form.scss";
import CacheController, { CacheKeys } from "../../shared/cache-controller";

// Shortcuts
import RequestResult = Requests.RequestResult;

/**
 * Authentication form component for content management system
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.3.4
 */
export default class AuthenticationForm extends React.PureComponent<{}, { fadeOut: boolean }>
{
    state: { fadeOut: boolean } = { fadeOut: false };

    private loginButtonReference = React.createRef<HTMLButtonElement>();
    private cacheController = new CacheController(window.localStorage);

    /**
     * Function for requesting account verification from server
     * @param login user login
     * @param password password (not hash)
     * @param successCallback callback when successfully verified
     */
    private requestAuthentication<T = IAccountData> (login: string, password: string, successCallback?:
        (result: RequestResult<T>) => void)
    {
        // Get password hash
        const hash = MD5(password);

        const body = new RequestBody({
            [Requests.TypesList.Action]: [ Requests.ActionsList.verifyAccountData ],
            [Requests.TypesList.AccountLogin]: login,
            [Requests.TypesList.AccountHash]: hash
        });

        // Create new promise (for Button component)
        return new Promise<void>((resolve, reject) =>
        {
            // If invalid auth data
            if (login.length < 3 || password.length < 3)
                return reject("too short login or password");

            executeWithRecaptcha("login").then(token =>
            {
                body.push({ [Requests.TypesList.CaptchaToken]: token });

                // Send request to server
                fetch(defaultPathsList.request, body.postFormData).then(request => request.json())
                    .then((result: RequestResult<T>) =>
                    {
                        if (!result.success) return reject(result.meta);
                        const response: IAccountData = {
                            ...result.meta,
                            login,
                            password
                        } as any;

                        // If request successful and no exceptions, execute callback function
                        if (successCallback) successCallback({ success: result.success, meta: response as any });
                        resolve();
                    }).catch(reject);
            });
        });
    }

    /**
     * Function for verification cached user account data
     */
    private verifyStoredAccountData ()
    {
        return verifyStoredAccountData(result =>
        {
            if (!result) return;
            window.location.href = defaultPathsList.contentManagementSystem;
        });
    }

    render (): React.ReactNode
    {
        // Variable for storing text input values (state will update whole form, so i created variables for this)
        const textInputValue = { login: String(), password: String() };
        const loginButtonReference = this.loginButtonReference;

        // Properties for text input fields
        const textInputProperties = {
            common: {
                filters: FilterPreset.latinWithSymbols,
                onReturn ()
                {
                    if (!loginButtonReference.current) return;

                    loginButtonReference.current.focus();
                    loginButtonReference.current.click();
                }
            },

            login: {
                icon: createBootstrapIcon("person-badge"),
                placeholder: "Имя пользователя",

                onInput (value: string) { textInputValue.login = value; }
            },

            password: {
                icon: createBootstrapIcon("key"),
                placeholder: "Пароль",
                type: "password",

                onInput (value: string) { textInputValue.password = value; }
            }
        };

        // Shortcut for authentication request function
        const requestAuthentication = () => this.requestAuthentication(
            textInputValue.login, textInputValue.password, result =>
            {
                this.cacheController.cacheContent(CacheKeys.accountData, result.meta);
                this.setState({ fadeOut: true }, () =>
                    window.location.href = defaultPathsList.contentManagementSystem
                );
            }
        );

        return <PageWrapper loadingLabel="Загрузка данных авторизации" fadeOut={ this.state.fadeOut }
                            asyncContent={ this.verifyStoredAccountData }>
            <div className="auth-form-wrapper">
                <span className="form-title">Вход в панель управления</span>
                <div className="form-fields-container">
                    <Input { ...textInputProperties.login } { ...textInputProperties.common } />
                    <Input { ...textInputProperties.password } { ...textInputProperties.common } />
                </div>

                <div className="form-buttons-container">
                    <Button onAsyncClick={ requestAuthentication } reference={ this.loginButtonReference }>
                        Войти
                    </Button>
                    <button onClick={ () => window.location.href = "/" } className="simple">На главную</button>
                </div>
            </div>
        </PageWrapper>;
    }
}

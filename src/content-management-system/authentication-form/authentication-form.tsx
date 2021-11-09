// Import library
import React from "react";

// Import helper functions
import { createBootstrapIcon, defaultPathsList, RequestBody } from "../../shared/shared-content";
import { MD5 } from "crypto-js";

// Import external components
import Recaptcha from "react-recaptcha";

// Import internal components
import TextInput from "../../shared/text-input/text-input";
import Button from "../../shared/button-component/button-component";

// Import stylesheets
import "./authentication-form.scss";
import { Requests } from "../../shared/shared-types";
import RequestResult = Requests.RequestResult;

namespace AuthForm
{
    export interface Properties
    {

    }

    export interface State
    {
        recaptchaVerification: boolean;
    }
}

/**
 * Authentication form component for content management system
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.3.4
 */
export default class AuthenticationForm extends React.PureComponent<AuthForm.Properties, AuthForm.State>
{
    state: AuthForm.State = { recaptchaVerification: false };

    /**
     * Function for requesting account verification from server
     * @param login user login
     * @param password password (not hash)
     * @param successCallback callback when successfully verified
     */
    private requestAuthentication (login: string, password: string, successCallback?: (result: RequestResult) => void)
        : Promise<RequestResult>
    {
        // Get password hash
        const hash = MD5(password);

        const body = new RequestBody({
            [Requests.TypesList.Action]: [ Requests.ActionsList.verifyAccountData ],
            [Requests.TypesList.AccountLogin]: login,
            [Requests.TypesList.AccountHash]: hash
        });

        // Create new promise (for Button component)
        return new Promise((resolve, reject) =>
        {
            // If recaptcha not verified or invalid auth data
            if (!this.state.recaptchaVerification || login.length < 3 || password.length < 3)
                return reject();

            // Send request to server
            fetch(defaultPathsList.request, body.postFormData).then(request => request.json())
                .then((result: RequestResult) =>
                {
                    if (!result.success) return reject();

                    // If request successful and no exceptions, execute callback function
                    if (successCallback) successCallback(result);
                    resolve(result);
                }).catch(reject);
        });
    }

    render (): React.ReactNode
    {
        // Variable for storing text input values (state will update whole form, so i created variables for this)
        const textInputValue = { login: String(), password: String() };

        // Properties for text input fields
        const textInputProperties = {
            login: {
                icon: createBootstrapIcon("person-badge"),
                placeholder: "Имя пользователя",

                onInput (element: HTMLInputElement, value: string) { textInputValue.login = value; }
            },

            password: {
                icon: createBootstrapIcon("key"),
                placeholder: "Пароль",

                onInput (element: HTMLInputElement, value: string) { textInputValue.password = value; }
            }
        };

        // Shortcut for authentication request function
        const requestAuthentication = () => this.requestAuthentication(
            textInputValue.login, textInputValue.password, result =>
            {
                console.log(result);
            }
        );

        return <div className="auth-form-wrapper">
            <span className="form-title">Вход в панель управления</span>
            <div className="form-fields-container">
                <TextInput { ...textInputProperties.login } />
                <TextInput { ...textInputProperties.password } />
            </div>

            <Recaptcha sitekey="6Lf41iIdAAAAACNhIqTPtW6ynSo1RI5RP9-l9DHJ" verifyCallback={ () =>
            {
                this.setState({ recaptchaVerification: true });
            } } />

            <div className="form-buttons-container">
                <Button disabled={ !this.state.recaptchaVerification } onAsyncClick={ requestAuthentication }>
                    Войти
                </Button>
                <button onClick={ () => window.location.href = "/" } className="simple">На главную</button>
            </div>
        </div>;
    }
}

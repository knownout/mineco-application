/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";

import Input from "../../../common/input";
import Loading from "../../../common/loading";
import Button from "../../../common/button";
import Notify from "../../../common/notify";

import commonMasks from "../../../common/input/common-masks";
import classNames from "../../../lib/class-names";
import verifyAuthentication from "../../cms-lib/verify-authentication";
import { appRoutesList } from "../../../lib/routes-list";

import "./auth-form.scss";

/**
 * Authentication form for the content
 * management system
 * @inner
 *
 * @constructor
 */
export default function AuthForm () {
    const [ formLoading, setFormLoading ] = React.useState(true);
    const [ fromLoadingError, setFormLoadingError ] = React.useState<string>();

    const [ waitForResponse, setWaitForResponse ] = React.useState(false);

    const loginInputRef = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const authButtonRef = React.useRef<HTMLButtonElement>(null);

    // Wait for recaptcha and try to verify account with cached data (if exist)
    React.useEffect(() => {
        const interval = setInterval(async () => {
            if ("grecaptcha" in window) {
                // Try to verify account with cached data
                clearInterval(interval);

                const result = await verifyAuthentication().catch(setFormLoadingError);

                // If verified, redirect to the cms root
                if (result) window.location.href = appRoutesList.cms;

                // .. otherwise, show authentication form
                else setFormLoading(false);
            }
        }, 300);
    }, [ "recaptcha" ]);

    // Class name for the controls form
    const controlsClassName = classNames("ui flex optimize margin gap transition", {
        disabled: waitForResponse
    });

    // States for the password and login inputs
    const [ [ password, setPassword ], [ login, setLogin ] ] = [
        React.useState<string>(),
        React.useState<string>()
    ];

    const authButtonEnabled = !formLoading && !Boolean(fromLoadingError) && !waitForResponse && login && password
        && login.length > 3
        && password.length > 3;

    // const ref = React.useRef<HTMLDivElement>(null);
    const notify = new Notify();

    /**
     * Authentication button click handler
     */
    async function authenticationHandler () {
        // Lock password and login inputs
        setWaitForResponse(true);

        // Wait for account verification and unlock inputs
        const result = await verifyAuthentication(login, password).catch(setFormLoadingError)
            .finally(() => setWaitForResponse(false));

        if (result) {
            // Show fullscreen loader
            setFormLoading(true);

            // Redirect to the cms root
            setTimeout(() => {
                window.location.href = appRoutesList.cms;
            }, 100);

            // Show error message if auth failed
        } else notify.add("Не удалось войти в аккаунт");

        setWaitForResponse(false);
    }

    function returnHandler (inputName: "password" | "login") {
        type T = React.RefObject<HTMLInputElement>;
        const process = (ref: T, selfRef: T, value?: string) => {
            if (selfRef.current && selfRef.current.value.length <= 3) return;

            if (value && value.length > 3 && authButtonRef.current) {
                authButtonRef.current.focus();
                authButtonRef.current.click();
            } else ref.current && ref.current.focus();
        };

        if (inputName === "password") process(loginInputRef, passwordInputRef, login);
        else process(passwordInputRef, loginInputRef, password);
    }

    return <div className="auth-form ui container">
        <Loading display={ formLoading } error={ fromLoadingError } />

        <Notify.Component element={ notify.ref } />

        <div className="ui content-wrapper padding-20 limit-380">
            <div className="ui flex optimize margin gap">
                <span className="ui title">Авторизация</span>
                <span className="ui sub-title">
                    Введите данные своего аккаунта чтобы продолжить.
                    Если у Вас нет данных авторизации, покиньте эту страницу
                </span>
            </div>
            <div className={ controlsClassName }>
                { /* Input elements */ }
                <Input placeholder="Ваше имя пользователя" spellCheck="false" maxLength={ 30 } mask={ [
                    commonMasks.numbersLatinOnly
                ] } icon="bi bi-person-bounding-box" onInput={ value => setLogin(value) } element={ loginInputRef }
                       onReturn={ () => returnHandler("login") } />

                <Input placeholder="Ваш пароль" spellCheck="false" type="password" maxLength={ 30 } mask={ [
                    commonMasks.latinCyrillicWithSymbols
                ] } icon="bi bi-key-fill" onInput={ value => setPassword(value) } element={ passwordInputRef }
                       onReturn={ () => returnHandler("password") } />
            </div>
            <div className="ui flex row wrap fz-12 opacity-65 center-ai gap-5">
                <span className="hint-text">Форма защищена от спама при помощи Google reCAPTCHA</span>
                <a href="#" className="ui clean link">Условия использования</a>
                <a href="#" className="ui clean link">Конфиденциальность</a>
            </div>

            {/* Authentication button */ }
            <Button icon="bi bi-hand-index-fill" onAsyncClick={ authenticationHandler } disabled={ !authButtonEnabled }
                    element={ authButtonRef } className="margin optimize">
                Войти в аккаунт
            </Button>
        </div>
    </div>;
}

/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Google reCAPTCHA simplified interface
 */
interface Recaptcha
{
    ready (callback: () => void): void;

    execute (siteKey: string, props: { action: string }): Promise<string>;
}

/**
 * Function for requiring valid recaptcha client token
 */
export default function useRecaptcha (): Promise<string> {
    const recaptcha = (window as any).grecaptcha as Recaptcha;

    return new Promise((resolve, reject) => {
        // Check if recaptcha instance exist
        let iterations = 0;
        const interval = setInterval(() => {
            if (iterations > 100) {
                clearInterval(interval);
                return reject("no-recaptcha-instance");
            }

            if (!recaptcha) {
                iterations += 1;
                return;
            }

            clearInterval(interval);
            recaptcha.ready(() => {
                // Check if recaptcha instance fully loaded
                if (!("execute" in recaptcha)) reject("bad-recaptcha-instance");

                // Get client token
                recaptcha.execute("6LfML98dAAAAAAOl4xfqwdf4qSlyGIHiNx71wvDd", { action: "login" })
                    .then(token => resolve(token));
            });
        }, 100);
    });
}

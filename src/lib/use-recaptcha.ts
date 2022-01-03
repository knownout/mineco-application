/**
 * Google reCAPTCHA simplified interface
 */
interface Recaptcha {
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
        if (!recaptcha) reject("no-recaptcha-instance");

        recaptcha.ready(() => {
            // Check if recaptcha instance fully loaded
            if (!("execute" in recaptcha)) reject("bad-recaptcha-instance");

            // Get client token
            recaptcha.execute("6LfML98dAAAAAAOl4xfqwdf4qSlyGIHiNx71wvDd", { action: "login" })
                .then(token => resolve(token));
        });
    });
}
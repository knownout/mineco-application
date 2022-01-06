import { RequestOptions, Response } from "../../../cms-types/requests";
import useRecaptcha from "../../../../lib/use-recaptcha";
import verifyAuthentication from "../../../cms-lib/verify-authentication";
import { makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import CacheController, { cacheKeysList } from "../../../../lib/cache-controller";
import { Account } from "../../../cms-types/account";

export default function uploadFile (setWaitState: (waitState: boolean) => void) {
    const select = document.createElement("input");
    select.type = "file";

    return new Promise<void>((resolve, reject) => {
        select.onchange = async () => {
            setWaitState(true);
            if (!select.files || select.files.length < 1) return reject();
            const cacheController = new CacheController(localStorage);
            const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);

            if (!await verifyAuthentication() || !accountData)
                return reject("Не удалось проверить данные авторизации");

            const token = await useRecaptcha();

            const formData = new FormData();
            formData.append(RequestOptions.uploadFile, select.files[0]);
            formData.append(RequestOptions.recaptchaToken, token);
            formData.append(RequestOptions.accountLogin, accountData.login);
            formData.append(RequestOptions.accountHash, accountData.hash);

            const response = await fetch(makeRoute(serverRoutesList.uploadFile), { method: "POST", body: formData })
                .then(response => response.json()) as Response;

            if (!response.success) reject("Не удалось загрузить файл");
            resolve();
        };

        select.click();
    }).finally(() => setWaitState(false));
}
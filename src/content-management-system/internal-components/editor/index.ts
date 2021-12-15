import { Material, Requests } from "../../../shared/shared-types";
import * as Shared from "../../../shared/shared-content";
import {generateMaterialIdentifier, RequestBody} from "../../../shared/shared-content";

export type TMaterialUpdateFunction = (materialData: Partial<Material.Full["data"] & { content: string }>) =>
    Promise<Requests.RequestResult<Material.AffectResult>>;

/**
 * Hook-like function (not a hook actually) to require material data from
 * server by material identifier
 *
 * Generates function for updating material on server (setMaterial)
 *
 * @param identifier material identifier
 */
export async function useMaterial (identifier: string): Promise<[ Material.Full, TMaterialUpdateFunction, string[] ]>
{
    // Material update function
    const setMaterial = async (materialData: Partial<Material.Full["data"] & { content: string }>) =>
    {
        // Require Google Recaptcha token
        const token = await Shared.executeWithRecaptcha("submit");

        // Require account data from cache
        const accountData = Shared.requireCachedAccountData();

        // Build common request body for the protected request
        const requestBody = new Shared.RequestBody({
            [Requests.TypesList.Action]: Requests.ActionsList.updateMaterial,
            [Requests.TypesList.AccountLogin]: accountData.login,
            [Requests.TypesList.AccountHash]: accountData.hash,
            [Requests.TypesList.CaptchaToken]: token
        });

        // Add affected values to the request
        Object.keys(materialData).forEach(key => requestBody.push({
            ["Update:" + key[0].toLocaleUpperCase() + key.slice(1)]: materialData[key as keyof typeof materialData]
        }));

        // Return request response
        return await fetch(Shared.defaultPathsList.request, requestBody.postFormData).then(res => res.json());
    };

    const tagsListResult = await fetch(Shared.defaultPathsList.request, new RequestBody({
        [Requests.TypesList.Action]: Requests.ActionsList.getTagsList
    }).postFormData).then(res => res.json()) as Requests.RequestResult<string[]>;

    // If response negative, throw fetch error
    if (!tagsListResult.success) throw new Shared.FetchError(tagsListResult.meta.toString());

    if (identifier === "new")
    {
        return [ {
            content: {},
            data: {
                identifier: generateMaterialIdentifier(),
                short: "",
                pinned: "0",
                title: "",
                tags: "",
                time: Date.now().toString(),
                preview: "null"
            }
        }, setMaterial, tagsListResult.meta ];
    }

    // Body for the material full data request
    const materialRequestBody = new Shared.RequestBody({
        [Requests.TypesList.Action]: Requests.ActionsList.getFullMaterial,
        [Requests.TypesList.DataIdentifier]: identifier
    });

    // Require full material data from the server
    const result = await fetch(Shared.defaultPathsList.request, materialRequestBody.postFormData)
        .then(res => res.json()) as Requests.RequestResult<Material.Full>;

    if (!result.success) throw new Shared.FetchError(result.meta.toString());

    return [ result.meta as Material.Full, setMaterial, tagsListResult.meta ];
}

export { default } from "./editor";

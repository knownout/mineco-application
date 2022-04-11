/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { ItemObject } from "../control-panel/components/root-form/item-object-renderers/renderers";
import { serverRoutesList } from "../lib/routes-list";
import { VariablesStorage } from "./application";

/**
 * Class for processing application data
 */
export default class ApplicationBuilder
{
    /**
     * Get variables from array of variable objects
     * @param list array of variable objects
     * @param name variable name
     * @param transform transformation type
     * @private
     */
    public static getVariableValue (list: ItemObject.Variable[], name: string, transform?: "json" | "special") {
        let response: ItemObject.Variable | null = null;

        // Get variable from list
        for (let item of list) if (item.name == name) {
            response = item;
            break;
        }

        if (transform) {
            // Return null if variable not found
            if (!response) return null;
            switch (transform) {
                case "json":
                    try {
                        return JSON.parse(response.value as string);
                    } catch {
                        return null;
                    }
                case "special":
                    return String(response.value).split("***");
                default:
                    return null;
            }
        }

        return response ? response.value as string : null;
    };

    /**
     * Create promises pool for specified images loading
     * @param linksList list of relative images link
     * @param buildPath if true, relative links will be converted to direct links
     */
    public static async waitForImages (linksList: string[], buildPath: boolean = false) {
        const promises = linksList.map(link => new Promise<void>(resolve => {
            const img = document.createElement("img");
            img.src = buildPath ? serverRoutesList.getFile(link, false) : link;

            img.onload = () => resolve();
            img.onerror = () => resolve();
        }));

        await Promise.all(promises);
    }

    /**
     * Method for converting variables list into the state-like object
     * @param list variables list
     */
    public getApplicationVariables (list: ItemObject.Variable[]): VariablesStorage {
        const getValue = ApplicationBuilder.getVariableValue.bind(this, list);
        type Obj = { [key: string]: string };

        return {
            importantData: getValue("Важная информация", "special") as string[],

            socialData: getValue("Социальные сети", "json") as Obj[],
            usefulLinks: getValue("Полезные ссылки", "json") as Obj,

            extraButtons: getValue("Кнопки (главная страница)", "json") as VariablesStorage["extraButtons"],
            contactData: getValue("Контакты (подвал)"),

            websiteTitle: getValue("Название сайта") as string,
            navigationPanel: getValue("Панель навигации",
                "json") as { [key: string]: Obj }
        };
    }

    /**
     * Method for processing materials list and pinned materials
     * @param materialsList list of materials
     * @param pinnedMaterial pinned material (can be undefined)
     */
    public allocateMaterials (materialsList: ItemObject.Material[], pinnedMaterial?: ItemObject.Material[]) {
        // If pinned material exist, return without transformation
        if (pinnedMaterial && pinnedMaterial.length > 0) return { materialsList, pinnedMaterial: pinnedMaterial[0] };

        // If both of pinned material and materials list does not exist, throw error
        if (materialsList.length < 1) throw new Error("Not enough materials to process");

        // Move first (latest) material from materials list to the pinned material
        const slicedPinnedMaterial = materialsList.shift() as ItemObject.Material;
        return {
            materialsList: materialsList,
            pinnedMaterial: slicedPinnedMaterial
        };
    }

    /**
     * Method for extracting image links from the materials
     * @param materials
     */
    public extractImages (...materials: ItemObject.Material[]) {
        return materials.map(material => serverRoutesList.getFile(material.preview, false));
    }
}

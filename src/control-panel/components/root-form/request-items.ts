import { FileSearchRequests, MaterialSearchRequests, RequestOptions, Response } from "../../cms-types/requests";
import MakeFormData from "../../../lib/make-form-data";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import useRecaptcha from "../../../lib/use-recaptcha";

export enum RequestItemType {
    materials,
    files
}

export default class RequestItems {
    private materialsLimit = 30;

    constructor (private readonly itemType: RequestItemType) {
    }

    public async requestItems<T> (searchQuery: string) {
        const typeBasedPath = [
            serverRoutesList.searchMaterials,
            serverRoutesList.searchFiles
        ][this.itemType];

        let searchString = searchQuery;

        const formData = new MakeFormData({ [MaterialSearchRequests.limit]: this.materialsLimit });
        if (this.itemType == RequestItemType.materials) {
            const searchQueryOptions = {
                datetimeFrom: [ />\d{2}\.\d{2}\.\d{4}/, ">" ],
                datetimeTo: [ /<\d{2}\.\d{2}\.\d{4}/, "<" ],
                identifier: [ /#[a-z0-9]+/, "#" ],
                tags: [ /\+[A-Za-z0-9А-Яа-яЁё]+/g, "+" ],
                title: [ /!.+/, "!" ]
            };

            Object.entries(searchQueryOptions).forEach(([ key, value ]) => {
                const matches: string[] = [];
                const matcher = (m: string) => {
                    matches.push(m);
                    return "";
                };

                searchString = searchString.replace(value[0], matcher);
                const matchesString = matches.map(e => e.trim().replace(value[1], ""))
                    .filter(e => e.length > 0).join(",");

                let outputValue = matchesString;
                if ([ "datetimeFrom", "datetimeTo" ].includes(key)) {
                    const timestamp = new Date(outputValue).getTime() / 1000;
                    outputValue = timestamp.toString();
                }

                if (matchesString.length > 0) formData.add({
                    [MaterialSearchRequests[key as keyof typeof MaterialSearchRequests]]: outputValue
                });
            });
        }

        formData.add({
            [this.itemType == RequestItemType.materials ? MaterialSearchRequests.content
                : FileSearchRequests.filename]: searchString
        });

        const token = await useRecaptcha();
        formData.add({ [RequestOptions.recaptchaToken]: token });
        return await fetch(makeRoute(typeBasedPath), formData.fetchObject)
            .then(response => response.json()) as Promise<Response<T>>;
    }
}
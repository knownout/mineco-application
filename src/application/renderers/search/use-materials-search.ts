/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import MakeFormData from "../../../lib/make-form-data";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import searchLinkParameters from "../../../lib/search-link-parameters";
import { MaterialSearchOptions, RequestOptions, Response } from "../../../lib/types/requests";

interface MaterialSearchProps
{
    setTotalMaterials: React.Dispatch<React.SetStateAction<number>>;
    materialsPerPage: number;
    pathname: string;
    mounted: React.MutableRefObject<boolean>;

    query?: string;

    setLoading? (loading: boolean): void;

    setError? (error?: any): void;

    setMaterials? (materials: ItemObject.Material[]): void;
}

export default async function useMaterialsSearch (props: MaterialSearchProps) {
    props.setLoading && props.setLoading(true);
    const startTime = Date.now();

    const params = searchLinkParameters(props.pathname);

    const formData = new MakeFormData({
        [RequestOptions.limitSearchResponse]: props.query ? props.materialsPerPage * 2 : props.materialsPerPage
    });

    if (props.query) formData.add({ [MaterialSearchOptions.content]: props.query });
    else formData.add({ [RequestOptions.searchOffset]: props.materialsPerPage * (params.page - 1) });

    if (params.tag) formData.add({ [MaterialSearchOptions.tags]: params.tag });

    formData.add({ [MaterialSearchOptions.excludeEmpty]: true });

    const materialsList = await fetch(makeRoute(serverRoutesList.searchMaterials), formData.fetchObject)
        .then(res => res.json())
        .catch(props.setError) as Response<ItemObject.Material[]>;

    if (!props.query) {
        const totalMaterials = await fetch(makeRoute(serverRoutesList.getTotalMaterials), new MakeFormData({
            [MaterialSearchOptions.tags]: params.tag ? params.tag : "NOT_EMPTY"
        }).fetchObject).then(res => res.json())
            .catch(props.setError) as Response<number>;

        if (!totalMaterials.success) props.setError && props.setError("total-fetch-error");

        props.setTotalMaterials(totalMaterials.responseContent as number);
    }

    const elapsed = Date.now() - startTime;
    await new Promise(resolve => setTimeout(resolve, elapsed < 300 ? 300 : 300 - elapsed));

    if (!props.mounted.current) return;
    if (props.query) props.setTotalMaterials(0);

    props.setMaterials && props.setMaterials(materialsList.responseContent || []);
    props.setLoading && props.setLoading(false);

}

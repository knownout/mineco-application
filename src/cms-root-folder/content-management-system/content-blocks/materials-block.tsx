// Library import
import React from "react";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import MaterialsList from "../../internal-components/materials-list/materials-list";
// Helpers import
import { Material, Requests } from "../../../shared/shared-types";
import { defaultPathsList, processRawMaterial, RequestBody } from "../../../shared/shared-content";

/**
 * Action block for display latest materials and search bar
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function MaterialsBlock ()
{
    const [ latestMaterialsList, setLatestMaterialsList ] = React.useState<Material.PreviewRaw[]>([]);

    const loadLatestMaterials = () => new Promise<void>(async (resolve, reject) =>
    {
        // Get 10 latest materials from server
        const rawMaterials = await fetch(defaultPathsList.request, new RequestBody({
            [Requests.TypesList.Action]: Requests.ActionsList.getMaterials,
            [Requests.TypesList.DataLimit]: 10,
            [Requests.TypesList.DataFindPinned]: true
        }).postFormData).then(request => request.json()) as Requests.RequestResult<Material.PreviewRaw[]>;

        if (!rawMaterials.success) reject(rawMaterials.meta.toString());
        else setLatestMaterialsList(rawMaterials.meta);

        resolve();
    });

    return <PageWrapper className="content-block materials-block" asyncContent={ loadLatestMaterials }>
        <MaterialsList materialsList={ latestMaterialsList.map(material => processRawMaterial(material)) } />
    </PageWrapper>;
}

// Library import
import React from "react";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import MaterialsList from "../../internal-components/materials-list";
// Helpers import
import { Material, Requests } from "../../../shared/shared-types";
import { defaultPathsList, processRawMaterial, RequestBody } from "../../../shared/shared-content";
import MaterialsSearch from "../../internal-components/materials-search/materials-search";

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

        setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
        resolve();
    });

    return <PageWrapper className="content-block materials-block" asyncContent={ loadLatestMaterials }>
        <MaterialsSearch updateMaterialsList={ setLatestMaterialsList } />
        <PageWrapper key={ Math.random() } loadingLabel="Загрузка материалов">
            <MaterialsList materialsList={ latestMaterialsList.map(material => processRawMaterial(material)) } />
        </PageWrapper>
    </PageWrapper>;
}

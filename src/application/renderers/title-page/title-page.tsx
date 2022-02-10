import React from "react";
import "./title-page.scss";
import Loading from "../../../common/loading";
import { serverRoutesList } from "../../../lib/routes-list";
import Application, { ApplicationContextStorage } from "../../application";
import MakeFormData from "../../../lib/make-form-data";
import { MaterialSearchOptions } from "../../../lib/types/requests";
import ApplicationBuilder from "../../application-builder";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import Condition from "../../../common/condition";

export default function TitlePage () {
    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState<any>();

    type MaterialsData = Omit<ApplicationContextStorage, "variablesData">;
    const [ materialData, setMaterialsData ] = React.useState<Partial<MaterialsData>>({
        materialsList: undefined,
        pinnedMaterial: undefined
    });

    React.useLayoutEffect(() => {
        // Function for fetching material(s) data from server
        const fetchMaterials = Application.genericFetchFunction.bind(null, serverRoutesList.searchMaterials);
        const builder = new ApplicationBuilder();

        const formData = new MakeFormData({
            [MaterialSearchOptions.tags]: "Новости",
            [MaterialSearchOptions.pinned]: "0"
        });

        new Promise<void>(async resolve => {
            try {
                const { materialsList, pinnedMaterial } = builder.allocateMaterials(
                    (await fetchMaterials(formData.fetchObject)).responseContent as ItemObject.Material[],

                    (await fetchMaterials(formData.add({ [MaterialSearchOptions.pinned]: "1" }).fetchObject))
                        .responseContent as ItemObject.Material[]
                );

                setMaterialsData({ pinnedMaterial, materialsList });
                await builder.waitForImages(builder.extractImages(pinnedMaterial, ...materialsList));

                setLoading(false);
            } catch {
                setError("materials-fetch-error");
            }

            return resolve();
        });
    }, []);

    const { materialsList, pinnedMaterial } = materialData as MaterialsData;
    return <div className="title-page ui flex column w-100 h-fit center-ai">
        <Loading display={ loading } error={ error } />
        <Condition condition={ Boolean(materialsList && pinnedMaterial) }>
            <div>Title page</div>
        </Condition>
    </div>;
}
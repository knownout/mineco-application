import React from "react";

import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";

import { serverRoutesList } from "../../../lib/routes-list";
import MakeFormData from "../../../lib/make-form-data";
import { MaterialSearchOptions, RequestOptions } from "../../../lib/types/requests";

import Application, { ApplicationContext, ApplicationContextStorage } from "../../application";
import ApplicationBuilder from "../../application-builder";

import Loading from "../../../common/loading";

import TopContentBlock from "./top-block";
import MaterialsList from "./latest-materials";

import "./title-page.scss";
import ExtraButtons from "./extra-buttons";
import UsefulLinks from "./useful-links";

/**
 * Component for rendering website title page
 * @constructor
 * @internal
 */
export default function TitlePage () {
    const context = React.useContext(ApplicationContext);
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
            [MaterialSearchOptions.pinned]: "0",
            [RequestOptions.limitSearchResponse]: "10"
        });

        // Try to get and allocate materials from the server
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

    // Get materials as variables
    const { materialsList, pinnedMaterial } = materialData as Required<MaterialsData>;

    return <div className="title-page-holder ui flex w-100 h-100 relative">
        <div className="title-page ui flex column w-100 h-fit center-ai relative">
            <Loading display={ loading } error={ error } />
            { pinnedMaterial && <TopContentBlock pinnedMaterial={ pinnedMaterial } /> }
            { materialsList && <MaterialsList materials={ materialsList } /> }

            { context.variablesData?.extraButtons && <ExtraButtons buttons={ context.variablesData.extraButtons } /> }
            { context.variablesData?.usefulLinks && <UsefulLinks links={ context.variablesData.usefulLinks } /> }
        </div>
    </div>;
}




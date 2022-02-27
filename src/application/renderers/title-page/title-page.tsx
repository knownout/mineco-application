import React from "react";

import Loading from "../../../common/loading";

import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import MakeFormData from "../../../lib/make-form-data";

import { serverRoutesList } from "../../../lib/routes-list";
import { MaterialSearchOptions, RequestOptions } from "../../../lib/types/requests";

import Application, { ApplicationContext, ApplicationContextStorage, VariablesStorage } from "../../application";
import ApplicationBuilder from "../../application-builder";
import PageFactory from "../page-factory";
import ExtraButtons from "./extra-buttons";
import MaterialsList from "./latest-materials";

import "./title-page.scss";

import TopContentBlock from "./top-block";
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

    // Extract images from special resources
    const extractResources = {
        extraButtons: (buttons: VariablesStorage["extraButtons"]) => (Object.entries(buttons).map(item =>
            item[1].slice(0, 2)).flat().filter(e => Boolean(e)) as string[])
            .map(e => serverRoutesList.getFile(e, false)),

        usefulLinks: (links: VariablesStorage["usefulLinks"]) => Object.entries(links).map(item =>
            `/public/link-icons/${ new URL(item[1]).hostname }.png`)
    };

    React.useLayoutEffect(() => {
        // Function for fetching material(s) data from server
        const fetchMaterials = Application.genericFetchFunction.bind(null, serverRoutesList.searchMaterials);
        const builder = new ApplicationBuilder();

        const variables = context.variablesData;
        const formData = new MakeFormData({
            [MaterialSearchOptions.tags]: "Новости",
            [MaterialSearchOptions.pinned]: "0",
            [RequestOptions.limitSearchResponse]: "10",
            [MaterialSearchOptions.datetimeTo]: Math.floor(Date.now() / 1000)
        });

        // Try to get and allocate materials from the server
        new Promise<void>(async resolve => {
            try {
                const { materialsList, pinnedMaterial } = builder.allocateMaterials(
                    ((await fetchMaterials(formData.fetchObject)).responseContent as ItemObject.Material[]),

                    (await fetchMaterials(formData.add({ [MaterialSearchOptions.pinned]: "1" }).fetchObject))
                        .responseContent as ItemObject.Material[]
                );

                setMaterialsData({ pinnedMaterial, materialsList });
                await ApplicationBuilder.waitForImages([
                    ...builder.extractImages(pinnedMaterial, ...materialsList),
                    ...(variables?.extraButtons ? extractResources.extraButtons(variables.extraButtons) : []),
                    ...(variables?.usefulLinks ? extractResources.usefulLinks(variables.usefulLinks) : []),
                    "/public/qr-code-contact.jpg"
                ]);

                setLoading(false);
            } catch {
                setError("materials-fetch-error");
            }

            return resolve();
        });
    }, []);

    // Get materials as variables
    const { materialsList, pinnedMaterial } = materialData as Required<MaterialsData>;

    return <PageFactory loader={ <Loading display={ loading } error={ error } /> }>
        <div className="title-page-holder ui flex w-100 h-fit relative client-view">
            <div className="title-page ui flex column w-100 h-fit center-ai relative">
                { pinnedMaterial && <TopContentBlock pinnedMaterial={ pinnedMaterial } /> }
                { materialsList && <MaterialsList materials={ materialsList } /> }

                { context.variablesData?.extraButtons &&
                    <ExtraButtons buttons={ context.variablesData.extraButtons } /> }
                { context.variablesData?.usefulLinks && <UsefulLinks links={ context.variablesData.usefulLinks } /> }
            </div>
        </div>
    </PageFactory>;
}

import React from "react";
import "./title-page.scss";
import Loading from "../../../common/loading";
import { serverRoutesList } from "../../../lib/routes-list";
import Application, { ApplicationContext, ApplicationContextStorage } from "../../application";
import MakeFormData from "../../../lib/make-form-data";
import { MaterialSearchOptions } from "../../../lib/types/requests";
import ApplicationBuilder from "../../application-builder";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import ReactMarkdown from "react-markdown";
import RemarkConfig from "../remark-config";

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

    const { materialsList, pinnedMaterial } = materialData as Required<MaterialsData>;
    const previewImage = pinnedMaterial && serverRoutesList.getFile(pinnedMaterial.preview, false);

    function TopContentBlock (props: { pinnedMaterial: ItemObject.Material }) {
        const importantData = context.variablesData?.importantData;
        if (!importantData) return null;

        return <div className="pinned-data-block ui flex center-jc row padding-20 relative w-100">
            <div className="background-image ui absolute w-100 h-100"
                 style={ { backgroundImage: `url(${ previewImage })` } } />
            <section className="pinned-material ui flex column relative">
                <div className="material-title ui flex gap-10 column">
                    <span className="title">{ props.pinnedMaterial.title }</span>
                    <div className="description ui flex column relative">
                        <ReactMarkdown remarkPlugins={ RemarkConfig } children={ props.pinnedMaterial.description } />
                    </div>
                </div>
                <img src={ previewImage } alt={ props.pinnedMaterial.title } />
            </section>
            <section className="important-data ui flex relative gap-20 h-100">
                <span className="section-title">Важная информация</span>
                <div className="blocks-wrapper ui flex row relative">
                    <article className="important-data-block ui flex column relative">
                        <ReactMarkdown remarkPlugins={ RemarkConfig } children={ importantData[0] } />
                    </article>
                </div>
            </section>
        </div>;
    }

    return <div className="title-page ui flex column w-100 h-fit center-ai relative">
        <Loading display={ loading } error={ error } />
        { pinnedMaterial && <TopContentBlock pinnedMaterial={ pinnedMaterial } /> }
    </div>;
}
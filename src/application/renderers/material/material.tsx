import React from "react";
import "./material.scss";
import { useLocation } from "react-router-dom";
import NotFoundPage from "../not-found";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import MakeFormData from "../../../lib/make-form-data";
import { RequestOptions, Response } from "../../../lib/types/requests";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import { DataProp } from "editorjs-blocks-react-renderer";
import ApplicationBuilder from "../../application-builder";
import PageFactory from "../page-factory";
import Loading from "../../../common/loading";
import ShareLinks from "./share-links";
import ShareButton from "../../share-button";

type TMaterial = { data: ItemObject.Material, content: DataProp };
export default function MaterialRenderer () {
    const [ material, setMaterial ] = React.useState<TMaterial>();
    const [ error, setError ] = React.useState(false);

    const identifier = useLocation().pathname.replace("/", "");

    if (!identifier || error) return <NotFoundPage />;

    const loadMaterial = (content?: Response<TMaterial>) => {
        const response = content?.responseContent;
        if (!response) return setError(true);

        ApplicationBuilder.waitForImages([
            ...response.content.blocks.filter(e => e.type == "image")
                .map(e => e.data.file.url as string),

            serverRoutesList.getFile(response.data.preview, false)
        ]).then(() => setMaterial(response));
    };

    React.useLayoutEffect(() => {
        fetch(makeRoute(serverRoutesList.getMaterial), new MakeFormData({
            [RequestOptions.getMaterial]: identifier
        }).fetchObject).then(response => response.json()).then(loadMaterial);
    }, []);

    const TitleBlock = (props: { material: ItemObject.Material }) => <div
        className="title-block ui flex row gap center-ai">
        <img src={ serverRoutesList.getFile(props.material.preview, false) }
             alt={ props.material.title } className="preview-image ui limit-260 border-radius-10" />

        <div className="title-block-content ui flex column gap">
            <span className="material-title ui fz-28 fw-700">{ props.material.title }</span>
            <div className="share-buttons ui flex row wrap gap-5">
                { Object.entries(ShareLinks).map(([ icon, link ], index) =>
                    <ShareButton icon={ icon } link={ link } key={ index } title={ props.material.title } />
                ) }
            </div>
        </div>
    </div>;

    return <PageFactory>
        <Loading display={ !material } error={ error } />
        <div className="material-container ui flex column limit-1080">
            { material && <TitleBlock material={ material.data } /> }
        </div>
    </PageFactory>;
}
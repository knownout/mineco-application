import React from "react";
import "./material.scss";
import { useLocation } from "react-router-dom";
import NotFoundPage from "../not-found";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import MakeFormData from "../../../lib/make-form-data";
import { RequestOptions, Response } from "../../../lib/types/requests";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import Loading from "../../../common/loading";
import Blocks, { DataProp } from "editorjs-blocks-react-renderer";
import PageFactory from "../page-factory";
import ApplicationBuilder from "../../application-builder";

export default function MaterialRenderer () {
    const [ material, setMaterial ] = React.useState<{ data: ItemObject.Material, content: DataProp }>();
    const [ error, setError ] = React.useState(false);

    const identifier = useLocation().pathname.replace("/", "");

    if (!identifier) return <NotFoundPage />;

    React.useLayoutEffect(() => {
        fetch(makeRoute(serverRoutesList.getMaterial), new MakeFormData({
            [RequestOptions.getMaterial]: identifier
        }).fetchObject).then(response => response.json())
            .then((response: Response<{ data: ItemObject.Material, content: DataProp }>) => {
                if (!response.responseContent) return setError(true);
                const builder = new ApplicationBuilder();
                builder.waitForImages([
                    ...response.responseContent.content.blocks.filter(e => e.type == "image")
                        .map(e => e.data.file.url as string),

                    serverRoutesList.getFile(response.responseContent.data.preview, false)
                ]);

                setMaterial(response.responseContent);
            });
    }, []);

    if (error) return <NotFoundPage />;

    return <PageFactory>
        <Loading display={ !material } error={ error } />
        { material && <div className="material-wrapper ui limit-1080 padding-20">
            <div className="material-header ui flex row">
                <img src={ serverRoutesList.getFile(material.data.preview, false) } alt=""
                     className="preview-image" />
                <h1>{ material.data.title }</h1>
            </div>
            <div className="material-body">
                <Blocks data={ material.content } />
            </div>
        </div> }
    </PageFactory>;
}
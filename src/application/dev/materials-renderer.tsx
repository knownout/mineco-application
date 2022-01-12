import React from "react";

import MakeFormData from "../../lib/make-form-data";
import { MaterialDataResponse, RequestOptions, Response } from "../../lib/types/requests";
import { makeRoute, serverRoutesList } from "../../lib/routes-list";

import Loading from "../../common/loading";

import Blocks, { DataProp } from "editorjs-blocks-react-renderer";
import { useParams } from "react-router-dom";

import "./materials-renderer.scss";

export default function MaterialsRenderer () {
    const { identifier } = useParams<"identifier">();

    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState<string>();
    const [ material, setMaterial ] = React.useState<MaterialDataResponse>();

    React.useLayoutEffect(() => {
        getMaterialData().then(() => setLoading(false));
    }, [ identifier ]);

    async function getMaterialData () {
        const formData = new MakeFormData({
            [RequestOptions.getMaterial]: identifier
        });

        const response = await fetch(makeRoute(serverRoutesList.getMaterial), formData.fetchObject)
            .then(response => response.json()) as Response<MaterialDataResponse>;

        if (!response || !response.success)
            setError(response.errorCodes ? response.errorCodes.join(", ") : "unknown error");

        else setMaterial(response.responseContent);
    }

    return <div className="materials-renderer ui container">
        <Loading display={ loading } error={ error } />
        { !loading && material && <div className="material-data ui flex row no-wrap padding-20">
            <div className="preview-data ui flex column no-wrap">
                { <img src={ serverRoutesList.getFile(material.data.preview, false) } alt={ material.data.title } /> }
                <div className="tags-list ui flex row wrap gap">
                    { material.data.tags.split(",").map((tag, index) => {
                        return <div className="tag ui flex center padding-5 w-fit" key={ index }>{ tag }</div>
                    }) }
                </div>
            </div>
            <div className="content-data">
                <Blocks data={material.content as DataProp} />
            </div>
        </div> }
    </div>
}
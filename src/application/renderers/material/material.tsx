import React from "react";

import { Link, useLocation } from "react-router-dom";
import Blocks from "editorjs-blocks-react-renderer";

import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import MakeFormData from "../../../lib/make-form-data";
import { RequestOptions, Response } from "../../../lib/types/requests";
import convertDate from "../../../lib/convert-date";

import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";

import ApplicationBuilder from "../../application-builder";

import { SocialDataRenderer } from "../../header/header";
import { ApplicationContext } from "../../application";

import NotFoundPage from "../not-found";
import ShareComponent from "../../../common/share";
import PageFactory from "../page-factory";
import Loading from "../../../common/loading";
import Button from "../../../common/button";

import "./material.scss";

/**
 * Component for rendering materials from its sources
 * @constructor
 */
export default function MaterialRenderer () {
    const context = React.useContext(ApplicationContext);

    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();
    const [ error, setError ] = React.useState<any>();

    // Get material identifier from URL
    const identifier = useLocation().pathname.replace("/", "");

    /**
     * Function for processing material data
     * form server response
     */
    const useMaterialContent = React.useCallback((response?: Response<ItemObject.FullMaterial>) => {
        const content = response?.responseContent;

        if (!content || !content.data) return setError(response ? response.errorCodes : "server-fault");

        // Load all material images before complete loading
        ApplicationBuilder.waitForImages([
            ...content.content.blocks.filter(e => e.type == "image")
                .map(e => e.data.file.url as string),

            serverRoutesList.getFile(content.data.preview, false)
        ]).then(() => setMaterial(content));
    }, []);

    // Require material data from server
    React.useLayoutEffect(() => {
        fetch(makeRoute(serverRoutesList.getMaterial), new MakeFormData({
            [RequestOptions.getMaterial]: identifier
        }).fetchObject).then(response => response.json()).then(useMaterialContent);
    }, []);

    // If material not found or no identifier provided, show 404 page
    if (!identifier || (error && error == "no-material-file")) return <NotFoundPage />;

    return <PageFactory loader={ <Loading display={ !material } error={ error } /> }>
        <div className="material-container ui flex column gap-20">
            { material && <TitleBlock material={ material.data } /> }
            <div className="content-block ui flex gap column">
                { material && <Blocks data={ material.content } /> }
            </div>

            { material && <div className="extra-controls ui flex row gap wrap">
                <ShareComponent sources={ { vk: true, facebook: true, twitter: true } } title={ material.data.title }
                                current={ window.location.href } />

                { context.variablesData?.socialData &&
                    <SocialDataRenderer socialData={ context.variablesData.socialData.slice(1) } /> }
                <Link to="/" className="ui clean"><Button>На главную</Button></Link>
            </div> }
        </div>
    </PageFactory>;
}

/**
 * Component for rendering title block of material
 * @internal
 * @constructor
 */
function TitleBlock (props: { material: ItemObject.Material }) {
    return <div
        className="title-block ui">
        <img src={ serverRoutesList.getFile(props.material.preview, false) }
             alt={ props.material.title } className="preview-image ui border-radius-10" />

        <div className="title-block-content ui flex column gap">
            <span className="material-title ui fz-28 fw-700">{ props.material.title }</span>
            <span className="material-date ui opacity-65">
                { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
            </span>
            <ShareComponent sources={ { vk: true, facebook: true, twitter: true } } title={ props.material.title }
                            current={ window.location.href } />
        </div>
    </div>;
}

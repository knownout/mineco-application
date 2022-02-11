import React from "react";

import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";

import { appRoutesList, serverRoutesList } from "../../../../lib/routes-list";
import convertDate from "../../../../lib/convert-date";
import { setWordsLimit } from "../../../../lib/words-limit";

import remarkConfig from "../../remark-config";

import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import "./latest-materials.scss";

/**
 * Component for rendering latest materials list
 * @constructor
 * @internal
 */
export default function MaterialsList (props: { materials: ItemObject.Material[] }) {
    // Materials limit for current window size
    const [ limit, setLimit ] = React.useState(2);

    /**
     * Window resize event handler for recalculating materials limit
     */
    function windowResizeHandler () {
        let nextLimit = Math.floor(window.innerWidth / 360);
        nextLimit = nextLimit > 2 ? nextLimit : 2;

        if (nextLimit != limit) setLimit(nextLimit);
    }

    React.useLayoutEffect(() => {
        window.addEventListener("resize", windowResizeHandler);
        windowResizeHandler();

        return () => window.removeEventListener("resize", windowResizeHandler);
    });

    return <section className="latest-materials-block ui padding-20">
        { props.materials.slice(0, limit).map((material, index) =>
            <Material material={ material } key={ index } />) }
    </section>;
}

/**
 * Material renderer for latest materials
 * list renderer
 *
 * @constructor
 * @internal
 */
export function Material (props: { material: ItemObject.Material }) {
    const previewImage = serverRoutesList.getFile(props.material.preview, false);

    return <Link to={ appRoutesList.material + props.material.identifier } className="ui clean material-link">
        <article className="material ui">
            <img src={ previewImage } alt={ props.material.title } className="preview-image ui" />
            <div className="material-data ui flex column gap-5 lh-22 padding-20">
                <span className="material-title ui fz-20 fw-700 lh-26">{ props.material.title }</span>
                <span className="date ui opacity-65">
                    { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
                </span>
                <div className="description ui clean">
                    <ReactMarkdown remarkPlugins={ remarkConfig }
                                   children={ setWordsLimit(props.material.description, 20) } />
                </div>
            </div>
        </article>
    </Link>;
}
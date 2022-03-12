import React from "react";

import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Button from "../../../../common/button";

import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import convertDate from "../../../../lib/convert-date";

import { appRoutesList, serverRoutesList } from "../../../../lib/routes-list";
import { setWordsLimit } from "../../../../lib/words-limit";

import remarkConfig from "../../remark-config";

import "./latest-materials.scss";

/**
 * Component for rendering the latest materials list
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

    return <>
        <section className="latest-materials-block ui padding-20">
            { props.materials.slice(0, limit).map((material, index) =>
                <Material material={ material } key={ index } />) }
        </section>
        <Link to="search/Новости" className="ui clean color-white materials-archive-link">
            <Button className="materials-archive-button">Перейти в архив новостей</Button>
        </Link>
    </>;
}

interface MaterialProps
{
    material: ItemObject.Material;
    wordsLimit?: number;

    reference? (ref: HTMLAnchorElement | null): void;
}

/**
 * Material renderer for latest materials
 * list renderer
 *
 * @constructor
 * @internal
 */
export function Material (props: MaterialProps) {
    const previewImage = serverRoutesList.getFile(props.material.preview, false);

    const description = props.material.description.replace(/<[^>/]+>(.*)<\/[^>]>/g, "$1");
    return <Link to={ appRoutesList.material + props.material.identifier } className="ui clean material-link w-fit"
                 ref={ ref => props.reference && props.reference(ref) }>
        <article className="material ui">
            <div className="preview-image" style={ { backgroundImage: `url(${ previewImage })` } } />
            <div className="material-data ui flex column gap-5 lh-22 padding-20">
                <span className="material-title ui fz-20 fw-700 lh-26">{ props.material.title }</span>
                <span className="date ui opacity-65">
                    { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
                </span>
                <div className="description ui clean">
                    <ReactMarkdown remarkPlugins={ remarkConfig }
                                   children={ setWordsLimit(description.replace(/<[^>]+>/g, "")
                                       .replace(/s{2,}/g, " ")
                                       .trim(), props.wordsLimit
                                       ? props.wordsLimit : 60) } />
                </div>
            </div>
            <div className="extra-controls ui absolute flex row">
                <Button>Читать далее</Button>
            </div>
        </article>
    </Link>;
}

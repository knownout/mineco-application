/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React, { useEffect } from "react";
import "./useful-links.scss";
import { VariablesStorage } from "../../../application";
import Carousel from "../../../../common/carousel";

/**
 * Component for rendering "useful links" variable data
 * @internal
 * @constructor
 */
export default function UsefulLinks (props: { links: VariablesStorage["usefulLinks"] }) {
    function Link (props: { title: string; link: [ string, string ] }) {
        if (!Array.isArray(props.link)) return null;

        const url = props.link[0],
            image = props.link[1];
        return <a href={ url } className="useful-link ui clean color-white flex column center gap"
                  target="_blank">
            <div className="icon-holder ui grid center">
                <img src={ image } alt={ props.title } />
            </div>
            <span className="link-title ui upper fw-700 fz-14 lh-22">{ props.title }</span>
        </a>;
    }

    const [chunks, setChunks]= React.useState<Array<JSX.Element[]>>([]);

    const [ limit, setLimit ] = React.useState(2);

    function windowResizeHandler () {
        let nextLimit = Math.floor(window.innerWidth / 250);
        nextLimit = nextLimit > 2 ? nextLimit : 2;

        setLimit(nextLimit);
    }

    React.useLayoutEffect(() => {
        window.addEventListener("resize", windowResizeHandler);
        windowResizeHandler();

        return () => window.removeEventListener("resize", windowResizeHandler);
    });

    // Split links array to chunks
    useEffect(() => {
        setChunks(_chunks => {
            const chunks: any = []
            Object.entries(props.links).forEach((entry, index) => {
       
                // Each chunk will have N items (4)
                if (index % limit == 0) chunks.push([]);
        
        
                chunks[chunks.length - 1].push(<Link title={ entry[0] } link={ entry[1] } key={ Math.random() } />);
            });

            return chunks
        })
    }, [limit])

    return <div className="useful-links-block ui flex column w-100 relative gap">

        <span className="block-title ui fz-14 fz-28 fw-700 relative">Полезные ссылки</span>
        <div className="links-list ui flex row no-wrap relative">
            <Carousel items={ chunks } />
        </div>
    </div>;
}

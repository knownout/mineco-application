import React from "react";
import "./useful-links.scss";
import { VariablesStorage } from "../../../application";
import Carousel from "../../../../common/carousel";

/**
 * Component for rendering "useful links" variable data
 * @internal
 * @constructor
 */
export default function UsefulLinks (props: { links: VariablesStorage["usefulLinks"] }) {
    function Link (props: { title: string; link: string }) {
        const generateIcon = (domain: string) => `/public/link-icons/${ domain }.png`;

        const { hostname } = new URL(props.link);
        return <a href={ props.link } className="useful-link ui clean color-white flex column center gap">
            <div className="icon-holder ui grid center">
                <img src={ generateIcon(hostname) } alt={ props.title } />
            </div>
            <span className="link-title ui upper fw-700 fz-14 lh-22">{ props.title }</span>
        </a>;
    }

    const chunks: Array<JSX.Element[]> = [];

    // Split links array to chunks
    Object.entries(props.links).forEach((entry, index) => {
        // Each chunk will have N items (4)
        if (index % 4 == 0) chunks.push([]);
        chunks[chunks.length - 1].push(<Link title={ entry[0] } link={ entry[1] } key={ Math.random() } />);
    });

    return <div className="useful-links-block ui flex column w-100 relative gap"
                style={ { backgroundImage: `url("/public/link-icons/background.jpg")` } }>

        <span className="block-title ui fz-14 color-white fz-28 fw-700 relative">Полезные ссылки</span>
        <div className="links-list ui flex row no-wrap relative">
            <Carousel items={ chunks } />
        </div>
    </div>;
}
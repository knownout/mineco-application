import React from "react";
import Header from "../../header";

import "./title-page.scss";

// TODO: Create new renderer for pages (separate to application renderer) to avoid code duplication (Header)
export default function TitlePage () {
    const [ fixed, setFixed ] = React.useState(false);
    const staticContent = React.useRef<HTMLDivElement | null>();

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (!staticContent.current) return;

        const scrollTop = (event.target as HTMLElement).scrollTop;
        setFixed(scrollTop > staticContent.current.offsetHeight);
    };

    return <div className="title-page ui container block scroll-y" onScroll={ componentScrollHandler }>
        <Header fixed={ fixed } staticContentRef={ ref => staticContent.current = ref } />
        <div className="ui flex center w-100"
             style={ { height: 2000 } }>123
        </div>
    </div>;
}
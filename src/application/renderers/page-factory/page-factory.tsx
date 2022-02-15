import React from "react";

import "./page-factory.scss";
import Footer from "../../footer";
import Header from "../../header";

export default function PageFactory (props: { children?: any }) {
    const [ fixed, setFixed ] = React.useState(false);
    const staticContent = React.useRef<HTMLDivElement | null>();

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (!staticContent.current) return;

        const scrollTop = (event.target as HTMLElement).scrollTop;
        setFixed(scrollTop > staticContent.current.offsetHeight);
    };

    return <div className="title-page ui container scroll-y h-100" onScroll={ componentScrollHandler }>
        <div className="header-holder">
            <Header fixed={ fixed } staticContentRef={ ref => staticContent.current = ref } />
        </div>
        <div className="content-holder ui grid center">{ props.children }</div>
        <div className="footer-holder">
            <Footer />
        </div>
    </div>;
}
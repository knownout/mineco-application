import React from "react";
import Header from "../../header";

import "./page-factory.scss";
import Footer from "../../footer";

export default function PageFactory (props: { children?: any }) {
    const [ fixed, setFixed ] = React.useState(false);
    const staticContent = React.useRef<HTMLDivElement | null>();

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (!staticContent.current) return;

        const scrollTop = (event.target as HTMLElement).scrollTop;
        setFixed(scrollTop > staticContent.current.offsetHeight);
    };

    return <div className="title-page ui container">
        <div className="content-wrapper ui flex column relative h-100 w-100" onScroll={ componentScrollHandler }>
            <Header fixed={ fixed } staticContentRef={ ref => staticContent.current = ref } />
            <div className="page-content-wrapper ui grid center w-100 scroll-y">
                { props.children }
                <Footer />
            </div>
        </div>
    </div>;
}
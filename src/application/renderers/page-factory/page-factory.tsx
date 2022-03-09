import React from "react";

import Footer from "../../footer";
import Header from "../../header";

import "./page-factory.scss";

interface PageFactoryProps
{
    children?: any;
    loader?: JSX.Element;
    normalWidth?: React.MutableRefObject<number | undefined>;

    onScroll? (scrollTop: number, event: React.UIEvent<HTMLDivElement, UIEvent>): void;
}

const PageFactory = React.forwardRef<HTMLDivElement, PageFactoryProps>((props, ref) => {
    return <>
        { props.loader }
        <div className="page-factory ui container scroll-y h-100" ref={ ref }>
            <div className="content-holder ui flex center">
                <Header />
                <div className="child-content-holder ui grid center">
                    { props.children }
                </div>
            </div>
            <div className="footer-holder">
                <Footer />
            </div>
        </div>
    </>;
});

export default PageFactory;

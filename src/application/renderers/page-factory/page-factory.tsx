/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

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
    const onComponentScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = event.target as HTMLDivElement;

        if (props.onScroll) props.onScroll(target.scrollTop, event);
    };

    return <>
        { props.loader }
        <div className="page-factory ui container scroll-y h-100" ref={ ref } onScroll={ onComponentScroll }>
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

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
    const [ fixed, setFixed ] = React.useState(false);
    const staticContent = React.useRef<HTMLDivElement | null>();

    const childContentHolder = React.useRef<HTMLDivElement | null>();

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (!staticContent.current) return;

        const scrollTop = (event.target as HTMLElement).scrollTop;

        if (props.onScroll) props.onScroll(scrollTop, event);
        setFixed(scrollTop > staticContent.current.offsetHeight);
    };

    React.useLayoutEffect(() => {
        const resizeHandler = () => {
            if (childContentHolder.current && props.normalWidth)
                props.normalWidth.current = childContentHolder.current.offsetWidth;
        };

        resizeHandler();
        window.addEventListener("resize", resizeHandler);

        return () => window.removeEventListener("resize", resizeHandler);
    }, [ childContentHolder.current ]);

    return <>
        { props.loader }
        <div className="page-factory ui container scroll-y h-100" onScroll={ componentScrollHandler } ref={ ref }>
            <div className="content-holder ui flex center">
                <Header fixed={ fixed } staticContentRef={ ref => staticContent.current = ref } />
                <div className="child-content-holder ui grid center" ref={ ref => childContentHolder.current = ref }>
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
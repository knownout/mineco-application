import React from "react";
import "./header.scss";
import { ApplicationContext, VariablesStorage } from "../application";
import Button from "../../common/button";
import Navigation from "../navigation";

import Icons from "./icons";
import classNames from "../../lib/class-names";
import getScrollbarWidth from "../../lib/scrollbar-width";

function SocialDataRenderer (props: { socialData: { [key: string]: string }[] }) {
    const socialDataBlockEntry = (keyData: [ string, string ], index: number) => {
        const staticEntries = [ "email", "phone" ];
        const title = staticEntries.includes(keyData[0])
            ? keyData[1].split(":").slice(1).join(":")
            : keyData[0][0].toLocaleUpperCase() + keyData[0].slice(1).toLocaleLowerCase();

        const icon = Icons[keyData[0] as keyof typeof Icons];
        return <a href={ keyData[1] } className="ui clean flex row gap" target="_blank" key={ index }>
            <span className="icon-holder ui flex center">
                { icon }
            </span>
            <span className="item-title">{ title }</span>
        </a>;
    };

    const socialDataBlocks = props.socialData.map((data, index) => {
        return <div className="social-data-block ui flex row gap-5" key={ index }>
            { Object.entries(data).map(socialDataBlockEntry) }
        </div>;
    });

    return <div className="social-data ui flex column gap-5" children={ socialDataBlocks } />;
}

export default function Header (props: { scrollHeight: number }) {
    const context = React.useContext(ApplicationContext);
    const [ mobile, setMobile ] = React.useState(false);
    const [ open, setOpen ] = React.useState(false);

    const variablesData = context.variablesData as VariablesStorage;

    const staticContent = React.useRef<HTMLDivElement | null>();
    const navigationMenu = React.useRef<HTMLElement | null>();

    const windowResizeHandler = (width: number) => setMobile(window.innerWidth < width);
    React.useLayoutEffect(() => {
        const current = navigationMenu.current;
        if (!current) return;

        const handler = windowResizeHandler.bind(null, current.offsetWidth);

        window.addEventListener("resize", handler);
        handler();

        return () => window.removeEventListener("resize", handler);
    }, [ navigationMenu.current ]);

    const dynamicContentStyles = { width: `calc(100vw - ${ getScrollbarWidth() }px)` } as React.CSSProperties;

    const navigationCondition = !mobile || (mobile && open);

    const mobileMenuButton = <Button className={ classNames("mobile-menu", { open }) } children="Меню"
                                     icon="bi bi-three-dots" onClick={ () => setOpen(!open) } />;

    const extraButtonsSection = <div className="extra-buttons ui flex column margin-left-auto flex flex-end-ai gap">
        <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">Виртуальная приемная</Button>
        <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">Горячие линии</Button>
    </div>;

    return <header className={ classNames("header-component ui flex column center", { mobile }) }>
        { variablesData && <>
            { mobile && mobileMenuButton }
            <div className="static-top-container ui flex row center gap-20"
                 ref={ ref => staticContent.current = ref }>

                <div className="data-container ui flex column gap-20">
                    <div className="website-title ui flex row center gap">
                        <div className="mineco-logo-holder">
                            <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
                        </div>
                        <h1 className="mineco-title-text">{ variablesData.websiteTitle }</h1>
                    </div>
                    { !mobile && <SocialDataRenderer socialData={ variablesData.socialData } /> }
                </div>

                { !mobile && extraButtonsSection }
            </div>
            <div className={ classNames("dynamic-container nav-menu-container ui flex center-ai w-100", {
                fixed: !mobile && staticContent.current ? props.scrollHeight > staticContent.current.offsetHeight
                    : false, open
            }) } style={ open ? {} : dynamicContentStyles }>
                { navigationCondition &&
                    <Navigation navigationMenu={ variablesData.navigationPanel } mobile={ mobile }
                                element={ ref => navigationMenu.current = ref }>
                        { mobile && <div className="social-data-holder ui margin-bottom">
                            <SocialDataRenderer socialData={ variablesData.socialData } />
                        </div> }
                    </Navigation> }
            </div>
        </> }
    </header>;
}
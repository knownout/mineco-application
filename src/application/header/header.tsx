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

        const icon = Icons[keyData[0] as keyof typeof Icons].default;
        return <a href={ keyData[1] } className="ui clean flex row gap" target="_blank" key={ index }>
            <span className="icon-holder ui flex center" dangerouslySetInnerHTML={ { __html: icon } } />
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
    const variablesData = context.variablesData as VariablesStorage;

    const staticContent = React.useRef<HTMLDivElement | null>();
    const dynamicContentStyles = { width: `calc(100vw - ${ getScrollbarWidth() }px)` } as React.CSSProperties;

    return <header className="header-component ui flex column center">
        { variablesData && <>
            <div className="static-top-container ui flex row limit-1080 center"
                 ref={ ref => staticContent.current = ref }>

                <div className="data-container ui flex column gap-20">
                    <div className="website-title ui flex row limit-380 center gap">
                        <div className="mineco-logo-holder">
                            <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
                        </div>
                        <h1 className="mineco-title-text">{ variablesData.websiteTitle }</h1>
                    </div>
                    <SocialDataRenderer socialData={ variablesData.socialData } />
                </div>

                <div className="extra-buttons ui flex column margin-left-auto flex flex-end-ai gap">
                    <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">Виртуальная приемная</Button>
                    <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">Горячие линии</Button>
                </div>
            </div>
            <div className={ classNames("dynamic-container nav-menu-container ui flex center-ai w-100", {
                fixed: staticContent.current ? props.scrollHeight > staticContent.current.offsetHeight : false
            }) } style={ dynamicContentStyles }>
                <Navigation navigationMenu={ variablesData.navigationPanel } />
            </div>
        </> }
    </header>;
}
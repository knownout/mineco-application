import React from "react";
import "./share-button.scss";

interface ShareButtonProps {
    icon: string;
    link: string;
    title: string;
}

export default function ShareButton (props: ShareButtonProps) {
    const link = props.link.replace("{link}", props.link).replace("{title}", props.title);

    const clickEventHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        window.open(link, props.title, "popup,width=720,height=520");
    };

    return <a className="share-button ui flex center" href={ link } onClick={ clickEventHandler }>
        <img src={ props.icon } alt="" />
    </a>;
}
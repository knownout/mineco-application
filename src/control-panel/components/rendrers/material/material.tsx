import React from "react";
import "./material.scss";
import convertDate from "../../../../lib/convert-date";

interface MaterialProps {
    title: string;
    children: string;
    preview: string;
    datetime: string;

    onClick? (event: React.MouseEvent<HTMLDivElement>): void;
}

export default function Material (props: MaterialProps) {
    if (!props.title) return null;
    const descriptionMaxLength = 10;
    const descriptionWordsArray = props.children.split(" ").filter(e => e.length > 0);

    let descriptionString = descriptionWordsArray.slice(0, descriptionMaxLength).join(" ") +
        (descriptionWordsArray.length > descriptionMaxLength ? "..." : "");

    if (descriptionString.slice(-4) === "....")
        descriptionString = descriptionString.slice(0, descriptionString.length - 1);

    return <div className="material ui flex column padding-15">
        <div className="material-header ui flex row gap">
            <img src={ props.preview } alt="" className="material-image ui border-radius-10" />
            <span className="material-title">{ props.title }</span>
        </div>
        <div className="material-description">
            { descriptionString }
        </div>
        <span className="material-date">{ convertDate(new Date(parseInt(props.datetime) * 1000)) }</span>
    </div>;
}
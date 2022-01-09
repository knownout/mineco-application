import React from "react";
import "./checkbox.scss";
import classNames from "../../lib/class-names";

interface CheckBoxProps {
    children: string;
    checked?: boolean;

    onChange? (checkState: boolean): void;

    onClick? (event: React.MouseEvent<HTMLDivElement>, checkState: boolean): void;
}

export default function CheckBox (props: CheckBoxProps) {
    const [ checkState, setCheckState ] = React.useState(Boolean(props.checked));

    function clickEventHandler (event: React.MouseEvent<HTMLDivElement>) {
        if (props.onClick) props.onClick(event, !checkState);
        if (props.onChange) props.onChange(!checkState);

        setCheckState(!checkState);
    }

    const rootClassName = classNames("checkbox-component ui flex row padding-15 border-radius-10", {
        checked: checkState
    }, "lh-22 center-ai");

    return <div className={ rootClassName } onClick={ clickEventHandler }>
        <i className="bi bi-check-lg" />
        <span className="checkbox-text">{ props.children }</span>
    </div>;
}
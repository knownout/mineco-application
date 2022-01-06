import React from "react";
import "./items-list.scss";
import Input, { InputProps } from "../../../common/input";
import classNames from "../../../lib/class-names";

interface ItemsListComponentProps {
    children: any;
    className?: string;

    onReturn?: InputProps["onReturn"];
}

export default class ItemsList {
    public static readonly MaterialsList = (props: ItemsListComponentProps) =>
        this.makeComponent("Поиск по материалам", "bi-newspaper", props);

    public static readonly FilesList = (props: ItemsListComponentProps) =>
        this.makeComponent("Поиск по файлам", "bi-archive-fill", props);

    private static makeComponent (placeholder: string, icon: string, props: ItemsListComponentProps) {

        return <>
            <Input placeholder={ placeholder } className="margin optimize"
                   icon={ "bi " + icon } onReturn={ props.onReturn } />

            <span className="ui fz-14 opacity-65">
                Показаны только последние 30 результатов, для остальных используйте поиск
            </span>

            <div className={ classNames("relative-items-list", props.className) }>
                { props.children }
            </div>
        </>;
    }
}
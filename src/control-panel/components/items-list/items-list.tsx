import React from "react";
import "./items-list.scss";
import Input from "../../../common/input";

export default class ItemsList {
    public static readonly MaterialsList: React.FC = () =>
        this.makeComponent("Поиск по материалам", "bi-newspaper");

    public static readonly FilesList: React.FC = () =>
        this.makeComponent("Поиск по файлам", "bi-archive-fill");

    private static makeComponent (placeholder: string, icon: string) {
        return <>
            <Input placeholder={ placeholder } className="margin optimize"
                   icon={ "bi " + icon } />

            <span className="ui fz-14 opacity-65">
                Показаны только последние 30 результатов, для остальных используйте поиск
            </span>
        </>;
    }
}
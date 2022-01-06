import React from "react";
import Button from "../../../common/button";

export function InitialForm (props: { tabIndex: number, onClick? (event: React.MouseEvent): void }) {
    const textReplacer = [
        [ "материал", "создайте", "Создать материал" ],
        [ "файл", "загрузите", "Загрузить файл" ]
    ][props.tabIndex];

    const sampleText = `Ничего не выбрано. Выберите ${ textReplacer[0] } из списка слева или ${ textReplacer[1] } новый`;

    return <div className="initial-form ui flex center gap text-center padding-20 limit-380">
        <span className="text ui opacity-65">{ sampleText }</span>
        <Button icon="bi bi-cloud-plus-fill" onClick={ props.onClick }>{ textReplacer[2] }</Button>
    </div>;
}
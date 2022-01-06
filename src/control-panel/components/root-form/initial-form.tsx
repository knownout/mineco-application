import React from "react";
import Button, { ButtonProps } from "../../../common/button";
import { RequestItemType } from "./request-items";

interface InitialFormProps {
    itemsType: RequestItemType;
    onAsyncClick?: ButtonProps["onAsyncClick"];
    onAsyncException?: ButtonProps["onAsyncException"];

    onClick? (event: React.MouseEvent): void;
}

export function InitialForm (props: InitialFormProps) {
    const textReplacer = [
        [ "материал", "создайте", "Создать материал" ],
        [ "файл", "загрузите", "Загрузить файл" ]
    ][props.itemsType];

    const sampleText = `Ничего не выбрано. Выберите ${ textReplacer[0] } из списка слева или ${ textReplacer[1] } новый`;

    return <div className="initial-form ui flex center gap text-center padding-20 limit-460">
        <span className="text ui opacity-65">{ sampleText }</span>
        { props.itemsType == RequestItemType.materials && <div className="ui flex column search-cheatsheet">
            <span className="section-title ui opacity-50">Шпаргалка по поиску материалов:</span>
            <table className="items-list">
                <tbody>
                    <tr>
                        <td><code>{ ">04.16.2021" }</code></td>
                        <td>
                        <span>
                            Найти материалы, которые были опубликованы после
                            определенной даты <i>(месяц.день.год, ##.##.####)</i>
                        </span>
                        </td>
                    </tr>
                    <tr>
                        <td><code>{ "<04.16.2021" }</code></td>
                        <td>
                            <span>Найти материалы, которые были опубликованы до определенной даты</span>
                        </td>
                    </tr>
                    <tr>
                        <td><code>#a0b1c2</code></td>
                        <td>
                            <span>Найти материал по его 16-значному идентификатору</span>
                        </td>
                    </tr>
                    <tr>
                        <td><code>!abcde</code></td>
                        <td>
                            <span>Найти материалы, заголовок которых содержит определенный текст</span>
                        </td>
                    </tr>
                    <tr>
                        <td><code>+Новости</code></td>
                        <td>
                            <span>Найти материалы, список тегов которых содержит заданный тег или теги</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> }
        <Button icon="bi bi-cloud-plus-fill" onClick={ props.onClick } onAsyncClick={ props.onAsyncClick }
                onAsyncException={ props.onAsyncException }>{ textReplacer[2] }</Button>
    </div>;
}
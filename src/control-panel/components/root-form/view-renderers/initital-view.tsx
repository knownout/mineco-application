import React from "react";

import Button from "../../../../common/button";

import { ItemObject } from "../item-object-renderers/renderers";
import classNames from "../../../../lib/class-names";
import Type = ItemObject.Type;

interface InitialViewProps {
    type: ItemObject.Type;
    waitContent: boolean;

    onGenericButtonClick? (event: React.MouseEvent<HTMLButtonElement>): void;
}

/**
 * Component for creating generic initial view form
 * for the item-view element
 * @inner
 *
 * @constructor
 */
export default function InitialView (props: InitialViewProps) {
    // No-selection text for the variable
    const variableNoSelectionText = <span>Выберите переменную из списка или воспользуйтесь поиском, чтобы начать</span>;

    // Generic no-selection text for the files and materials
    const genericNoSelectionText = (type: Type.files | Type.materials) =>
        <span>
            Выберите { [ "материал", "файл" ][type] } из списка,
            воспользуйтесь поиском или { [ "создайте", "загрузите" ][type] }
            новый { [ "материал", "файл" ][type] }, чтобы начать
        </span>;

    // Get no-selection text for current scope
    const noSelectionText = props.type == Type.variables
        ? variableNoSelectionText
        : genericNoSelectionText(props.type);

    // Get generic action button for current scope
    const genericButton = props.type == Type.variables ? null
        : <Button onClick={ props.onGenericButtonClick } className={ classNames({ waiting: props.waitContent }) }
                  icon={ "bi bi-" + [ "file-earmark-plus-fill", "cloud-arrow-up-fill" ][props.type] }>
            { [ "Создать материал", "Загрузить файл" ][props.type] }
        </Button>;

    // Search hint text for the materials
    const materialSearchHint = <table>
        <tbody>
            <tr>
                <td><code>{ ">" }01.16.2022</code></td>
                <td><code>найти материалы, созданные после определенной даты (месяц.день.год)</code></td>
            </tr>
            <tr>
                <td><code>{ "<" }01.16.2022</code></td>
                <td><code>найти материалы, созданные до определенной даты</code></td>
            </tr>
            <tr>
                <td><code>!заголовок</code></td>
                <td><code>найти материалы, заголовок которых содержит определенный текст</code></td>
            </tr>
            <tr>
                <td><code>+Новости</code></td>
                <td><code>найти материалы, в списке тегов которых содержится определенный тег</code></td>
            </tr>
            <tr>
                <td><code>#abcde</code></td>
                <td><code>найти материал по его 16-значному идентификатору (ссылке)</code></td>
            </tr>
        </tbody>
    </table>;

    // Search hint text for the files
    const fileSearchHint = <table>
        <tbody>
            <tr>
                <td><code>{ ">" }01.16.2022</code></td>
                <td><code>найти файлы, загруженные после определенной даты (месяц.день.год)</code></td>
            </tr>
            <tr>
                <td><code>{ "<" }01.16.2022</code></td>
                <td><code>найти файлы, загруженные до определенной даты</code></td>
            </tr>
            <tr>
                <td><code>+docx</code></td>
                <td><code>найти файлы, расширение которых соответствует заданному</code></td>
            </tr>
            <tr>
                <td><code>#12345</code></td>
                <td><code>найти файл по его номеру в таблице</code></td>
            </tr>
        </tbody>
    </table>;

    const genericHintText = props.type == Type.variables ? null :
        [ materialSearchHint, fileSearchHint ][props.type];

    return <div className="view initial-view ui grid center">
        <div className="view-content-wrapper ui flex text-center center column limit-380 gap-20">
            <div className="generic-text-container ui opacity-65">
                { noSelectionText }
            </div>
            <div className="generic-hint-text-container ui opacity-65">
                { genericHintText }
            </div>
            <div className="generic-button-container">
                { genericButton }
            </div>
        </div>
    </div>;
}
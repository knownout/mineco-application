import React from "react";
import "./file-select.scss";
import { ItemObject } from "../../item-object-renderers/renderers";
import ItemsList from "../../items-list";
import classNames from "../../../../../lib/class-names";
import Loading from "../../../../../common/loading";
import Button from "../../../../../common/button";

interface IFileSelectComponentProps {
    display?: boolean;
    callback?: React.MutableRefObject<((file?: ItemObject.File) => void) | null>;
    exclude?: React.MutableRefObject<string[] | undefined>;

    onSelectCancel? (): void;

    uploadFile? (callback?: (state: boolean) => void): void;
}

export default function FileSelect (props: IFileSelectComponentProps) {
    const [ waitContent, setWaitContent ] = React.useState(true);
    const [ itemsList, setItemsList ] = React.useState<ItemObject.File[]>();
    const [ contentVersion, setContentVersion ] = React.useState(0);

    const itemsListProperties = { waitContent, setWaitContent };

    function selectionEndHandler (index?: number) {
        if (index !== undefined && itemsList && props.callback
            && props.callback.current) props.callback.current(itemsList[index]);
        else if (props.callback && props.callback.current) props.callback.current();

        props.onSelectCancel && props.onSelectCancel();
    }

    return <div
        className={ classNames("file-selector ui container grid center scroll", { display: props.display }) }>
        <Loading display={ waitContent } />
        <div className="content-wrapper ui flex column limit-380 h-fit padding gap">
            <Button icon="bi bi-cloud-arrow-up-fill" onClick={
                () => props.uploadFile
                    && props.uploadFile(state => setContentVersion(contentVersion + Number(state)))
            }>Загрузить файл</Button>
            <Button icon="bi bi-x-lg" onClick={ () => selectionEndHandler() }>Закрыть окно</Button>
            <ItemsList type={ ItemObject.Type.files } { ...itemsListProperties }
                       extensionFiler={ props.exclude && props.exclude.current }
                       updateItemsList={ itemsList => setItemsList(itemsList as ItemObject.File[]) }
                       onItemClick={ index => selectionEndHandler(index) } contentVersion={ contentVersion } />
        </div>
    </div>;
}
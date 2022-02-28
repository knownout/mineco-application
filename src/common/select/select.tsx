import React from "react";
import classNames from "../../lib/class-names";
import "./select.scss";

interface SelectProps
{
    defaultIndex?: number;

    items: string[];

    onItemSelect? (index: number, name: string): void;
}

export default function Select (props: SelectProps) {
    const [ index, setIndex ] = React.useState(props.defaultIndex ? props.defaultIndex : 0);
    const [ itemsList, setItemsList ] = React.useState(false);

    const [ height, setHeight ] = React.useState<number>();

    const itemsListRef = React.useRef<HTMLDivElement | null>();

    React.useLayoutEffect(() => {
        if (!itemsListRef.current) return;

        setHeight(itemsListRef.current.scrollHeight);
    });

    const itemClassName = "select-item ui flex padding-20 border-radius-10";
    return <div className={ classNames("select-component ui flex column", { open: itemsList }) }>
        <div className="selected-item ui flex row padding-20" onClick={ () => setItemsList(itemsList => !itemsList) }>
            <span className="item-name no-text-wrap-ellipsis">{ props.items[index] }</span>
            <i className="bi bi-caret-down-square ui margin-left-auto" />
        </div>
        <div className="items-list ui flex column" ref={ ref => itemsListRef.current = ref }
             style={ { height: itemsList ? height : 0 } }>
            { props.items.map((item, key) =>
                <div className={ classNames(itemClassName, { selected: index == key }) } children={ item }
                     key={ item + key }
                     onClick={ () => {
                         setIndex(key);
                         setItemsList(false);
                     } } />) }
        </div>
    </div>;
}

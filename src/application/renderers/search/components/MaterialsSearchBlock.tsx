import React from "react";
import Button from "../../../../common/button";
import Input from "../../../../common/input";

interface MaterialsSearchBlockProps
{
    query?: string;

    setQuery (query: string): void;

    onSearch? (): void;
}

export default function MaterialsSearchBlock (props: MaterialsSearchBlockProps) {
    return <div className="materials-search-block ui flex row w-100 gap">
        <Input placeholder="Поиск по текущему разделу" onInput={ props.setQuery } onReturn={ props.onSearch } />
        <Button onClick={ props.onSearch } icon="bi bi-search">Поиск</Button>
    </div>;
}

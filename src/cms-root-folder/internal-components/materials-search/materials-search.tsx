import React from "react";
import "./materials-search.scss";
import TextInput from "../../../shared/text-input";
import Button from "../../../shared/button-component";
import Group from "../../../shared/group-component";
import { Material, Requests } from "../../../shared/shared-types";
import { defaultPathsList, RequestBody } from "../../../shared/shared-content";

export default function MaterialsSearch (props: { updateMaterialsList: (materialsList: Material.PreviewRaw[]) => void })
{
    const [ searchQuery, setSearchQuery ] = React.useState("");

    const buttonReference = React.createRef<HTMLButtonElement>();

    const onInputReturn = () =>
    {
        if (!buttonReference.current) return;
        buttonReference.current.focus();
        buttonReference.current.click();
    };

    const findMaterials = (query: string) => new Promise<void>(async (resolve, reject) =>
    {
        const materialsList = await fetch(defaultPathsList.request, new RequestBody({
            [Requests.TypesList.Action]: [ Requests.ActionsList.getMaterials ],
            [Requests.TypesList.DataTitle]: query,
            [Requests.TypesList.DataShort]: query,
            [Requests.TypesList.DataFindPinned]: true,
            [Requests.TypesList.DataLimit]: 10
        }).postFormData).then(request => request.json()) as Requests.RequestResult<Material.PreviewRaw[]>;

        if (!materialsList.success)
        {
            props.updateMaterialsList([]);
            if (materialsList.meta.toString() != "no materials found") reject();
            else resolve();
        } else
        {
            props.updateMaterialsList(materialsList.meta);
            resolve();
        }
    });

    return <div className="materials-search">
        <Group className="semi-transparent" title="Поиск по материалам">
            <TextInput placeholder="Название или краткое содержание"
                       onPlaceholderStateChange={ state => !state && window.dispatchEvent(new Event("resize")) }
                       onInput={ setSearchQuery }
                       onReturn={ onInputReturn } />

            <Button onAsyncClick={ () => findMaterials(searchQuery) } reference={ buttonReference }>Найти</Button>
        </Group>
    </div>;
}

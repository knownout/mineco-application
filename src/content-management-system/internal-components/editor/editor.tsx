// Library import
import React from "react";
// Helpers import
import { useParams } from "react-router-dom";
// Internal helpers import
import { TMaterialUpdateFunction, useMaterial } from "./index";
import { EditorJSLocalizationConfiguration, EditorJSToolConfiguration } from "../../../shared/editor-js-configuration";
import { generateImageComponentPaths, processRawMaterial } from "../../../shared/shared-content";
import { Material } from "../../../shared/shared-types";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import Group from "../../../shared/group";
import Image from "../../../shared/lazy-load-image";
import TextInput from "../../../shared/text-input";
import Checkbox from "../../../shared/checkbox";
// External components import
import { Helmet } from "react-helmet";
// Stylesheet import
import "./editor.scss";

const { createReactEditorJS } = require("react-editor-js");
const ReactEditorJS = createReactEditorJS();

/**
 * Internal component for editing material metadata and content
 * renders in new window with custom icon and title
 *
 * Material identifier shows in title before material data loaded
 *
 * After material loading, title replaces to the material title
 *
 * @author knownOut "re-knownout" knownout@hotmail.com
 */
export default function Editor ()
{
    // Get material identifier from router location
    const { identifier } = useParams<"identifier">();

    // Tags list from useMaterial function
    const [ tagsList, setTagsList ] = React.useState<string[]>([]);

    // State for page update when required without full reloading
    const [ pageKey, setPageKey ] = React.useState(Math.random());

    // Define state for material data (material and update function)
    let [ materialData, _setMaterialData ] = React.useState<{
        material: Material.Full, updateFn: TMaterialUpdateFunction
    }>();

    // Require material data from server through useMaterial function
    const requireMaterialData = () => new Promise<void>((resolve, reject) =>
    {
        useMaterial(identifier as string).then(result =>
        {
            _setMaterialData({ material: result[0], updateFn: result[1] });
            setTagsList(result[2]);

            // Preload preview image placeholder
            const stub = document.createElement("img");

            stub.src = generateImageComponentPaths(processRawMaterial(result[0].data)).placeholder;
            stub.onerror = stub.onabort = () => reject("image placeholder loading error");
            stub.onload = () => resolve();
        });
    });

    return <div className="root-editor-wrapper">
        <Helmet>
            <link rel="icon" href="/public/editor-favicon.ico" />
            <title>Редактор материала #{ identifier }</title>
        </Helmet>

        <PageWrapper loadingLabel="Получение материала" asyncContent={ requireMaterialData } key={ pageKey }>
            <Group className="cluster" condition={ Boolean(materialData) }>
                <Helmet children={ <title children={ materialData?.material.data.title } /> } />
                <MaterialEditor material={ materialData?.material as Material.Full } tagsList={ tagsList } />
            </Group>
        </PageWrapper>
    </div>;
}

/**
 * Internal component for creating
 * ReactEditorJS instance
 */
function MaterialEditor (props: { material: Material.Full, tagsList: string[] })
{
    const material = processRawMaterial(props.material.data);

    // Reference to editor.js component
    const editorJS = React.useRef();

    // Fired when editor initialized (why before render?)
    const handleInitialize = React.useCallback((instance) =>
    {
        editorJS.current = instance;
        setTimeout(() => window.dispatchEvent(new Event("resize")), 110);
    }, []);

    return <React.Fragment>
        <Group className="cluster metadata-edit">
            <div className="preview-image-holder">
                <Image { ...generateImageComponentPaths(material) } />
            </div>
            <div className="metadata-properties">
                <TextInput placeholder="Заголовок материала"
                           defaultValue={ material.title } />

                <TextInput placeholder="Идентификатор"
                           defaultValue={ material.identifier } />

                <Checkbox children="Закрепить материал"
                          defaultChecked={ material.pinned } />
            </div>
        </Group>
        <Group className="semi-transparent tags-edit" title="Список разделов">
            { props.tagsList.map(tag => <Checkbox children={ tag } defaultChecked={ material.tags.includes(tag) }
                                                  key={ Math.random() } />) }
        </Group>
        <Group className="cluster">
            <ReactEditorJS { ...EditorJSToolConfiguration } { ...EditorJSLocalizationConfiguration }
                           defaultValue={ props.material.content } holder="custom-editor-holder"
                           onInitialize={ handleInitialize }
                           onChange={ window.dispatchEvent(new Event("resize")) }>
                <div id="custom-editor-holder" />
            </ReactEditorJS>
        </Group>
    </React.Fragment>;
}

// Library import
import React from "react";
// Helpers import
import { useParams } from "react-router-dom";
// Internal helpers import
import { TMaterialUpdateFunction, useMaterial } from "./index";
import { Material } from "../../../shared/shared-types";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import Group from "../../../shared/group";
// External components import
import { Helmet } from "react-helmet";

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

    // Define state for material data (material and update function)
    let [ materialData, _setMaterialData ] = React.useState<{
        material: Material.Full, updateFn: TMaterialUpdateFunction
    }>();

    // Require material data from server through useMaterial function
    const requireMaterialData = () => useMaterial(identifier as string).then(result =>
        _setMaterialData({ material: result[0], updateFn: result[1] })
    );

    return <div className="root-editor-wrapper">
        <Helmet>
            <link rel="icon" href="/public/editor-favicon.ico" />
            <title>Редактирование #{ identifier }</title>
        </Helmet>

        <PageWrapper loadingLabel="Получение материала" asyncContent={ requireMaterialData }>
            <Group className="cluster" condition={ Boolean(materialData) }>
                <Helmet children={ <title children={ materialData?.material.data.title } /> } />
            </Group>
        </PageWrapper>
    </div>;
}

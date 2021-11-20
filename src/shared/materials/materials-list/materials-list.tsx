// Library import
import React from "react";
// Helpers
import * as Shared from "../../shared-content";
import { Material } from "../../shared-types";
// Internal components
import PageWrapper from "../../page-wrapper";
import Image from "../../lazy-load-image";
// Stylesheet
import "./materials-list.scss";

interface IMaterialsListProps
{
    materialsList: Material.LazyPreview[]

    /** Fires when material get clicked */
    onMaterialEditStart? (material?: Material.Preview): void
}

/**
 * Component for rendering materials list of type Material.LazyPreview
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function MaterialsList (props: IMaterialsListProps)
{
    return <PageWrapper loadingLabel="Получение материалов" className="materials-list" key={ Math.random() }
                        onLoadComplete={ () => window.dispatchEvent(new Event("resize")) }>
        { props.materialsList.map(material => <MaterialRenderer material={ material } onMaterialEditStart={
            props.onMaterialEditStart
        } key={ Math.random() } />) }
    </PageWrapper>;
}

/**
 * Internal component for rendering single material
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 */
function MaterialRenderer (props: { material: Material.LazyPreview } & Pick<IMaterialsListProps, "onMaterialEditStart">)
{
    const { material } = props;
    const Preview: React.FC<{ className?: string }> = ({ className }) =>
        <Image source={ material.preview } placeholder={ material.stub } alt={ material.title }
               className={ className } />;

    const onMaterialClick = () => props.onMaterialEditStart && props.onMaterialEditStart(material);

    return <div className="material" key={ Math.random() } onClick={ onMaterialClick }>
        {/* Material preview image */ }
        <Preview className="preview-image" />

        {/* Main content of the material */ }
        <div className="material-content">
            {/* Blurred background image (glass effect) */ }
            <Preview className="background-image" />

            <div className="meta-data">
                <div className="title-data">
                    <span className="title">
                        { material.pinned && Shared.createBootstrapIcon("angle-pin-fill") }
                        { material.title }
                    </span>
                    <span className="identifier">#{ material.identifier }</span>
                </div>
                <span className="date">
                    { Shared.renderLocalizedDate(new Date(material.time), true) }
                </span>
                <div className="short-content">
                    { material.short }
                </div>
            </div>
        </div>
    </div>;
}
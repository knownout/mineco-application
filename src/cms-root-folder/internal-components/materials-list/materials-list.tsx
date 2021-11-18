import React from "react";
import "./materials-list.scss";
import { Material } from "../../../shared/shared-types";
import { createBootstrapIcon, defaultPathsList } from "../../../shared/shared-content";
import { LazyLoadImage } from "react-lazy-load-image-component";

namespace MaterialsList
{
    export interface Properties
    {
        /** List of materials loaded from server */
        materialsList: Material.Preview[]
    }
}

/**
 * Internal component for display materials loaded from server with
 * lazy-loading preview images
 *
 * todo: make blurred background image lazy load too
 * todo: add "remove material" button
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default class MaterialsList extends React.PureComponent<MaterialsList.Properties>
{
    render (): React.ReactNode
    {
        return <div className="materials-list">
            {
                // Iterate through materials list
                this.props.materialsList.map(material =>
                {
                    // If material or material preview not exist, skip
                    if (!material || !material.preview) return null;

                    // Get date and name from material preview image
                    const [ imageDate, imageName ] = material.preview.split("/");

                    // Generate path to preview image on server
                    const preview = defaultPathsList.openStorageFile(imageDate, imageName);

                    return <div className="material-item" key={ Math.random() }>
                        {/* Blurred background image */}
                        <div className="preview-background-image"
                             style={ { backgroundImage: `url("${ preview }")` } } />

                        <div className="title-content">
                            <div className="preview-image">
                                <LazyLoadImage src={ preview } placeholderSrc={
                                    defaultPathsList.openStorageFile(imageDate, imageName, true)
                                } />
                            </div>
                            <div className="title-data">
                                <span className="material-title-label">
                                    { material.pinned && createBootstrapIcon("pin-angle-fill") }
                                    { material.title }
                                </span>
                                <span className="material-identifier">{ material.identifier }</span>
                                <div className="material-tags-list" children={ material.tags.map(tag =>
                                    <span className="material-tag" children={ tag } key={ Math.random() } />
                                ) } />
                            </div>
                        </div>

                        <div className="material-short-content">
                            { material.short }
                        </div>
                    </div>;
                })
            }
        </div>;
    }
}

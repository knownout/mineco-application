import React from "react";
import "./file.scss";

interface FileProps {
    filename: string;
}

export default function File (props: FileProps) {
    const filenameArray = props.filename.split("."),
        filename = filenameArray.slice(0, -1).join("."),
        extension = filenameArray.slice(-1)[0];

    return <div className="file ui flex column padding-15">
        <span className="filename">{ filename }</span>
        <div className="filetype ui flex row wrap gap-5">
            <span className="ext-icon">.{ extension }</span>
            <span className="ext-description">Файл</span>
        </div>
    </div>;
}
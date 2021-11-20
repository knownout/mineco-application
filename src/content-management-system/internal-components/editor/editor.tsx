import React from "react";
import { TEditorRouteParameters } from "../../cms-router";
import { useParams } from "react-router-dom";

/**
 * Internal editor class component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 */
class EditorComponent extends React.PureComponent<Partial<TEditorRouteParameters>>
{
    render (): React.ReactNode
    {
        console.log(this.props.identifier);
        return <div>Editor instance not implemented yet</div>;
    }
}

/**
 * Function component wrapper for retrieving identifier from location
 * due to react router v6 has no support for class components
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 */
export default function Editor ()
{
    const { identifier } = useParams<"identifier">();
    return <EditorComponent identifier={ identifier } />;
}
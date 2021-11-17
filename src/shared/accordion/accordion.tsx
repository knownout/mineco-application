import React from "react";
import "./accordion.scss";
import { classNames, createBootstrapIcon } from "../shared-content";

interface IAccordionProps
{
    children: any

    /** Accordion component title */
    title: string

    /** Initial state of the accordion component */
    open?: boolean

    /** Fires when accordion component closed */
    onClose? (): void;

    /** Fires when accordion component opened */
    onOpen? (): void;
}

/**
 * Single uncontrolled accordion component
 *
 * For controlled accordions group use AccordionGroup component
 * with AccordionGroup.Item children
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 *
 * @deprecated
 */
export default function Accordion (props: IAccordionProps)
{
    // Accordion open state
    const [ accordionState, setAccordionState ] = React.useState(props.open === true);

    // Accordion content holder height
    const [ accordionHeight, setAccordionHeight ] = React.useState(0);

    // Reference to top-level component content holder
    const accordionContentReference = React.createRef<HTMLDivElement>();

    // Calculate height of the content holder
    React.useEffect(() =>
    {
        // If no content holder reference, skip
        if (!accordionContentReference.current) return;

        // Get height (offsetHeight will be 0 in closed state, so use scrollHeight + border)
        const height = accordionContentReference.current.scrollHeight + 3;
        setAccordionHeight(height);
    }, [ props.children ]);

    const className = classNames("accordion-component", { active: accordionState });

    /**
     * Accordion component click event handler
     */
    const onAccordionClick = () =>
    {
        if (accordionState && props.onClose) props.onClose();
        if (!accordionState && props.onOpen) props.onOpen();

        // Update accordion state
        setAccordionState(!accordionState);
    };

    return <div className={ className }>
        <button className="accordion-title" onClick={ onAccordionClick }>
            <span className="label">{ props.title }</span>
            { createBootstrapIcon("bi bi-arrow-down-square") }
        </button>

        <div className="accordion-content" ref={ accordionContentReference }
             style={ { height: (accordionState ? accordionHeight : 0) + "px" } }>
            <div className="content-holder">
                { props.children }
            </div>
        </div>
    </div>;
}

import React from "react";
import { classNames } from "../shared-content";
import "./group.scss";

interface IGroupProps
{
    /** Children of group wrapped in a div.group-content element */
    children: any;

    /** Title of group */
    title?: string;

    /** Custom class name for group (processed by classNames) */
    className?: string;

    /** Component will render only if condition true (if provided) */
    condition?: boolean;

    /** Add children to top level of group component html structure */
    topLevelChildren?: JSX.Element;

    onClick? (event: React.MouseEvent<HTMLDivElement>): void;

    onDragEnter? (event: React.DragEvent<HTMLDivElement>): void;

    onDragLeave? (event: React.DragEvent<HTMLDivElement>): void;

    onDrop? (event: React.DragEvent<HTMLDivElement>): void;
}

/**
 * Component for making small named (or not) groups of specific content
 *
 * Classname .semi-transparent changes background to gradient from rgba(black, .04) to transparent
 *
 * Classname .cluster removes padding, background and border, makes block flex with 10px gap
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function Group (props: IGroupProps)
{
    // All available drag event names
    const dragEventNames = [ "", "End", "Enter", "Exit", "Leave", "Over", "Start" ].map(e => `onDrag${ e }`);

    // List of drag event function
    const dragEventsList: { [key: string]: any } = {};

    // Append specific function to each drag event
    dragEventNames.forEach(eventName =>
    {
        dragEventsList[eventName] = (event: React.DragEvent<HTMLDivElement>) =>
        {
            event.preventDefault();
            if ((props as any)[eventName]) (props as any)[eventName](event);
        };
    });

    // Check display condition
    if (props.condition === false) return null;

    return <div className={ classNames("group-component", props.className) } onClick={ props.onClick }
                onDrop={ event =>
                {
                    event.preventDefault();
                    props.onDrop && props.onDrop(event);
                } }
                { ...dragEventsList }>
        { props.topLevelChildren }
        { props.title && <span className="group-title">{ props.title }</span> }
        <div className="group-content">
            { props.children }
        </div>
    </div>;
}

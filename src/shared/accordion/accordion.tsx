import React from "react";
import "./accordion.scss";
import { classNames } from "../shared-content";

namespace Accordion
{
    export interface Properties
    {
        children: JSX.Element | JSX.Element[]

        /** Fires when state of the item inside group changed */
        onItemChange? (index: number, state: boolean): void

        /** Index of default opened item */
        defaultOpenItem?: number
    }

    // State of the accordions group
    export interface State
    {
        /** Index of the opened item */
        openItem: number
    }

    // Props of the internal item component (replaces stub)
    export interface IInternalItemProps extends IItemProps
    {
        /** Fires when user clicks on the title of the item */
        onClick (): void

        /** State of the item */
        openState: boolean
    }

    // Props of the stub component
    export interface IItemProps
    {
        children: any

        /** Title of the accordion */
        title: string

        /** If set, replaces default arrow icon of the accordion */
        icon?: JSX.Element,
    }
}

/**
 * Component for creating controlled groups of accordions
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default class Accordion extends React.PureComponent<Accordion.Properties, Accordion.State>
{
    state: Accordion.State = {
        openItem: typeof this.props.defaultOpenItem == "number" ? this.props.defaultOpenItem : -1
    };

    render (): React.ReactNode
    {
        // Get list of stub components
        const children = Array.isArray(this.props.children) ? this.props.children : [ this.props.children ];

        // ... and iterate through this list
        const accordionItems = children.map((child, index) =>
        {
            const { icon, children, ...rest } = child.props as Accordion.IItemProps;

            // Fires when onClick event from IItemProps fired
            const clickEventHandler = () =>
            {
                const nextState = index == this.state.openItem ? -1 : index;
                this.setState({ openItem: nextState }, () =>
                {
                    // Fire on item change event after state updated
                    if (this.props.onItemChange) this.props.onItemChange(index, this.state.openItem == index);
                });
            };

            return <AccordionItem openState={ this.state.openItem == index }
                                  icon={ icon || <i className="bi bi-arrow-down-square" /> } { ...rest }
                                  onClick={ clickEventHandler } key={ index }>
                { children }
            </AccordionItem>;
        });

        return <div className="accordion-group" children={ accordionItems } />;
    }

    /**
     * Item of the accordion group component
     *
     * @author re-knownout "knownOut" knownout@hotmail.com
     * @version 0.0.1
     */
    public static readonly Item = (props: Accordion.IItemProps) => <div
        className="item-stub">{ props }</div>;
}

/**
 * Internal component for creating accordion items
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
function AccordionItem (props: Accordion.IInternalItemProps)
{
    const contentReference = React.createRef<HTMLDivElement>();
    const [ contentHeight, setContentHeight ] = React.useState(0);

    React.useEffect(() =>
    {
        // Update height of component when mounted
        // Scroll height used because its same event if component real height equal to zero
        if (contentReference.current && contentHeight < 1) setContentHeight(contentReference.current.scrollHeight);
    }, []);

    return <div className={ classNames("accordion-item", { active: props.openState }) }>
        <button className="accordion-title" onClick={ props.onClick }>
            <span className="accordion-title-label">{ props.title }</span>
            <span className="icon-holder" children={ props.icon } />
        </button>
        <div className="accordion-content" ref={ contentReference }
             style={ { height: props.openState ? contentHeight : 0 } }>
            <div className="accordion-content-wrapper">
                { props.children }
            </div>
        </div>
    </div>;
}

import React from "react";
import "./carousel.scss";

import { CSSTransition } from "react-transition-group";
import classNames from "../../lib/class-names";

/**
 * Component for creating simple carousels
 * with switch buttons
 * @constructor
 */
export default function Carousel (props: { items: any[] }) {
    // Displayed item index in items array
    const [ index, _setIndex ] = React.useState(0);

    // Trigger of CSSTransition
    const [ animation, _setAnimation ] = React.useState(true);

    // Displayed item
    const [ item, _setItem ] = React.useState<keyof typeof props.items>(props.items[0]);

    /**
     * Function for updating carousel state
     * @param state item state (in or out)
     * @param next next item index
     */
    function updateItem (state: boolean, next?: number) {
        if (!state && Number.isInteger(next)) {
            _setIndex(Number(next));
            return _setAnimation(false);
        }

        _setItem(props.items[index]);
        _setAnimation(true);
    }

    // Reference to item wrapper (to avoid "deprecated" warning from React)
    const nodeRef = React.useRef(null);
    
    return <div className="carousel-component ui flex column relative">
        <div className="switch-buttons ui flex row center relative">
            { Array(props.items.length).fill(String()).map((_, key) =>
                <div className={ classNames("switch-button ui flex relative",
                    { active: key == index }) } key={ key }
                     onClick={ () => updateItem(false, key) } />) }
        </div>
        <div className="carousel-content ui flex relative">
            <CSSTransition in={ animation } onExited={ () => updateItem(true) } timeout={ 100 }
                           classNames="carousel-item" nodeRef={ nodeRef }>
                <div ref={ nodeRef } className="carousel-item-wrapper ui flex column relative">{ item }</div>
            </CSSTransition>
        </div>
    </div>;
}
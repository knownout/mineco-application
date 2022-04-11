/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import "./notify.scss";

/**
 * Utility for creation dynamic balloon notifications with react components with smooth animations
 * (utility DO NOT use "reactive" methods, there is native html)
 */
export default class Notify
{
    constructor (public readonly ref: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null)) {}

    /**
     * Holder for notifications. Can be replaced by any element you like, just
     * add ref={ notify.ref } to it
     *
     * @constructor
     */
    public static Component (props: { element: React.RefObject<HTMLDivElement> }) {
        return <div className="notifications-holder ui container flex padding gap" ref={ props.element } />;
    }

    /**
     * Add new notification to the list
     *
     * @param text notification content (innerHTML)
     * @param keepalive notification display time (0 - do not remove automatically)
     */
    public add (text: string, keepalive: number = 3000) {
        const target = this.ref.current;
        if (!target) return;

        // Create new html element and set up its properties
        const notification = document.createElement("div"),
            identifier = Math.random().toString().split(".")[1].slice(0, 6);

        notification.classList.add("notification", "hidden", ...("ui padding-15 bg-white border-radius-10"
            .split(" ")));

        notification.id = identifier;
        notification.innerHTML = text;

        // Remove notification on click
        notification.onclick = () => this.remove(identifier);

        // Remove older notifications if limit exceeded
        if (target.children.length >= 3)
            this.remove((target.firstChild as HTMLDivElement).id);

        target.appendChild(notification);

        // Apply initial animation
        setTimeout(() => notification.classList.remove("hidden"), 10);

        // Wait for keepalive and remove notification
        if (keepalive > 0) setTimeout(() => this.remove(identifier), keepalive);

        return identifier;
    }

    /**
     * Remove notification from the notifications list
     * @param identifier notification identifier
     */
    public remove (identifier: string) {
        const target = this.ref.current;
        if (!target) return false;

        // Check if notification exist in the list
        const item = target.querySelector(`div.notification[id="${ identifier }"]`);
        if (!item) return true;

        // Apply removing animation
        item.classList.add("hidden");

        // Remove notification
        setTimeout(() => item.remove(), 100);
        return true;
    }
}

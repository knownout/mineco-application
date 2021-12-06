import React from "react";

import { classNames } from "../shared-content";

import DefaultExceptionHandler from "./default-handlers/default-exception-handler";
import DefaultLoadingHandler from "./default-handlers/default-loading-handler";

import "./page-wrapper.scss";

namespace PageWrapper
{
    export interface Properties
    {
        /** Will be shown after page loading */
        children: any;

        /** Will be called when the componentDidCatch method is triggered */
        onLoadingException? (name: string, message: string): JSX.Element;

        /** If provided, loading is completed only after specific function is resolved */
        asyncContent? (): Promise<any>;

        /** Classname of the wrapper (.page-wrapper element) */
        className?: string;

        /** Classname of the content wrapper (.page-wrapper .content-wrapper element) */
        contentClassName?: string;

        /** Label that shown while loading, replaces default label */
        loadingLabel?: string;

        /** Force call page fade-out animation */
        fadeOut?: boolean;

        /** Fires when page fully loaded (will not fire if asyncContent throw exception) */
        onLoadComplete? (): void;

        /** If true, automatic vertical centring will be disabled */
        disableVerticalCentering?: boolean;
    }

    export interface State
    {
        /** If true, content on the page will be centered by justify-content: center css property */
        pageCenteringState: boolean;

        /** If true, content on the page will be centered by align-items: center css property */
        pageHorizontalCenteringState: boolean;

        /** If true, exception handler will be rendered instead of content */
        pageLoadingException: false | Error;

        /** If true, content will be show (after ~499+120ms animation)  */
        pageLoadingComplete: boolean;

        /** If true, content wrapper class name will be fade-out, otherwise - fade-in */
        fadeOut: boolean;
    }
}

/**
 * Component for creating layout with automatic loading handler, exception
 * handler and automatic content centering if possible
 * (solution for css flex align-items: center going aboard issue)
 *
 * Component requires knownOut's className function or any other classNames function,
 * that supports objects with key-value pair with className-expression roles
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.1.0
 */
export default class PageWrapper extends React.PureComponent<PageWrapper.Properties, PageWrapper.State>
{
    state: PageWrapper.State = {
        pageCenteringState: !this.props.disableVerticalCentering,
        pageHorizontalCenteringState: true,

        pageLoadingException: false,
        pageLoadingComplete: false,

        fadeOut: false
    };

    private pageWrapper = React.createRef<HTMLDivElement>();
    private contentWrapper = React.createRef<HTMLDivElement>();

    private wait = (time: number) => new Promise(resolve =>
    {
        setTimeout(resolve, time);
    });

    /**
     * Function for controlling page centering state by comparing
     * scrollHeight and offsetHeight of the wrapper
     */
    private pageCenteringController ()
    {
        if (!this.pageWrapper.current) return;

        // Get variables from pageWrapper element
        const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = this.pageWrapper.current;

        // If element higher than view, disable centering
        if (scrollHeight > offsetHeight && this.state.pageCenteringState && !this.props.disableVerticalCentering)
            this.setState({ pageCenteringState: false });

        // ... otherwise, enable content centering
        else if (scrollHeight <= offsetHeight && !this.state.pageCenteringState && !this.props.disableVerticalCentering)
            this.setState({ pageCenteringState: true });

        // Same for width
        if (scrollWidth > offsetWidth && this.state.pageHorizontalCenteringState)
            this.setState({ pageHorizontalCenteringState: false });

        else if (scrollWidth <= offsetWidth && !this.state.pageHorizontalCenteringState)
            this.setState({ pageHorizontalCenteringState: true });
    }

    /**
     * Call page fade-out animation and then call fade-in animation with pageLoadingComplete true
     */
    private async callPageAnimation ()
    {
        if (!this.state.pageLoadingException && this.contentWrapper.current) this.setState({ fadeOut: true });

        // Wait 100 (+50 for more smooth animation) milliseconds for animation end
        await this.wait(150);
        setTimeout(this.pageCenteringController, 10);

        if (!this.state.pageLoadingComplete && this.contentWrapper.current)
            this.setState({
                pageLoadingComplete: true,
                fadeOut: false
            }, () => this.props.onLoadComplete && this.props.onLoadComplete());
    }

    constructor (props: PageWrapper.Properties)
    {
        super(props);

        this.pageCenteringController = this.pageCenteringController.bind(this);
    }

    async componentDidMount (): Promise<void>
    {
        const mountInitialTime = Date.now();

        window.addEventListener("resize", this.pageCenteringController);

        if (this.props.asyncContent) await this.props.asyncContent().catch(async error =>
        {
            await this.callPageAnimation();

            console.error("Exception while processing asyncContent property:\n", error);
            this.setState({ pageLoadingException: error });
        });

        // Wait 500 milliseconds for more smooth animation
        // Based on relative timing, the user will not wait too
        // long if the content is loaded for more than 500ms.
        await this.wait(500 - (Date.now() - mountInitialTime));

        await this.callPageAnimation();
    }

    componentWillUnmount (): void
    {
        // I believe that this thing will speed up the application and make it use less memory
        window.removeEventListener("resize", this.pageCenteringController);
    }

    componentDidCatch (error: Error, errorInfo: React.ErrorInfo): void
    {
        this.setState({ pageLoadingException: error });
    }

    render (): React.ReactNode
    {
        let content: JSX.Element = this.props.children;

        // If there is page loading error...
        if (this.state.pageLoadingException)
        {
            // ... get name and message
            const { name, message } = this.state.pageLoadingException;

            // ... if custom handler provided, use it, otherwise use default
            if (this.props.onLoadingException) content = this.props.onLoadingException(name, message);
            else content = <DefaultExceptionHandler error={ this.state.pageLoadingException } />;
        } else if (!this.state.pageLoadingComplete)
        {
            content = <DefaultLoadingHandler loadingLabel={ this.props.loadingLabel } />;
        }

        const wrapperClassNames = classNames(
            this.props.className, "page-wrapper", {
                "centering": this.state.pageCenteringState,
                "horizontal-centering": this.state.pageHorizontalCenteringState
            }
        );

        // Include one of fade-(in|out) class names to show fade animation
        const className = classNames(this.props.contentClassName, {
            "fade-out": this.props.fadeOut ? this.props.fadeOut : this.state.fadeOut,
            "fade-in": !this.state.fadeOut
        });

        return (
            <div className={ wrapperClassNames } ref={ this.pageWrapper }>
                <div className={ classNames(className, "content-wrapper") } ref={ this.contentWrapper }>
                    { content }
                </div>
            </div>
        );
    }
}

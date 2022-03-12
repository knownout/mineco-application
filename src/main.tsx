import React, { PureComponent } from "react";
import { render } from "react-dom";

import Helmet from "react-helmet";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Button from "./common/button";
import Loading from "./common/loading";
import "./main.scss";

const ControlPanel = React.lazy(() => import("./control-panel"));
const Application = React.lazy(() => import("./application/application"));

class ErrorBoundary extends PureComponent<{ children: any }, { hasError: boolean }>
{
    public readonly state: { hasError: boolean } = {
        hasError: false
    };

    public componentDidCatch (error: Error, errorInfo: React.ErrorInfo) {
        [ error, errorInfo ].forEach(console.warn);
        this.setState({ hasError: true });
    }

    public render () {
        if (this.state.hasError) return <div className="ui container grid center cs-loading-gray padding-20 scroll-y">
            <div className="error-form ui flex column limit-380">
                <span className="ui title margin optimize">Ошибка при отображении страницы</span>
                <span className="ui sub-title margin optimize">
                    Во время динамического обновления страницы произошла критическая ошибка, попробуйте
                    обновить страницу. Если после обновления ошибка не пропала, обратитесь к администратору
                </span>
                <Link to="/" className="ui clean margin optimize">
                    <Button icon="bi bi-house-fill" className="w-fit">На главную</Button>
                </Link>
            </div>
        </div>;

        else return this.props.children;
    }
}

/**
 * Root component
 * @inner
 */
class Main extends PureComponent
{
    render (): React.ReactNode {
        return <React.Fragment>
            <Helmet>
                <meta name="description"
                      content="Официальная информационная площадка Министерства сельского хозяйства и природных ресурсов ПМР"
                />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="Министерство СХ и ПР" />
                <meta property="og:description"
                      content="Официальная информационная площадка Министерства сельского хозяйства и природных ресурсов ПМР" />

                <meta property="og:image:width" content="448" />
                <meta property="og:image:height" content="256" />
                <meta property="og:image"
                      content="/public/mineco-logo-448x252.png" />

                <title>Министерство СХ и ПР ПМР</title>
            </Helmet>

            <React.Suspense fallback={ <Loading display={ true } /> }>

                <Router>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/control-panel/*" element={ <ControlPanel /> } />
                            <Route path="/*" element={ <Application /> } />
                        </Routes>
                    </ErrorBoundary>
                </Router>
            </React.Suspense>
        </React.Fragment>;
    }
}

render(<Main />, document.querySelector("div#app-root"));

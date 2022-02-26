import React, { PureComponent } from "react";
import { render } from "react-dom";

import Helmet from "react-helmet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "./common/loading";
import "./main.scss";

const ControlPanel = React.lazy(() => import("./control-panel"));
const Application = React.lazy(() => import("./application/application"));

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
                    <Routes>
                        <Route path="/control-panel/*" element={ <ControlPanel /> } />
                        <Route path="/*" element={ <Application /> } />
                    </Routes>
                </Router>
            </React.Suspense>
        </React.Fragment>;
    }
}

render(<Main />, document.querySelector("div#app-root"));

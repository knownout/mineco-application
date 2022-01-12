import React, { PureComponent } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Helmet from "react-helmet";

import ControlPanel from "./control-panel";

import "./main.scss";
import MaterialsRenderer from "./application/dev/materials-renderer";

/**
 * Root component
 * @inner
 */
class Main extends PureComponent {
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

                <title>Министерство СХ и ПР</title>
            </Helmet>
            <Router>
                <Routes>
                    <Route path="/" element={ <div className="ui container grid center w-100 h-100">В разработке</div> } />
                    <Route path="/dev/render/:identifier" element={ <MaterialsRenderer /> } />
                    <Route path="/control-panel/*" element={ <ControlPanel /> } />
                </Routes>
            </Router>
        </React.Fragment>;
    }
}

render(<Main />, document.querySelector("div#app-root"));

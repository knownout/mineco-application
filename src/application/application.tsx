import React from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import TitlePageRenderer from "./page-renderers/title-page-renderer";

/**
 * Application root component
 * @inner
 */
export default class Application extends React.PureComponent {
    render () {
        return <React.Fragment>
            <Helmet>
                <meta name="description"
                      content="Министерство сельского хозяйства и природных ресурсов"
                />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />
                <title>Панель управления МСХ и ПР</title>
                <link rel="icon" href="/public/favicon.ico" />
            </Helmet>

            <React.StrictMode>
                <Routes>
                    <Route path="/" element={ <TitlePageRenderer /> } />
                    <Route path="/dev" element={ <div>Dev</div> } />
                </Routes>
            </React.StrictMode>
        </React.Fragment>;
    }
}
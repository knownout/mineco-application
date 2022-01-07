import React from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import AuthForm from "./components/auth-form";
import RootForm from "./components/root-form";

/**
 * Control panel root component
 * @inner
 */
export default class ControlPanel extends React.PureComponent {
    render () {
        return <React.Fragment>
            <Helmet>
                <meta name="description"
                      content="Панель управления Министерства СХ и ПР"
                />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />
                <title>Панель управления МСХ и ПР</title>
                <link rel="icon" href="/public/cms-favicon.ico" />
            </Helmet>

            <React.StrictMode>
                <Routes>
                    <Route path="/" element={ <RootForm /> } />
                    <Route path="/auth" element={ <AuthForm /> } />
                </Routes>
            </React.StrictMode>
        </React.Fragment>;
    }
}
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import TitlePageRenderer from "./page-renderers/title-page-renderer";
import { ItemObject } from "../control-panel/components/root-form/item-object-renderers/renderers";
import { makeRoute, serverRoutesList } from "../lib/routes-list";
import { Response, VariableOptions } from "../lib/types/requests";
import MakeFormData from "../lib/make-form-data";
import Loading from "../common/loading";

interface IApplicationState {
    navigationMenu: { [key: string]: { [key: string]: string } };

    loading: boolean;
    error?: any;
}

/**
 * Application root component
 * @inner
 */
export default class Application extends React.PureComponent<{}, IApplicationState> {
    public readonly state: IApplicationState = {
        navigationMenu: {},
        loading: true
    };

    async componentDidMount () {
        async function require<T = ItemObject.Material[]> (path: string, options: { [key: string]: string }) {
            return await fetch(makeRoute(path), new MakeFormData(options).fetchObject)
                .then(response => response.json()) as Response<T>;
        }

        // Get navigation menu items
        const navigationMenuResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Панель навигации" });

        if (!navigationMenuResponse.responseContent) return this.setState({
            error: navigationMenuResponse.errorCodes?.join(" ")
        });

        try {
            this.setState({
                navigationMenu: JSON.parse(navigationMenuResponse.responseContent[0].value as string),
                loading: false
            });
        } catch {
            this.setState({ error: "invalid-variable" });
        }
    }

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
                <Loading display={ this.state.loading } error={ this.state.error } />
                <Routes>
                    <Route path="/" element={ <TitlePageRenderer navigationMenu={ this.state.navigationMenu } /> } />
                    <Route path="/dev" element={ <div>Dev</div> } />
                </Routes>
            </React.StrictMode>
        </React.Fragment>;
    }
}
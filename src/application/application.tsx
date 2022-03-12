import React from "react";

import { Helmet } from "react-helmet";

import Loading from "../common/loading";

import { ItemObject } from "../control-panel/components/root-form/item-object-renderers/renderers";

import { makeRoute, serverRoutesList } from "../lib/routes-list";
import { Response, VariableOptions } from "../lib/types/requests";
import ApplicationBuilder from "./application-builder";
import ApplicationRouter from "./renderers/application-router";

/**
 * Interface for application variables storage
 * Can contain only values fetched from /app/variables/
 */
export interface VariablesStorage<Obj = { [key: string]: string }>
{
    importantData: string[];
    websiteTitle: string;

    socialData: Obj[];
    usefulLinks: Obj;

    extraButtons: { [key: string]: [ string | null, string, string ] };
    contactData: string;

    navigationPanel: { [key: string]: Obj };
}

/**
 * Container for both of variables and material storages
 */
export interface ApplicationContextStorage
{
    variablesData?: Partial<VariablesStorage>;

    pinnedMaterial?: ItemObject.Material,
    materialsList?: ItemObject.Material[]
}

interface ApplicationState
{
    loading: boolean;
    error?: any;

    variablesData?: Partial<VariablesStorage>;
}

/** This context contain both of variables and materials storages */
export const ApplicationContext = React.createContext<ApplicationContextStorage>({});

/**
 * Root component of the application (through Main)
 */
export default class Application extends React.PureComponent<{}, ApplicationState>
{
    public readonly state: ApplicationState = { loading: true };

    /**
     * Shortcut for fetching data from server
     * @param path data processor path
     * @param formData request content
     * @internal
     */
    public static genericFetchFunction<T = ItemObject.Variable[]> (path: string, formData: any): Promise<Response<T>> {
        return fetch(makeRoute(path), formData)
            .then(response => response.json()).catch(() => {
                try {
                    (this as any).setState({ error: "fetch-error" });
                } catch {
                }
            }) as Promise<Response<T>>;
    }

    async componentDidMount () {
        const genericFetchFunction = Application.genericFetchFunction.bind(this);

        // List of all available variables
        const variables = await genericFetchFunction(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "" });

        // If no variables data, return error
        if (!variables.responseContent) return this.setState({ error: "invalid-variable" });

        const builder = new ApplicationBuilder();

        try {
            this.setState({
                variablesData: builder.getApplicationVariables(variables.responseContent)
            }, () => setTimeout(() => this.setState({ loading: false }), 100));
        } catch {
            return this.setState({ error: "combination-error" });
        }
    }

    render () {
        return <React.Fragment>
            <Helmet>
                <meta name="description" content="Министерство сельского хозяйства и природных ресурсов" />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />
                <title>{ this.state.variablesData?.websiteTitle }</title>
                <link rel="icon" href="/public/favicon.ico" />
            </Helmet>

            <React.StrictMode>
                <Loading display={ this.state.loading } error={ this.state.error } />

                <ApplicationContext.Provider value={ { variablesData: this.state.variablesData } }>
                    { !this.state.loading && !this.state.error && <ApplicationRouter /> }
                </ApplicationContext.Provider>
            </React.StrictMode>
        </React.Fragment>;
    }
}

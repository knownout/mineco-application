import React from "react";
import { Helmet } from "react-helmet";
import Loading from "../common/loading";
import { Route, Routes } from "react-router-dom";

interface ApplicationState {
    loading: boolean;
    error?: any;
}

interface ApplicationProps {

}

export default class Application extends React.PureComponent<ApplicationProps, ApplicationState> {
    public readonly state: ApplicationState = {
        loading: true
    };

    componentDidMount () {

    }

    render () {
        return <React.Fragment>
            <Helmet>
                <meta name="description"
                      content="Министерство сельского хозяйства и природных ресурсов"
                />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />
                <title>{ null }</title>
                <link rel="icon" href="/public/favicon.ico" />
            </Helmet>

            <React.StrictMode>
                <Loading display={ this.state.loading } error={ this.state.error } />
                <Routes>
                    <Route path="/" element={ <div>Title page</div> } />
                    <Route path="/dev" element={ <div>Dev</div> } />
                </Routes>
            </React.StrictMode>
        </React.Fragment>;
    }
}
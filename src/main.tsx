import React, { PureComponent } from "react";
import Helmet from "react-helmet";

import { render } from "react-dom";

import "normalize.css";
import "./main.scss";
import PageWrapper from "./shared/page-wrapper";

namespace Main
{
    export interface Properties
    {

    }

    export interface State
    {

    }
}

class Main extends PureComponent<Main.Properties, Main.State>
{
    state: Main.State = {};

    render (): React.ReactNode
    {
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

            <PageWrapper className="root-wrapper">
                Web application entry point
            </PageWrapper>
        </React.Fragment>;
    }
}

render(<Main />, document.querySelector("div#app-root"));

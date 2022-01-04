import React, { useEffect } from "react";

import Loading from "../../../common/loading";

import verifyAuthentication from "../../cms-lib/verify-authentication";
import { appRoutesList } from "../../../lib/routes-list";

import "./root-form.scss";

/**
 * Control panel root component (accessible after authentication)
 * @constructor
 */
export default function RootForm () {
    const [ formLoading, setFormLoading ] = React.useState(true);
    const [ fromLoadingError, setFormLoadingError ] = React.useState<string>();

    useEffect(() => {
        verifyAuthentication().then(result => {
            if (!result) window.location.href = appRoutesList.auth;
            else setFormLoading(false);
        }).catch(setFormLoadingError);
    }, [ "verification" ]);

    return <div className="root-form ui container bg-gradient">
        <Loading display={ formLoading } error={ fromLoadingError } />
        <div className="ui content-wrapper color-white padding flex column limit-380">
            <span className="ui title margin optimize">CMS root form</span>
            <span className="ui sub-title">
                Если вы видите данную форму, значит авторизация успешно пройдена и
                получен доступ к панели управления, но она еще в разработке :(
            </span>
        </div>
    </div>;
}
import React from "react";
import CacheController, { CacheKeys } from "./shared/cache-controller";

export interface IAccountData
{
    name: string;
    password: string;
    login: string;
}

export interface IAccountContext
{
    accountData?: IAccountData,
    setAccountData?: (accountData: IAccountData) => void
}

export const AccountContext = React.createContext<IAccountContext>({});

const cacheController = new CacheController(window.localStorage);
export const AccountProvider: React.FC = ({ children }) =>
{
    const [ accountData, setAccountData ] = React.useState<IAccountData>();
    const updateAccountData = (accountData: IAccountData) =>
    {
        cacheController.cacheContent(CacheKeys.accountData, accountData);
        setAccountData(accountData);
    };

    return <AccountContext.Provider value={ { setAccountData: updateAccountData, accountData } }>
        { children }
    </AccountContext.Provider>;
};

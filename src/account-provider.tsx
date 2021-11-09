import React from "react";

export interface IAccountData
{
    name?: string;
    password?: string;
    login?: string;
}

export interface IAccountContext
{
    accountData?: IAccountData,
    setAccountData?: (accountData: IAccountData) => void
}

export const AccountContext = React.createContext<IAccountContext>({});

export const AccountProvider: React.FC = ({ children }) =>
{
    const [ accountData, setAccountData ] = React.useState<IAccountData>({});

    return <AccountContext.Provider value={ { setAccountData, accountData } }>
        { children }
    </AccountContext.Provider>;
};

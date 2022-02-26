import React from "react";
import "./footer.scss";
import { SocialDataRenderer } from "../header/header";
import { ApplicationContext } from "../application";
import ReactMarkdown from "react-markdown";
import remarkConfig from "../renderers/remark-config";

export default function Footer () {
    const context = React.useContext(ApplicationContext);
    const variables = context.variablesData;

    return <footer className="footer-component ui w-100">
        <div className="left-container ui limit-320 flex column">
            { variables?.websiteTitle &&
                <span className="footer-title ui upper fw-700">{ variables.websiteTitle }</span> }
            { variables?.socialData && <SocialDataRenderer socialData={ variables.socialData } /> }
        </div>
        <div className="right-container ui margin-left-auto">
            <div className="contact-data ui flex column">
                { variables?.contactData &&
                    <ReactMarkdown remarkPlugins={ remarkConfig } children={ variables.contactData } /> }
            </div>
            <img src="/public/qr-code-contact.jpg" alt="Контактные данные Министерства" className="qr-code-contact" />
        </div>
    </footer>;
};
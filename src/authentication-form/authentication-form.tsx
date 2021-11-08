import React from "react";
import "./authentication-form.scss";
import TextInput from "../shared/text-input/text-input";

export default function AuthenticationForm () {
    return <div className="cms-authentication-form">
        <span className="form-title">Вход в панель управления</span>
        <div className="form-content-wrapper">
            <TextInput placeholder="Имя пользователя" icon={ <i className="bi bi-person-badge" /> } />
            <TextInput placeholder="Пароль" type="password" icon={ <i className="bi bi-key" /> } />
        </div>
        <div className="form-buttons-holder">
            <button>Войти</button>
            <button className="simple">На главную</button>
        </div>
    </div>;
}
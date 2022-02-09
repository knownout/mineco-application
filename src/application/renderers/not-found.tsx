import React from "react";
import { Link } from "react-router-dom";
import Button from "../../common/button";
import Loading from "../../common/loading";

export default function NotFoundPage () {
    const [ loading, setLoading ] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => setLoading(false), 100);
    }, []);

    return <div className="not-found ui container grid center cs-loading-gray">
        <Loading display={ loading } />
        <div className="error-form ui flex column limit-380">
            <span className="ui title margin optimize">404 Страница не найдена</span>
            <span className="ui sub-title margin optimize">
                        Проверьте, правильно введена ссылка или попробуйте обновить страницу через некоторое время.
                        Если Вы уверены в том, что тут что-то должно быть, обратитесь к администратору
                    </span>
            <Link to="/" className="ui clean margin optimize">
                <Button icon="bi bi-house-fill" className="w-fit">На главную</Button>
            </Link>
        </div>
    </div>;
}
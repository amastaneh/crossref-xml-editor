import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";


export default function PageLayout() {
    const [context, setContext] = React.useState(null);

    return <Fragment>
        <header className="container">
            <div className="row text-center mt-5 pt-5">
                <h1>Crossref XML Editor</h1>
                <p>This project created for extracting articles from Crossref Issue XML file.</p>
            </div>
        </header>
        <main className="container my-5">
            <Outlet context={[context, setContext]} />
        </main>
        <footer className="container my-5">
            <div className="row text-center text-muted">
                <small className="mt-5">©{new Date().getFullYear()} - v{require('./../../package.json')?.version ?? 0.0}</small>
            </div>
        </footer>
    </Fragment>
}

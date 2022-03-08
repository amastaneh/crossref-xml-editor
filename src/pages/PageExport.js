import React, { Fragment } from "react";
//import { useOutletContext } from "react-router-dom";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import xml2js from 'xml2js';

export default function PageExport() {
    //const [context, setContext] = useOutletContext({});
    const [disable, setDisable] = React.useState(false);
    const [selectedArticleIndex, setSelectedArticleIndex] = React.useState(-1);
    const [dataset, setDataset] = React.useState(null);


    function handleSelectedIssue(e) {
        e.preventDefault();
        setDisable(true);
        try {
            const fileSelected = e.target.files[0]
            console.log("1- fileSelected", fileSelected);

            const fileSelectedObject = new FileReader();
            fileSelectedObject.readAsText(fileSelected);
            console.log("2- fileSelectedObject", fileSelectedObject);

            fileSelectedObject.onloadend = evt => {
                const xmlString = evt.target.result;
                console.log("3- xmlString", xmlString);

                new xml2js.Parser()
                    .parseStringPromise(xmlString)
                    .then(function (xmlIssue) {
                        console.log("4- xmlIssue", xmlIssue);

                        const xmlArticles = xmlIssue.doi_batch.body[0].journal
                        console.log("5- xmlArticles", xmlArticles);
                        if ((xmlArticles?.length ?? 0) < 1) throw new Error("No articles found in XML");

                        // Creating...
                        const articles = xmlArticles?.map((article, articleIndex) => {
                            const articleNumber = ("0000" + (articleIndex + 1)).slice(-4);
                            const articleTitle = `${articleNumber} - ${article.journal_article[0].titles[0].title[0]}`;
                            const articleFileName = `${articleNumber}-${article.journal_article[0].titles[0].title[0]?.toLowerCase()?.replace(/\s/g, "-")}.xml`;
                            return {
                                index: articleIndex,
                                title: articleTitle,
                                filename: articleFileName,
                                article,
                            }
                        })
                        console.log("6- articles", articles);

                        // Save to recat state
                        setDataset({ xmlIssue, articles });
                    })
            }
        }
        catch (ex) {
            alert("There is some unexpected error. Please try again! or read details from console.");
            console.log("AMA Exception: ", ex);
        }
        setDisable(false);
    }

    function handleExport(event) {
        event.preventDefault();
        if (selectedArticleIndex < 0) return;
        setDisable(true);

        try {
            // Find selected article
            const selectedArticle = dataset?.articles?.[selectedArticleIndex];
            console.log("1- Selected Article", selectedArticle);

            // Create Issue
            let xmlIssue2 = dataset?.xmlIssue
            xmlIssue2.doi_batch.body[0].journal = selectedArticle.article
            console.log("2- New Issue", xmlIssue2);

            // Create XML
            let xmlContent = new xml2js.Builder().buildObject(xmlIssue2)
            console.log("3- New Issue", xmlContent);

            // Export XML
            const url = window.URL.createObjectURL(new Blob([xmlContent], { type: "text/xml" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", selectedArticle.filename);
            document.body.appendChild(link);
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        }
        catch (ex) {
            alert("There is some unexpected error. Please try again! or read details in console.");
            console.log("AMA Exception: ", ex);
        }
        setDisable(false);
    }

    return (
        <Fragment>
            <section className="row">
                <div className="col-12">
                    <div className="text-center fs-4 text-secondary">
                    </div>
                </div>
            </section>
            <form className="row g-3 needs-validation" onSubmit={handleExport} noValidate>
                <div className="col-12 col-md-6 offset-md-3 mb-3">
                    <label htmlFor="xmlFile" className="form-label">Crossref Issue XML File:</label>
                    <input type="file" id="xmlFile" className="form-control" onChange={handleSelectedIssue} />
                </div>
                <div className="col-12 col-md-6 offset-md-3 mb-3">
                    <label htmlFor="xmlFile" className="form-label">Crossref Issue XML File:</label>
                    <select className="form-select" onChange={(e) => setSelectedArticleIndex(e.currentTarget.value)}>
                        <option value={-1}>-- Please select an article --</option>
                        {dataset?.articles.map(article => <option key={article.index} value={article.index}>{article.title}</option>)}
                    </select>
                </div>
                <div className="col-12 text-center">
                    <button
                        className={`btn text-uppercase btn-${(disable || selectedArticleIndex < 0) ? 'secondary' : 'success'}`}
                        type="submit"
                        disabled={disable || selectedArticleIndex < 0}>
                        <span>Export</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );

}

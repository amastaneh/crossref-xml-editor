import React, { Fragment } from "react";
//import { useOutletContext } from "react-router-dom";
import { XMLParser, XMLBuilder } from "fast-xml-parser";


export default function PageExport() {
    //const [context, setContext] = useOutletContext({});
    const [disable, setDisable] = React.useState(false);
    const [selectedArticleIndex, setSelectedArticleIndex] = React.useState(null);
    const [dataset, setDataset] = React.useState(null);


    function handleSelectedIssue(e) {
        e.preventDefault();
        setDisable(true);
        try {
            const selectedIssue = e.target.files[0]
            const fileReader = new FileReader();
            console.log("selectedIssue", selectedIssue);

            fileReader.readAsText(selectedIssue);
            console.log("fileReader", fileReader);

            fileReader.onloadend = evt => {
                const readerData = evt.target.result;
                const xmlIssue = new XMLParser().parse(readerData);
                console.log("xmlIssue", xmlIssue);

                const xmlArticles = xmlIssue.doi_batch.body.journal
                console.log("xmlArticles", xmlArticles);
                if ((xmlArticles?.length ?? 0) < 1) throw new Error("No articles found in XML");

                // Creating...
                const articles = xmlArticles?.map((article, articleIndex) => {
                    const articleNumber = ("0000" + (articleIndex + 1)).slice(-4);
                    const articleTitle = `${articleNumber} - ${article.journal_article.titles.title}`;
                    const articleFileName = `${articleNumber}-${article.journal_article.titles.title?.toLowerCase()?.replace(/\s/g, "-")}.xml`;
                    return {
                        index: articleIndex,
                        title: articleTitle,
                        filename: articleFileName,
                        article,
                    }
                })
                console.log("articles", articles);

                // Save to recat state
                setDataset({ xmlIssue, articles });
            }
        }
        catch (ex) {
            alert("There is some unexpected error. Please try again! or read details in console.");
            console.log("AMA Exception: ", ex);
        }
        setDisable(false);
    }

    function handleExport(event) {
        event.preventDefault();
        setDisable(true);

        try {
            // Find selected article
            const selectedArticle = dataset?.articles?.[selectedArticleIndex];
            console.log("Selected Article", selectedArticle);

            // Create XML
            let xmlIssue = dataset?.xmlIssue
            xmlIssue.doi_batch.body.journal = selectedArticle.article
            let xmlContent = new XMLBuilder({
                format: true,
            }).build(xmlIssue);
            console.log("Selecetd Article XML", xmlIssue);

            // Correction
            xmlContent = xmlContent.replace('<?xml></?xml>', '<?xml version="1.0" encoding="UTF-8"?>');
            xmlContent = xmlContent.replace('<doi_batch>', '<doi_batch xmlns="http://www.crossref.org/schema/4.3.6" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1" xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" version="4.3.6" xsi:schemaLocation="http://www.crossref.org/schema/4.3.6 http://www.crossref.org/schema/deposit/crossref4.3.6.xsd">');
            console.log("Selecetd Article XML", xmlContent);

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
                        {dataset?.articles.map(article => <option key={article.index} value={article.index}>{article.title}</option>)}
                    </select>
                </div>
                <div className="col-12 text-center">
                    <button
                        className={`btn text-uppercase btn-${disable ? 'secondary' : 'success'}`}
                        type="submit"
                        disabled={disable}>
                        <span>Export</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );

}

import React from "react";

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import Avatar from "@material-ui/core/Avatar";
import Close from '@material-ui/icons/Close';

import "./Pdf.scss";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



interface Props {
    pdfBuffer: any;
    closeHandler: any;
}

const Pdf: React.FC<Props> = ({pdfBuffer, closeHandler}) => {
    return(
        <div className="web-viewer__container"> 
            <Avatar className="close-pdf" onClick={() => closeHandler()}>
                <Close  className="svg"/>
            </Avatar>   
            <Document
            file={pdfBuffer}
            onLoadError={console.error}
            >
                <Page pageNumber={1} />
            </Document>
        </div>
    )
};

export default Pdf
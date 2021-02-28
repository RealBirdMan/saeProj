import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";

import Typography from "@material-ui/core/Typography";
import Download from '@material-ui/icons/CloudDownload';
import Avatar from '@material-ui/core/Avatar';

import axios from "../../../util/config/axios-instance"
import { useHttpClient } from "../../../util/hooks/http-hook";
import Modal from "../../../shared/Modals/Modal"

import "./billOverview.scss"

interface Props {

}

const BillOverview: React.FC<Props> = props => {
    const { httpState, sendRequest, clearError } = useHttpClient();
    const [bills, setBills] = useState<any[]>([]);

    useEffect(() => {
       (async function(){
        const {data} = await sendRequest("api/dashboard/bills");
        setBills(data);
       })()
    }, [sendRequest])

    const downloadHandler = async(billId: string) => {
        axios(`/api/dashboard/bill/${billId}`, {
            method: "GET",
            responseType: "blob"
        }).then(response => {
            //Create a Blob from the PDF Stream
                const file = new Blob(
                  [response.data], 
                  {type: 'application/pdf'});
            //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
                window.open(fileURL);
            })
            .catch(error => {
                console.log(error);
            });
    }

  
 
        function ModalContent(yearModalDate:string) {
            const bill = bills.map(bill => {
                const date = bill?.createdAt.split("T")[0];
                const [year, month, day] = date.split("-");
                if(yearModalDate === year){
                    return(
                        <Modal key={bill.billNr} className="modal-bill__content">
                            <div>
                                <Typography variant="h3">Rechnungs Firma: {bill.companyName}</Typography>
                                <Typography>Rechnungs Datum: {`${day}.${month}.${year}`}</Typography>
                                <Typography>Rechnungs Nummer: {bill.billNr}</Typography>
                            </div>
                            <Avatar className="download" onClick={() => {downloadHandler(bill.billNr)}}>
                                 <Download  className="svg"/>
                            </Avatar>
                            
                        </Modal>
                    )
                } else {
                    return null
                }
            })
            return bill;
        }
        
        function YearModal(content: any) {
         
            const years = bills.map(bill => {
                const date = bill?.createdAt.split("T")[0];
                const [year] = date.split("-"); 
                return year
             })
            const uniqueYear: string[] = years.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
            const yearModal = uniqueYear.map(year => (
                <Modal key={year} className="modal-bill__container">
                    <Typography variant="h2">Jahr: {year}</Typography>
                    {content(year)}
                </Modal>
            ));
            return yearModal;
          }
          

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{x: "-100vw"}}
            transition={{ease: "easeInOut"}}
        >
            <Modal>
                <Typography component="h1" variant="h2" color="textPrimary">Ihre Rechnungsübersicht</Typography>
                <hr/>
                {YearModal(ModalContent)}
            </Modal>
        </motion.div>
    
    )
};

export default BillOverview
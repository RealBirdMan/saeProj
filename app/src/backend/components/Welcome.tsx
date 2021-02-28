import React from "react";
import {motion} from "framer-motion";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button"
import {Link} from "react-router-dom"


import Modal from "../../shared/Modals/Modal"
import WarningModal from "../../shared/Modals/WarningModal"

interface Props {
    userStatus: number | null
}

const Welcome: React.FC<Props> = props => {
    return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{x: "-100vw"}}
                transition={{ease: "easeInOut"}}
            >
                <Modal>
                    <Typography component="h1" variant="h2" color="textPrimary">Herzlich Willkommen</Typography>
                    <hr/>

                    {props.userStatus === 0 && (
                        <WarningModal>
                        <Typography color="textPrimary">Herzlich Willkommen in ihren Dashboard. Bitte beachten sie, dass wir noch einige Informationen von ihnen benötigen, damit sie Bill Tracker im vollen Umfang nutzen können.Entweder richten sie ihr Profil über die Seitenleiste / Profile ein, oder sie klicken einfach den Button unterhalb.<br/> mit freundlichen Grüßen<br/> ihr Bill Tracker Team</Typography>
                        <Link to="/dashboard/profile">
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{margin: "10px 0"}}
                                >
                                Profile bearbeiten
                        </Button>
                        </Link>
                    </WarningModal>
                    )}

                    <Typography variant="h3"  color="textPrimary">Ihr Profile:</Typography>
                    <Typography color="textPrimary">Unter dem Menüpunkt Profile in der Seitenleiste können sie jederzeit ihre Profile Informationen bearbeiten. Ihre Information werden benötigt um aus diesen später automatisch Rechnungen generieren zu können.</Typography>
                    <hr/>
                    <Typography variant="h3"  color="textPrimary">Firmen verwalten:</Typography>
                    <Typography color="textPrimary">Unter dem Menüpunkt Firmen verwalten ist es ihnen möglich eine Rechnungsadresse einer Firma anzulegen, oder diese zu verwalten. Sobald sie ihr Profile vollständig ausgefüllt haben können sie eine erste Firma anlegen. Diese steht ihnen später im Menüpunkt Rechnung schreiben zur verfügung um sich eine Automatische Rechnung generieren zu lassen.</Typography>
                    <hr/>
                    <Typography variant="h3"  color="textPrimary">Rechnung screiben:</Typography>
                    <Typography color="textPrimary">Über den Menüpunkt Rechnung schreiben, wird es ihnen ermöglicht eine neue Rechnung anzulegen. Dazu müssen sie einfach nur die gewünschte Firma auswählen und ihre erbrachten Leistungen angeben. Die Rechnung kann später in der Rechnungs Übersicht wiedergefunden werden.</Typography>
                    <hr/>
                    <Typography variant="h3"  color="textPrimary">Rechnungs Übersicht:</Typography>
                    <Typography>Im Menüpunkt Rechnungsübersicht ist es ihnen möglich ihre bisherigen Rechnungen einzusehen. Diese können entweder einzeln, nach Firma, oder Jahr heruntergeladen werden. Ebenso können sie eine Rechnung als bezahlt markieren so sind sie immer Up to Date dank der Bill Tracker app</Typography>
                </Modal>
            </motion.div>
        
    )
};

export default Welcome
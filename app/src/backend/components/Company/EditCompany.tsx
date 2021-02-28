import React, { useRef,  useReducer} from "react";
import {useHistory} from "react-router-dom"

import {useHttpClient} from "../../../util/hooks/http-hook"
import {useLoadOnDemand} from "../../../util/hooks/loadOnDemand-hook"
import Modal from "../../../shared/Modals/Modal"
import PopupModal from "../../../shared/Modals/PopupModal"
import CompanyForm from "./CreateCompanyForm"
import {TYPE, companyModalReducer} from "../../../util/reducers/companyModal-reducer"

import { Typography, Avatar } from "@material-ui/core";
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';


interface Props{}



const EditCompany: React.FC<Props> = props => {

 const ref = useRef<any>();
 const history = useHistory();
 const [demandData] = useLoadOnDemand(ref, "/api/dashboard/companies");
 const {sendRequest} = useHttpClient();

 const [modalStates, dispatchmodalState] = useReducer(companyModalReducer, {
     id: null,
     deleteModalState: false,
     editModalState: false,
     modalData: null
 })



 const onDeleteHandler = async (id: string) => {
      await sendRequest(`/api/dashboard/company/${id}`, "DELETE");
      dispatchmodalState({type: TYPE.RESET_MODAL_STATE});
      history.push({
          pathname: "/dashboard/company",
          state: { detail: 'update' }
      });
 }

 const deleteIcon = <Avatar className="avatar danger"><Delete  className="svg"/></Avatar>
 const editIcon = <Avatar className="avatar primary"><Edit  className="svg"/></Avatar>

 const demandModal = demandData.map((comp: any) => (
        <div ref={ref} key={comp.id}>
            <Modal >
                <div className="modal__content">
                   <Typography variant="h2">{comp.companyName}</Typography>
                   <div className="modal__icons">
                       <Edit style={{margin: "0 15px"}} onClick={() => dispatchmodalState({type: TYPE.SET_Edit_MODAL_STATE, id: comp.id, modalData: {...comp}})}/>
                       <Delete onClick={() => dispatchmodalState({type: TYPE.SET_DELETE_MODAL_STATE, id: comp.id})}/>
                   </div>
                </div>
   
            </Modal>
        </div>
    ))


    return (
        <div>
            {demandModal}

            {modalStates.deleteModalState && (
                <PopupModal 
                heading="Firma löschen?" 
                btnSuccessText="Löschen" 
                icon={deleteIcon} 
                onClick={() => onDeleteHandler(modalStates.id)}
                return={() => dispatchmodalState({type: TYPE.RESET_MODAL_STATE})}
                >
                    Wollen Sie diese Firma wirklich löschen? Diese geht unwiederbringlich verloren
                </PopupModal>
            )}

            {modalStates.editModalState && (
                <PopupModal 
                heading="Firma bearbeiten" 
                btnSuccessText="Update" 
                icon={editIcon} 
                return={() => dispatchmodalState({type: TYPE.RESET_MODAL_STATE})}
                >
                    <CompanyForm initialFormState={modalStates.modalData} requestUrl={`/api/dashboard/create-company/${modalStates.id}`} method="PATCH"/>
                </PopupModal>
            )}
        </div>
        )
};

export default EditCompany
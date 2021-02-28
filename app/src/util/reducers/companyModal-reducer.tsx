export enum TYPE {
    SET_DELETE_MODAL_STATE,
    SET_Edit_MODAL_STATE,
    RESET_MODAL_STATE
}


export const companyModalReducer = (state: any, action: any) => {
    switch(action.type){
        case TYPE.SET_DELETE_MODAL_STATE:
            return {id: action.id, deleteModalState: true, editModalState: false}
        case TYPE.SET_Edit_MODAL_STATE:
            return {id: action.id, deleteModalState: false, editModalState: true , modalData: action.modalData}
        case TYPE.RESET_MODAL_STATE:
            return {id: null, deleteModalState: false, editModalState: false, modalData: null}
        default:
            throw new Error("An unknown Error occured");        
    }
}  
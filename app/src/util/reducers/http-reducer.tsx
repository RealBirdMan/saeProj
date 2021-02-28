
export enum httpActionType {
    SEND,
    RESPONSE,
    ERROR,
    RESET
}


export const httpReducer = (httpState: object, action: any) => {
    switch(action.type){
        case httpActionType.SEND:
            return {...httpState, loading: true}
        case httpActionType.RESPONSE:
            return {...httpState, loading: false, success: true}
        case httpActionType.ERROR:  
            return {error: action.error, loading: false, success: false}
        case httpActionType.RESET: 
            return {error: null, loading: false, success: false}
        default:
            throw new Error("An unknown Error occured");        
    }
}
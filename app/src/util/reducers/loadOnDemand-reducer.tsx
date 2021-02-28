export enum TYPE {
    SET_DEMANDDATA,
    UPDATE_DEMANDDATA,
    SET_INTERSECTING,
}


export const loadOnDemandReducer = (state: any, action: any) => {
    switch(action.type){
        case TYPE.SET_DEMANDDATA:
            return {...state, idx: action.data.length, demandData: action.data}
        case TYPE.SET_INTERSECTING:
            return {...state, isIntersecting: true}
        case TYPE.UPDATE_DEMANDDATA:
            return {idx: state.idx + action.data.length, demandData: state.demandData.concat(action.data), isIntersecting: false}    
        default:
            throw new Error("An unknown Error occured");        
    }
}  
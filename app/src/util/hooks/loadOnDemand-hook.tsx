import  {useEffect,useReducer} from "react";
import {TYPE, loadOnDemandReducer} from "../reducers/loadOnDemand-reducer"
import {useHttpClient} from "./http-hook"


export const useLoadOnDemand = (reference: React.MutableRefObject<any>, url: string) => { 
    const {httpState, clearError, sendRequest} = useHttpClient();
    const [state, dispatch] = useReducer(loadOnDemandReducer, {idx: 0, demandData: [], isIntersecting: false});
    const {idx} = state;
    const {isIntersecting} = state;

    useEffect(() => {
        (async function () {
            const {data} = await sendRequest(`${url}/0`, "GET");  
            dispatch({type: TYPE.SET_DEMANDDATA, data})
        })()
    }, [sendRequest, url])
  
    
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting){
                dispatch({type: TYPE.SET_INTERSECTING})
                observer.unobserve(reference.current)
            }
        }, {threshold: 1})

        if(reference.current){
            observer.observe(reference.current)
        }

    }, [idx, reference])

   useEffect(() => {
      if(isIntersecting){ 
       (async function () {
           const {data} = await sendRequest(`${url}/${idx}`, "GET");  
           dispatch({type: TYPE.UPDATE_DEMANDDATA, data})
       })()
      }
   }, [isIntersecting, sendRequest, idx, url])

      return [state.demandData, httpState, clearError]
 }
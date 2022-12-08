import {Action} from "./Calculator"

export default function Operator({operator,dispatch}){
    return(
        <button onClick={()=>dispatch({type:Action.CHOOSE_OPERATION,payload:{operator}})}>{operator}</button>
    )
}
import {Action} from "./Calculator"

export default function Button({digit,dispatch}){
    return(
        <button onClick={()=>dispatch({type:Action.ADD_DIGIT,payload:{digit}})}>{digit}</button>
    ) 
}
import {useEffect, useReducer, useState} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import  "./App.css"
import "./style.css"
import Button from "./Digitbutton";
import Operator from "./Operator";

export const Action = {
  ADD_DIGIT : "add-digit",
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : "clear",
  DELETE_DIGIT : "delete-digit",
  ANS : 'ans'
}


function output({ currentoperand, prevoperand, operation }) {
  const prev = parseFloat(prevoperand)
  const current = parseFloat(currentoperand)
  

  if (isNaN(prev) || isNaN(current)) return 0
  let computation = 0
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation
}


function reducer(state,{type,payload}){

  switch(type){
    case Action.ADD_DIGIT:
      
      if(state.overwrite===true){   
        return{
          ...state,
          overwrite : false,
          currentoperand : payload.digit
        }
       
      }
      
      if(payload.digit==="0" && state.currentoperand==='0') return state
      if(payload.digit==='.' && state.currentoperand.includes(".")) return state

      return{
        ...state,
        currentoperand : `${state.currentoperand || ''}${payload.digit}`
      }
      case Action.CLEAR:
        return {}
      case Action.CHOOSE_OPERATION:
        if(state.currentoperand==null && state.prevoperand==null){
          return state
        }

        if(state.display && state.display[state.display.length-1]){
          return{
            ...state,
            display : `${state.currentoperand}${payload.operator}`,
            operation : payload.operator,
            overwrite : true,
          }
        }

        if(state.currentoperand==null){
          return{
            ...state,
            operation : payload.operator
          }
        }
        if(state.prevoperand==null){
          return{
            ...state,
            operation : payload.operator,
            prevoperand : `${state.currentoperand}`,
            display : `${state.currentoperand}${payload.operator}`,
            overwrite : true
          }
        }
        //previous operand not null current operand not null
        if(state.overwrite===true){
            return{
                ...state,
                operation : payload.operator,
                display : `${state.display.slice(0,-1)}${payload.operator}`,
            }
        }
        else{
            return{
                ...state,
                currentoperand : output(state),
                operation : payload.operator,
                display : `${state.display}${state.currentoperand}${payload.operator}`,
                prevoperand : output(state),
                overwrite : true
                
            }
        }

      case Action.DELETE_DIGIT:
        if (state.overwrite) {
            return {
            ...state,
            overwrite: false,
            currentoperand: null,
            }
        }

        if (state.currentoperand == null) return state
        if (state.currentoperand.length === 1) {
          return { ...state, currentoperand: null }
        }
  
        return {
          ...state,
          currentoperand: state.currentoperand.slice(0, -1),
        }

      case Action.ANS:
        console.log(state.display)
        if (
            state.operation == null ||
            state.currentoperand == null ||
            state.prevoperand == null
          ) {
            return state
          }
          let size = state.display.length-1
          if(state.display[size]==payload){
           
            return{
              ...state,
              display : `${state.display.slice(0,-1)}${state.operation}${state.currentoperand}${payload}`,
              prevoperand : state.currentoperand,
              currentoperand : output(state)
            }
          }

          return {
            ...state,
            currentoperand : output(state),
            display : `${state.display}${state.currentoperand}${payload}`,
            prevoperand : output(state),
            overwrite : true,
            
          }

      case Action.CLEAR:
        return {}
      default:
        return {}

  }
}

export default function Calculator() {
   const [{ currentoperand, prevoperand, operation,display }, dispatch] = useReducer(reducer,{})
   const [isClicked,setisClicked] = useState(0)

   function event(){
    setisClicked((previousState)=>{
       return previousState+1;
    })
   }
    
   useEffect(() => {
    let div = document.getElementsByClassName("history")[0];
    let p1 = document.createElement('p')
    let p2 = document.createElement('p')

    if(display){
      console.log(display)
      p1.innerHTML = display
      div.appendChild(p1)
      p2.innerHTML = currentoperand
      div.appendChild(p2)
    }
  }, [isClicked]);

   return(
<div className="calculator-grid">

 <div className="operations">
    <div className="output">
    <div className="previous-operand">{display}</div>
    <div className="current-operand">{currentoperand}</div>
  </div>
  <button className="span-two" onClick={()=>dispatch({type:Action.CLEAR, payload: ""})}>AC</button>
  <button onClick={()=>dispatch({type:Action.DELETE_DIGIT})}>DEL</button>
  <Operator dispatch={dispatch} operator={'÷'}/>
  <Button dispatch={dispatch} digit={'1'}/>
  <Button dispatch={dispatch} digit={'2'}/>
  <Button dispatch={dispatch} digit={'3'}/>
  <Operator dispatch={dispatch} operator={'*'}/>
  <Button dispatch={dispatch} digit={'4'}/>
  <Button dispatch={dispatch} digit={'5'}/>
  <Button dispatch={dispatch} digit={'6'}/>
  <Operator dispatch={dispatch} operator={'+'}/>
  <Button dispatch={dispatch} digit={'7'}/>
  <Button dispatch={dispatch} digit={'8'}/>
  <Button dispatch={dispatch} digit={'9'}/>
  <Operator dispatch={dispatch} operator={'-'}/>
  <Button dispatch={dispatch} digit={'.'}/>
  <Button dispatch={dispatch} digit={'0'}/>
  <button className="span-two" onClick={()=>{dispatch({type:Action.ANS, payload:'='})
    event()}}>=</button>
 </div>

   <div className="history">
        <h2>History</h2>
    </div>
    
</div>
   )
}

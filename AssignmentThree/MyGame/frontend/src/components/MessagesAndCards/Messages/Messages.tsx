import { useState, useEffect } from "react";

function Messages(props:any) {

  const [turn, setTurn] = useState();
  const [valid, setValid] = useState();
  const [gameWon, setGameWon] = useState();

  useEffect(()=>{
    
      setTurn(props.messages.notTurn)
    
  })

  useEffect(()=>{
    
      setValid(props.messages.invalid)

      if(valid !== undefined )
      {
        console.log("set hogya hai");
        
      }
    
  })

  useEffect(()=>{
    
    setGameWon(props.messages.gameWon)
  
})

  return (
    <div className="right-side-container messages-container">
      <h1>Messages</h1>
      <div className="message-box">
        <div className="message-content-container">
          {turn !== undefined? 
        <h2>Not your turn</h2>
        :[]}
        {valid !== undefined? 
        <h2>In valid move please try again</h2>
        :[]}
        {gameWon!== undefined? 
        <h2>Game Won by {gameWon}!</h2>
        :[]}
        {gameWon!== undefined && gameWon === 1? 
        <h2>Game has already been won!</h2>
        :[]}
        </div>
        <div className="message-content-container">
          Game has started good luck
        </div>
      </div>
    </div>
  );
}
export default Messages;

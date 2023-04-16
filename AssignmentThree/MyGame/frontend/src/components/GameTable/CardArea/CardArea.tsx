import { useState, useEffect } from "react";

function CardArea(props:any) {

  const [deckTable, setDeckTable] = useState<any[]>()

  useEffect(()=>{
    setDeckTable(props.cards.cards.deckTable)
  })
  return (
    <div className="card-area">
      <ul className="hand remove-margin">
      {deckTable !== undefined ? deckTable.map((item:any, index:number)=>{
              return(
                <li key = {index}> 
                    <a className={`card rank-${item.rank } ${item.suit}`}>
                      <span className="rank">{item.rank }</span>
                      <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                    </a>
              </li>  
              )
            }): []}
      </ul>
      {/* <div className="card-area-rows output-row-one">
        <div className="card rank-7 spades">
          <span className="rank">7</span>
          <span className="suit">&spades;</span>
        </div>
      </div>
      <div className="card-area-rows output-row-two">
        <div className="card rank-7 spades">
          <span className="rank">7</span>
          <span className="suit">&spades;</span>
        </div>
        <div className="card rank-7 spades">
          <span className="rank">7</span>
          <span className="suit">&spades;</span>
        </div>
      </div>
      <div className="card-area-rows output-row-three">
        <div className="card rank-7 spades">
          <span className="rank">7</span>
          <span className="suit">&spades;</span>
        </div>
      </div> */}
    </div>
  );
}
export default CardArea;

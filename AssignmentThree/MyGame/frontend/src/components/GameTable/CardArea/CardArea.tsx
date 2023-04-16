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
      
    </div>
  );
}
export default CardArea;

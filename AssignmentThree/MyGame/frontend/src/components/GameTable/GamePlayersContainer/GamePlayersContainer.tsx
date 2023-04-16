import { useState, useEffect} from "react";

function GamePlayersContainer(props:any) {

  console.log("acaha bhai", props.cards.cards );
  
  
  const [cardsHidden, setCardsHidden] = useState<any[]>();
  const [cardsTable, setCardsTable] = useState<any[]>();
  const [cards1Hidden, setCards1Hidden] = useState<any[]>();
  const [cards1Table, setCards1Table] = useState<any[]>();
  const [cards2Hidden, setCards2Hidden] = useState<any[]>();
  const [cards2Table, setCards2Table] = useState<any[]>();
  const [cards3Hidden, setCards3Hidden] = useState<any[]>();
  const [cards3Table, setCards3Table] = useState<any[]>();

  useEffect(()=>{

    
    setCardsTable(props.cards.cards.myCardsTable)
    setCardsHidden(props.cards.cards.myCardsHidden)
    setCards1Table(props.cards.cards.cards1Table)
    setCards1Hidden(props.cards.cards.cards1Hidden)
    setCards2Table(props.cards.cards.cards2Table)
    setCards2Hidden(props.cards.cards.cards2Hidden)
    setCards3Table(props.cards.cards.cards3Table)
    setCards3Hidden(props.cards.cards.cards3Hidden)
    
  })

  return (
    <div>
      <div className="game-players-container">
        <div className="player-tag player-one">Esha</div>
        <ul className="hand remove-margin player-one-cards">
          {cardsTable !== undefined ? cardsTable.map((item:any, index:number)=>{
              return(
                  <>
                    <li>
                      <div className="card back">*</div>
                      
                    </li>
                    <li>
                      <a className={`card rank-${item.rank} ${item.suit}`}>
                        <span className="rank">{item.rank}</span>
                        <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                      </a>
                    </li>
                  </>
              )
            }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-two">Saood</div>
          <ul className="hand remove-margin player-two-cards">
          {cards1Table !== undefined ? cards1Table.map((item:any, index:number)=>{
                return(
                    <>
                      <li>
                        <div className="card back">*</div>
                      </li>
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                    </>
                )
              }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-three">Ahmed</div>
        <ul className="hand remove-margin player-three-cards">
          {cards2Table !== undefined ? cards2Table.map((item:any, index:number)=>{
                return(
                    <>
                      <li>
                        <div className="card back">*</div>
                      </li>
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                    </>
                )
              }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-four">Mahd</div>
        <ul className="hand remove-margin player-four-cards">
          {cards3Table !== undefined ? cards3Table.map((item:any, index:number)=>{
                return(
                    <>
                      <li>
                        <div className="card back">*</div>
                      </li>
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                    </>
                )
              }): []}
        </ul>
      </div>
    </div>
  );
}
export default GamePlayersContainer;

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
  const [player1Name, setPlayer1Name] = useState();
  const [player2Name, setPlayer2Name] = useState();
  const [player3Name, setPlayer3Name] = useState();
  const [player4Name, setPlayer4Name] = useState();

  useEffect(()=>{

    
    setCardsTable(props.cards.cards.myCardsTable)
    setCardsHidden(props.cards.cards.myCardsHidden)
    setCards1Table(props.cards.cards.cards1Table)
    setCards1Hidden(props.cards.cards.cards1Hidden)
    setCards2Table(props.cards.cards.cards2Table)
    setCards2Hidden(props.cards.cards.cards2Hidden)
    setCards3Table(props.cards.cards.cards3Table)
    setCards3Hidden(props.cards.cards.cards3Hidden)
    setPlayer1Name(props.cards.cards.player1Name)
    setPlayer2Name(props.cards.cards.player2Name)
    setPlayer3Name(props.cards.cards.player3Name)
    setPlayer4Name(props.cards.cards.player4Name)
    

    if(player1Name!== undefined)
    {
      console.log('names chedck plis', player1Name);
      
    }
  })

  return (
    <div>
      <div className="game-players-container">
        <div className="player-tag player-one" dangerouslySetInnerHTML={{__html: `${player1Name}`}}></div>
        <ul className="hand remove-margin player-one-cards">
        {cardsHidden !== undefined ? cardsHidden.map((item:any, index:number)=>{
              return(
                    <li> 
                      <div className="card back">*</div>
                    </li>
              )
            }): []}

          {cardsTable !== undefined ? cardsTable.map((item:any, index:number)=>{
              return(
                    <li>
                      <a className={`card rank-${item.rank} ${item.suit}`}>
                        <span className="rank">{item.rank}</span>
                        <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                      </a>
                    </li>
              )
            }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-two" dangerouslySetInnerHTML={{__html: `${player2Name}`}}></div>
          <ul className="hand remove-margin player-two-cards">
          {cards1Hidden !== undefined ? cards1Hidden.map((item:any, index:number)=>{
              return(
                    <li> 
                      <div className="card back">*</div>
                    </li>
              )
            }): []}
          {cards1Table !== undefined ? cards1Table.map((item:any, index:number)=>{
                return(
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                )
              }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-three" dangerouslySetInnerHTML={{__html: `${player3Name}`}}></div>
        <ul className="hand remove-margin player-three-cards">
        {cards2Hidden !== undefined ? cards2Hidden.map((item:any, index:number)=>{
              return(
                    <li> 
                      <div className="card back">*</div>
                    </li>
              )
            }): []}
          {cards2Table !== undefined ? cards2Table.map((item:any, index:number)=>{
                return(
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                )
              }): []}
        </ul>
      </div>

      <div className="game-players-container">
        <div className="player-tag player-four" dangerouslySetInnerHTML={{__html: `${player4Name}`}}></div>
        <ul className="hand remove-margin player-four-cards">
        {cards3Hidden !== undefined ? cards3Hidden.map((item:any, index:number)=>{
              return(
                    <li> 
                      <div className="card back">*</div>
                    </li>
              )
            }): []}
          {cards3Table !== undefined ? cards3Table.map((item:any, index:number)=>{
                return(
                      <li>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </li>
                )
              }): []}
        </ul>
      </div>
    </div>
  );
}
export default GamePlayersContainer;

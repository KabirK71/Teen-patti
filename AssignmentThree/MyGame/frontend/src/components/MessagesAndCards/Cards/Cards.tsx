import { useState, useEffect } from "react";


function Cards(prop:any) {

  // console.log("chchahaha", prop);
  
  const [cardsHand, setCardsHand] = useState<any[]>()
  const [cardsHidden, setCardsHidden] = useState<any[]>()
  const [cardsTable, setCardsTable] = useState<any[]>()
  const[socket, setSocket] = useState<any>()


  useEffect(()=>{
    setCardsHand(prop.cards.cards)
    setCardsTable(prop.cards.cardTable)
    setCardsHidden(prop.cards.cardHidden)
    setSocket(prop.cards.socket)
    

  })

  const cardChoosenHand= (rank:any, suit:any) => {
    console.log("rank:", rank);
    console.log("suit:", suit);

    let cardChoosen = {"rank":rank, "suit" : suit}

    socket.emit("cardChoosenHand",cardChoosen )
  }

  const cardChoosenTable= (rank:any, suit:any) => {
    console.log("rank:", rank);
    console.log("suit:", suit);

    let cardChoosenTable = {"rank":rank, "suit" : suit}

    socket.emit("cardChoosenTable",cardChoosenTable )
    

  }
  const cardChoosenHidden= (rank:any, suit:any) => {
    console.log("rank:", rank);
    console.log("suit:", suit);

    let cardChoosenTable = {"rank":rank, "suit" : suit}

    socket.emit("cardChoosenHidden",cardChoosenTable )
  }

  
  return (
    <div className="right-side-container my-cards-container">
      <h1>My Cards</h1>
      <div className="my-cards-inner-container">
        <ul className="hand remove-margin">
            {cardsHand !== undefined ? cardsHand.map((item:any, index:number)=>{
              return(
                <li key = {index}> <button style={{all: 'unset'}} onClick ={()=>{cardChoosenHand(item.rank, item.suit)}}>
                    <a className={`card rank-${item.rank } ${item.suit}`}>
                      <span className="rank">{item.rank }</span>
                      <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                    </a>
                  </button>
              </li>  
              )
            }): []}
        </ul>
      </div>
      <div className="my-fixed-cards-container">
        <ul className="hand remove-margin">
          {cardsHidden !== undefined ? cardsHidden.map((item:any, index:number)=>{
                return(
                      <li>
                        <button style={{all: 'unset'}} onClick ={()=>{cardChoosenHidden(item.rank, item.suit)}}>
                        <div className="card back">*</div>
                        </button>
                      </li>
                 )
                }): []}
        {cardsTable !== undefined ? cardsTable.map((item:any, index:number)=>{
              return(
                    <li>
                    <button style={{all: 'unset'}} onClick ={()=>{cardChoosenTable(item.rank, item.suit)}}>
                        <a className={`card rank-${item.rank} ${item.suit}`}>
                          <span className="rank">{item.rank}</span>
                          <span className="suit" dangerouslySetInnerHTML={{__html: `&${item.suit};`}}></span>
                        </a>
                      </button>
                    </li>
                  
                  )
                }): []}
          
        </ul>
      </div>
    </div>
  );
}
export default Cards;

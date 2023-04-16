import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useState, useEffect } from 'react';
import useHistory from 'react-router-dom';
import GameContainer from '../GameContainer/GameContainer';
import MessagesAndCards from '../MessagesAndCards/MessagesAndCards';
import Cards from '../MessagesAndCards/Cards/Cards';

interface GamePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function GamePage({ socket }: GamePageProps) {
  const [cards, setCards] = useState();
  const [cardsHand, setCardsHand] = useState();
  const [cardsHidden, setCardsHidden] = useState();
  const [cardsTable, setCardsTable] = useState();
  const [cards1Hidden, setCards1Hidden] = useState();
  const [cards1Table, setCards1Table] = useState();
  const [cards2Hidden, setCards2Hidden] = useState();
  const [cards2Table, setCards2Table] = useState();
  const [cards3Hidden, setCards3Hidden] = useState();
  const [cards3Table, setCards3Table] = useState();
  const [player1Name, setPlayer1Name] = useState();
  const [player2Name, setPlayer2Name] = useState();
  const [player3Name, setPlayer3Name] = useState();
  const [player4Name, setPlayer4Name] = useState();
  const [deckTable, setDeckTable] = useState();
  const [turn, setTurn] = useState();
  const [valid, setValid] = useState();

  useEffect(() => {
    socket.emit('state');
    socket.on('state', async (cards) => {
      setCards(cards);
      if (cards !== undefined) {
        setCardsHand(cards.cardHand);
        setCardsHidden(cards.cardHidden);
        setCardsTable(cards.cardTable);
        setCards1Hidden(cards.card1Hidden);
        setCards1Table(cards.card1Table);
        setCards2Hidden(cards.card2Hidden);
        setCards2Table(cards.card2Table);
        setCards3Hidden(cards.card3Hidden);
        setCards3Table(cards.card3Table);
      }


      // console.log('shuru', cards);
    });
    socket.on('cardChoosen', (deckTable) => {
      console.log('kabir checking');

      setDeckTable(deckTable);

      if (deckTable !== undefined) {
        console.log('deck sent from backend:', deckTable);
      }
    });
  }, []);

  useEffect(() => {
    console.log('heelo');

    socket.on('cardChoosen', (deckTable) => {
      console.log('kabir checking');

      setDeckTable(deckTable);

      if (deckTable !== undefined) {
        console.log('deck sent from backend:', deckTable);
      }

      socket.on('cardChoosenHand', (cards) => {
        console.log('haaanji we here');

        setCards(cards);
        if (cards !== undefined) {
          setCardsHand(cards.cardHand);
          setCardsHidden(cards.cardHidden);
          setCardsTable(cards.cardTable);
          setCards1Hidden(cards.card1Hidden);
          setCards1Table(cards.card1Table);
          setCards2Hidden(cards.card2Hidden);
          setCards2Table(cards.card2Table);
          setCards3Hidden(cards.card3Hidden);
          setCards3Table(cards.card3Table);
          setTurn(undefined)
          setValid(undefined)
        }

        if (cardsHand !== undefined) {
          console.log('ye jawab aya haib bhai:', cardsHand);
        }
      });
    });
  });

  useEffect(()=>{
    socket.on("not your turn", (msg)=>{
      console.log(msg);
      setTurn(msg)
    })
  })

  useEffect(()=>{
    socket.on("inValid move", (msg)=>{
      console.log(msg);
      setValid(msg)
    })
  })

  return (
    <div className="main-container playingCards">
      <GameContainer
        myCardsTable={cardsTable}
        myCardsHidden={cardsHidden}
        cards1Table={cards1Table}
        cards1Hidden={cards1Hidden}
        cards2Table={cards2Table}
        cards2Hidden={cards2Hidden}
        cards3Table={cards3Table}
        cards3Hidden={cards3Hidden}
        deckTable={deckTable}
      />
      <MessagesAndCards
        cards={cardsHand}
        cardHidden={cardsHidden}
        cardTable={cardsTable}
        socket={socket}
        notTurn = {turn}
        invalid = {valid}
      />
    </div>
  );
}
export default GamePage;

const { Socket } = require('socket.io');

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

server.listen(3001, () => {
  console.log('SERVER IS LISTENING ON PORT 3001');
});

const clients = new Map();
let latestClientId = 0;

const deck = [
  { rank: 2, suit: 'hearts' },
  { rank: 3, suit: 'hearts' },
  { rank: 4, suit: 'hearts' },
  { rank: 5, suit: 'hearts' },
  { rank: 6, suit: 'hearts' },
  { rank: 7, suit: 'hearts' },
  { rank: 8, suit: 'hearts' },
  { rank: 9, suit: 'hearts' },
  { rank: 10, suit: 'hearts' },
  { rank: 'j', suit: 'hearts' },
  { rank: 'q', suit: 'hearts' },
  { rank: 'k', suit: 'hearts' },
  { rank: 'a', suit: 'hearts' },
  { rank: 2, suit: 'diams' },
  { rank: 3, suit: 'diams' },
  { rank: 4, suit: 'diams' },
  { rank: 5, suit: 'diams' },
  { rank: 6, suit: 'diams' },
  { rank: 7, suit: 'diams' },
  { rank: 8, suit: 'diams' },
  { rank: 9, suit: 'diams' },
  { rank: 10, suit: 'diams' },
  { rank: 'j', suit: 'diams' },
  { rank: 'q', suit: 'diams' },
  { rank: 'k', suit: 'diams' },
  { rank: 'a', suit: 'diams' },
  { rank: 2, suit: 'clubs' },
  { rank: 3, suit: 'clubs' },
  { rank: 4, suit: 'clubs' },
  { rank: 5, suit: 'clubs' },
  { rank: 6, suit: 'clubs' },
  { rank: 7, suit: 'clubs' },
  { rank: 8, suit: 'clubs' },
  { rank: 9, suit: 'clubs' },
  { rank: 10, suit: 'clubs' },
  { rank: 'j', suit: 'clubs' },
  { rank: 'q', suit: 'clubs' },
  { rank: 'k', suit: 'clubs' },
  { rank: 'a', suit: 'clubs' },
  { rank: 2, suit: 'spades' },
  { rank: 3, suit: 'spades' },
  { rank: 4, suit: 'spades' },
  { rank: 5, suit: 'spades' },
  { rank: 6, suit: 'spades' },
  { rank: 7, suit: 'spades' },
  { rank: 8, suit: 'spades' },
  { rank: 9, suit: 'spades' },
  { rank: 10, suit: 'spades' },
  { rank: 'j', suit: 'spades' },
  { rank: 'q', suit: 'spades' },
  { rank: 'k', suit: 'spades' },
  { rank: 'a', suit: 'spades' },
];

const cardDivider = (deck, arr: number[], number) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  for (let i: number = 0; i < number; i++) {
    arr.push(deck.pop());
  }
};

let player1CardHand: any[] = [];
let player2CardHand: any = [];
let player3CardHand: any = [];
let player4CardHand: any = [];

let player1CardTable: any = [];
let player2CardTable: any = [];
let player3CardTable: any = [];
let player4CardTable: any = [];

let player1CardHidden = [];
let player2CardHidden = [];
let player3CardHidden = [];
let player4CardHidden = [];

let remainingCards = [];

cardDivider(deck, player1CardHand, 3);
cardDivider(deck, player2CardHand, 3);
cardDivider(deck, player3CardHand, 3);
cardDivider(deck, player4CardHand, 3);
cardDivider(deck, player1CardTable, 3);
cardDivider(deck, player2CardTable, 3);
cardDivider(deck, player3CardTable, 3);
cardDivider(deck, player4CardTable, 3);
cardDivider(deck, player1CardHidden, 3);
cardDivider(deck, player2CardHidden, 3);
cardDivider(deck, player3CardHidden, 3);
cardDivider(deck, player4CardHidden, 3);
cardDivider(deck, remainingCards, deck.length);

let deckOnTable: any[] = [];

let turnMap = new Map();




let particularCards = [
  {
    cardHand: player1CardHand,
    cardHidden: player1CardHidden,
    cardTable: player1CardTable,
    cardOpponents: [],
    myname: '',
    names: []
  },
  {
    cardHand: player2CardHand,
    cardHidden: player2CardHidden,
    cardTable: player2CardTable,
    cardOpponents: [],
    myname: '',
    names: []
  },
  {
    cardHand: player3CardHand,
    cardHidden: player3CardHidden,
    cardTable: player3CardTable,
    cardOpponents: [],
    myname: '',
    names: [],
  },
  {
    cardHand: player4CardHand,
    cardHidden: player4CardHidden,
    cardTable: player4CardTable,
    cardOpponents: [],
    myname: '',
    names: []
  },
];

let socketIds: any[] = [];
let socketArr: any[] = [];
const users = new Map();
let turn = 0;
let turnChecker = 0;
let rankMap = new Map();
rankMap.set(2, 2);
rankMap.set(3, 3);
rankMap.set(4, 4);
rankMap.set(5, 5);
rankMap.set(6, 6);
rankMap.set(7, 7);
rankMap.set(8, 8);
rankMap.set(9, 9);
rankMap.set(10, 10);
rankMap.set('j', 11);
rankMap.set('q', 12);
rankMap.set('k', 13);
rankMap.set('a', 14);

let GameWon = 0
let nameArr:any[] = []

io.on('connection', (socket) => {
  let id = latestClientId++;
  clients.set(socket.id, { id });
  console.log('user connected with a socket id', socket.id);

  let userCards: any = particularCards.shift();
  users.set(socket.id, userCards);
  particularCards.push(userCards);

  socketIds.push(socket.id);
  socketArr.push(socket);
  turnMap.set(socket.id, id);
  turn = 0;

  
    console.log("we here");
    console.log("socketIds.lem", socketIds.length);
    
    
    for (let i = 0; i < socketIds.length; i++)
    {
      console.log("i", i);
      users.get(socketIds[i]).cardOpponents = []
      
      for (let j = 0; j < socketIds.length; j++)
      {
        console.log("j", j);
        if(i !== j)
        {
          console.log("jinh heredd");
          
          console.log("jinh heredd 10");
          
          users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
          users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
        }
      }
    }


  socket.on('disconnect', () => {
    clients.delete(socket.id);
    users.delete(socket.id);
    console.log('A user disconnected: ' + socket.id);
  });

  socket.on('sendingUsername', (myData) => {
    clients.set(socket.id, myData);

    users.get(socket.id).myname = myData
    nameArr.push(myData)
  });

  socket.on('userNumber', () => {
    socket.emit('userNumber', nameArr.length);
  });

  socket.on('state', () => {

    console.log('here please');

    for (let i = 0; i < socketIds.length; i++)
    {
      console.log("i2", i);
      users.get(socketIds[i]).names = []
      
      for (let j = 0; j < socketIds.length; j++)
      {
        console.log("j2", j);
        if(i !== j)
        {
          console.log("agya hoon idher 450");
          
          // console.log("jinh heredd 10");
          
          users.get(socketIds[i]).names.push(clients.get(socketIds[j]))
        }
      }
    }

    socketArr.forEach((e) => {
      e.emit('state', users.get(e.id));
    });
  });

  

  socket.on('cardChoosenHand', (card) => {
    console.log('haan jaani');
    console.log('turn player:', turnMap.get(socket.id));
    console.log('turn game:', turn);
    let pickCard: boolean = true;
    if(GameWon === 0){
      console.log("Game won ", GameWon);
      
      if (turnMap.get(socket.id) === turn) {
        console.log('my turn');
  
        if (deckOnTable.length !== 0) {
          console.log('checking deck empty initially');
  
          for (let i = 0; i < users.get(socket.id).cardHand.length; i++) {
            console.log('any valid card');
  
            if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) 
            {
              if (
                rankMap.get(users.get(socket.id).cardHand[i].rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
              ) 
              {
                if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardHand[i].rank) === 7
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardHand[i].rank) === 8
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardHand[i].rank) === 10
                ) {
                  pickCard = false;
                }
              } else {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
            ) 
            {
              if (deckOnTable.length > 1) 
              {
                if (
                  rankMap.get(users.get(socket.id).cardHand[i].rank) <
                  rankMap.get(deckOnTable[deckOnTable.length - 2].rank)
                ) 
                {
                  console.log('card small');
                  if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardHand[i].rank) === 7
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardHand[i].rank) === 8
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardHand[i].rank) === 10
                  ) {
                    pickCard = false;
                  }
                  if (
                    rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
                  ) {
                    pickCard = false;
                  }
                }
                else{
                  pickCard = false
                }
              } 
              else 
              {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(users.get(socket.id).cardHand[i].rank) <
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
            ) 
            {
              console.log('card small');
              if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardHand[i].rank) === 7
              ) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardHand[i].rank) === 8
              ) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardHand[i].rank) === 10
              ) {
                pickCard = false;
              }
              if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                pickCard = false;
              }
            } else {
              console.log(' valid card');
              pickCard = false;
            }
          }
        } 
        else 
        {
          console.log('all valid card');
          pickCard = false;
        }
  
  
        if (pickCard === false) 
        {
          console.log("card choose karna hai ab");
          
          if (
            deckOnTable.length !== 0 &&
            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
          ) 
          {
            console.log("checking 8");
            
            let originalDeckOnTable = deckOnTable;
  
            deckOnTable = deckOnTable.filter((num) => !(num.rank === 8));
  
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardHand);
  
                temporaryState.cardHand = temporaryState.cardHand.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardHand);
                if (
                  remainingCards.length !== 0 &&
                  temporaryState.cardHand.length < 3
                ) 
                {
                  temporaryState.cardHand.push(remainingCards.pop());
                }
                console.log('after pushing', temporaryState.cardHand);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardHand);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  console.log("original deck", originalDeckOnTable);
                  
                  deckOnTable = originalDeckOnTable;
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
  
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 2", GameWon);
                  
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardHand);
  
              temporaryState.cardHand = temporaryState.cardHand.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardHand);
              if (
                remainingCards.length !== 0 &&
                temporaryState.cardHand.length < 3
              ) 
              {
                temporaryState.cardHand.push(remainingCards.pop());
              }
              console.log('after pushing', temporaryState.cardHand);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardHand);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                console.log("original deck", originalDeckOnTable);
                deckOnTable = originalDeckOnTable;
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 3", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
            } else {
              socket.emit('inValid move', 'inValid move');
            }
          } 
          else{
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardHand);
  
                temporaryState.cardHand = temporaryState.cardHand.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardHand);
                if (
                  remainingCards.length !== 0 &&
                  temporaryState.cardHand.length < 3
                ) 
                {
                  temporaryState.cardHand.push(remainingCards.pop());
                }
                console.log('after pushing', temporaryState.cardHand);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardHand);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 4", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardHand);
  
              temporaryState.cardHand = temporaryState.cardHand.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardHand);
              if (
                remainingCards.length !== 0 &&
                temporaryState.cardHand.length < 3
              ) 
              {
                temporaryState.cardHand.push(remainingCards.pop());
              }
              console.log('after pushing', temporaryState.cardHand);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardHand);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 5", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
            } else {
              socket.emit('inValid move', 'inValid move');
            }
  
          }
        }
        else 
        {
          console.log('no valid cards');
          let temporaryState = users.get(socket.id);
          temporaryState.cardHand.push(...deckOnTable);
          console.log('after pushing', temporaryState.cardHand);
          users.set(socket.id, temporaryState);
          deckOnTable = [];
          if (turn === 3) {
            turn = 0;
          } else {
            turn++;
          }
          console.log(users.get(socket.id).cardHand);
          for (let i = 0; i < socketIds.length; i++)
          {
            console.log("i", i);
            users.get(socketIds[i]).cardOpponents = []
            
            for (let j = 0; j < socketIds.length; j++)
            {
              console.log("j", j);
              if(i !== j)
              {
                console.log("jinh heredd");
                
                console.log("jinh heredd 10");
                
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
              }
            }
          }
          if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
          {
            console.log("Gamw won 6", GameWon);
            GameWon = 1
            socketArr.forEach((e) => {
              e.emit('gameWon', clients.get(socket.id));
            });
          }
          socketArr.forEach((e) => {
            e.emit('cardChoosenHand', users.get(e.id));
          });
          // socket.emit('cardChoosenHand', users.get(socket.id));
          socketArr.forEach((e) => {
            e.emit('cardChoosen', deckOnTable);
        });
          
      }
  
      } else {
        console.log('not your turn');
        socket.emit('not your turn', 'You are out of turn');
      }
    }
    else{
      socketArr.forEach((e) => {
        e.emit('gameWon', clients.get(socket.id));
      });
    }
    
  });

  socket.on('cardChoosenTable', (card) => {
    console.log('haan jaani');
    console.log('turn player:', turnMap.get(socket.id));
    console.log('turn game:', turn);
    let pickCard: boolean = true;
    if(GameWon === 0){

    if (turnMap.get(socket.id) === turn) {
      console.log('my turn');

      if(users.get(socket.id).cardHand.length === 0)
      {

        if (deckOnTable.length !== 0) {
          console.log('checking deck empty initially');
  
          for (let i = 0; i < users.get(socket.id).cardTable.length; i++) {
            console.log('any valid card');
  
            if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) 
            {
              if (
                rankMap.get(users.get(socket.id).cardTable[i].rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
              ) 
              {
                if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardTable[i].rank) === 7
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardTable[i].rank) === 8
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(users.get(socket.id).cardTable[i].rank) === 10
                ) {
                  pickCard = false;
                }
              } else {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
            ) 
            {
              if (deckOnTable.length > 1) 
              {
                if (
                  rankMap.get(users.get(socket.id).cardTable[i].rank) <
                  rankMap.get(deckOnTable[deckOnTable.length - 2].rank)
                ) 
                {
                  console.log('card small');
                  if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardTable[i].rank) === 7
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardTable[i].rank) === 8
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(users.get(socket.id).cardTable[i].rank) === 10
                  ) {
                    pickCard = false;
                  }
                  if (
                    rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
                  ) {
                    pickCard = false;
                  }
                }
                else{
                  pickCard = false
                }
              } 
              else 
              {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(users.get(socket.id).cardTable[i].rank) <
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
            ) 
            {
              console.log('card small');
              if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardTable[i].rank) === 7
              ) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardTable[i].rank) === 8
              ) {
                pickCard = false;
              } else if (
                rankMap.get(users.get(socket.id).cardTable[i].rank) === 10
              ) {
                pickCard = false;
              }
              if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                pickCard = false;
              }
            } else {
              console.log(' valid card');
              pickCard = false;
            }
          }
        } 
        else 
        {
          console.log('all valid card');
          pickCard = false;
        }
  
  
        if (pickCard === false) 
        {
          console.log("card choose karna hai ab");
          
          if (
            deckOnTable.length !== 0 &&
            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
          ) 
          {
            console.log("checking 8");
            
            let originalDeckOnTable = deckOnTable;
  
            deckOnTable = deckOnTable.filter((num) => !(num.rank === 8));
  
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardTable);
  
                temporaryState.cardTable = temporaryState.cardTable.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardTable);
                // if (
                //   remainingCards.length !== 0 &&
                //   temporaryState.cardHand.length < 3
                // ) 
                // {
                //   temporaryState.cardHand.push(remainingCards.pop());
                // }
                console.log('after pushing', temporaryState.cardTable);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardTable);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  console.log("original deck", originalDeckOnTable);
                  
                  deckOnTable = originalDeckOnTable;
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 7", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardTable);
  
              temporaryState.cardTable = temporaryState.cardTable.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardTable);
              // if (
              //   remainingCards.length !== 0 &&
              //   temporaryState.cardHand.length < 3
              // ) 
              // {
              //   temporaryState.cardHand.push(remainingCards.pop());
              // }
              console.log('after pushing', temporaryState.cardTable);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardTable);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                console.log("original deck", originalDeckOnTable);
                deckOnTable = originalDeckOnTable;
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
              {
                console.log("Gamw won 8", GameWon);
                GameWon = 1
                socketArr.forEach((e) => {
                  e.emit('gameWon', clients.get(socket.id));
                });
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
            } else {
              socket.emit('inValid move', 'inValid move');
            }
          } 
          else{
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardTable);
  
                temporaryState.cardTable = temporaryState.cardTable.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardTable);
                // if (
                //   remainingCards.length !== 0 &&
                //   temporaryState.cardHand.length < 3
                // ) 
                // {
                //   temporaryState.cardHand.push(remainingCards.pop());
                // }
                console.log('after pushing', temporaryState.cardTable);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardHand);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 9", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardTable);
  
              temporaryState.cardTable = temporaryState.cardTable.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardTable);
              // if (
              //   remainingCards.length !== 0 &&
              //   temporaryState.cardHand.length < 3
              // ) 
              // {
              //   temporaryState.cardHand.push(remainingCards.pop());
              // }
              console.log('after pushing', temporaryState.cardTable);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardTable);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
              {
                console.log("Gamw won 10", GameWon);
                GameWon = 1
                socketArr.forEach((e) => {
                  e.emit('gameWon', clients.get(socket.id));
                });
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
            } else {
              socket.emit('inValid move', 'inValid move');
            }
  
          }
        }
        else 
        {
          console.log('no valid cards');
          let temporaryState = users.get(socket.id);
          temporaryState.cardHand.push(...deckOnTable);
          console.log('after pushing', temporaryState.cardHand);
          users.set(socket.id, temporaryState);
          deckOnTable = [];
          if (turn === 3) {
            turn = 0;
          } else {
            turn++;
          }
          console.log(users.get(socket.id).cardHand);
          for (let i = 0; i < socketIds.length; i++)
          {
            console.log("i", i);
            users.get(socketIds[i]).cardOpponents = []
            
            for (let j = 0; j < socketIds.length; j++)
            {
              console.log("j", j);
              if(i !== j)
              {
                console.log("jinh heredd");
                
                console.log("jinh heredd 10");
                
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
              }
            }
          }
          if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
          {
            console.log("Gamw won 11", GameWon);
            GameWon = 1
            socketArr.forEach((e) => {
              e.emit('gameWon', clients.get(socket.id));
            });
          }
          socketArr.forEach((e) => {
            e.emit('cardChoosenHand', users.get(e.id));
          });
          // socket.emit('cardChoosenHand', users.get(socket.id));
          socketArr.forEach((e) => {
            e.emit('cardChoosen', deckOnTable);});
          
        }
      } 
      else
      {
        socket.emit('inValid move', 'inValid move');
      }
    } else {
      console.log('not your turn');
      socket.emit('not your turn', 'You are out of turn');
    }
  }
  else{
    socketArr.forEach((e) => {
      e.emit('gameWon', clients.get(socket.id));
    });
  }
    
  });

  socket.on('cardChoosenHidden', (card) => {
    console.log('haan jaani');
    console.log('turn player:', turnMap.get(socket.id));
    console.log('turn game:', turn);
    let pickCard: boolean = true;
    if(GameWon === 0){
    if (turnMap.get(socket.id) === turn) {
      console.log('my turn');

      if(users.get(socket.id).cardHand.length === 0 && users.get(socket.id).cardTable.length === 0)
      {

        if (deckOnTable.length !== 0) {
          console.log('checking deck empty initially');
  
          // for (let i = 0; i < users.get(socket.id).cardTable.length; i++) {
          //   console.log('any valid card');
  
            if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) 
            {
              if (
                rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
              ) 
              {
                if (rankMap.get(card.rank) === 2) {
                  pickCard = false;
                } else if (
                  rankMap.get(card.rank) === 7
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(card.rank) === 8
                ) {
                  pickCard = false;
                } else if (
                  rankMap.get(card.rank) === 10
                ) {
                  pickCard = false;
                }
              } else {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
            ) 
            {
              if (deckOnTable.length > 1) 
              {
                if (
                  rankMap.get(card.rank) <
                  rankMap.get(deckOnTable[deckOnTable.length - 2].rank)
                ) 
                {
                  console.log('card small');
                  if (rankMap.get(card.rank) === 2) {
                    pickCard = false;
                  } else if (
                    rankMap.get(card.rank) === 7
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(card.rank) === 8
                  ) {
                    pickCard = false;
                  } else if (
                    rankMap.get(card.rank) === 10
                  ) {
                    pickCard = false;
                  }
                  if (
                    rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
                  ) {
                    pickCard = false;
                  }
                }
                else{
                  pickCard = false
                }
              } 
              else 
              {
                pickCard = false;
              }
            } 
            else if (
              rankMap.get(card.rank) <
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank)
            ) 
            {
              console.log('card small');
              if (rankMap.get(card.rank) === 2) {
                pickCard = false;
              } else if (
                rankMap.get(card.rank) === 7
              ) {
                pickCard = false;
              } else if (
                rankMap.get(card.rank) === 8
              ) {
                pickCard = false;
              } else if (
                rankMap.get(card.rank) === 10
              ) {
                pickCard = false;
              }
              if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                pickCard = false;
              }
            } else {
              console.log(' valid card');
              pickCard = false;
            }
          
        } 
        else 
        {
          console.log('all valid card');
          pickCard = false;
        }
  
  
        if (pickCard === false) 
        {
          console.log("card choose karna hai ab");
          
          if (
            deckOnTable.length !== 0 &&
            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8
          ) 
          {
            console.log("checking 8");
            
            let originalDeckOnTable = deckOnTable;
  
            deckOnTable = deckOnTable.filter((num) => !(num.rank === 8));
  
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardHidden);
  
                temporaryState.cardHidden = temporaryState.cardHidden.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardHidden);
                // if (
                //   remainingCards.length !== 0 &&
                //   temporaryState.cardHand.length < 3
                // ) 
                // {
                //   temporaryState.cardHand.push(remainingCards.pop());
                // }
                console.log('after pushing', temporaryState.cardHidden);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardHidden);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  console.log("original deck", originalDeckOnTable);
                  
                  deckOnTable = originalDeckOnTable;
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 12", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardHidden);
  
              temporaryState.cardHidden = temporaryState.cardHidden.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardHidden);
              // if (
              //   remainingCards.length !== 0 &&
              //   temporaryState.cardHand.length < 3
              // ) 
              // {
              //   temporaryState.cardHand.push(remainingCards.pop());
              // }
              console.log('after pushing', temporaryState.cardHidden);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardHidden);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                console.log("original deck", originalDeckOnTable);
                deckOnTable = originalDeckOnTable;
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
              {
                console.log("Gamw won 13", GameWon);
                GameWon = 1
                socketArr.forEach((e) => {
                  e.emit('gameWon', clients.get(socket.id));
                });
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
            } else {
              socket.emit('inValid move', 'inValid move');
            }
          } 
          else{
            if (
              deckOnTable.length !== 0 &&
              rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7
            ) 
            {
              console.log('implmenting 7');
  
              if (
                rankMap.get(card.rank) <= 7 ||
                rankMap.get(card.rank) === 8 ||
                rankMap.get(card.rank) === 10 ||
                rankMap.get(card.rank) === 2 ||
                rankMap.get(card.rank) === 7
              ) 
              {
                console.log('implmenting 7 a');
  
                if (rankMap.get(card.rank) !== 2) {
                  if (turn === 3) {
                    turn = 0;
                  } else {
                    turn++;
                  }
                }
  
                let temporaryState = users.get(socket.id);
                console.log('--------------------------------------------------------------');
  
                console.log('before filter: ', temporaryState.cardHidden);
  
                temporaryState.cardHidden = temporaryState.cardHidden.filter(
                  (num) => !(num.rank === card.rank && num.suit === card.suit)
                );
                console.log('after filter', temporaryState.cardHidden);
                // if (
                //   remainingCards.length !== 0 &&
                //   temporaryState.cardHand.length < 3
                // ) 
                // {
                //   temporaryState.cardHand.push(remainingCards.pop());
                // }
                console.log('after pushing', temporaryState.cardHidden);
                users.set(socket.id, temporaryState);
                console.log(users.get(socket.id).cardHidden);
                if (card.rank === 10)
                {
                  deckOnTable = [];
                } 
                else 
                {
                  deckOnTable.push(card);
                  console.log(deckOnTable);
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosen', deckOnTable);
                });
                for (let i = 0; i < socketIds.length; i++)
                {
                  console.log("i", i);
                  users.get(socketIds[i]).cardOpponents = []
                  
                  for (let j = 0; j < socketIds.length; j++)
                  {
                    console.log("j", j);
                    if(i !== j)
                    {
                      console.log("jinh heredd");
                      
                      console.log("jinh heredd 10");
                      
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                      users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                    }
                  }
                }
                if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
                {
                  console.log("Gamw won 14", GameWon);
                  GameWon = 1
                  socketArr.forEach((e) => {
                    e.emit('gameWon', clients.get(socket.id));
                  });
                }
                socketArr.forEach((e) => {
                  e.emit('cardChoosenHand', users.get(e.id));
                });
                // socket.emit('cardChoosenHand', users.get(socket.id));
              } 
              else 
              {
                socket.emit('inValid move', 'inValid move');
              }
            } else if (
              deckOnTable.length === 0 ||
              rankMap.get(card.rank) >=
                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
              rankMap.get(card.rank) === 8 ||
              rankMap.get(card.rank) === 10 ||
              rankMap.get(card.rank) === 2 ||
              rankMap.get(card.rank) === 7
            ) 
            {
              if (rankMap.get(card.rank) !== 2) 
              {
                if (turn === 3) {
                  turn = 0;
                } else {
                  turn++;
                }
              }
              let temporaryState = users.get(socket.id);
              console.log('--------------------------------------------------------------');
  
              console.log('before filter: ', temporaryState.cardHidden);
  
              temporaryState.cardHidden = temporaryState.cardHidden.filter(
                (num) => !(num.rank === card.rank && num.suit === card.suit)
              );
              console.log('after filter', temporaryState.cardHidden);
              // if (
              //   remainingCards.length !== 0 &&
              //   temporaryState.cardHand.length < 3
              // ) 
              // {
              //   temporaryState.cardHand.push(remainingCards.pop());
              // }
              console.log('after pushing', temporaryState.cardHidden);
              users.set(socket.id, temporaryState);
              console.log(users.get(socket.id).cardHidden);
              if (card.rank === 10) 
              {
                deckOnTable = [];
              } 
              else {
                deckOnTable.push(card);
                console.log(deckOnTable);
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosen', deckOnTable);
              });
              for (let i = 0; i < socketIds.length; i++)
              {
                console.log("i", i);
                users.get(socketIds[i]).cardOpponents = []
                
                for (let j = 0; j < socketIds.length; j++)
                {
                  console.log("j", j);
                  if(i !== j)
                  {
                    console.log("jinh heredd");
                    
                    console.log("jinh heredd 10");
                    
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                    users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
                  }
                }
              }
              if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
              {
                console.log("Gamw won 15", GameWon);
                GameWon = 1
                socketArr.forEach((e) => {
                  e.emit('gameWon', clients.get(socket.id));
                });
              }
              socketArr.forEach((e) => {
                e.emit('cardChoosenHand', users.get(e.id));
              });
              // socket.emit('cardChoosenHand', users.get(socket.id));
              
            } else {
              socket.emit('inValid move', 'inValid move');
            }
  
          }
        }
        else 
        {
          console.log('no valid cards');
          let temporaryState = users.get(socket.id);
          temporaryState.cardHand.push(...deckOnTable);
          temporaryState.cardHidden = temporaryState.cardHidden.filter((num) => !(num.rank === card.rank && num.suit ===card.suit));
          temporaryState.cardHand.push({ rank: card.rank, suit: card.suit })
          console.log('after pushing', temporaryState.cardHand);
          users.set(socket.id, temporaryState);
          deckOnTable = [];
          if (turn === 3) {
            turn = 0;
          } else {
            turn++;
          }
          console.log(users.get(socket.id).cardHand);
          for (let i = 0; i < socketIds.length; i++)
          {
            console.log("i", i);
            users.get(socketIds[i]).cardOpponents = []
            
            for (let j = 0; j < socketIds.length; j++)
            {
              console.log("j", j);
              if(i !== j)
              {
                console.log("jinh heredd");
                
                console.log("jinh heredd 10");
                
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardTable)
                users.get(socketIds[i]).cardOpponents.push(users.get(socketIds[j]).cardHidden)
              }
            }
          }
          if(users.get(socket.id).cardHand.length ===0 && users.get(socket.id).cardHidden.length ===0 && users.get(socket.id).cardTable.length ===0)
          {
            console.log("Gamw won 16", GameWon);
            GameWon = 1
            socketArr.forEach((e) => {
              e.emit('gameWon', clients.get(socket.id));
            });
          }
          socketArr.forEach((e) => {
            e.emit('cardChoosenHand', users.get(e.id));
          });
          // socket.emit('cardChoosenHand', users.get(socket.id));
          socketArr.forEach((e) => {
            e.emit('cardChoosen', deckOnTable);});
          
        }
      } 
      else
      {
        socket.emit('inValid move', 'inValid move');
      }
    } else {
      console.log('not your turn');
      socket.emit('not your turn', 'You are out of turn');
    }
  }
  else{
    socketArr.forEach((e) => {
      e.emit('gameWon2', clients.get(socket.id));
    });
  }
    
  });


});

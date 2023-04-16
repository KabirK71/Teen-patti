var Socket = require('socket.io').Socket;
var express = require('express');
var app = express();
var http = require('http');
var Server = require('socket.io').Server;
var cors = require('cors');
app.use(cors());
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
});
server.listen(3001, function () {
    console.log('SERVER IS LISTENING ON PORT 3001');
});
var clients = new Map();
var latestClientId = 0;
var deck = [
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
var cardDivider = function (deck, arr, number) {
    var _a;
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [deck[j], deck[i]], deck[i] = _a[0], deck[j] = _a[1];
    }
    for (var i = 0; i < number; i++) {
        arr.push(deck.pop());
    }
};
var player1CardHand = [];
var player2CardHand = [];
var player3CardHand = [];
var player4CardHand = [];
var player1CardTable = [];
var player2CardTable = [];
var player3CardTable = [];
var player4CardTable = [];
var player1CardHidden = [];
var player2CardHidden = [];
var player3CardHidden = [];
var player4CardHidden = [];
var remainingCards = [];
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
var deckOnTable = [];
var turnMap = new Map();
var particularCards = [
    {
        cardHand: player1CardHand,
        cardHidden: player1CardHidden,
        cardTable: player1CardTable,
        card1Hidden: player2CardHidden,
        card1Table: player2CardTable,
        card2Hidden: player3CardHidden,
        card2Table: player3CardTable,
        card3Hidden: player4CardHidden,
        card3Table: player4CardTable
    },
    {
        cardHand: player2CardHand,
        cardHidden: player2CardHidden,
        cardTable: player2CardTable,
        card1Hidden: player1CardHidden,
        card1Table: player1CardTable,
        card2Hidden: player3CardHidden,
        card2Table: player3CardTable,
        card3Hidden: player4CardHidden,
        card3Table: player4CardTable
    },
    {
        cardHand: player3CardHand,
        cardHidden: player3CardHidden,
        cardTable: player3CardTable,
        card1Hidden: player2CardHidden,
        card1Table: player2CardTable,
        card2Hidden: player1CardHidden,
        card2Table: player1CardTable,
        card3Hidden: player4CardHidden,
        card3Table: player4CardTable
    },
    {
        cardHand: player4CardHand,
        cardHidden: player4CardHidden,
        cardTable: player4CardTable,
        card1Hidden: player2CardHidden,
        card1Table: player2CardTable,
        card2Hidden: player3CardHidden,
        card2Table: player3CardTable,
        card3Hidden: player1CardHidden,
        card3Table: player1CardTable
    },
];
var socketIds = [];
var socketArr = [];
var users = new Map();
var turn = 0;
var turnChecker = 0;
var rankMap = new Map();
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
io.on('connection', function (socket) {
    var id = latestClientId++;
    clients.set(socket, { id: id });
    console.log('user connected with a socket id', socket.id);
    var userCards = particularCards.shift();
    users.set(socket.id, userCards);
    particularCards.push(userCards);
    socketIds.push(socket.id);
    socketArr.push(socket);
    turnMap.set(socket.id, id);
    turn = 0;
    socket.on('disconnect', function () {
        clients["delete"](socket.id);
        users["delete"](socket.id);
        console.log('A user disconnected: ' + socket.id);
    });
    socket.on('sendingUsername', function (myData) {
        clients.set(socket, myData);
    });
    socket.on('userNumber', function () {
        socket.emit('userNumber', clients.size);
    });
    socket.on('state', function () {
        console.log('here please');
        socket.emit('state', users.get(socket.id));
    });
    // if(turnChecker !== turn)
    // {
    // }
    socket.on('cardChoosenHand', function (card) {
        var _a;
        console.log('haan jaani');
        console.log('turn player:', turnMap.get(socket.id));
        console.log('turn game:', turn);
        var pickCard = true;
        if (turnMap.get(socket.id) === turn) {
            console.log('my turn');
            if (deckOnTable.length !== 0) {
                console.log('checking deck empty initially');
                for (var i = 0; i < users.get(socket.id).cardHand.length; i++) {
                    console.log('any valid card');
                    if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                        if (rankMap.get(users.get(socket.id).cardHand[i].rank) >=
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                            if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 7) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 8) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 10) {
                                pickCard = false;
                            }
                        }
                        else {
                            pickCard = false;
                        }
                    }
                    else if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                        if (deckOnTable.length > 1) {
                            if (rankMap.get(users.get(socket.id).cardHand[i].rank) <
                                rankMap.get(deckOnTable[deckOnTable.length - 2].rank)) {
                                console.log('card small');
                                if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 7) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 8) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 10) {
                                    pickCard = false;
                                }
                                if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                                    pickCard = false;
                                }
                            }
                            else {
                                pickCard = false;
                            }
                        }
                        else {
                            pickCard = false;
                        }
                    }
                    else if (rankMap.get(users.get(socket.id).cardHand[i].rank) <
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                        console.log('card small');
                        if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 2) {
                            pickCard = false;
                        }
                        else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 7) {
                            pickCard = false;
                        }
                        else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 8) {
                            pickCard = false;
                        }
                        else if (rankMap.get(users.get(socket.id).cardHand[i].rank) === 10) {
                            pickCard = false;
                        }
                        if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            pickCard = false;
                        }
                    }
                    else {
                        console.log(' valid card');
                        pickCard = false;
                    }
                }
            }
            else {
                console.log('all valid card');
                pickCard = false;
            }
            if (pickCard === false) {
                console.log("card choose karna hai ab");
                if (deckOnTable.length !== 0 &&
                    rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                    console.log("checking 8");
                    var originalDeckOnTable = deckOnTable;
                    deckOnTable = deckOnTable.filter(function (num) { return !(num.rank === 8); });
                    if (deckOnTable.length !== 0 &&
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                        console.log('implmenting 7');
                        if (rankMap.get(card.rank) <= 7 ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            console.log('implmenting 7 a');
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardHand);
                            temporaryState.cardHand = temporaryState.cardHand.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
                            console.log('after filter', temporaryState.cardHand);
                            if (remainingCards.length !== 0 &&
                                temporaryState.cardHand.length < 3) {
                                temporaryState.cardHand.push(remainingCards.pop());
                            }
                            console.log('after pushing', temporaryState.cardHand);
                            users.set(socket.id, temporaryState);
                            console.log(users.get(socket.id).cardHand);
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                console.log("original deck", originalDeckOnTable);
                                deckOnTable = originalDeckOnTable;
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                    else if (deckOnTable.length === 0 ||
                        rankMap.get(card.rank) >=
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                        rankMap.get(card.rank) === 8 ||
                        rankMap.get(card.rank) === 10 ||
                        rankMap.get(card.rank) === 2 ||
                        rankMap.get(card.rank) === 7) {
                        if (rankMap.get(card.rank) !== 2) {
                            if (turn === 3) {
                                turn = 0;
                            }
                            else {
                                turn++;
                            }
                        }
                        var temporaryState = users.get(socket.id);
                        console.log('--------------------------------------------------------------');
                        console.log('before filter: ', temporaryState.cardHand);
                        temporaryState.cardHand = temporaryState.cardHand.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
                        console.log('after filter', temporaryState.cardHand);
                        if (remainingCards.length !== 0 &&
                            temporaryState.cardHand.length < 3) {
                            temporaryState.cardHand.push(remainingCards.pop());
                        }
                        console.log('after pushing', temporaryState.cardHand);
                        users.set(socket.id, temporaryState);
                        console.log(users.get(socket.id).cardHand);
                        if (card.rank === 10) {
                            deckOnTable = [];
                        }
                        else {
                            console.log("original deck", originalDeckOnTable);
                            deckOnTable = originalDeckOnTable;
                            deckOnTable.push(card);
                            console.log(deckOnTable);
                        }
                        socketArr.forEach(function (e) {
                            e.emit('cardChoosen', deckOnTable);
                        });
                        socket.emit('cardChoosenHand', users.get(socket.id));
                    }
                    else {
                        socket.emit('inValid move', 'inValid move');
                    }
                }
                else {
                    if (deckOnTable.length !== 0 &&
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                        console.log('implmenting 7');
                        if (rankMap.get(card.rank) <= 7 ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            console.log('implmenting 7 a');
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardHand);
                            temporaryState.cardHand = temporaryState.cardHand.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
                            console.log('after filter', temporaryState.cardHand);
                            if (remainingCards.length !== 0 &&
                                temporaryState.cardHand.length < 3) {
                                temporaryState.cardHand.push(remainingCards.pop());
                            }
                            console.log('after pushing', temporaryState.cardHand);
                            users.set(socket.id, temporaryState);
                            console.log(users.get(socket.id).cardHand);
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                    else if (deckOnTable.length === 0 ||
                        rankMap.get(card.rank) >=
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                        rankMap.get(card.rank) === 8 ||
                        rankMap.get(card.rank) === 10 ||
                        rankMap.get(card.rank) === 2 ||
                        rankMap.get(card.rank) === 7) {
                        if (rankMap.get(card.rank) !== 2) {
                            if (turn === 3) {
                                turn = 0;
                            }
                            else {
                                turn++;
                            }
                        }
                        var temporaryState = users.get(socket.id);
                        console.log('--------------------------------------------------------------');
                        console.log('before filter: ', temporaryState.cardHand);
                        temporaryState.cardHand = temporaryState.cardHand.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
                        console.log('after filter', temporaryState.cardHand);
                        if (remainingCards.length !== 0 &&
                            temporaryState.cardHand.length < 3) {
                            temporaryState.cardHand.push(remainingCards.pop());
                        }
                        console.log('after pushing', temporaryState.cardHand);
                        users.set(socket.id, temporaryState);
                        console.log(users.get(socket.id).cardHand);
                        if (card.rank === 10) {
                            deckOnTable = [];
                        }
                        else {
                            deckOnTable.push(card);
                            console.log(deckOnTable);
                        }
                        socketArr.forEach(function (e) {
                            e.emit('cardChoosen', deckOnTable);
                        });
                        socket.emit('cardChoosenHand', users.get(socket.id));
                    }
                    else {
                        socket.emit('inValid move', 'inValid move');
                    }
                }
            }
            else {
                console.log('no valid cards');
                var temporaryState = users.get(socket.id);
                (_a = temporaryState.cardHand).push.apply(_a, deckOnTable);
                console.log('after pushing', temporaryState.cardHand);
                users.set(socket.id, temporaryState);
                deckOnTable = [];
                if (turn === 3) {
                    turn = 0;
                }
                else {
                    turn++;
                }
                console.log(users.get(socket.id).cardHand);
                socket.emit('cardChoosenHand', users.get(socket.id));
                socketArr.forEach(function (e) {
                    e.emit('cardChoosen', deckOnTable);
                });
            }
        }
        else {
            console.log('not your turn');
            socket.emit('not your turn', 'You are out of turn');
        }
    });
    socket.on('cardChoosenTable', function (card) {
        var _a;
        console.log('haan jaani');
        console.log('turn player:', turnMap.get(socket.id));
        console.log('turn game:', turn);
        var pickCard = true;
        if (turnMap.get(socket.id) === turn) {
            console.log('my turn');
            if (users.get(socket.id).cardHand.length === 0) {
                if (deckOnTable.length !== 0) {
                    console.log('checking deck empty initially');
                    for (var i = 0; i < users.get(socket.id).cardTable.length; i++) {
                        console.log('any valid card');
                        if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            if (rankMap.get(users.get(socket.id).cardTable[i].rank) >=
                                rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                                if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 7) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 8) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 10) {
                                    pickCard = false;
                                }
                            }
                            else {
                                pickCard = false;
                            }
                        }
                        else if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                            if (deckOnTable.length > 1) {
                                if (rankMap.get(users.get(socket.id).cardTable[i].rank) <
                                    rankMap.get(deckOnTable[deckOnTable.length - 2].rank)) {
                                    console.log('card small');
                                    if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                                        pickCard = false;
                                    }
                                    else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 7) {
                                        pickCard = false;
                                    }
                                    else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 8) {
                                        pickCard = false;
                                    }
                                    else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 10) {
                                        pickCard = false;
                                    }
                                    if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                                        pickCard = false;
                                    }
                                }
                                else {
                                    pickCard = false;
                                }
                            }
                            else {
                                pickCard = false;
                            }
                        }
                        else if (rankMap.get(users.get(socket.id).cardTable[i].rank) <
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                            console.log('card small');
                            if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 2) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 7) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 8) {
                                pickCard = false;
                            }
                            else if (rankMap.get(users.get(socket.id).cardTable[i].rank) === 10) {
                                pickCard = false;
                            }
                            if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                                pickCard = false;
                            }
                        }
                        else {
                            console.log(' valid card');
                            pickCard = false;
                        }
                    }
                }
                else {
                    console.log('all valid card');
                    pickCard = false;
                }
                if (pickCard === false) {
                    console.log("card choose karna hai ab");
                    if (deckOnTable.length !== 0 &&
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                        console.log("checking 8");
                        var originalDeckOnTable = deckOnTable;
                        deckOnTable = deckOnTable.filter(function (num) { return !(num.rank === 8); });
                        if (deckOnTable.length !== 0 &&
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            console.log('implmenting 7');
                            if (rankMap.get(card.rank) <= 7 ||
                                rankMap.get(card.rank) === 8 ||
                                rankMap.get(card.rank) === 10 ||
                                rankMap.get(card.rank) === 2 ||
                                rankMap.get(card.rank) === 7) {
                                console.log('implmenting 7 a');
                                if (rankMap.get(card.rank) !== 2) {
                                    if (turn === 3) {
                                        turn = 0;
                                    }
                                    else {
                                        turn++;
                                    }
                                }
                                var temporaryState = users.get(socket.id);
                                console.log('--------------------------------------------------------------');
                                console.log('before filter: ', temporaryState.cardTable);
                                temporaryState.cardTable = temporaryState.cardTable.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                                if (card.rank === 10) {
                                    deckOnTable = [];
                                }
                                else {
                                    console.log("original deck", originalDeckOnTable);
                                    deckOnTable = originalDeckOnTable;
                                    deckOnTable.push(card);
                                    console.log(deckOnTable);
                                }
                                socketArr.forEach(function (e) {
                                    e.emit('cardChoosen', deckOnTable);
                                });
                                socket.emit('cardChoosenHand', users.get(socket.id));
                            }
                            else {
                                socket.emit('inValid move', 'inValid move');
                            }
                        }
                        else if (deckOnTable.length === 0 ||
                            rankMap.get(card.rank) >=
                                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardTable);
                            temporaryState.cardTable = temporaryState.cardTable.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                console.log("original deck", originalDeckOnTable);
                                deckOnTable = originalDeckOnTable;
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                    else {
                        if (deckOnTable.length !== 0 &&
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            console.log('implmenting 7');
                            if (rankMap.get(card.rank) <= 7 ||
                                rankMap.get(card.rank) === 8 ||
                                rankMap.get(card.rank) === 10 ||
                                rankMap.get(card.rank) === 2 ||
                                rankMap.get(card.rank) === 7) {
                                console.log('implmenting 7 a');
                                if (rankMap.get(card.rank) !== 2) {
                                    if (turn === 3) {
                                        turn = 0;
                                    }
                                    else {
                                        turn++;
                                    }
                                }
                                var temporaryState = users.get(socket.id);
                                console.log('--------------------------------------------------------------');
                                console.log('before filter: ', temporaryState.cardTable);
                                temporaryState.cardTable = temporaryState.cardTable.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                                if (card.rank === 10) {
                                    deckOnTable = [];
                                }
                                else {
                                    deckOnTable.push(card);
                                    console.log(deckOnTable);
                                }
                                socketArr.forEach(function (e) {
                                    e.emit('cardChoosen', deckOnTable);
                                });
                                socket.emit('cardChoosenHand', users.get(socket.id));
                            }
                            else {
                                socket.emit('inValid move', 'inValid move');
                            }
                        }
                        else if (deckOnTable.length === 0 ||
                            rankMap.get(card.rank) >=
                                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardTable);
                            temporaryState.cardTable = temporaryState.cardTable.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                }
                else {
                    console.log('no valid cards');
                    var temporaryState = users.get(socket.id);
                    (_a = temporaryState.cardHand).push.apply(_a, deckOnTable);
                    console.log('after pushing', temporaryState.cardHand);
                    users.set(socket.id, temporaryState);
                    deckOnTable = [];
                    if (turn === 3) {
                        turn = 0;
                    }
                    else {
                        turn++;
                    }
                    console.log(users.get(socket.id).cardHand);
                    socket.emit('cardChoosenHand', users.get(socket.id));
                    socketArr.forEach(function (e) {
                        e.emit('cardChoosen', deckOnTable);
                    });
                }
            }
            else {
                socket.emit('inValid move', 'inValid move');
            }
        }
        else {
            console.log('not your turn');
            socket.emit('not your turn', 'You are out of turn');
        }
    });
    socket.on('cardChoosenHidden', function (card) {
        var _a;
        console.log('haan jaani');
        console.log('turn player:', turnMap.get(socket.id));
        console.log('turn game:', turn);
        var pickCard = true;
        if (turnMap.get(socket.id) === turn) {
            console.log('my turn');
            if (users.get(socket.id).cardHand.length === 0 && users.get(socket.id).cardTable.length === 0) {
                if (deckOnTable.length !== 0) {
                    console.log('checking deck empty initially');
                    // for (let i = 0; i < users.get(socket.id).cardTable.length; i++) {
                    //   console.log('any valid card');
                    if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                        if (rankMap.get(card.rank) >=
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                            if (rankMap.get(card.rank) === 2) {
                                pickCard = false;
                            }
                            else if (rankMap.get(card.rank) === 7) {
                                pickCard = false;
                            }
                            else if (rankMap.get(card.rank) === 8) {
                                pickCard = false;
                            }
                            else if (rankMap.get(card.rank) === 10) {
                                pickCard = false;
                            }
                        }
                        else {
                            pickCard = false;
                        }
                    }
                    else if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                        if (deckOnTable.length > 1) {
                            if (rankMap.get(card.rank) <
                                rankMap.get(deckOnTable[deckOnTable.length - 2].rank)) {
                                console.log('card small');
                                if (rankMap.get(card.rank) === 2) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(card.rank) === 7) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(card.rank) === 8) {
                                    pickCard = false;
                                }
                                else if (rankMap.get(card.rank) === 10) {
                                    pickCard = false;
                                }
                                if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                                    pickCard = false;
                                }
                            }
                            else {
                                pickCard = false;
                            }
                        }
                        else {
                            pickCard = false;
                        }
                    }
                    else if (rankMap.get(card.rank) <
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank)) {
                        console.log('card small');
                        if (rankMap.get(card.rank) === 2) {
                            pickCard = false;
                        }
                        else if (rankMap.get(card.rank) === 7) {
                            pickCard = false;
                        }
                        else if (rankMap.get(card.rank) === 8) {
                            pickCard = false;
                        }
                        else if (rankMap.get(card.rank) === 10) {
                            pickCard = false;
                        }
                        if (rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            pickCard = false;
                        }
                    }
                    else {
                        console.log(' valid card');
                        pickCard = false;
                    }
                }
                else {
                    console.log('all valid card');
                    pickCard = false;
                }
                if (pickCard === false) {
                    console.log("card choose karna hai ab");
                    if (deckOnTable.length !== 0 &&
                        rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 8) {
                        console.log("checking 8");
                        var originalDeckOnTable = deckOnTable;
                        deckOnTable = deckOnTable.filter(function (num) { return !(num.rank === 8); });
                        if (deckOnTable.length !== 0 &&
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            console.log('implmenting 7');
                            if (rankMap.get(card.rank) <= 7 ||
                                rankMap.get(card.rank) === 8 ||
                                rankMap.get(card.rank) === 10 ||
                                rankMap.get(card.rank) === 2 ||
                                rankMap.get(card.rank) === 7) {
                                console.log('implmenting 7 a');
                                if (rankMap.get(card.rank) !== 2) {
                                    if (turn === 3) {
                                        turn = 0;
                                    }
                                    else {
                                        turn++;
                                    }
                                }
                                var temporaryState = users.get(socket.id);
                                console.log('--------------------------------------------------------------');
                                console.log('before filter: ', temporaryState.cardHidden);
                                temporaryState.cardHidden = temporaryState.cardHidden.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                                if (card.rank === 10) {
                                    deckOnTable = [];
                                }
                                else {
                                    console.log("original deck", originalDeckOnTable);
                                    deckOnTable = originalDeckOnTable;
                                    deckOnTable.push(card);
                                    console.log(deckOnTable);
                                }
                                socketArr.forEach(function (e) {
                                    e.emit('cardChoosen', deckOnTable);
                                });
                                socket.emit('cardChoosenHand', users.get(socket.id));
                            }
                            else {
                                socket.emit('inValid move', 'inValid move');
                            }
                        }
                        else if (deckOnTable.length === 0 ||
                            rankMap.get(card.rank) >=
                                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardHidden);
                            temporaryState.cardHidden = temporaryState.cardHidden.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                console.log("original deck", originalDeckOnTable);
                                deckOnTable = originalDeckOnTable;
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                    else {
                        if (deckOnTable.length !== 0 &&
                            rankMap.get(deckOnTable[deckOnTable.length - 1].rank) === 7) {
                            console.log('implmenting 7');
                            if (rankMap.get(card.rank) <= 7 ||
                                rankMap.get(card.rank) === 8 ||
                                rankMap.get(card.rank) === 10 ||
                                rankMap.get(card.rank) === 2 ||
                                rankMap.get(card.rank) === 7) {
                                console.log('implmenting 7 a');
                                if (rankMap.get(card.rank) !== 2) {
                                    if (turn === 3) {
                                        turn = 0;
                                    }
                                    else {
                                        turn++;
                                    }
                                }
                                var temporaryState = users.get(socket.id);
                                console.log('--------------------------------------------------------------');
                                console.log('before filter: ', temporaryState.cardHidden);
                                temporaryState.cardHidden = temporaryState.cardHidden.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                                if (card.rank === 10) {
                                    deckOnTable = [];
                                }
                                else {
                                    deckOnTable.push(card);
                                    console.log(deckOnTable);
                                }
                                socketArr.forEach(function (e) {
                                    e.emit('cardChoosen', deckOnTable);
                                });
                                socket.emit('cardChoosenHand', users.get(socket.id));
                            }
                            else {
                                socket.emit('inValid move', 'inValid move');
                            }
                        }
                        else if (deckOnTable.length === 0 ||
                            rankMap.get(card.rank) >=
                                rankMap.get(deckOnTable[deckOnTable.length - 1].rank) ||
                            rankMap.get(card.rank) === 8 ||
                            rankMap.get(card.rank) === 10 ||
                            rankMap.get(card.rank) === 2 ||
                            rankMap.get(card.rank) === 7) {
                            if (rankMap.get(card.rank) !== 2) {
                                if (turn === 3) {
                                    turn = 0;
                                }
                                else {
                                    turn++;
                                }
                            }
                            var temporaryState = users.get(socket.id);
                            console.log('--------------------------------------------------------------');
                            console.log('before filter: ', temporaryState.cardHidden);
                            temporaryState.cardHidden = temporaryState.cardHidden.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
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
                            if (card.rank === 10) {
                                deckOnTable = [];
                            }
                            else {
                                deckOnTable.push(card);
                                console.log(deckOnTable);
                            }
                            socketArr.forEach(function (e) {
                                e.emit('cardChoosen', deckOnTable);
                            });
                            socket.emit('cardChoosenHand', users.get(socket.id));
                        }
                        else {
                            socket.emit('inValid move', 'inValid move');
                        }
                    }
                }
                else {
                    console.log('no valid cards');
                    var temporaryState = users.get(socket.id);
                    (_a = temporaryState.cardHand).push.apply(_a, deckOnTable);
                    temporaryState.cardHidden = temporaryState.cardHidden.filter(function (num) { return !(num.rank === card.rank && num.suit === card.suit); });
                    temporaryState.cardHand.push({ rank: card.rank, suit: card.suit });
                    console.log('after pushing', temporaryState.cardHand);
                    users.set(socket.id, temporaryState);
                    deckOnTable = [];
                    if (turn === 3) {
                        turn = 0;
                    }
                    else {
                        turn++;
                    }
                    console.log(users.get(socket.id).cardHand);
                    socket.emit('cardChoosenHand', users.get(socket.id));
                    socketArr.forEach(function (e) {
                        e.emit('cardChoosen', deckOnTable);
                    });
                }
            }
            else {
                socket.emit('inValid move', 'inValid move');
            }
        }
        else {
            console.log('not your turn');
            socket.emit('not your turn', 'You are out of turn');
        }
    });
});

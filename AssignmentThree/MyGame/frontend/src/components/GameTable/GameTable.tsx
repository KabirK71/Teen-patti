import CardArea from './CardArea/CardArea';
import GamePlayersContainer from './GamePlayersContainer/GamePlayersContainer';

function GameTable(props:any) {
  // console.log("theek hai ", props);
  return (
    <div className="game-table">
        <CardArea cards = {props}/>
        <GamePlayersContainer cards = {props}/>
    </div>
  );
}
export default GameTable;

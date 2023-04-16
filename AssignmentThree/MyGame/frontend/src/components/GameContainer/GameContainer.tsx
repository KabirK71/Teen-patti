
import Header from '../Header/Header';
import GameTable from '../GameTable/GameTable'

function GameContainer(props:any) {

  // console.log("kesa hai ", props);
  

  return (
    <div className="game-container">
        <Header/>
        <div className="game-table-container">
            <GameTable cards = {props}/>
        </div>
    </div>
  );
}
export default GameContainer;

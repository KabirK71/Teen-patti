
import Messages from './Messages/Messages';
import Cards from './Cards/Cards';

function MessagesAndCards(props:any) {
  // console.log("chahie",props);
  
  return (
    <div className="messages-and-cards-container">
        <Messages messages = {props}/>
        <Cards cards= {props} />
    </div>
    
  );
}
export default MessagesAndCards;

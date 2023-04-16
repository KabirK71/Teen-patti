import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Home.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}


function HomePage({socket}:HomePageProps){
    //click handler
    const [username, setUsername] = useState("")
    const navigate = useNavigate(); 
    const handleClick = (socket: Socket) => {
        socket.emit('sendingUsername', username );
        navigate('/loadingPage')
        
    };


    return(
        <>
        <div className="sampleHomePage">
            <h1 className="sampleTitle">Teen Patti</h1>
            <div className="sampleMessage">
            <input  placeholder = "Username" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
            <button  onClick={() => handleClick(socket)}>Please enter your username</button>
            </div>
        </div>
        </>
    )

}
export default HomePage
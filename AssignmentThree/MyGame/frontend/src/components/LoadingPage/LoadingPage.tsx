import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import './LoadingPage.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//create an interface for the props that you want to pass to this component
interface LoadingPageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function LoadingPage({ socket }: LoadingPageProps) {
  //click handler
  const [username, setUsername] = useState('');
  let navigate = useNavigate();
  

  useEffect(() => {
    let intervalId = setInterval(() => {
      socket.emit('userNumber');
      socket.on('userNumber', (item) => {
        console.log('item number', item);
        if (item === 4) {
            // navigate('loadingPage')
            navigate("/gamePage", { state: { from: "LandingPage" } });
        }
      });
    });

    return () => {
        clearInterval(intervalId);
      };
  }, []);

  return (
    <>
      <div className="sampleLoadingPage">
        {/* <h1 className="sampleTitle">My Game</h1> */}
        <h1 className="sampleTitle">Teen Patti</h1>
        <div className="sampleMessage">
          <h1>Please wait while other players join</h1>
        </div>
      </div>
    </>
  );
}
export default LoadingPage;

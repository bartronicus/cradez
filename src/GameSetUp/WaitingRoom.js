import React from 'react'
import firebase from 'firebase/app';
import 'firebase/firestore';
import shuffle from '../GameSetUp/shuffle.js'
var db = firebase.firestore();
// Disable deprecated features

db.settings({
  timestampsInSnapshots: true
});


class WaitingRoom extends React.Component {
  constructor(props){
    super(props)
    this.docRef = db.collection("games").doc(this.props.gameName)
    this.state = {
      players:[],
      activePlayer:'',
      actions:[],
      nouns:[]
    }
    this.startGameAndUploadToFB = this.startGameAndUploadToFB.bind(this)
  }


  _isMounted=false;

  updateState(playerNames){
    if(this._isMounted===true){
      this.setState(state=>({
        players:playerNames
      }))
    }
  }

  componentDidMount(){
    this._isMounted=true;
      this.unsubscribe = this.docRef
      //watch for new players
      .onSnapshot(snapshot => {
        for(var item in snapshot.data()){
          //set up the game in local state
          let player = snapshot.data()[item]
          //check if player has already been processed into state
          if (this.state.players.filter(e => e.name === player.name).length<1 && player.name) {
            let playerActions = snapshot.data()[item]['actions']
            let playerNouns = snapshot.data()[item]['nouns']
            let players = [player]
            let nouns = [playerNouns]
            nouns=shuffle(nouns)
            let actions = [playerActions]
            actions=shuffle(actions)
            players = [...players,...this.state.players]
            actions = actions.concat(this.state.actions)
            actions = [].concat.apply([],actions)
            nouns = nouns.concat(this.state.nouns)
            nouns = [].concat.apply([],nouns)
            this.setState(state=>({
              players:players,
              actions:actions,
              nouns:nouns
            }))
          }
        }
        //go to next game screen if the game leader starts the game
        snapshot.data().transitioning === true && this.props.navigate('letsgame')
    });
  }

  componentWillUnmount(){
    this.unsubscribe()
  }



  renderRows(){
    let playerState = this.state.players
    let players = [];
    for(let player in playerState){
      //get team name from player object
      //add as a class to control styling
      let team;
      playerState[player]['team']==='red team'?team='redTeam':team='blueTeam';
      players.push(
        <tr key={player} className={team}>
          <td>{playerState[player]['name']}</td>
        </tr>)
    }
    return players
  }



  startGameAndUploadToFB(){
    console.log(this.props.gameName)
    db.collection("games").doc(this.props.gameName)
    .update({
      players:this.state.players,
      turn:0,
      activePlayerIndex:0,
      blueTeamPoints:0,
      redTeamPoints:0,
      status:'active',
      actions:shuffle(this.state.actions),
      nouns:shuffle(this.state.nouns),
      timeStamp:Date.now(),
      transitioning:true
    })
  }

  render(){
    const showStartButton = () => {
      if(this.props.creator === true && this.state.players && this.state.players.length > 1){
        return <button id="yellowButton" className="startButton" onClick={()=>{this.startGameAndUploadToFB();}}>start!</button>;
      } else if(this.props.creator===true){
        return <p style={{color:'grey'}}>At least two players are required to start</p>
      } else {
        return <p style={{color:'grey'}}>The game creator will need to start the game</p>
      }
    }

    return(
      <div>
        <div id="waitingRoomContainer">
          <h1>{this.props.spacedGameName}</h1>
          <h3>Waiting for all players to join.</h3>
          <table id="waitingRoomTable">
            <tbody id="waitingRoomTableBody">
              {this.renderRows()}
            </tbody>
          </table>
        </div>
            {showStartButton()}
            <ul id="waitinRoomRulesUL" className="rulesList">
              <li> Each round lasts one minute. </li>
              <li> Players may skip one phrase per turn. </li>
              <li> Your team earns two points when they succesfully guess your phrase. </li>
              <li> Skipping a phrase costs your team -1 points. </li>
              <li> The game ends when all phrases have been guessed. </li>
            </ul>
            <button id="exit" onClick={()=>{this.props.navigate('setUp');}}>X</button>
      </div>
    )
  }
}

export default WaitingRoom;

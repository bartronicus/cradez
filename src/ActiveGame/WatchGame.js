import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Paused from './Paused.js'
import SimpleStorage from "react-simple-storage";

var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


 class WatchGame extends React.Component {
   constructor(props){
     super(props)
     this.docRef = db.collection("games").doc(this.props.gameName)
     this.state={
       clock:60
     }
   }

   _isMounted = false;

   counter(){
     let second = this.state.clock
     if(this._isMounted){
       this.timer=setInterval(()=>{
           if(this.props.status!=='paused'){
             second > 1 ? second -- : second = 'Time\'s Up!'
               this.setState(state=>({
                 clock:second
               }))
             if(second === 'Time\'s Up!'){
               //update the active player index in case active player checks out
               let newIndex;
               this.props.activePlayerIndex === this.props.players.length-1 ?
               newIndex=0:newIndex=this.props.activePlayerIndex+1
               db.collection("games").doc(this.props.gameName)
               .update({
                 transitioning:true,
                 activePlayerIndex:newIndex
               })
             }
           }
       },1000,second)
     }
  }


   componentDidMount(){
     this._isMounted=true;
     this.counter();
     this.unsubscribe = this.docRef
     .onSnapshot(snapshot=> {
       let snap = snapshot.data()
       this.setState(state => ({
         status:snap.status
       }))
     })
   }

   componentWillUnmount(){
     this._isMounted=false;
     clearInterval(this.timer)
     this.unsubscribe();
   }

   renderTeam(teamname){
      let teamElements = [];
      let players = this.props.players
      for(var player in players){
        if(players[player]['team']===teamname){
          let score = players[player]['score']
          let name = players[player]['name']
          teamElements.push(
            <tr key={player}><td>{name}</td><td>{score}</td></tr>
          );
        }
      }
      return teamElements;
   }


   render(){
     return (
       this.state.status !== 'paused' ?
         <div>
          <SimpleStorage parent={this}/>
           <header>
               <div>
                 <h2 id="watchGameCurrentPlayer">Current player:  {this.props.activePlayer}</h2>
               </div>
               <div><h3>clock:<span id="watchGameClock">{this.state.clock}</span></h3></div>
               <div></div>
           </header>
           <section>
             <table  id="redTeamScoreBox">
               <tbody>
                 <tr><th><h3> Red Team: </h3></th><th><h3>{this.props.redTeamPoints}</h3></th></tr>
                 {this.renderTeam('red team')}
               </tbody>
             </table>
             <table  id="blueTeamScoreBox">
               <tbody>
                 <tr><th><h3> Blue Team: </h3></th><th><h3>{this.props.blueTeamPoints}</h3></th></tr>
                 {this.renderTeam('blue team')}
               </tbody>
             </table>
           </section>
         </div> :
         <div>
           <Paused
             creator = {this.props.creator}
             gameName = {this.props.gameName}
           />
         </div>
     )
   }
}

export default WatchGame;

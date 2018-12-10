import React from 'react'
import lists from './GameNameSeeds.js'
import firebase from 'firebase/app';
import 'firebase/firestore';
import Words from './NounsAndActions.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Astronaut from '../svgs/astronaut.js'
import Cosmo from '../svgs/cosmo.js'
import Wiz from '../svgs/wiz.js'
import Cactus from '../svgs/cactus.js'
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


class Inputs extends React.Component {
  render(){
    return(
      <div>
          {this.props.page === 'setUp' && <SetUp
              notCreator = {this.props.notCreator}
              setupGame = {this.props.setupGame}
              gameName = {this.props.gameName}
              setWarning = {this.props.setWarning}
              navigate={this.props.navigate}
              warning = {this.props.warning} />}
          {this.props.page === 'confirmName' && <ConfirmName
              spacedGameName = {this.props.spacedGameName}
              gameName = {this.props.gameName}
              navigate={this.props.navigate}
              setupGame = {this.props.setupGame}/>}
          {this.props.page === 'name' && <NameInput
              creator = {this.props.creator}
              playerName = {this.props.playerName}
              gameName = {this.props.gameName}
              spacedGameName = {this.props.spacedGameName}
              navigate={this.props.navigate}
              setupGame = {this.props.setupGame}/>}
          {this.props.page === 'actions'  && <Words
              gameName = {this.props.gameName}
              spacedGameName = {this.props.spacedGameName}
              playerName = {this.props.playerName}
              navigate={this.props.navigate}
              actions={this.props.actions}
              creator={this.props.creator}
              page={this.props.page}
              setupGame = {this.props.setupGame}/>}
      </div>
    )
  }
}


const SetUp = (props) => {
  return(
    <section>
      <div id='newGameRow'>
        <button id="firstAquaButton"
        onClick={
          ()=>{
            // generate a random game Name
            // recursive function checks if game name has been used before
            // runs again if true
            const createGameName = () => {
              let randoNoun = lists.nouns[Math.floor(Math.random()*lists.nouns.length)];
              let randoAdj = lists.actions[Math.floor(Math.random()*lists.actions.length)];
              let combo = randoAdj + randoNoun;
              let spacedGameName = randoAdj + ' ' + randoNoun

              var docRef = db.collection("games").doc(combo);
              docRef.get().then(function(doc) {
                // run function again if pre-existing, else set state with game name
                if(doc.exists){
                  createGameName()
                } else {
                  props.setupGame('gameName',combo);
                  props.setupGame('spacedGameName',spacedGameName);
                  //set the game name to the db. used the turn value as a placeholder to create the document.
                  //that way players can join the game without waiting for the creator to finish
                  db.collection('games').doc(combo).set({
                    turn:0,
                  })
                }
              })
            }
            createGameName()
            props.navigate('rules');
            props.setWarning('');
            props.setupGame('creator',true);
            props.setupGame('gameName',props.gameName)}}>
            New Game!
            </button>
            <div id="cosmoBoxBox">
            <Cosmo />
            </div>
          </div>
        <p>Or join a game </p>
        <div id="joinGameRow">
          <input id="enterGameName" placeholder="Enter your game name"
              onChange={(e)=>{
                let input = e.target.value
                let value = input.replace(/\s/g, "");
                value = value.toLowerCase()
                props.setupGame('gameName',value)
                props.setupGame('spacedGameName',input)
              }}/>
          <button id="gameNameInput" id="yellowButton"  type="button"
              onClick={()=>{
                props.notCreator();
                if(!props.gameName){
                  props.setWarning('Please enter a game name')
                } else {
                  var docRef = db.collection("games").doc(props.gameName);
                  docRef.get().then(function(doc) {
                    // run function again if pre-existing, else set state with game name
                    if(doc.exists){
                      props.setWarning('')
                      props.navigate('rules')
                    } else {
                      props.setWarning('Please enter a valid game name')
                    }
                  })
                }
              }}
          >Join!</button>
        </div>
        <p  id="warningMessage">{props.warning}</p>
        <div id="astroBoxBox">
        <Astronaut/>
        </div>
        </section>
      )
    }



const ConfirmName = (props) => {
  return(
    <div>
      <p> Your game name is <span style={{color:'violet',fontWeight:900}}>{props.spacedGameName}</span></p>
      <p> Tell your friends to enter the game name in order to join!</p>
      <br />


      <div id="bottomBox">

          <div>
            <button id="purpleButton" onClick={()=>
              {
                props.navigate('name')
              }
            }>Got it!</button>

            <div id="arrowBorder" onClick={()=>{props.navigate('rules')}} >
               <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          </div>

          <div>
            <Cactus />
          </div>
      </div>
    </div>
  )
}



const NameInput = (props) => {
  return(
    <div>
      <p>Your game name is <span style={{color:'violet',fontWeight:900}}>{props.spacedGameName}</span></p>

      <input
        maxLength={'30'}
        style={{marginTop:'15px',padding:'2px'}}
        onChange={(e)=>{
          props.setupGame('playerName',e.target.value)
        }}
        onClick={(e)=>{

        }}
        placeholder="Enter your name here"/>

        <div id="bottomBox" style={{marginTop:'15px'}}>

            <div>
              <button id="purpleButton" onClick={()=>
                {
                      props.playerName && props.navigate('actions')
                }
              }>
              Hello!</button>

              <div id="arrowBorder" onClick={()=>{
                props.creator ?
                  props.navigate('confirmName') :
                  props.navigate('rules')}
              }>
                 <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </div>

            <div>
              <Wiz />
            </div>
        </div>

  </div>
 )
}



export default Inputs;

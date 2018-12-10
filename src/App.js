import React, { Component } from 'react';
import './App.css'
import './GameSetUp/nameinput.css'
import './svgs/wiz.css'
import './svgs/Buffalo.css'
import './svgs/cosmo.css'
import './svgs/cactus.css'
import './svgs/astronaut.css'
import Inputs from './GameSetUp/GameSetUp.js'
import WaitingRoom from './GameSetUp/WaitingRoom.js'
import ManageGame from './ActiveGame/ManageGame.js'
import Rules from './GameSetUp/Rules.js'
import SimpleStorage from "react-simple-storage";

class App extends Component {
  constructor(props){
    super(props);
     this.state = {
      warning:'',
      page:'setUp',
      creator:false,
      gameName:'',
      playerName:'',
      spacedGameName:''
    }
    this.notCreator = this.notCreator.bind(this);
    this.navigate = this.navigate.bind(this);
    this.setupGame = this.setupGame.bind(this);
    this.setWarning = this.setWarning.bind(this);
  }

  navigate(newPage) {
    //clear local storage if someone is navigating back to the beginning of the games
    if(newPage==='setUp'){
      localStorage.clear()
      this.setState({
        playerName:'',
        warning:''
      })
      this.setWarning('');
    }
    this.setState(state => ({
      page: newPage,
    }));
  }

  setupGame(key,value){
    this.setState(state=>({
        [key]:value
    }));
  }

  setWarning(message){
    this.setState(state=>({
      warning:message
    }))
  }

  notCreator(){
    this.setState(state=>({
      creator:false
    }))
  }



  render() {
    return (
      this.state.page === 'gametime' ?
        <div>
        <SimpleStorage parent={this} />
        <WaitingRoom
              navigate = {this.navigate}
              creator = {this.state.creator}
              gameName = {this.state.gameName}
              spacedGameName = {this.state.spacedGameName}
              playerName = {this.state.playerName}
         />
         </div> :
      this.state.page ==='rules' ?
        <div>
          <SimpleStorage parent={this} />
          <Rules
              navigate = {this.navigate}
              creator = {this.state.creator}
          />
        </div> :
      this.state.page ==='letsgame' ?
        <div>
          <SimpleStorage parent={this} />
          <ManageGame
            page = {this.state.page}
            gameName = {this.state.gameName}
            spacedGameName = {this.state.spacedGameName}
            creator = {this.state.creator}
            playerName = {this.state.playerName}
            navigate = {this.navigate}
          />
        </div> :
        <div className="App">
          <SimpleStorage parent={this} />
          <header>
            <div id="headerContainer">
              {/*<FontAwesomeIcon icon={faBars} id="menuIcon" />*/}
              <h1 style={{marginBottom:'0px'}}id="title"> CRADEZ </h1>
            </div>
            <h3> A charades game for "friends" </h3>
          </header>
            <Inputs
              notCreator = {this.notCreator}
              setWarning = {this.setWarning}
              warning = {this.state.warning}
              navigate = {this.navigate}
              setupGame = {this.setupGame}
              page = {this.state.page}
              gameName = {this.state.gameName}
              spacedGameName = {this.state.spacedGameName}
              creator = {this.state.creator}
              playerName = {this.state.playerName}
              nouns = {this.state.nouns}
              actions = {this.state.actions}/>
        </div>
    )
  }
}


export default App;

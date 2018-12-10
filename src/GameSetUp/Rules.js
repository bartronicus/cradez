import React from 'react'
import Bigfoot from '../svgs/bigfoot.js'
import Alien from '../svgs/alien.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class Rules extends React.Component {

  render(){
    return(
      <div id="rules">
        <div>
          <div id="bigfootTextBox">
            <h3 className="dialogue" id="bigfootText"> Cradez is the latest craze to sweep the nation </h3>
          </div>
          <div id="alien">
            <Alien />
          </div>
          <div id="alienTextBox">
            <h3 className="dialogue"> Never heard of it! <br /> What is it and how do I play??</h3>
          </div>
          <Bigfoot id="bigfoot"/>
          <div className="next">
          </div>
          <div id="rulesBox">
            <p> Cradez is a charades based game.  Players each upload 3 actions and 3 characters.  These are combined to form phrases like 'Han Solo eating toenails' or 'a wizard going country dancing'  </p>
            <p> Players are then divded into two teams, and take turns acting out the combined phrase. </p>
            <ul className="rulesList">
              <li> Each round lasts one minute. </li>
              <li> Players may skip one phrase per turn. </li>
              <li> Your team earns two points when they succesfully guess your phrase. </li>
              <li> Skipping a phrase costs your team -1 points. </li>
              <li> The game ends when all phrases have been guessed. </li>
            </ul>
            <div className="next">
              <p> Got it, thanks Mom! </p>
              <button id="redButton" onClick={()=>{
                this.props.creator ?
                  this.props.navigate('confirmName') :
                  this.props.navigate('name')}
              }>Next! </button>
              <div id="arrowBorder" onClick={()=>{this.props.navigate('setUp')}}>
                <FontAwesomeIcon icon={faArrowLeft}/>
              </div>
            </div>
          </div>
        </div>
    </div>
    )
  }
}

export default Rules;

import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:3,
      message:'If you had fun consider throwing a few coffe beans this way to keep the good times rolling'
    }
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
      <div className="checkout">
        <p>{this.state.message}</p>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);







/*<div>
  <span id="dollarSign">$</span>
  <input id="donationAmount" label='Donation Amount' value={this.state.amount}
         onChange={(e)=>{this.setDonationAmount(e.target.value)}} type="number"
         min="0" step=".50"/>
</div>*/

import React, {Component} from 'react';
import CheckoutSummary from './../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './../../containers/Checkout/ContactData/ContactData';
import { connect } from 'react-redux';
class Checkout extends Component {

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }
  checkoutContinueHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }
  render() {
    let summary = <Redirect to= "/"/>
    if (this.props.ingredients && !this.props.purchased) {
      summary = (
        <div>
          <CheckoutSummary
            checkoutContinued = {this.checkoutContinueHandler}
            checkoutCancelled = {this.checkoutCancelledHandler}
            ingredients={this.props.ingredients}
          />
          <Route
            path = {`${this.props.match.path}/contact-data`}
            component= {ContactData}
          />
        </div>
      );
    };
    return summary;
  }
}

const mapStateToProps = (state) => {
  return ({
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.price,
    purchased: state.order.purchased
  });
};


export default connect(mapStateToProps)(Checkout);

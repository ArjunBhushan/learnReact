import React , {Component} from 'react';
import Auxiliary from './../../hoc/Auxiliary/Auxiliary';
import Burger from './../../components/Burger/Burger';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from './../../axios-orders';
import Spinner from './../../components/UI/Spinner/Spinner';
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler';
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};


class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }
  componentDidMount = () => {
    axios.get('/ingredients.json')
      .then((res) => {
        this.setState({ingredients: res.data});
      })
      .catch((error) => {
        this.setState({error: true});
      });
  }
  updatePurchaseState = (ingredients) => {
    let sum = Object.keys(ingredients).map((key) => {
        return ingredients[key];
      }).reduce((total, el) => {
        return total + el;
      }, 0);
    this.setState({purchasable: sum > 0});
  }
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngredients);
  }
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0){
      return;
    }
    let updatedCount = oldCount - 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngredients);
  }
  purchaseHandler = () => {
    this.setState({purchasing: true});
  }
  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }
  purchaseContinueHandler = () => {
    let queryParams = [];
    for (let i in this.state.ingredients){
      queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.state.ingredients[i])}`);
    }
    queryParams.push(`price=${this.state.totalPrice}`);
    this.props.history.push({
      pathname: '/checkout',
      search: `?${queryParams.join('&')}`
    });
  }
  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? <p style = {{textAlign: 'center', fontSize: '24px'}}><strong>Ingredients cannot be loaded!</strong></p>: <Spinner />;
    if (this.state.ingredients) {
      burger = (
        <Auxiliary>
          <Burger ingredients = {this.state.ingredients}/>
          <BuildControls
            ingredientAdded = {this.addIngredientHandler}
            ingredientRemoved = {this.removeIngredientHandler}
            disabled = {disabledInfo}
            price= {this.state.totalPrice}
            purchasable = {this.state.purchasable}
            ordered = {this.purchaseHandler}/>
        </Auxiliary>
      );
      orderSummary = (
        <OrderSummary purchaseCanceled = {this.purchaseCancelHandler}
                      purchaseContinued = {this.purchaseContinueHandler}
                      ingredients = {this.state.ingredients}
                      price = {this.state.totalPrice}/>
      );
      if (this.state.loading) {
        orderSummary = <Spinner/>
      }
    }
    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
import React from 'react';
import styles from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  {label: 'Salad', type: 'salad'},
  {label: 'Bacon', type: 'bacon'},
  {label: 'Cheese', type: 'cheese'},
  {label: 'Meat', type: 'meat'}
];

const buildControls = (props) => {
  return (
    <div className = {styles.BuildControls}>
      <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
      {controls.map((control) => {
        return (<BuildControl key = {control.label} label = {control.label}
                added={props.ingredientAdded.bind(this, control.type)}
                removed = {props.ingredientRemoved.bind(this, control.type)}
                disabled = {props.disabled[control.type]}/>);
      })}
      <button
        className = {styles.OrderButton}
        disabled = {!props.purchasable}
        onClick = {props.ordered}>
        {props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}
      </button>
    </div>
  );
}
export default buildControls;

import React from 'react';
import {connect} from 'react-redux';
import { userIsActive} from '../actions/auth';

export class TimeoutModal extends React.Component {
  render() {
    return (
      <div>
        You will be logged out in 1 minute for inactivity.
       <p> Are you still there?</p>
        <button type='button' onClick={()=>this.props.dispatch(userIsActive())}>Yes, take me back.</button>
      </div>
    );
  }
}



export default connect()(TimeoutModal)
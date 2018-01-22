import React from 'react';
import {
  Dimmer,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { setFlash } from '../actions/flash';
import { connect } from 'react-redux';
import { setHeaders } from '../actions/headers';
import braintree from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';
import BraintreeSubmitButton from './BraintreeSubmitButton';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class BraintreeDrop extends React.Component {
  state = { 
    loaded: false, 
    token: '',
    transactionId: '',
    redirect: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    axios.get('/api/braintree_token')
      .then( res => {
        const { data: token, headers } = res;
        dispatch(setHeaders(headers));
        this.setState({ token, loaded: true });
      })
      .catch( res => {
        dispatch(setHeaders(res.headers));
        dispatch(setFlash('Something Went Wrong', 'red'));
      });
  }

  handlePaymentMethod = (payload) => {
    const { dispatch, amount } = this.props;

    axios.post('/api/payment', { amount, ...payload })
      .then( res => {
        const { headers, data: transactionId } = res;
        dispatch(setHeaders(headers));
        this.setState({ redirect: true, transactionId })
      })
      .catch( res => {
        dispatch(setFlash('Error Posting Payment', 'red'));
        dispatch(setHeaders(res.headers));
        window.location.reload();
      });
  }

  render() {
    const { loaded, token, redirect, transactionId } = this.state;

    if (redirect) {
      return (
        <Redirect to={{
          pathname: '/payment_success',
          state: { amount: this.props.amount, transactionId }
        }} />
      )
    }

    if (loaded) {
      return (
        <Segment basic textAlign="center">
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={token}
            handlePaymentMethod={this.handlePaymentMethod}
            renderSubmitButton={BraintreeSubmitButton}
          />
        </Segment>
      )
    } else {
      return (
        <Dimmer active>
          <Loader>Loading Payment Experience. Please wait...</Loader>
        </Dimmer>
      )
    }
  }

}

export default connect()(BraintreeDrop);


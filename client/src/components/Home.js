import React, { Component } from 'react';
import { 
  Header,
  Segment,
  Input,
  Label,
  Divider,
  Image,
} from 'semantic-ui-react';
import BraintreeDrop from './BraintreeDrop';

class Home extends Component {
  state = { amount: 150.5 }

  render() {
    const { amount } = this.state;

    return (
      <Segment basic textAlign="center">
        <Header as="h1" textAlign="center">React Payments</Header>
        <Image 
          centered 
          size='small' 
          src='http://www.homedeliveryscript.com/uploads/general-store.jpg' 
          alt="item"
        />
        <Label color="green">Payment Amount</Label>
        <Input value={amount} disabled style={{ fontSize: '18px' }} />
        <Divider />
        <BraintreeDrop amount={amount} />
      </Segment>
    );
  }
}

export default Home;


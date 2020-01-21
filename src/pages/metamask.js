import React, { Component } from "react";

import Web3 from "web3";
import axios from "axios";

const MIN_AMOUNT_OF_TOKEN = 1;

class Metamask extends Component {
  state = {
    address: "",
    signMessage: "Coin Amount Check",
    signature: "",
    ecRecoverAddress: "",
    tokenBalance: -1
  };

  signAndConfirm = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const address = await web3.eth.getAccounts();

    const signature = await web3.eth.personal.sign(
      this.state.signMessage,
      address[0]
    );

    // If you have the original message and the signed message, you can discover the signing account address using web3.eth.personal.ecRecover (See example below)
    const ecRecoverAddress = await web3.eth.personal.ecRecover(
      this.state.signMessage,
      signature
    );

    this.setState({ address: address[0] });
    this.setState({ signature: signature });
    this.setState({ ecRecoverAddress: ecRecoverAddress });

    // check balance endpoint - https://api.tokenbalance.com/token/$CONTRACT/$ETH_ADDRESS
    // bat - https://api.tokenbalance.com/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef/$ETH_ADDRESS
    // storm - https://api.tokenbalance.com/token/0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433/$ETH_ADDRESS

    const tokenBalanceEndpoint =
      "https://api.tokenbalance.com/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef/" +
      address;

    const tokenBalanceResponse = await axios.get(tokenBalanceEndpoint);
    console.log(tokenBalanceResponse);

    this.setState({ tokenBalance: tokenBalanceResponse.data.balance });
  };

  componentDidMount() {
    this.signAndConfirm();
  }
  render() {
    let statusMessage = "";

    if (this.state.tokenBalance == -1) {
      statusMessage = <h1>Please check metamask and sign the message!</h1>;
    } else if (this.state.tokenBalance >= MIN_AMOUNT_OF_TOKEN) {
      statusMessage = <h1>Verified! You have enough tokens to qualify</h1>;
    } else if (this.state.tokenBalance < MIN_AMOUNT_OF_TOKEN) {
      statusMessage = <h1>Not Enough Tokens!</h1>;
    }
    return (
      <div>
        <h1>Metamask</h1>
        <hr />
        {statusMessage}
        <hr />
        <p>Metamask address: {this.state.address}</p>
        <p>Signed Result: {this.state.signature}</p>
        <p>Recover Address From Signed Result: {this.state.ecRecoverAddress}</p>
        <p>Token Balance: {this.state.tokenBalance}</p>
      </div>
    );
  }
}

export default Metamask;

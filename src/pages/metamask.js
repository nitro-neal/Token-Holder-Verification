import React, { Component } from "react";
import Web3 from "web3";
import axios from "axios";
import {
  MDBJumbotron,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBCardBody,
  MDBCardText,
  MDBAlert,
  MDBCardTitle
} from "mdbreact";

const MIN_AMOUNT_OF_TOKEN = 1;

class Metamask extends Component {
  state = {
    address: "",
    signMessage: "Coin Amount Check",
    signature: "",
    ecRecoverAddress: "",
    tokenBalance: -1,
    buttonClicked: false
  };

  signAndConfirm = async () => {
    this.setState({ buttonClicked: true });
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

    // check balance endpoint - https://api.tokenbalance.com/token/$CONTRACT/$ETH_ADDRESS
    // bat - https://api.tokenbalance.com/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef/$ETH_ADDRESS
    // storm - https://api.tokenbalance.com/token/0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433/$ETH_ADDRESS

    const tokenBalanceEndpoint =
      "https://api.tokenbalance.com/token/0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433/" +
      address;

    const tokenBalanceResponse = await axios.get(tokenBalanceEndpoint);

    this.setState({ address: address[0] });
    this.setState({ signature: signature });
    this.setState({ ecRecoverAddress: ecRecoverAddress });
    this.setState({ tokenBalance: tokenBalanceResponse.data.balance });
  };

  render() {
    let statusMessage = "";

    if (this.state.tokenBalance == -1) {
      statusMessage = (
        <MDBAlert color="primary">
          Please check your wallet and sign the message!
        </MDBAlert>
      );
    } else if (this.state.tokenBalance >= MIN_AMOUNT_OF_TOKEN) {
      statusMessage = (
        <MDBAlert color="success">
          Verified! You have enough tokens to qualify{" "}
        </MDBAlert>
      );
    } else if (this.state.tokenBalance < MIN_AMOUNT_OF_TOKEN) {
      statusMessage = <MDBAlert color="danger">Not Enough Tokens! </MDBAlert>;
    }
    return (
      <div>
        <MDBContainer className="mt-5 text-center">
          <MDBRow>
            <MDBCol>
              <MDBJumbotron>
                <MDBCardBody>
                  <MDBCardTitle className="h2">Metamask</MDBCardTitle>
                  <p className="blue-text my-4 font-weight-bold">
                    Sign Transaction To Prove Token Amount
                  </p>

                  <hr className="my-4" />
                  {this.state.buttonClicked === false ? (
                    <div className="pt-2">
                      <MDBCardText>
                        Simply sign a message verifying that you own your keys.
                        A notification from your wallet will appear asking you
                        to sign the message. NOTE: You need metamask or another
                        web3 wallet to use this.
                      </MDBCardText>
                      <MDBBtn
                        onClick={this.signAndConfirm}
                        color="primary"
                        className="waves-effect"
                      >
                        Verify <MDBIcon far icon="gem" />
                      </MDBBtn>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <hr />
                      {statusMessage}
                      <hr />
                      <p>Metamask address: {this.state.address}</p>
                      <p>Signed Result: {this.state.signature}</p>
                      <p>
                        Recover Address From Signed Result:{" "}
                        {this.state.ecRecoverAddress}
                      </p>
                      <p>Token Balance: {this.state.tokenBalance}</p>
                    </div>
                  )}
                </MDBCardBody>
              </MDBJumbotron>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Metamask;

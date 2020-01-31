import React, { Component } from "react";
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
import uuidv4 from "uuid/v4";
import Web3 from "web3";

const MIN_AMOUNT_OF_TOKEN = 1;

// Create web3 from the given provider (this can be metamask or trust wallet or any number of wallets)
const web3 = new Web3(Web3.givenProvider);

class ServerMock {
  constructor() {
    this.addressToVerify = "";
    // Create unique message for every user
    let random = uuidv4();
    this.signMessage = "Coin Amount Check " + random;
  }

  // Give random unique sign message to every user
  getSignMessage = async address => {
    this.addressToVerify = address;
    return this.signMessage;
  };

  // This function takes the signature given by the user and can now verify if he has signed the message given to him
  verifyThatIAmTheOwner = async signature => {
    let hasEnoughBalance = false;
    let verifiedOwner = false;

    // If you have the original message and the signed message, you can discover the signing account address using web3.eth.personal.ecRecover (See example below)
    const ecRecoverAddress = await web3.eth.personal.ecRecover(
      this.signMessage,
      signature
    );

    // The signature matches the original so this person is legit
    if (ecRecoverAddress.toLowerCase() === this.addressToVerify.toLowerCase()) {
      verifiedOwner = true;
    }

    // check balance endpoint - https://api.tokenbalance.com/token/$CONTRACT/$ETH_ADDRESS - bat: 0x0d8775f648430679a709e98d2b0cb6250d2887ef - storm: 0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433E
    const tokenBalanceEndpoint =
      "https://api.tokenbalance.com/token/0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433/" +
      this.address;

    const tokenBalanceResponse = await axios.get(tokenBalanceEndpoint);

    if (tokenBalanceResponse.data.balance > MIN_AMOUNT_OF_TOKEN) {
      hasEnoughBalance = true;
    }

    if (hasEnoughBalance == true && verifiedOwner == true) {
      return true;
    } else {
      return false;
    }
  };
}

class Metamask extends Component {
  state = {
    address: "",
    verified: undefined,
    signature: "",
    tokenBalance: -1,
    buttonClicked: false
  };

  signAndConfirm = async () => {
    let serverMock = new ServerMock();
    console.log(serverMock);
    this.setState({ buttonClicked: true });

    // Request Access for storm.io/validation to have permission to interact with metamask
    await web3.eth.requestAccounts();

    // Get the address from metamask
    const address = await web3.eth.getAccounts();

    // Get the sign message challenge for address
    let signMessage = await serverMock.getSignMessage(address[0]);

    // Get signature off of sign message that was returned from server
    const signature = await web3.eth.personal.sign(signMessage, address[0]);

    // Give signature and confirm if server gives me verification
    let verified = await serverMock.verifyThatIAmTheOwner(signature);

    this.setState({ address: address[0] });
    this.setState({ signature: signature });
    this.setState({ verified: verified });

    console.log("verified?");
    console.log(verified);
  };

  render() {
    let statusMessage = "";

    if (this.state.verified === undefined) {
      statusMessage = (
        <MDBAlert color="primary">
          Please check your wallet and sign the message!
        </MDBAlert>
      );
    } else if (this.state.verified === true) {
      statusMessage = (
        <MDBAlert color="success">
          Verified! You have enough tokens to qualify{" "}
        </MDBAlert>
      );
    } else if (this.state.verified === false) {
      statusMessage = <MDBAlert color="danger">Not Enough Tokens! </MDBAlert>;
    }
    return (
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
                      Simply sign a message verifying that you own your keys. A
                      notification from your wallet will appear asking you to
                      sign the message. NOTE: You need metamask or another web3
                      wallet to use this.
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
                  </div>
                )}
              </MDBCardBody>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Metamask;

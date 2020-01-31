import React, { Component } from "react";
import WalletConnect from "@trustwallet/walletconnect";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
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

const bridge = "https://bridge.walletconnect.org";

// https://bridge.walletconnect.org

// import {
//   walletConnectInit,
//   isWalletConnected
// } from "../helpers/WalletConnectHelper";

class TrustWalletConnect extends Component {
  state = { buttonClicked: false };

  connectToWalletConnect = async () => {
    this.setState({ buttonClicked: false });
    const walletConnector = new WalletConnect({ bridge });
    window.walletConnector = walletConnector;
    await walletConnector.killSession();
    await walletConnector.createSession();
    const uri = walletConnector.uri;

    console.log(uri);

    // display QR Code modal
    WalletConnectQRCodeModal.open(uri, () => {
      console.log("QR Code Modal closed");
    });

    // subscribe to events
    this.subscribeToEvents(walletConnector, this.onConnected);
  };

  onConnected = params => {
    console.log("ON CONNECTED!");
    console.log(params);
  };

  subscribeToEvents = (walletConnector, onConnectedCallback) => {
    walletConnector.on("session_update", async (error, payload) => {
      console.log('walletConnector.on("session_update")');

      if (error) {
        throw error;
      }

      // const { chainId, accounts } = payload.params[0];
      // this.onSessionUpdate(accounts, chainId);
    });

    walletConnector.on("connect", (error, payload) => {
      console.log('walletConnector.on("connect")'); // tslint:disable-line

      if (error) {
        throw error;
      }

      walletConnector
        .getAccounts()
        .then(result => {
          // Returns the accounts
          console.log(result);
          const account = result.find(account => account.network === 714);
          console.log("ACCOUNT:", account);
          console.log("WALLET CONNECT ACCOUNTS RESULTS " + account.address);
          //   console.log("ADDR:", crypto.decodeAddress(account.address));

          onConnectedCallback(payload.params[0]);
        })
        .catch(error => {
          // Error returned when rejected
          console.error(error);
        });

      console.log(payload.params[0]);
    });

    walletConnector.on("disconnect", (error, payload) => {
      console.log('walletConnector.on("disconnect")'); // tslint:disable-line

      if (error) {
        throw error;
      }

      WalletConnectQRCodeModal.close();
      // this.onDisconnect();
    });

    if (walletConnector.connected) {
      const { chainId, accounts } = walletConnector;
      const address = accounts[0];

      // return walletConnect
    }
  };

  componentDidMount() {}
  render() {
    return (
      <MDBContainer className="mt-5 text-center">
        <MDBRow>
          <MDBCol>
            <MDBJumbotron>
              <MDBCardBody>
                <MDBCardTitle className="h2">
                  Trust Wallet WalletConnect
                </MDBCardTitle>
                <p className="blue-text my-4 font-weight-bold">
                  Scan qrcode code from Trust Wallet to prove token amount
                </p>

                <hr className="my-4" />
                {this.state.buttonClicked === false ? (
                  <div className="pt-2">
                    <MDBCardText>
                      Simply scan the qr code from the trust wallet on your
                      phone. A connection will be established and you can verify
                      if you have enough tokens.
                    </MDBCardText>
                    <MDBBtn
                      onClick={this.connectToWalletConnect}
                      color="primary"
                      className="waves-effect"
                    >
                      Verify <MDBIcon far icon="gem" />
                    </MDBBtn>
                  </div>
                ) : (
                  <div className="pt-2">
                    <hr />
                    {/* {statusMessage} */}
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
    );
  }
}

export default TrustWalletConnect;

import React, { Component } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink
} from "mdbreact";

import Metamask from "../pages/Metamask";
import TrustWalletConnect from "../pages/TrustWalletConnect";

class TopTabs extends Component {
  state = {
    items: {
      default: "1"
    }
  };

  togglePills = (type, tab) => e => {
    e.preventDefault();
    if (this.state.items[type] !== tab) {
      let items = { ...this.state.items };
      items[type] = tab;
      this.setState({
        items
      });
    }
  };

  render() {
    return (
      <MDBContainer className="mt-4">
        <MDBRow>
          <MDBCol md="12">
            <h2>Token Holder Verification</h2>
            <MDBNav className="mt-5 nav-pills">
              <MDBNavItem>
                <MDBNavLink
                  link
                  to="#"
                  active={this.state.items["default"] === "1"}
                  onClick={this.togglePills("default", "1")}
                >
                  Metamask
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  link
                  to="#"
                  active={this.state.items["default"] === "2"}
                  onClick={this.togglePills("default", "2")}
                >
                  Trust Wallet WalletConnect
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  link
                  to="#"
                  active={this.state.items["default"] === "3"}
                  onClick={this.togglePills("default", "3")}
                >
                  Other
                </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
            <MDBTabContent activeItem={this.state.items["default"]}>
              <MDBTabPane tabId="1">
                <Metamask />
              </MDBTabPane>
              <MDBTabPane tabId="2">{/* <TrustWalletConnect /> */}</MDBTabPane>
              <MDBTabPane tabId="3">
                <p>Other</p>
              </MDBTabPane>
            </MDBTabContent>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
export default TopTabs;

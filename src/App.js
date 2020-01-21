import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Metamask from "./pages/metamask";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/metamask">Metamask</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/metamask">
              <Metamask />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopTabs from "./components/TopTabs";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/">
              <TopTabs />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;

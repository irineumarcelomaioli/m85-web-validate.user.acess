import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import WebSite from "./pages/site/WebSite";
import SystemLogIn from "./pages/system/SystemLogIn";
import SystemHome from "./pages/system/SystemHome";
import Tabela from "./pages/system/Tabela";
import Usuario from "./pages/system/Usuario";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={WebSite} />
          <Route path="/systemlogin" exact component={SystemLogIn} />
          <Route path="/systemhome" exact component={SystemHome} />
          <Route path="/tabela" exact component={Tabela} />
          <Route path="/usuario" exact component={Usuario} />
        </Switch>
      </Router>
    </>
  );
}

export default App;

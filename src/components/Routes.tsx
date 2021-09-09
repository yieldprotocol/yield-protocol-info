import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/strategies">
        {/* <Strategies /> */}
      </Route>
      <Route exact path="/assets">
        {/* <Assets /> */}
      </Route>

      <Redirect to="/" />
    </Switch>
  </>
);

export default Routes;

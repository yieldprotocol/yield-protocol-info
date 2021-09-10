import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Assets from './views/Assets';
import Strategies from './views/Strategies';
import Asset from './views/Asset';
import Strategy from './views/Strategy';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/strategies">
        <Strategies />
      </Route>
      <Route path="/strategies:strategy">
        <Strategy />
      </Route>
      <Route exact path="/assets">
        <Assets />
      </Route>
      <Route path="/assets:asset">
        <Asset />
      </Route>

      <Redirect to="/" />
    </Switch>
  </>
);

export default Routes;

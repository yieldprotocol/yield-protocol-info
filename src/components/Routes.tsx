import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home';
import SeriesList from './views/SeriesList';
import Series from './views/Series';
import Strategies from './views/Strategies';
import Strategy from './views/Strategy';
import Assets from './views/Assets';
import Asset from './views/Asset';
import Governance from './views/Governance';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/series">
        <SeriesList />
      </Route>
      <Route path="/series/:id">
        <Series />
      </Route>
      <Route exact path="/strategies">
        <Strategies />
      </Route>
      <Route path="/strategies/:id">
        <Strategy />
      </Route>
      <Route exact path="/assets">
        <Assets />
      </Route>
      <Route path="/assets/:id">
        <Asset />
      </Route>
      <Route exact path="/governance">
        <Governance />
      </Route>

      <Redirect to="/" />
    </Switch>
  </>
);

export default Routes;

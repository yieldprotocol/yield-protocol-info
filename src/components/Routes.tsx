import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Strategies from './views/Strategies';
import Strategy from './views/Strategy';
import SeriesList from './views/SeriesList';
import Series from './views/Series';
import Assets from './views/Assets';
import Asset from './views/Asset';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/series">
        <SeriesList />
      </Route>
      <Route exact path="/strategies">
        <Strategies />
      </Route>
      <Route exact path="/assets">
        <Assets />
      </Route>
      <Route path="/series/:id">
        <Series />
      </Route>
      <Route path="/strategy/:id">
        <Strategy />
      </Route>
      <Route path="/assets/:id">
        <Asset />
      </Route>

      <Redirect to="/" />
    </Switch>
  </>
);

export default Routes;

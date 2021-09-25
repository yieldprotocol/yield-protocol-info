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
import Roles from './views/Roles'
import Role from './views/Role';
import Contracts from './views/Contracts';
import Contract from './views/Contract';
import Vaults from './views/Vaults';
import Vault from './views/Vault';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/contracts">
        <Contracts />
      </Route>
      <Route path="/contracts/:addr" component={Contract} />

      <Route exact path="/series">
        <SeriesList />
      </Route>
      <Route path="/series/:id" component={Series} />

      <Route exact path="/strategies">
        <Strategies />
      </Route>
      <Route path="/strategies/:id" component={Strategy} />

      <Route exact path="/assets">
        <Assets />
      </Route>
      <Route path="/assets/:id" component={Asset} />

      <Route exact path="/vaults">
        <Vaults />
      </Route>
      <Route path="/vaults/:id" component={Vault} />

      <Route exact path="/governance">
        <Governance />
      </Route>
      <Route exact path="/roles">
        <Roles />
      </Route>
      <Route path="/roles/:addr" component={Role} />
      <Redirect to="/" />
    </Switch>
  </>
);

export default Routes;

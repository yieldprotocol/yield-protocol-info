import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import SeriesList from './views/SeriesList';
import Series from './views/Series';
import Strategies from './views/Strategies';
import Strategy from './views/Strategy';
import Assets from './views/Assets';
import Asset from './views/Asset';
import Governance from './views/Governance';
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
      <Route path="/contracts/:addr/events" component={Contract} />
      <Route path="/contracts/:addr/roles" component={Role} />

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
      <Route path="/governance/:subnav" component={Governance} />
    </Switch>
  </>
);

export default Routes;

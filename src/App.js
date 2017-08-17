import React, { Component } from "react";
import Queue from './Queue';
import { Route, Switch } from 'react-router';

export default class App extends Component {
  render() {
    return (
      <main className="app">
        <Switch>
          <Route path="/queue/:uid" strict exact component={Queue} />
        </Switch>
      </main>
    );
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';

class Hjem extends React.component {
  render() {
    return (
      <div>
        Epost: <input type='text' ref='brukernavn' />
        Passord: <input type='password' ref='passord' />
        <button ref='loggInn'>Logg inn</button>
      </div>
    )
  }
}

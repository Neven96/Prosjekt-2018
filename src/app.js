import React from "react";
import ReactDOM from "react-dom";
import {Link, HashRouter, Switch, Route} from "react-router-dom";
import {bruker} from "./sql_server";

class Hjem extends React.Component {
  render() {
    return (
      <div>
        <h1>Røde Kors</h1>
        <div>
          <Link to="/">Hjem</Link>
          <span> </span>
          <Link to="/hjelp">Hjelp</Link>
          <span> </span>
          <Link to="/logginn">Logg inn</Link>
        </div>
      </div>
    );
  }
}

class Hjelp extends React.Component {
  render() {
    return(
      <div>
        <p>"Hei, velkommen til hjelpsiden for Røde Kors, her får du hjelp til å ikke suge"</p>
      </div>
    );
  }
}

class LoggInn extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        Epost: <input type="text" ref="brukernavnInput" />
        <br></br>
        Passord: <input type="password" ref="passordInput" />
        <br></br>
        <button ref="loggInnKnapp">Logg inn</button>
      </div>
    )
  }

  componentDidMount() {
    let medlemsNr;
    this.refs.loggInnKnapp.onclick = () => {
      bruker.loggInnBruker(this.refs.brukernavnInput.value, this.refs.passordInput.value, (result) => {
        this.refs.brukernavnInput.value = "";
        this.refs.passordInput.value = "";
        if(result[0] != undefined) {
          medlemsNr = result[0].Medlemsnr;
        }
        else {
          console.log("Ingen epost");
        }
        console.log(medlemsNr);
      });
      bruker.hentBruker(medlemsNr, (result) => {
        this.bruker = result;
        this.forceUpdate();
        medlemsNr = " ";
      });
    }
  }
}

class Profil extends React.Component {
  constructor(props) {
    super(props);

    this.bruker = {};

    this.medlemsnr = props.match.params.medlemsnr;
  }
  render() {
    return (
      <div>
        <ul>
          <li>{this.bruker.Fornavn+" "+this.bruker.Etternavn}</li>
          <li>{this.bruker.Adresse}</li>
          <li>{this.bruker.Telefon}</li>
          <li>{this.bruker.Epost}</li>
          <li>{this.bruker.Medlemsnr}</li>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    bruker.hentBruker(10000, (result) => {
      this.bruker = result;
      this.forceUpdate();
    })
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Hjem />
      <Switch>
        <Route exact path="/" />
        <Route exact path="/hjelp" component={Hjelp} />
        <Route exact path="/logginn" component={LoggInn} />
        <Route exact path="/bruker/:medlemsnr" component={Profil} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById("root"));

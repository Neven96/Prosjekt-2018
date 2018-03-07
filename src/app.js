import React from "react";
import ReactDOM from "react-dom";
import {Link, HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {createHashHistory} from "history";
import {bruker} from "./sql_server";

export const history = createHashHistory();
var medlemsNr;
var erInnlogget = false;

class Hjem extends React.Component {
  render() {
    if (!erInnlogget) {
      return (
        <div>
          <h1>Røde Kors +</h1>
          <div>
            <hr />
            <span><Link to="/hjem">Hjem</Link> </span>
            <span><Link to="/hjelp">Hjelp</Link> </span>
            <span><Link to="/logginn">Logg inn</Link></span>
            <hr />
          </div>
          <div>
            <p></p>
          </div>
        </div>
      );
    }
    if (erInnlogget) {
      return (
        <div>
          <h1>Røde Kors +</h1>
          <div>
            <hr />
            <span><Link to="/hjem">Hjem</Link> </span>
            <span><Link to="/hjelp">Hjelp</Link> </span>
            <span><Link to="/bruker/${medlemsNr}">Profil</Link> </span>
            <span><button ref="loggUtKnapp" onClick={() => {erInnlogget = false,
              history.push("/hjem/"),
              console.log("Logget ut"),
              this.forceUpdate()}}>Logg ut</button></span>
            <hr />
          </div>
          <div>
            <p></p>
          </div>
        </div>
      );
    }
  }

  componentDidMount() {
    history.push("/hjem/");
  }
}

class Nyheter extends React.Component {
  render() {
    return(
      <div>
        <p>Nyheter om Røde Kors og andre ting tang</p>
        <p>Breaking News!!!</p>
        <p>Røde Kors får nytt vaktsystem</p>
      </div>
    );
  }
}

class Hjelp extends React.Component {
  render() {
    return(
      <div>
        <p>Hei, velkommen til hjelpsiden for Røde Kors, her får du hjelp</p>
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
        <p ref="feilInnlogging"></p>
        Epost: <input type="text" ref="brukernavnInput" /><br />
        Passord: <input type="password" ref="passordInput" />
        <span><Link to="/glemtpassord">Glemt passord</Link></span><br />
        <button ref="loggInnKnapp">Logg inn</button>
        <p>Har du ikke bruker, registrer deg <span><Link to="/registrerBruker">her</Link></span></p>
      </div>
    )
  }

  componentDidMount() {
    this.refs.loggInnKnapp.onclick = () => {
      medlemsNr = "";
      bruker.loggInnBruker(this.refs.brukernavnInput.value, this.refs.passordInput.value, (result) => {
        this.refs.brukernavnInput.value = "";
        this.refs.passordInput.value = "";
        if(result != undefined) {
          medlemsNr = result.Medlemsnr;
          console.log("Logget inn");
          history.push("/hjem/");
          erInnlogget = true;
        }
        else {
          console.log("Feil epost/passord");
          this.refs.feilInnlogging.innerText = "Feil epost/passord";
        }
        console.log(medlemsNr);
      });
    }
  }
}

class GlemtPassord extends React.Component {
  render() {
    return(
      <div>
        <p>Passord kan huskes her</p>
      </div>
    );
  }
}

class RegistrerBruker extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        Fornavn*: <input type="text" ref="registrerFnavnInput" size="20" />
        Etternavn*: <input type="text" ref="registrerEnavnInput" size="20" />
        <br></br>
        Mobil*: <input type="number" ref="registrerTlfInput" />
        <br></br>
        Adresse*: <input type="text" ref="registrerAdresseInput" />
        <br></br>
        Postnummer*: <input type="number" ref="registrerPostnrInput" maxLength="4" size="4" />
        Poststed*: <input type="text" ref="registrerPoststedInput" size="20" />
        <br></br>
        Epost*: <input type="text" ref="registrerEpostInput" />
        <br></br>
        Passord*: <input type="password" ref="registrerPassordInput" />
        <br></br>
        <p ref="feilRegistrering"></p>
        <button ref="registrerKnapp">Registrer</button>
      </div>
    );
  }

  componentDidMount() {
    let fnavn; let enavn; let tlf; let adresse; let postnr; let poststed; let epost; let passord;

    this.refs.registrerKnapp.onclick = () => {
      fnavn = this.refs.registrerFnavnInput.value;
      enavn = this.refs.registrerEnavnInput.value;
      tlf = this.refs.registrerTlfInput.value;
      adresse = this.refs.registrerAdresseInput.value;
      postnr = this.refs.registrerPostnrInput.value;
      poststed = this.refs.registrerPoststedInput.value;
      epost = this.refs.registrerEpostInput.value;
      passord = this.refs.registrerPassordInput.value;

      if (erTom(fnavn) || erTom(enavn) || erTom(tlf) || erTom(adresse) || erTom(epost) || erTom(passord)) {
        this.refs.feilRegistrering.innerText = "Du må ha med alle feltene";
      } else {
        bruker.eksistererBrukerEpost(epost, (result) => {
          console.log(result);
          if (result == undefined) {
            bruker.eksistererBrukerTlf(tlf, (result) => {
              console.log(result);
              if (result == undefined) {
                bruker.registrerBruker(fnavn, enavn, tlf, adresse, postnr, poststed, epost, passord, (result) => {
                  this.refs.registrerFnavnInput.value = "";
                  this.refs.registrerEnavnInput.value = "";
                  this.refs.registrerTlfInput.value = "";
                  this.refs.registrerAdresseInput.value = "";
                  this.refs.registrerPostnrInput.value = "";
                  this.refs.registrerPoststedInput.value = "";
                  this.refs.registrerEpostInput.value = "";
                  this.refs.registrerPassordInput.value = "";
                  history.push("/logginn");
                  console.log("Registrert");
                });
              }
              else {
                this.refs.feilRegistrering.innerText = "Brukeren er allerede registrert";
              }
            });
          }
          else {
            this.refs.feilRegistrering.innerText = "Brukeren er allerede registrert";
          }
        });
      }
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
        <p><Link to="/bruker/${medlemsNr}/redigerprofil">Rediger profil</Link></p>
        <ul>
          <li>{this.bruker.Fornavn+" "+this.bruker.Etternavn}</li>
          <li>{this.bruker.Adresse} "Postnummer" "Poststed"</li>
          <li>{this.bruker.Telefon}</li>
          <li>{this.bruker.Epost}</li>
          <li>{this.bruker.Medlemsnr}</li>
        </ul>
        <p><Link to="/bruker/${medlemsNr}/kalender">Kommende arrangementer</Link></p>
      </div>
    );
  }

  componentDidMount() {
    bruker.hentBruker(medlemsNr, (result) => {
      this.bruker = result;
      this.forceUpdate();
    })
  }
}

class RedigerProfil extends React.Component {
  render() {
    return(
      <div>
        <p>Her kan man redigere profilen sin</p>
      </div>
    );
  }
}

class Kalender extends React.Component {
  render() {
    return (
      <div>
      Kalender kommer her!!!
      </div>
    );
  }

  componentDidMount() {
    let j = 1;
    for (var i = 0; i < 100; i++) {
      j++;
    }
  }
}

function erTom(str) {
  return (!str || 0 === str.length);
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Hjem />
      <Switch>
        <Route exact path="/hjem" component={Nyheter} />
        <Route exact path="/hjelp" component={Hjelp} />
        <Route exact path="/logginn" component={LoggInn} />
        <Route exact path="/glemtpassord" component={GlemtPassord} />
        <Route exact path="/registrerBruker" component={RegistrerBruker} />
        <Route exact path="/bruker/:medlemsnr" component={Profil} />
        <Route exact path="/bruker/:medlemsnr/redigerprofil" component={RedigerProfil} />
        <Route exact path="/bruker/:medlemsnr/kalender" component={Kalender} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById("root"));

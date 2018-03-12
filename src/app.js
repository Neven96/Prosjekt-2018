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
          <h1 ref="overskrift" className="overskrift">Røde Kors +</h1>
          <div>
            <hr />
            <span><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span><Link to="/logginn" className="linker">Logg inn</Link></span>
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
          <h1 ref="overskrift" className="overskrift">Røde Kors +</h1>
          <div>
            <hr />
            <span><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span><Link to="/bruker/${medlemsNr}" className="linker">Profil</Link> </span>
            <span><button ref="loggUtKnapp" className="knapper" onClick={() => {erInnlogget = false,
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
        Epost: <input type="text" ref="brukernavnInput" autoFocus /><br />
        Passord: <input type="password" ref="passordInput" />
        <span><Link to="/glemtpassord" className="linker">Glemt passord</Link></span><br />
        <button ref="loggInnKnapp" className="knapper">Logg inn</button>
        <p>Har du ikke bruker, registrer deg <span><Link to="/registrerBruker" className="linker">her</Link></span></p>
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
        Adresse*: <input type="text" ref="registrerAdrInput" />
        <br></br>
        Postnummer*: <input type="number" ref="registrerPostnrInput" maxLength="4" size="4" />
        Poststed*: <input type="text" ref="registrerPoststedInput" size="20" />
        <br></br>
        Epost*: <input type="text" ref="registrerEpostInput" />
        <br></br>
        Passord*: <input type="password" ref="registrerPassordInput" />
        <br></br>
        <p ref="feilRegistrering"></p>
        <button ref="registrerKnapp" className="knapper">Registrer</button>
      </div>
    );
  }

  componentDidMount() {
    let fnavn; let enavn; let tlf; let adr; let postnr; let poststed; let epost; let passord;

    this.refs.registrerKnapp.onclick = () => {
      fnavn = this.refs.registrerFnavnInput.value;
      enavn = this.refs.registrerEnavnInput.value;
      tlf = this.refs.registrerTlfInput.value;
      adr = this.refs.registrerAdrInput.value;
      postnr = this.refs.registrerPostnrInput.value;
      poststed = this.refs.registrerPoststedInput.value;
      epost = this.refs.registrerEpostInput.value;
      passord = this.refs.registrerPassordInput.value;

      if (erTom(fnavn) || erTom(enavn) || erTom(tlf) || erTom(adr) || erTom(epost) || erTom(passord)) {
        this.refs.feilRegistrering.innerText = "Du må ha med alle feltene";
      } else {
        bruker.eksistererBrukerEpost(epost, (result) => {
          console.log("Epostregistrering fungerer");
          if (result == undefined) {
            bruker.eksistererBrukerTlf(tlf, (result) => {
              console.log("Tlfregistrering fungerer");
              if (result == undefined) {
                bruker.registrerBruker(fnavn, enavn, tlf, adr, postnr, poststed, epost, passord, (result) => {
                  fnavn = "";
                  enavn = "";
                  tlf = "";
                  adr = "";
                  postnr = "";
                  poststed = "";
                  epost = "";
                  passord = "";
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
    this.brukerSted = {};

    this.medlemsnr = props.match.params.medlemsnr;
  }
  render() {
    return (
      <div>
        <p><Link to="/bruker/${medlemsNr}/redigerprofil" className="linker">Rediger profil</Link></p>
        <ul>
          <li>{this.bruker.Fornavn+" "+this.bruker.Etternavn}</li>
          <li>{this.bruker.Adresse+" "+this.brukerSted.Postnr+" "+this.brukerSted.Poststed}</li>
          <li>{this.bruker.Telefon}</li>
          <li>{this.bruker.Epost}</li>
          <li>{this.bruker.Medlemsnr}</li>
        </ul>
        <p><Link to="/bruker/${medlemsNr}/kalender" className="linker">Kommende arrangementer</Link></p>
      </div>
    );
  }

  componentDidMount() {
    bruker.hentBruker(medlemsNr, (result) => {
      this.bruker = result;
      this.forceUpdate();
    });
    bruker.hentBrukerSted(medlemsNr, (result) => {
      this.brukerSted = result;
      this.forceUpdate();
    });
  }
}

class RedigerProfil extends React.Component {
  constructor(props) {
      super(props);

      this.bruker = {};
      this.brukerSted = {};

      this.medlemsnr = props.match.params.medlemsnr;
  }

  render() {
    return(
      <div>
        <input type="text" ref="oppdaterFornavn" />
        <br />
        <input type="text" ref="oppdaterEtternavn" />
        <br />
        <input type="number" ref="oppdaterTlf" />
        <br />
        <input type="text" ref="oppdaterAdr" />
        <br />
        <input type="number" ref="oppdaterPostnr" placeholder="Postnummer" />
        <br />
        <p ref="feilOppdatering"></p>
        <button ref="oppdaterBruker">Oppdater</button>
        <button ref="kansellerOppdatering">Lukk</button>
      </div>
    );
  }

  componentDidMount() {
    let oppFnavn; let oppEnavn; let oppTlf; let oppAdr; let oppPostnr;
    bruker.hentBruker(medlemsNr, (result) => {
      this.bruker = result;
      this.forceUpdate();
      this.refs.oppdaterFornavn.value = this.bruker.Fornavn;
      this.refs.oppdaterEtternavn.value = this.bruker.Etternavn;
      this.refs.oppdaterTlf.value = this.bruker.Telefon;
      this.refs.oppdaterAdr.value = this.bruker.Adresse;
    });
    bruker.hentBrukerSted(medlemsNr, (result) => {
      this.brukerSted = result;
      this.forceUpdate();
      this.refs.oppdaterPostnr.value = this.brukerSted.Postnr;
    });

    this.refs.oppdaterBruker.onclick = () => {
      oppFnavn = this.refs.oppdaterFornavn.value;
      oppEnavn = this.refs.oppdaterEtternavn.value;
      oppTlf = this.refs.oppdaterTlf.value;
      oppAdr = this.refs.oppdaterAdr.value;
      oppPostnr = this.refs.oppdaterPostnr.value;
      if (erTom(oppFnavn) || erTom(oppEnavn) || erTom(oppTlf) || erTom(oppAdr) || erTom(oppPostnr)) {
        this.refs.feilOppdatering.innerText = "Ingen felter kan være tomme";
      } else {
        bruker.eksistererStedPostnr(oppPostnr, (result) => {
          console.log(result);
          if (result != undefined) {
            console.log("Postnummeroppdater funker");
            bruker.eksistererBrukerTlfOppdater(medlemsNr, oppTlf, (result) => {
              if (result == undefined) {
                console.log("Tlfsjekkoppdater funker");
                bruker.oppdaterBruker(medlemsNr, oppFnavn, oppEnavn, oppTlf, oppAdr, oppPostnr, (result) => {
                  console.log("Oppdatering funker");
                  history.push("/bruker/${medlemsNr}");
                });
              }
              else {
                this.refs.feilOppdatering.innerText = "Telefonnummeret er allerede i bruk";
              }
            });
          } else {
            this.refs.feilOppdatering.innerText = "Postnummeret eksisterer ikke";
          }
        });
      }
    }


    this.refs.kansellerOppdatering.onclick = () => {
      history.push("/bruker/${medlemsNr}")
    }
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

import React from "react";
import ReactDOM from "react-dom";
import {Link, HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {createHashHistory} from "history";
import {bruker} from "./sql_server";

export const history = createHashHistory();
var medlemsNr;

class Hjem extends React.Component {
  constructor() {
    super();

    this.innloggetBruker;
  }

  render() {
    this.innloggetBruker = bruker.hentBruker();
    if (!this.innloggetBruker) {
      return (
        <div>

          <div>
            <hr />
            <span class="navbar"><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span class="navbar"><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span class="navbar"><Link to="/logginn" className="linker">Logg inn</Link></span>
            <hr />
          </div>
          <div>
            <p></p>
          </div>
        </div>
      );
    }
    else if (this.innloggetBruker) {
      return (
        <div>

          <div>
            <hr />
            <span class="navbar"><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span class="navbar"><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span class="navbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}" className="linker">Profil</Link> </span>
            <span class="navbar"><button ref="loggUtKnapp" className="knapper" onClick={() => {bruker.loggUtBruker(),
              this.forceUpdate(),
              history.push("/hjem/"),
              console.log("Logget ut")}}>Logg ut</button></span>
            <hr />
          </div>
          <div>
            <p></p>
          </div>
        </div>
      );
    }
  }

  componentWillMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.forceUpdate();
  }

  componentDidMount() {
    this.forceUpdate();
    history.push("/hjem/");
  }
}

class Nyheter extends React.Component {
  render() {
    return(
      <div id="forsidetekst">
        <p>Nyheter om Røde Kors og andre ting tang</p>
        <h3>Breaking News!!!</h3>
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
    super();
  }

  render() {
    return (
      <div id="registrerbox">
        <p>Fyll inn alle felter</p>
        Fornavn: <input type="text" ref="registrerFnavnInput" size="20" />
        Etternavn: <input type="text" ref="registrerEnavnInput" size="20" />
        <br></br>
        Mobil: <input type="number" ref="registrerTlfInput" />
        <br></br>
        Adresse: <input type="text" ref="registrerAdrInput" />
        <br></br>
        Postnummer: <input type="number" ref="registrerPostnrInput" maxLength="4" size="4" />
        <input type="text" ref="registrerPoststedInput" readOnly />
        <br></br>
        Epost: <input type="text" ref="registrerEpostInput" />
        <br></br>
        Passord: <input type="password" ref="registrerPassordInput" />
        <br></br>
        <p ref="feilRegistrering"></p>
        <button ref="registrerKnapp" className="knapper">Registrer</button>
      </div>
    );
  }

  componentDidMount() {
    let fnavn; let enavn; let tlf; let adr; let postnr; let poststed; let epost; let passord;

    this.refs.registrerPostnrInput.onblur = () => {
      postnr = this.refs.registrerPostnrInput.value;
      bruker.eksistererStedPostnr(postnr, (result) => {
        if (result != undefined) {
          bruker.hentPoststed(postnr, (result) => {
            this.refs.registrerPoststedInput.value = result.Poststed;
          });
        } else {
          this.refs.registrerPoststedInput.value = "";
        }
      });
    };

    this.refs.registrerKnapp.onclick = () => {
      fnavn = this.refs.registrerFnavnInput.value;
      enavn = this.refs.registrerEnavnInput.value;
      tlf = this.refs.registrerTlfInput.value;
      adr = this.refs.registrerAdrInput.value;
      postnr = this.refs.registrerPostnrInput.value;
      epost = this.refs.registrerEpostInput.value;
      passord = this.refs.registrerPassordInput.value;

      if (erTom(fnavn) || erTom(enavn) || erTom(tlf) || erTom(adr) || erTom(postnr) || erTom(epost) || erTom(passord)) {
        this.refs.feilRegistrering.innerText = "Du må ha med alle feltene";
      } else {
        bruker.eksistererStedPostnr(postnr, (result) => {
          console.log("Postnummerregistrering fungerer");
          if (result != undefined) {
            bruker.eksistererBrukerEpost(epost, (result) => {
              console.log("Epostregistrering fungerer");
              if (result == undefined) {
                bruker.eksistererBrukerTlf(tlf, (result) => {
                  console.log("Tlfregistrering fungerer");
                  if (result == undefined) {
                    bruker.registrerBruker(fnavn, enavn, tlf, adr, postnr, epost, passord, (result) => {
                      fnavn = "";
                      enavn = "";
                      tlf = "";
                      adr = "";
                      postnr = "";
                      epost = "";
                      passord = "";
                      history.push("/logginn");
                      console.log("Registrert");
                    });
                  } else {
                    this.refs.feilRegistrering.innerText = "Brukeren er allerede registrert";
                  }
                });
              } else {
                this.refs.feilRegistrering.innerText = "Brukeren er allerede registrert";
              }
            });
          } else {
            this.refs.feilRegistrering.innerText = "Postnummeret eksisterer ikke";
          }
        });
      }
    };
  }
}

class LoggInn extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="loginbox">
        <p ref="feilInnlogging"></p>
        Epost: <input type="text" ref="brukernavnInput" autoFocus /><br />
        Passord: <input type="password" ref="passordInput" />
        <span><Link to="/glemtpassord" className="linker">Glemt passord</Link></span><br />
        <button ref="loggInnKnapp" className="knapper">Logg inn</button>
        <p>Har du ikke bruker, registrer deg <span><Link to="/registrerBruker" className="linker">her</Link></span></p>
      </div>
    );
  }

  componentDidMount() {
    this.refs.loggInnKnapp.onclick = () => {
      bruker.loggInnBruker(this.refs.brukernavnInput.value, this.refs.passordInput.value, (result) => {
        this.refs.brukernavnInput.value = "";
        this.refs.passordInput.value = "";
        if(result != undefined) {
          console.log("Logget inn");
          history.push("/hjem/");
        }
        else {
          console.log("Feil epost/passord");
          this.refs.feilInnlogging.innerText = "Feil epost/passord";
        }
      });
    };
  }
}

/*
IIIIII II     II II     II  II        IIII      IIIIII    IIIIII  IIIIIII IIIIIIII
  II   IIII   II IIII   II  II      II    II   II        II       II         II
  II   II  II II II  II II  II     II      II II   IIII II   IIII IIII       II
  II   II   IIII II   IIII  II      II    II   II    II  II    II II         II
IIIIII II    III II    III  IIIIIII   IIII      IIIIII    IIIIII  IIIIIII    II
*/
class Profil extends React.Component {
  constructor() {
    super();

    this.bruker = {};
    this.brukerSted = {};
    this.innloggetBruker;
  }
  render() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return (
      <div>
        <p><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/redigerprofil" className="linker">Rediger profil</Link></p>
        <ul>
          <li>{this.innloggetBruker.Fornavn+" "+this.innloggetBruker.Etternavn}</li>
          <li>{this.innloggetBruker.Adresse+" "+this.innloggetBruker.Postnr+" "+this.brukerSted.Poststed}</li>
          <li>{this.innloggetBruker.Telefon}</li>
          <li>{this.innloggetBruker.Epost}</li>
          <li>{this.innloggetBruker.Medlemsnr}</li>
        </ul>
        <p><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/kalender" className="linker">Kommende arrangementer</Link></p>
      </div>
    );
  }

  componentWillMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    bruker.hentBrukerSted(this.innloggetBruker.Medlemsnr, (result) => {
      this.brukerSted = result;
      // this.forceUpdate();
    });
  }

  componentDidMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    bruker.hentBrukerSted(this.innloggetBruker.Medlemsnr, (result) => {
      this.brukerSted = result;
      this.forceUpdate();
    });
  }
}

class RedigerProfil extends React.Component {
  constructor() {
      super();

      this.bruker = {};
      this.brukerSted = {};
      this.innloggetBruker;
  }

  render() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div>
        <input type="text" ref="oppdaterFornavnInput" />
        <br />
        <input type="text" ref="oppdaterEtternavnInput" />
        <br />
        <input type="number" ref="oppdaterTlfInput" />
        <br />
        <input type="text" ref="oppdaterAdrInput" />
        <br />
        <input type="number" ref="oppdaterPostnrInput" />
        <input type="text" ref="oppdaterPoststedInput" readOnly />
        <br />
        <p ref="feilOppdatering"></p>
        <button ref="oppdaterBruker">Oppdater</button>
        <button ref="kansellerOppdatering">Lukk</button>
      </div>
    );
  }

  componentDidMount() {
    let oppFnavn; let oppEnavn; let oppTlf; let oppAdr; let oppPostnr;
    // bruker.hentBruker(medlemsNr, (result) => {
    //   this.bruker = result;
    //   this.forceUpdate();
    //   this.refs.oppdaterFornavnInput.value = this.bruker.Fornavn;
    //   this.refs.oppdaterEtternavnInput.value = this.bruker.Etternavn;
    //   this.refs.oppdaterTlfInput.value = this.bruker.Telefon;
    //   this.refs.oppdaterAdrInput.value = this.bruker.Adresse;
    // });

    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    this.refs.oppdaterFornavnInput.value = this.innloggetBruker.Fornavn;
    this.refs.oppdaterEtternavnInput.value = this.innloggetBruker.Etternavn;
    this.refs.oppdaterTlfInput.value = this.innloggetBruker.Telefon;
    this.refs.oppdaterAdrInput.value = this.innloggetBruker.Adresse;
    this.refs.oppdaterPostnrInput.value = this.innloggetBruker.Postnr;

    bruker.hentBrukerSted(this.innloggetBruker.Medlemsnr, (result) => {
      this.brukerSted = result;
      this.refs.oppdaterPoststedInput.value = this.brukerSted.Poststed;
    });

    this.refs.oppdaterPostnrInput.onblur = () => {
      oppPostnr = this.refs.oppdaterPostnrInput.value;
      bruker.eksistererStedPostnr(oppPostnr, (result) => {
        if (result != undefined) {
          bruker.hentPoststed(oppPostnr, (result) => {
            this.refs.oppdaterPoststedInput.value = result.Poststed;
          });
        } else {
          this.refs.oppdaterPoststedInput.value = "";
        }
      });
    };

    this.refs.oppdaterBruker.onclick = () => {
      oppFnavn = this.refs.oppdaterFornavnInput.value;
      oppEnavn = this.refs.oppdaterEtternavnInput.value;
      oppTlf = this.refs.oppdaterTlfInput.value;
      oppAdr = this.refs.oppdaterAdrInput.value;
      oppPostnr = this.refs.oppdaterPostnrInput.value;
      if (erTom(oppFnavn) || erTom(oppEnavn) || erTom(oppTlf) || erTom(oppAdr) || erTom(oppPostnr)) {
        this.refs.feilOppdatering.innerText = "Ingen felter kan være tomme";
      } else {
        bruker.eksistererStedPostnr(oppPostnr, (result) => {
          console.log(result);
          if (result != undefined) {
            console.log("Postnummeroppdater funker");
            bruker.eksistererBrukerTlfOppdater(this.innloggetBruker.Medlemsnr, oppTlf, (result) => {
              if (result == undefined) {
                console.log("Tlfsjekkoppdater funker");
                bruker.oppdaterBruker(this.innloggetBruker.Medlemsnr, oppFnavn, oppEnavn, oppTlf, oppAdr, oppPostnr, (result) => {
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
    };

    this.refs.kansellerOppdatering.onclick = () => {
      history.push("/bruker/${this.innloggetBruker.Medlemsnr}");
    };
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

import React from "react";
import ReactDOM from "react-dom";
import {Link, HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {createHashHistory} from "history";
import {bruker, arrangement} from "./sql_server";

export const history = createHashHistory();

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
          <div className="navbar">
            <hr />
            <span className="spanbar"><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span className="spanbar"><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span className="spanbar"><Link to="/logginn" className="linker">Logg inn</Link></span>
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
          <div className="navbar">
            <hr />
            <span className="spanbar"><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span className="spanbar"><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span className="spanbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Arrangementer</Link> </span>
            <span className="spanbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}" className="linker">Profil</Link> </span>
            <span className="spanbar"><button ref="loggUtKnapp" className="knapper" onClick={() => {bruker.loggUtBruker(),
              history.push("/hjem/"),
              this.forceUpdate(),
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
      <div id="hjelptekst">
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
        Epost: <input type="text" ref="brukernavnInput" className="logginninput" autoFocus /><br />
        Passord: <input type="password" ref="passordInput" className="logginninput" /><br />
        <span><button ref="loggInnKnapp" className="logginnknapp">Logg inn</button>
        <Link to="/glemtpassord" className="glemtpassordknapp">Glemt passord</Link></span>
        <p>Har du ikke bruker, registrer deg <span><Link to="/registrerBruker" className="knapper">her</Link></span></p>
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
      <div id="profil">
        <p id="redigerprofil"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/redigerprofil" className="redigerprofil">Rediger profil</Link></p>
        <ul id="profilinfo">
          <li>Navn: {this.innloggetBruker.Fornavn+" "+this.innloggetBruker.Etternavn}</li>
          <li>Adresse: {this.innloggetBruker.Adresse+" "+this.innloggetBruker.Postnr+" "+this.brukerSted.Poststed}</li>
          <li>Telefonnummer: {this.innloggetBruker.Telefon}</li>
          <li>Epost: {this.innloggetBruker.Epost}</li>
          <li>Medlemsnummer: {this.innloggetBruker.Medlemsnr}</li>
        </ul>
        <p id="kommendearr"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="kommendearr">Kommende arrangementer</Link></p>
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

      this.brukerSted = {};
      this.innloggetBruker;
  }

  render() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div id="redigerprofil">
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
                  history.push("/bruker/${this.innloggetBruker.Medlemsnr}");
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

/*
II  III     II     II      IIIIIII II     II IIIIII   IIIIIII IIIIII
II III     IIII    II      II      IIII   II II  III  II      II   II
IIII      II  II   II      IIII    II  II II II   III IIII    IIIIII
II III   IIIIIIII  II      II      II   IIII II  III  II      II   II
II  III II      II IIIIIII IIIIIII II    III IIIIII   IIIIIII II    II
*/
let arrid;

class Kalender extends React.Component {
  constructor() {
    super();

    this.innloggetBruker;
  }

  render() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div>
          <div ref="kommendeArrangementer">
            <p>Kommende arrangementer</p>
          </div>
          <Link to="/bruker/${this.innloggetBruker.Medlemsnr}" className="linker">Tilbake</Link>
        </div>
      );
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div>
          <Link to="/bruker/${this.innloggetBruker.Medlemsnr}/adminkalender" className="linker">Opprett arrangement</Link>
          <div ref="kommendeArrangementer">
            <p>Kommende arrangementer</p>
          </div>
          <Link to="/bruker/${this.innloggetBruker.Medlemsnr}" className="linker">Tilbake</Link>
        </div>
      );
    }
  }

  componentDidMount() {
    this.update();
  }

  update() {
    this.refs.kommendeArrangementer.innerText = "";

    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let str; let string; let array; let array2;
    arrangement.hentArrangementer((result) => {
      for (let arr of result) {
        let arrDiv = document.createElement("div");
        arrDiv.className = "arrangementDiv";

        let arrTittel = document.createElement("p");
        let arrNavn = document.createElement("span");
        let arrBeskrivelse = document.createElement("span");
        //Navn og beskrivelse av arrangement
        arrNavn.innerText = arr.arrnavn+"\n";
        arrBeskrivelse.innerText = arr.beskrivelse;
        arrTittel.appendChild(arrNavn);
        arrTittel.appendChild(arrBeskrivelse);

        let arrDatoOppsett = document.createElement("p");
        let arrOppmoteSted = document.createElement("span");
        let arrDag = document.createElement("span");
        let arrOppmoteTid = document.createElement("span");
        let arrStart = document.createElement("span");
        let arrVarighet = document.createElement("span");
        //Dato og oppmøte og sted for arrangement
        if (arr.oppmøtested != null) {
          arrOppmoteSted.innerText = "Sted: "+arr.oppmøtested+"\n";
        } else {
          arrOppmoteSted.innerText = "Sted: Kommer senere \n";
        }
        //Drittgreie for å få dato
        str = arr.startdato;
        if (str != null) {
          string = str.toString();
          array = string.split(" ");
          arrDag.innerText = "Oppmøte: "+array[2]+" "+array[1]+" "+array[3];
        } else {
          arrDag.innerText = "Oppmøte: Dato kommer senere";
        }
        //Oppmøtetid
        array = " ";
        str = arr.oppmøtetid;
        if (str != null) {
          string = str.toString();
          array = string.split(":");
          arrOppmoteTid.innerText = ", Kl: "+array[0]+":"+array[1]+"\n";
        } else {
          arrOppmoteTid.innerText = ", Tidspunkt kommer senere \n";
        }
        //Varighet
        array = " ";
        str = arr.tidstart;
        if (str != null) {
          string = str.toString();
          array = string.split(":");
          arrStart.innerText = "Oppstart: ca. kl "+array[0]+":"+array[1];
          str = arr.tidslutt;
          if (str != null) {
            string = str.toString();
            array2 = string.split(":");
            let timer = array2[0]-array[0];
            let min = array2[1]-array[1];
            arrVarighet.innerText = ", Varighet: ca. "+timer+" timer "+min+" minutter";
          }
          else {
            arrVarighet.innerText = ", Varighet: Ingen oppsatt slutt";
          }
        }

        arrDatoOppsett.appendChild(arrOppmoteSted);
        arrDatoOppsett.appendChild(arrDag);
        arrDatoOppsett.appendChild(arrOppmoteTid);
        arrDatoOppsett.appendChild(arrStart);
        arrDatoOppsett.appendChild(arrVarighet);

        arrDiv.appendChild(arrTittel);
        arrDiv.appendChild(arrDatoOppsett);

        if (this.innloggetBruker.Adminlvl >= 1) {
          let redigerArrKnapp = document.createElement("button");
          let slettArrKnapp = document.createElement("button");

          redigerArrKnapp.onclick = () => {
            history.push("/bruker/:medlemsnr/arrangement/:arrid")
            arrid = arr.arrid;
            return arrid;
          }

          slettArrKnapp.onclick = () => {
            let slett = confirm("Er du sikker på du vil slette arrangement\n"+arr.arrnavn+"?")
            if (slett) {
              arrangement.slettArrangement(arr.arrid, (result) => {
                console.log("Arrangement med navn: "+arr.arrnavn+", og id:"+arr.arrid+" slettet");
                this.update();
              });
            }
          }

          redigerArrKnapp.innerText = "Rediger";
          slettArrKnapp.innerText = "Slett";
          arrDiv.appendChild(redigerArrKnapp);
          arrDiv.appendChild(slettArrKnapp);
        }

        if (this.refs.kommendeArrangementer) {
          this.refs.kommendeArrangementer.appendChild(arrDiv);
        }
      }
    });
  }
}

class KalenderAdmin extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <div ref="opprettArrangementDiv">
          <input type="text" ref="arrNavn" placeholder="Arrangementnavn" /> <br />
          <textarea rows="5" cols="40" ref="arrBeskrivelse" placeholder="Beskrivelse" /> <br />
          <p ref="opprettArrangementAdvarsel"></p>
          <button ref="opprettArrangement">Opprett arrangement</button>
          <button ref="tilbakeArrangement">Lukk</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let arrNavn; let arrBeskrivelse;
    this.refs.opprettArrangement.onclick = () => {
      arrNavn = this.refs.arrNavn.value;
      arrBeskrivelse = this.refs.arrBeskrivelse.value;

      if (erTom(arrNavn) || erTom(arrBeskrivelse)) {
        this.refs.opprettArrangementAdvarsel.innerText = "Fyll inn begge felter!";
      } else {
        arrangement.opprettArrangement(arrNavn, arrBeskrivelse, (result) => {
          console.log("Arrangement opprettet");
          history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer")
        });
      }
    }

    this.refs.tilbakeArrangement.onclick = () => {
      history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer");
    }
  }
}

class RedigerArrangment extends React.Component {
  constructor() {
    super();

    this.arrangment = {};
  }

  render() {
    return(
      <div>
        <div>
          <input type="text" ref="oppdaterArrNavn" placeholder="Arrangementnavn" />
          <br />
          <textarea rows="5" cols="40" ref="oppdaterArrBeskrivelse" placeholder="Beskrivelse" />
        </div>
        <br />
        <div>
          <input type="date" ref="oppdaterDato" />
          <input type="text" ref="oppdaterSted" placeholder="Oppmøtested" />
          <input type="time" ref="oppdaterOppmote" />
          <br />
          <input type="time" ref="oppdaterStartTid" />
          <input type="time" ref="oppdaterSluttTid" />
        </div>
        <br />
        <div>
          <textarea rows="5" cols="40" ref="oppdaterUtstyrsliste" placeholder="Utstyrsliste" />
          <br />
          <input type="number" ref="oppdaterVaktPoeng" placeholder="Vaktpoeng" min="1" />
        </div>
        <button ref="redigerArrangement">Rediger arrangement</button>
        <button ref="tilbakeArrangement">Lukk</button>
      </div>
    );
  }

  componentDidMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let str; let string; let array; let dato; let month;
    arrangement.hentArrangement(arrid, (result) => {
      str = result.startdato;
      if (str != null) {
        string = str.toString();
        array = string.split(" ");
        switch(array[1]) {
          case "Jan":month = "01";break;
          case "Feb":month = "02";break;
          case "Mar":month = "03";break;
          case "Apr":month = "04";break;
          case "May":month = "05";break;
          case "Jun":month = "06";break;
          case "Jul":month = "07";break;
          case "Aug":month = "08";break;
          case "Sep":month = "09";break;
          case "Oct":month = "10";break;
          case "Nov":month = "11";break;
          case "Des":month = "12";break;
        }
        dato = array[3]+"-"+month+"-"+array[2];
      }

      this.refs.oppdaterArrNavn.value = result.arrnavn;
      this.refs.oppdaterArrBeskrivelse.value = result.beskrivelse;
      this.refs.oppdaterDato.value = dato;
      this.refs.oppdaterSted.value = result.oppmøtested;
      this.refs.oppdaterOppmote.value = result.oppmøtetid;
      this.refs.oppdaterStartTid.value = result.tidstart;
      this.refs.oppdaterSluttTid.value = result.tidslutt;
      this.refs.oppdaterUtstyrsliste.value = result.utstyrsliste;
      this.refs.oppdaterVaktPoeng.value = result.vaktpoeng;
    });

    this.refs.tilbakeArrangement.onclick = () => {
      history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer");
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
        <Route exact path="/bruker/:medlemsnr/arrangementer" component={Kalender} />
        <Route exact path="/bruker/:medlemsnr/adminkalender" component={KalenderAdmin} />
        <Route exact path="/bruker/:medlemsnr/arrangement/:arrid" component={RedigerArrangment} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById("root"));

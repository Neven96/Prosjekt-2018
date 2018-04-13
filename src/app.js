import React from "react";
import ReactDOM from "react-dom";
import {Link, HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {createHashHistory} from "history";
import {bruker, arrangement} from "./sql_server";

//Lager en history-bit for kunne bruke history.push
export const history = createHashHistory();

class Hjem extends React.Component {
  constructor() {
    super();

    this.innloggetBruker;
  }

  render() {
    //Henter JSON-objekt og sjekker om det eksisterer
    //Viser dette hvis JSON-objektet ikke eksisterer
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
    //Viser dette hvis JSON-Objektet eksisterer og hvis brukeren er aktivert
    else if (this.innloggetBruker && this.innloggetBruker.Aktivert == 1) {
      return (
        <div>
          <div className="navbar">
            <hr />
            <span className="spanbar"><Link to="/hjem" className="linker">Hjem</Link> </span>
            <span className="spanbar"><Link to="/hjelp" className="linker">Hjelp</Link> </span>
            <span className="spanbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Arrangementer</Link> </span>
            <span className="spanbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}" className="linker">Profil</Link> </span>
            <span className="navbar"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/sok" className="linker">Søk</Link> </span>
            <span className="spanbar"><button ref="loggUtKnapp" className="knapper" onClick={() => {bruker.loggUtBruker(),
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
    //Viser dette hvis JSON-objektet eksisterer og brukeren enten ikke er aktivert eller deaktivert
    else if (this.innloggetBruker && this.innloggetBruker.Aktivert == 0 || this.innloggetBruker.Aktivert == 2) {
      return (
        <div>
          <button ref="loggUtKnapp" className="knapper" onClick={() => {bruker.loggUtBruker(),
            this.forceUpdate(),
            history.push("/"),
            console.log("Logget ut")}}>Logg ut</button>
        </div>
      );
    }
  }

  componentWillMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.forceUpdate();
  }

  componentDidMount() {
    //Pusher direkte til /hjem/ når siden laster, dette er nyhetene
    this.innloggetBruker = bruker.hentBruker();
    history.push("/hjem/");
    this.forceUpdate();
  }
}

class Nyheter extends React.Component {
  constructor() {
    super();

    this.innloggetBruker;
  }

  render() {
    //Henter JSON-objekt og viser dette hvis brukeren ikke er logget inn
    this.innloggetBruker = bruker.hentBruker();
    if (!this.innloggetBruker) {
      return(
        <div id="forsidetekst">
          <p>Nyheter om Røde Kors og andre ting tang</p>
          <h3>Breaking News!!!</h3>
          <p>Røde Kors får nytt vaktsystem</p>
        </div>
      );
    }
    else if (this.innloggetBruker) {
      //Viser dette hvis brukeren er logget inn og aktivert
      if (this.innloggetBruker.Aktivert == 1) {
        return(
          <div id="forsidetekst">
            <p>Nyheter om Røde Kors og andre ting tang</p>
            <h3>Breaking News!!!</h3>
            <p>Røde Kors får nytt vaktsystem</p>
          </div>
        );
      }
      //Viser dette hvis brukeren er logget inn, men ikke aktivert enda
      else if (this.innloggetBruker.Aktivert == 0) {
        return(
          <div id="forsidetekst">
            <p>Brukeren er ikke aktivert</p>
          </div>
        );
      }
      //Viser dette hvis brukeren ikke er aktivert
      else if (this.innloggetBruker.Aktivert == 2) {
        return(
          <div id="forsidetekst">
            <p>Brukeren er deaktivert</p>
          </div>
        );
      }
    }
  }

  componentDidMount() {
    this.innloggetBruker = bruker.hentBruker();
    this.forceUpdate();
  }
}

class Hjelp extends React.Component {
  //Side for hjelp med profil og innlogging og andre ting
  render() {
    return(
      <div id="hjelptekst">
        <p>Hei, velkommen til hjelpsiden for Røde Kors, her får du hjelp</p>
      </div>
    );
  }
}

class GlemtPassord extends React.Component {
  //Side for å få passordet hvis det er glemt
  render() {
    return(
      <div>
        <p>Skriv inn navn og epost for å få passord</p>
        <input type="text" ref="glemtPassordFornavn" placeholder="Fornavn"/>
        <input type="text" ref="glemtPassordEtternavn" placeholder="Etternavn"/>
        <br />
        <input type="text" ref="glemtPassordEpost" placeholder="Epost"/>
        <br />
        <button ref="glemtPassordKnapp">Hent passord</button>
      </div>
    );
  }

  componentDidMount() {
    let fornavn; let etternavn; let epost;

    //Henter passordet og viser det i en alert hvis du har riktig navn og epost
    //"Kjempesikkert..." - Steve Jobs
    //"Det er sånn vi gjør det" - Equifax CEO
    if (erTom(fornavn), erTom(etternavn), erTom(epost)) {
      alert("Du skrev inn feil informasjon");
    } else {
      this.refs.glemtPassordKnapp.onclick = () => {
        fornavn = this.refs.glemtPassordFornavn.value;
        etternavn = this.refs.glemtPassordEtternavn.value;
        epost = this.refs.glemtPassordEpost.value;
        bruker.hentBrukerPassord(fornavn, etternavn, epost, (result) => {
          if (result != undefined) {
            alert("Passordet ditt er: "+result.Passord);
          } else if (result == undefined) {
            alert("Du skrev inn feil informasjon");
          }
        });
      }
    }
  }
}

class RegistrerBruker extends React.Component {
  constructor() {
    super();
  }

  render() {
    //Registrering av bruker med mange div-er for å få det ordentlig lina opp
    return (
      <div id="registrerbox">
        <p>Fyll inn alle felter</p>
        <div className="rad">
          <div>
            <label id="FornavnReg">Fornavn: </label>
          </div>
          <div id="registrerFnavnInput">
            <input type="text" ref="registrerFnavnInput" size="20" />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="EtternavnReg">Etternavn: </label>
          </div>
          <div className="registrer" id="registrerEnavnInput">
            <input type="text" ref="registrerEnavnInput" size="20" />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="TelefonReg">Telefonnummer: </label>
          </div>
          <div className="registrer" id="registrerTlfInput">
            <input type="number" ref="registrerTlfInput" size="20" />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="AdresseReg">Adresse: </label>
          </div>
          <div className="registrer" id="registrerAdrInput">
            <input type="text" ref="registrerAdrInput" size="20" />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="PostnrReg">Postnr: </label>
          </div>
          <div>
            <input id="registrerPostnrInput" type="number" ref="registrerPostnrInput" maxLength="4" size="4" />
            <input id="registrerPoststedInput" type="text" ref="registrerPoststedInput" readOnly />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="EpostReg">Epost: </label>
          </div>
          <div className="registrer" id="registrerEpostInput">
            <input type="text" ref="registrerEpostInput" size="20" />
          </div>
        </div>
        <div className="rad">
          <div>
            <label id="PassordReg">Passord: </label>
          </div>
          <div className="registrer" id="registrerPassordInput">
            <input type="password" ref="registrerPassordInput" size="20" />
          </div>
        </div>
        <p id="feilRegistrering" ref="feilRegistrering" className="feilMelding"></p>
        <button ref="registrerKnapp" className="knapper">Registrer</button>
      </div>
    );
  }

  componentDidMount() {
    let fnavn; let enavn; let tlf; let adr; let postnr; let poststed; let epost; let passord;

    //Henter verdien du skriver i postnrfeltet og gir tilbake tilsvarende kommune
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

      //Sjekker om noen av feltene er tomme, alle kreves for å kunne registrere seg
      if (erTom(fnavn) || erTom(enavn) || erTom(tlf) || erTom(adr) || erTom(postnr) || erTom(epost) || erTom(passord)) {
        this.refs.feilRegistrering.innerText = "Du må ha med alle feltene";
      } else {
        //Sjekker om du har oppgitt et ekte postnummer
        bruker.eksistererStedPostnr(postnr, (result) => {
          console.log("Postnummerregistrering fungerer");
          if (result != undefined) {

            //Sjekker om eposten allerede er i bruk
            bruker.eksistererBrukerEpost(epost, (result) => {
              console.log("Epostregistrering fungerer");
              if (result == undefined) {

                //Sjekker om telefonnummeret allerede er i bruk
                bruker.eksistererBrukerTlf(tlf, (result) => {
                  console.log("Tlfregistrering fungerer");
                  if (result == undefined) {

                    //Registrerer brukeren
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
        <p ref="feilInnlogging" id="feilInnlogging" className="feilMelding"></p>
        Epost: <input type="text" ref="brukernavnInput" className="logginninput" autoFocus /><br />
        Passord: <input type="password" ref="passordInput" className="logginninput" /><br />
        <span><button ref="loggInnKnapp" className="logginnknapp">Logg inn</button>
        <Link to="/glemtpassord" className="glemtpassordknapp">Glemt passord</Link></span>
        <p>Har du ikke bruker, registrer deg <span><Link to="/registrerBruker" className="registrerherknapp">her</Link></span></p>
      </div>
    );
  }

  componentDidMount() {
    //Logger inn brukeren hvis den har riktig epost og passord
    let brukernavn; let passord;
    this.refs.loggInnKnapp.onclick = () => {
      brukernavn = this.refs.brukernavnInput.value;
      passord = this.refs.passordInput.value;

      if(erTom(brukernavn) || erTom(passord)) {
        this.refs.feilInnlogging.innerText = "Feil epost/passord";
      }
      else {
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
      }
    };

    this.refs.passordInput.onkeyup = (event) => {
      event.preventDefault();
      if (event.keyCode === 13) {
        this.refs.loggInnKnapp.click();
      }
    }
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

    this.brukerSted = {};
    this.innloggetBruker;
  }
  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    //Gjør det faktisk for å hente den ut på nytt hvis brukeren oppdaterer profilen sin
    //En måte for å få ut ordentlig informasjon
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return (
      <div id="profil">
        <p id="redigerprofilknapp"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/redigerprofil" className="redigerprofil">Rediger profil</Link></p>
        <ul id="profilinfo">
          <li>Navn: {this.innloggetBruker.Fornavn+" "+this.innloggetBruker.Etternavn}</li>
          <li>Adresse: {this.innloggetBruker.Adresse+" "+this.innloggetBruker.Postnr+" "+this.brukerSted.Poststed}</li>
          <li>Telefonnummer: {this.innloggetBruker.Telefon}</li>
          <li>Epost: {this.innloggetBruker.Epost}</li>
          <li>Medlemsnummer: {this.innloggetBruker.Medlemsnr}</li>
          <li>Vaktpoeng: {this.innloggetBruker.Vaktpoeng}</li>
        </ul>
        <p id="kommendearr"><Link to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="kommendearr">Kommende arrangementer</Link></p>
      </div>
    );
  }

  componentWillMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    bruker.hentPoststed(this.innloggetBruker.Postnr, (result) => {
      this.brukerSted = result;
    });
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    //Henter kommunen til brukeren utifra postnummeret
    bruker.hentPoststed(this.innloggetBruker.Postnr, (result) => {
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
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div id="redigerprofil">
        <input type="text" ref="oppdaterFornavnInput" />
        <br />
        <input type="text" ref="oppdaterEtternavnInput" />
        <br />
        <input type="number" ref="oppdaterTlfInput" maxLength="8" />
        <br />
        <input type="text" ref="oppdaterAdrInput" />
        <br />
        <input type="number" ref="oppdaterPostnrInput" />
        <input type="text" ref="oppdaterPoststedInput" readOnly />
        <br />
        <p ref="feilOppdatering" className="feilMelding"></p>
        <button ref="oppdaterBruker">Oppdater</button>
        <button ref="kansellerOppdatering">Lukk</button>
      </div>
    );
  }

  componentDidMount() {
    let oppFnavn; let oppEnavn; let oppTlf; let oppAdr; let oppPostnr;

    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    this.refs.oppdaterFornavnInput.value = this.innloggetBruker.Fornavn;
    this.refs.oppdaterEtternavnInput.value = this.innloggetBruker.Etternavn;
    this.refs.oppdaterTlfInput.value = this.innloggetBruker.Telefon;
    this.refs.oppdaterAdrInput.value = this.innloggetBruker.Adresse;
    this.refs.oppdaterPostnrInput.value = this.innloggetBruker.Postnr;

    //Henter kommunen til brukeren ut ifra postnummer
    bruker.hentPoststed(this.innloggetBruker.Postnr, (result) => {
      this.brukerSted = result;
      if (this.refs.oppdaterPoststedInput) {
        this.refs.oppdaterPoststedInput.value = this.brukerSted.Poststed;
      }
    });

    //Setter automatisk riktig kommune til postnummer ved å gå ut av tekstboks
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
      if (erTom(oppFnavn) || erTom(oppEnavn) || erTom(oppTlf) || erTom(oppAdr) || erTom(oppPostnr) || oppTlf.length > 8 || oppPostnr.length > 4 || oppTlf.length < 8) {
        this.refs.feilOppdatering.innerText = "Ingen felter kan være tomme";
        if (oppTlf.length > 8 || oppPostnr.length > 4 || oppTlf.length < 8) {
          this.refs.feilOppdatering.innerText = "Telefon eller postnummer er feil lengde";
        }
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
  IIIIII      IIII II  II  III
 III    II  II   III   II III
    III    II  II  II  IIII
II     III  III   II   II III
  IIIIII   II IIII     II  III
*/

let sokMedlemsnr;

class BrukerSok extends React.Component {
  constructor() {
    super();
    this.innloggetBruker;
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div id="soktest">
        <input ref="inn" type="text" autoFocus/> <button ref="sokKnapp">Søk</button>
        <div ref="sokeResultat">
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.refs.inn.oninput = () => {
      this.refs.sokeResultat.innerText = "";
      let input = this.refs.inn.value;

      if (erTom(input)) {
        this.refs.sokeResultat.innerText = "Du må ha et søkeord"
      } else {
        bruker.sokBruker(input, (result) => {
          let sokeliste = document.createElement("ul");
          sokeliste.id="sokeliste"

          for(let medlem of result){
            let navn = document.createElement("li");
            navn.className="sokenavn"

            //Legg farge på brukere her
            if (medlem.Aktivert == 0) {
              navn.className="aktiver"
            }
            if (medlem.Aktivert == 2){
              navn.className="deaktiver";
            }

            navn.innerText = medlem.Fornavn + ' ' + medlem.Etternavn + " ";
            navn.onclick = () => {
              history.push("/bruker/{this.innloggetBruker.Medlemsnr}/sok/{medlem.Medlemsnr}");
              sokMedlemsnr = medlem.Medlemsnr;
              return sokMedlemsnr;
            }

            sokeliste.appendChild(navn);
          }
          this.refs.sokeResultat.appendChild(sokeliste);

          if (result.length == 0) {
            this.refs.sokeResultat.innerText = "Ingen treff";
          }
        });
      }
    }
  }
}

class BrukerSokDetaljer extends React.Component {
  constructor() {
    super();
    this.innloggetBruker;

    this.sokBruker = {};
    this.sokBrukerPoststed = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div>
          <ul>
            <li>Navn: {this.sokBruker.Fornavn} {this.sokBruker.Etternavn}</li>
            <li>Tlf: {this.sokBruker.Telefon}</li>
            <li>Epost: {this.sokBruker.Epost}</li>
          </ul>
          <Link to="/bruker/{this.innloggetBruker.Medlemsnr}/sok">Tilbake</Link>
        </div>
      );
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div ref="brukerSokDetaljer">
          <ul>
            <li>Navn: {this.sokBruker.Fornavn} {this.sokBruker.Etternavn}</li>
            <li>Tlf: {this.sokBruker.Telefon}</li>
            <li>Epost: {this.sokBruker.Epost}</li>
            <li>Adresse: {this.sokBruker.Adresse}</li>
            <li>Postnummer og sted: {this.sokBruker.Postnr} {this.sokBrukerPoststed.Poststed}</li>
          </ul>
          <button ref="aktiveringsKnapp" id="aktiveringsKnapp" className="knapper"></button> <br />
          <select ref="adminLevelSelect"></select>
          <button ref="adminKnapp" id="adminKnapp" className="knapper">Gjør admin</button> <br />
          <button ref="redigerSokBrukerKnapp" id="redigerSokBrukerKnapp" className="knapper">Rediger</button> <br />
          <Link to="/bruker/{this.innloggetBruker.Medlemsnr}/sok">Tilbake</Link>
        </div>
      );
    }
  }

  componentDidMount() {
    this.update();
  }

  update() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    bruker.hentSokBruker(sokMedlemsnr, (result) => {
      this.sokBruker = result;
      if (this.sokBruker) {
        if (this.sokBruker.Medlemsnr == 10017 && this.innloggetBruker.Medlemsnr != 10017) {
          this.sokBruker.Epost = "Hemmelig";
          this.sokBruker.Telefon = "Hemmelig";
        }
        bruker.hentPoststed(this.sokBruker.Postnr, (result) => {
          this.sokBrukerPoststed = result;
          this.forceUpdate();
        });

        if (this.innloggetBruker.Adminlvl >= 1) {
          if (this.sokBruker.Aktivert == 0) {
            this.refs.aktiveringsKnapp.innerText = "Aktiver";
            this.refs.aktiveringsKnapp.onclick = () => {
              bruker.aktiverBruker(this.sokBruker.Medlemsnr, (result) => {
                console.log("Bruker ble aktivert");
                this.tomSelect();
                this.update();
              });
            }
          } else if (this.sokBruker.Aktivert == 1 && this.sokBruker.Medlemsnr != this.innloggetBruker.Medlemsnr && this.sokBruker.Adminlvl <= this.innloggetBruker.Adminlvl) {
            this.refs.aktiveringsKnapp.innerText = "Deaktiver";
            this.refs.aktiveringsKnapp.onclick = () => {
              bruker.deaktiverBruker(this.sokBruker.Medlemsnr, (result) => {
                console.log("Bruker ble deaktivert");
                this.tomSelect();
                this.update();
              });
            }
          } else if (this.sokBruker.Aktivert == 2 || this.sokBruker.Medlemsnr == this.innloggetBruker.Medlemsnr || this.sokBruker.Adminlvl > this.innloggetBruker.Adminlvl || this.sokBruker.Medlemsnr == 10017) {
            this.refs.brukerSokDetaljer.removeChild(this.refs.aktiveringsKnapp);
            this.refs.brukerSokDetaljer.removeChild(this.refs.adminLevelSelect);
            this.refs.brukerSokDetaljer.removeChild(this.refs.adminKnapp);
            this.refs.brukerSokDetaljer.removeChild(this.refs.redigerSokBrukerKnapp);
          }
        }
        for (var i = 0; i <= this.innloggetBruker.Adminlvl; i++) {
          let key = "Adminlvl: "+i;
          let verdi = i.toString();
          this.refs.adminLevelSelect.add(new Option(key,verdi));
        }
        this.refs.adminKnapp.onclick = () => {
          bruker.adminBruker(this.sokBruker.Medlemsnr, this.refs.adminLevelSelect.value, (result) =>{
            console.log("Brukeren ble gjort til Adminlvl: "+this.refs.adminLevelSelect.value);
            tomSelect();
            this.update();
          });
        }
        if (this.refs.redigerSokBrukerKnapp) {
          this.refs.redigerSokBrukerKnapp.onclick = () => {
            history.push("/bruker/{this.innloggetBruker.Medlemsnr}/sok/{result.Medlemsnr}/rediger");
            sokMedlemsnr = result.Medlemsnr;
            return sokMedlemsnr;
          }
        }
      }
    });
  }

  tomSelect() {
    for (var i = this.refs.adminLevelSelect.length - 1; i >= 0; i--) {
      this.refs.adminLevelSelect.remove(i);
    }
  }
}

class BrukerSokRediger extends React.Component {
  constructor() {
      super();

      this.brukerSted = {};
      this.innloggetBruker;
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
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
    let oppFnavn; let oppEnavn; let oppTlf; let oppAdr; let oppPostnr; let midMedlemsnr;

    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    bruker.hentSokBruker(sokMedlemsnr, (result) => {
      midMedlemsnr = result.Medlemsnr
      this.refs.oppdaterFornavnInput.value = result.Fornavn;
      this.refs.oppdaterEtternavnInput.value = result.Etternavn;
      this.refs.oppdaterTlfInput.value = result.Telefon;
      this.refs.oppdaterAdrInput.value = result.Adresse;
      this.refs.oppdaterPostnrInput.value = result.Postnr;

      bruker.hentPoststed(result.Postnr, (result) => {
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
              bruker.eksistererBrukerTlfOppdater(midMedlemsnr, oppTlf, (result) => {
                if (result == undefined) {
                  console.log("Tlfsjekkoppdater funker");
                  bruker.oppdaterBruker(midMedlemsnr, oppFnavn, oppEnavn, oppTlf, oppAdr, oppPostnr, (result) => {
                    console.log("Oppdatering funker");
                    history.push("/bruker/${this.innloggetBruker.Medlemsnr}/sok");
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
        history.push("/bruker/${this.innloggetBruker.Medlemsnr}/sok");
      };
    })
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
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div>
          <h2>Kommende arrangementer</h2>
          <div ref="kommendeArrangementer">
          </div>
          <h2>Tidligere arrangementer</h2>
          <div ref="tidligereArrangementer">
          </div>
        </div>
      );
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div>
          <Link to="/bruker/${this.innloggetBruker.Medlemsnr}/adminkalender" className="linker">Opprett arrangement</Link>
          <h2>Kommende arrangementer</h2>
          <div ref="kommendeArrangementer">
          </div>
          <h2>Tidligere arrangementer</h2>
          <div ref="tidligereArrangementer">
          </div>
        </div>
      );
    }
  }

  componentDidMount() {
    this.update();
  }

  update() {
    this.refs.kommendeArrangementer.innerText = "";

    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

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

        arrDiv.onclick = () => {
          history.push("/bruker/:medlemsnr/arrangement/"+arr.arrid);
          arrid = arr.arrid;
          return arrid;
        }

        arrTittel.appendChild(arrNavn);
        arrTittel.appendChild(arrBeskrivelse);

        arrDiv.appendChild(arrTittel);

        if (this.refs.kommendeArrangementer && arr.ferdig == 0) {
          this.refs.kommendeArrangementer.appendChild(arrDiv);
        } else if (this.refs.tidligereArrangementer && arr.ferdig >= 1) {
          this.refs.tidligereArrangementer.appendChild(arrDiv);
        }
      }
    });
  }
}

class KalenderDetaljer extends React.Component {
  constructor() {
    super();

    this.innloggetBruker;
    this.arrangement = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div ref="arrangementDetaljer">
        <Link to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Tilbake</Link>
        <div ref="arrangementDiv" className="arrangementDetaljerDiv">
          <h2>Arrangement</h2>
          <p ref="arrTittel">
            <span ref="arrNavn"></span>
            <span ref="arrBeskrivelse"></span>
          </p>
          <p ref="arrDatoOppsett">
            <span ref="arrOppmoteSted"></span>
            <span ref="arrDag"></span>
            <span ref="arrOppmoteTid"></span>
            <span ref="arrStart"></span>
            <span ref="arrVarighet"></span>
          </p>
          <p ref="arrVaktpoengP">
            <span ref="arrVaktpoeng"></span>
          </p>
          <p ref="arrUtstyrslisteP">
            <span ref="arrUtstyrsliste"></span>
          </p>
        </div>
        <div ref="arrangementMannskapDiv" className="arrangementDetaljerDiv">
          <h2>Mannskap og roller</h2>
          <p>
            <span ref="arrMannskapPlasser"></span>
            <span ref="arrMannskapRoller"></span>
          </p>
        </div>
        <div ref="arrangementKontaktDiv" className="arrangementDetaljerDiv">
          <h2>Kontaktperson</h2>
          <p ref="arrangementKontaktDetaljer">
            <span ref="kontaktFornavn"></span>
            <span ref="kontaktEtternavn"></span>
            <span ref="kontaktTlf"></span>
            <span ref="kontaktEpost"></span>
          </p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.update();
  }

  update() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let str; let string; let array; let array2; let detaljerArrid; let detaljerArrnavn;
    let mannskapPlasser;
    if (arrid) {
      arrangement.hentArrangement(arrid, (result) => {
        if (this.refs.arrangementDiv) {
          this.arrangement = result;

          //Navn og beskrivelse av arrangement
          this.refs.arrNavn.innerText = this.arrangement.arrnavn+"\n";
          this.refs.arrBeskrivelse.innerText = this.arrangement.beskrivelse;

          //Dato og oppmøte og sted for arrangement
          if (this.arrangement.oppmøtested != null) {
            this.refs.arrOppmoteSted.innerText = "Sted: "+this.arrangement.oppmøtested+"\n";
          } else {
            this.refs.arrOppmoteSted.innerText = "Sted: Kommer senere \n";
          }
          //Drittgreie for å få dato
          str = this.arrangement.startdato;
          if (str != null) {
            string = str.toString();
            array = string.split(" ");
            this.refs.arrDag.innerText = "Oppmøte: "+array[2]+" "+array[1]+" "+array[3];
          } else {
            this.refs.arrDag.innerText = "Oppmøte: Dato kommer senere";
          }
          //Oppmøtetid
          array = " ";
          str = this.arrangement.oppmøtetid;
          if (str != null) {
            string = str.toString();
            array = string.split(":");
            this.refs.arrOppmoteTid.innerText = ", Kl: "+array[0]+":"+array[1]+"\n";
          } else {
            this.refs.arrOppmoteTid.innerText = ", Tidspunkt kommer senere \n";
          }
          //Varighet
          array = " ";
          str = this.arrangement.tidstart;
          if (str != null) {
            string = str.toString();
            array = string.split(":");
            this.refs.arrStart.innerText = "Oppstart: ca. kl "+array[0]+":"+array[1];
            str = this.arrangement.tidslutt;
            if (str != null) {
              string = str.toString();
              array2 = string.split(":");
              let timer = array2[0]-array[0];
              if (timer < 0) {
                timer += 24;
              }
              let min = array2[1]-array[1];
              if (min < 0) {
                timer -= 1;
                min += 60;
              }
              this.refs.arrVarighet.innerText = ", Varighet: ca. "+timer+" timer "+min+" minutter";
            }
            else {
              this.refs.arrVarighet.innerText = ", Varighet: Ingen oppsatt slutt";
            }
          }

          if (this.arrangement.vaktpoeng <= 0) {
            this.refs.arrVaktpoeng.innerText = "Ingen poeng for arrangementet";
          } else if (this.arrangement.vaktpoeng >= 1) {
            this.refs.arrVaktpoeng.innerText = "Vaktpoeng: "+this.arrangement.vaktpoeng;
          }
          if (this.arrangement.utstyrsliste == null) {
            this.refs.arrUtstyrsliste.innerText = "Ingen utstyr for arrangementet"
          } else if (this.arrangement.utstyrsliste != null) {
            this.refs.arrUtstyrsliste.innerText = "Utstyr for arrangementet: "+this.arrangement.utstyrsliste;
          }

          arrangement.hentMannskapsliste(this.arrangement.arrid, (result) => {
            mannskapPlasser = result.antall_pers;
            arrangement.hentMannskapsVakter(result.listeid, (result) => {
              this.refs.arrMannskapPlasser.innerText = "Plasser: "+result["COUNT(Medlemsnr)"]+"/"+mannskapPlasser+"\n";
            });
            if (result.roller == null) {
              this.refs.arrMannskapRoller.innerText = "Ingen roller er satt opp enda";
            } else if (result.roller != null) {
              this.refs.arrMannskapRoller.innerText = "Roller: "+result.roller;
            }
          });


          if (this.innloggetBruker.Adminlvl >= 1) {
            let redigerArrKnapp = document.createElement("button");
            let slettArrKnapp = document.createElement("button");

            redigerArrKnapp.onclick = () => {
              history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/{arrid}/rediger/")
              arrid = this.arrangement.arrid;
              return arrid;
            }

            slettArrKnapp.onclick = () => {
              let slett = confirm("Er du sikker på du vil slette arrangement\n"+this.arrangement.arrnavn+"?")
              if (slett) {
                arrangement.slettMannskapsliste(this.arrangement.arrid, (result) => {
                  console.log("Mannskapsliste til arrangement: "+this.arrangement.arrid);
                  arrangement.slettArrangement(this.arrangement.arrid, (result) => {
                    console.log("Arrangement med navn: "+this.arrangement.arrnavn+", og id:"+this.arrangement.arrid+" slettet");
                    history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangementer/");
                    this.forceUpdate();
                  });
                });
              }
            }

            if (this.arrangement.ferdig == 0) {
              redigerArrKnapp.innerText = "Rediger";
              slettArrKnapp.innerText = "Slett";
              this.refs.arrangementDiv.appendChild(redigerArrKnapp);
              this.refs.arrangementDiv.appendChild(slettArrKnapp);
            }

            arrangement.hentArrangementKontakt(this.arrangement.Kontakt_id, (result) => {
              if (this.refs.arrangementKontaktDiv) {
                this.refs.kontaktFornavn.innerText = "Navn: "+result.Fornavn+" ";
                this.refs.kontaktEtternavn.innerText = result.Etternavn+"\n";
                this.refs.kontaktTlf.innerText = "Telefon: "+result.Telefon+"\n";
                this.refs.kontaktEpost.innerText = "Epost: "+result.Epost;
              }
            });
          } else if (this.innloggetBruker.Adminlvl <= 0) {
            this.refs.arrangementDetaljer.removeChild(this.refs.arrangementKontaktDiv);
          }
        }
      });
    }
  }
}

/*
||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||OPPRETT OG REDIGER ARRANGEMENT||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

class KalenderAdmin extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <div id="opprettArrangementDiv" ref="opprettArrangementDiv">
          <h2>Arrangement</h2>
          <input type="text" ref="arrNavn" placeholder="Arrangementnavn" /> <br />
          <textarea rows="5" cols="40" ref="arrBeskrivelse" placeholder="Beskrivelse" /> <br />
          <input type="date" ref="arrDato"/> <br />
          <input type="text" ref="arrSted" placeholder="Lokasjon" /> <br />
        </div>
        <div id="opprettArrangementKontakt" ref="opprettArrangementKontakt">
          <h2>Kontaktperson</h2>
          <input type="text" ref="kontaktFornavn" placeholder="Fornavn" />
          <input type="text" ref="kontaktEtternavn" placeholder="Etternavn" /> <br />
          <input type="number" ref="kontaktTlf" /> <br />
          <input type="text" ref="kontaktEpost" placeholder="Epost" /> <br />
          <p ref="opprettArrangementAdvarsel"></p>
          <button ref="opprettArrangement">Opprett arrangement</button>
          <button ref="tilbakeArrangement">Lukk</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let arrNavn; let arrBeskrivelse; let arrDato; let arrSted; let kontaktFornavn; let kontaktEtternavn; let kontaktTlf; let kontaktEpost;
    this.refs.opprettArrangement.onclick = () => {
      arrNavn = this.refs.arrNavn.value;
      arrBeskrivelse = this.refs.arrBeskrivelse.value;
      arrDato = this.refs.arrDato.value;
      arrSted = this.refs.arrSted.value;
      kontaktFornavn = this.refs.kontaktFornavn.value;
      kontaktEtternavn = this.refs.kontaktEtternavn.value;
      kontaktTlf = this.refs.kontaktTlf.value;
      kontaktEpost = this.refs.kontaktEpost.value;

      if (erTom(arrNavn) || erTom(arrBeskrivelse) || erTom(arrDato) || erTom(arrSted) || erTom(kontaktFornavn) || erTom(kontaktEtternavn) || erTom(kontaktTlf) || erTom(kontaktEpost)) {
        this.refs.opprettArrangementAdvarsel.innerText = "Fyll inn alle felter!";
      } else {
        arrangement.opprettArrangement(arrNavn, arrBeskrivelse, arrDato, arrSted, (result) => {
          console.log("Arrangement opprettet");
          arrangement.hentArrangementId(arrNavn, arrDato, arrSted, (result) => {
            console.log("Hentet arrid: "+result.arrid);
            arrangement.opprettMannskapsliste(result.arrid, (result) => {
              console.log("Mannskapsliste opprettet");
            });
          });
        });

        arrangement.eksistererArrangementKontakt(kontaktTlf, kontaktEpost, (result) => {
          if (result == undefined) {
            arrangement.opprettArrangementKontakt(kontaktFornavn, kontaktEtternavn, kontaktTlf, kontaktEpost, (result) => {
              console.log("Arrangementkontakt opprettet")
              arrangement.velgArrangementKontakt(kontaktTlf, kontaktEpost, (result) => {
                arrangement.oppdaterArrangementKontakt(result.Kontakt_id, arrNavn, arrDato, arrSted, (result) => {
                  console.log("Kontakt lagt til i arrangement");
                  history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
                  this.forceUpdate();
                });
              });
            });
          } else if (result != undefined) {
            console.log("Arrangementkontakt eksisterer allerede");

            arrangement.velgArrangementKontakt(kontaktTlf, kontaktEpost, (result) => {
              console.log(result);
              arrangement.oppdaterArrangementKontakt(result.Kontakt_id, arrNavn, arrDato, arrSted, (result) => {
                console.log("Kontakt lagt til i arrangement");
                history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
                this.forceUpdate();
              });
            });
          }
        });
      }
    }

    this.refs.tilbakeArrangement.onclick = () => {
      history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
    }
  }
}

class RedigerArrangment extends React.Component {
  constructor() {
    super();

    this.arrangement = {};
    this.innloggetBruker;
  }

  render() {
    return(
      <div ref="redigerArrDiv">
        <p>Alle felter med * er obligatoriske</p>
        <div>
          Arrangementnavn*: <input type="text" ref="oppdaterArrNavn" placeholder="Arrangementnavn" />
          <br />
          Arrangementbeskrivelse*: <textarea rows="5" cols="40" ref="oppdaterArrBeskrivelse" placeholder="Beskrivelse" />
        </div>
        <br />
        <div>
          Dato og oppmøtetid*: <input type="date" ref="oppdaterDato" />
          <input type="time" ref="oppdaterOppmote" />
          <br />
          Sted*: <input type="text" ref="oppdaterSted" placeholder="Oppmøtested" />
          <br />
          Postnummer*/sted: <input type="number" ref="oppdaterPostnr"/>
          <input type="text" ref="oppdaterPoststed" readOnly/>
          <br />
          Arrangementstart*/slutt: <input type="time" ref="oppdaterStartTid" />
          <input type="time" ref="oppdaterSluttTid" />
        </div>
        <div>
          Utstyrsliste: <textarea rows="5" cols="40" ref="oppdaterUtstyrsliste" placeholder="Utstyrsliste" />
          <br />
          Vaktpoeng: <input type="number" ref="oppdaterVaktPoeng" />
        </div>
        <div>
          <button ref="redigerArrangement">Rediger</button>
          <button ref="avbrytRedigerArrangement">Lukk</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let arrnavn; let beskrivelse; let arrDato; let oppmotetid; let sted; let postnr; let starttid; let sluttid; let utstyrsliste; let vaktpoeng;

    if (arrid) {
      arrangement.hentArrangement(arrid, (result) => {
        this.arrangement = result;

        // str = result.startdato;
        // if (str != null) {
        //   string = str.toString();
        //   array = string.split(" ");
        //   switch(array[1]) {
        //     case "Jan":month = "01";break;
        //     case "Feb":month = "02";break;
        //     case "Mar":month = "03";break;
        //     case "Apr":month = "04";break;
        //     case "May":month = "05";break;
        //     case "Jun":month = "06";break;
        //     case "Jul":month = "07";break;
        //     case "Aug":month = "08";break;
        //     case "Sep":month = "09";break;
        //     case "Oct":month = "10";break;
        //     case "Nov":month = "11";break;
        //     case "Des":month = "12";break;
        //   }
        //   dato = array[3]+"-"+month+"-"+array[2];
        // }
        //Dette er det samme som valueAsNumber!!!!!!!!!!!

        this.refs.oppdaterArrNavn.value = this.arrangement.arrnavn;
        this.refs.oppdaterArrBeskrivelse.value = this.arrangement.beskrivelse;
        this.refs.oppdaterDato.valueAsNumber = this.arrangement.startdato;
        this.refs.oppdaterOppmote.value = this.arrangement.oppmøtetid;
        this.refs.oppdaterSted.value = this.arrangement.oppmøtested;
        this.refs.oppdaterPostnr.value = this.arrangement.postnr;
        this.refs.oppdaterStartTid.value = this.arrangement.tidstart;
        this.refs.oppdaterSluttTid.value = this.arrangement.tidslutt;
        this.refs.oppdaterUtstyrsliste.value = this.arrangement.utstyrsliste;
        this.refs.oppdaterVaktPoeng.value = this.arrangement.vaktpoeng;

        if (this.arrangement.postnr) {
          arrangement.hentArrangementPoststed(this.arrangement.postnr, (result) => {
            this.refs.oppdaterPoststed.value = result.Poststed;
          });
        }
        this.refs.oppdaterPostnr.onblur = () => {
          postnr = this.refs.oppdaterPostnr.value;
          bruker.eksistererStedPostnr(postnr, (result) => {
            if (result != undefined) {
              arrangement.hentArrangementPoststed(postnr, (result) => {
                this.refs.oppdaterPoststed.value = result.Poststed;
              });
            } else {
              this.refs.oppdaterPoststed.value = "";
            }
          });
        };

        this.refs.redigerArrangement.onclick = () => {
          arrnavn = this.refs.oppdaterArrNavn.value
          beskrivelse = this.refs.oppdaterArrBeskrivelse.value
          arrDato = this.refs.oppdaterDato.value
          oppmotetid = this.refs.oppdaterOppmote.value;
          sted = this.refs.oppdaterSted.value
          postnr = this.refs.oppdaterPostnr.value
          starttid = this.refs.oppdaterStartTid.value
          sluttid = this.refs.oppdaterSluttTid.value
          utstyrsliste = this.refs.oppdaterUtstyrsliste.value
          vaktpoeng = this.refs.oppdaterVaktPoeng.value

          if (erTom(arrnavn) || erTom(beskrivelse) || erTom(arrDato) || erTom(oppmotetid) || erTom(sted) || erTom(postnr) || erTom(starttid)) {

          } else {
            arrangement.redigerArrangement(arrid, arrnavn, beskrivelse, dato, oppmotetid, sted, postnr, starttid, sluttid, utstyrsliste, vaktpoeng, (result) => {
              console.log("Arrangementet er oppdatert");
              history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
              this.forceUpdate();
            });
          }
        }
        this.refs.avbrytRedigerArrangement.onclick = () => {
          history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
          this.forceUpdate();
        }
      });
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
        <Route exact path="/bruker/:medlemsnr/sok" component={BrukerSok} />
        <Route exact path="/bruker/:medlemsnr/sok/:medlem" component={BrukerSokDetaljer} />
        <Route exact path="/bruker/:medlemsnr/sok/:medlem/rediger" component={BrukerSokRediger} />
        <Route exact path="/bruker/:medlemsnr/redigerprofil" component={RedigerProfil} />
        <Route exact path="/bruker/:medlemsnr/arrangementer" component={Kalender} />
        <Route exact path="/bruker/:medlemsnr/adminkalender" component={KalenderAdmin} />
        <Route exact path="/bruker/:medlemsnr/arrangement/:arrid" component={KalenderDetaljer} />
        <Route exact path="/bruker/:medlemsnr/arrangement/:arrid/rediger" component={RedigerArrangment} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById("root"));

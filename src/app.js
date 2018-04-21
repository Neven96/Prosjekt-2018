import React from "react";
import ReactDOM from "react-dom";
import {NavLink, IndexLink, HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {createHashHistory} from "history";
import {bruker, arrangement} from "./sql_server";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

//Gjør klar BigCalendar biten for en fin liten kalender
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

const MyCalendar = props => (
  <div>
    <BigCalendar
      events={myEventsList}
      startAccessor='startDate'
      endAccessor='endDate'
    />
  </div>
);
//Lager en history-bit for kunne bruke history.push
export const history = createHashHistory();

class Hjem extends React.Component {
  constructor() {
    super();

    this.innloggetBruker = {};
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
            <span className="spanbar"><NavLink exact to="/hjem" className="menyLinker" activeStyle={{color : 'red', fontWeight: 'bold'}} replace>Hjem</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/hjelp" className="menyLinker" activeStyle={{color : 'red', fontWeight: 'bold'}} replace>Hjelp</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/logginn" className="menyLinker" activeStyle={{color : 'red', fontWeight: 'bold'}} replace>Logg inn</NavLink></span>
            <hr />
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
            <span className="spanbar"><NavLink exact to="/hjem" className="menyLinker">Hjem</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="menyLinker">Arrangementer</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}" className="menyLinker">Profil</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/sok" className="menyLinker">Søk</NavLink> </span>
            <span className="spanbar"><NavLink exact to="/hjelp" className="menyLinker">Hjelp</NavLink> </span>
            <span className="spanbar"><button ref="loggUtKnapp" id="loggUtKnapp" className="knapper" onClick={() => {bruker.loggUtBruker(),
              this.forceUpdate(),
              history.push("/hjem/"),
              console.log("Logget ut")}}>Logg ut</button></span>
            <hr />
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

    this.innloggetBruker = {};
  }

  render() {
    //Henter JSON-objekt og viser dette hvis brukeren ikke er logget inn
    this.innloggetBruker = bruker.hentBruker();
    if (!this.innloggetBruker) {
      return(
        <div className="sentrertboks" id="forsidetekst">
          <p>Nyheter om Røde Kors og andre ting tang</p>
          <h3>Breaking News!!!</h3>
          <p>Røde Kors får nytt vaktsystem</p>

          <div id="nyheter">
              <ul id="nyhetercol">
              <li className="underline"><strong>Ca. 340 000</strong>mennesker fikk matrasjoner i Sør-Sudan i første halvdel av 2017</li>
              <li className="underline"><strong>4,7 millioner</strong>mennesker i Syria får hjelp av Røde Kors hver måned</li>
              <li className="underline"><strong>3400</strong>var med på Ferie for alle i 2016</li>
              <li className="underline"><strong>Ca. 15 000</strong>i Norge får besøk av en Røde Kors besøksvenn</li>
              <li className="underline"><strong>Ca. 2 000</strong>flyktninger fikk en flyktningguide i 2016</li>
              <li className="underline"><strong>Ca. 11 000</strong>vitner får vitnestøtte i løpet av et år</li>
              </ul>
            </div>
        </div>
      );
    }
    else if (this.innloggetBruker) {
      //Viser dette hvis brukeren er logget inn og aktivert
      if (this.innloggetBruker.Aktivert == 1) {
        return(
          <div className="sentrertboks" id="forsidetekst">
            <p>Nyheter om Røde Kors og andre ting tang</p>
            <h3>Breaking News!!!</h3>
            <p>Røde Kors får nytt vaktsystem</p>

            <div id="nyheter">
                <ul id="nyhetercol">
                <li className="underline"><strong>Ca. 340 000</strong>mennesker fikk matrasjoner i Sør-Sudan i første halvdel av 2017</li>
                <li className="underline"><strong>4,7 millioner</strong>mennesker i Syria får hjelp av Røde Kors hver måned</li>
                <li className="underline"><strong>3400</strong>var med på Ferie for alle i 2016</li>
                <li className="underline"><strong>Ca. 15 000</strong>i Norge får besøk av en Røde Kors besøksvenn</li>
                <li className="underline"><strong>Ca. 2 000</strong>flyktninger fikk en flyktningguide i 2016</li>
                <li className="underline"><strong>Ca. 11 000</strong>vitner får vitnestøtte i løpet av et år</li>
                </ul>
              </div>
          </div>
        );
      }
      //Viser dette hvis brukeren er logget inn, men ikke aktivert enda
      else if (this.innloggetBruker.Aktivert == 0) {
        return(
          <div className="sentrertboks" id="forsidetekst">
            <p>Brukeren er ikke aktivert</p>
          </div>
        );
      }
      //Viser dette hvis brukeren ikke er aktivert
      else if (this.innloggetBruker.Aktivert == 2) {
        return(
          <div className="sentrertboks" id="forsidetekst">
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
      <div className="sentrertboks" id="hjelptekst">
        <p>Hei, velkommen til hjelpsiden for Røde Kors, her får du hjelp</p>
      </div>
    );
  }
}

class GlemtPassord extends React.Component {
  //Side for å få passordet hvis det er glemt
  render() {
    return(
      <div className="sentrertboks" id="glemtpassord">
        <p>Skriv inn navn og epost for å få passord</p>
        Fornavn: <input className="glemtpassordinput" type="text" ref="glemtPassordFornavn" />
        <br />
        Etternavn: <input className="glemtpassordinput" type="text" ref="glemtPassordEtternavn" />
        <br />
        Epost: <input className="glemtpassordinput" type="text" ref="glemtPassordEpost" />
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
    this.refs.glemtPassordKnapp.onclick = () => {
      fornavn = this.refs.glemtPassordFornavn.value;
      etternavn = this.refs.glemtPassordEtternavn.value;
      epost = this.refs.glemtPassordEpost.value;

      if (erTom(fornavn), erTom(etternavn), erTom(epost)) {
        alert("Du må fylle inn alt");
      } else {
        bruker.hentBrukerPassord(fornavn, etternavn, epost, (result) => {
          if (result != undefined) {
            bruker.brukerByttePassord(epost, (result) => {
              console.log("Passordet må byttes");
            });
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
    //Registrering av bruker
    return (

      <div className="sentrertboks" id="registrerbox">
      <h3>Fyll inn alle felter</h3>
      <h4 id="registrerPassordNotice">(og ikke bruk ditt ekte passord)</h4>
      <table id="registrertable">
        <tbody>
          <tr>
            <td>Fornavn: </td>
            <td><input type="text" ref="registrerFnavnInput" size="20" /></td>
          </tr>
          <tr>
            <td>Etternavn: </td>
            <td><input type="text" ref="registrerEnavnInput" size="20" /></td>
          </tr>
          <tr>
            <td>Telefonnummer: </td>
            <td><input type="number" ref="registrerTlfInput" size="20" min="0" /></td>
          </tr>
          <tr>
            <td>Adresse: </td>
            <td><input type="text" ref="registrerAdrInput" size="20" /></td>
          </tr>
          <tr>
            <td>Postnr: </td>
            <td><input type="number" ref="registrerPostnrInput" maxLength="4" size="4" min="0" /></td>
          </tr>
          <tr>
            <td>Poststed: </td>
            <td><input type="text" ref="registrerPoststedInput" readOnly /></td>
          </tr>
          <tr>
            <td>Epost: </td>
            <td><input type="text" ref="registrerEpostInput" size="20" /></td>
          </tr>
          <tr>
            <td>Passord: </td>
            <td><input type="password" ref="registrerPassordInput" size="20" /></td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p id="feilRegistrering" ref="feilRegistrering" className="feilMelding"></p>
      <button id="registrerKnapp" ref="registrerKnapp" className="knapper">Registrer</button>
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
      //Sjekker om epost og postnummer er riktig
      //Sjekker om epost er riktig
      //Sjekker om passord er bra nok
      if (erTom(fnavn) || erTom(enavn) || erTom(tlf) || erTom(adr) || erTom(postnr) || erTom(epost) || erTom(passord)) {
        this.refs.feilRegistrering.innerText = "Du må ha med alle feltene";
        window.scrollTo(0,document.body.scrollHeight);
      } else if (tlf.length > 8 || tlf.length < 8 || tlf < 0 || postnr.length > 4 || postnr < 0) {
        this.refs.feilRegistrering.innerText = "Telefon eller postnummer er feil";
        window.scrollTo(0,document.body.scrollHeight);
      } else if (!epost.includes("@") || !epost.includes(".")) {
        this.refs.feilRegistrering.innerText = "Eposten er feil";
        window.scrollTo(0,document.body.scrollHeight);
      } else if (passord.length < 8) {
        this.refs.feilRegistrering.innerText = "Passordet må være minst 8 tegn";
        window.scrollTo(0,document.body.scrollHeight);
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
      <div className="sentrertboks" id="loginbox">
        <h3>Logg inn på din brukerkonto</h3>
        <p ref="feilInnlogging" id="feilInnlogging" className="feilMelding"></p>
        <table id="logginntable">
        <tbody>
        <tr>
        <td>Epost: </td>
        <td><input type="text" ref="brukernavnInput" className="logginninput" autoFocus /></td>
        </tr>
        <tr>
        <td>Passord: </td>
        <td><input type="password" ref="passordInput" className="logginninput" /></td>
        </tr>
        </tbody>
        </table>
        <span><button ref="loggInnKnapp" className="logginnknapp">Logg inn</button>
        <NavLink exact to="/glemtpassord" className="glemtpassordknapp">Glemt passord</NavLink></span>
        <p>Har du ikke bruker, registrer deg <span><NavLink exact to="/registrerBruker" className="registrerherknapp">her</NavLink></span></p>
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
            bruker.loggUtBruker();
          }
        });
      }
    };
    //Kjører funksjonen over når man trykker enter inne i passordInput boksen
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

    this.state = {width: 500, events: []}
    this.innloggetBruker = {};
    this.brukerSted = {};
  }
  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    //Gjør det faktisk for å hente den ut på nytt hvis brukeren oppdaterer profilen sin
    //En måte for å få ut ordentlig informasjon
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return (
      <div id="profil" ref="profilDiv">
        <div id="profilvisning1">
          <p id="redigerprofilknapp"><NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/redigerprofil" className="linker">Rediger profil</NavLink></p>
          <ul className="sentrertboks" id="profilinfo">
            <li ref="profilNavn"></li>
            <li ref="profilAdresse"></li>
            <li ref="profilNummer"></li>
            <li ref="profilEpost"></li>
            <li ref="profilMedlemsnr"></li>
            <li ref="profilVaktpoeng"></li>
          </ul>
          <div ref="profilPassivDiv" id="profilPassivDiv">
            <input type="date" ref="profilPassivStart" />
            <input type="date" ref="profilPassivSlutt"/> <br />
            <button ref="profilPassivKnapp">Sett passiv</button>
            <h3>Passiv:</h3>
            <div ref="profilPassivListe"></div>
          </div>
          <div ref="profilKompetanseDiv" id="profilKompetanseDiv">
            <h3>Kompetanser:</h3>
            <ul id="profilKompetanseDivli" ref="profilKompetanse"></ul>
          </div>
          <div ref="profilRolleDiv" id="profilRolleDiv">
            <h3>Roller:</h3>
            <ul id="profilRolleDivli" ref="profilRolle"></ul>
          </div>
        </div>
        <div id="profilvisning2" ref="kalenderDiv">
          <p id="kommendearr"><NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Kommende arrangementer</NavLink></p>
          {/* react-big-calendar */}
          <BigCalendar
            style={{ height: 500}}
            events={this.state.events}
            step={60}
            ShowMultiDayTimes
            startAccessor='startDate'
            endAccessor='startDate'
            defaultDate={new Date()}
            onSelectEvent={event => this.setArrinfo(event)}
          />
        </div>
      </div>
    );
  }
  // funksjon som kjøreres dersom ett Arr blir trykker på i kalenderen
  setArrinfo(event) {
    history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/"+event.arrid);
    arrid = event.arrid;
    return arrid;
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    //Henter kommunen til brukeren utifra postnummeret
    bruker.hentPoststed(this.innloggetBruker.Postnr, (result) => {
      this.brukerSted = result;
      this.update();
    });
    this.passivUpdate();
  }

  update() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    //Setter opp navn og ting for profil
    if (this.refs.profilDiv) {
      this.refs.profilNavn.innerText = "Navn: "+this.innloggetBruker.Fornavn+" "+this.innloggetBruker.Etternavn;
      this.refs.profilAdresse.innerText = "Adresse: "+this.innloggetBruker.Adresse+" "+this.innloggetBruker.Postnr+" "+this.brukerSted.Poststed;
      this.refs.profilNummer.innerText = "Telefonnummer: "+this.innloggetBruker.Telefon;
      this.refs.profilEpost.innerText = "Epost: "+this.innloggetBruker.Epost;
      this.refs.profilMedlemsnr.innerText = "Medlemsnummer: "+this.innloggetBruker.Medlemsnr;
      this.refs.profilVaktpoeng.innerText = "Vaktpoeng: "+this.innloggetBruker.Vaktpoeng;

      //Henter kompetansene og rollene til brukeren
      bruker.hentBrukerKompetanse(this.innloggetBruker.Medlemsnr, (result) => {
        for (let kompetanse of result) {
          let liKomp = document.createElement("li");
          liKomp.innerText = kompetanse.Kompetanse_navn;

          this.refs.profilKompetanse.appendChild(liKomp);
        }
      });
      bruker.hentBrukerRoller(this.innloggetBruker.Medlemsnr, (result) => {
        for (let rolle of result) {
          let liRolle = document.createElement("li");
          liRolle.innerText = rolle.Rolle_navn;

          this.refs.profilRolle.appendChild(liRolle)
        }
      });
    }
    if (this.refs.kalenderDiv){
      arrangement.hentArrKal((result) => {
        this.setState({ events: result });
      });
    }
  }
  //Setter opp passivbiten og gir den mulighet for å bli lagd
  passivUpdate() {
    let datoStart; let datoSlutt; let arrayStart; let arraySlutt;
    if (this.refs.profilDiv) {
      this.refs.profilPassivListe.innerText = " ";
      let iDag = new Date();

      bruker.hentBrukerPassiv(this.innloggetBruker.Medlemsnr, (result) => {
        let passivUl = document.createElement("ul");

        for (let passiv of result) {
          let passivLi = document.createElement("li");

          datoStart = new Date();
          datoStart.setDate(passiv.Start_dato.getDate());
          datoStart.setMonth(passiv.Start_dato.getMonth());
          datoStart.setYear(passiv.Start_dato.getFullYear());
          if (datoStart != null) {
            datoStart = datoStart.toString();
            arrayStart = datoStart.split(" ");
            switch(arrayStart[1]) {
                case "May":arrayStart[1] = "Mai";break;
                case "Oct":arrayStart[1] = "Okt";break;
            }
          }

          //Setter opp datoen som sjekker om du er passiv i fremtiden
          datoSlutt = new Date();
          datoSlutt.setDate(passiv.Slutt_dato.getDate());
          datoSlutt.setMonth(passiv.Slutt_dato.getMonth());
          datoSlutt.setYear(passiv.Slutt_dato.getFullYear());

          if (datoSlutt != null) {
            datoSlutt = datoSlutt.toString();
            arraySlutt = datoSlutt.split(" ");
            switch(arraySlutt[1]) {
                case "May":arraySlutt[1] = "Mai";break;
                case "Oct":arraySlutt[1] = "Okt";break;
            }
          }

          if (passiv.Slutt_dato >= iDag) {
            passivLi.innerText = arrayStart[2]+"."+arrayStart[1]+"."+arrayStart[3]+" - "+arraySlutt[2]+"."+arraySlutt[1]+"."+arraySlutt[3];
            passivUl.appendChild(passivLi)
          }
        }
        if (this.refs.profilPassivListe) {
          this.refs.profilPassivListe.appendChild(passivUl);
        }
      });
      //Setter inn ny passiv i databasen
      let startdato; let sluttdato;
      this.refs.profilPassivKnapp.onclick = () => {
        startdato = this.refs.profilPassivStart.value;
        sluttdato = this.refs.profilPassivSlutt.value;
        if (erTom(startdato) || erTom(sluttdato)) {
          console.log("Tom");
        } else {
          bruker.brukerSettPassiv(this.innloggetBruker.Medlemsnr, startdato, sluttdato, (result) => {
            console.log("Ny passivtid");
            this.refs.profilPassivStart.value = "";
            this.refs.profilPassivSlutt.value = "";
            this.passivUpdate();
          });
        }
      }
    }
  }
}

class RedigerProfil extends React.Component {
  constructor() {
      super();

      this.innloggetBruker = {};
      this.brukerSted = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div id="redigerprofil">
        <h3>Rediger profil</h3>
        <table id="redigerprofiltable">
          <tbody>
            <tr>
              <td>Fornavn: </td>
              <td><input type="text" ref="oppdaterFornavnInput" /></td>
            </tr>
            <tr>
              <td>Etternavn: </td>
              <td><input type="text" ref="oppdaterEtternavnInput" /></td>
            </tr>
            <tr>
              <td>Telefonnummer: </td>
              <td><input type="number" ref="oppdaterTlfInput" maxLength="8" /></td>
            </tr>
            <tr>
              <td>Adresse: </td>
              <td><input type="text" ref="oppdaterAdrInput" /></td>
            </tr>
            <tr>
              <td>Postnr: </td>
              <td><input type="number" ref="oppdaterPostnrInput" /></td>
            </tr>
            <tr>
              <td>Poststed: </td>
              <td><input type="text" ref="oppdaterPoststedInput" readOnly /></td>
            </tr>
          </tbody>
        </table>
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
    //Oppdaterer brukeren utifra verdiene som er oppgitt
    this.refs.oppdaterBruker.onclick = () => {
      oppFnavn = this.refs.oppdaterFornavnInput.value;
      oppEnavn = this.refs.oppdaterEtternavnInput.value;
      oppTlf = this.refs.oppdaterTlfInput.value;
      oppAdr = this.refs.oppdaterAdrInput.value;
      oppPostnr = this.refs.oppdaterPostnrInput.value;

      //Sjekker om noen av feltene er tomme eller om telefon eller postnummeret er feil lengde
      if (erTom(oppFnavn) || erTom(oppEnavn) || erTom(oppTlf) || erTom(oppAdr) || erTom(oppPostnr)) {
        this.refs.feilOppdatering.innerText = "Ingen felter kan være tomme";
      } else if (oppTlf.length > 8 || oppTlf.length < 8 || oppPostnr.length > 4) {
        this.refs.feilOppdatering.innerText = "Telefon eller postnummer er feil lengde";
      } else {
        //Sjekker om postnummeret eksisterer
        //Sjekker om telefonnummeret eksisterer
        bruker.eksistererStedPostnr(oppPostnr, (result) => {
          if (result != undefined) {
            console.log("Postnummeroppdater funker");
            bruker.eksistererBrukerTlfOppdater(this.innloggetBruker.Medlemsnr, oppTlf, (result) => {
              if (result == undefined) {
                console.log("Tlfsjekkoppdater funker");
                bruker.oppdaterBruker(this.innloggetBruker.Medlemsnr, oppFnavn, oppEnavn, oppTlf, oppAdr, oppPostnr, (result) => {
                  console.log("Oppdatering funker");
                  history.push("/bruker/${this.innloggetBruker.Medlemsnr}");
                  this.forceUpdate();
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

    this.innloggetBruker = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div id="soktest">
          <input ref="inn" type="text" autoFocus/> <button ref="sokKnapp">Søk</button>
          <div ref="sokeResultat">
          </div>
        </div>
      )
      //Hvis den innloggede brukeren er admin, så får den se knapper som vil vise
      //nye brukere som mangler aktivering og deaktiverte brukere
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div id="soktest">
          <input ref="inn" type="text" autoFocus/> <button ref="sokKnapp">Søk</button>
          <button ref="sokAktivering">Nye brukere</button>
          <button ref="sokDeaktivert">Deaktiverte brukere</button>
          <div ref="sokeResultat">
          </div>
        </div>
      )
    }

  }

  componentDidMount() {
    //skriver ut brukere som finnes i databasen
    this.refs.sokKnapp.onclick = () => {
      this.refs.sokeResultat.innerText = "";
      let input = this.refs.inn.value;

      if (erTom(input)) {
        this.refs.sokeResultat.innerText = "Du må ha et søkeord"
      } else {
        bruker.sokBruker(input, (result) => {
          sok(result, this.refs.sokeResultat, "Ingen treff")
        });
      }
    }

    this.refs.inn.oninput = () => {
      this.refs.sokKnapp.click();
    }
    //henter alle brukerer som mangler aktivering
    if (this.refs.sokAktivering) {
      this.refs.sokAktivering.onclick = () => {
        this.refs.sokeResultat.innerText = "";
        bruker.hentBrukerAktivering((result) => {
          sok(result, this.refs.sokeResultat, "Ingen brukere mangler aktivering");
        });
      }
    }
    //henter alle brukere som er deaktiverte
    if (this.refs.sokDeaktivert) {
      this.refs.sokDeaktivert.onclick = () => {
        this.refs.sokeResultat.innerText = "";
        bruker.hentBrukerDeaktivert((result) => {
          sok(result, this.refs.sokeResultat, "Ingen deaktiverte brukere");
        });
      }
    }
  }
}

class BrukerSokDetaljer extends React.Component {
  constructor() {
    super();

    this.innloggetBruker = {};
    this.sokBruker = {};
    this.sokBrukerPoststed = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    //Hvis den innloggede brukeren er admin, så får den se mer informasjon om brukeren
    //og har mulighet til å aktiver, deaktivere og gjøre brukeren til admin
    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div className="sentrertboks" ref="brukerSokDetaljer">
          <ul>
            <NavLink exact to="/bruker/{this.innloggetBruker.Medlemsnr}/sok" className="linker" >Tilbake</NavLink>
            <li ref="sokBrukerNavn"></li>
            <li ref="sokBrukerTlf"></li>
            <li ref="sokBrukerEpost"></li>
          </ul>
        </div>
      );
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div className="sentrertboks" ref="brukerSokDetaljer">
          <NavLink exact to="/bruker/{this.innloggetBruker.Medlemsnr}/sok" className="linker">Tilbake</NavLink>
          <ul>
            <li ref="sokBrukerNavn"></li>
            <li ref="sokBrukerTlf"></li>
            <li ref="sokBrukerEpost"></li>
            <li ref="sokBrukerAdresse"></li>
            <li ref="sokBrukerPost"></li>
            <li ref="sokBrukerMedlemsnr"></li>
          </ul>
          <div ref="sokBrukerKnappeDiv">
            <button ref="aktiveringsKnapp" className="knapper"></button> <br />
            <select ref="adminLevelSelect"></select>
            <button ref="adminKnapp" id="adminKnapp" className="knapper">Gjør admin</button> <br />
            <button ref="redigerSokBrukerKnapp" id="redigerSokBrukerKnapp" className="knapper">Rediger</button> <br />
          </div>
          <h3>Kompetanser:</h3>
          <select ref="brukerKompetanseSelect"></select>
          <button ref="brukerKompetanseKnapp">Gi kompetanse</button> <br />
          <div ref="sokBrukerKompetanseDiv" id="sokBrukerKompetanseDiv"></div>
          <h3>Roller:</h3>
          <select ref="brukerRolleSelect"></select>
          <button ref="brukerRolleKnapp">Gi rolle</button>
          <div ref="sokBrukerRolleDiv" id="sokBrukerRolleDiv"></div>
        </div>
      );
    }
  }

  componentDidMount() {
    if (sokMedlemsnr) {
      bruker.hentSokBruker(sokMedlemsnr, (result) => {
        this.sokBruker = result;
        bruker.hentPoststed(this.sokBruker.Postnr, (result) => {
          this.sokBrukerPoststed = result;
          this.update();
          this.knapperKompetanseRollerUpdate();
        });
      });
    }
  }

  update() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let poststed;

    //Ignorer denne, ikke noe spennende her (plystre, plystre)
    if (this.sokBruker.Medlemsnr == 10017 && this.innloggetBruker.Medlemsnr != 10017) {
      this.sokBruker.Epost = "Hemmelig";
      this.sokBruker.Telefon = "Hemmelig";
    }

    bruker.hentSokBruker(sokMedlemsnr, (result) => {
      this.sokBruker = result;
      //Fjerner epost og telefon og adresse og liknende hvis bruker er deaktivert
      if (this.sokBruker.Aktivert <= 1) {
        if (this.sokBruker.Adminlvl >= 1) {
          this.refs.sokBrukerNavn.innerText = "Navn: "+this.sokBruker.Fornavn+" "+this.sokBruker.Etternavn+", (Administrator)";
        } else if (this.sokBruker.Adminlvl <= 0) {
          this.refs.sokBrukerNavn.innerText = "Navn: "+this.sokBruker.Fornavn+" "+this.sokBruker.Etternavn;
        }

        poststed = this.sokBrukerPoststed.Poststed;
        this.refs.sokBrukerTlf.innerText = "Tlf: "+this.sokBruker.Telefon;
        this.refs.sokBrukerEpost.innerText = "Epost: "+this.sokBruker.Epost;
        if (this.innloggetBruker.Adminlvl >= 1) {
          this.refs.sokBrukerAdresse.innerText = "Adresse: "+this.sokBruker.Adresse;
          this.refs.sokBrukerPost.innerText = "Postnummer og sted: "+this.sokBruker.Postnr+" "+poststed;
          this.refs.sokBrukerMedlemsnr.innerText = "Medlemsnr: "+this.sokBruker.Medlemsnr;
        }
      } else if (this.sokBruker.Aktivert == 2) {
        this.sokBruker.Epost = "Deaktivert";
        this.sokBruker.Telefon = "Deaktivert";
        this.sokBruker.Adresse = "Deaktivert";
        this.sokBruker.Postnr = "Deaktivert";
        poststed = "Deaktivert";

        if (this.sokBruker.Adminlvl >= 1) {
          this.refs.sokBrukerNavn.innerText = "Navn: "+this.sokBruker.Fornavn+" "+this.sokBruker.Etternavn+", (Administrator)";
        } else if (this.sokBruker.Adminlvl <= 0) {
          this.refs.sokBrukerNavn.innerText = "Navn: "+this.sokBruker.Fornavn+" "+this.sokBruker.Etternavn;
        }

        this.refs.sokBrukerTlf.innerText = "Tlf: "+this.sokBruker.Telefon;
        this.refs.sokBrukerEpost.innerText = "Epost: "+this.sokBruker.Epost;
        if (this.innloggetBruker.Adminlvl >= 1) {
          this.refs.sokBrukerAdresse.innerText = "Adresse: "+this.sokBruker.Adresse;
          this.refs.sokBrukerPost.innerText = "Postnummer og sted: "+this.sokBruker.Postnr+" "+poststed;
          this.refs.sokBrukerMedlemsnr.innerText = "Medlemsnr: "+this.sokBruker.Medlemsnr;
        }
      }
    });
  }

  knapperKompetanseRollerUpdate() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    bruker.hentSokBruker(sokMedlemsnr, (result) => {
      this.sokBruker = result;
      if (this.sokBruker) {
        //Lager knapper for å aktivere og deaktivere brukeren hvis den innloggede brukeren er admin
        if (this.innloggetBruker.Adminlvl >= 1) {
          this.refs.sokBrukerKompetanseDiv.innerText = " ";
          this.refs.sokBrukerRolleDiv.innerText = " ";
          if (this.sokBruker.Aktivert == 0) {
            this.refs.aktiveringsKnapp.innerText = "Aktiver";
            this.refs.aktiveringsKnapp.id = "aktiveringsKnapp";
            this.refs.aktiveringsKnapp.onclick = () => {
              bruker.aktiverBruker(this.sokBruker.Medlemsnr, (result) => {
                console.log("Bruker ble aktivert");
                this.tomSelect();
                this.update();
                this.knapperKompetanseRollerUpdate();
              });
            }
          } else if (this.sokBruker.Aktivert == 1 && this.sokBruker.Medlemsnr != this.innloggetBruker.Medlemsnr && this.sokBruker.Adminlvl <= this.innloggetBruker.Adminlvl) {
            this.refs.sokBrukerKnappeDiv.className = "";
            this.refs.aktiveringsKnapp.innerText = "Deaktiver";
            this.refs.aktiveringsKnapp.id = "deaktiveringsKnapp";
            this.refs.aktiveringsKnapp.onclick = () => {
              let deaktiver = confirm("Er du sikker på at du vil deaktivere brukeren")
              if (deaktiver) {
                bruker.deaktiverBruker(this.sokBruker.Medlemsnr, (result) => {
                  console.log("Bruker ble deaktivert");
                  this.tomSelect();
                  this.update();
                  this.knapperKompetanseRollerUpdate();
                });
              }
            }
            //Fjerner alle knapper og liknende hvis bruker er deaktivert, eller du søker opp den innloggede brukeren, eller hvis brukeren er høyere admin enn den innloggede brukeren
          } else if (this.sokBruker.Aktivert == 2 || this.sokBruker.Medlemsnr == this.innloggetBruker.Medlemsnr || this.sokBruker.Adminlvl > this.innloggetBruker.Adminlvl || this.sokBruker.Medlemsnr == 10017) {
            this.refs.sokBrukerKnappeDiv.className = "skjulSokBrukerKnapper";
          }

          //Setter opp dropdownmeny for å gjøre brukeren til admin
          for (var i = 0; i <= this.innloggetBruker.Adminlvl; i++) {
            let key = "Adminlvl: "+i;
            let verdi = i.toString();
            this.refs.adminLevelSelect.add(new Option(key,verdi));
          }

          this.refs.adminKnapp.onclick = () => {
            bruker.adminBruker(this.sokBruker.Medlemsnr, this.refs.adminLevelSelect.value, (result) =>{
              console.log("Brukeren ble gjort til Adminlvl: "+this.refs.adminLevelSelect.value);
              this.tomSelect();
              this.update();
              this.knapperKompetanseRollerUpdate();
            });
          }
          if (this.refs.redigerSokBrukerKnapp) {
            this.refs.redigerSokBrukerKnapp.onclick = () => {
              history.push("/bruker/{this.innloggetBruker.Medlemsnr}/sok/{result.Medlemsnr}/rediger");
              sokMedlemsnr = result.Medlemsnr;
              return sokMedlemsnr;
            }
          }

          bruker.hentBrukerIkkeKompetanse(this.sokBruker.Medlemsnr, (result) => {
            this.refs.brukerKompetanseSelect.className = "";
            this.refs.brukerKompetanseKnapp.className = "";

            for (let kompetanse of result) {
              let key = kompetanse.Kompetanse_navn;
              let verdi = kompetanse.Kompetanse_id;
              this.refs.brukerKompetanseSelect.add(new Option(key, verdi));
            }
            if (result.length == 0 || this.sokBruker.Aktivert == 2) {
              this.refs.brukerKompetanseSelect.className = "skjulBrukerKompetanseRolle";
              this.refs.brukerKompetanseKnapp.className = "skjulBrukerKompetanseRolle";
            }
          });

          this.refs.brukerKompetanseKnapp.onclick = () => {
            bruker.giBrukerKompetanse(this.sokBruker.Medlemsnr, this.refs.brukerKompetanseSelect.value, (result) => {
              this.tomSelect();
              this.knapperKompetanseRollerUpdate();
            });
          }

          bruker.hentBrukerIkkeRoller(this.sokBruker.Medlemsnr, (result) => {
            this.refs.brukerRolleSelect.className = "";
            this.refs.brukerRolleKnapp.className = "";

            for (let rolle of result) {
              let key = rolle.Rolle_navn;
              let verdi = rolle.Rolle_id;
              this.refs.brukerRolleSelect.add(new Option(key, verdi));
            }
            if (result.length == 0 || result[0].Rolle_id == 14 || this.sokBruker.Aktivert == 2) {
              this.refs.brukerRolleSelect.className = "skjulBrukerKompetanseRolle";
              this.refs.brukerRolleKnapp.className = "skjulBrukerKompetanseRolle";
            }
          });

          this.refs.brukerRolleKnapp.onclick = () => {
            bruker.giBrukerRolle(this.sokBruker.Medlemsnr, this.refs.brukerRolleSelect.value, (result) => {
              this.tomSelect();
              this.knapperKompetanseRollerUpdate();
            });
          }

          bruker.hentBrukerKompetanse(this.sokBruker.Medlemsnr, (result) => {

            let ulKomp = document.createElement("ul");
            for (let kompetanse of result) {
              let liKomp = document.createElement("li");
              liKomp.innerText = kompetanse.Kompetanse_navn;
              let fjernKompKnapp = document.createElement("button");
              fjernKompKnapp.innerText = "Fjern";

              fjernKompKnapp.onclick = () => {
                bruker.fjernBrukerKompetanse(this.sokBruker.Medlemsnr, kompetanse.Kompetanse_id, (result) => {
                  console.log("Fjernet kompetanse fra bruker");
                  this.knapperKompetanseRollerUpdate();
                });
              }

              liKomp.appendChild(fjernKompKnapp);
              ulKomp.appendChild(liKomp);
            }
            this.refs.sokBrukerKompetanseDiv.appendChild(ulKomp);
          });

          bruker.hentBrukerRoller(this.sokBruker.Medlemsnr, (result) => {

            let ulRolle = document.createElement("ul");
            for (let rolle of result) {
              let liRolle = document.createElement("li");
              liRolle.innerText = rolle.Rolle_navn;
              let fjernRolleKnapp = document.createElement("button");
              fjernRolleKnapp.innerText = "Fjern";

              fjernRolleKnapp.onclick = () => {
                bruker.fjernBrukerRolle(this.sokBruker.Medlemsnr, rolle.Rolle_id, (result) => {
                  console.log("Fjernet rolle fra bruker");
                  this.knapperKompetanseRollerUpdate();
                });
              }

              liRolle.appendChild(fjernRolleKnapp);
              ulRolle.appendChild(liRolle);
            }
            this.refs.sokBrukerRolleDiv.appendChild(ulRolle);
          });
        }
      }
    });
  }

  //Tømmer en select når ting skjer, ellers blir den fort full hvis du holder på...
  tomSelect() {
    for (var i = this.refs.adminLevelSelect.length - 1; i >= 0; i--) {
      this.refs.adminLevelSelect.remove(i);
    }
    for (var i = this.refs.brukerKompetanseSelect.length - 1; i >= 0; i--) {
      this.refs.brukerKompetanseSelect.remove(i);
    }
    for (var i = this.refs.brukerRolleSelect.length - 1; i >= 0; i--) {
      this.refs.brukerRolleSelect.remove(i);
    }
  }
}

class BrukerSokRediger extends React.Component {
  constructor() {
      super();

      this.innloggetBruker = {};
      this.brukerSted = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);
    return(
      <div id="redigerprofil">
        <h3>Rediger profil</h3>
        <table id="redigerprofiltable">
          <tbody>
            <tr>
              <td>Fornavn: </td>
              <td><input type="text" ref="oppdaterFornavnInput" /></td>
            </tr>
            <tr>
              <td>Etternavn: </td>
              <td><input type="text" ref="oppdaterEtternavnInput" /></td>
            </tr>
            <tr>
              <td>Telefonnummer: </td>
              <td><input type="number" ref="oppdaterTlfInput" maxLength="8" /></td>
            </tr>
            <tr>
              <td>Adresse: </td>
              <td><input type="text" ref="oppdaterAdrInput" /></td>
            </tr>
            <tr>
              <td>Postnr: </td>
              <td><input type="number" ref="oppdaterPostnrInput" /></td>
            </tr>
            <tr>
              <td>Poststed: </td>
              <td><input type="text" ref="oppdaterPoststedInput" readOnly /></td>
            </tr>
          </tbody>
        </table>
        <p ref="feilOppdatering" className="feilMelding"></p>
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

    //Henter en bruker utifra medlemsnummer og viser inforamsjonen så det kan redigeres.
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
      //Oppdaterer brukeren som er søkt etter
      this.refs.oppdaterBruker.onclick = () => {
        oppFnavn = this.refs.oppdaterFornavnInput.value;
        oppEnavn = this.refs.oppdaterEtternavnInput.value;
        oppTlf = this.refs.oppdaterTlfInput.value;
        oppAdr = this.refs.oppdaterAdrInput.value;
        oppPostnr = this.refs.oppdaterPostnrInput.value;

        //Sjekker om noen felter er tomme eller om telefon eller postnummeret er feil lengde
        if (erTom(oppFnavn) || erTom(oppEnavn) || erTom(oppTlf) || erTom(oppAdr) || erTom(oppPostnr)) {
          this.refs.feilOppdatering.innerText = "Ingen felter kan være tomme";
        } else if (oppTlf.length > 8 || oppTlf.length < 8 || oppPostnr.length > 4) {
          this.refs.feilOppdatering.innerText = "Telefon eller postnummer er feil lengde"
        } else {
          //Sjekker om postnummeret eksisterer
          //Sjekker om telefon eksisterer
          bruker.eksistererStedPostnr(oppPostnr, (result) => {
            console.log("Poststedoppdater funker");
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

    this.innloggetBruker = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    if (this.innloggetBruker.Adminlvl <= 0) {
      return(
        <div className="arrangementside">
          <h2>Kommende arrangementer</h2>
          <div ref="kommendeArrangementer"></div>
          <h2>Tidligere arrangementer</h2>
          <div ref="tidligereArrangementer"></div>
        </div>
      );
      //Hvis den innloggede brukeren er admin, så får den se ferdige arr
      //her har admin mulighet til å ferdigstille arr og checke av hvilke
      //brukere som var med på arr
    } else if (this.innloggetBruker.Adminlvl >= 1) {
      return(
        <div className="arrangementside">
          <button ref="opprettArrangementKnapp" id="opprettArrangementKnapp">Opprett arrangement</button>
          <h2>Kommende arrangementer</h2>
          <div ref="kommendeArrangementer"></div>
          <h2>Ferdige arrangementer</h2>
          <div ref="ferdigeArrangementer"></div>
          <h2>Tidligere arrangementer</h2>
          <div ref="tidligereArrangementer"></div>
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

    let iDag = new Date();

    if (this.innloggetBruker.Adminlvl >= 1) {
      this.refs.opprettArrangementKnapp.onclick = () => {
        history.push("/bruker/${this.innloggetBruker.Medlemsnr}/adminkalender");
      }
    }

    let string; let array;
    arrangement.hentArrangementer((result) => {
      for (let arr of result) {
        let arrDiv = document.createElement("div");
        arrDiv.className = "arrangementDiv";

        let arrTittel = document.createElement("p");
        let arrNavn = document.createElement("span");
        let arrBeskrivelse = document.createElement("span");
        let arrDato = document.createElement("span");

        arrNavn.className = "arrNavn"

        //Navn og beskrivelse av arrangement
        arrNavn.innerText = arr.arrnavn+"\n";
        arrBeskrivelse.innerText = arr.beskrivelse+"\n";

        //Drittgreie for å få dato
        string = arr.startdato;
        if (string != null) {
          string = string.toString();
          array = string.split(" ");
          switch(array[1]) {
              case "May":array[1] = "Mai";break;
              case "Oct":array[1] = "Okt";break;
          }
          arrDato.innerText = array[2]+". "+array[1]+" "+array[3];
        }

        arrDiv.onclick = () => {
          history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/"+arr.arrid);
          arrid = arr.arrid;
          return arrid;
        }

        arrTittel.appendChild(arrNavn);
        arrTittel.appendChild(arrBeskrivelse);
        arrTittel.appendChild(arrDato);

        arrDiv.appendChild(arrTittel);

        if (this.innloggetBruker.Adminlvl >= 1) {
          if (this.refs.kommendeArrangementer && arr.ferdig == 0 && arr.startdato >= iDag) {
            this.refs.kommendeArrangementer.appendChild(arrDiv);
          } else if (this.refs.tidligereArrangementer && arr.startdato < iDag && arr.ferdig == 0) {
            this.refs.ferdigeArrangementer.appendChild(arrDiv);
          } else if (this.refs.tidligereArrangementer && arr.ferdig >= 1) {
            this.refs.tidligereArrangementer.appendChild(arrDiv);
          }
        } else if (this.innloggetBruker.Adminlvl <= 0) {
          if (this.refs.kommendeArrangementer && arr.ferdig == 0 && arr.startdato >= iDag) {
            this.refs.kommendeArrangementer.appendChild(arrDiv);
          } else if (this.refs.tidligereArrangementer && arr.startdato < iDag || this.refs.tidligereArrangementer && arr.ferdig == 1) {
            this.refs.tidligereArrangementer.appendChild(arrDiv);
          }
        }
      }
    });
  }
}

class KalenderDetaljer extends React.Component {
  constructor() {
    super();

    this.innloggetBruker = {};
    this.arrangement = {};
  }

  render() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    return(
      <div className="arrangementside" ref="arrangementDetaljer">
        <NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Tilbake</NavLink>
        <div ref="arrangementDiv" className="arrangementDetaljerDiv">
          <h2>Arrangement</h2>
          <p id="arrnavn" ref="arrTittel">
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
          <p ref="arrangementKnappeP">
            <span ref="arrKnapperSpan"></span>
            <br />
            <span ref="interesseKnappSpan"></span>
          </p>
        </div>
        <div ref="arrangementMannskapDiv" className="arrangementDetaljerDiv">
          <h2>Mannskap og roller</h2>
          <p>
            <span ref="arrMannskapPlasser"></span>
            <span ref="arrMannskapPlasserListe"></span>
            <span ref="arrInteresserte"></span>
            <span ref="arrInteresseListe"></span>
            <span ref="arrMannskapRoller"></span>
          </p>
        </div>
        <div ref="arrangementMannskapSok" className="arrangementDetaljerDiv">
          <h2>Søk og legg til bruker</h2>
          <button ref="arrangementMannskapSokKnapp">Søk</button>
          <button ref="arrangementMannskapSokTom">Tøm liste</button>
          <p ref="arrangementMannskapSokListe"></p>
        </div>
        <div ref="rodeKorsKontaktDiv" className="arrangementDetaljerDiv">
          <h2>Røde kors kontaktperson</h2>
          <p ref="rodeKorsKontaktDetaljer">
            <span ref="rodeKorsKontaktFornavn"></span>
            <span ref="rodeKorsKontaktEtternavn"></span>
            <span ref="rodeKorsKontaktTlf"></span>
            <span ref="rodeKorsKontaktEpost"></span>
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
        <button ref="ferdigstillArrangementKnapp">Ferdigstill arrangement</button>
      </div>
    );
  }

  componentDidMount() {
    this.update();
    this.kontaktUpdate();
  }

  update() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    this.refs.interesseKnappSpan.innerText = " ";
    this.refs.arrKnapperSpan.innerText = " ";

    let iDag = new Date();

    let str; let string; let array; let array2; let detaljerArrid; let detaljerArrnavn;
    let mannskapPlasser; let bruktePlasser; let listeid;
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
            this.refs.arrDag.innerText = "Oppmøte: "+array[2]+". "+array[1]+" "+array[3];
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

          //Oppsett av vaktpoeng og utstyr for arrangementet
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

          //Henter ut mannskapslista til arrangementet
          arrangement.hentMannskapsliste(this.arrangement.arrid, (result) => {
            mannskapPlasser = result.antall_pers;
            listeid = result.listeid;

            //Henter ut alle som er satt opp til vakt på arrangementet
            arrangement.hentMannskapsVakter(result.listeid, (result) => {
              bruktePlasser = result.length;

              //Setter opp en liste over alle som er satt opp på vakter for arrangementet
              this.refs.arrMannskapPlasser.innerText = "Plasser: "+bruktePlasser+"/"+mannskapPlasser+"\n";
              if (result.length >= 1) {
                this.refs.arrMannskapPlasserListe.innerText = "Vakter:"
                for (let medlem of result) {
                  //Spørring for å se om allerede er meldt opp til vakt
                  arrangement.eksistererArrangementVakt(medlem.Medlemsnr, listeid, (result) => {
                    if (result != undefined) {
                      bruker.hentSokBruker(medlem.Medlemsnr, (result) => {
                        let vaktMedlemP = document.createElement("p");
                        vaktMedlemP.innerText += result.Fornavn+" "+result.Etternavn+" ";

                        if (result.Medlemsnr == this.innloggetBruker.Medlemsnr) {
                          vaktMedlemP.className = "egenVakt"
                        }

                        //Lager knapp for å at admin eller du skal kunne melde deg av vakt
                        if (this.arrangement.startdato >= iDag && this.innloggetBruker.Adminlvl >= 1) {
                          let vaktKnappSpan = document.createElement("span");
                          let vaktKnapp = document.createElement("button");
                          vaktKnapp.innerText = "Meld av vakt";
                          vaktKnapp.onclick = () => {
                            arrangement.slettVakt(result.Medlemsnr, listeid, (result) => {
                              console.log("Bruker meldt av vakt");
                              this.update();
                            });
                          }
                          vaktKnappSpan.appendChild(vaktKnapp);
                          vaktMedlemP.appendChild(vaktKnappSpan);
                        }
                        this.refs.arrMannskapPlasserListe.appendChild(vaktMedlemP);
                      });
                    }
                  });
                }
              } else if (result <= 0) {
                this.refs.arrMannskapPlasserListe.innerText = " ";
              }

              arrangement.hentInteresserte(this.arrangement.arrid, (result) => {
                this.refs.arrInteresseListe.innerText = " "
                //Dersom brukeren er admin, hentes ut antall interesserte
                if (this.innloggetBruker.Adminlvl >= 1 && result.length >= 1) {
                  this.refs.arrInteresserte.innerText = "Antall interesserte: "+result.length+"\n";

                  this.refs.arrInteresseListe.innerText = "Interesserte: \n"

                  for (let medlem of result) {
                    //Spørring for å se om allerede er meldt opp til vakt
                    arrangement.eksistererArrangementVakt(medlem.Medlemsnr, listeid, (result) => {
                      if (result == undefined) {
                        bruker.hentSokBruker(medlem.Medlemsnr, (result) => {
                          let interesseMedlemP = document.createElement("p");
                          interesseMedlemP.innerText += result.Fornavn+" "+result.Etternavn+", Vaktpoeng: "+result.Vaktpoeng+" ";

                          //Lager en knapp for at en admin skal kunne melde opp personer til vakt
                          if (mannskapPlasser - bruktePlasser >= 1 && this.arrangement.startdato >= iDag) {
                            let vaktKnappSpan = document.createElement("span");
                            let vaktKnapp = document.createElement("button");
                            vaktKnapp.innerText = "Meld til vakt";
                            vaktKnapp.onclick = () => {
                              arrangement.lagVakt(result.Medlemsnr, listeid, (result) => {
                                console.log("Bruker meldt opp til vakt");
                                this.update();
                              });
                            }
                            vaktKnappSpan.appendChild(vaktKnapp);
                            interesseMedlemP.appendChild(vaktKnappSpan);
                          }
                          this.refs.arrInteresseListe.appendChild(interesseMedlemP);
                        });
                      }
                    });
                  }
                }
              });
            });
            if (result.roller == null) {
              this.refs.arrMannskapRoller.innerText = "Ingen roller er satt opp enda";
            } else if (result.roller != null) {
              //Henter rollene som er satt opp i arrangementet
              this.refs.arrMannskapRoller.innerText = "Roller: \n"+result.roller;
            }

            arrangement.eksistererArrangementVakt(this.innloggetBruker.Medlemsnr, listeid, (result) => {
              if (result == undefined) {
                //Lager knapp for å melde seg interessert eller ikke interessert i et arrangement
                arrangement.sjekkInteresse(this.innloggetBruker.Medlemsnr, this.arrangement.arrid, (result) => {
                  if (result == undefined) {
                    let meldInteresseKnapp = document.createElement("button");
                    meldInteresseKnapp.innerText = "Meld interessert";

                    meldInteresseKnapp.onclick = () => {
                      arrangement.meldInteressert(this.innloggetBruker.Medlemsnr, this.arrangement.arrid, (result) => {
                        console.log("Medlem: "+this.innloggetBruker.Fornavn+" meldte seg interessert i arrangement: "+this.arrangement.arrnavn);
                        this.update();
                      });
                    }

                    this.refs.interesseKnappSpan.appendChild(meldInteresseKnapp);
                  } else if (result != undefined) {
                    let meldInteresseKnapp = document.createElement("button");
                    meldInteresseKnapp.innerText = "Avmeld interesse";

                    meldInteresseKnapp.onclick = () => {
                      arrangement.avmeldInteresse(this.innloggetBruker.Medlemsnr, this.arrangement.arrid, (result) => {
                        console.log("Medlem: "+this.innloggetBruker.Fornavn+" meldte seg ikke lenger interessert i arrangement: "+this.arrangement.arrnavn);
                        this.update();
                      });
                    }

                    this.refs.interesseKnappSpan.appendChild(meldInteresseKnapp);
                  }
                });
              }
            });
          });

          //Lager knappene for å redigere og slette arrangementet samt mer
          if (this.innloggetBruker.Adminlvl >= 1) {
            let redigerArrKnapp = document.createElement("button");
            let slettArrKnapp = document.createElement("button");

            redigerArrKnapp.onclick = () => {
              history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/{arrid}/rediger/")
              arrid = this.arrangement.arrid;
              return arrid;
            }
            //sletter arr og spørr om du er sikker
            slettArrKnapp.onclick = () => {
              let slett = confirm("Er du sikker på du vil slette arrangement\n"+this.arrangement.arrnavn+"?")
              if (slett) {
                arrangement.hentMannskapsliste(this.arrangement.arrid, (result) => {
                  arrangement.slettVakter(result.listeid, (result) => {
                    console.log("Vaktene til arrangement: "+this.arrangement.arrnavn+" slettet");
                    arrangement.slettInteresserte(this.arrangement.arrid, (result) => {
                      console.log("De interesserte til arrangement: "+this.arrangement.arrnavn);
                    });
                    arrangement.slettMannskapsliste(this.arrangement.arrid, (result) => {
                      console.log("Mannskapsliste til arrangement: "+this.arrangement.arrnavn+" slettet");
                      arrangement.slettArrangement(this.arrangement.arrid, (result) => {
                        console.log("Arrangement med navn: "+this.arrangement.arrnavn+", og id:"+this.arrangement.arrid+" slettet");
                        history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangementer/");
                        this.forceUpdate();
                      });
                    });
                  });
                });
              }
            }
            //Sjekker om arrangementet er ferdig og viser ikke knappene hvis arrangementet er ferdig
            if (this.arrangement.ferdig == 0 && this.arrangement.startdato >= iDag) {
              redigerArrKnapp.innerText = "Rediger";
              slettArrKnapp.innerText = "Slett";
              this.refs.arrKnapperSpan.appendChild(redigerArrKnapp);
              this.refs.arrKnapperSpan.appendChild(slettArrKnapp);
            } else if (this.arrangement.startdato < iDag) {
              if(this.arrangement.ferdig == 1) {
                this.refs.arrangementDiv.removeChild(this.refs.arrangementKnappeP);
              } else if (this.arrangement.ferdig == 0) {
                redigerArrKnapp.innerText = "Rediger";
                this.refs.arrKnapperSpan.appendChild(redigerArrKnapp);
                this.refs.arrangementKnappeP.removeChild(this.refs.interesseKnappSpan);
              }
            }

            let month; let datoString; let datoArray;
            let datoTing = new Date();
            datoTing.setDate(this.arrangement.startdato.getDate());
            datoTing.setMonth(this.arrangement.startdato.getMonth());
            datoTing.setYear(this.arrangement.startdato.getFullYear());
            if (datoTing != null) {
              datoString = datoTing.toString();
              datoArray = datoString.split(" ");
              //Kreves for å sette måneden til tall istedet for bokstaver
              switch(datoArray[1]) {
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
              datoString = datoArray[3]+"-"+month+"-"+datoArray[2];
            }

            this.refs.arrangementMannskapSokListe.innerText = " ";
            this.refs.arrangementMannskapSokKnapp.onclick = () => {
              this.refs.arrangementMannskapSokListe.innerText = " ";
              bruker.hentBrukereFraVaktpoeng((result) => {
                let sokListeUl = document.createElement("ul");
                for (let medlem of result) {
                  bruker.sjekkBrukerPassiv(medlem.Medlemsnr, datoString, (result) => {
                    if (result == undefined) {
                      arrangement.sjekkInteresse(medlem.Medlemsnr, this.arrangement.arrid, (result) => {
                        if (result == undefined) {
                          if (medlem.Aktivert == 1) {
                            let sokListeLi = document.createElement("li");
                            sokListeLi.innerText = medlem.Fornavn+" "+medlem.Etternavn+", Vaktpoeng: "+medlem.Vaktpoeng+" ";
                            let sokListeKnapp = document.createElement("button");
                            sokListeKnapp.innerText = "Meld interessert";
                            sokListeKnapp.onclick = () => {
                              arrangement.meldInteressert(medlem.Medlemsnr, this.arrangement.arrid, (result) => {
                                console.log("Bruker: "+medlem.Fornavn+" meldt interessert");
                                this.update();
                              });
                            }

                            sokListeLi.appendChild(sokListeKnapp);
                            sokListeUl.appendChild(sokListeLi);
                          }
                        }
                      });
                    }
                  });
                }
                this.refs.arrangementMannskapSokListe.appendChild(sokListeUl);
              });
            }

            this.refs.arrangementMannskapSokTom.onclick = () => {
              this.refs.arrangementMannskapSokListe.innerText = " ";
            }

          } else if (this.innloggetBruker.Adminlvl <= 0) {
            if (this.arrangement.ferdig == 1 || this.arrangement.startdato < iDag) {
              this.refs.arrangementDiv.removeChild(this.refs.arrangementKnappeP);
            }

            this.refs.arrangementMannskapSok.id = "skjulMannskapSok"
            this.refs.arrangementKontaktDiv.id = "skjulKontaktperson";
            this.refs.ferdigstillArrangementKnapp.id = "skjulFerdigstillArrangementKnapp";
          }
        }
        // Admin blir spurt om å ferdigstille arr dersom arr er over
        if (this.innloggetBruker.Adminlvl >= 1) {
          setTimeout(function(){
            arrangement.hentArrangement(arrid, (result) => {
              if (result.startdato < iDag && result.ferdig <= 0) {
                let avslutt = confirm("Arrangementet er ferdig, vil du ferdigstille arrangementet?");
                if (avslutt) {
                  history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/{arrid}/avslutt");
                  arrid = result.arrid;
                  return arrid;
                }
              }
            });
          }, 500)
          //ferdigstiller arr
          if (result.ferdig == 0) {
            this.refs.ferdigstillArrangementKnapp.onclick = () => {
              history.push("/bruker/{this.innloggetBruker.Medlemsnr}/arrangement/{arrid}/avslutt");
              arrid = this.arrangement.arrid;
              return arrid;
            }
          } else if (result.ferdig >= 1) {
            this.refs.arrangementDetaljer.removeChild(this.refs.ferdigstillArrangementKnapp);
          }
        }
      });
    }
  }

  //Egen funksjon for å skrive ut kontaktpersonene, fordi de ikke trenger å oppdateres som resten
  kontaktUpdate() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    if (arrid) {
      arrangement.hentArrangement(arrid, (result) => {
        if (this.refs.arrangementDiv) {
          bruker.hentSokBruker(result.opprettet_av, (result) => {
            if (this.refs.rodeKorsKontaktDiv) {
              this.refs.rodeKorsKontaktFornavn.innerText = "Navn: "+result.Fornavn+" ";
              this.refs.rodeKorsKontaktEtternavn.innerText = result.Etternavn+"\n";
              this.refs.rodeKorsKontaktTlf.innerText = "Telefon: "+result.Telefon+"\n";
              this.refs.rodeKorsKontaktEpost.innerText = "Epost: "+result.Epost;
            }
          });
          if (this.innloggetBruker.Adminlvl >= 1) {
            arrangement.hentArrangementKontakt(result.Kontakt_id, (result) => {
              if (this.refs.arrangementKontaktDiv) {
                this.refs.kontaktFornavn.innerText = "Navn: "+result.Fornavn+" ";
                this.refs.kontaktEtternavn.innerText = result.Etternavn+"\n";
                this.refs.kontaktTlf.innerText = "Telefon: "+result.Telefon+"\n";
                this.refs.kontaktEpost.innerText = "Epost: "+result.Epost;
              }
            });
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

    this.innloggetBruker = {};
  }

  render() {
    return(
      <div id="opprettArrangement" className="arrangementDetaljerDiv">
        <div id="opprettArrangementDiv" ref="opprettArrangementDiv">
          <h2>Arrangement</h2>
          <table style={{width:"100%"}}>
            <tbody>
              <tr>
                <td>Navn: </td>
                <td><input type="text" ref="arrNavn" placeholder="Arrangementnavn" /></td>
              </tr>
              <tr>
                <td>Beskrivelse: </td>
                <td><textarea rows="5" cols="30" ref="arrBeskrivelse" placeholder="Beskrivelse" /></td>
              </tr>
              <tr>
                <td>Startdato: </td>
                <td><input type="date" ref="arrDato"/></td>
              </tr>
              <tr>
                <td>Sted: </td>
                <td><input type="text" ref="arrSted" placeholder="Lokasjon" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="opprettArrangementKontakt" ref="opprettArrangementKontakt">
          <h2>Kontaktperson</h2>
          <table style={{width:"100%"}}>
            <tbody>
              <tr>
                <td>Navn: </td>
                <td><input type="text" ref="kontaktFornavn" placeholder="Fornavn" /> <input type="text" ref="kontaktEtternavn" placeholder="Etternavn" /></td>
              </tr>
              <tr>
                <td>Telefon: </td>
                <td><input type="number" ref="kontaktTlf" /></td>
              </tr>
              <tr>
                <td>Epost: </td>
                <td><input type="text" ref="kontaktEpost" placeholder="Epost" /></td>
              </tr>
            </tbody>
          </table>
          <p ref="opprettArrangementAdvarsel"></p>
          <button ref="opprettArrangement">Ferdig</button>
          <button ref="tilbakeArrangement">Avbryt</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    //Henter all informasjon som er skrevet og lager arrangementet
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

      //Sjekker om noen av feltene er tomme og om telefonnummeret er riktig lengde og om det er en epost som skrives inn
      if (erTom(arrNavn) || erTom(arrBeskrivelse) || erTom(arrDato) || erTom(arrSted) || erTom(kontaktFornavn) || erTom(kontaktEtternavn) || erTom(kontaktTlf) || erTom(kontaktEpost)) {
        this.refs.opprettArrangementAdvarsel.innerText = "Fyll inn alle felter!";
      } else if (kontaktTlf.length > 8 || kontaktTlf.length < 8) {
        this.refs.opprettArrangementAdvarsel.innerText = "Telefonnummeret er feil lengde"
      } else if (!kontaktEpost.includes("@") || !kontaktEpost.includes(".")) {
        this.refs.opprettArrangementAdvarsel.innerText = "Eposten er feil";
      } else {
        //Oppretter arrangementet og henter id-en og oppretter en mannskapsliste for arrangementet
        arrangement.opprettArrangement(arrNavn, arrBeskrivelse, arrDato, arrSted, this.innloggetBruker.Medlemsnr, (result) => {
          console.log("Arrangement opprettet");
          arrangement.hentArrangementId(arrNavn, arrDato, arrSted, (result) => {
            console.log("Hentet arrid: "+result.arrid);
            arrangement.opprettMannskapsliste(result.arrid, (result) => {
              console.log("Mannskapsliste opprettet");
            });
          });
        });

        //Sjekker om det arrangementkontakten eksisterer og oppretter en og setter den til arrangementet
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

            //Hvis arrangementkontakten eksisterer, henter ut den og setter den til arrangementet
            arrangement.velgArrangementKontakt(kontaktTlf, kontaktEpost, (result) => {
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

class RedigerArrangement extends React.Component {
  constructor() {
    super();

    this.innloggetBruker = {};
    this.arrangement = {};
  }

  render() {
    return(
      <div ref="redigerArrDiv" id="redigerArrDiv" className="arrangementDetaljerDiv">
        <p>Alle felter med * er obligatoriske</p>
        <div ref="arrangementRediger" id="arrangementRediger">
          <h2>Arrangement</h2>
          <table style={{width:"100%"}}>
            <tbody>
              <tr>
                <td>Arrangementnavn*: </td>
                <td><input type="text" ref="oppdaterArrNavn" id="oppdaterArrNavn" placeholder="Arrangementnavn" /></td>
              </tr>
              <tr>
                <td>Arrangementbeskrivelse*: </td>
                <td><textarea rows="5" cols="40" ref="oppdaterArrBeskrivelse" id="oppdaterArrBeskrivelse" placeholder="Beskrivelse" /></td>
              </tr>
              <tr>
                <td>Dato og oppmøtetid*: </td>
                <td><input type="date" ref="oppdaterDato" id="oppdaterDato" /> <input type="time" ref="oppdaterOppmote" id="oppdaterOppmote" /></td>
              </tr>
              <tr>
                <td>Sted*: </td>
                <td><input type="text" ref="oppdaterSted" id="oppdaterSted" placeholder="Oppmøtested" /></td>
              </tr>
              <tr>
                <td>Postnummer*/sted: </td>
                <td><input type="number" ref="oppdaterPostnr" id="oppdaterPostnr" /> <input type="text" ref="oppdaterPoststed" id="oppdaterPoststed" readOnly/></td>
              </tr>
              <tr>
                <td>Arrangementstart*/-slutt</td>
                <td><input type="time" ref="oppdaterStartTid" id="oppdaterStartTid" /> <input type="time" ref="oppdaterSluttTid" /></td>
              </tr>
              <tr>
                <td>Utsyrsliste: </td>
                <td><textarea rows="5" cols="40" ref="oppdaterUtstyrsliste" id="oppdaterUtstyrsliste" placeholder="Utstyrsliste" /></td>
              </tr>
              <tr>
                <td>Vaktpoeng: </td>
                <td><input type="number" ref="oppdaterVaktPoeng" id="oppdaterVaktPoeng" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div ref="medlemslisteRedigerDiv" id="medlemslisteRedigerDiv">
          <h2>Mannskapsliste</h2>
          <table style={{width:"100%"}}>
            <tbody>
              <tr>
                <td>Mannskap: </td>
                <td><input type="number" ref="antallMannskap" id="antallMannskap" /></td>
              </tr>
              <tr>
                <td>Roller: </td>
                <td><textarea rows="5" cols="40" ref="rollerMannskap" id="rollerMannskap" placeholder="Roller til arrangementet" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div ref="redigerArrangementKnapperDiv" id="redigerArrangementKnapperDiv">
          <button ref="redigerArrangementKnapp" id="redigerArrangementKnapp">Ferdig</button>
          <button ref="avbrytRedigerArrangementKnapp" id="avbrytRedigerArrangementKnapp">Avbryt</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //Kaller på hentbruker to ganger fordi hvorfor ikke :P
    this.innloggetBruker = bruker.hentBruker();
    this.innloggetBruker = bruker.hentOppdatertBruker(this.innloggetBruker.Medlemsnr);

    let arrnavn; let beskrivelse; let arrDato; let oppmotetid; let sted; let postnr; let starttid; let sluttid; let utstyrsliste; let vaktpoeng; let antallMannskap; let rollerMannskap;
    let dato;

    if (arrid) {
      arrangement.hentArrangement(arrid, (result) => {
        this.arrangement = result;
        //Vår første ide på å løse problemet med dato
        //
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

        //Må sette datoen selv, fordi JS begynner dato på 0
        dato = new Date();
        dato.setDate(this.arrangement.startdato.getDate());
        dato.setMonth(this.arrangement.startdato.getMonth());
        dato.setYear(this.arrangement.startdato.getFullYear());

        this.refs.oppdaterArrNavn.value = this.arrangement.arrnavn;
        this.refs.oppdaterArrBeskrivelse.value = this.arrangement.beskrivelse;
        this.refs.oppdaterDato.valueAsNumber = dato;
        //Dette gir datoen-1, fordi vi er i GMT+2 og den regner fra GMT og klokka er 00:00:00
        // this.refs.oppdaterDato.valueAsNumber = this.arrangement.startdato;
        this.refs.oppdaterOppmote.value = this.arrangement.oppmøtetid;
        this.refs.oppdaterSted.value = this.arrangement.oppmøtested;
        this.refs.oppdaterPostnr.value = this.arrangement.postnr;
        this.refs.oppdaterStartTid.value = this.arrangement.tidstart;
        this.refs.oppdaterSluttTid.value = this.arrangement.tidslutt;
        this.refs.oppdaterUtstyrsliste.value = this.arrangement.utstyrsliste;
        this.refs.oppdaterVaktPoeng.value = this.arrangement.vaktpoeng;

        arrangement.hentMannskapsliste(this.arrangement.arrid, (result) => {
          this.refs.antallMannskap.value = result.antall_pers;
          this.refs.rollerMannskap.value = result.roller;
        });

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

        //Henter ut inforamsjonen som ble skrevet inn og redigerer arrangementet
        this.refs.redigerArrangementKnapp.onclick = () => {
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
          antallMannskap = this.refs.antallMannskap.value;
          rollerMannskap = this.refs.rollerMannskap.value;

          //Sjekker om noen felter er tomme, og deretter redigerer arrangementet og mannskapslisten
          if (erTom(arrnavn) || erTom(beskrivelse) || erTom(arrDato) || erTom(oppmotetid) || erTom(sted) || erTom(postnr) || erTom(starttid)) {

          } else {
            arrangement.redigerArrangement(this.arrangement.arrid, arrnavn, beskrivelse, arrDato, oppmotetid, sted, postnr, starttid, sluttid, utstyrsliste, vaktpoeng, (result) => {
              console.log("Arrangementet er oppdatert");
            });
            arrangement.redigerMannskapsliste(this.arrangement.arrid, antallMannskap, rollerMannskap, (result) => {
              console.log("Mannskapslista er oppdatert");
              history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
              this.forceUpdate();
            })
          }
        }
        this.refs.avbrytRedigerArrangementKnapp.onclick = () => {
          history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
          this.forceUpdate();
        }
      });
    }
  }
}

class AvsluttArrangement extends React.Component {
  constructor() {
    super();

    this.innloggetBruker = {};
    this.arrangement = {};
  }

  render() {
    return(
      <div className="sentrertboks" ref="arrangementAvslutt">
        <NavLink exact to="/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer" className="linker">Tilbake</NavLink>
        <h2>Ferdigstilling av arrangement</h2>
        <div ref="arrangementAvsluttDetaljer">
          <h3>Arrangement</h3>
          <p>
            <span ref="arrangementAvsluttNavn"></span>
            <span ref="arrangementAvsluttBeskrivelse"></span>
            <span ref="arrangementAvsluttDato"></span>
          </p>
        </div>
        <div ref="arrangementAvsluttVakter">
          <h3>Vakter</h3>
          <span>Sjekk av for de som var på arrangement</span>
        </div>
        <button ref="avsluttArrangementKnapp">Ferdigstill arrangement</button>
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

    let string; let array;
    //Gjør klar og ferdigstiller arrangementet
    if (arrid) {
      arrangement.hentArrangement(arrid, (result) => {
        this.arrangement = result;

        if (this.refs.arrangementAvslutt) {
          this.refs.arrangementAvsluttNavn.innerText = this.arrangement.arrnavn+"\n";
          this.refs.arrangementAvsluttBeskrivelse.innerText = this.arrangement.beskrivelse+"\n";

          //Drittgreie for å få dato
          string = this.arrangement.startdato;
          if (string != null) {
            string = string.toString();
            array = string.split(" ");
            this.refs.arrangementAvsluttDato.innerText = "Oppmøte: "+array[2]+" "+array[1]+" "+array[3];
          }
        }
        //Henter de som var satt opp til vakt på arrangementet og gir en sjekkboks for å si om de møtte opp på vakt eller ikke
        arrangement.hentMannskapsliste(this.arrangement.arrid, (result) => {
          arrangement.hentMannskapsVakter(result.listeid, (result) => {
            for (let medlem of result) {
              let medlemP = document.createElement("p");
              bruker.hentSokBruker(medlem.Medlemsnr, (result) => {
                let vaktSjekk = document.createElement("input");
                vaktSjekk.setAttribute("type", "checkbox");
                vaktSjekk.checked = true;
                vaktSjekk.ref = vaktSjekk.id = result.Medlemsnr;
                vaktSjekk.className = "avsluttArrangementSjekkboks";

                let vaktSpan = document.createElement("span");
                vaktSpan.innerText = result.Fornavn+" "+result.Etternavn;

                medlemP.appendChild(vaktSjekk);
                medlemP.appendChild(vaktSpan);
              });
              this.refs.arrangementAvsluttVakter.appendChild(medlemP);
            }
          });

          //Ferdigstiller arrangementet og alle som var satt opp på vakt til det
          this.refs.avsluttArrangementKnapp.onclick = () => {
            let erDuSikker = confirm("Vil du ferdigstille arrangementet?")
            if (erDuSikker) {
              let sjekkbokserKlasse = document.getElementsByClassName("avsluttArrangementSjekkboks");
              for (let sjekkbokser of sjekkbokserKlasse) {
                if (!sjekkbokser.checked) {
                  arrangement.ferdigstillVakt(sjekkbokser.id, result.listeid, (result) => {
                    console.log("Bruker: "+sjekkbokser.id+" var ikke tilstede");
                  });
                } else if (sjekkbokser.checked) {
                  arrangement.ferdigstillVaktVaktpoeng(sjekkbokser.id, this.arrangement.arrid, (result) => {
                    console.log("Bruker: "+sjekkbokser.id+" fikk "+arrangement.vaktpoeng+" vaktpoeng");
                  });
                }
              }
              arrangement.ferdigstillArrangement(this.arrangement.arrid, (result) => {
                console.log("Arrangement: "+this.arrangement.arrnavn+" ble satt til ferdig");
                history.push("/bruker/${this.innloggetBruker.Medlemsnr}/arrangementer/");
              });
            }
          }
        });
      });
    }
  }
}

function erTom(str) {
  return (!str || 0 === str.length);
}

//Søkefunksjon for personer med valgbare personer
function sok(result, ref, feilmelding) {
  let sokeliste = document.createElement("ul");
  sokeliste.id="sokeliste"

  for(let medlem of result){
    let navn = document.createElement("li");
    navn.className="sokenavn"

    //Legger farge på brukere her(eller i CSS-en da..., dette gir dem bare en klasse)
    //Rød hvis ikke aktivert, grå hvis deaktivert
    if (medlem.Aktivert == 0) {
      navn.className="aktiver"
    }
    if (medlem.Aktivert == 2){
      navn.className="deaktiver";
    }

    //Skriver ut navnene på resultatene og om de er administratorer
    navn.innerText = medlem.Fornavn + ' ' + medlem.Etternavn;
    if (medlem.Adminlvl >= 1) {
      navn.innerText += ", (Administrator)"
    }
    navn.onclick = () => {
      history.push("/bruker/{this.innloggetBruker.Medlemsnr}/sok/{medlem.Medlemsnr}");
      sokMedlemsnr = medlem.Medlemsnr;
      return sokMedlemsnr;
    }

    sokeliste.appendChild(navn);
  }
  ref.appendChild(sokeliste);
  if (result.length == 0) {
    ref.innerText = feilmelding;
  }
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
        <Route exact path="/bruker/:medlemsnr/arrangement/:arrid/rediger" component={RedigerArrangement} />
        <Route exact path="/bruker/:medlemsnr/arrangement/:arrid/avslutt" component={AvsluttArrangement} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById("root"));

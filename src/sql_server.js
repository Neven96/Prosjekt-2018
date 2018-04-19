import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_7',
    password: 'RqKPj757',
    database: 'g_oops_7'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

class Bruker {
  //Logger inn brukeren og putter informasjonen inn i et JSON-objekt
  loggInnBruker(epost, passord, callback) {
    connection.query("SELECT * FROM Medlem WHERE Epost = ? AND Passord = ?", [epost, passord], (error, result) => {
      if (error) throw error;

      sessionStorage.setItem("innloggetBruker", JSON.stringify(result[0]));

      callback(result[0]);
    });
  }

  //Henter ut JSON-elementet som ble laget fra innloggingen
  hentBruker() {
    let ting = sessionStorage.getItem("innloggetBruker");

    if (!ting) return null;
    return JSON.parse(ting);
  }

  //Lager et JSON-objekt med oppdatert innformasjon og henter det ut
  hentOppdatertBruker(medlemsnr) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [medlemsnr], (error, result) => {
      if (error) throw error;

      sessionStorage.setItem("innloggetBruker", JSON.stringify(result[0]));
    });

    let ting = sessionStorage.getItem("innloggetBruker");

    if (!ting) return null;
    return JSON.parse(ting);
  }

  //Gjett hva...
  //Tømmer alt lagret i JSON
  loggUtBruker() {
    sessionStorage.clear();
  }

  //Henter passordet til en bruker fra navn og epost
  //Veldig fin måte å få et glemt passord
  hentBrukerPassord(fornavn, etternavn, epost, callback) {
    connection.query("SELECT Passord FROM Medlem WHERE Fornavn = ? AND Etternavn = ? AND Epost = ?", [fornavn, etternavn, epost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Henter poststed ut ifra postnummer
  hentPoststed(postnr, callback) {
    connection.query("SELECT Poststed FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Registrerer en bruker
  registrerBruker(fnavn, enavn, tlf, adresse, postnr, epost, passord, callback) {
    connection.query("INSERT INTO Medlem (Fornavn, Etternavn, Telefon, Adresse, Postnr, Epost, Passord) VALUES (?, ?, ?, ?, ?, ?, ?)", [fnavn, enavn, tlf, adresse, postnr, epost, passord], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Sjekker om epost, telfon, telfon til innlogget bruker, og postnummer eksisterer
  eksistererBrukerEpost(epost, callback) {
    connection.query("SELECT 1 FROM Medlem WHERE Epost = ?", [epost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  eksistererBrukerTlf(tlf, callback) {
    connection.query("SELECT 1 FROM Medlem WHERE Telefon = ?", [tlf], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  eksistererBrukerTlfOppdater(medlemsnr, tlf, callback) {
    connection.query("SELECT 1 FROM Medlem WHERE Telefon = ? AND Medlemsnr <> ?", [tlf, medlemsnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  eksistererStedPostnr(postnr, callback) {
    connection.query("SELECT 1 FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Oppdaterer en allerede eksisterende bruker
  oppdaterBruker(medlemsnr, fnavn, enavn, tlf, adresse, postnr, callback) {
    connection.query("UPDATE Medlem SET Fornavn = ?, Etternavn = ?, Telefon = ?, Adresse = ?, Postnr = ? WHERE Medlemsnr = ?", [fnavn, enavn, tlf, adresse, postnr, medlemsnr], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Søker etter bruker via fornavn, etternavn eller begge
  sokBruker(inn, callback) {
    connection.query("SELECT * FROM Medlem WHERE CONCAT (Fornavn, ' ', Etternavn) LIKE ? OR Etternavn LIKE ? ORDER BY Fornavn ASC", [inn + "%", inn + "%"], (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }

  //Henter ut informasjonen til brukeren som ble søkt opp
  hentSokBruker(medlemsnr, callback) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [medlemsnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Aktiverer en ikke aktivert bruker
  aktiverBruker(medlemsnr, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [1, medlemsnr], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Deaktiverer en bruker som har sluttet
  deaktiverBruker(medlemsnr, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [2, medlemsnr], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Gjør en bruker til admin
  adminBruker(medlemsnr, adminlvl, callback) {
    connection.query("UPDATE Medlem SET Adminlvl = ? WHERE Medlemsnr = ?", [adminlvl, medlemsnr], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
}

/*
|||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||ARRANGEMENT|||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||
*/

class Arrangement {
  //Henter alle arrangementene
  hentArrangementer(callback) {
    connection.query("SELECT * FROM Arrangement ORDER BY startdato ASC", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  //Henter ut et spesifikt arrangement
  hentArrangement(arrid, callback) {
    connection.query("SELECT * FROM Arrangement WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Hente arrangementet for kalenderen
  hentArrKal(callback) {
    connection.query("SELECT arrid, arrnavn AS title, startdato AS startDate FROM Arrangement", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  //Henter ut poststedet til arrangementet
  hentArrangementPoststed(postnr, callback) {
    connection.query("SELECT Poststed FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentArrangementId(arrnavn, dato, sted, callback) {
    connection.query("SELECT arrid FROM Arrangement WHERE arrnavn = ? AND startdato = ? AND oppmøtested = ?", [arrnavn, dato, sted], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentMannskapsliste(arrid, callback) {
    connection.query("SELECT * FROM Mannskapsliste WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Henter informasjon til de som er satt opp til vakt
  hentMannskapsVakter(listeid, callback) {
    connection.query("SELECT * FROM Vakt WHERE listeid = ?", [listeid], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  //Sjekker om bruker er meldt opp til vakt
  eksistererArrangementVakt(medlemsnr, listeid, callback) {
    connection.query("SELECT 1 FROM Vakt WHERE Medlemsnr = ? AND listeid = ?", [medlemsnr, listeid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Henter informasjonen om kontaktpersonen
  hentArrangementKontakt(kontaktid, callback) {
    connection.query("SELECT * FROM Kontaktperson WHERE Kontakt_id = ?", [kontaktid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentInteresserte(arrid, callback) {
    connection.query("SELECT * FROM Interesse WHERE Arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  //Oppretter et arrangement med noen få detaljer
  opprettArrangement(arrnavn, beskrivelse, dato, sted, callback) {
    connection.query("INSERT INTO Arrangement (arrnavn, beskrivelse, startdato, oppmøtested) VALUES (?, ?, ?, ?)", [arrnavn, beskrivelse, dato, sted], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  opprettMannskapsliste(arrid, callback) {
    connection.query("INSERT INTO Mannskapsliste (arrid) VALUES (?)", [arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Sjekker om kontaktpersonen allerede finnes i databasen, hvis ikke(...)
  eksistererArrangementKontakt(tlf, epost, callback) {
    connection.query("SELECT 1 FROM Kontaktperson WHERE Telefon = ? OR Epost = ?", [tlf, epost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //(...)opprettes kontaktpersonen for arrangementet
  opprettArrangementKontakt(fornavn, etternavn, tlf, epost, callback) {
    connection.query("INSERT INTO Kontaktperson (Fornavn, Etternavn, Telefon, Epost) VALUES (?, ?, ?, ?)", [fornavn, etternavn, tlf, epost], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Henter ut informasjon om kontaktpersonen og(...)
  velgArrangementKontakt(kontakttlf, kontaktepost, callback) {
    connection.query("SELECT Kontakt_id FROM Kontaktperson WHERE Telefon = ? OR Epost = ?", [kontakttlf, kontaktepost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //(...)setter det inn i arrangementet
  oppdaterArrangementKontakt(kontaktid, arrnavn, arrdato, arrsted, callback) {
    connection.query("UPDATE Arrangement SET Kontakt_id = ? WHERE arrnavn = ? AND startdato = ? AND oppmøtested = ?", [kontaktid, arrnavn, arrdato, arrsted], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Sjekker om brukeren allerde har meldt seg interessert for et arrangement
  sjekkInteresse(medlemsnr, arrid, callback) {
    connection.query("SELECT 1 FROM Interesse WHERE Medlemsnr = ? AND Arrid = ?", [medlemsnr, arrid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Melde seg interessert for arrangement
  meldInteressert(medlemsnr, arrid, callback) {
    connection.query("INSERT INTO Interesse (Medlemsnr, Arrid) VALUES (?, ?)", [medlemsnr, arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Avmelde interesse for arrangement
  avmeldInteresse(medlemsnr, arrid, callback) {
    connection.query("DELETE FROM Interesse WHERE Medlemsnr = ? AND Arrid = ?", [medlemsnr, arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Sette opp person til vakt
  lagVakt(medlemsnr, listeid, callback) {
    connection.query("INSERT INTO Vakt (Medlemsnr, listeid) VALUES (?, ?)", [medlemsnr, listeid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Melde person av vakt
  slettVakt(medlemsnr, listeid, callback) {
    connection.query("DELETE FROM Vakt WHERE Medlemsnr = ? AND listeid = ?", [medlemsnr, listeid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Redigerer arrangementet og her trengs ikke alt
  redigerArrangement(arrid, arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, vaktpoeng, callback) {
    //Hvis sluttid er tom
    if (erTom(sluttid)) {

      if (erTom(utstyr)) {

        if (erTom(vaktpoeng)) {
          //Hvis sluttid, utstyr og vaktpoeng er tomme
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, arrid], (error, result) => {
            if (error) throw error;

            callback();
          });
        } else {
          //Hvis sluttid og utstyr er tom
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, vaktpoeng, arrid], (error, result) => {
            if (error) throw error;

            callback();
          });
        }
      }

      else if (erTom(vaktpoeng)) {
        //Hvis sluttid og vaktpoeng er tom
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, utstyrsliste = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, utstyr, arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      } else {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, utstyrsliste = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, utstyr, vaktpoeng, arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      }
    }
    //Hvis utstyr er tom
    else if (erTom(utstyr)) {
      //Hvis utstyr og vaktpoeng er tom
      if (erTom(vaktpoeng)) {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      } else {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, vaktpoeng, arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      }
    }
    //Hvis vaktpoeng er tom
    else if(erTom(vaktpoeng)) {
      connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, utstyrsliste = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, arrid], (error, result) => {
        if (error) throw error;

        callback();
      });
    }
    //Hvis ingen er tomme
    else {
      connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, utstyrsliste = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, vaktpoeng, arrid], (error, result) => {
        if (error) throw error;

        callback();
      });
    }
  }

  //Redigerer mannskapslista
  redigerMannskapsliste(arrid, mannskap, roller, callback) {
    //Hvis antall mannskap er tomt
    if (erTom(mannskap)) {
      //Hvis både antall mannskap og roller er tomme, henter bare 1 for at den skal gjøre noe
      if (erTom(roller)) {
        connection.query("SELECT 1 FROM Mannskapsliste WHERE arrid = ?", [arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      } else {
        connection.query("UPDATE Mannskapsliste SET roller = ? WHERE arrid = ?", [roller, arrid], (error, result) => {
          if (error) throw error;

          callback();
        });
      }
    } else if (erTom(roller)) {
      connection.query("UPDATE Mannskapsliste SET antall_pers = ? WHERE arrid = ?", [mannskap, arrid], (error, result) => {
        if (error) throw error;

        callback();
      });
    } else {
      connection.query("UPDATE Mannskapsliste SET antall_pers = ?, roller = ? WHERE arrid = ?", [mannskap, roller, arrid], (error, result) => {
        if (error) throw error;

        callback();
      });
    }
  }

  //Ferdigstiller en vakt
  ferdigstillVakt(medlemsnr, listeid, callback) {
    connection.query("UPDATE Vakt SET oppdatert = 1 WHERE Medlemsnr = ? AND listeid = ?", [medlemsnr, listeid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  ferdigstillVaktVaktpoeng(medlemsnr, arrid, callback) {
    connection.query("UPDATE Vakt, Medlem, Arrangement, Mannskapsliste SET Medlem.Vaktpoeng = Medlem.Vaktpoeng + Arrangement.vaktpoeng, Vakt.oppdatert = 1 WHERE Arrangement.arrid = ? AND Medlem.Medlemsnr = ? AND (Vakt.Medlemsnr = ? AND Arrangement.arrid = Mannskapsliste.arrid AND Mannskapsliste.listeid = Vakt.listeid)", [arrid, medlemsnr, medlemsnr], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  ferdigstillArrangement(arrid, callback) {
    connection.query("UPDATE Arrangement SET ferdig = 1 WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Jeg lurer på hva denne gjør
  slettArrangement(arrid, callback) {
    connection.query("DELETE FROM Arrangement WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  slettMannskapsliste(arrid, callback) {
    connection.query("DELETE FROM Mannskapsliste WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  slettInteresserte(arrid, callback) {
    connection.query("DELETE FROM Interesse WHERE arrid = ?", [arrid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  slettVakter(listeid, callback) {
    connection.query("DELETE FROM Vakt WHERE listeid = ?", [listeid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
}

//Funksjon for å sjekke om en string er tom
function erTom(str) {
  return (!str || 0 === str.length);
}

let bruker = new Bruker();
let arrangement = new Arrangement();

export {bruker, arrangement};

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
  eksistererBrukerTlfOppdater(id, tlf, callback) {
    connection.query("SELECT 1 FROM Medlem WHERE Telefon = ? AND Medlemsnr <> ?", [tlf, id], (error, result) => {
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
  oppdaterBruker(id, fnavn, enavn, tlf, adresse, postnr, callback) {
    connection.query("UPDATE Medlem SET Fornavn = ?, Etternavn = ?, Telefon = ?, Adresse = ?, Postnr = ? WHERE Medlemsnr = ?", [fnavn, enavn, tlf, adresse, postnr, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Søker etter bruker enten via fornavn eller etternavn, men ikke begge
  sokBruker(inn, callback) {
    connection.query("SELECT * FROM Medlem WHERE Fornavn LIKE ? OR Etternavn LIKE ? ORDER BY Fornavn ASC", [inn + "%", inn + "%"], (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }

  //Henter ut informasjonen til brukeren som ble søkt opp
  hentSokBruker(id, callback) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Aktiverer en ikke aktivert bruker
  aktiverBruker(id, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [1, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Deaktiverer en bruker som har sluttet
  deaktiverBruker(id, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [2, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  //Gjør en bruker til admin
  adminBruker(id, adminlvl, callback) {
    connection.query("UPDATE Medlem SET Adminlvl = ? WHERE Medlemsnr = ?", [adminlvl, id], (error, result) => {
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
    connection.query("SELECT * FROM Arrangement", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  //Henter ut et spesifikt arrangement
  hentArrangement(id, callback) {
    connection.query("SELECT * FROM Arrangement WHERE arrid = ?", [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Henter ut poststedet til arrangementet
  hentArrangementPoststed(postnr, callback) {
    connection.query("SELECT Poststed FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Oppretter et arrangement med noen få detaljer
  opprettArrangement(arrnavn, beskrivelse, dato, sted, callback) {
    connection.query("INSERT INTO Arrangement (arrnavn, beskrivelse, startdato, oppmøtested) VALUES (?, ?, ?, ?)", [arrnavn, beskrivelse, dato, sted], (error, result) => {
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

  //Henter informasjonen om kontaktpersonen
  hentArrangementKontakt(kontaktid, callback) {
    connection.query("SELECT * FROM Kontaktperson WHERE Kontakt_id = ?", [kontaktid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  //Redigerer arrangementet og her trengs ikke alt
  redigerArrangement(id, arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, vaktpoeng, callback) {
    //Hvis sluttid er tom
    if (erTom(sluttid)) {

      if (erTom(utstyr)) {

        if (erTom(vaktpoeng)) {
          //Hvis sluttid, utstyr og vaktpoeng er tomme
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, id], (error, result) => {
            if (error) throw error;

            callback();
          });
        } else {
          //Hvis sluttid og utstyr er tom
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, vaktpoeng, id], (error, result) => {
            if (error) throw error;

            callback();
          });
        }
      }

      else if (erTom(vaktpoeng)) {
        //Hvis sluttid og vaktpoeng er tom
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, utstyrsliste = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, utstyr, id], (error, result) => {
          if (error) throw error;

          callback();
        });
      } else {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, utstyrsliste = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, utstyr, vaktpoeng, id], (error, result) => {
          if (error) throw error;

          callback();
        });
      }
    }
    //Hvis utstyr er tom
    else if (erTom(utstyr)) {
      //Hvis utstyr og vaktpoeng er tom
      if (erTom(vaktpoeng)) {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, id], (error, result) => {
          if (error) throw error;

          callback();
        });
      } else {
        connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, vaktpoeng, id], (error, result) => {
          if (error) throw error;

          callback();
        });
      }
    }
    //Hvis vaktpoeng er tom
    else if(erTom(vaktpoeng)) {
      connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, utstyrsliste = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, id], (error, result) => {
        if (error) throw error;

        callback();
      });
    }
    //Hvis ingen er tomme
    else {
      connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, tidslutt = ?, utstyrsliste = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, vaktpoeng, id], (error, result) => {
        if (error) throw error;

        callback();
      });
    }
  }

  //Jeg lurer på hva denne gjør
  slettArrangement(id, callback) {
    connection.query("DELETE FROM Arrangement WHERE arrid = ?", [id], (error, result) => {
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

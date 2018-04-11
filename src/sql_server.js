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
  loggInnBruker(epost, passord, callback) {
    connection.query("SELECT * FROM Medlem WHERE Epost = ? AND Passord = ?", [epost, passord], (error, result) => {
      if (error) throw error;

      sessionStorage.setItem("innloggetBruker", JSON.stringify(result[0]));

      callback(result[0]);
    });
  }

  hentBruker() {
    let ting = sessionStorage.getItem("innloggetBruker");

    if (!ting) return null;
    return JSON.parse(ting);
  }

  hentOppdatertBruker(medlemsnr) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [medlemsnr], (error, result) => {
      if (error) throw error;

      sessionStorage.setItem("innloggetBruker", JSON.stringify(result[0]));
    });

    let ting = sessionStorage.getItem("innloggetBruker");

    if (!ting) return null;
    return JSON.parse(ting);
  }

  loggUtBruker() {
    sessionStorage.clear();
  }

  hentBrukerPassord(fornavn, etternavn, epost, callback) {
    connection.query("SELECT Passord FROM Medlem WHERE Fornavn = ? AND Etternavn = ? AND Epost = ?", [fornavn, etternavn, epost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentBrukerSted(medlemsnr, callback) {
    connection.query("SELECT Sted.* FROM Sted, Medlem WHERE Medlem.Postnr = Sted.Postnr AND Medlem.Medlemsnr = ?", [medlemsnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentPoststed(postnr, callback) {
    connection.query("SELECT Poststed FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  registrerBruker(fnavn, enavn, tlf, adresse, postnr, epost, passord, callback) {
    connection.query("INSERT INTO Medlem (Fornavn, Etternavn, Telefon, Adresse, Postnr, Epost, Passord) VALUES (?, ?, ?, ?, ?, ?, ?)", [fnavn, enavn, tlf, adresse, postnr, epost, passord], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

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

  oppdaterBruker(id, fnavn, enavn, tlf, adresse, postnr, callback) {
    connection.query("UPDATE Medlem SET Fornavn = ?, Etternavn = ?, Telefon = ?, Adresse = ?, Postnr = ? WHERE Medlemsnr = ?", [fnavn, enavn, tlf, adresse, postnr, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  sokBruker(inn, callback) {
    connection.query("SELECT * FROM Medlem WHERE Fornavn LIKE ? OR Etternavn LIKE ? ORDER BY Fornavn ASC", [inn + "%", inn + "%"], (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }

  hentSokBruker(id, callback) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  aktiverBruker(id, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [1, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  deaktiverBruker(id, callback) {
    connection.query("UPDATE Medlem SET Aktivert = ? WHERE Medlemsnr = ?", [2, id], (error, result) => {
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
  hentArrangementer(callback) {
    connection.query("SELECT * FROM Arrangement", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  hentArrangement(id, callback) {
    connection.query("SELECT * FROM Arrangement WHERE arrid = ?", [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentArrangementPoststed(postnr, callback) {
    connection.query("SELECT Poststed FROM Sted WHERE Postnr = ?", [postnr], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  opprettArrangement(arrnavn, beskrivelse, dato, sted, callback) {
    connection.query("INSERT INTO Arrangement (arrnavn, beskrivelse, startdato, oppmøtested) VALUES (?, ?, ?, ?)", [arrnavn, beskrivelse, dato, sted], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  opprettArrangementKontakt(fornavn, etternavn, tlf, epost, callback) {
    connection.query("INSERT INTO Kontaktperson (Fornavn, Etternavn, Telefon, Epost) VALUES (?, ?, ?, ?)", [fornavn, etternavn, tlf, epost], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  eksistererArrangementKontakt(tlf, epost, callback) {
    connection.query("SELECT 1 FROM Kontaktperson WHERE Telefon = ? OR Epost = ?", [tlf, epost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  velgArrangementKontakt(kontakttlf, kontaktepost, callback) {
    connection.query("SELECT Kontakt_id FROM Kontaktperson WHERE Telefon = ? OR Epost = ?", [kontakttlf, kontaktepost], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  oppdaterArrangementKontakt(kontaktid, arrnavn, arrdato, arrsted, callback) {
    connection.query("UPDATE Arrangement SET Kontakt_id = ? WHERE arrnavn = ? AND startdato = ? AND oppmøtested = ?", [kontaktid, arrnavn, arrdato, arrsted], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  hentArrangementKontakt(kontaktid, callback) {
    connection.query("SELECT * FROM Kontaktperson WHERE Kontakt_id = ?", [kontaktid], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  redigerArrangement(id, arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, sluttid, utstyr, vaktpoeng, callback) {
    //Hvis sluttid er tom
    if (erTom(sluttid)) {
      //Hvis sluttid og utstyr er tom
      if (erTom(utstyr)) {
        //Hvis sluttid, utstyr og vaktpoeng er tomme
        if (erTom(vaktpoeng)) {
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, id], (error, result) => {
            if (error) throw error;

            callback();
          });
        } else {
          connection.query("UPDATE Arrangement SET arrnavn = ?, beskrivelse = ?, startdato = ?, oppmøtetid = ?, oppmøtested = ?, postnr = ?, tidstart = ?, vaktpoeng = ? WHERE arrid = ?", [arrnavn, beskrivelse, dato, opptid, sted, postnr, starttid, vaktpoeng, id], (error, result) => {
            if (error) throw error;

            callback();
          });
        }
      }
      //Hvis sluttid og vaktpoeng er tom
      else if (erTom(vaktpoeng)) {
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

  slettArrangement(id, callback) {
    connection.query("DELETE FROM Arrangement WHERE arrid = ?", [id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
}

function erTom(str) {
  return (!str || 0 === str.length);
}

let bruker = new Bruker();
let arrangement = new Arrangement();

export {bruker, arrangement};

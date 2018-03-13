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
    connection.query("SELECT Medlemsnr FROM Medlem WHERE Epost = ? AND Passord = ?", [epost, passord], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  hentBruker(medlemsnr, callback) {
    connection.query("SELECT * FROM Medlem WHERE Medlemsnr = ?", [medlemsnr], (error, result) => {
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
}

let bruker = new Bruker();

export {bruker};

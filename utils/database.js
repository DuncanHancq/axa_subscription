const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../main.db'));

const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creation_date TEXT,
      numero_opportunite TEXT,
      reference_dossier TEXT,
      siren TEXT,
      affaire TEXT,
      nom_client TEXT,
      intermediaire TEXT,
      description TEXT,
      presence_coassurance TEXT,
      adresse_operation TEXT,
      descriptif_detaille TEXT,
      montant1 REAL,
      montant2 REAL,
      montant3 REAL,
      pdf_file BLOB,
      doc_file BLOB
    )`);
  });
};

const getAllSubscriptions = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM subscriptions", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const addSubscription = (subscription) => {
  return new Promise((resolve, reject) => {
    const {
      numero_opportunite,
      reference_dossier,
      siren,
      affaire,
      nom_client,
      intermediaire,
      description,
      presence_coassurance,
      adresse_operation,
      descriptif_detaille,
      montant1,
      montant2,
      montant3,
      pdf_file,
      doc_file
    } = subscription;

    const creation_date = new Date().toISOString();

    const query = `INSERT INTO subscriptions (
      creation_date,
      numero_opportunite,
      reference_dossier,
      siren,
      affaire,
      nom_client,
      intermediaire,
      description,
      presence_coassurance,
      adresse_operation,
      descriptif_detaille,
      montant1,
      montant2,
      montant3,
      pdf_file,
      doc_file
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
      creation_date,
      numero_opportunite,
      reference_dossier,
      siren,
      affaire,
      nom_client,
      intermediaire,
      description,
      presence_coassurance,
      adresse_operation,
      descriptif_detaille,
      montant1,
      montant2,
      montant3,
      pdf_file,
      doc_file
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const getDocx = (numero_opportunite) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT doc_file,creation_date,numero_opportunite FROM subscriptions WHERE numero_opportunite = ?`;
    db.get(query, [numero_opportunite], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getPDF = (numero_opportunite) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT pdf_file,creation_date,numero_opportunite FROM subscriptions WHERE numero_opportunite = ?`;
    db.get(query, [numero_opportunite], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = {
  initializeDatabase,
  getAllSubscriptions,
  addSubscription,
  getDocx,
  getPDF
};

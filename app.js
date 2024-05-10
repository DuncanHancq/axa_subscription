const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { engine } = require('express-handlebars');
const db = require('./utils/database');
const { createDocx, createPDF, generateFilename } = require('./utils/filegenerator');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

db.initializeDatabase();

app.get('/', (req, res) => {
  res.render('home', { title: 'Souscriptions' });
});

app.get('/ajouter', (req, res) => {
  res.render('addsubscription', { title: 'Ajouter une Souscription' });
});

app.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await db.getAllSubscriptions();
    res.json(subscriptions);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la récupération des données" });
  }
});

app.get('/telechargement/docx/:numero_opportunite', async (req, res) => {
  try {
    const numero_opportunite = req.params.numero_opportunite;
    const subscription = await db.getDocx(numero_opportunite);

    if (!subscription || !subscription.doc_file) {
      return res.status(404).send('Document non trouvé.');
    }

    const filename = generateFilename(subscription.numero_opportunite, subscription.creation_date, 'docx');
    
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(subscription.doc_file);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du téléchargement du document");
  }
});

app.get('/telechargement/pdf/:numero_opportunite', async (req, res) => {
  try {
    const numero_opportunite = req.params.numero_opportunite;
    const subscription = await db.getPDF(numero_opportunite);

    if (!subscription || !subscription.pdf_file) {
      return res.status(404).send('Document non trouvé.');
    }

    const filename = generateFilename(subscription.numero_opportunite, subscription.creation_date, 'pdf');
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(subscription.pdf_file);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du téléchargement du document");
  }
});

app.post('/ajouter', async (req, res) => {
  try {
    const subscription = req.body;

    subscription.pdf_file = createPDF();
    subscription.doc_file = createDocx();

    const result = await db.addSubscription(subscription);
    res.send(`Données ajoutées avec succès, ID: ${result}`);

  } catch (err) {
    console.error(err);
    res.status(400).send("Erreur lors de l'ajout des données");
  }
});

app.listen(PORT, () => {
  console.log(`Serveur à l'écoute sur http://localhost:${PORT}`);
});
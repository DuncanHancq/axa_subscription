const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');

function createPDF() {
  
  const STATIC_FILES_PATH = path.join(__dirname, '../temp');
  const pdfTemplatePath = path.join(STATIC_FILES_PATH, 'vide.pdf');

  return fs.readFileSync(pdfTemplatePath);

}

function createDocx() {

  const STATIC_FILES_PATH = path.join(__dirname, '../temp');
  const pdfTemplatePath = path.join(STATIC_FILES_PATH, 'vide.docx');

  return fs.readFileSync(pdfTemplatePath);

}

function generateFilename(numero_opportunite, creation_date, extension) {
  const creationDate = new Date(creation_date);

  const year = creationDate.getFullYear();
  const month = (creationDate.getMonth() + 1).toString().padStart(2, '0');
  const day = creationDate.getDate().toString().padStart(2, '0');
  const hours = creationDate.getHours().toString().padStart(2, '0');
  const minutes = creationDate.getMinutes().toString().padStart(2, '0');
  const seconds = creationDate.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}:${hours}-${minutes}-${seconds}`;

  return `Projet de contrat_${numero_opportunite}_${formattedDate}.${extension}`;
}

module.exports = {
  createPDF,
  createDocx,
  generateFilename
};
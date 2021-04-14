import PDFDocument from '../../../utils/pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { getTimestamp } from '../../../utils/format';
import html2canvas from 'html2canvas';

/* eslint-disable camelcase */

// Base PDF options
const pdfDocumentOptions = {
  size: 'A4',
  layout: 'landscape',
  margin: 40,
  bufferPages: true
};

// General layout options
const options = {
  ...pdfDocumentOptions,
  baseFontColor: '#374863',
  secondaryFontColor: '#6d788f',
  primaryColor: '#23A6F5',
  headerHeight: 96,
  colWidthTwoCol: 252,
  gutterTwoCol: 28,
  colWidthThreeCol: 160,
  gutterThreeCol: 26,
  tables: {
    rowSpacing: 3, // between text and bottom line
    padding: 20
  }
};

export default async function exportCountryMap({ selectedArea }) {
  // Create a document
  const doc = new PDFDocument(pdfDocumentOptions);

  // Create stream
  const stream = doc.pipe(blobStream());

  const mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
  const mapImage = mapCanvas.toDataURL('image/png');
  const mapAspectRatio = mapCanvas.height / mapCanvas.width;
  const mapWidth = options.colWidthThreeCol * 2 + options.gutterThreeCol;
  const mapHeight = mapAspectRatio > 1 ? mapWidth : mapWidth * mapAspectRatio;
  doc.image(mapImage, options.margin, options.headerHeight, {
    fit: [doc.page.width, mapHeight]
  });

  const legendCanvas = await html2canvas(document.querySelector('#map-legend'));
  const legendImage = legendCanvas.toDataURL('image/png');
  doc.image(legendImage, options.margin, options.headerHeight);

  // Finalize PDF file
  doc.end();

  return await stream.on('finish', function () {
    saveAs(
      stream.toBlob('application/pdf'),
      `WBG-REZoning-${selectedArea.id}-summary-${getTimestamp()}.pdf`
    );
  });
}

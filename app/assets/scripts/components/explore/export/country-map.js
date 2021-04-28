import PDFDocument from '../../../utils/pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { getTimestamp } from '../../../utils/format';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage
} from '../../common/global-loading'
import html2canvas from 'html2canvas';

/* eslint-disable camelcase */

// Timeout for map to load
const MIN_TIMEOUT = 5000;

// Base PDF options
const pdfDocumentOptions = {
  size: 'LETTER',
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
  headerHeight: 0,
  colWidthTwoCol: 252,
  gutterTwoCol: 28,
  colWidthThreeCol: 160,
  gutterThreeCol: 26,
  tables: {
    rowSpacing: 3, // between text and bottom line
    padding: 20
  }
};

export default async function exportCountryMap(selectedArea, map, setMap) {
  // Zoom to country bounds
  showGlobalLoadingMessage('Generating PDF Export...');
  return map.fitBounds(selectedArea.bounds, { padding: 20 }).once('moveend', async () => {
    setMap(map);

    // Give unloaded layers time to load
    await new Promise(resolve => setTimeout(resolve, MIN_TIMEOUT));

    // Create a document
    const doc = new PDFDocument(pdfDocumentOptions);

    // Create stream
    const stream = doc.pipe(blobStream());

    // Left Title
    doc
      .fillColor(options.baseFontColor)
      // .font(boldFont)
      .fontSize(20)
      .text(selectedArea.name, options.margin, (options.margin / 2));

    const mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
    const mapImage = mapCanvas.toDataURL('image/png');
    const mapAspectRatio = mapCanvas.height / mapCanvas.width;
    const mapWidth = options.colWidthThreeCol * 2 + options.gutterThreeCol;
    const mapHeight = mapAspectRatio > 1 ? mapWidth : mapWidth * mapAspectRatio;
    doc.image(mapImage, options.margin, options.margin, {
      fit: [doc.page.width, doc.page.height - (options.margin * 2)]
    });

    // Add legend
    const legendNode = document.querySelector('#map-legend');
    legendNode.style.backgroundColor = '#FFFFFF';
    const legendCanvas = await html2canvas(legendNode);
    const legendImage = legendCanvas.toDataURL('image/png');
    doc.image(legendImage, (doc.page.width - options.margin - 140), (doc.page.height - options.margin - 68), { width: 140 });

    // Add Scale
    const scaleCanvas = await html2canvas(document.querySelector('.mapboxgl-ctrl-scale'));
    const scaleImage = scaleCanvas.toDataURL('image/png');
    doc.image(scaleImage, options.margin + 20, (doc.page.height - options.margin - 20), { width: 100 });

    // Finalize PDF file
    doc.end();

    hideGlobalLoading();

    return await stream.on('finish', function () {
      saveAs(
        stream.toBlob('application/pdf'),
        `WBG-REZoning-${selectedArea.id}-summary-${getTimestamp()}.pdf`
      );
    });
  });
}

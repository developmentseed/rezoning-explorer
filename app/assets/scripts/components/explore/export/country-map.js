import PDFDocument from '../../../utils/pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { getTimestamp } from '../../../utils/format';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage
} from '../../common/global-loading';
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

// fetch fonts & images on init for use in PDF
let baseFont, boldFont, REZLogo, WBGLogo, ESMAPLogo;
async function initStyles () {
  await fetch('/assets/fonts/IBM-Plex-Sans-regular.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      baseFont = font;
    });

  await fetch('/assets/fonts/IBM-Plex-Sans-Semibold.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      boldFont = font;
    });
  await fetch('/assets/graphics/content/logos/logo-rezoning.png')
    .then((response) => response.arrayBuffer())
    .then((logo) => {
      REZLogo = logo;
    });
  await fetch('/assets/graphics/content/logos/logo-wbg.png')
    .then((response) => response.arrayBuffer())
    .then((logo) => {
      WBGLogo = logo;
    });
  await fetch('/assets/graphics/content/logos/logo-esmap.png')
    .then((response) => response.arrayBuffer())
    .then((logo) => {
      ESMAPLogo = logo;
    });
}

function drawHeader (doc, selectedArea) {
  // Title
  doc
    .fillColor(options.baseFontColor)
    .font(boldFont)
    .fontSize(20)
    .text(selectedArea.name, options.margin, (options.margin / 2) - 6);

  // Subtitle
  doc
    .fillColor(options.secondaryFontColor)
    .font(baseFont)
    .fontSize(8)
    .text('RENEWABLE ENERGY ZONE ANALYSIS', options.margin, (options.margin / 2) + 18);

  // Logos
  doc.image(
    REZLogo,
    (doc.page.width - (options.margin * 8)),
    (options.margin / 2),
    {
      height: 18
    }
  );
  doc
    .fillColor(options.primaryColor)
    .font(boldFont)
    .fontSize(10)
    .text(
      'REZoning',
      (doc.page.width - (options.margin * 8)) + 20,
      (options.margin / 2) + 2,
      {
        align: 'left',
        link: 'https://rezoning.surge.sh'
      }
    );
  doc.image(
    WBGLogo,
    (doc.page.width - (options.margin * 6)) + 10,
    (options.margin / 2),
    {
      height: 18
    }
  );
  doc.image(
    ESMAPLogo,
    (doc.page.width - (options.margin * 3)) + 6,
    (options.margin / 2),
    {
      height: 18
    }
  );
}

async function drawMap(doc) {
  // Add Map to clipped rectangle
  const mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
  const mapImage = mapCanvas.toDataURL('image/png');
  const overflow = false;

  const mapContainer = {
    cover: [doc.page.width - (options.margin * 2), doc.page.height - (options.margin * 2) - 20],
    align: 'center',
    valign: 'center'
  };

  if (!overflow && mapContainer.cover) {
    doc.save();
    doc.rect(options.margin, options.margin + 20, mapContainer.cover[0], mapContainer.cover[1]).clip();
  }

  doc.image(mapImage, options.margin, options.margin + 20, mapContainer);

  if (!overflow && mapContainer.cover) doc.restore();
}

function drawFooter(doc) {
  // Left attribution
  doc
    .fillColor(options.baseFontColor)
    .font(baseFont)
    .fontSize(6)
    .text(
      'This map is publshed by the World Bank Group, funded by ESMAP, and was dynamically generated from the REZoning application. For more information, please visit https://rezoning.surge.sh',
      options.margin,
      doc.page.height - (options.margin / 2),
      {
        height: 16,
        align: 'left',
        link: 'https://rezoning.surge.sh'
      }
    );

  // Right license
  doc
    .fillColor(options.baseFontColor)
    .text(
      'Creative Commons BY 4.0',
      doc.page.width - options.colWidthTwoCol - options.margin,
      doc.page.height - (options.margin / 2),
      {
        width: options.colWidthTwoCol,
        height: 16,
        align: 'right',
        link: 'https://creativecommons.org/licenses/by/4.0/'
      }
    );

  // Right date
  doc.text(
    `©${new Date().getFullYear()}`,
    doc.page.width - options.colWidthTwoCol - options.margin,
    doc.page.height - (options.margin / 2 + 8),
    {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'right'
    }
  );
}

export default async function exportCountryMap(selectedArea, map, setMap) {
  // Zoom to country bounds
  showGlobalLoadingMessage('Generating Map Export...');
  return map.fitBounds(selectedArea.bounds, { padding: 80 }).once('moveend', async () => {
    setMap(map);

    // Give unloaded layers time to load
    await new Promise(resolve => setTimeout(resolve, MIN_TIMEOUT));

    // Load styles
    await initStyles();

    // Create a document
    const doc = new PDFDocument(pdfDocumentOptions);

    // Create stream
    const stream = doc.pipe(blobStream());

    // Add Sections
    drawHeader(doc, selectedArea);
    drawMap(doc);
    drawFooter(doc);

    // Add legend
    const legendNode = document.querySelector('#map-legend');
    const legendCanvas = await html2canvas(legendNode);
    const legendImage = legendCanvas.toDataURL('image/png');
    const legendHeight = parseInt(legendCanvas.style.height, 10) * 0.75;
    const legendWidth = parseInt(legendCanvas.style.width, 10) * 0.75;
    doc.image(legendImage, (doc.page.width - options.margin - legendWidth + 10), (doc.page.height - options.margin - legendHeight + 10), { width: legendWidth - 20 });

    // Add Scale
    const scaleCanvas = await html2canvas(document.querySelector('.mapboxgl-ctrl-scale'));
    const scaleImage = scaleCanvas.toDataURL('image/png');
    doc.image(scaleImage, options.margin + 10, (doc.page.height - options.margin - 20), { width: 100 });

    // Finalize PDF file
    doc.end();

    hideGlobalLoading();

    return await stream.on('finish', function () {
      saveAs(
        stream.toBlob('application/pdf'),
        `WBG-REZoning-${selectedArea.id}-map-${getTimestamp()}.pdf`
      );
    });
  });
}

import PDFDocument from '../../../utils/pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { zonesSummary } from '../explore-stats';
import config from '../../../config';
import get from 'lodash.get';
import groupBy from 'lodash.groupby';
import { formatThousands, toTitleCase, getTimestamp } from '../../../utils/format';
import { formatIndicator } from '../focus-zone';

/* eslint-disable camelcase */

// Base PDF options
const pdfDocumentOptions = {
  size: 'A4',
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

// fetch fonts & images on init for use in PDF
let styles, baseFont, boldFont, Logo, WBGLogo, ESMAPLogo;
async function initStyles () {
  await fetch('/assets/fonts/IBM-Plex-Sans-Regular.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      baseFont = font;
    });

  await fetch('/assets/fonts/IBM-Plex-Sans-Semibold.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      boldFont = font;
    });
  await fetch('/assets/graphics/meta/android-chrome.png')
    .then((response) => response.arrayBuffer())
    .then((logo) => {
      Logo = logo;
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

  styles = {
    h1: {
      fontSize: 20,
      padding: 20,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h2: {
      fontSize: 16,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h3: {
      fontSize: 14,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h4: {
      fontSize: 12,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h5: {
      fontSize: 11,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h6: {
      fontSize: 10,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    p: {
      fontSize: 8,
      padding: 10,
      fillColor: options.baseFontColor,
      font: baseFont
    }
  };
}

/**
 * Apply defined styles to the current documento location
 * @param {Object} doc The document object.
 * @param {String} element Element type key, must be available in `styles` object.
 */
function setStyle (doc, element) {
  const { fillColor, font, fontSize } = styles[element];
  doc.fillColor(fillColor).font(font).fontSize(fontSize);
}

/**
 * Add text to the document.
 * @param {Object} doc The document object.
 * @param {String} element Element type key, must be available in `styles` object.
 * @param {String} text The text to be added.
 * @param {String} options PDFkit options (optional).
 */
function addText (doc, element, text, options) {
  setStyle(doc, element);
  doc.text(text, options);

  // Apply padding after adding the text
  doc.y += get(styles, [element, 'padding'], 0);
}

function drawSectionHeader (label, left, top, doc, options) {
  doc.fontSize(12);
  doc.fillColor(options.baseFontColor, 1).font(boldFont).text(label, left, top);

  doc.rect(left, top + 18, 28, 2).fill(options.primaryColor);

  doc.fontSize(8); // reset font size after drawing section header
  doc.fillColor(options.baseFontColor, 1); // reset color after drawing section header
  doc.font(baseFont); // reset font after drawing section header
}

/**
 * Draw Header
 */
function drawHeader (doc, { selectedArea }) {
  const leftTitleSize = 20;
  const rightTitleSize = 12;
  const subTitleSize = 8;
  const padding = 15;

  // Left Title
  doc
    .fillColor(options.baseFontColor)
    .font(boldFont)
    .fontSize(leftTitleSize)
    .text(selectedArea.name, options.margin, options.margin);

  // Left Subtitle
  doc
    .fillColor(options.secondaryFontColor)
    .font(baseFont)
    .fontSize(subTitleSize)
    .text(toTitleCase(selectedArea.type), options.margin, options.margin + 24);

  // Right Title
  doc
    .fillColor(options.baseFontColor)
    .font(boldFont)
    .fontSize(rightTitleSize)
    .text(
      config.appTitle,
      doc.page.width - options.colWidthTwoCol - options.margin,
      options.margin,
      {
        width: options.colWidthTwoCol,
        align: 'right'
      }
    );

  // Right Subtitle
  doc
    .fillColor(options.secondaryFontColor)
    .font(baseFont)
    .fontSize(subTitleSize)
    .text(
      config.appDescription,
      doc.page.width - options.colWidthTwoCol - options.margin,
      options.margin + 16,
      {
        width: options.colWidthTwoCol,
        height: 16,
        align: 'right'
      }
    );

  // Move cursor down
  doc.y = options.margin + leftTitleSize + subTitleSize + padding;
  doc.x = options.margin;
}

/**
 * Draw Footer
 */
function drawFooter (doc) {
  doc
    .rect(0, doc.page.height - options.margin * 2, doc.page.width, 1)
    .fillColor('#1F2A50', 0.12)
    .fill();

  doc.fontSize(8).fillOpacity(1);

  // // Footer
  doc.image(Logo, options.margin, doc.page.height - options.margin * 1.25, {
    height: 18
  });
  doc.image(
    WBGLogo,
    options.margin * 2 + 8,
    doc.page.height - options.margin * 1.25,
    {
      height: 18
    }
  );
  doc.image(
    ESMAPLogo,
    120 + options.margin * 2,
    doc.page.height - options.margin * 1.25,
    {
      height: 18
    }
  );

  // Left Title
  doc
    .fillColor(options.primaryColor)
    .font(boldFont)
    .text('REZoning', options.margin, doc.page.height - options.margin * 1, {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'left',
      link: config.baseUrl
    });

  // Right license
  doc
    .fillColor(options.baseFontColor)
    .text(
      'Creative Commons BY 4.0',
      doc.page.width - options.colWidthTwoCol - options.margin,
      doc.page.height - options.margin * 1.25,
      {
        width: options.colWidthTwoCol,
        height: 16,
        align: 'right',
        link: 'https://creativecommons.org/licenses/by/4.0/'
      }
    );

  // Right date
  doc.text(
    new Date().getFullYear(),
    doc.page.width - options.colWidthTwoCol - options.margin,
    doc.page.height - options.margin * 1.25 + 12,
    {
      width: options.colWidthTwoCol,
      height: 16,
      align: 'right'
    }
  );
}

/**
 * Draw Map & Area Summary
 */
function drawMapArea (
  doc,
  { selectedResource, zones, map: { mapDataURL, mapAspectRatio } }
) {
  // Limit map height to a column width. This results in a square aspect ratio of the map
  const mapWidth = options.colWidthThreeCol * 2 + options.gutterThreeCol;
  const mapHeight = mapAspectRatio > 1 ? mapWidth : mapWidth * mapAspectRatio;
  // // MAP AREA
  // Map area has a three column layout

  // Background color on the full map area
  doc.rect(0, options.headerHeight, doc.page.width, mapHeight).fill('#f6f7f7');

  // Map (2/3)
  doc.image(mapDataURL, options.margin, options.headerHeight, {
    fit: [doc.page.width, mapHeight]
  });

  // Map area outline
  doc
    .rect(0, options.headerHeight, doc.page.width, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc
    .rect(0, options.headerHeight + mapHeight - 1, doc.page.width, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Legend (1/3)
  const legendLeft = doc.page.width - options.margin - options.colWidthThreeCol;

  // Area header
  drawSectionHeader(
    'Area Summary',
    legendLeft,
    options.headerHeight + 20,
    doc,
    options
  );

  /**
   * Area Summary table
   */
  const stats = zonesSummary(zones);
  const summaryTable = {
    columnAlignment: ['left', 'right'],
    cells: stats.map((line) => {
      let label = line.label;
      if (line.unit) {
        label = `${label} (${line.unit})`;
      }
      const value = line.data;
      return [label, value];
    })
  };
  summaryTable.cells.unshift(['Resource', selectedResource]);
  doc.table(summaryTable, legendLeft, doc.y + 12, { width: (options.colWidthThreeCol) });
  doc.y += get(options, 'tables.padding', 0);
}

/**
 * Draw Analysis Input
 */
function drawAnalysisInput (doc, data) {
  // Add filters section (ranges must be available)
  doc.addPage();
  // Filters header
  drawSectionHeader(
    'Filters',
    doc.x,
    doc.y,
    doc,
    options
  );

  const { filtersValues } = data;

  // Add one table per category
  const categories = groupBy(filtersValues, 'category');
  Object.keys(categories).forEach((category, index) => {
    const currentY = doc.y;
    doc.y += get(options, 'tables.padding', 0);

    setStyle(doc, 'p');
    const filterTable = {
      columnAlignment: ['left', 'right'],
      header: [toTitleCase(category), ''],
      cells: categories[category].map((filter) => {
        let title = filter.title;
        if (filter.unit) {
          title = `${title} (${filter.unit})`;
        }

        let value = filter.input.value;
        if (filter.isRange) {
          value = `${formatThousands(value.min)} to ${formatThousands(
            value.max
          )}`;
        } else if (filter.options) {
          value = 'Unavailable';
        }
        return [title, value];
      })
    };
    doc.table(filterTable, (options.margin + ((index % 2) * options.colWidthTwoCol) + ((index % 2) * options.gutterTwoCol)), doc.y + ((index & 2) * 80), { prepareHeader: () => doc.font(boldFont).fontSize(10), prepareRow: () => doc.fontSize(8).font(baseFont), width: options.colWidthTwoCol });
    if (index % 2 === 0) {
      doc.y = currentY;
    }
  });

  // Add weights section
  doc.addPage();
  drawSectionHeader(
    'Weights',
    doc.x,
    doc.y,
    doc,
    options
  );
  doc.y += options.tables.padding;
  addText(
    doc,
    'p',
    'Laboris aliqua duis incididunt occaecat elit occaecat sunt deserunt est commodo deserunt tempor anim nostrud. Sit sint mollit incididunt in nisi adipisicing excepteur quis veniam occaecat irure. Quis cupidatat aliqua irure aliqua deserunt minim anim laboris nulla enim proident magna amet.'
  );

  doc.table({
    columnAlignment: ['left', 'right'],
    cells: Object.keys(data.weightsValues).map((weightId) => {
      const weight = data.weightsValues[weightId];
      return [weight.title, weight.input.value];
    })
  }, { width: options.colWidthThreeCol * 2 });

  // Add LCOE section
  doc.addPage();
  drawSectionHeader(
    'Economics',
    doc.x,
    doc.y,
    doc,
    options
  );
  doc.y += options.tables.padding;
  addText(
    doc,
    'p',
    'Officia nostrud occaecat ipsum do proident duis. Veniam veniam sint reprehenderit ad sint officia aliquip voluptate enim et enim velit ea. Reprehenderit elit in quis et consequat irure sint laboris nisi cupidatat. Incididunt ea do quis sint qui commodo incididunt cillum ex et reprehenderit aute consequat. Lorem nulla exercitation proident cillum aute nulla. Anim do aute do quis consectetur fugiat minim minim anim anim consectetur nulla non.'
  );

  doc.table({
    columnAlignment: ['left', 'right'],
    cells: Object.keys(data.lcoeValues).map((lcoeId) => {
      const lcoe = data.lcoeValues[lcoeId];
      return [lcoe.title, lcoe.input.value];
    })
  }, { width: options.colWidthThreeCol * 2 });
}

/**
 * Add zones list to the document.
 * @param {Object} doc The documento object.
 * @param {Array} zones Array of zones to be included
 */
function drawZonesList (doc, zones) {
  doc.addPage();

  // Title
  drawSectionHeader(
    'Zones',
    doc.x,
    doc.y,
    doc,
    options
  );
  doc.y += options.tables.padding;
  // Set style to be used in the table
  setStyle(doc, 'p');

  // Prepare table data
  const zonesTable = {
    header: [
      'ID',
      'Score',
      'LCOE (USD/MWh)',
      'Output (GWh)',
      'Output Density (MWh/km²)'
    ],
    columnAlignment: ['left', 'right', 'right', 'right', 'right'],
    cells: zones.map(
      ({
        id,
        properties: {
          name,
          summary: { lcoe, zone_score, zone_output, zone_output_density }
        }
      }) => {
        return [
          name || id,
          formatIndicator('zone_score', zone_score),
          formatIndicator('lcoe', lcoe),
          formatIndicator('zone_output', zone_output),
          formatIndicator('zone_output_density', zone_output_density)
        ];
      }
    )
  };
  if (zones[0].properties.name) {
    zonesTable.header.shift();
    zonesTable.header.unshift('Name');
  }
  doc.table(zonesTable, { prepareHeader: () => doc.font(boldFont), prepareRow: (row, i) => doc.font(baseFont) });
}

export default async function exportPDF (data) {
  // Load styles
  await initStyles();

  // Create a document
  const doc = new PDFDocument(pdfDocumentOptions);

  // Create stream
  const stream = doc.pipe(blobStream());

  // Add sections
  drawHeader(doc, data);
  drawMapArea(doc, data);
  drawAnalysisInput(doc, data);
  drawZonesList(doc, data.zones);

  // Add footer to each page
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    drawFooter(doc);
  }

  // Finalize PDF file
  doc.end();

  return await stream.on('finish', function () {
    saveAs(
      stream.toBlob('application/pdf'),
      `WBG-REZoning-${data.selectedArea.id}-summary-${getTimestamp()}.pdf`
    );
  });
}

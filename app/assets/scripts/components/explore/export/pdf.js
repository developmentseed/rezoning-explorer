import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { zonesSummary } from '../explore-stats';
import config from '../../../config';
import get from 'lodash.get';
import groupBy from 'lodash.groupby';
import { toTitleCase } from '../../../utils/utils';
import { formatThousands } from '../../../utils/format.js';

// Helper function to generate a formatted timestamp
const timestamp = () => format(Date.now(), 'yyyyMMdd-hhmmss');

// Base PDF options
const pdfDocumentOptions = {
  size: 'A4',
  margin: 40,
  bufferPages: true
};

// General layout options
const options = {
  ...pdfDocumentOptions,
  baseFontColor: '#3a455c',
  secondaryFontColor: '#6d788f',
  primaryColor: '#5860ff',
  colWidthTwoCol: 252,
  gutterThreeCol: 26,
  tables: {
    rowSpacing: 3, // between text and bottom line
    padding: 20
  }
};

// fetch fonts & images on init for use in PDF
let styles, baseFont, boldFont;
async function initStyles () {
  await fetch('/assets/fonts/Rubik-Light.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      baseFont = font;
    });

  await fetch('/assets/fonts/Rubik-Medium.ttf')
    .then((response) => response.arrayBuffer())
    .then((font) => {
      boldFont = font;
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
      fontSize: 10,
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

/**
 * Add a 2-cell table row to the document.
 * @param {Object} doc The document object.
 * @param {String} leftText Text to add in left cell.
 * @param {String} rightText Text to add in right cell.
 */
function addTableRow (doc, leftText, rightText) {
  const startX = doc.page.margins.left;
  const startY = doc.y;
  const usableWidth = doc.page.width - options.margin;
  const rowHeight = styles.p.fontSize + options.tables.rowSpacing;

  addText(doc, 'p', leftText, { align: 'left' });
  doc.y = startY;
  addText(doc, 'p', rightText, { align: 'right' });

  doc
    .moveTo(startX, startY + rowHeight)
    .lineTo(usableWidth, startY + rowHeight)
    .lineWidth(2)
    .opacity(0.08)
    .stroke()
    .opacity(1);
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
 * Draw Area Summary
 */
function drawAreaSummary (doc, { selectedResource, zones }) {
  const stats = zonesSummary(zones);

  // Title
  addText(doc, 'h2', 'Area summary');

  // Description
  addText(
    doc,
    'p',
    'Ut ut commodo consequat anim labore duis amet in id laborum. Ex amet voluptate deserunt sunt consequat consectetur dolor et tempor nisi cillum. Sint quis officia Lorem ea ad duis elit anim adipisicing. Voluptate cupidatat veniam sint officia aliqua incididunt minim pariatur tempor officia velit.'
  );

  addTableRow(doc, 'Resource', selectedResource);

  /**
   * Summary table
   */

  stats.forEach((line) => {
    let title = line.label;
    if (line.unit) {
      title = `${title} (${line.unit})`;
    }

    addTableRow(doc, title, line.data);
  });
  doc.y += get(options, 'tables.padding', 0);
}

/**
 * Draw Analysis Input
 */
function drawAnalysisInput (doc, data) {
  addText(doc, 'h2', 'Spatial Filters');

  const { filtersLists } = data;
  const filterRanges = data.filterRanges.getData();

  // Add filters (ranges must be available)
  const categories = groupBy(filtersLists, 'category');
  Object.keys(categories).forEach((category) => {
    addText(doc, 'h3', toTitleCase(category));

    categories[category].forEach((filter) => {
      let title = filter.title;
      if (filter.unit) {
        title = `${title} (${filter.unit})`;
      }

      let value;
      if (filter.isRange) {
        const range = filterRanges[filter.layer];
        value = range
          ? `${formatThousands(range.min)} to ${formatThousands(range.max)}`
          : 'To be added';
      } else {
        value = get(filter, 'input.value', 'To be added');
      }

      addTableRow(doc, title, value);
    });
    doc.y += get(options, 'tables.padding', 0);
  });
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
  drawAreaSummary(doc, data);
  drawAnalysisInput(doc, data);

  // Finalize PDF file
  doc.end();

  return await stream.on('finish', function () {
    saveAs(
      stream.toBlob('application/pdf'),
      `rezoning-summary-${timestamp()}.pdf`
    );
  });
}

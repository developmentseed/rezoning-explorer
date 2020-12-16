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
  margin: 50,
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
      fontSize: 25,
      padding: 20,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h2: {
      fontSize: 20,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h3: {
      fontSize: 16,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h4: {
      fontSize: 14,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h5: {
      fontSize: 12,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    h6: {
      fontSize: 11,
      padding: 10,
      fillColor: options.baseFontColor,
      font: boldFont
    },
    p: {
      fontSize: 15,
      padding: 15,
      fillColor: options.baseFontColor,
      font: baseFont
    }
  };
}

function setStyle (doc, element) {
  const { fillColor, font, fontSize } = styles[element];
  doc.fillColor(fillColor).font(font).fontSize(fontSize);
}

function addText (doc, element, text, options) {
  setStyle(doc, element);
  doc.text(text, options);

  // Apply padding after adding the text
  doc.y += get(styles, [element, 'padding'], 0);
}

/**
 * Draw Header
 */
function drawHeader (doc, { area }) {
  const leftTitleSize = 20;
  const rightTitleSize = 12;
  const subTitleSize = 8;
  const padding = 15;

  // Left Title
  doc
    .fillColor(options.baseFontColor)
    .font(boldFont)
    .fontSize(leftTitleSize)
    .text(area.name, options.margin, options.margin);

  // Left Subtitle
  doc
    .fillColor(options.secondaryFontColor)
    .font(baseFont)
    .fontSize(subTitleSize)
    .text(area.type, options.margin, options.margin + 24);

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
function drawAreaSummary (doc, { zones }) {
  const stats = zonesSummary(zones);

  // Title
  addText(doc, 'h1', 'Area summary');

  // Description
  addText(
    doc,
    'p',
    'Ut ut commodo consequat anim labore duis amet in id laborum. Ex amet voluptate deserunt sunt consequat consectetur dolor et tempor nisi cillum. Sint quis officia Lorem ea ad duis elit anim adipisicing. Voluptate cupidatat veniam sint officia aliqua incididunt minim pariatur tempor officia velit.'
  );

  /**
   * Summary table
   */
  const usableWidth = doc.page.width - options.margin;
  const startX = doc.page.margins.left;
  const rowHeight = styles.p.fontSize + options.tables.rowSpacing;

  stats.forEach((line) => {
    const startY = doc.y;

    let title = line.label;
    if (line.unit) {
      title = `${title} (${line.unit})`;
    }

    addText(doc, 'p', title, { align: 'left' });
    doc.y = startY;
    addText(doc, 'p', line.data, { align: 'right' });

    doc
      .moveTo(startX, startY + rowHeight)
      .lineTo(usableWidth, startY + rowHeight)
      .lineWidth(1)
      .opacity(0.7)
      .stroke()
      .opacity(1);
  });
  doc.y += get(options, 'tables.padding', 0);
}

/**
 * Draw Analysis Input
 */
function drawAnalysisInput (doc, data) {
  addText(doc, 'h1', 'Area summary');

  const { filtersLists } = data;
  const filterRanges = data.filterRanges.getData();

  const usableWidth = doc.page.width - options.margin;
  const startX = doc.page.margins.left;
  const rowHeight = styles.p.fontSize + options.tables.rowSpacing;

  // Add filters (ranges must be available)
  const categories = groupBy(filtersLists, 'category');
  Object.keys(categories).forEach((category) => {
    addText(doc, 'h2', toTitleCase(category));

    categories[category].forEach((filter) => {
      const startY = doc.y;

      let title = filter.title;
      if (filter.unit) {
        title = `${title} (${filter.unit})`;
      }

      let value;
      if (filter.isRange) {
        const range = filterRanges[filter.layer];
        value = range
          ? `${formatThousands(range.min)} - ${formatThousands(range.max)}`
          : 'To be added';
      } else {
        value = get(filter, 'input.value', 'To be added');
      }

      addText(doc, 'p', title, { align: 'left' });
      doc.y = startY;
      addText(doc, 'p', value, { align: 'right' });

      doc
        .moveTo(startX, startY + rowHeight)
        .lineTo(usableWidth, startY + rowHeight)
        .lineWidth(1)
        .opacity(0.7)
        .stroke()
        .opacity(1);
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

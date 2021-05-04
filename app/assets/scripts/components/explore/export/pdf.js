import PDFDocument from '../../../utils/pdfkit';
import blobStream from 'blob-stream';
import { saveAs } from 'file-saver';
import { zonesSummary } from '../explore-stats';
import get from 'lodash.get';
import groupBy from 'lodash.groupby';
import { formatThousands, toTitleCase, getTimestamp } from '../../../utils/format';
import difference from 'lodash.difference';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage
} from '../../common/global-loading';

/* eslint-disable camelcase */

// Timeout for map to load
const MIN_TIMEOUT = 5000;

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
let styles, baseFont, boldFont, Logo, WBGLogo, ESMAPLogo, LBLLogo;
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
  await fetch('/assets/graphics/content/logos/logo-lbl.jpeg')
    .then((response) => response.arrayBuffer())
    .then((logo) => {
      LBLLogo = logo;
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
      'REZoning - a World Bank Group project',
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
      'Identify project areas for solar, onshore wind and offshore wind development',
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
function drawFooter (doc, pageNumber) {
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
    options.margin * 3.25 + 12,
    doc.page.height - options.margin * 1.25,
    {
      height: 18
    }
  );
  doc.image(
    ESMAPLogo,
    options.margin * 3.25 + 120,
    doc.page.height - options.margin * 1.25,
    {
      height: 18
    }
  );
  doc.image(
    LBLLogo,
    options.margin * 3.25 + 210,
    doc.page.height - options.margin * 1.25,
    {
      height: 18
    }
  );

  // Left Title
  doc
    .fillColor(options.primaryColor)
    .font(boldFont)
    .text(
      'REZoning',
      options.margin * 1.5 + 4,
      doc.page.height - options.margin * 1.25,
      {
        width: options.colWidthTwoCol,
        height: 16,
        align: 'left',
        link: 'https://rezoning.surge.sh'
      }
    );

  // Left Subtitle
  doc
    .fillColor(options.secondaryFontColor)
    .font(baseFont)
    .fontSize(6)
    .text(
      'https://rezoning.surge.sh',
      options.margin * 1.5 + 4,
      doc.page.height - options.margin,
      {
        width: options.colWidthTwoCol,
        height: 16,
        align: 'left'
      }
    );

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

  // Right copyright date + Page Number
  doc.text(
    '©' + new Date().getFullYear() + ' The World Bank Group | Page ' + pageNumber,
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
  // Create page area for map
  const overflow = false;
  const mapWidth = doc.page.width - options.margin * 2;
  const mapHeight = (mapAspectRatio > 1 ? mapWidth : mapWidth * mapAspectRatio) - options.margin;
  const mapContainer = {
    cover: [mapWidth, mapHeight],
    align: 'center',
    valign: 'center'
  };

  // Background color on the full map area
  doc.rect(0, options.headerHeight, doc.page.width, mapHeight).fill('#f6f7f7');

  // Map covers container area - first create clipping path, then place image
  if (!overflow && mapContainer.cover) {
    doc.save();
    doc.rect(options.margin, options.headerHeight, mapContainer.cover[0], mapContainer.cover[1]).clip();
  }

  doc.image(mapDataURL, options.margin, options.headerHeight, mapContainer);

  if (!overflow && mapContainer.cover) doc.restore();

  // Map area outline
  doc
    .rect(0, options.headerHeight, doc.page.width, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  doc
    .rect(0, options.headerHeight + mapHeight - 1, doc.page.width, 1)
    .fillColor('#192F35', 0.08)
    .fill();

  // Legend (1/2)
  const legendRight = doc.page.width - options.margin - options.colWidthTwoCol;

  // Area header
  drawSectionHeader(
    'Area Summary',
    legendRight,
    mapHeight + (options.margin * 3),
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
  doc.table(summaryTable, legendRight, doc.y + 12, { width: (options.colWidthTwoCol) });
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
    'Spatial Filters',
    doc.x,
    doc.y,
    doc,
    options
  );
  doc.y += options.tables.padding;
  addText(
    doc,
    'p',
    'The information layers and the thresholds that were applied for estimating the Technical Potential of the energy resource and for identifying the study areas technically capable of supporting projects.'
  );

  const { filtersValues } = data;

  // Add one table per category
  const filterCategories = groupBy(filtersValues, 'secondary_category');
  Object.keys(filterCategories).forEach((category, index) => {
    let excludedLandcover;
    const currentY = doc.y;
    doc.y += get(options, 'tables.padding', 0);

    setStyle(doc, 'p');

    const filterTable = {
      columnAlignment: ['left', 'right'],
      header: [toTitleCase(category), ''],
      cells: filterCategories[category].map((filter) => {
        let title = filter.title;
        if (filter.unit) {
          title = `${title} (${filter.unit})`;
        }

        let value = filter.input.value;
        if (filter.isRange) {
          value = `${formatThousands(value.min)} to ${formatThousands(
            value.max
          )}`;
        } else if (filter.id === 'f_land_cover') {
          const availableLandcoverIndexes = filter.options.map((name, i) => i);
          const excludedLandcoverIndexes = difference(availableLandcoverIndexes, value);
          excludedLandcover = excludedLandcoverIndexes.map((i) => filter.options[i]);
          return;
        } else if (filter.options) {
          // Discard other categorical filters as they are not supported now
          return [title, 'Unavailable'];
        }
        return [title, value];
      }).filter((x) => x) // discard null values from categorical filters
    };

    // When 'f_land_cover' is part of category, include land cover types at the
    // end of the table
    if (excludedLandcover) {
      if (excludedLandcover.length > 0) {
        filterTable.cells.push([
          'Excluded land cover types',
          excludedLandcover.join(', ')
        ]);
      } else {
        filterTable.cells.push(['All land cover types are included', '-']);
      }
    }

    const tableX = (options.margin + ((index % 2) * options.colWidthTwoCol) + ((index % 2) * options.gutterTwoCol));
    const tableY = doc.y + ((index & 2) * 80);

    doc.table(
      filterTable,
      tableX,
      tableY,
      {
        prepareHeader: () => doc.font(boldFont).fontSize(10),
        prepareRow: () => doc.fontSize(8).font(baseFont),
        width: options.colWidthTwoCol - (options.gutterTwoCol / 2)
      });
    if (index % 2 === 0) {
      doc.y = currentY;
    }
  });

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
    'The economic inputs supplied for the calculations of LCOE and economic analysis for each renewable energy technology.'
  );

  doc.table({
    columnAlignment: ['left', 'right'],
    cells: Object.keys(data.lcoeValues).map((lcoeId) => {
      const lcoe = data.lcoeValues[lcoeId];
      return [lcoe.title, lcoe.input.value];
    })
  }, { width: options.colWidthThreeCol * 2 });

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
    'The values that were applied for weighting the inputs used to caclulate the zone scores.'
  );

  doc.table({
    columnAlignment: ['left', 'right'],
    cells: Object.keys(data.weightsValues).map((weightId) => {
      const weight = data.weightsValues[weightId];
      return [weight.title, weight.input.value];
    })
  }, { width: options.colWidthThreeCol * 2 });

  /**
   * About Section
   */
  drawSectionHeader(
    'About the Tool',
    doc.x,
    doc.y += (options.margin * 2),
    doc,
    options
  );
  doc.y += options.tables.padding;
  doc.text(
    `The Renewable Energy Zoning (REZoning) tool is an interactive, web-based platform designed to identify, visualize, and rank zones that are most suitable for the development of solar, wind, or offshore wind projects. Custom spatial filters and economic parameters can be applied to meet users needs or to represent a specific country context.
    
    Inspired by Berkley’s MapRE and developed by ESMAP the tool bring together complex spatial analysis and economic calculations into an online, user-friendly environment that allows users and decision makers to obtain insights into the technical and economic potential of renewable energy resources for any country. Inspired by and based off Berkely Lab and the University of California Santa Barbaras (UCSB) platform Multi-criteria Analysis for Planning Renewable Energy (MapRE) and developed by ESMAP in partnership with UCSB, the tool brings together spatial analysis and economic calculations into an online, user-friendly environment that allows users and decision makers to obtain insights into the technical and economic potential of renewable energy resources for all countries.
    
    The REZoning tool is powered by global geospatial datasets and uses baseline industry assumptions as default values for economic calculations. No input dataset, nor simulation outcome produced by the tool represents the official position of the World Bank Group or UCSB. The boundaries, colors, denominations and other information shown on the outputs do not imply on the part of the World Bank any judgement on the legal status of any territory or endorsement or acceptance of such boundaries.`,
    options.margin,
    doc.y
  );

  drawSectionHeader(
    'Relevant Tools',
    doc.x,
    doc.y += (options.margin * 2),
    doc,
    options
  );
  doc.y += options.tables.padding;
  doc.font(boldFont)
    .text(
      'ENERGYDATA.INFO: ',
      doc.x,
      doc.y,
      {
        link: 'https://energydata.info/',
        continued: true
      })
    .font(baseFont)
    .text('Open data and analytics for a sustainable energy future.');
  doc.font(boldFont)
    .text(
      'GLOBAL SOLAR ATLAS: ',
      doc.x,
      doc.y + (options.tables.padding / 2),
      {
        link: 'https://globalsolaratlas.info/map',
        continued: true
      }
    )
    .font(baseFont)
    .text('Access to solar resource and photovoltaic power potential around the globe.');
  doc.font(boldFont)
    .text(
      'GLOBAL WIND ATLAS: ',
      doc.x,
      doc.y + (options.tables.padding / 2),
      {
        link: 'https://globalwindatlas.info/',
        continued: true
      }
    )
    .font(baseFont)
    .text('Identify high-wind areas for wind power generation virtually anywhere in the world.');
}

export default async function exportPDF (data, map, setMap) {
  showGlobalLoadingMessage('Generating PDF Report...');
  return map.fitBounds(data.selectedArea.bounds, { padding: 100 }).once('moveend', async () => {
    setMap(map);

    // Give unloaded layers time to load
    await new Promise(resolve => setTimeout(resolve, MIN_TIMEOUT));

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

    // Add footer to each page
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      drawFooter(doc, i + 1);
    }

    // Finalize PDF file
    doc.end();

    hideGlobalLoading();

    return await stream.on('finish', function () {
      saveAs(
        stream.toBlob('application/pdf'),
        `WBG-REZoning-${data.selectedArea.id}-summary-${getTimestamp()}.pdf`
      );
    });
  });
}

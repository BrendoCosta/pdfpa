import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3";
import { JSDOM } from "jsdom";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

export async function processAsync(
  directory: string,
  output: string
): Promise<void> {
  return new Promise<void>((resolve) => {
    const SHEET_WIDTH = 593;
    const SHEET_HEIGHT = 892.2;
    const CELL_WIDTH = 53.5;
    const CELL_HEIGHT = 22.936;
    const CELL_BORDER_RADIUS = 1.361;
    const VERTICAL_GAP = 5.959;
    const HORIZONTAL_GAPS = [
      10.54, 11.016, 10.991, 10.991, 11.344, 10.991, 10.991, 10.991,
    ];
    const X_MARGIN = 14.702;
    const Y_MARGIN = 15.653;
    const Y_MARGIN_ADJUSTMENT = 0.713; // For the first 5 columns
    const SVG_ID = "svgdocument";

    const { document } = new JSDOM("").window;
    global.document = document;

    var body = d3.select(document).select("body");

    var svg = body
      .append("svg")
      .attr("id", SVG_ID)
      .attr("width", `${SHEET_WIDTH}mm`)
      .attr("height", `${SHEET_HEIGHT}mm`);

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "forma")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", `${CELL_WIDTH}mm`)
      .attr("height", `${CELL_HEIGHT}mm`)
      .attr("rx", `${CELL_BORDER_RADIUS}mm`);

    const fileList = fs
      .readdirSync(path.resolve(directory), { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .filter((item) =>
        new RegExp(/[.](png|jpg|jpeg|gif|webp)/g, "i").test(item.name)
      )
      .sort((a, b) => {
        if (a > b) return -1;
        if (b > a) return 1;
        return 0;
      });

    let index = 0,
      column = 0,
      row = 0;

    for (
      let positionY = Y_MARGIN;
      positionY <= SHEET_HEIGHT - CELL_HEIGHT;
      positionY += CELL_HEIGHT + VERTICAL_GAP + Y_MARGIN_ADJUSTMENT
    ) {
      column = 0;
      for (
        let positionX = X_MARGIN;
        positionX <= SHEET_WIDTH - CELL_WIDTH;
        positionX += CELL_WIDTH + HORIZONTAL_GAPS[column - 1]
      ) {
        if (column == 5) {
          positionY -= Y_MARGIN_ADJUSTMENT;
        }

        console.log({ row, column, positionX, positionY });

        if (index < fileList.length) {
          svg
            .append("image")
            .attr("x", `${positionX}mm`)
            .attr("y", `${positionY}mm`)
            .attr("width", `${CELL_WIDTH}mm`)
            .attr("height", `${CELL_HEIGHT}mm`)
            .attr("rx", `${CELL_BORDER_RADIUS}mm`)
            .attr("href", path.join(fileList[index].path, fileList[index].name))
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr("clip-path", "url(#clip)");
        }

        index += 1;
        column += 1;
      }

      row += 1;
    }

    const PDF_POINT_MM: number = 0.3527777778;
    const pdfDocument = new PDFDocument({
      layout: "portrait",
      size: [
        Math.floor(SHEET_WIDTH / PDF_POINT_MM),
        Math.floor(SHEET_HEIGHT / PDF_POINT_MM),
      ],
    });

    let outputStream: fs.WriteStream = fs.createWriteStream(output);
    outputStream.on("finish", () => resolve());

    pdfDocument.pipe(outputStream);
    SVGtoPDF(
      pdfDocument,
      document.getElementById(SVG_ID)?.outerHTML ?? "",
      0,
      0
    );
    pdfDocument.end();
  });
}

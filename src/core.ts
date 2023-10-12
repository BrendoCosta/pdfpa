/*
    MIT License

    Copyright (c) 2023 Brendo Costa

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3";
import { JSDOM } from "jsdom";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

export async function processAsync(diretorio: string, saida: string): Promise<void> {

    return new Promise<void>((resolve) => {

        const SHEET_WIDTH: number = 593;
        const SHEET_HEIGHT: number = 892.2;
        const CELL_WIDTH: number = 53.5;
        const CELL_HEIGHT: number = 22.936;
        const CELL_BORDER_RADIUS: number = 1.361;
        const HORIZONTAL_GAP: number = 5.96;
        const VERTICAL_GAP: number = 10.54;
        const SVG_ID: string = "svgdocument";

        const { document } = (new JSDOM("")).window;
        global.document = document;

        var body = d3.select(document).select("body");

        var svg = body.append("svg")
            .attr("id", SVG_ID)
            .attr("width", `${SHEET_WIDTH}mm`)
            .attr("height", `${SHEET_HEIGHT}mm`);

        svg.append("defs")
            .append("clipPath")
                .attr("id", "forma")
                .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", `${CELL_WIDTH}mm`)
                    .attr("height", `${CELL_HEIGHT}mm`)
                    .attr("rx", `${CELL_BORDER_RADIUS}mm`);

        const fileList = fs.readdirSync(path.resolve(diretorio), { withFileTypes: true })
            .filter(item => !item.isDirectory())
            .filter(item => new RegExp(/[.](png|jpg|jpeg|gif|webp)/g, "i").test(item.name))
            .sort((a, b) => {

                if (a > b) return -1;
                if (b > a) return 1;
                return 0;

            });

        let index: number = 0;

        for (let positionY = 0; positionY < SHEET_HEIGHT - CELL_HEIGHT; positionY += CELL_HEIGHT + HORIZONTAL_GAP) {

            for (let positionX = 0; positionX < SHEET_WIDTH - CELL_WIDTH; positionX += CELL_WIDTH + VERTICAL_GAP) {

                svg.append("rect")
                    .attr("x", `${positionX}mm`)
                    .attr("y", `${positionY}mm`)
                    .attr("width", `${CELL_WIDTH}mm`)
                    .attr("height", `${CELL_HEIGHT}mm`)
                    .attr("rx", `${CELL_BORDER_RADIUS}mm`)
                    .attr("fill", "#bf106a");

                if (index < fileList.length) {

                    svg.append("image")
                        .attr("x", `${positionX}mm`)
                        .attr("y", `${positionY}mm`)
                        .attr("width", `${CELL_WIDTH}mm`)
                        .attr("height", `${CELL_HEIGHT}mm`)
                        .attr("rx", `${CELL_BORDER_RADIUS}mm`)
                        .attr("href", path.join(fileList[index].path, fileList[index].name))
                        .attr("preserveAspectRatio", "xMidYMid slice")
                        .attr("clip-path", "url(#clip)");

                }

                /*svg.append("text")
                    .attr("x", `${positionX}mm`)
                    .attr("y", `${positionY+10}mm`)
                    .attr("font-size", "10mm")
                    .attr("fill", "blue")
                    .text(`${index}`);*/

                index += 1;

            }

        }
        
        const PDF_POINT_MM: number = 0.3527777778;
        const pdfDocument = new PDFDocument({
            layout: "portrait",
            size: [ Math.floor(SHEET_WIDTH / PDF_POINT_MM), Math.floor(SHEET_HEIGHT / PDF_POINT_MM)]
        });

        let outputStream: fs.WriteStream = fs.createWriteStream(saida);
        outputStream.on("finish", () => resolve());

        pdfDocument.pipe(outputStream);
        SVGtoPDF(pdfDocument, document.getElementById(SVG_ID)?.outerHTML ?? "", 0, 0);
        pdfDocument.end();

    });

}
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
import { argv } from "node:process";
import * as core from "./core";

function displayHelp(): void {

    let text: string[] = [
        "PDFPA - PDFPrinterAutomation - v0.0.0 - 2023 Brendo Costa"
        , "USAGE: pdfpa [input directory] [output PDF file]"
    ];

    console.log(text.join("\n"));

}

function isEmpty(str: string) {
    
    return !str || !str.trim();

}

try {

    if (argv.length == 3 && (argv[2] == "-h" || argv[2] == "-help")) {

        displayHelp();
        process.exit(0);

    }

    if (argv.length != 4) {

        console.error("Error: wrong argument count!");
        displayHelp();
        process.exit(-1);

    }

    let inputDirectory: string | null = argv[2];
    let outputPdfFile: string | null = argv[3];

    if (isEmpty(inputDirectory)) {

        console.error("Error: input directory not specified!");
        displayHelp();
        process.exit(-1);

    }

    if (!fs.existsSync(inputDirectory)) {

        console.error("Error: the input directory doesn't exist!");
        process.exit(-1);

    }

    if (isEmpty(outputPdfFile)) {

        console.error("Error: output PDF file not specified!");
        displayHelp();
        process.exit(-1);

    }

    await core.processAsync(inputDirectory, outputPdfFile);
    console.log("Successfully finished processing!");
    process.exit(0);

} catch (err: any) {

    console.error(`Error: ${(err as Error).message}`);
    console.error(err);
    process.exit(-1);

}


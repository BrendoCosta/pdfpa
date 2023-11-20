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


# PDFPA - PDFPrinterAutomation

Simple Node.js tool to automate PDF (Portable Document Format) generation for large printings of raster images. Uses SVG (Scalable Vector Graphics) to build the PDF file dynamically.

## Usage

`pdfpa [input directory] [output PDF file]`

## Build

### Requirements

- Node.js >= 18.17.1

### Clone

Clone this project's repository with `git`:

```sh
git clone https://github.com/BrendoCosta/pdfpa.git
```

Enter project's directory:

```sh
cd ./pdfpa
```

Install project's dependencies:

```sh
npm ci
```

### Build

Build runtime files to `/dist/pdfpa` directory:

```sh
npm run build
```

### Run

Run the tool with Node.js runtime:

```sh
node ./dist/pdfpa
```

### Pack

Create a binary executable of the tool with Node.js runtime bundled to `/dist/bin` directory:

```sh
npm run pack
```

## License

Source code avaliable under [MIT](/LICENSE) license.
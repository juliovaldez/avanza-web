// Suppress type errors for exceljs bundled distributions
declare module 'exceljs/dist/exceljs.min.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ExcelJS: any;
  export default ExcelJS;
}

// Suppress internal exceljs module resolution
declare module 'exceljs/dist/es5' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export = content;
}

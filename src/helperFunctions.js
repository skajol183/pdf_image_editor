async function loadPDF({ PSPDFKit, container, document }) {
  const instance = await PSPDFKit.load({
    container,
    document ,
    baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
  });
  return instance;
}
export { loadPDF };

import { useEffect, useRef } from "react";
import { loadPDF } from "../../helperFunctions";

function PDFEditor(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    let PSPDFKit;
    const container = containerRef.current;

    async function fetchAndLoadPDF() {
      try {
        // Check if document prop is a URL
        if (
          typeof props.document === "string" &&
          props.document.startsWith("http")
        ) {
          const response = await fetch(props.document);
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
          }
          const blob = await response.blob();
          const instance = await loadPDF({
            PSPDFKit,
            container,
            document: blob,
          });
        } else {
          const file = props.document;
          if (!file || !file.type.startsWith("application/pdf")) {
            return null;
          }
          const reader = new FileReader();
          const arrayBuffer = await new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
          });
          const instance = await loadPDF({
            PSPDFKit,
            container,
            document: arrayBuffer,
          });
        }
      } catch (error) {
        console.error("Error fetching or reading PDF:", error);
      }
    }

    (async function () {
      PSPDFKit = await import("pspdfkit");
      PSPDFKit.unload(container);
      await fetchAndLoadPDF();
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}

export default PDFEditor;

import React, { useState } from "react";
import { PinturaEditor } from "@pqina/react-pintura";
import { getEditorDefaults } from "@pqina/pintura";
import "@pqina/pintura/pintura.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "./Editor.module.scss";
import PDFEditor from "../PDFEditor/PDFEditor";

const editorConfig = getEditorDefaults();

const ImageEditor = () => {
  const [editorResult, setEditorResult] = useState(undefined);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setEditorResult(null);
  };

  const handleProcessMedia = (res) => {
    const { dest } = res;
    setEditorResult(URL.createObjectURL(dest));
  };

  const renderMediaEditor = () => {
    if (!selectedFile) {
      return null;
    }

    const fileType = selectedFile.type;

    if (fileType.startsWith("image/")) {
      return (
        <>
          <div className={styles.editor_box}>
            {editorResult && <img src={editorResult} alt="" />}
            <PinturaEditor
              {...editorConfig}
              src={URL.createObjectURL(selectedFile)}
              imageCropAspectRatio={1}
              onProcess={handleProcessMedia}
            ></PinturaEditor>
          </div>
        </>
      );
    } else if (fileType === "application/pdf") {
      return (
        <>
          <div className={styles.editor_box}>
            {selectedFile && <PDFEditor document={selectedFile} />}
          </div>
        </>
      );
    } else {
      return <p>Unsupported file type. Please select an image or PDF.</p>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_input_box}>
        <h1>PDF/Image File Editor</h1>
        <input
          className={styles.upload_btn}
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
      </div>
      {renderMediaEditor()}
    </div>
  );
};

export default ImageEditor;

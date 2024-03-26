import { ChangeEvent, DragEvent, useState } from "react";

function FileUpload({
  onFileChange,
  onFileReset,
  label = "UPLOAD FILE",
  loading = false,
}: {
  onFileChange: (file: File) => any;
  onFileReset: () => any;
  label?: string;
  loading?: boolean;
}) {
  const [state, setState] = useState<{
    filePreview?: string;
  }>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.item(0);
    handleFile(file);
  };

  const handleFileDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files?.item(0);
    handleFile(file);
  };

  function handleFile(file: File | null | undefined) {
    if (file) {
      setState((prev) => ({
        ...prev,
        filePreview: URL.createObjectURL(file),
      }));
      onFileChange(file);
    } else {
      setState((prev) => ({
        ...prev,
        filePreview: undefined,
      }));
    }
  }

  const handleFileReset = () => {
    setState((prev) => ({
      ...prev,
      filePreview: undefined,
    }));
    onFileReset();
  };

  return (
    <div className="w-full h-screen-3/4">
      {!state?.filePreview && (
        <div className="h-full">
          <input
            hidden={true}
            id="implementation_draft_upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
          />
          <label
            htmlFor="implementation_draft_upload"
            className="border-2 border-dashed rounded-2xl h-full flex justify-center items-center cursor-pointer"
            onDrop={handleFileDrop}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col justify-center items-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-6 h-6 stroke-palette_grey"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>

              {label && (
                <span className="font-semibold text-palette_grey">{label}</span>
              )}

              <span className="text-palette_grey">
                <span className="font-bold">Click to upload</span> or drag and{" "}
                <br />
                drop PDF only (MAX 100MB)
              </span>
            </div>
          </label>
        </div>
      )}
      {state?.filePreview && (
        <div className="flex flex-col w-full h-full">
          <iframe
            loading="lazy"
            src={state.filePreview}
            className="w-full h-full rounded"
          />
          <div className="flex justify-center p-2">
            <button
              className="bg-palette_blue text-palette_white rounded flex items-center space-x-2 px-20 py-2 disabled:bg-palette_grey"
              onClick={handleFileReset}
              disabled={loading}
            >
              <span>Replace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;

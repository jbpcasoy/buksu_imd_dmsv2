import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Confirmation from "./Confirmation";

function FileUpload({
  onFileChange,
  onFileReset,
  label = "UPLOAD FILE",
  loading = false,
  onSubmit,
  submitDisabled: submitEnabled = true
}: {
  onFileChange: (file: File) => any;
  onFileReset: () => any;
  label?: string;
  loading?: boolean;
  onSubmit?: () => any,
  submitDisabled?: boolean
}) {
  const [state, setState] = useState<{
    filePreview?: string;
    openConfirmation: boolean,
  }>({
    openConfirmation: false
  });

  const inputId = useMemo(() => uuidv4(), [])

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
    <div className="w-full h-full">
      {!state?.filePreview && (
        <div className="h-full">
          <input
            hidden={true}
            id={inputId}
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
          />
          <label
            htmlFor={inputId}
            className="border-2 border-dashed rounded-2xl flex justify-center items-center cursor-pointer bg-palette_white h-screen-3/4"
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

              <span className="text-palette_grey text-sm">
                <span className="font-semibold">Click to upload</span> or drag and{" "}
                <br />
                drop PDF only (MAX 100MB)
              </span>
            </div>
          </label>
        </div>
      )}
      {state?.filePreview && (
        <iframe
          loading="lazy"
          src={state.filePreview}
          className="w-full h-screen-3/4 rounded"
        />
      )}
      <div className="flex flex-col sm:flex-row justify-end p-2 space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          className="rounded-md font-semibold text-sm px-4 py-2 border border-palette_blue hover:border-opacity-90 disabled:border-opacity-50 disabled:text-palette_grey"
          onClick={handleFileReset}
          disabled={loading || !Boolean(state?.filePreview)}
        >Replace
        </button>
        {onSubmit && <>
          <button
            className="bg-palette_blue text-palette_white space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
            disabled={submitEnabled
            }
            onClick={() => setState(prev => ({ ...prev, openConfirmation: true }))}
          >
            Submit
          </button>
          {state.openConfirmation && (
            <Confirmation
              onClose={() => setState(prev => ({ ...prev, openConfirmation: false }))}
              onConfirm={onSubmit}
            />
          )}
        </>}
      </div>
    </div>
  );
}

export default FileUpload;

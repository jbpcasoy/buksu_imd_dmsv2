import { ChangeEvent, useState } from "react";

function FileUpload({
  onFileChange,
  onFileReset,
  label = "UPLOAD FILE",
  loading = false,
}: {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => any;
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
    if (file) {
      setState((prev) => ({
        ...prev,
        filePreview: URL.createObjectURL(file),
      }));
      onFileChange(e);
    } else {
      setState((prev) => ({
        ...prev,
        filePreview: undefined,
      }));
    }
  };

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
            className="border-2 border-dashed rounded h-full flex justify-center items-center cursor-pointer"
            onDrop={(e) => {
              e.dataTransfer.files;
            }}
          >
            <span className="text-palette_grey text-sm">{label}</span>
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

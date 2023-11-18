import { ChangeEvent, useState } from "react";

function FileUpload({
  onFileChange,
  onFileReset,
  label = "UPLOAD FILE",
}: {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => any;
  onFileReset: () => any;
  label?: string;
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
    <div className='my-1 w-full'>
      {!state?.filePreview && (
        <>
          <input
            hidden={true}
            id='implementation_draft_upload'
            type='file'
            onChange={handleFileChange}
            accept='.pdf'
          />
          <label
            htmlFor='implementation_draft_upload'
            className='border-2 border-dashed rounded h-screen-3/4 flex justify-center items-center cursor-pointer my-1'
            onDrop={(e) => {
              e.dataTransfer.files;
            }}
          >
            <span className='text-palette_grey text-sm'>{label}</span>
          </label>
        </>
      )}
      {state?.filePreview && (
        <div className='flex flex-col'>
          <div className='flex justify-end'>
            <button
              className='bg-palette_blue text-palette_white px-1 rounded mb-1'
              onClick={handleFileReset}
            >
              Replace File
            </button>
          </div>
          <iframe
            src={state.filePreview}
            className='w-full h-screen-3/4'
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default FileUpload;

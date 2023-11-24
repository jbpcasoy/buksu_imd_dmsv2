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
    <div className='my-1 '>
      {!state?.filePreview && (
        <div className=''>
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
        </div>
      )}
      {state?.filePreview && (
        <div className='flex flex-col w-full'>
          <div className='flex justify-end'>
            <button
              className='bg-palette_blue text-palette_white px-1 rounded mb-1 flex items-center space-x-2'
              onClick={handleFileReset}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='1em'
                viewBox='0 0 576 512'
                className='fill-palette_white'
              >
                <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z' />
              </svg>
              <span>Replace</span>
            </button>
          </div>
          <iframe
            src={state.filePreview}
            className='w-full h-screen-3/4 rounded'
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default FileUpload;

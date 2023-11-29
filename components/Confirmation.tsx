import { useEffect, useState } from "react";

export interface ConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  shortDescription?: string;
}

export default function Confirmation({
  onClose,
  onConfirm,
  shortDescription = "This action cannot be undone.",
  title = "Are you sure?",
}: ConfirmationProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const confirmHandler = () => {
    onConfirm();
    onClose();
  }

  return (
    <div
      className='fixed inset-0 flex justify-center items-center bg-palette_black bg-opacity-40'
      onClick={onClose}
    >
      <div
        className='border w-full max-w-sm bg-palette_white rounded flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between px-5 py-2'>
          <div className=''>
            <h1 className="text-lg">{title}</h1>
            {shortDescription && <p className="text-palette_grey">{shortDescription}</p>}
          </div>
          <div>
            <button
              className='w-5 h-5 flex justify-center items-center rounded-full hover:bg-palette_grey hover:bg-opacity-50'
              onClick={onClose}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='1em'
                viewBox='0 0 384 512'
                className='fill-palette_blue'
              >
                <path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z' />
              </svg>
            </button>
          </div>
        </div>
        <div className='flex justify-end space-x-2 p-1'>
          <button
            className='px-4 py-1 bg-palette_error hover:bg-opacity-90 text-palette_white rounded'
            onClick={confirmHandler}
          >
            Yes
          </button>
          <button
            className='px-4 py-1 bg-palette_blue text-palette_white rounded hover:bg-opacity-90'
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

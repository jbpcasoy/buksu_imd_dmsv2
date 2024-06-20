import { useEffect, useState } from "react";

interface ConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  shortDescription?: string;
  matchText?: string;
}

export default function Confirmation({
  matchText,
  onClose,
  onConfirm,
  shortDescription = "This action cannot be undone.",
  title = "Are you sure?",
}: ConfirmationProps) {
  const [state, setState] = useState({
    typedText: "",
  });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmHandler = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-palette_black bg-opacity-40 px-1 md:px-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-palette_white rounded-2xl flex flex-col overflow-clip"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between p-4 space-y-1 border-b">
          <div className="">
            <h1 className=" font-semibold">{title}</h1>
          </div>
          <div>
            <button
              className="w-5 h-5 flex justify-center items-center rounded-full hover:bg-palette_grey hover:bg-opacity-50"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                className="fill-palette_blue"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
        </div>

        {shortDescription && (
          <p className="text-palette_grey p-4">{shortDescription}</p>
        )}
        {matchText && (
          <div className="flex flex-col space-y-1 px-2">
            <p className="text-center select-none">{matchText}</p>
            <input
              type="text"
              placeholder="Retype text to confirm"
              className="rounded py-1"
              onChange={(e) =>
                setState((prev) => ({ ...prev, typedText: e.target.value }))
              }
            />
          </div>
        )}
        <div className="flex justify-end space-x-2 py-4 pr-4">
          <button
            className="border border-palette_blue text-palette_blue hover:border-opacity-90 hover:text-opacity-90 rounded-md px-4 py-2 font-semibold text-sm"
            onClick={onClose}
          >
            No
          </button>
          <button
            className=" bg-palette_blue hover:bg-opacity-90 text-palette_white  disabled:bg-palette_grey rounded-md px-4 py-2 font-semibold text-sm"
            onClick={confirmHandler}
            disabled={Boolean(matchText) && matchText !== state.typedText}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

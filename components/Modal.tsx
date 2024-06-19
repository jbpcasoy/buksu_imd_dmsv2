import { useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  title: string;
  shortDescription?: string;
  children: React.ReactNode;
}

export default function Modal({
  onClose,
  children,
  shortDescription,
  title,
}: ModalProps) {
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

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-palette_black bg-opacity-40 px-1 md:p-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-palette_white rounded-2xl max-h-96 overflow-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between p-4 pb-2 bg-palette_light_grey_2">
          <div className="">
            <h1 className="font-semibold text-base">{title}</h1>
            {shortDescription && <p>{shortDescription}</p>}
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
        {/* <div className="px-2">
          <hr />
        </div> */}

        <div className="p-4 pt-2 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

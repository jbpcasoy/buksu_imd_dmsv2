export interface ModalProps {
  onClose: () => void;
  title: string;
  shortDescription?: string;
  content: React.ReactNode;
}

export default function Modal({
  onClose,
  content,
  shortDescription,
  title,
}: ModalProps) {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-palette_black bg-opacity-40'>
      <div className='border w-full max-w-sm bg-palette_white rounded'>
        <div className='flex justify-between px-5 py-2'>
          <div className=''>
            <h1>{title}</h1>
            {shortDescription && <p>{shortDescription}</p>}
          </div>
          <div>
            <button className='w-full' onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div className='px-5 py-2'>{content}</div>
      </div>
    </div>
  );
}

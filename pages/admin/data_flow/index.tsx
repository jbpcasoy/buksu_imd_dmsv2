import AdminLayout from "@/components/AdminLayout";

export default function HelpPage() {
  return (
    <AdminLayout>
      <div className="w-full h-full space-y-4 flex flex-col">
        <div>
          <div className="inline-flex space-x-2 p-3 bg-palette_white rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-palette_grey"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
            <p className="font-bold">Data Flow</p>
          </div>
        </div>
        <div className="flex-1">
          <iframe
            className="h-full w-full rounded-2xl"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FkputkulJppAhK2iTMbOpHt%2FBukSU-IMD-DMS%3Ftype%3Dwhiteboard%26node-id%3D0%253A1%26t%3DaN11OchXmskVQSAw-1"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </AdminLayout>
  );
}

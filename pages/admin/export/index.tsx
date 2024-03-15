import AdminLayout from "@/components/AdminLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import prisma from "@/prisma/client";
import axios from "axios";
import { saveAs } from "file-saver";
import { useContext } from "react";

export default function ExportPage({ models }: { models: string[] }) {
  const { addSnackbar } = useContext(SnackbarContext);
  const exportCsv = async (url: string) => {
    return axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        console.log({ res });
        saveAs(
          new Blob([res.data]),
          `export_${url.split("/").at(-1)}_${new Date()}.csv`
        );
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Download Failed",
          "error"
        );
      });
  };

  return (
    <AdminLayout>
      {models.map((model) => {
        return (
          <div
            key={model}
            className="flex odd:bg-gray-50 p-1 rounded hover:bg-gray-100 items-center"
          >
            <p className="flex-1 text-palette_blue">{model}</p>
            <button onClick={() => exportCsv(`/api/export/${model}`)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="16"
                width="14"
                className="hover:fill-palette_light_blue fill-palette_blue"
              >
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
            </button>
          </div>
        );
      })}
    </AdminLayout>
  );
}

export const getServerSideProps = async () => {
  const models = Object.keys(prisma).filter((key: string) => {
    return !(key.startsWith("_") || key.startsWith("$"));
  });
  return { props: { models } };
};

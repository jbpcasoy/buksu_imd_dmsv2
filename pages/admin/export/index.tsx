import AdminLayout from "@/components/AdminLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import prisma from "@/prisma/client";
import axios from "axios";
import { saveAs } from "file-saver";
import { useContext, useState } from "react";

export default function ExportPage({ models }: { models: string[] }) {
  const { addSnackbar } = useContext(SnackbarContext);
  const [state, setState] = useState({
    loading: false,
  });
  const exportCsv = async (url: string) => {
    setState((prev) => ({ ...prev, loading: true }));
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
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-4 md:overflow-auto">
        <div>
          <div className="space-x-2 bg-palette_white inline-flex p-3 rounded-lg">
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <p className="font-bold">Export</p>
          </div>
        </div>
        <div className="h-full w-full flex-1 md:overflow-auto bg-palette_white p-4 rounded-2xl ">
          <div className="h-full md:overflow-auto space-y-2">
            {models.map((model) => {
              return (
                <div
                  key={model}
                  className={`flex p-2 rounded-lg ${
                    !state.loading
                      ? "bg-palette_light_grey hover:bg-opacity-50 hover:cursor-pointer"
                      : "border"
                  } items-center group`}
                  onClick={() => {
                    if (!state.loading) {
                      exportCsv(`/api/export/${model}`);
                    }
                  }}
                >
                  <p className="flex-1 text-palette_blue capitalize font-semibold">
                    {model}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className={`${
                      !state.loading
                        ? "group-hover:stroke-palette_light_blue"
                        : ""
                    } stroke-palette_blue h-5 w-5`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = async () => {
  const models = Object.keys(prisma).filter((key: string) => {
    return !(key.startsWith("_") || key.startsWith("$"));
  });
  return { props: { models } };
};

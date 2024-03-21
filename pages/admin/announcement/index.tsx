import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useAnnouncements from "@/hooks/useAnnouncements";
import { Announcement } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function AnnouncementsPage() {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    filter: {
      title: "",
      description: "",
      url: "",
    },
    sort: {
      field: "title",
      direction: "asc",
    },
  });
  const { announcements, count } = useAnnouncements(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };
  const handleFilterChange = (field: string, value: string) => {
    if (field === "") {
      setState((prev) => ({
        ...prev,
        filter: {
          ...(Object.fromEntries(
            Object.entries(prev.filter).map(([key]) => [
              key,
              key === field ? value : "",
            ])
          ) as any),
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          [field]: value,
        },
      }));
    }
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setState((prev) => ({
      ...prev,
      sort: {
        field,
        direction,
      },
    }));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between p-1">
          <div className="flex justify-center items-end space-x-4">
            <div className="flex items-center justify-center space-x-2 bg-palette_white p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-palette_grey"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <h2 className="font-bold">Announcement</h2>
            </div>
            <div className="flex flex-row space-x-4 h-full">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <AddModal />
        </div>
        <div className="rounded-2xl bg-palette_white h-full flex flex-col p-4">
          <div className="flex-1">
            <table className="table-auto w-full">
              <thead className="">
                <tr>
                  <th className="font-medium text-left">TITLE</th>
                  <th className="font-medium text-left">DESCRIPTION</th>
                  <th className="font-medium text-left">URL</th>
                  <th className="font-medium text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => {
                  return (
                    <AnnouncementItem
                      announcement={announcement}
                      key={announcement.id}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center space-x-1 p-1">
            <p className="text-xs">
              {state.skip} - {state.skip + state.take} of {count}
            </p>
            <button
              disabled={state.skip - state.take < 0}
              className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
              onClick={previousHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
              <span>Previous</span>
            </button>
            <button
              disabled={state.skip + state.take >= count}
              className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
              onClick={nextHandler}
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                className="fill-inherit"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

interface AnnouncementItemProps {
  announcement: Announcement;
}

function AnnouncementItem({ announcement }: AnnouncementItemProps) {
  const [state, setState] = useState({
    openDelete: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const deleteHandler = () => {
    axios
      .delete(`/api/announcement/${announcement.id}`)
      .then(() => {
        addSnackbar("Announcement has been deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to delete announcement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const handleOpen = () => {
    setState((prev) => ({ ...prev, openDelete: true }));
  };
  const handleClose = () => {
    setState((prev) => ({ ...prev, openDelete: false }));
  };
  return (
    <tr key={announcement.id} className="border-b">
      <td className="py-1 pl-4">{announcement.title}</td>
      <td className="py-1">{announcement.description}</td>
      <td className="py-1">{announcement.url}</td>

      <td className="py-1 flex justify-center items-center">
        <div className="flex space-x-1">
          <EditModal announcement={announcement} />
          <>
            <button
              className="rounded bg-palette_blue hover:bg-opacity-90 w-7 h-7 flex justify-center items-center"
              onClick={handleOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-palette_white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            {state.openDelete && (
              <Confirmation onClose={handleClose} onConfirm={deleteHandler} />
            )}
          </>
        </div>
      </td>
    </tr>
  );
}

function AddModal() {
  const [state, setState] = useState({
    openAdd: false,
  });
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      url: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string(),
      url: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/announcement", values)
        .then(() => {
          addSnackbar("Announcement has been added successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to add announcement",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  const handleClose = () => {
    setState((prev) => ({ ...prev, openAdd: false }));
  };
  const handleOpen = () => {
    setState((prev) => ({ ...prev, openAdd: true }));
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-lg bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
          className="fill-palette_white"
        >
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
        </svg>
        <span>Add</span>
      </button>
      {state.openAdd && (
        <Modal onClose={handleClose} title="Add Announcement">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                placeholder="Title"
                className="rounded"
                {...formik.getFieldProps("title")}
              />
              <textarea
                placeholder="Description"
                className="rounded"
                {...formik.getFieldProps("description")}
              />
              <input
                type="text"
                placeholder="URL"
                className="rounded"
                {...formik.getFieldProps("url")}
              />
              <button
                type="submit"
                className="bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90"
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                    className="fill-palette_white"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

interface EditModalProps {
  announcement: Announcement;
}
function EditModal({ announcement }: EditModalProps) {
  const [state, setState] = useState({
    openEdit: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      url: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string(),
      url: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/announcement/${announcement.id}`, values)
        .then(() => {
          addSnackbar("Announcement has been updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!announcement) return;
    let subscribe = true;

    formik.setValues({
      title: announcement.title,
      description: announcement.description ?? "",
      url: announcement.url ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcement]);

  const handleClose = () => {
    setState((prev) => ({
      ...prev,
      openEdit: false,
    }));
  };
  const handleOpen = () => {
    setState((prev) => ({ ...prev, openEdit: true }));
  };

  return (
    <>
      <button
        className="rounded bg-palette_blue hover:bg-opacity-90 w-7 h-7 flex justify-center items-center"
        onClick={handleOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 stroke-palette_white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
      {state.openEdit && (
        <Modal onClose={handleClose} title="Update Announcement">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                placeholder="title"
                className="rounded"
                {...formik.getFieldProps("title")}
              />
              <textarea
                placeholder="description"
                className="rounded"
                {...formik.getFieldProps("description")}
              />
              <input
                type="text"
                placeholder="url"
                className="rounded"
                {...formik.getFieldProps("url")}
              />

              <button
                type="submit"
                className="bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90"
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                    className="fill-palette_white"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

interface FilterSelectorProps {
  onFilterChange: (field: string, value: string) => void;
}
function FilterSelector({ onFilterChange }: FilterSelectorProps) {
  const [selectedField, setSelectedField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleFieldChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (e.target.value === "") {
      setSelectedField("");
      setFilterValue("");
    } else {
      setSelectedField(e.target.value);
    }
  };

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilterValue(e.target.value ?? "");
  };

  useEffect(() => {
    onFilterChange(selectedField, filterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, filterValue]);

  return (
    <div className="flex">
      <select
        onChange={handleFieldChange}
        className="py-1 rounded-s-lg bg-palette_white focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="">Select field</option>
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="url">URL</option>
      </select>
      <input
        type="text"
        placeholder="Search"
        value={filterValue}
        className="bg-inherit border-b py-1 rounded-e-lg bg-palette_white focus:border-palette_grey focus:ring-palette_grey"
        onChange={handleValueChange}
      />
    </div>
  );
}
interface SortSelectorProps {
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}
function SortSelector({ onSortChange }: SortSelectorProps) {
  const [selectedField, setSelectedField] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleFieldChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedField(e.target.value);
  };

  const handleDirectionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSortDirection(e.target.value as "asc" | "desc");
  };

  useEffect(() => {
    onSortChange(selectedField, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, sortDirection]);

  return (
    <div className="flex">
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className="py-1 rounded-s-lg bg-palette_white focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="url">URL</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className="py-1 rounded-e-lg bg-palette_white focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

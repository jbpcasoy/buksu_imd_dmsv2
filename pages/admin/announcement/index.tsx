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
      <div className='border border-palette_grey rounded h-full flex flex-col'>
        <div className='flex justify-between bg-palette_grey bg-opacity-10 p-1'>
          <div className="flex space-x-1 justify-center items-end">
            <h2 className='border-b-2 border-palette_orange px-2'>
              Announcement
            </h2>
            <div className='flex flex-row space-x-1'>
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <AddModal />
        </div>

        <div className='flex-1'>
          <table className='table-auto w-full text-sm'>
            <thead className='bg-palette_grey bg-opacity-10'>
              <tr>
                <th className='font-normal'>TITLE</th>
                <th className='font-normal'>DESCRIPTION</th>
                <th className='font-normal'>URL</th>
                <th className='font-normal'>ACTION</th>
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
        <div className='flex justify-end items-center space-x-1 p-1'>
          <p className='text-xs'>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button
            disabled={state.skip - state.take < 0}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={previousHandler}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
            >
              <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
            </svg>
            <span>Previous</span>
          </button>
          <button
            disabled={state.skip + state.take >= count}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={nextHandler}
          >
            <span>Next</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
              className='fill-inherit'
            >
              <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
            </svg>
          </button>
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
    <tr key={announcement.id} className='border-b'>
      <td className='py-1 pl-4'>{announcement.title}</td>
      <td className='py-1'>{announcement.description}</td>
      <td className='py-1'>{announcement.url}</td>

      <td className='py-1 flex justify-center items-center'>
        <div className='flex space-x-1'>
          <EditModal announcement={announcement} />
          <>
            <button
              className='rounded bg-palette_blue px-4 py-1 hover:bg-opacity-90'
              onClick={handleOpen}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='16'
                width='14'
                viewBox='0 0 448 512'
                className='fill-palette_white'
              >
                <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
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
          addSnackbar("Announcement Added Successfully");
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
        className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 448 512'
          className='fill-palette_white'
        >
          <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
        </svg>
        <span>Add</span>
      </button>
      {state.openAdd && (
        <Modal onClose={handleClose} title='Add Announcement'>
          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <input
                type='text'
                placeholder='Title'
                className='rounded'
                {...formik.getFieldProps("title")}
              />
              <textarea
                placeholder='Description'
                className='rounded'
                {...formik.getFieldProps("description")}
              />
              <input
                type='text'
                placeholder='URL'
                className='rounded'
                {...formik.getFieldProps("url")}
              />
              <button
                type='submit'
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
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
        className='rounded bg-palette_blue px-4 py-1 hover:bg-opacity-90'
        onClick={handleOpen}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='16'
          width='16'
          viewBox='0 0 512 512'
          className='fill-palette_white'
        >
          <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
        </svg>
      </button>
      {state.openEdit && (
        <Modal onClose={handleClose} title='Update Announcement'>
          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <input
                type='text'
                placeholder='title'
                className='rounded'
                {...formik.getFieldProps("title")}
              />
              <textarea
                placeholder='description'
                className='rounded'
                {...formik.getFieldProps("description")}
              />
              <input
                type='text'
                placeholder='url'
                className='rounded'
                {...formik.getFieldProps("url")}
              />

              <button
                type='submit'
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
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
  }, [selectedField, filterValue]);

  return (
    <div>
      <select
        onChange={handleFieldChange}
        className='py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value=''>Select field</option>
        <option value='title'>Title</option>
        <option value='description'>Description</option>
        <option value='url'>URL</option>
      </select>
      <input
        type='text'
        placeholder='Search'
        value={filterValue}
        className='bg-inherit border-b py-1 rounded-e focus:border-palette_grey focus:ring-palette_grey'
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
  }, [selectedField, sortDirection]);

  return (
    <div>
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className='py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value='title'>Title</option>
        <option value='description'>Description</option>
        <option value='url'>URL</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className='py-1 rounded-e bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value='asc'>Ascending</option>
        <option value='desc'>Descending</option>
      </select>
    </div>
  );
}

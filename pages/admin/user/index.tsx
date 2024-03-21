import AdminLayout from "@/components/AdminLayout";
import useUsers from "@/hooks/useUsers";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    filter: {
      name: "",
      email: "",
    },
    sort: {
      field: "name",
      direction: "asc",
    },
  });
  const { users, count } = useUsers(state);

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
          name: "",
          email: "",
        },
      }));
    } else {
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
      <div className="space-y-4 flex flex-col h-full sm:overflow-auto">
        <div className="flex justify-between p-1">
          <div className="flex items-end space-x-4 w-full h-full">
            <div className="inline-flex space-x-2 p-3 justify-center items-center rounded-lg bg-palette_white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <h2 className="font-bold">User</h2>
            </div>

            <div className="flex flex-row space-x-4 h-full">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl flex-1 h-full flex flex-col bg-palette_white p-4 sm:overflow-auto">
          <div className="flex-1">
            <table className="table-auto w-full">
              <thead className="p-1">
                <tr>
                  <th className="font-medium text-left">NAME</th>
                  <th className="font-medium text-left">EMAIL</th>
                  <th className="font-medium text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user.id} className="border-b">
                      <td className="py-1 pl-4">{user.name}</td>
                      <td className="py-1">{user.email}</td>
                      <td className="py-1 flex justify-center items-center">
                        <Link
                          href={`/admin/user/${user.id}`}
                          className="rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90"
                        >
                          <span className="flex items-center space-x-1">
                            <span>View</span>
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="16"
                                viewBox="0 0 512 512"
                                className="fill-palette_white"
                              >
                                <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                              </svg>
                            </span>
                          </span>
                        </Link>
                      </td>
                    </tr>
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
    <div className="flex bg-palette_white">
      <select
        onChange={handleFieldChange}
        className="rounded-s-lg bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="">Select field</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
      <input
        type="text"
        placeholder="Search"
        value={filterValue}
        className="bg-inherit rounded-e-lg focus:border-palette_grey focus:ring-palette_grey"
        onChange={handleValueChange}
      />
    </div>
  );
}

interface SortSelectorProps {
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}
function SortSelector({ onSortChange }: SortSelectorProps) {
  const [selectedField, setSelectedField] = useState("name");
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
    <div className="flex bg-palette_white">
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className="py-1 rounded-s-lg bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className="py-1 rounded-e-lg bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

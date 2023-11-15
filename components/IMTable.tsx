import useIMStatus from "@/hooks/useIMStatus";
import { IM } from "@prisma/client";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";
import { DateTime } from "luxon";
import useUserFaculty from "@/hooks/useUserFaculty";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useCollegeIM from "@/hooks/useCollegeIM";

export interface IMTableProps {
  count: number;
  iMs: IM[];
  title: string;
  onChangeState: (state: any) => any;
}

export default function IMTable({
  count,
  iMs,
  title,
  onChangeState,
}: IMTableProps) {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
    sort: {
      field: "createdAt",
      direction: "desc",
    },
  });

  useEffect(() => {
    onChangeState(state);
  }, [state]);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      console.log({ prev, nextVal });

      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    if (field === "") {
      setState((prev) => ({
        ...prev,
        filter: {
          collegeName: "",
          departmentName: "",
          title: "",
          userName: "",
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
    <div className='text-sm border border-palette_grey rounded'>
      <div className='p-1 bg-palette_grey bg-opacity-10'>
        <div className='flex'>
          <div className='flex-1 flex items-center space-x-1'>
            <h2 className='text-base border-b-2 border-palette_orange inline pb-1 px-2'>
              {title}
            </h2>
            <div className='flex flex-row space-x-1'>
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <Link
            href='/im/add'
            className='rounded bg-palette_blue text-palette_white py-1 px-2'
          >
            Add IM
          </Link>
        </div>
      </div>
      <table className='table-auto w-full'>
        <thead className='bg-palette_grey bg-opacity-10 p-1'>
          <tr>
            <th className='font-normal'>TITLE</th>
            <th className='font-normal'>TYPE</th>
            <th className='font-normal'>AUTHOR</th>
            <th className='font-normal'>DEPARTMENT</th>
            <th className='font-normal'>COLLEGE</th>
            <th className='font-normal'>STATUS</th>
            <th className='font-normal'>DATE CREATED</th>
            <th className='font-normal'>ACTIONS</th>
          </tr>
        </thead>
        <tbody className='py-1'>
          {iMs.map((iM) => {
            return <IMItem iM={iM} key={iM.id} />;
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1 p-1'>
        <p>
          {state.skip} - {state.skip + state.take} of {count}
        </p>
        <button className='border rounded' onClick={previousHandler}>
          prev
        </button>
        <button className='border rounded' onClick={nextHandler}>
          next
        </button>
      </div>
    </div>
  );
}

function IMItem({ iM }: { iM: IM }) {
  const user = useUserFaculty({
    id: iM.facultyId,
  });
  const department = useDepartmentIM({ id: iM.id });
  const college = useCollegeIM({ id: iM.id });

  return (
    <tr key={iM.id}>
      <td>
        <div className='py-1 pl-4'>{iM.title}</div>
      </td>
      <td>
        <div className='py-1'>{iM.type}</div>
      </td>
      <td>
        <div className='py-1'>{user?.name}</div>
      </td>
      <td>
        <div className='py-1'>{department?.name}</div>
      </td>
      <td>
        <div className='py-1'>{college?.name}</div>
      </td>
      <td>
        <div className='py-1'>
          <IMStatus iM={iM} />
        </div>
      </td>
      <td>
        <div className='py-1'>
          {DateTime.fromJSDate(new Date(iM.createdAt)).toRelative()}
        </div>
      </td>
      <td>
        <div className='py-1 flex justify-center items-center'>
          <Link
            href={`/im/${iM.id}`}
            className='rounded bg-palette_blue text-palette_white py-1 px-2'
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}

function IMStatus({ iM }: { iM: IM }) {
  const iMStatus = useIMStatus({ id: iM.id });
  return <>{iMStatus}</>;
}

// FilterSelector.tsx
// import React, { ChangeEventHandler, useState } from 'react';

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
      <select onChange={handleFieldChange}>
        <option value=''>Select field</option>
        <option value='title'>Title</option>
        <option value='userName'>User Name</option>
        <option value='departmentName'>Department Name</option>
        <option value='collegeName'>College Name</option>
      </select>
      <input
        type='text'
        placeholder='Search'
        value={filterValue}
        className='bg-inherit border-b'
        onChange={handleValueChange}
      />
    </div>
  );
}

interface SortSelectorProps {
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}
function SortSelector({ onSortChange }: SortSelectorProps) {
  const [selectedField, setSelectedField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      <select onChange={handleFieldChange} value={selectedField}>
        <option value='title'>Title</option>
        <option value='createdAt'>Date Created</option>
        <option value='userName'>User Name</option>
        <option value='departmentName'>Department Name</option>
        <option value='collegeName'>College Name</option>
      </select>
      <select onChange={handleDirectionChange} value={sortDirection}>
        <option value='asc'>Ascending</option>
        <option value='desc'>Descending</option>
      </select>
    </div>
  );
}

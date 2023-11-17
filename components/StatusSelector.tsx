import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function StatusSelector(props?: FieldInputProps<any>) {
  const statuses = [
    "IMPLEMENTATION_DRAFT",
    "IMPLEMENTATION_DEPARTMENT_REVIEW",
    "IMPLEMENTATION_DEPARTMENT_REVIEWED",
    "IMPLEMENTATION_DEPARTMENT_REVISED",
    "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
    "IMPLEMENTATION_CITL_REVIEWED",
    "IMPLEMENTATION_CITL_REVISED",
    "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
    "IMERC_QAMIS_REVISED",
    "IMERC_QAMIS_DEPARTMENT_ENDORSED",
    "IMERC_CITL_REVIEWED",
    "IMERC_CITL_REVISED",
    "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
    "IMERC_CITL_DIRECTOR_ENDORSED",
  ];
  const [state, setState] = useState<string[]>(statuses);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setState(
      statuses.filter((status) =>
        status.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="flex">
      <input type='text' placeholder='Search Status' onChange={handleSearch} className="rounded-s p-1" />
      <select {...props} className="rounded-e py-1">
        <option value=''>Select</option>
        {state?.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </div>
  );
}

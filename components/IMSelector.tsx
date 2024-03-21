import useIMs from "@/hooks/useIMs";
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  SelectHTMLAttributes,
  useState,
} from "react";

export default function IMSelector(
  props: DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  const [state, setState] = useState({
    name: "",
  });
  const { iMs, count } = useIMs({
    skip: 0,
    take: 10,
    filter: state,
  });

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  return (
    <div>
      <input type="text" onChange={onSearch} placeholder="IM search" />
      <select {...props}>
        <option value="">Select</option>
        {iMs.map((iM) => {
          return (
            <option key={iM.id} value={iM.id}>
              {iM.title}
            </option>
          );
        })}
      </select>
    </div>
  );
}

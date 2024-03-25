import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface ReviewItemProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  question: string;
  checkedValue?: string;
}

export default function ReviewItem({
  question,
  checkedValue = "",
  ...props
}: ReviewItemProps) {
  const ratings: {
    label: string;
    value: string;
  }[] = [
    { label: "Very Much", value: "VM" },
    { label: "Much", value: "M" },
    { label: "Just Enough", value: "JE" },
    { label: "Not Much", value: "NM" },
    { label: "Not At All", value: "NAA" },
  ];

  return (
    <div className="text-sm overflow-auto">
      <p className="text-palette_grey">{question}</p>
      <div className="mt-2 flex flex-col xl:flex-row">
        {ratings.map((rating, index) => (
          <label
            key={rating.label}
            className={`bg-palette_white bg-opacity-40 px-2 flex-1 border border-palette_grey border-opacity-10 ${
              index === 0 ? "rounded-s" : ""
            } ${
              index === ratings.length - 1 ? "rounded-e" : ""
            } flex items-center justify-start py-2 w-full cursor-pointer`}
          >
            <input
              {...props}
              className="form-radio text-palette_blue active:ring-palette_blue focus:ring-palette_blue"
              type="radio"
              value={rating.value}
              defaultChecked={checkedValue === rating.value}
            />
            <span className="ml-2 text-palette_grey text-xs whitespace-nowrap">
              {rating.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface ReviewItemProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  question: string;
}

export default function ReviewItem({ question, ...props }: ReviewItemProps) {
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
    <div className='text-sm'>
      <p className='text-palette_grey'>{question}</p>
      <div className='mt-2 flex'>
        {ratings.map((rating, index) => (
          <label
            className={`bg-palette_white bg-opacity-40 px-2 flex-1 border border-palette_grey border-opacity-10 ${
              index === 0 ? "rounded-s" : ""
            } ${
              index === ratings.length - 1 ? "rounded-e" : ""
            } flex items-center justify-start py-2 w-full cursor-pointer`}
          >
            <input
              {...props}
              className='form-radio text-palette_blue active:ring-palette_blue focus:ring-palette_blue'
              type='radio'
              value={rating.value}
            />
            <span className='ml-2 text-palette_grey text-xs'>
              {rating.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

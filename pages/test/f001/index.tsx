import F001 from "@/components/forms/F001";
import Link from "next/link";

export default function F001Page() {
  return (
    <div className="flex items-center justify-center font-serif">
      <F001
        title="Process of Teaching Physical Education and Health"
        authors="John Bryan Pit M. Acaso"
        courseCode="BPED 8"
        semester={1}
        syStart={2023}
        syEnd={2024}
      />
    </div>
  );
}

import ReviewItem from "@/components/ReviewItem";
import ReviewQuestions from "@/services/ReviewQuestions";
import { useState } from "react";

export default function TestPage() {
  const [state, setState] = useState({ isOpen: false });

  return (
    <div className="m-10">
      <ReviewItem question={ReviewQuestions.q1_1} />
    </div>
  );
}

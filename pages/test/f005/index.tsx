import F004 from "@/components/forms/F004";
import F005 from "@/components/forms/F005";
import Link from "next/link";

export default function F004Page() {
  return (
    <div className="flex items-center justify-center">
      <F005
        date={new Date("January 23, 2024")}
        evaluatorName="John Bryan Pit M. Acaso"
        improveA="I think this."
        improveB="And this."
        likeA="I like this."
        likeB="And this."
        questions={{
          q1_1: 1,
          q1_2: 2,
          q1_3: 3,
          q2_1: 4,
          q2_2: 5,
          q2_3: 1,
          q2_4: 2,
          q2_5: 3,
          q2_6: 4,
          q2_7: 5,
          q3_1: 1,
          q3_2: 2,
          q3_3: 3,
          q3_4: 4,
          q3_5: 5,
          q3_6: 1,
          q3_7: 2,
          q4_1: 3,
          q4_2: 4,
          q4_3: 5,
        }}
      />
    </div>
  );
}

import F004 from "@/components/forms/F004";

export default function F004Page() {
  return (
    <div className="flex items-center justify-center">
      <F004
        questions={{
          q1: 1,
          q2: 2,
          q3: 3,
          q4: 4,
          q5: 1,
          q6: 2,
          q7: 3,
          q8: 4,
          q9: 1,
          q10: 2,
          q11: 3,
          q12: 4,
          q13: 1,
          q14: 2,
          q15: 3,
          q16: 4,
          q17: 1,
          q18: 2,
        }}
        evaluatorName="John Bryan Pit M. Acaso"
        date={new Date("January 23, 2024")}
        improveA="I think this."
        improveB="And this."
        likeA="I like this."
        likeB="And this."
      />
    </div>
  );
}

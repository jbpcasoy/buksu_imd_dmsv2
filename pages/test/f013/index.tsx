import F013 from "@/components/forms/F013";

export default function F013Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <F013
        iMTitle="Process of Teaching Physical Education and Health"
        author="John Bryan Pit M. Acaso"
        iMType="Module"
        questions={{
          q1_1: 1,
          q1_2: 2,
          q2_1: 3,
          q2_2: 4,
          q2_3: 5,
          q2_4: 1,
          q3_1: 2,
          q4_1: 3,
          q4_2: 4,
          q4_3: 5,
          q5_1: 1,
          q5_2: 2,
          q5_3: 3,
          q6_1: 4,
          q6_2: 5,
          q6_3: 1,
          q6_4: 2,
          q6_5: 3,
          q7_1: 4,
          q7_2: 5,
          q7_3: 1,
          q7_4: 2,
          q7_5: 3,
          q8_1: 4,
          q8_2: 5,
          q8_3: 1,
        }}
        chairpersonName="Glenmark T. Artiaga"
        coordinatorName="Airys Prill C. Gorra"
        peerName="Keano Lyrens Jimeno"
      />
    </div>
  );
}

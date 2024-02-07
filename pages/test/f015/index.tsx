import F015 from "@/components/forms/F015";

export default function F015Page() {
  return (
    <div className="flex justify-center items-center">
      <F015
        iMTitle="Process of Teaching Physical Education and Health"
        program="Bachelor of Education Major in Physical Education"
        author="John Bryan Pit M. Acaso"
        qAMISReviews={[
          {
            actionTaken: "I did this.",
            actionTakenPage: "Introduction Page 1",
            suggestion: "Do this.",
            suggestionPage: "Introduction Page 1",
            remarks: "Important Suggestion",
          },
        ]}
        iMERCReviews={[
          {
            actionTaken: "I did this.",
            actionTakenPage: "Introduction Page 1",
            suggestion: "Do this.",
            suggestionPage: "Introduction Page 1",
            remarks: "Important Suggestion",
          },
        ]}
        coordinatorName="Glenmark T. Artiaga"
        iDDCoordinatorName="Marixelle R. Inovejas"
      />
    </div>
  );
}

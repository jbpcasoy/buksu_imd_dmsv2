import F012 from "@/components/forms/F012";

export default function F012Page() {
  return (
    <div className="flex items-center justify-center">
      <F012
        iMTitle="Process of Teaching Physical Education and Health"
        author="John Bryan Pit M. Acaso"
        iMType="Module"
        department="Physical Education Department"
        college="College of Education"
        usage="1st sem only"
        courseCode="BPED 8"
        courseName="Process of Teaching Physical Education and Health"
        havePermission={true}
        programRequire={false}
        programCommit={true}
        programPromote={false}
        semesters={2}
        applicantName="John Bryan Pit M. Acaso"
        requestDate={new Date("January 25, 2024")}
        coordinatorName="Glenmark T. Artiaga"
        coordinatorDate={new Date("January 26, 2024")}
        chairpersonName="Keano Lehryns Hynson Jimeno"
        chairpersonDate={new Date("January 26, 2024")}
        deanName="Airys Prill C. Gorra"
        deanDate={new Date("January 27, 2024")}
      />
    </div>
  );
}

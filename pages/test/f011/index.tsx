import F011 from "@/components/forms/F011";
import Link from "next/link";

export default function F011Page() {
  return (
    <div className="flex items-center justify-center">
      <F011
        applicantName="John Bryan Pit M. Acaso"
        iMTitle="Process of Teaching Physical Education and Health"
        iMType="Module"
        courseCode="BPED 8"
        courseName="Process of Teaching Physical Education and Health"
        usage="1st sem only"
        haveStudentEvaluation={false}
        coordinatorName="Glenmark T. Artiaga"
        chairpersonName="Keano Lehryns Hynson Jimeno"
        deanName="Airys Prill C. Gorra"
        receiveDate={new Date("January 25, 2024")}
        hasHardCopy={true}
        hasSoftCopy={true}
        iDDCoordinatorName="Marixelle R.  Inovejas"
      />
    </div>
  );
}

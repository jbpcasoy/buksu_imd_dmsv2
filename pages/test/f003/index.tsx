import F003 from "@/components/forms/F003";

export default function F003Page() {
  return (
    <div className="flex items-center justify-center">
      <F003
        programReview={[
          {
            suggestion: "Change this please.",
            actionTaken: "Changed it",
            pageNumber: 1,
            remarks: "None so far.",
          },
        ]}
        coordinatorName="Glenmark T. Artiaga"
        cITLReview={[
          {
            suggestion: "Change this please from CITL.",
            actionTaken: "Changed it",
            pageNumber: 1,
            remarks: "None so far.",
          },
        ]}
        cITLDirectorName="Cecille Marie T. Improgo"
        iDDCoordinatorName="Marixelle R.  Inovejas"
        vPAAName="Hazel Jean M. Abeuela"
      />
    </div>
  );
}

import MainLayout from "@/components/MainLayout";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveFaculty from "@/hooks/useActiveFaculty";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NonActive() {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();

  const activeFaculty = useActiveFacultyMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();

  useEffect(() => {
    if (activeFaculty || activeCITLDirector || activeIDDCoordinator) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFaculty, activeCITLDirector, activeIDDCoordinator]);

  return (
    <MainLayout>
      <div>
        {!activeFaculty && (
          <div>
            <p>
              Welcome, you are not yet assigned as a faculty. Please be patient
              while the admin sets your roles.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

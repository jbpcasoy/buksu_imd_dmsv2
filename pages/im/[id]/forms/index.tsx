import MainLayout from "@/components/MainLayout";
import F001 from "@/components/forms/F001";
import F003 from "@/components/forms/F003";
import F004 from "@/components/forms/F004";
import F005 from "@/components/forms/F005";
import F011 from "@/components/forms/F011";
import F012 from "@/components/forms/F012";
import F013 from "@/components/forms/F013";
import F014 from "@/components/forms/F014";
import F015 from "@/components/forms/F015";
import useF001 from "@/hooks/useF001";
import useF003 from "@/hooks/useF003";
import useF004 from "@/hooks/useF004";
import useF005 from "@/hooks/useF005";
import useF011 from "@/hooks/useF011";
import useF012 from "@/hooks/useF012";
import useF013 from "@/hooks/useF013";
import useF014 from "@/hooks/useF014";
import useF015 from "@/hooks/useF015";
import { useRouter } from "next/router";

export default function FormsPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const f001 = useF001({ iMId: iMId as string });
  const f003 = useF003({ iMId: iMId as string });
  const f004 = useF004({ iMId: iMId as string });
  const f005 = useF005({ iMId: iMId as string });
  const f011 = useF011({ iMId: iMId as string });
  const f012 = useF012({ iMId: iMId as string });
  const f013 = useF013({ iMId: iMId as string });
  const f014 = useF014({ iMId: iMId as string });
  const f015 = useF015({ iMId: iMId as string });

  return (
    <MainLayout>
      <div className="flex flex-col">{f001 && <F001 {...f001} />}</div>
      <div className="flex flex-col">{f003 && <F003 {...f003} />}</div>
      <div className="flex flex-col">{f004 && <F004 {...f004} />}</div>
      <div className="flex flex-col">{f005 && <F005 {...f005} />}</div>
      <div className="flex flex-col">{f011 && <F011 {...f011} />}</div>
      <div className="flex flex-col">{f012 && <F012 {...f012} />}</div>
      <div className="flex flex-col">{f013 && <F013 {...f013} />}</div>
      <div className="flex flex-col">{f014 && <F014 {...f014} />}</div>
      <div className="flex flex-col">{f015 && <F015 {...f015} />}</div>
    </MainLayout>
  );
}

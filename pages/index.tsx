import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true
  });

  useEffect(() => {
    console.log({ session });
  }, [session]);

  return <h1 className='text-lg'>Hello</h1>;
}

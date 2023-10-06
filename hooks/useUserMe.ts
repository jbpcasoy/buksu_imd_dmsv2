import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function useUserMe(): User {
    const {data: session} = useSession({required: true});

    return session?.user as User;
}
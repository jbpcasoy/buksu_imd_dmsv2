import { NotificationRead } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useNotificationReadMeParams {
  id: string;
}
export default function useNotificationReadMe({
  id,
}: useNotificationReadMeParams) {
  const [state, setState] = useState<NotificationRead | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/notification_read/event/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}

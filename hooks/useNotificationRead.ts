import { NotificationRead } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useNotificationReadParams {
  id: string;
}
export default function useNotificationRead({ id }: useNotificationReadParams) {
  const [state, setState] = useState<NotificationRead | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/notification_read/${id}`)
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

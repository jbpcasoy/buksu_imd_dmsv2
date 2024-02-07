import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddNotificationReadPage() {
  const formik = useFormik({
    initialValues: {
      eventId: "",
    },
    validationSchema: Yup.object({
        eventId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/notification_read", values)
        .then(() => {
          alert("NotificationRead has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add NotificationRead</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='eventId'
          {...formik.getFieldProps("eventId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}

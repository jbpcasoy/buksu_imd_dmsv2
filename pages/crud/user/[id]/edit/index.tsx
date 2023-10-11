import CrudLayout from "@/components/CrudLayout";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditUserPage() {
  const router = useRouter();
  const userId = router.query.id;
  const user = useUser({id: userId as string})

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/user/${userId}`, values)
        .then(() => {
          alert("User updated successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  
  useEffect(() => {
    if(!user) return;
    let subscribe = true;
    
    formik.setValues({
      name: user.name ?? ""
    })

    return () => {
      subscribe = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])


  return (
    <CrudLayout>
      <h2>Edit User</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='name'
          {...formik.getFieldProps("name")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}

import FileUpload from "@/components/FileUpload";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import QAMISSuggestionItem from "@/components/QAMISSuggestionItem";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useIM from "@/hooks/useIM";
import useQAMISSuggestionItemsOwn, {
  useQAMISSuggestionItemsOwnParams,
} from "@/hooks/useQAMISSuggestionItemsOwn";
import useQAMISSuggestionMe from "@/hooks/useQAMISSuggestionMe";
import useSubmittedQAMISSuggestionIM from "@/hooks/useSubmittedQAMISSuggestionIM";
import { QAMISSuggestion, SubmittedQAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import * as Yup from "yup";

export default function QAMISSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const activeFaculty = useActiveFacultyMe();
  const iM = useIM({ id: iMId as string });
  const qAMISSuggestion = useQAMISSuggestionMe({
    id: iMId as string,
  });
  const submittedQAMISSuggestion = useSubmittedQAMISSuggestionIM({
    id: iMId as string,
  });

  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iMId as string,
  });
  const [state, setState] = useState<useQAMISSuggestionItemsOwnParams>({
    skip: 0,
    take: 999,
  });
  const qAMISSuggestionItems = useQAMISSuggestionItemsOwn(state);
  const [files, setFiles] = useState<{ iMFile?: File; qAMISFile?: File }>({
    iMFile: undefined,
    qAMISFile: undefined,
  });
  useEffect(() => {
    console.log({ files });
  }, [files]);

  const uploadFiles = async (submittedQAMISSuggestionId: string) => {
    console.log({ state });
    if (!files?.iMFile || !files?.qAMISFile) return;

    const iMFormData = new FormData();
    iMFormData.append("file", files.iMFile);
    iMFormData.append("iMId", iMId as string);
    return axios.post("/api/im_file", iMFormData).then((res) => {
      const iMFile = res.data;
      if (!files?.qAMISFile) return;

      const qAMISFormData = new FormData();
      qAMISFormData.append("file", files.qAMISFile);
      qAMISFormData.append(
        "submittedQAMISSuggestionId",
        submittedQAMISSuggestionId as string
      );
      return axios.post("/api/qamis_file", qAMISFormData).then((res) => {
        const qAMISFile = res.data;
        return axios.post("/api/qamis_revision", {
          iMFileId: iMFile.id,
          qAMISFileId: qAMISFile.id,
        });
      });
    });
  };

  const handleSubmitSuggestion = () => {
    if (!qAMISSuggestion || !files?.iMFile || !files?.qAMISFile) return;

    axios
      .post<SubmittedQAMISSuggestion>(`/api/submitted_qamis_suggestion`, {
        qAMISSuggestionId: qAMISSuggestion.id,
      })
      .then((res) => {
        const submittedQAMISSuggestion = res.data;
        uploadFiles(submittedQAMISSuggestion.id).then(() => {
          alert("IM has been submitted for review");
          router.push(`/im/${iMId}`);
        });
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!qAMISSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: qAMISSuggestion.id,
    }));
  }, [qAMISSuggestion]);

  useEffect(() => {
    if (submittedQAMISSuggestion) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQAMISSuggestion, iMId]);

  const AddSuggestionItem = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const formik = useFormik({
      initialValues: {
        suggestion: "",
        actionTaken: "",
        remarks: "",
        pageNumber: 0,
      },
      validationSchema: Yup.object({
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().required(),
        remarks: Yup.string(),
        pageNumber: Yup.number().min(0).required(),
      }),
      onSubmit: (values) => {
        const submitSuggestionItem = async (qAMISSuggestionId: string) => {
          return axios
            .post(`/api/qamis_suggestion_item`, {
              ...values,
              qAMISSuggestionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!qAMISSuggestion) {
          if (!cITLDirectorEndorsement) {
            return;
          }
          return axios
            .post<QAMISSuggestion>(`/api/qamis_suggestion/`, {
              cITLDirectorEndorsementId: cITLDirectorEndorsement.id,
            })
            .then((res) => {
              const createdQAMISSuggestion = res.data;

              return submitSuggestionItem(createdQAMISSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(qAMISSuggestion.id);
        }
      },
    });

    return (
      <>
        <button
          className='bg-palette_blue text-palette_white px-2 py-1 rounded'
          onClick={() => setOpenAdd(true)}
        >
          Add
        </button>
        {openAdd && (
          <Modal title='Add Suggestion' onClose={() => setOpenAdd(false)}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='flex flex-col space-y-1'>
                <textarea
                  placeholder='Suggestion'
                  {...formik.getFieldProps("suggestion")}
                  className='rounded'
                />
                <textarea
                  placeholder='Action Taken'
                  {...formik.getFieldProps("actionTaken")}
                  className='rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='rounded'
                />
                <textarea
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
                  className='rounded'
                />
                <input
                  type='submit'
                  value='Submit'
                  className='bg-palette_blue text-palette_white py-1 rounded'
                />
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  };

  return (
    <MainLayout>
      <div className='flex space-x-1 h-full overflow-auto'>
        <div className='space-y-1 flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  QAMIS
                </span>
              </h2>
              <p className='text-sm'>IMERC Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-x-1 p-1'>
            <div>
              <table className='w-full text-sm'>
                <caption>QAMIS Suggestions</caption>
                <thead>
                  <tr>
                    <th>SUGGESTION</th>
                    <th>PAGE NUMBER</th>
                    <th>ACTION TAKEN</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {qAMISSuggestionItems.qAMISSuggestionItems.map(
                    (qAMISSuggestionItem) => {
                      return (
                        <QAMISSuggestionItem
                          qAMISSuggestionItem={qAMISSuggestionItem}
                          key={qAMISSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <div className='flex flex-col space-x-1'>
              <FileUpload
                label='UPLOAD QAMIS FILE'
                onFileChange={(e) => {
                  setFiles((prev) => ({
                    ...prev,
                    iMFile: e.target.files?.item(0) as File,
                  }));
                }}
                onFileReset={() => {
                  setState((prev) => ({
                    ...prev,
                    iMFile: undefined,
                  }));
                }}
              />
              <FileUpload
                label='UPLOAD IM FILE'
                onFileChange={(e) => {
                  setFiles((prev) => ({
                    ...prev,
                    qAMISFile: e.target.files?.item(0) as File,
                  }));
                }}
                onFileReset={() => {
                  setState((prev) => ({
                    ...prev,
                    qAMISFile: undefined,
                  }));
                }}
              />
            </div>
            <button
              className='rounded bg-palette_blue text-palette_white px-2 py-1'
              onClick={handleSubmitSuggestion}
            >
              Submit for endorsement
            </button>
          </div>
        </div>
        <div className='flex-1'>
          <iframe
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}

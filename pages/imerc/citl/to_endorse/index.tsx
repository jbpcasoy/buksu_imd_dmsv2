import MainLayout from "@/components/MainLayout";
import useIMERCCITLToEndorse from "@/hooks/useIMERCCITLToEndorse";
import Link from "next/link";
import { useState } from "react";

export default function ToEndorsePage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
  });

  const { iMs, count } = useIMERCCITLToEndorse(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      console.log({ prev, nextVal });

      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <MainLayout>
      <div className='flex'>
        <h2 className='flex-1'>To Endorse</h2>
      </div>
      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>facultyId</th>
            <th>title</th>
            <th>type</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {iMs.map((iM) => {
            return (
              <tr key={iM.id}>
                <td>{iM.id}</td>
                <td>{new Date(iM.createdAt).toLocaleString()}</td>
                <td>{new Date(iM.updatedAt).toLocaleString()}</td>
                <td>{iM.facultyId}</td>
                <td>{iM.title}</td>
                <td>{iM.type}</td>
                <td>
                  <Link href={`/im/${iM.id}`} className='border rounded'>
                    view
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <button className='border rounded' onClick={previousHandler}>
          prev
        </button>
        <button className='border rounded' onClick={nextHandler}>
          next
        </button>
      </div>
    </MainLayout>
  );
}

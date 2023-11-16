import Modal from "@/components/Modal";
import { useState } from "react";

export default function TestPage() {
  const [state, setState] = useState({ isOpen: false });

  return (
    <div>
      <button onClick={() => setState({ isOpen: true })}>Open Modal</button>
      {state.isOpen && (
        <Modal
          onClose={() => setState({ isOpen: false })}
          title='Test'
          content={<p>Content</p>}
        />
      )}
    </div>
  );
}

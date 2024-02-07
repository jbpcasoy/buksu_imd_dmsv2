import MainLayout from "@/components/MainLayout";
import Error from "next/error";
import { useState } from "react";
import ReactFlow, { Controls, Background, Node } from "reactflow";

export default function TestPage() {
  if (process.env.NODE_ENV === "production") {
    return <Error statusCode={404} />;
  }
  return (
    <MainLayout>
      <iframe
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FkputkulJppAhK2iTMbOpHt%2FBukSU-IMD-DMS%3Ftype%3Dwhiteboard%26node-id%3D0%253A1%26t%3DaN11OchXmskVQSAw-1"
        allowFullScreen
      ></iframe>
    </MainLayout>
  );
}

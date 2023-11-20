import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import ReactFlow, { Controls, Background, Node } from "reactflow";

export default function TestPage() {
  const [state, setState] = useState({ isOpen: false });
  const nodes: Node<any, string | undefined>[] = [
    {
      id: "1",
      data: { label: "Draft" },
      position: { x: 300, y: 10 },
    },
    {
      id: "2_1",
      data: { label: "Peer Review" },
      position: { x: 100, y: 100 },
    },
    {
      id: "2_2",
      data: { label: "Chairperson Review" },
      position: { x: 300, y: 100 },
    },
    {
      id: "2_3",
      data: { label: "Coordinator Review" },
      position: { x: 500, y: 100 },
    },
    {
      id: "3",
      data: { label: "Revision" },
      position: { x: 300, y: 200 },
    },
    {
      id: "4",
      data: { label: "Coordinator Endorsement" },
      position: { x: 300, y: 300 },
    },
    {
      id: "5",
      data: { label: "Dean Endorsement" },
      position: { x: 300, y: 400 },
    },
    {
      id: "6",
      data: { label: "IDD Coordinator Review" },
      position: { x: 300, y: 500 },
    },
    {
      id: "7",
      data: { label: "Revision" },
      position: { x: 300, y: 600 },
    },
    {
      id: "8",
      data: { label: "IDD Coordinator Endorsement" },
      position: { x: 300, y: 700 },
    },
    {
      id: "9",
      data: { label: "CITL Director Endorsement" },
      position: { x: 300, y: 800 },
    },
    {
      id: "10",
      data: { label: "CITL Director Endorsement" },
      position: { x: 300, y: 900 },
    },
    {
      id: "11",
      data: { label: "Try-out" },
      position: { x: 300, y: 1000 },
    },
    {
      id: "12",
      data: { label: "Revision" },
      position: { x: 300, y: 1100 },
    },
    {
      id: "13_1",
      data: { label: "Chairperson Endorsement" },
      position: { x: 100, y: 1200 },
    },
    {
      id: "13_2",
      data: { label: "Coordinator Endorsement" },
      position: { x: 300, y: 1200 },
    },
    {
      id: "13_3",
      data: { label: "Dean Endorsement" },
      position: { x: 500, y: 1200 },
    },
    {
      id: "14",
      data: { label: "Department Endorsement" },
      position: { x: 300, y: 1300 },
    },
    {
      id: "15_1",
      data: { label: "Content Specialist Review" },
      position: { x: 100, y: 1400 },
    },
    {
      id: "15_2",
      data: { label: "IDD Specialist Review" },
      position: { x: 300, y: 1400 },
    },
    {
      id: "15_3",
      data: { label: "Content Editor Review" },
      position: { x: 500, y: 1400 },
    },
    {
      id: "16",
      data: { label: "Revision" },
      position: { x: 300, y: 1500 },
    },
    {
      id: "17",
      data: { label: "IDD Coordinator Endorsement" },
      position: { x: 300, y: 1600 },
    },
    {
      id: "18",
      data: { label: "CITL Director Endorsement" },
      position: { x: 300, y: 1700 },
    },
  ];

  const edges = [
    {
      id: "1-2_1",
      source: "1",
      target: "2_1",
    },
    {
      id: "1-2_2",
      source: "1",
      target: "2_2",
    },
    {
      id: "1-2_3",
      source: "1",
      target: "2_3",
    },
    {
      id: "2_1-3",
      source: "2_1",
      target: "3",
    },
    {
      id: "2_2-3",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_2-3",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_3-3",
      source: "2_3",
      target: "3",
    },
    {
      id: "3-4",
      source: "3",
      target: "4",
    },
    {
      id: "4-5",
      source: "4",
      target: "5",
    },
    {
      id: "5-6",
      source: "5",
      target: "6",
    },
    {
      id: "6-7",
      source: "6",
      target: "7",
    },
    {
      id: "7-8",
      source: "7",
      target: "8",
    },
    {
      id: "8-9",
      source: "8",
      target: "9",
    },
    {
      id: "9-10",
      source: "9",
      target: "10",
    },
    {
      id: "10-11",
      source: "10",
      target: "11",
    },
    {
      id: "11-12",
      source: "11",
      target: "12",
    },
    {
      id: "12-13_1",
      source: "12",
      target: "13_1",
    },
    {
      id: "12-13_2",
      source: "12",
      target: "13_2",
    },
    {
      id: "12-13_3",
      source: "12",
      target: "13_3",
    },
    {
      id: "13_1-14",
      source: "13_1",
      target: "14",
    },
    {
      id: "13_2-14",
      source: "13_2",
      target: "14",
    },
    {
      id: "13_3-14",
      source: "13_3",
      target: "14",
    },
    {
      id: "14-15_1",
      source: "14",
      target: "15_1",
    },
    {
      id: "14-15_2",
      source: "14",
      target: "15_2",
    },
    {
      id: "14-15_3",
      source: "14",
      target: "15_3",
    },
    {
      id: "15_1-16",
      source: "15_1",
      target: "16",
    },
    {
      id: "15_2-16",
      source: "15_2",
      target: "16",
    },
    {
      id: "15_3-16",
      source: "15_3",
      target: "16",
    },
    {
      id: "16-17",
      source: "16",
      target: "17",
    },
    {
      id: "17-18",
      source: "17",
      target: "18",
    },
  ];

  return (
    <MainLayout>
      <div className='h-full w-full mr-50'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      {/* <div className="h-4 w-full -mt-4 bg-palette_white z-50 relative"></div> */}
    </MainLayout>
  );
}

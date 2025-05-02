// OrgChartSmoothFull.tsx
"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  ConnectionLineType,
  Handle,
  Position,
  type Node,
  type Edge,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";

// ——— Department colors ———
const departmentColors: Record<string, { bg: string; border: string }> = {
  Executive:   { bg: "#4f46e5", border: "#3730a3" },
  Engineering: { bg: "#0891b2", border: "#065d8c" },
  Marketing:   { bg: "#16a34a", border: "#14532d" },
  Sales:       { bg: "#ea580c", border: "#9a3412" },
  HR:          { bg: "#d946ef", border: "#86198f" },
  Finance:     { bg: "#f59e0b", border: "#b45309" },
  Operations:  { bg: "#6366f1", border: "#4338ca" },
  "Customer Support": { bg: "#ec4899", border: "#be185d" },
};

// ——— Custom node w/ top & bottom handles ———
const EmployeeNode = ({ data }: { data: any }) => {
  const { name, role, department, directReports, onClick } = data;
  const colors = departmentColors[department] || departmentColors.Executive;

  return (
    <div
      onClick={onClick}
      className="relative px-4 py-3 rounded-md border shadow-md cursor-pointer"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        width: 220,
      }}
    >
      {/* incoming */}
      <Handle type="target" position={Position.Top} style={{ background: "#555" }} />

      <div className="font-semibold text-white">{name}</div>
      <div className="text-sm text-white mt-1">{role}</div>
      <div className="text-xs text-white opacity-80 mt-1">{department}</div>
      <div className="text-xs text-white opacity-80 mt-2">
        {directReports.length} direct report{directReports.length !== 1 ? "s" : ""}
      </div>

      {/* outgoing */}
      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
    </div>
  );
};

const nodeTypes = { employee: EmployeeNode };
const edgeType = "smoothstep";

const position = { x: 0, y: 0 };
// ——— All 32 employees (no manual positions) ———
const rawNodes: Node[] = [
  { id: "1", type: "employee", data: { name: "Sarah Johnson",        role: "Chief Executive Officer", department: "Executive",       directReports: ["2","3","4","5","6","25"], onClick: () => null }, position },
  { id: "2", type: "employee", data: { name: "Michael Chen",         role: "Chief Technology Officer", department: "Engineering",     directReports: ["7"],       onClick: () => null }, position },
  { id: "3", type: "employee", data: { name: "Jessica Williams",     role: "Chief Marketing Officer",  department: "Marketing",       directReports: ["17"],      onClick: () => null }, position },
  { id: "4", type: "employee", data: { name: "David Rodriguez",      role: "Chief Sales Officer",      department: "Sales",           directReports: ["22"],      onClick: () => null }, position },
  { id: "5", type: "employee", data: { name: "Emily Taylor",         role: "Chief Financial Officer",  department: "Finance",         directReports: ["27"],      onClick: () => null }, position },
  { id: "6", type: "employee", data: { name: "Robert Kim",           role: "Chief Operations Officer", department: "Operations",      directReports: ["29","31"], onClick: () => null }, position },
  { id: "7", type: "employee", data: { name: "Priya Patel",          role: "VP of Engineering",        department: "Engineering",     directReports: ["8","9","12"],onClick: () => null }, position },
  { id: "8", type: "employee", data: { name: "James Wilson",         role: "Frontend Director",        department: "Engineering",     directReports: ["10"],      onClick: () => null }, position    },
  { id: "9", type: "employee", data: { name: "Sophia Garcia",        role: "Backend Director",         department: "Engineering",     directReports: ["11"],      onClick: () => null }, position    },
  { id: "10", type: "employee", data:{ name: "Alex Johnson",        role: "Frontend Lead",           department: "Engineering",     directReports: ["13","14"], onClick: () => null }, position },
  { id: "11", type: "employee", data:{ name: "Olivia Martinez",     role: "Backend Lead",            department: "Engineering",     directReports: ["15","16"], onClick: () => null }, position },
  { id: "12", type: "employee", data:{ name: "Daniel Lee",          role: "DevOps Lead",             department: "Engineering",     directReports: [],         onClick: () => null }, position },
  { id: "13", type: "employee", data:{ name: "Emma Thompson",       role: "Frontend Developer",      department: "Engineering",     directReports: [],         onClick: () => null }, position },
  { id: "14", type: "employee", data:{ name: "Noah Clark",          role: "Frontend Developer",      department: "Engineering",     directReports: [],         onClick: () => null }, position },
  { id: "15", type: "employee", data:{ name: "Ava Robinson",        role: "Backend Developer",       department: "Engineering",     directReports: [],         onClick: () => null }, position },
  { id: "16", type: "employee", data:{ name: "Liam Wright",         role: "Backend Developer",       department: "Engineering",     directReports: [],         onClick: () => null }, position },
  { id: "17", type: "employee", data:{ name: "Natalie Brown",       role: "VP of Marketing",         department: "Marketing",       directReports: ["18","19"],onClick: () => null }, position },
  { id: "18", type: "employee", data:{ name: "Benjamin Scott",      role: "Content Director",        department: "Marketing",       directReports: ["20"],      onClick: () => null }, position },
  { id: "19", type: "employee", data:{ name: "Zoe Adams",           role: "Social Media Director",   department: "Marketing",       directReports: ["21"],      onClick: () => null }, position },
  { id: "20", type: "employee", data:{ name: "Lucas Evans",         role: "Content Manager",         department: "Marketing",       directReports: [],         onClick: () => null }, position },
  { id: "21", type: "employee", data:{ name: "Mia Nelson",          role: "Social Media Manager",    department: "Marketing",       directReports: [],         onClick: () => null }, position },
  { id: "22", type: "employee", data:{ name: "Ethan Parker",        role: "VP of Sales",            department: "Sales",           directReports: ["23"],      onClick: () => null }, position },
  { id: "23", type: "employee", data:{ name: "Isabella Cooper",     role: "Regional Sales Director",department: "Sales",           directReports: ["24"],      onClick: () => null }, position },
  { id: "24", type: "employee", data:{ name: "William Turner",      role: "Account Executive",      department: "Sales",           directReports: [],         onClick: () => null }, position },
  { id: "25", type: "employee", data:{ name: "Charlotte Davis",     role: "HR Director",            department: "HR",              directReports: ["26"],      onClick: () => null }, position },
  { id: "26", type: "employee", data:{ name: "Henry Mitchell",      role: "Recruiting Manager",     department: "HR",              directReports: [],         onClick: () => null }, position },
  { id: "27", type: "employee", data:{ name: "Amelia White",        role: "Finance Director",       department: "Finance",         directReports: ["28"],      onClick: () => null }, position },
  { id: "28", type: "employee", data:{ name: "Sebastian Hall",      role: "Accounting Manager",     department: "Finance",         directReports: [],         onClick: () => null }, position },
  { id: "29", type: "employee", data:{ name: "Grace Lewis",         role: "Operations Director",    department: "Operations",      directReports: ["30"],      onClick: () => null }, position },
  { id: "30", type: "employee", data:{ name: "Jack Harris",         role: "Logistics Manager",      department: "Operations",      directReports: [],         onClick: () => null }, position },
  { id: "31", type: "employee", data:{ name: "Lily Martin",         role: "Customer Support Director",department: "Customer Support",directReports: ["32"],      onClick: () => null }, position },
  { id: "32", type: "employee", data:{ name: "Owen Phillips",       role: "Support Team Lead",      department: "Customer Support",directReports: [],         onClick: () => null }, position },
];

// ——— All reporting relationships (smoothstep, no arrows) ———
const rawEdges: Edge[] = [
  { id: "e1-2",  source: "1",  target: "2",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-3",  source: "1",  target: "3",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-4",  source: "1",  target: "4",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-5",  source: "1",  target: "5",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-6",  source: "1",  target: "6",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-25", source: "1",  target: "25", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e2-7",  source: "2",  target: "7",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e7-8",  source: "7",  target: "8",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e7-9",  source: "7",  target: "9",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e7-12", source: "7",  target: "12", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e8-10", source: "8",  target: "10", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e9-11", source: "9",  target: "11", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e10-13", source: "10", target: "13", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e10-14", source: "10", target: "14", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e11-15", source: "11", target: "15", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e11-16", source: "11", target: "16", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e3-17", source: "3",  target: "17", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e17-18",source: "17", target: "18", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e17-19",source: "17", target: "19", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e18-20",source: "18", target: "20", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e19-21",source: "19", target: "21", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e4-22", source: "4",  target: "22", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e22-23",source: "22", target: "23", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e23-24",source: "23", target: "24", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e25-26",source: "25", target: "26", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e5-27", source: "5",  target: "27", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e27-28",source: "27", target: "28", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e6-29", source: "6",  target: "29", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e29-30",source: "29", target: "30", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e6-31", source: "6",  target: "31", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e31-32",source: "31", target: "32", type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
];

// ——— Dagre layout helper ———
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction: "TB" | "LR" = "TB") {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 100, marginx: 20, marginy: 20 });
  nodes.forEach(n => dagreGraph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach(e => dagreGraph.setEdge(e.source, e.target));
  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map(n => {
      const { x, y } = dagreGraph.node(n.id);
      return { ...n, position: { x: x - NODE_WIDTH/2, y: y - NODE_HEIGHT/2 } };
    }),
    edges,
  };
}

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges, "TB");

// ——— Main component ———
export default function OrgChartSmoothFull() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // reuse smoothstep & styling on user-drawn
  const onConnect = useCallback(
    (params: any) =>
      setEdges(eds =>
        addEdge({ ...params, type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } }, eds)
      ),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "700px", background: "#F7F9FB" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

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
  type Connection
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";

// ——— Department colors ———
const departmentColors: Record<string, { bg: string; border: string }> = {
  Executive:   { bg: "#4f46e5", border: "#3730a3" },
  Ecommerce:   { bg: "#0891b2", border: "#065d8c" },
  Engineering: { bg: "#16a34a", border: "#14532d" },
  Marketing:   { bg: "#ea580c", border: "#9a3412" },
  HR:          { bg: "#d946ef", border: "#86198f" },
  Finance:     { bg: "#f59e0b", border: "#b45309" },
  Operations:  { bg: "#6366f1", border: "#4338ca" },
  Support:     { bg: "#f59e0b", border: "#f59e0b" },
  "Customer Support": { bg: "#ec4899", border: "#be185d" },
};

// Add an interface for the employee node data
interface EmployeeNodeData {
  name: string;
  role: string;
  department: string;
  directReports: string[];
  onClick: () => void;
}

// ——— Custom node w/ top & bottom handles ———
const EmployeeNode = ({ data }: { data: EmployeeNodeData }) => {
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
  { id: "1", type: "employee", data: { name: "Bren Crocker",        role: "IT Manager", department: "Executive",       directReports: ["2","3","4","6","7"], onClick: () => null }, position },
  { id: "2", type: "employee", data: { name: "Yani Santos",         role: "E-commerce UI/UX Designer Lead", department: "Ecommerce",     directReports: ["5","8"],       onClick: () => null }, position },
  { id: "3", type: "employee", data: { name: "Derek Fodeke-Rodgers",     role: "Full Stack Developer",  department: "Engineering",       directReports: [],      onClick: () => null }, position },
  { id: "4", type: "employee", data: { name: "Chandan Kumar",      role: "Full Stack Developer",      department: "Engineering",           directReports: [],      onClick: () => null }, position },
  { id: "5", type: "employee", data: { name: "Cindy Unrau",         role: "E-commerce Product & UX Coordinator",  department: "Ecommerce",         directReports: [],      onClick: () => null }, position },
  { id: "6", type: "employee", data: { name: "Raul Bernales",           role: "ERP Administrator", department: "Support",      directReports: [], onClick: () => null }, position },
  { id: "7", type: "employee", data: { name: "Level 1 (Baba)",          role: "IT Support Technician - Level 1",        department: "Support",     directReports: [],onClick: () => null }, position },
  { id: "8", type: "employee", data: { name: "Jr E-com",         role: "Junior E-commerce Coordinator",  department: "Ecommerce",         directReports: [],      onClick: () => null }, position },
  
  
 
];

// ——— All reporting relationships (smoothstep, no arrows) ———
const rawEdges: Edge[] = [
  { id: "e1-2",  source: "1",  target: "2",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-3",  source: "1",  target: "3",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-4",  source: "1",  target: "4",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e2-5",  source: "2",  target: "5",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e1-6",  source: "1",  target: "6",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },
  { id: "e2-8",  source: "2",  target: "8",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

  { id: "e1-7",  source: "1",  target: "7",  type: edgeType, animated: true, style: { stroke: "#555", strokeWidth: 2 } },

 
 
  
 

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
  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // reuse smoothstep & styling on user-drawn
  const onConnect = useCallback(
    (params: Connection) =>
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

// OrgChart.tsx
"use client";

import React, { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  ConnectionLineType,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
} from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import '@xyflow/react/dist/style.css'

interface User {
  id: string
  name: string
  department: string
  jobTitle?: string
  reportsToId?: string
  subordinates: { id: string }[]
}

interface OrgChartProps {
  users: User[] & {
    subordinates: User[]
  }
}

const departmentColors: Record<string, { bg: string; border: string }> = {
  Executive:   { bg: "#4f46e5", border: "#3730a3" },
  Engineering: { bg: "#0891b2", border: "#065d8c" },
  Marketing:   { bg: "#16a34a", border: "#14532d" },
  Sales:       { bg: "#ea580c", border: "#9a3412" },
  HR:          { bg: "#d946ef", border: "#86198f" },
  Finance:     { bg: "#f59e0b", border: "#b45309" },
  Operations:  { bg: "#6366f1", border: "#4338ca" },
  "Customer Support": { bg: "#ec4899", border: "#be185d" },
}

// Custom node  
const EmployeeNode = ({ data }: { data: any }) => {
  const { name, jobTitle, department, directReportsCount } = data
  const colors = departmentColors[department] || departmentColors.Executive

  return (
    <div
      className="relative px-4 py-3 rounded-md border shadow-md"
      style={{
        width: 200,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <div className="font-semibold text-white">{name}</div>
      <div className="text-xs text-white opacity-90">{jobTitle || ''}</div>
      <div className="text-xs text-white opacity-70">{department}</div>
      <div className="text-xs text-white opacity-70 mt-1">
        {directReportsCount} direct report{directReportsCount !== 1 ? 's' : ''}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  )
}

const nodeTypes = { employee: EmployeeNode }
const edgeType = 'smoothstep'

// Dagre layout util
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
const NODE_WIDTH = 200
const NODE_HEIGHT = 100
function getLayoutedElements(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 100, marginx: 20, marginy: 20 })
  nodes.forEach(n => dagreGraph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach(e => dagreGraph.setEdge(e.source, e.target))
  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map(n => {
      const { x, y } = dagreGraph.node(n.id)
      return {
        ...n,
        position: { x: x - NODE_WIDTH/2, y: y - NODE_HEIGHT/2 },
      }
    }),
    edges,
  }
}

export default function OrgChart({ users }: OrgChartProps) {
  // 1) Build nodes & edges from `users`
  const rawNodes: Node[] = users.map(u => ({
    id: u.id,
    type: 'employee',
    data: {
      name: u.name,
      jobTitle: u.jobTitle,
      department: u.department,
      directReportsCount: u.subordinates.length,
    },
  }))

  const rawEdges: Edge[] = users
    .filter(u => u.reportsToId)
    .map(u => ({
      id: `e${u.reportsToId}-${u.id}`,
      source: u.reportsToId!,
      target: u.id,
      type: edgeType,
      animated: true,
      style: { stroke: '#555', strokeWidth: 2 },
    }))

  // 2) Layout once on mount
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges, 'TB')

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  // 3) Preserve smoothstep on user-drawn connections
  const onConnect = useCallback(params => {
    setEdges(es => addEdge({ ...params, type: edgeType, animated: true, style: { stroke: '#555', strokeWidth: 2 } }, es))
  }, [setEdges])

  return (
    <div style={{ width: '100%', height: '700px', background: '#F7F9FB' }}>
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
  )
}

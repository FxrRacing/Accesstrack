'use client'
// components/OrgChart.tsx
import React, { useMemo, useEffect } from 'react'
import Dagre from '@dagrejs/dagre'
import {
  ReactFlowProvider,
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { User } from '@prisma/client'

const NODE_WIDTH = 172
const NODE_HEIGHT = 60

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new Dagre.graphlib.Graph()
    .setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction })

  nodes.forEach((n) =>
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  )
  edges.forEach((e) => g.setEdge(e.source, e.target))

  Dagre.layout(g)

  return {
    nodes: nodes.map((n) => {
      const { x, y } = g.node(n.id)
      return {
        ...n,
        position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      }
    }),
    edges,
  }
}

type Props = { data: User[] }

function Flow({ data }: Props) {
  // map your User[] → raw nodes & edges
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    // Check if data is undefined or null and provide a default empty array
    const safeData = data || [];
    
    const rawNodes = safeData.map((u) => ({
      id: u.id,
      data: { label: (
        <div style={{ textAlign: 'center', padding: 8 }}>
          <strong>{u.name}</strong><br/>
          <small>{u.jobTitle ?? '—'}</small>
        </div>
      ) },
      position: { x: 0, y: 0 },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        border: '1px solid #888',
        borderRadius: 4,
        background: '#fff',
      },
    }))
    const rawEdges = safeData
      .filter((u) => u.reportsToId)
      .map((u) => ({
        id: `e-${u.reportsToId}-${u.id}`,
        source: u.reportsToId!,
        target: u.id,
        type: 'smoothstep',
      }))

    return getLayoutedElements(rawNodes, rawEdges, 'TB')
  }, [data])

  // feed into React Flow state
  const [nodes, , onNodesChange] = useNodesState(layoutedNodes)
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges)
  const { fitView } = useReactFlow()

  // fit once on mount
  useEffect(() => {
    fitView()
  }, [fitView])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Controls />
      <Background gap={16} />
    </ReactFlow>
  )
}

export default function OrgChart(props: Props) {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100vh' }}>
        <Flow {...props} />
      </div>
    </ReactFlowProvider>
  )
}

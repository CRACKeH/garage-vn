import { useCallback, useEffect, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useProjectStore } from "../store/projectStore";
import {
  ScenarioFlowNode,
  type ScenarioNodeData,
} from "./ScenarioFlowNode";

const nodeTypes: NodeTypes = {
  scenario: ScenarioFlowNode,
};

function usesVar(
  node: {
    phrases: { visibleIf?: { varId: string }[] }[];
    buttons: {
      visibleIf?: { varId: string }[];
      actions: { type: string; varId?: string }[];
    }[];
  },
  varId: string,
): boolean {
  for (const p of node.phrases) {
    if (p.visibleIf?.some((c) => c.varId === varId)) return true;
  }
  for (const b of node.buttons) {
    if (b.visibleIf?.some((c) => c.varId === varId)) return true;
    if (b.actions.some((a) => a.type === "setVar" && a.varId === varId)) return true;
  }
  return false;
}

function CanvasInner() {
  const project = useProjectStore((s) => s.project);
  const scene = useProjectStore((s) => s.getActiveScene());
  const sceneId = useProjectStore((s) => s.sceneId);
  const selection = useProjectStore((s) => s.selection);
  const highlightedVarId = useProjectStore((s) => s.highlightedVarId);
  const selectNode = useProjectStore((s) => s.selectNode);
  const moveNode = useProjectStore((s) => s.moveNode);
  const addNode = useProjectStore((s) => s.addNode);
  const removeNode = useProjectStore((s) => s.removeNode);
  const connectDefaultNext = useProjectStore((s) => s.connectDefaultNext);
  const connectButtonGoto = useProjectStore((s) => s.connectButtonGoto);
  const setPlaytestOpen = useProjectStore((s) => s.setPlaytestOpen);

  const charMap = useMemo(() => {
    const m = new Map(project.characters.map((c) => [c.id, c]));
    return m;
  }, [project.characters]);

  const built = useMemo(() => {
    if (!scene) return { nodes: [] as Node[], edges: [] as Edge[] };

    const nodes: Node[] = scene.nodes.map((n) => {
      const data: ScenarioNodeData = {
        name: n.name,
        image: n.image,
        mood: n.mood,
        animation: n.animation,
        isEntry: scene.entryNodeId === n.id,
        varHit: highlightedVarId
          ? usesVar(n, highlightedVarId)
          : false,
        phrases: n.phrases.map((p) => {
          const ch = charMap.get(p.speakerId);
          return {
            speaker: ch?.name ?? "?",
            color: ch?.color ?? "#aaa",
            text: p.text,
            hasCond: Boolean(p.visibleIf?.length),
          };
        }),
        buttons: n.buttons.map((b) => ({
          id: b.id,
          label: b.label,
          hasCond: Boolean(b.visibleIf?.length),
        })),
        hasDefaultNext: Boolean(n.defaultNext),
      };
      return {
        id: n.id,
        type: "scenario",
        position: n.position,
        data,
        selected: selection.kind === "node" && selection.nodeId === n.id,
      };
    });

    const edges: Edge[] = [];
    for (const n of scene.nodes) {
      if (n.defaultNext) {
        edges.push({
          id: `e-${n.id}-out-${n.defaultNext}`,
          source: n.id,
          target: n.defaultNext,
          sourceHandle: "out",
          animated: true,
          style: { stroke: "#3d9e96" },
        });
      }
      for (const b of n.buttons) {
        const goto = b.actions.find((a) => a.type === "goto");
        if (goto && goto.type === "goto" && goto.targetNodeId) {
          edges.push({
            id: `e-${n.id}-${b.id}-${goto.targetNodeId}`,
            source: n.id,
            target: goto.targetNodeId,
            sourceHandle: `btn:${b.id}`,
            label: b.label.slice(0, 18),
            style: { stroke: "#f57c1f" },
          });
        }
      }
    }

    return { nodes, edges };
  }, [scene, charMap, highlightedVarId, selection]);

  const [nodes, setNodes, onNodesChange] = useNodesState(built.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(built.edges);

  useEffect(() => {
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [built, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.sourceHandle?.startsWith("btn:")) {
        const buttonId = connection.sourceHandle.slice(4);
        connectButtonGoto(connection.source, buttonId, connection.target);
      } else {
        connectDefaultNext(connection.source, connection.target);
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [connectButtonGoto, connectDefaultNext, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_event: unknown, node: Node) => {
      moveNode(node.id, node.position.x, node.position.y);
    },
    [moveNode],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "Tab") {
        e.preventDefault();
        addNode();
      }
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        setPlaytestOpen(true);
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selection.kind === "node"
      ) {
        e.preventDefault();
        removeNode(selection.nodeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addNode, removeNode, selection, setPlaytestOpen]);

  if (!scene) {
    return <div className="empty-state">Нет активной сцены</div>;
  }

  return (
    <ReactFlow
      key={sceneId}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, n) => selectNode(n.id)}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      fitView
      snapToGrid
      snapGrid={[16, 16]}
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1}
        color="#333"
      />
      <MiniMap
        nodeColor={() => "#f57c1f"}
        maskColor="rgba(0,0,0,0.7)"
        pannable
        zoomable
      />
      <Controls />
    </ReactFlow>
  );
}

export function NodeCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

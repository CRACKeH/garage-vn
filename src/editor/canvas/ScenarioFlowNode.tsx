import { memo } from "react";
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { assetUrl } from "../../assetUrl";

export type ScenarioNodeData = {
  name: string;
  image?: string;
  mood?: string;
  animation?: string;
  isEntry?: boolean;
  varHit?: boolean;
  phrases: { speaker: string; color: string; text: string; hasCond?: boolean }[];
  buttons: { id: string; label: string; hasCond?: boolean }[];
  hasDefaultNext?: boolean;
};

export type ScenarioFlowNodeType = Node<ScenarioNodeData, "scenario">;

function ScenarioNodeView({ data, selected }: NodeProps<ScenarioFlowNodeType>) {
  const preview = data.phrases.slice(0, 8);
  const hidden = data.phrases.length - preview.length;

  return (
    <div
      className={`scenario-node${selected ? " selected" : ""}${data.isEntry ? " entry" : ""}${data.varHit ? " var-hit" : ""}`}
    >
      <Handle type="target" position={Position.Left} id="in" />
      <div
        className="sn-thumb"
        style={
          data.image
            ? { backgroundImage: `url(${assetUrl(data.image)})` }
            : undefined
        }
      >
        {!data.image && <div className="sn-thumb-empty">no image</div>}
        {(data.mood || data.animation) && (
          <span className="sn-badge">
            {[data.mood, data.animation !== "none" ? data.animation : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
        {data.isEntry && (
          <span
            className="sn-badge"
            style={{ left: "auto", right: 6, color: "#9fd8d2" }}
          >
            entry
          </span>
        )}
      </div>
      <div className="sn-body">
        <div className="sn-title">{data.name}</div>
        {preview.map((p, i) => (
          <div key={i} className="sn-phrase">
            <span className="sn-speaker" style={{ color: p.color }}>
              {p.speaker}
              {p.hasCond ? " *" : ""}
            </span>
            <span className="sn-text">{p.text}</span>
          </div>
        ))}
        {hidden > 0 && <div className="sn-more">+{hidden} more</div>}
        {data.buttons.length > 0 && (
          <div className="sn-btns">
            {data.buttons.map((b) => (
              <div key={b.id} className="sn-btn-row">
                <span>
                  ▸ {b.label}
                  {b.hasCond ? " *" : ""}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`btn:${b.id}`}
                  style={{
                    position: "relative",
                    right: 0,
                    top: 0,
                    transform: "none",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {(data.hasDefaultNext || data.buttons.length === 0) && (
        <Handle type="source" position={Position.Right} id="out" />
      )}
    </div>
  );
}

export const ScenarioFlowNode = memo(ScenarioNodeView);

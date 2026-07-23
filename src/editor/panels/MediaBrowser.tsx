import { assetUrl } from "../../assetUrl";
import { pickImagePublicPath } from "../pickImage";
import { useProjectStore } from "../store/projectStore";

const KNOWN_ASSETS = [
  "/chapter01/ch01-01-garage-alley.png",
  "/chapter01/ch01-02-garage-interior.png",
  "/chapter01/ch01-03-three-friends.png",
  "/chapter01/ch01-04-banter-laugh.png",
  "/chapter01/ch01-05-wrong-smile.png",
  "/chapter01/ch01-06-friends-notice.png",
  "/chapter01/ch01-07-transform-start.png",
  "/chapter01/ch01-08-transform-grow.png",
  "/chapter01/ch01-09-monster-reveal.png",
  "/chapter01/ch01-10-cliffhanger.png",
];

export function MediaBrowser() {
  const selection = useProjectStore((s) => s.selection);
  const chapterId = useProjectStore((s) => s.chapterId);
  const updateNode = useProjectStore((s) => s.updateNode);
  const getActiveScene = useProjectStore((s) => s.getActiveScene);
  const selectNode = useProjectStore((s) => s.selectNode);

  const applyImage = (path: string) => {
    let nodeId = selection.kind === "node" ? selection.nodeId : null;
    if (!nodeId) {
      const scene = getActiveScene();
      nodeId = scene?.entryNodeId ?? scene?.nodes[0]?.id ?? null;
      if (nodeId) selectNode(nodeId);
    }
    if (nodeId) updateNode(nodeId, { image: path });
  };

  return (
    <div className="panel-scroll">
      <button
        type="button"
        className="mini-btn accent image-browse-btn"
        title="Выбрать файл через Finder (файл должен лежать в public/)"
        onClick={() => {
          void pickImagePublicPath(chapterId).then((path) => {
            if (path) applyImage(path);
          });
        }}
      >
        Выбрать файл…
      </button>
      <p className="tree-label" style={{ marginTop: 10 }}>
        Media (ch01 samples)
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        {KNOWN_ASSETS.map((src) => (
          <button
            key={src}
            type="button"
            title={src}
            onClick={() => applyImage(src)}
            style={{
              appearance: "none",
              border: "1px solid var(--studio-border-strong)",
              borderRadius: 4,
              padding: 0,
              height: 56,
              background: `#111 center/cover no-repeat url(${assetUrl(src)})`,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      <p style={{ color: "var(--studio-muted)", marginTop: 8, fontSize: 10 }}>
        Browse или клик по превью → image на ноду (файл из public/).
      </p>
    </div>
  );
}

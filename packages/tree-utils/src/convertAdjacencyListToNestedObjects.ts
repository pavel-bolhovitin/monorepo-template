import type { CloneStrategy, NodeId } from "./types";

/**
 * Converts a flat adjacency list (parent ID model) into a nested object tree.
 *
 * Duplicate nodes (same ID, first occurrence wins) and cyclic nodes (where a
 * node is its own ancestor) are silently discarded during tree construction.
 *
 * @template Node - Shape of a single node object.
 *
 * @param nodes - Flat array of nodes in adjacency-list form.
 * @param getId - Extracts the unique identifier from a node.
 * @param getParentId - Extracts the parent identifier from a node.
 *   Return `null` or `undefined` to mark a node as a root.
 * @param childrenKey - Key used to store child nodes on each output object.
 *   Defaults to `"children"`.
 * @param cloneStrategy - How each node is prepared before insertion into the tree.
 *   Defaults to `"shallow"`. See {@link CloneStrategy} for details on each variant.
 * @param nodeKey - Key used to store the original node inside its wrapper when
 *   `cloneStrategy` is `"wrap"`. Defaults to `"node"`. Ignored for other strategies.
 * @param pruneOrphans - When `true`, nodes whose parent ID cannot be resolved
 *   are silently dropped. When `false` *(default)*, they are promoted to root nodes.
 * @param includeDepth - When `true`, each output object receives a numeric depth
 *   property starting at `0` for root nodes. Defaults to `false`.
 * @param depthKey - Key name used to store the depth value on each output object.
 *   Defaults to `"depth"`. Only meaningful when `includeDepth` is `true`.
 *
 * @returns An array of root nodes, each containing its descendants nested
 *   under `childrenKey`.
 *
 * @example
 * ```ts
 * const flat = [
 *   { id: 1, parentId: null, name: "root" },
 *   { id: 2, parentId: 1,   name: "child" },
 * ];
 *
 * // Default (shallow clone)
 * const tree = convertAdjacencyListToNestedObjects({
 *   nodes: flat,
 *   getId:        (n) => n.id,
 *   getParentId:  (n) => n.parentId,
 *   includeDepth: true,
 *   depthKey:     "level",
 * });
 * // [{ id: 1, parentId: null, name: "root", level: 0, children: [{ id: 2, ..., level: 1 }] }]
 *
 * // Wrap strategy — original node accessible under "node" key
 * const wrapped = convertAdjacencyListToNestedObjects({
 *   nodes: flat,
 *   getId:          (n) => n.id,
 *   getParentId:    (n) => n.parentId,
 *   cloneStrategy:  "wrap",
 *   nodeKey:        "data",
 * });
 * // [{ data: { id: 1, ... }, children: [{ data: { id: 2, ... }, children: [] }] }]
 * ```
 */
export function convertAdjacencyListToNestedObjects<
  Node extends Record<string, any>,
  OutputNode extends Node,
>(params: {
  nodes: Node[];
  getId: (node: Node) => NodeId;
  getParentId: (node: Node) => NodeId | null | undefined;
  childrenKey?: string;
  cloneStrategy?: CloneStrategy;
  pruneOrphans?: boolean;
  includeDepth?: boolean;
  depthKey?: string;
  nodeKey?: string;
}): OutputNode[] {
  const {
    nodes,
    getId,
    getParentId,
    childrenKey = "children",
    cloneStrategy = "shallow",
    pruneOrphans = false,
    includeDepth = false,
    depthKey = "depth",
    nodeKey = "node",
  } = params;

  // Phase 1: O(n) - removed duplicates by ID (first occurrence wins), create map of nodes by id
  const nodeMap = new Map<NodeId, any>();

  switch (cloneStrategy) {
    case "shallow":
      for (const node of nodes) {
        const id = getId(node);

        if (nodeMap.has(id)) continue;

        nodeMap.set(id, { ...node, [childrenKey]: [] });
      }
      break;
    case "mutate":
      for (const node of nodes) {
        const id = getId(node);

        if (nodeMap.has(id)) continue;

        (node as Record<string, unknown>)[childrenKey] = [];
        nodeMap.set(id, node);
      }
      break;
    case "wrap":
      for (const node of nodes) {
        const id = getId(node);

        if (nodeMap.has(id)) continue;

        nodeMap.set(id, { [nodeKey]: node, [childrenKey]: [] });
      }
      break;
    default:
      cloneStrategy satisfies never;
  }

  // Phase 2: O(n) - add node reference to its parent
  const roots: Node[] = [];

  for (const [, node] of nodeMap) {
    const parentId = getParentId(getNode(node, cloneStrategy, nodeKey));

    if (parentId === null || parentId === undefined) {
      roots.push(node);
    } else {
      const parentNode = nodeMap.get(parentId);

      if (parentNode) {
        (parentNode[childrenKey] as Node[]).push(node);
      } else if (!pruneOrphans) {
        roots.push(node);
      }
    }
  }

  // Phase 3 (optional): O(n) Breadth first search to add depth to each node
  if (includeDepth) {
    const queue: Array<[Node, number]> = roots.map((r) => [r, 0]);
    let qi = 0;

    while (qi < queue.length) {
      const entry = queue[qi++];

      if (!entry) break;

      const [node, depth] = entry;
      (node as Record<string, unknown>)[depthKey] = depth;

      for (const child of node[childrenKey] as Node[]) {
        queue.push([child, depth + 1]);
      }
    }
  }

  return roots as unknown as OutputNode[];
}

function getNode(data: any, cloneStrategy: CloneStrategy, nodeKey: string) {
  switch (cloneStrategy) {
    case "shallow":
    case "mutate":
      return data;
    case "wrap":
      return (data as Record<string, any>)[nodeKey];
    default:
      cloneStrategy satisfies never;
  }
}

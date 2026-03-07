import type { NodeId } from "./types";

/**
 * Returns all descendants (or only direct children) of a node in a flat
 * adjacency list (parent ID model).
 *
 * Cyclic references (a node whose ancestor chain loops back to itself) are
 * silently skipped — each node ID is visited at most once.
 *
 * @template Node - Shape of a single node object.
 *
 * @param nodes - Flat array of nodes in adjacency-list form.
 * @param nodeId - ID of the node whose descendants to retrieve.
 * @param getId - Extracts the unique identifier from a node.
 * @param getParentId - Extracts the parent identifier from a node.
 *   Return `null` or `undefined` to mark a node as a root.
 * @param deep - When `true` *(default)*, returns all descendants recursively.
 *   When `false`, returns only direct children.
 *
 * @returns A flat array of descendant nodes in breadth-first order.
 *
 * @example
 * ```ts
 * const flat = [
 *   { id: 1, parentId: null },
 *   { id: 2, parentId: 1 },
 *   { id: 3, parentId: 1 },
 *   { id: 4, parentId: 2 },
 * ];
 *
 * getAdjacencyListDescendants({
 *   nodes: flat,
 *   nodeId: 1,
 *   getId: (n) => n.id,
 *   getParentId: (n) => n.parentId,
 * });
 * // [{ id: 2, ... }, { id: 3, ... }, { id: 4, ... }]
 *
 * getAdjacencyListDescendants({
 *   nodes: flat,
 *   nodeId: 1,
 *   getId: (n) => n.id,
 *   getParentId: (n) => n.parentId,
 *   deep: false,
 * });
 * // [{ id: 2, ... }, { id: 3, ... }]
 * ```
 */
export function getAdjacencyListDescendants<Node>(params: {
  nodes: Node[];
  nodeId: NodeId;
  getId: (node: Node) => NodeId;
  getParentId: (node: Node) => NodeId | null | undefined;
  deep?: boolean;
}): Node[] {
  const { nodes, nodeId, getId, getParentId, deep = true } = params;

  // Phase 1: O(n) create map of nodes by their parent id, remove roots
  const nodeMap = new Map<NodeId, Node[]>();

  for (const node of nodes) {
    const parentId = getParentId(node);

    if (parentId === null || parentId === undefined) continue;

    let siblings = nodeMap.get(parentId);
    if (!siblings) {
      siblings = [];
      nodeMap.set(parentId, siblings);
    }
    siblings.push(node);
  }

  const directChildren = nodeMap.get(nodeId);

  if (!directChildren) return [];

  if (!deep) return directChildren.slice();

  // Phase 2: BFS — result[] doubles as the queue (pointer avoids shift() cost).
  // visited guards against corrupted inputs with cyclic parent references.
  const visited = new Set<NodeId>([nodeId]);
  const result: Node[] = [];

  for (const child of directChildren) {
    const childId = getId(child);
    if (!visited.has(childId)) {
      visited.add(childId);
      result.push(child);
    }
  }

  let qi = 0;
  while (qi < result.length) {
    const node = result[qi++];
    if (!node) break;
    const children = nodeMap.get(getId(node));

    if (children) {
      for (const child of children) {
        const childId = getId(child);
        if (!visited.has(childId)) {
          visited.add(childId);
          result.push(child);
        }
      }
    }
  }

  return result;
}

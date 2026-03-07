/**
 * Tree utilities — tree data structure helpers for npm / yarn.
 * @packageDocumentation
 */

/**
 * Adjacency List (Self-Referential Relation, Parent ID Model.)
 * Nested Objects (Recursive Object Tree, Tree Data Structure)
 */

type TreeType = "adjacency-list" | "nested-objects";

type CloneStrategy = "shallow" | "mutate";

type NodeId = string | number;

type Options = {
  inputType: TreeType;
  outputType: TreeType;
};

/**
 * Converts a flat adjacency list (parent ID model) into a nested object tree.
 *
 * Duplicate nodes (same ID, first occurrence wins) and cyclic nodes (where a
 * node is its own ancestor) are silently discarded during tree construction.
 *
 * @template T - Shape of a single node object.
 * @template CKey - The key under which child nodes are nested (default: `"children"`).
 *
 * @param nodes - Flat array of nodes in adjacency-list form.
 * @param getId - Extracts the unique identifier from a node.
 * @param getParentId - Extracts the parent identifier from a node.
 *   Return `null` or `undefined` to mark a node as a root.
 * @param childrenKey - Key used to store child nodes on each node object.
 *   Defaults to `"children"`.
 * @param cloneStrategy - How nodes are prepared before insertion:
 *   - `"shallow"` *(default)* — spreads each node into a new object, preserving the original.
 *   - `"mutate"` — attaches `childrenKey` directly onto the original node objects.
 * @param pruneOrphans - When `true`, nodes whose parent ID cannot be resolved
 *   are silently dropped. When `false` *(default)*, they are promoted to root nodes.
 * @param includeDepth - When `true`, each node will receive a numeric depth property
 *   starting at `0` for root nodes. Defaults to `false`.
 * @param depthKey - Key name used to store the depth value on each node.
 *   Defaults to `"depth"`. Only meaningful when `includeDepth` is `true`.
 *
 * @returns An array of root nodes, each containing its descendants nested
 *   under `childrenKey`.
 *
 * @example
 * ```ts
 * const flat = [
 *   { id: 1, parentId: null,  name: "root" },
 *   { id: 2, parentId: 1,    name: "child" },
 * ];
 *
 * const tree = convertAdjacencyListToNestedObjects({
 *   nodes: flat,
 *   getId:         (n) => n.id,
 *   getParentId:   (n) => n.parentId,
 *   includeDepth:  true,
 *   depthKey:      "level", // optional, defaults to "depth"
 * });
 * // [{ id: 1, parentId: null, name: "root", level: 0, children: [{ id: 2, ..., level: 1 }] }]
 * ```
 */
export function convertAdjacencyListToNestedObjects<
  T extends Record<string, unknown>,
  CKey extends string,
>({
  nodes,
  getId,
  getParentId,
  childrenKey = "children" as CKey,
  cloneStrategy = "shallow",
  pruneOrphans = false,
  includeDepth = false,
  depthKey = "depth",
}: {
  nodes: T[];
  getId: (node: T) => NodeId;
  getParentId: (node: T) => NodeId | null | undefined;
  childrenKey?: CKey;
  cloneStrategy?: CloneStrategy;
  pruneOrphans?: boolean;
  includeDepth?: boolean;
  depthKey?: string;
}) {
  // Phase 1: O(n) - removed duplicates by ID (first occurrence wins), create map of nodes by id
  const nodeMap = new Map<NodeId, T>();

  for (const node of nodes) {
    const id = getId(node);

    if (nodeMap.has(id)) continue;

    switch (cloneStrategy) {
      case "shallow":
        nodeMap.set(id, { ...node, [childrenKey]: [] });
        break;
      case "mutate":
        node[childrenKey] = [] as T[CKey];
        nodeMap.set(id, node);
        break;
      default:
        cloneStrategy satisfies never;
    }
  }

  // Phase 2: O(n) - add node reference to its parent
  const roots: T[] = [];

  for (const [, node] of nodeMap) {
    const parentId = getParentId(node);

    if (parentId === null || parentId === undefined) {
      roots.push(node);
    } else {
      const parentNode = nodeMap.get(parentId);

      if (parentNode) {
        (parentNode[childrenKey] as T[]).push(node);
      } else if (!pruneOrphans) {
        roots.push(node);
      }
    }
  }

  // Phase 3 (optional): O(n) Breadth first search to add depth to each node
  if (includeDepth) {
    const queue: Array<[T, number]> = roots.map((r) => [r, 0]);
    let qi = 0;

    while (qi < queue.length) {
      const entry = queue[qi++];

      if (!entry) break;

      const [node, depth] = entry;
      (node as Record<string, unknown>)[depthKey] = depth;

      for (const child of node[childrenKey] as T[]) {
        queue.push([child, depth + 1]);
      }
    }
  }

  return roots;
}

export function convertTree(_params: Options) {
  // TODO: implement generic tree conversion
}

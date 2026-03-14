/**
 * - `"adjacency-list"` Adjacency List (Self-Referential Relation, Parent ID Model.)
 * flat array where each node references its parent by ID
 * - `"nested-objects"` Nested Objects (Recursive Object Tree, Tree Data Structure)
 * recursive tree where children are embedded under a key
 * @example
 * ```ts
 * // "adjacency-list"
 * const flat: { id: number; parentId: number | null; label: string }[] = [
 *   { id: 1, parentId: null, label: "Root" },
 *   { id: 2, parentId: 1,   label: "Child" },
 *   { id: 3, parentId: 1,   label: "Child" },
 * ];
 *
 * // "nested-objects"
 * const tree = [
 *   {
 *     id: 1, parentId: null, label: "Root", children: [
 *       { id: 2, parentId: 1, label: "Child", children: [] },
 *       { id: 3, parentId: 1, label: "Child", children: [] },
 *     ],
 *   },
 * ];
 * ```
 */
export type TreeType = "adjacency-list" | "nested-objects";

/**
 * Controls how each node is prepared before being inserted into the output tree.
 *
 * - `"shallow"` — spreads the node into a new object, leaving the original untouched.
 * - `"mutate"` — attaches the children array directly onto the original node object.
 * - `"wrap"` — creates a new wrapper object `{ [nodeKey]: originalNode, [childrenKey]: [] }`,
 *   keeping the original node fully intact and accessible under `nodeKey`.
 */
export type CloneStrategy = "shallow" | "mutate" | "wrap";

/** Valid node identifier — either a string or a number. */
export type NodeId = string | number;

/**
 * Adjacency List (Self-Referential Relation, Parent ID Model.)
 * Nested Objects (Recursive Object Tree, Tree Data Structure)
 */

export type TreeType = "adjacency-list" | "nested-objects";

export type CloneStrategy = "shallow" | "mutate" | "wrap";

export type NodeId = string | number;

export type Options = {
  inputType: TreeType;
  outputType: TreeType;
};

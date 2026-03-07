import { describe, expect, it } from "vitest";
import { getAdjacencyListDescendants } from "./getAdjacencyListChildren";

const getId: Parameters<typeof getAdjacencyListDescendants<any>>[0]["getId"] = (
  n,
) => n.parentId;

const getParentId: Parameters<
  typeof getAdjacencyListDescendants<any>
>[0]["getParentId"] = (n) => n.parentId;

describe("getAdjacencyListDescendants", () => {
  it("empty", () => {
    const result = getAdjacencyListDescendants({
      nodes: [] as any[],
      nodeId: 1,
      getId,
      getParentId,
    });

    expect(result).toEqual([]);
  });

  it("node not found", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root" },
        { id: 2, parentId: 1, label: "Child" },
      ],
      nodeId: 999,
      getId,
      getParentId,
    });

    expect(result).toEqual([]);
  });

  it("leaf node (no children)", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root" },
        { id: 2, parentId: 1, label: "Child" },
      ],
      nodeId: 2,
      getId,
      getParentId,
    });

    expect(result).toEqual([]);
  });

  it("default (deep = true)", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 3, parentId: 1, label: "Region: US" },
        { id: 4, parentId: 2, label: "Cluster: Prod" },
        { id: 5, parentId: 2, label: "Cluster: Dev" },
      ],
      nodeId: 1,
      getId,
      getParentId,
    });

    expect(result).toEqual([
      { id: 2, parentId: 1, label: "Region: EU" },
      { id: 3, parentId: 1, label: "Region: US" },
      { id: 4, parentId: 2, label: "Cluster: Prod" },
      { id: 5, parentId: 2, label: "Cluster: Dev" },
    ]);
  });

  it("deep = true explicit", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 3, parentId: 1, label: "Region: US" },
        { id: 4, parentId: 2, label: "Cluster: Prod" },
        { id: 5, parentId: 2, label: "Cluster: Dev" },
      ],
      nodeId: 1,
      getId,
      getParentId,
      deep: true,
    });

    expect(result).toEqual([
      { id: 2, parentId: 1, label: "Region: EU" },
      { id: 3, parentId: 1, label: "Region: US" },
      { id: 4, parentId: 2, label: "Cluster: Prod" },
      { id: 5, parentId: 2, label: "Cluster: Dev" },
    ]);
  });

  it("deep = false (direct children only)", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 3, parentId: 1, label: "Region: US" },
        { id: 4, parentId: 2, label: "Cluster: Prod" },
        { id: 5, parentId: 2, label: "Cluster: Dev" },
      ],
      nodeId: 1,
      getId,
      getParentId,
      deep: false,
    });

    expect(result).toEqual([
      { id: 2, parentId: 1, label: "Region: EU" },
      { id: 3, parentId: 1, label: "Region: US" },
    ]);
  });

  it("deep subtree starting from intermediate node", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 3, parentId: 1, label: "Region: US" },
        { id: 4, parentId: 2, label: "Cluster: Prod" },
        { id: 5, parentId: 2, label: "Cluster: Dev" },
      ],
      nodeId: 2,
      getId,
      getParentId,
    });

    expect(result).toEqual([
      { id: 4, parentId: 2, label: "Cluster: Prod" },
      { id: 5, parentId: 2, label: "Cluster: Dev" },
    ]);
  });

  it("bfs order across multiple levels", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root" },
        { id: 2, parentId: 1, label: "A" },
        { id: 3, parentId: 1, label: "B" },
        { id: 4, parentId: 2, label: "A1" },
        { id: 5, parentId: 3, label: "B1" },
        { id: 6, parentId: 4, label: "A1a" },
      ],
      nodeId: 1,
      getId,
      getParentId,
    });

    expect(result).toEqual([
      { id: 2, parentId: 1, label: "A" },
      { id: 3, parentId: 1, label: "B" },
      { id: 4, parentId: 2, label: "A1" },
      { id: 5, parentId: 3, label: "B1" },
      { id: 6, parentId: 4, label: "A1a" },
    ]);
  });

  it("string ids", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: "root", parentId: null, label: "Root" },
        { id: "eu", parentId: "root", label: "Region: EU" },
        { id: "us", parentId: "root", label: "Region: US" },
        { id: "prod", parentId: "eu", label: "Cluster: Prod" },
      ],
      nodeId: "root",
      getId,
      getParentId,
    });

    expect(result).toEqual([
      { id: "eu", parentId: "root", label: "Region: EU" },
      { id: "us", parentId: "root", label: "Region: US" },
      { id: "prod", parentId: "eu", label: "Cluster: Prod" },
    ]);
  });

  it("string ids deep = false", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: "root", parentId: null, label: "Root" },
        { id: "eu", parentId: "root", label: "Region: EU" },
        { id: "us", parentId: "root", label: "Region: US" },
        { id: "prod", parentId: "eu", label: "Cluster: Prod" },
      ],
      nodeId: "root",
      getId,
      getParentId,
      deep: false,
    });

    expect(result).toEqual([
      { id: "eu", parentId: "root", label: "Region: EU" },
      { id: "us", parentId: "root", label: "Region: US" },
    ]);
  });

  it("cyclic nodes", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root" },
        { id: 2, parentId: 1, label: "A" },
        { id: 3, parentId: 2, label: "B" },
        { id: 4, parentId: 3, label: "C — points back to A" },
      ],
      nodeId: 1,
      getId,
      getParentId: (n) => {
        if (n.id === 4) return 2;
        return n.parentId;
      },
    });

    const ids = result.map((n) => n.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("orphan nodes are ignored when looking up children", () => {
    const result = getAdjacencyListDescendants({
      nodes: [
        { id: 1, parentId: null, label: "Root" },
        { id: 2, parentId: 1, label: "Child" },
        { id: 99, parentId: 999, label: "Orphan" },
      ],
      nodeId: 1,
      getId,
      getParentId,
    });

    expect(result).toEqual([{ id: 2, parentId: 1, label: "Child" }]);
  });

  it("result is a new array (does not mutate input)", () => {
    const nodes = [
      { id: 1, parentId: null, label: "Root" },
      { id: 2, parentId: 1, label: "Child" },
    ];

    const result = getAdjacencyListDescendants({
      nodes,
      nodeId: 1,
      getId,
      getParentId,
      deep: false,
    });

    expect(result).not.toBe(nodes);
    expect(nodes).toHaveLength(2);
  });
});

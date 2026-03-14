import { describe, expect, it } from "vitest";
import { convertAdjacencyListToNestedObjects } from "./convertAdjacencyListToNestedObjects";

describe("convertAdjacencyListToNestedObjects", () => {
  it("empty", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [] as any[],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
    });

    expect(result).toEqual([]);
  });

  it("default", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 2, label: "Cluster: Prod" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
    });

    expect(result).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                id: 3,
                label: "Cluster: Prod",
                parentId: 2,
              },
            ],
            id: 2,
            label: "Region: EU",
            parentId: 1,
          },
          {
            children: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
      },
    ]);
  });

  it("default explicit", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 2, label: "Cluster: Prod" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      childrenKey: "children",
      cloneStrategy: "shallow",
      pruneOrphans: false,
      includeDepth: false,
      depthKey: "depth",
      nodeKey: "node",
    });

    expect(result).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                id: 3,
                label: "Cluster: Prod",
                parentId: 2,
              },
            ],
            id: 2,
            label: "Region: EU",
            parentId: 1,
          },
          {
            children: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
      },
    ]);
  });

  it("childrenKey", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 2, label: "Cluster: Prod" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      childrenKey: "subNodes",
    });

    expect(result).toEqual([
      {
        subNodes: [
          {
            subNodes: [
              {
                subNodes: [],
                id: 3,
                label: "Cluster: Prod",
                parentId: 2,
              },
            ],
            id: 2,
            label: "Region: EU",
            parentId: 1,
          },
          {
            subNodes: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
      },
    ]);
  });

  it("depth", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 2, label: "Cluster: Prod" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      includeDepth: true,
    });

    expect(result).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                id: 3,
                label: "Cluster: Prod",
                parentId: 2,
                depth: 2,
              },
            ],
            id: 2,
            label: "Region: EU",
            parentId: 1,
            depth: 1,
          },
          {
            children: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
            depth: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
        depth: 0,
      },
    ]);
  });

  it("depth and depthKey", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 2, label: "Cluster: Prod" },
        { id: 2, parentId: 1, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
        { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      includeDepth: true,
      depthKey: "level",
    });

    expect(result).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                id: 3,
                label: "Cluster: Prod",
                parentId: 2,
                level: 2,
              },
            ],
            id: 2,
            label: "Region: EU",
            parentId: 1,
            level: 1,
          },
          {
            children: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
            level: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
        level: 0,
      },
    ]);
  });

  it("pruneOrphans", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [{ id: 11, parentId: 999, label: "Orphan Node" }],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      pruneOrphans: true,
    });

    expect(result).toEqual([]);
  });

  it("mutate", () => {
    const nodes = [
      { id: 1, parentId: null, label: "Root: Infrastructure" },
      { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
    ];

    const result = convertAdjacencyListToNestedObjects({
      nodes,
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      cloneStrategy: "mutate",
    });

    expect(result[0]).toBe(nodes[0]);
    expect((result[0] as any).children[0]).toBe((nodes[0] as any).children[0]);
    expect(result).toEqual([
      {
        children: [
          {
            children: [],
            id: 0,
            label: "Global Config (Child of 1)",
            parentId: 1,
          },
        ],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
      },
    ]);
  });

  it("wrap", () => {
    const nodes = [
      { id: 1, parentId: null, label: "Root: Infrastructure" },
      { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
    ];

    const result = convertAdjacencyListToNestedObjects({
      nodes,
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      cloneStrategy: "wrap",
    });

    expect(result).toEqual([
      {
        node: {
          id: 1,
          label: "Root: Infrastructure",
          parentId: null,
        },
        children: [
          {
            node: {
              id: 0,
              label: "Global Config (Child of 1)",
              parentId: 1,
            },
            children: [],
          },
        ],
      },
    ]);
  });

  it("wrap nodeKey", () => {
    const nodes = [
      { id: 1, parentId: null, label: "Root: Infrastructure" },
      { id: 0, parentId: 1, label: "Global Config (Child of 1)" },
    ];

    const result = convertAdjacencyListToNestedObjects({
      nodes,
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
      cloneStrategy: "wrap",
      nodeKey: "data",
    });

    expect(result).toEqual([
      {
        data: {
          id: 1,
          label: "Root: Infrastructure",
          parentId: null,
        },
        children: [
          {
            data: {
              id: 0,
              label: "Global Config (Child of 1)",
              parentId: 1,
            },
            children: [],
          },
        ],
      },
    ]);
  });

  it("cyclic nodes", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: "A", parentId: "E", label: "White cat" },
        { id: "B", parentId: "A", label: "Gray cat" },
        { id: "C", parentId: "B", label: "Black cat" },
        { id: "E", parentId: "C", label: "Gray cat" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
    });

    expect(result).toEqual([]);
  });

  it("parents and orphans", () => {
    const result = convertAdjacencyListToNestedObjects({
      nodes: [
        { id: 3, parentId: 32, label: "Cluster: Prod" },
        { id: 2, label: "Region: EU" },
        { id: 1, parentId: null, label: "Root: Infrastructure" },
      ],
      getId: (n) => n.id,
      getParentId: (n) => n.parentId,
    });

    expect(result).toEqual([
      {
        children: [],
        id: 3,
        label: "Cluster: Prod",
        parentId: 32,
      },
      {
        children: [],
        id: 2,
        label: "Region: EU",
      },
      {
        children: [],
        id: 1,
        label: "Root: Infrastructure",
        parentId: null,
      },
    ]);
  });
});

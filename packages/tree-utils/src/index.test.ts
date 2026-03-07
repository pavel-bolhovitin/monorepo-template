import { describe, expect, it } from "vitest";
import { convertAdjacencyListToNestedObjects } from "./index.js";
import adjacencyList from "./mocks/adjacency-list.json";

type Node = { id: number; parentId: number | null; label: string };

const nodes = adjacencyList as Node[];
const getId = (n: Node) => String(n.id);
const getParentId = (n: Node) =>
  n.parentId != null ? String(n.parentId) : null;

function makeNodes(
  defs: Array<{ id: number; parentId?: number | null; label?: string }>,
): Node[] {
  return defs.map(({ id, parentId = null, label = `Node ${id}` }) => ({
    id,
    parentId,
    label,
  }));
}

describe("convertAdjacencyListToNestedObjects", () => {
  describe("basic conversion", () => {
    it("returns an empty array for an empty input", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes: [] as Node[],
        getId,
        getParentId,
      });
      expect(result).toEqual([]);
    });

    it("returns a single root when one node has no parent", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("nests a child under its parent", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      const children = root.children as Node[];
      expect(children).toHaveLength(1);
      expect(children[0].id).toBe(2);
    });

    it("builds a deep nested tree correctly", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
        { id: 4, parentId: 3 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      const l1 = (root.children as Node[])[0];
      const l2 = (l1.children as Node[])[0];
      const l3 = (l2.children as Node[])[0];
      expect(l1.id).toBe(2);
      expect(l2.id).toBe(3);
      expect(l3.id).toBe(4);
    });

    it("attaches multiple children to a parent", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 1 },
        { id: 4, parentId: 1 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(root.children as Node[]).toHaveLength(3);
    });

    it("handles nodes supplied in reverse order (children before parents)", () => {
      const input = makeNodes([
        { id: 3, parentId: 2 },
        { id: 2, parentId: 1 },
        { id: 1, parentId: null },
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(((result[0].children as Node[])[0].children as Node[])[0].id).toBe(
        3,
      );
    });
  });

  describe("multiple roots", () => {
    it("returns multiple root nodes when several nodes have no parent", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: null },
        { id: 3, parentId: null },
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(result).toHaveLength(3);
    });
  });

  describe("orphan nodes", () => {
    it("treats orphan nodes (missing parent) as roots by default", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 99, parentId: 42 }, // parent 42 doesn't exist
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toContain(99);
    });

    it("removes orphan nodes when pruneOrphans is true", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 99, parentId: 42 }, // parent 42 doesn't exist
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        pruneOrphans: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("keeps legitimate children when pruneOrphans is true", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 999 }, // orphan
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        pruneOrphans: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].children as Node[]).toHaveLength(1);
    });
  });

  describe("duplicate IDs", () => {
    it("keeps only the first occurrence when duplicate IDs exist", () => {
      const input: Node[] = [
        { id: 1, parentId: null, label: "First" },
        { id: 1, parentId: null, label: "Duplicate" },
      ];
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("First");
    });
  });

  describe("cloneStrategy", () => {
    it("does not mutate original nodes with the default shallow strategy", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      const originalFirst = input[0];
      convertAdjacencyListToNestedObjects({ nodes: input, getId, getParentId });
      expect("children" in originalFirst).toBe(false);
    });

    it("mutates original nodes when cloneStrategy is 'mutate'", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      const originalRoot = input[0];
      convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        cloneStrategy: "mutate",
      });
      expect("children" in originalRoot).toBe(true);
    });

    it("returns the same object references when cloneStrategy is 'mutate'", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [result] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        cloneStrategy: "mutate",
      });
      expect(result).toBe(input[0]);
    });
  });

  describe("custom childrenKey", () => {
    it("nests children under the specified key", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        childrenKey: "items",
      });
      expect(root).toHaveProperty("items");
      expect((root as unknown as { items: Node[] }).items[0].id).toBe(2);
    });

    it("does not add a 'children' key when a custom key is used", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        childrenKey: "items",
      });
      expect(root).not.toHaveProperty("children");
    });
  });

  describe("edge cases", () => {
    it("handles a node with id 0 (falsy id) as a valid child", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 0, parentId: 1 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      const children = root.children as Node[];
      expect(children).toHaveLength(1);
      expect(children[0].id).toBe(0);
    });

    it("initialises every node with an empty children array", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(root.children).toEqual([]);
    });
  });

  describe("includeDepth", () => {
    it("does not add a depth property when includeDepth is false (default)", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
      });
      expect(root).not.toHaveProperty("depth");
    });

    it("adds depth 0 to root nodes when includeDepth is true", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        includeDepth: true,
      });
      expect((root as unknown as { depth: number }).depth).toBe(0);
    });

    it("assigns correct depth values across multiple levels", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        includeDepth: true,
      });
      const child = (root.children as Node[])[0];
      const grandchild = (child.children as Node[])[0];
      expect((root as unknown as { depth: number }).depth).toBe(0);
      expect((child as unknown as { depth: number }).depth).toBe(1);
      expect((grandchild as unknown as { depth: number }).depth).toBe(2);
    });

    it("assigns depth 0 to every root when there are multiple roots", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
      ]);
      const result = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        includeDepth: true,
      });
      const root1 = result.find((n) => n.id === 1)!;
      const root2 = result.find((n) => n.id === 2)!;
      const child = (root1.children as Node[])[0];
      expect((root1 as unknown as { depth: number }).depth).toBe(0);
      expect((root2 as unknown as { depth: number }).depth).toBe(0);
      expect((child as unknown as { depth: number }).depth).toBe(1);
    });

    it("uses a custom depthKey and does not add the default 'depth' key", () => {
      const input = makeNodes([{ id: 1, parentId: null }]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        includeDepth: true,
        depthKey: "level",
      });
      expect(root).toHaveProperty("level", 0);
      expect(root).not.toHaveProperty("depth");
    });

    it("works correctly combined with cloneStrategy 'mutate'", () => {
      const input = makeNodes([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      const [root] = convertAdjacencyListToNestedObjects({
        nodes: input,
        getId,
        getParentId,
        includeDepth: true,
        cloneStrategy: "mutate",
      });
      const child = (root.children as Node[])[0];
      expect((root as unknown as { depth: number }).depth).toBe(0);
      expect((child as unknown as { depth: number }).depth).toBe(1);
    });
  });

  describe("integration — mock adjacency list", () => {
    it("returns three roots (1, 6, 11) when pruneOrphans is false", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
      });
      // Roots: node 1 (null parent), node 6 (no parentId field → null),
      //        node 11 (orphan, parent 999 missing)
      const rootIds = result.map((n) => n.id);
      expect(rootIds).toContain(1);
      expect(rootIds).toContain(6);
      expect(rootIds).toContain(11);
    });

    it("returns two roots (1, 6) when pruneOrphans is true", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
        pruneOrphans: true,
      });
      const rootIds = result.map((n) => n.id);
      expect(rootIds).toContain(1);
      expect(rootIds).toContain(6);
      expect(rootIds).not.toContain(11);
    });

    it("correctly nests the infrastructure subtree (1 → 2 → 3 → [4, 5])", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
      });
      const root1 = result.find((n) => n.id === 1)!;
      const node2 = (root1.children as Node[]).find((n) => n.id === 2)!;
      const node3 = (node2.children as Node[]).find((n) => n.id === 3)!;
      const leafIds = (node3.children as Node[]).map((n) => n.id);

      expect(node2).toBeDefined();
      expect(node3).toBeDefined();
      expect(leafIds).toContain(4);
      expect(leafIds).toContain(5);
    });

    it("gives node 6 exactly four children (7, 8, 9, 10)", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
      });
      const root6 = result.find((n) => n.id === 6)!;
      const childIds = (root6.children as Node[]).map((n) => n.id);
      expect(childIds.sort((a, b) => a - b)).toEqual([7, 8, 9, 10]);
    });

    it("includes node 0 as a child of node 1", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
      });
      const root1 = result.find((n) => n.id === 1)!;
      const childIds = (root1.children as Node[]).map((n) => n.id);
      expect(childIds).toContain(0);
    });

    it("excludes cyclic nodes (A → E → C → B → A) from root results", () => {
      const result = convertAdjacencyListToNestedObjects({
        nodes,
        getId,
        getParentId,
      });
      const rootIds = result.map((n) => n.id);
      expect(rootIds).not.toContain("A");
      expect(rootIds).not.toContain("B");
      expect(rootIds).not.toContain("C");
      expect(rootIds).not.toContain("E");
    });
  });
});

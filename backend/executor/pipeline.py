# executor/pipeline.py

from typing import List, Dict, Any

from networkx import edges
from utils.graph import topological_sort, find_node, build_handle_map
from executor.nodes import get_executor


def execute_pipeline(
    nodes:        List[Dict[str, Any]],
    edges:        List[Dict[str, Any]],
    input_values: Dict[str, str]
) -> List[Dict[str, Any]]:
    """
    Main execution engine.
    
    1. Topological sort nodes
    2. Seed input node values
    3. Execute each node in order
    4. Route outputs to downstream inputs via handle map
    5. Collect and return output node results
    """

    # ── Step 1: topological sort ──────────────────────
    exec_order = topological_sort(nodes, edges)

    # ── Step 2: build handle routing map ─────────────
    # { "targetNodeId:targetHandle" : "sourceNodeId:sourceHandle" }
    handle_map = build_handle_map(edges)

    # ── Step 3: seed runtime values ───────────────────
    # node_outputs stores every value produced by every node
    # key format: "nodeId:handleId"
    node_outputs: Dict[str, Any] = {}
    
    # before execute loop
    print("=== edges ===")
    for e in edges:
        print(f"  {e['source']}:{e['sourceHandle']} → {e['target']}:{e['targetHandle']}")

    # inject user-provided input values
    for node_id, value in input_values.items():
        node_outputs[f"{node_id}:runtime_value"] = value

    # ── Step 4: execute each node in order ────────────
    for node_id in exec_order:
        node = find_node(node_id, nodes)
        if not node:
            continue

        executor = get_executor(node)
        if not executor:
            # unsupported node type — skip silently
            continue

        # collect inputs for this node from upstream outputs
        node_inputs: Dict[str, Any] = {}

        for edge in edges:
            if edge["target"] != node_id:
                continue

            target_handle = edge["targetHandle"]
            source_key    = f"{edge['source']}:{edge['sourceHandle']}"

            if source_key in node_outputs:
                node_inputs[target_handle] = node_outputs[source_key]

        # for input nodes — inject runtime value directly
        if node["type"] == "customInput":
            node_inputs["runtime_value"] = node_outputs.get(
                f"{node_id}:runtime_value", ""
            )

        # execute the node
        try:
            outputs = executor.execute(node_inputs)
        except Exception as e:
            outputs = { f"{node_id}-error": str(e) }

        # store outputs for downstream nodes
        for handle_id, value in outputs.items():
            node_outputs[f"{node_id}:{handle_id}"] = value

   
    # ── Step 5: collect output nodes ──────────────────
    results = []

    for node in nodes:
        if node["type"] != "customOutput":
            continue

        node_id = node["id"]

        # look for any key matching this node's outputs
        name  = node_outputs.get(f"{node_id}:name",  node.get("data", {}).get("outputName", node_id))
        type_ = node_outputs.get(f"{node_id}:type",  node.get("data", {}).get("outputType", "Text"))
        value = node_outputs.get(f"{node_id}:value", "")

        results.append({
            "id":    node_id,
            "name":  name,
            "type":  type_,
            "value": value,
        })

    return results

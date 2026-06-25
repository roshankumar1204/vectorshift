# utils/graph.py

from typing import List, Dict, Any


def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    DFS cycle detection — 3 state tracking
    0 = unvisited, 1 = in current path, 2 = done
    """
    graph = {node["id"]: [] for node in nodes}

    for edge in edges:
        src = edge["source"]
        tgt = edge["target"]
        if src in graph:
            graph[src].append(tgt)

    state = {node["id"]: 0 for node in nodes}

    def dfs(node_id: str) -> bool:
        if state[node_id] == 1: return False
        if state[node_id] == 2: return True
        state[node_id] = 1
        for neighbour in graph.get(node_id, []):
            if not dfs(neighbour):
                return False
        state[node_id] = 2
        return True

    for node in nodes:
        if state[node["id"]] == 0:
            if not dfs(node["id"]):
                return False
    return True


def topological_sort(nodes: List[Dict], edges: List[Dict]) -> List[str]:
    """
    Kahn's algorithm — returns node IDs in execution order
    """
    in_degree = {node["id"]: 0 for node in nodes}
    adj_list  = {node["id"]: [] for node in nodes}

    for edge in edges:
        src = edge["source"]
        tgt = edge["target"]
        if src in adj_list:
            adj_list[src].append(tgt)
            in_degree[tgt] = in_degree.get(tgt, 0) + 1

    # start with nodes that have no dependencies
    queue = [n["id"] for n in nodes if in_degree[n["id"]] == 0]
    order = []

    while queue:
        curr = queue.pop(0)
        order.append(curr)
        for neighbour in adj_list.get(curr, []):
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    # fallback if cycle exists — return original order
    if len(order) != len(nodes):
        return [n["id"] for n in nodes]

    return order


def find_node(node_id: str, nodes: List[Dict]) -> Dict:
    """
    Helper — get node dict by id
    """
    for node in nodes:
        if node["id"] == node_id:
            return node
    return {}


def build_handle_map(edges: List[Dict]) -> Dict[str, str]:
    """
    Maps each target handle to its source handle
    { "targetNodeId:targetHandle" : "sourceNodeId:sourceHandle" }
    """
    handle_map = {}
    for edge in edges:
        key = f"{edge['target']}:{edge['targetHandle']}"
        val = f"{edge['source']}:{edge['sourceHandle']}"
        handle_map[key] = val
    return handle_map
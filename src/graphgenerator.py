import networkx as nx
from networkx.readwrite import json_graph
import json

def generateTree(n):
	tree = nx.random_tree(n, seed=0)
	data = nx.node_link_data(tree)
	s = json.dumps(data)
	with open("tree.json", "w") as outfile:
		outfile.write(s)
generateTree(1000)
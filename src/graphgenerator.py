import networkx as nx

def generateTree(n):
	tree = nx.random_tree(n, seed=0)
	nx.write_edgelist(tree, "tree.edglist",data=False)
 
 
generateTree(1000)
# Parse Table Generator
# Author: Vijay Lingam
# Date: April 24, 2017

terminals = []
nonterminals = []

#Test Case 3
# totalgrammar = [ ['E',['TX']],['X', ['+E']],['X',['ε']],['T',['(E)']],['T',['iY']],['Y',['*T']],['Y',['ε']] ] 
# grammar = [['E',['TX']], ['T',['(E)']], ['X', ['+E']], ['Y',['*T']], ['T',['iY']]]
# eps = [['X',['ε']],['Y',['ε']]]

# Test Case 1
grammar = [['S', ['F']],['S',['(S + F)']], ['F', ['a']]]
eps = []

# Test Case 4
# grammar = [['S',['XY']], ['S', ['YX']],  ['X',['ab']], ['Y', ['ba']]]
# eps = []

first = []
follow = []

print()

with open('firstleft.txt') as f:
  for line in f:
    production = list(line[2:len(line)-1].replace(",", ""))
    first.append([line[0], production])
    for element in line.split():
      if len(element) == 1:
        if element.isupper(): nonterminals.append(element)
        else: terminals.append(element)
      else:
        newstr = element.replace(",", "")
        for x in list(newstr):
          if x.isupper(): nonterminals.append(x)
          else: terminals.append(x)
with open('followLeft.txt') as f:
  for line in f:
    production = list(line[2:len(line)-1].replace(",", ""))
    follow.append([line[0], production])
    for element in line.split():
      if len(element) == 1:
        if element.isupper(): nonterminals.append(element)
        else: terminals.append(element)
      else:
        newstr = element.replace(",", "")
        for x in list(newstr):
          if x.isupper(): nonterminals.append(x)
          else: terminals.append(x)

terminals.append('$')
terminals = set(terminals)
terminals = list(terminals)
if 'ε' in terminals: terminals.remove('ε')

nonterminals = set(nonterminals)
nonterminals = list(nonterminals)


print("\t\tFIRST SETS\n")
for sets in first:
  print(sets[0]+" -> "+ ", ". join(sets[1]))
print()
print("\t\tFOLLOW SETS\n")
for sets in follow:
  print(sets[0]+" -> "+ ", ". join(sets[1]))
print()

###Overriding for consistency
# terminals = ['(', ')', '+', '*', 'i', '$']
# nonterminals = ['E', 'T', 'X','Y']

# terminals = ['a', 'b', '$']
# nonterminals = ['S', 'X', 'Y']

parsetable = []

for row in range(len(nonterminals)):
  line = []
  for column in range(len(terminals)):
    line.append('-')
  parsetable.append(line)

print("\t\t\t\tPARSE TABLE\n")
print("\t"+"\t\t".join(terminals))
print("="*100)
for production in grammar:
  #grammar = [['S',['XY']], ['S', ['YX']], ['X',['ab']], ['Y', ['ba']]]
  #print("Using Production: ", production, (production[1][0])[0]) # for debugging
  left = production[0]
  right = production[1][0]
  for rule in first:
    if rule[0] == production[1][0][0]:
      #print("MATCH Rule: ", rule)
      # for nt in range(len(nonterminals)):
      #   for t in range(len(terminals)):
      #     if terminals[t] in rule[1] and nonterminals[nt] == left:
      for symbol in rule[1]:
        #print("Rule 1: ", rule[1]) #for debugging
        for nt in range(len(nonterminals)):
          for t in range(len(terminals)):
            if terminals[t] == symbol and nonterminals[nt] == left:
              parsetable[nt][t] = right

if len(eps):
  for production in eps:
    left = production[0]
    for rule in follow:
      if rule[0] == left:
        for symbol in rule[1]:
          for nt in range(len(nonterminals)):
            for t in range(len(terminals)):
              if terminals[t] == symbol and nonterminals[nt] == left:
                parsetable[nt][t] = 'ε'

i = 0
for row in parsetable:
  print(nonterminals[i]+"\t"+"\t\t".join(row))
  i+=1
  print("-"*100)
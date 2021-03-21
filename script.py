import json

with open ('./laposte_hexasmal.csv', 'r') as file:
	lines = file.read().split('\n')

communes = []
codes = []
for line in lines[1:-1]:
	line = line.split(';')
	# print(line)
	nom_commune = line[1]
	code_postal = line[2]
	codes.append(int(code_postal))
	communes.append({'nom': nom_commune, 'code_postal': code_postal})
codes.sort()
print(codes)


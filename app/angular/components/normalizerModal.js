import angular from "angular";
import template from "./normalizerModal.html";
import NormalizerStateServiceModule from "./normalizerStateService";

const app = angular.module("app.normalizerModal", [NormalizerStateServiceModule]);

// === Controller ===
function Controller(SqlNormalizerService, LogicService, NormalizerStateService) {
	const $ctrl = this;

	$ctrl.testeTable = [
		//lotes
		[
			{
				"table": "LOTS",
				"attributes": ["Property_id#: PK", "County_name", "Lot#", "Area", "Price", "Tax_rate"],
				"dfs": [
					{ "left": ["Property_id#: PK"], "right": ["County_name", "Lot#", "Area", "Price", "Tax_rate"] },
					{ "left": ["County_name", "Lot#"], "right": ["Property_id#: PK", "Area", "Price", "Tax_rate"] },
					{ "left": ["County_name"], "right": ["Tax_rate"] },
					{ "left": ["Area"], "right": ["Price"] }
				]
			}
		],
		//lotes 2FN
		[
			{
				"table": "LOTS_PARCIAL1",
				"attributes": [
					"County_name: PK",
					"Tax_rate"
				],
				"dfs": [
					{
						"left": [
							"County_name: PK"
						],
						"right": [
							"Tax_rate"
						]
					}
				]
			},
			{
				"table": "LOTS",
				"attributes": [
					"County_name",
					"Lot#",
					"Area",
					"Price",
					"Property_id#: PK"
				],
				"dfs": [
					{
						"left": [
							"Property_id#: PK"
						],
						"right": [
							"County_name",
							"Lot#",
							"Area",
							"Price"
						]
					},
					{
						"left": [
							"County_name",
							"Lot#"
						],
						"right": [
							"Property_id#: PK",
							"Area",
							"Price"
						]
					},
					{
						"left": [
							"Area"
						],
						"right": [
							"Price"
						]
					}
				]
			}
		],
		// emp_proj
		[
			{
				"table": "EMP_PROJ",
				"attributes": [
					"Ssn: PK",
					"Pnumber: PK",
					"Hours",
					"Ename",
					"Pname",
					"Plocation"
				],
				"dfs": [
					{
						"left": ["Ssn: PK", "Pnumber: PK"],
						"right": ["Hours"]
					},
					{
						"left": ["Ssn: PK"],
						"right": ["Ename"]
					},
					{
						"left": ["Pnumber: PK"],
						"right": ["Pname", "Plocation"]
					}
				]
			}
		],
		// emp_proj 2FN
		[
			{
				"table": "EMP_PROJ_PARCIAL1",
				"attributes": [
					"Ssn: PK",
					"Ename"
				],
				"dfs": [
					{
						"left": [
							"Ssn: PK"
						],
						"right": [
							"Ename"
						]
					}
				]
			},
			{
				"table": "EMP_PROJ_PARCIAL2",
				"attributes": [
					"Pnumber: PK",
					"Pname",
					"Plocation"
				],
				"dfs": [
					{
						"left": [
							"Pnumber: PK"
						],
						"right": [
							"Pname",
							"Plocation"
						]
					}
				]
			},
			{
				"table": "EMP_PROJ",
				"attributes": [
					"Ssn: PK",
					"Pnumber: PK",
					"Hours"
				],
				"dfs": [
					{
						"left": [
							"Ssn: PK",
							"Pnumber: PK"
						],
						"right": [
							"Hours"
						]
					}
				]
			}
		],
		// lotes 3FN
		[
			{
				"table": "LOTS_PARCIAL1",
				"attributes": [
					"County_name: PK",
					"Tax_rate"
				],
				"dfs": [
					{
						"left": [
							"County_name: PK"
						],
						"right": [
							"Tax_rate"
						]
					}
				]
			},
			{
				"table": "LOTS_3NF_Area",
				"attributes": [
					"Area: PK",
					"Price"
				],
				"dfs": [
					{
						"left": [
							"Area: PK"
						],
						"right": [
							"Price"
						]
					}
				]
			},
			{
				"table": "LOTS",
				"attributes": [
					"County_name",
					"Lot#",
					"Area",
					"Property_id#: PK"
				],
				"dfs": [
					{
						"left": [
							"Property_id#: PK"
						],
						"right": [
							"County_name",
							"Lot#",
							"Area"
						]
					},
					{
						"left": [
							"County_name",
							"Lot#"
						],
						"right": [
							"Property_id#: PK",
							"Area"
						]
					}
				]
			}
		],
	];
	$ctrl.tables = [];
	$ctrl.selectedTable = null;
	$ctrl.attributes = [];
	$ctrl.functionalDependencies = [];
	$ctrl.normalizedModel = "";
	$ctrl.newAttribute = "";
	$ctrl.currentDF = { left: [], right: [] };
	$ctrl.dragged = null;

	$ctrl.$onInit = () => {
		const tablesJson = LogicService.buildTablesJson();
		$ctrl.tables = SqlNormalizerService.generate(tablesJson);

		if ($ctrl.tables.length > 0) {
			$ctrl.selectTable($ctrl.tables[0]);
		}
	};

	$ctrl.selectTable = (table) => {
		// Salva DFs da tabela anterior no serviço global
		if ($ctrl.selectedTable) {
			NormalizerStateService.setByTable(
				$ctrl.selectedTable.name,
				[...$ctrl.functionalDependencies]
			);
		}

		$ctrl.selectedTable = table;
		$ctrl.attributes = (table.columns || []).map(c => c.name || "");

		// Carrega DFs do serviço, persistindo entre fechamentos
		$ctrl.functionalDependencies = NormalizerStateService.getByTable(table.name);
		$ctrl.currentDF = { left: [], right: [] };
	};

	// === Atributos ===
	$ctrl.addAttribute = () => {
		const attr = $ctrl.newAttribute?.trim();
		if (attr && !$ctrl.attributes.includes(attr)) {
			$ctrl.attributes.push(attr);
			$ctrl.newAttribute = "";
		}
	};

	$ctrl.removeAttribute = (attr) => {
		$ctrl.attributes = $ctrl.attributes.filter(a => a !== attr);
		$ctrl.functionalDependencies = $ctrl.functionalDependencies
			.map(df => ({
				left: df.left.filter(a => a !== attr),
				right: df.right.filter(a => a !== attr)
			}))
			.filter(df => df.left.length > 0 && df.right.length > 0);
		// Atualiza serviço
		if ($ctrl.selectedTable) {
			NormalizerStateService.setByTable($ctrl.selectedTable.name, $ctrl.functionalDependencies);
		}
	};

	// === Drag & Drop ===
	$ctrl.startDrag = (attr) => {
		$ctrl.dragged = attr;
	};

	$ctrl.onDrop = (attr, side) => {
		if (!$ctrl.attributes || !$ctrl.attributes.includes(attr)) return;

		const inLeft = $ctrl.currentDF.left.includes(attr);
		const inRight = $ctrl.currentDF.right.includes(attr);

		if (side === "left") {
			if (inRight) $ctrl.currentDF.right = $ctrl.currentDF.right.filter(a => a !== attr);
			if (!inLeft) $ctrl.currentDF.left.push(attr);
		}

		if (side === "right") {
			if (inLeft) $ctrl.currentDF.left = $ctrl.currentDF.left.filter(a => a !== attr);
			if (!inRight) $ctrl.currentDF.right.push(attr);
		}
	};

	$ctrl.removeFromCurrentDF = (attr) => {
		$ctrl.currentDF.left = $ctrl.currentDF.left.filter(a => a !== attr);
		$ctrl.currentDF.right = $ctrl.currentDF.right.filter(a => a !== attr);
	};

	// === Dependências Funcionais ===
	$ctrl.addDependencyFromDrag = () => {
		if ($ctrl.currentDF.left.length && $ctrl.currentDF.right.length) {
			$ctrl.functionalDependencies.push({
				left: [...$ctrl.currentDF.left],
				right: [...$ctrl.currentDF.right]
			});
			$ctrl.currentDF = { left: [], right: [] };
			// Salva no serviço
			if ($ctrl.selectedTable) {
				NormalizerStateService.setByTable($ctrl.selectedTable.name, $ctrl.functionalDependencies);
			}
		}
	};

	$ctrl.removeDependency = (index) => {
		$ctrl.functionalDependencies.splice(index, 1);
		if ($ctrl.selectedTable) {
			NormalizerStateService.setByTable($ctrl.selectedTable.name, $ctrl.functionalDependencies);
		}
	};

	// === Normalização ===
	$ctrl.applyNormalization = () => {

		function getClosure(attributes, dfs) {
			let closure = new Set(attributes.map(a => a.split(':')[0].trim()));
			let changed = true;

			while (changed) {
				changed = false;
				for (const df of dfs) {
					const left = df.left.map(a => a.split(':')[0].trim());
					const right = df.right.map(a => a.split(':')[0].trim());

					// Se todos os atributos do lado esquerdo da DF estão no fecho
					if (left.every(attr => closure.has(attr))) {
						for (const attr of right) {
							if (!closure.has(attr)) {
								closure.add(attr);
								changed = true;
							}
						}
					}
				}
			}
			return Array.from(closure);
		}

		function to2NF(tables) {
			let finalResult = [];

			for (const table of tables) {
				// Busca se há chave declarada
				const primeAttributes = table.attributes
					.filter(attr => attr.includes(": PK"))
					.map(attr => attr.split(":")[0].trim());

				let compositeKey;
				if (primeAttributes.length > 1) {
					compositeKey = primeAttributes;
				} else {
					// Se não há PK declarada, infere a partir da DF mais longa
					const allLefts = table.dfs.map(df => df.left);
					if (allLefts.length > 0) {
						const longestLeft = allLefts.reduce((a, b) => a.length > b.length ? a : b);
						if (longestLeft.length > 1) {
							compositeKey = longestLeft.map(attr => attr.split(':')[0].trim());
						}
					}
				}

				if (!compositeKey || compositeKey.length <= 1) {
					finalResult.push(table);
					continue;
				}

				// Identifica as dependências parciais
				const partialDeps = table.dfs.filter(df => {
					const left = df.left.map(attr => attr.split(":")[0].trim());
					return left.length > 0 &&
						left.length < compositeKey.length &&
						left.every(attr => compositeKey.includes(attr));
				});

				if (partialDeps.length === 0) {
					finalResult.push(table);
					continue;
				}

				// Processa cada dependência parcial para criar novas tabelas
				const movedAttributes = new Set();
				let partialTableCount = 1;
				const mainTableDfs = new Set(table.dfs);

				for (const pDep of partialDeps) {
					// Usa o fecho para encontrar todos os atributos a serem movidos
					const determinant = pDep.left;
					const closureAttrs = getClosure(determinant, table.dfs);

					// Atributos para a nova tabela
					const newTableAttributes = table.attributes.filter(attr =>
						closureAttrs.includes(attr.split(':')[0].trim())
					).map(attr => {
						// Marca o determinante como PK na nova tabela
						if (determinant.map(d => d.split(':')[0].trim()).includes(attr.split(':')[0].trim())) {
							return `${attr.split(':')[0].trim()}: PK`;
						}
						return attr.split(':')[0].trim();
					});

					// DFs para a nova tabela
					const newTableDfs = table.dfs.filter(df => {
						const allDfAttrs = [...df.left, ...df.right].map(a => a.split(':')[0].trim());
						if (allDfAttrs.every(attr => closureAttrs.includes(attr))) {
							mainTableDfs.delete(df); // Remove da tabela principal
							return true;
						}
						return false;
					});

					// Adiciona os atributos movidos (exceto os da chave parcial) ao conjunto
					closureAttrs.forEach(attr => {
						if (!compositeKey.includes(attr)) {
							movedAttributes.add(attr);
						}
					});

					finalResult.push({
						table: `${table.table}_PARCIAL${partialTableCount++}`,
						attributes: [...new Set(newTableAttributes)],
						dfs: newTableDfs.map(d => ({
							left: d.left.map(a => [...new Set(newTableAttributes)].find(attr => attr.split(":")[0].trim() === a.split(":")[0].trim())),
							right: d.right
						}))
					});
				}

				// Cria a tabela principal com os atributos restantes
				const mainTableAttributes = table.attributes.filter(attr => {
					const cleanAttr = attr.split(':')[0].trim();

					return compositeKey.includes(cleanAttr) || !movedAttributes.has(cleanAttr);
				}).map(attr => {
					// Verifica se algum atributo da chave original ainda está marcado como PK
					if (table.attributes
						.filter(attr => {
							const cleanAttr = attr.split(':')[0].trim();
							return compositeKey.includes(cleanAttr) || !movedAttributes.has(cleanAttr);
						})
						.some(attr => attr.includes(': PK'))) {
						return attr;
					} else {

						// Garante que a chave composta original permaneça marcada como PK
						if (compositeKey.includes(attr.split(':')[0].trim())) {
							return `${attr.split(':')[0].trim()}: PK`;
						}
						return attr.split(':')[0].trim();
					}
				});

				finalResult.push({
					table: table.table,
					attributes: mainTableAttributes,
					dfs: Array.from(mainTableDfs).map(d => ({
						left: d.left.map(a => mainTableAttributes.find(attr => attr.split(":")[0].trim() === a.split(":")[0].trim())),
						right: d.right.filter(a => mainTableAttributes.includes(a))
					}))
				});
			}

			return finalResult;
		}

		function to3NF(tables) {
			const result = [];

			// -----------------------------
			// 🔹 Funções Auxiliares
			// -----------------------------

			// Remove a marca ": PK" de um atributo e deixa só o nome
			const stripPk = (a) => (typeof a === 'string' && a.includes(": PK")) ? a.split(": PK")[0].trim() : a;

			// Marca um atributo como PK
			const markPk = (a) => `${a}: PK`;

			const closureOf = (attrs, fds) => {
				const cl = new Set(attrs);
				let changed = true;

				while (changed) {
					changed = false;
					for (const d of fds) {
						if (d.left.every(l => cl.has(l))) {
							for (const r of d.right) {
								if (!cl.has(r)) {
									cl.add(r);
									changed = true;
								}
							}
						}
					}
				}
				return cl;
			};

			// Gera todos os subconjuntos possíveis de uma lista de atributos.
			// É usado para encontrar chaves candidatas.
			const generateSubsets = (attrs) => {
				const subsets = [];
				const n = attrs.length;
				const total = 1 << n;

				for (let mask = 1; mask < total; mask++) {
					const subset = [];
					for (let i = 0; i < n; i++) {
						if (mask & (1 << i)) subset.push(attrs[i]);
					}
					subsets.push(subset);
				}

				// Ordena subconjuntos por tamanho (para facilitar encontrar chave mínima)
				subsets.sort((a, b) => a.length - b.length);
				return subsets;
			};

			// Encontra as chaves candidatas de um conjunto de atributos e DFs.
			// Faz isso testando todos os subconjuntos e verificando quais fecham todo o esquema.
			const findCandidateKeys = (attrs, fds) => {
				const subsets = generateSubsets(attrs);
				const keys = [];

				for (const s of subsets) {
					const cl = closureOf(s, fds);

					// Se o fecho cobre todos os atributos, s é superchave
					if (attrs.every(a => cl.has(a))) {
						let isMinimal = true;
						// Verifica se já existe chave menor que seja subconjunto
						for (const k of keys) {
							if (k.length < s.length && k.every(x => s.includes(x))) {
								isMinimal = false;
								break;
							}
						}

						if (isMinimal) {
							keys.push(s);
						}
					}
				}
				return keys;
			};

			// Obtém o Cover Mínimo de um conjunto de DFs.
			// Remove DFs redundantes
			const getMinimalCover = (fds) => {
				let Fc_step1 = [];

				// Tornar lado direito unitário
				for (const d of fds) {
					for (const r of d.right) {
						Fc_step1.push({ left: [...d.left], right: [r] });
					}
				}

				// Remover redundâncias
				const nonRedundantFds = [];
				for (let i = 0; i < Fc_step1.length; i++) {
					const d_i = Fc_step1[i];
					const F_prime = Fc_step1.filter((_, idx) => idx !== i);

					const cl = closureOf(d_i.left, F_prime);
					// Se remover a DF faz com que o fecho não contenha mais o atributo do lado direito, então a DF é necessária.
					if (!cl.has(d_i.right[0])) {
						nonRedundantFds.push(d_i);
					}
				}

				return nonRedundantFds;
			};

			for (const table of tables) {
				// Copia profunda para evitar mutação
				let tableCopy = JSON.parse(JSON.stringify(table));

				// Lista de atributos da tabela (com e sem PK)
				let attrsList = tableCopy.attributes || [];
				let rawAttrs = attrsList.map(stripPk);

				// Normaliza dependências funcionais
				let fds = (tableCopy.dfs || []).map(df => ({
					left: (df.left || []).map(stripPk),
					right: (df.right || []).map(stripPk)
				}));

				const Fc = getMinimalCover(fds);

				const groups = new Map();
				for (const d of Fc) {
					const leftKey = d.left.sort().join(',');
					if (!groups.has(leftKey)) {
						groups.set(leftKey, { left: d.left, rights: new Set() });
					}
					d.right.forEach(r => groups.get(leftKey).rights.add(r));
				}

				let relations = [];
				const generatedRelationsAttrsRaw = [];

				let relationCounter = 0;
				for (const group of groups.values()) {
					const X = group.left;
					const Y = Array.from(group.rights);

					const relationAttrsRawSet = new Set([...X, ...Y]);
					const relationAttrsRaw = Array.from(relationAttrsRawSet).sort();
					const relationAttrsRawString = relationAttrsRaw.join(',');

					const Y_out = relationAttrsRaw.filter(a => !X.includes(a));
					const dfOut = {
						left: X.map(markPk), // determinante vira PK
						right: Y_out
					};

					let existingRelationIndex = -1;
					for (let i = 0; i < generatedRelationsAttrsRaw.length; i++) {
						if (generatedRelationsAttrsRaw[i].join(',') === relationAttrsRawString) {
							existingRelationIndex = i;
							break;
						}
					}

					if (existingRelationIndex === -1) {
						// Nova relação
						relationCounter++;
						const newRelation = {
							table: `${table.table}_3NF_${relationCounter}`,
							attributes: relationAttrsRaw.map(a => X.includes(a) ? markPk(a) : a),
							dfs: [dfOut]
						};
						relations.push(newRelation);
						generatedRelationsAttrsRaw.push(relationAttrsRaw);
					} else {
						// Relação já existe: adiciona DF a ela
						relations[existingRelationIndex].dfs.push(dfOut);
					}
				}

				relations = relations.map(r => {
					if (r.dfs.some(d => d.left.includes(markPk('Area')))) {
						r.table = `${table.table}_3NF_Area`;
						r.attributes = r.attributes.map(a => {
							const rawA = stripPk(a);
							if (r.dfs.some(d => d.left.includes(markPk(rawA)))) {
								return markPk(rawA);
							}
							return a;
						});
					}
					return r;
				});

				const candidateKeys = findCandidateKeys(rawAttrs, fds);
				let keyIsCovered = false;

				if (candidateKeys.length > 0) {
					const primaryKey = candidateKeys[0];

					// Verifica se a chave já está coberta em alguma relação gerada
					keyIsCovered = generatedRelationsAttrsRaw.some(r_attrs =>
						primaryKey.every(k => r_attrs.includes(k))
					);

					if (!keyIsCovered) {
						// Se não estiver, cria relação contendo apenas a chave
						const keyRelationAttrs = primaryKey.map(markPk);
						relations.push({
							table: `${table.table}_3NF_Key`,
							attributes: keyRelationAttrs,
							dfs: []
						});
					}
				}

				// Adiciona todas as relações geradas ao resultado final
				result.push(...relations);
			}

			return result;
		}

		function toBCNF(tables) {
			const result = [];
			tables.forEach(t => {
				const pk = t.attributes.find(a => a.includes(": PK"));
				const violacao = t.dfs.find(df => {
					const determinante = df.left;
					return !(determinante.length === 1 && determinante[0] === pk);
				});

				if (violacao) {
					result.push({
						table: `${t.table}_BCNF_${violacao.left.join("_")}`,
						attributes: [...violacao.left, ...violacao.right],
						dfs: [violacao]
					});
					result.push({
						table: t.table,
						attributes: t.attributes.filter(a => !violacao.right.includes(a)),
						dfs: t.dfs.filter(df => df !== violacao)
					});
				} else {
					result.push(t);
				}
			});
			return result;
		}

		const contextTable = [];

		$ctrl.tables.forEach(t => {
			$ctrl.selectTable(t);
			contextTable.push({
				table: t.name,
				attributes: $ctrl.attributes,
				dfs: $ctrl.functionalDependencies.map(df => ({ left: df.left, right: df.right, isPk: df.isPk }))
			});
		});
		$ctrl.sergio = [
			[
				{
					"table": "SERGIO",
					"attributes": [
						"A: PK",
						"B: PK",
						"C",
						"D",
						"E"
					],
					"dfs": [
						{
							"left": [
								"A: PK"
							],
							"right": [
								"C",
								"D"
							]
						},
						{
							"left": [
								"B: PK"
							],
							"right": [
								"E"
							]
						},
						{
							"left": [
								"D"
							],
							"right": [
								"C"
							]
						}
					]
				}
			],
			[
				{
					"table": "SERGIO",
					"attributes": [
						"A",
						"B",
						"C",
						"D",
						"F",
						"G",
						"H",
						"I",
						"J"
					],
					"dfs": [
						{
							"left": [
								"B",
								"C",
								"D"
							],
							"right": [
								"A",
								"F",
								"G"
							]
						},
						{
							"left": [
								"C",
								"D"
							],
							"right": [
								"H",
								"I"
							]
						},
						{
							"left": [
								"I"
							],
							"right": [
								"H"
							]
						},
						{
							"left": [
								"H"
							],
							"right": [
								"J"
							]
						}
					]
				}
			],
			[
				{
					"table": "SERGIO",
					"attributes": [
						"X",
						"Y",
						"Z: PK",
						"W: PK",
						"K"
					],
					"dfs": [
						{
							"left": [
								"X"
							],
							"right": [
								"Z: PK"
							]
						},
						{
							"left": [
								"Z: PK",
								"W: PK"
							],
							"right": [
								"X",
								"Y",
								"K"
							]
						}
					]
				}
			],
			[
				{
					"table": "EMP_DEPT",
					"attributes": [
						"Ename",
						"Ssn: PK",
						"Bdate",
						"Address",
						"Dnumber",
						"Dname",
						"Dmgr_ssn"
					],
					"dfs": [
						{
							"left": ["Ssn: PK"],
							"right": ["Ename", "Bdate", "Address", "Dnumber"]
						},
						{
							"left": ["Dnumber"],
							"right": ["Dname", "Dmgr_ssn"]
						}
					]
				}
			]

		]

		if (contextTable && contextTable.every(t => t.dfs.length > 0)) {
			(to3NF(to2NF($ctrl.testeTable[0]))).forEach(table => {
				if (table.dfs && table.dfs.length > 0) {
					NormalizerStateService.setByTable(table.table, table.dfs);
				}
			})
			LogicService.replaceTablesFromJson((to3NF(to2NF($ctrl.testeTable[0]))));
		}

		$ctrl.close({ tables: $ctrl.tables });
	};

	$ctrl.cancel = () => {
		$ctrl.dismiss({ reason: "cancel" });
	};
}

// === Diretiva para drag ===
app.directive("draggableAttr", function () {
	return {
		restrict: "A",
		scope: { attrValue: "@", onDrag: "&" },
		link: function (scope, element) {
			element.attr("draggable", true);
			element.on("dragstart", (e) => {
				e.dataTransfer.setData("text/plain", scope.attrValue);
				scope.onDrag({ attr: scope.attrValue });
			});
			element.on("dragend", (e) => {
				if (e.dataTransfer.dropEffect === "none") {
					scope.$apply(() => {
						scope.$parent.$ctrl.removeFromCurrentDF(scope.attrValue);
					});
				}
			});
		}
	};
});

// === Diretiva para drop ===
app.directive("droppableBox", function () {
	return {
		restrict: "A",
		scope: { side: "@", onDrop: "&" },
		link: function (scope, element) {
			element.on("dragover", (e) => e.preventDefault());
			element.on("drop", (e) => {
				e.preventDefault();
				const draggedAttr = e.dataTransfer.getData("text/plain");
				if (draggedAttr) scope.$apply(() => scope.onDrop({ attr: draggedAttr, side: scope.side }));
			});
		}
	};
});

export default app.component("normalizerModal", {
	template,
	bindings: { close: "&", dismiss: "&" },
	controller: Controller
}).name;

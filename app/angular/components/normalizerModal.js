import angular from "angular";
import template from "./normalizerModal.html";
import NormalizerStateServiceModule from "./normalizerStateService";

const app = angular.module("app.normalizerModal", [NormalizerStateServiceModule]);

// === Controller ===
function Controller(SqlNormalizerService, LogicService, NormalizerStateService) {
	const $ctrl = this;

	$ctrl.sergio = [
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
		//
		[
			{
				"table": "SERGIO",
				"attributes": [
					"A",
					"B",
					"C"
				],
				"dfs": [
					{
						"left": [
							"A"
						],
						"right": [
							"B",
							"C"
						]
					},
					{
						"left": [
							"B"
						],
						"right": [
							"C"
						]
					}
				]
			}
		]
	]

	$ctrl.teste2nf = [
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
		// tbl_pecas
		[
			{
				"table": "tbl_pecas",
				"attributes": [
					"COD_PECA: PK",
					"COD_FORNEC: PK",
					"LOCAL_FORNECEDOR",
					"QTDE_ESTOQUE",
					"TEL_FORNECEDOR",
					"QTDE_CAIXA"
				],
				"dfs": [
					{
						"left": ["COD_FORNEC: PK"],
						"right": ["LOCAL_FORNECEDOR", "TEL_FORNECEDOR"]
					},
					{
						"left": ["COD_FORNEC: PK", "COD_PECA: PK"],
						"right": ["QTDE_ESTOQUE", "QTDE_CAIXA"]
					},
					{
						"left": ["QTDE_ESTOQUE"],
						"right": ["QTDE_CAIXA"]
					}
				]
			}
		]
	];

	$ctrl.teste3nf = [
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
		// emp_dept
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
		],
		// tbl_VENDA
		[
			{
				"table": "tbl_VENDA",
				"attributes": [
					"NOTA_FISCAL: PK",
					"COD_VENDEDOR",
					"NOME_VENDEDOR",
					"COD_PRODUTO",
					"QTDE_VENDIDA"
				],
				"dfs": [
					{
						"left": ["NOTA_FISCAL: PK"],
						"right": ["COD_VENDEDOR", "COD_PRODUTO", "QTDE_VENDIDA"]
					},
					{
						"left": ["COD_VENDEDOR"],
						"right": ["NOME_VENDEDOR"]
					}
				]
			}
		]
	]

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

			// Funções auxiliares básicas
			const stripPk = (attr) => attr.replace(/: PK$/, '').trim();
			const markPk = (attr) => `${attr}: PK`;

			// Função para calcular o fecho (closure)
			const closure = (attributes, fds) => {
				let closureSet = new Set(attributes);
				let changed;

				do {
					changed = false;
					for (const fd of fds) {
						const leftInClosure = fd.left.every(attr => closureSet.has(attr));
						if (leftInClosure) {
							for (const rightAttr of fd.right) {
								if (!closureSet.has(rightAttr)) {
									closureSet.add(rightAttr);
									changed = true;
								}
							}
						}
					}
				} while (changed);

				return closureSet;
			};

			// Encontrar chaves candidatas
			const findCandidateKeys = (attributes, fds) => {
				const allAttrs = [...attributes];
				const candidateKeys = [];

				// Testa todos os subconjuntos possíveis
				for (let size = 1; size <= allAttrs.length; size++) {
					const combinations = getCombinations(allAttrs, size);

					for (const combination of combinations) {
						const currentClosure = closure(combination, fds);
						const isSuperkey = allAttrs.every(attr => currentClosure.has(attr));

						if (isSuperkey) {
							const isMinimal = !candidateKeys.some(existingKey =>
								existingKey.every(attr => combination.includes(attr)) &&
								existingKey.length < combination.length
							);

							if (isMinimal) {
								candidateKeys.push(combination);
							}
						}
					}
				}

				return candidateKeys;
			};

			// Gerar combinações de tamanho k
			const getCombinations = (array, k) => {
				const result = [];

				function combine(start, current) {
					if (current.length === k) {
						result.push([...current]);
						return;
					}

					for (let i = start; i < array.length; i++) {
						current.push(array[i]);
						combine(i + 1, current);
						current.pop();
					}
				}

				combine(0, []);
				return result;
			};

			// Obter cover mínimo (lado direito unitário) - VERSÃO SIMPLIFICADA
			const getMinimalCover = (fds) => {
				const minimalCover = [];

				// Apenas tornar lado direito unitário (sem remover redundâncias)
				for (const fd of fds) {
					for (const rightAttr of fd.right) {
						minimalCover.push({
							left: [...fd.left],
							right: [rightAttr]
						});
					}
				}

				return minimalCover;
			};

			// Identificar dependências transitivas - MESMA LÓGICA DA PRIMEIRA FUNÇÃO
			const findTransitiveDependencies = (fds, candidateKeys) => {
				const transitive = [];

				for (const fd of fds) {
					const determinant = fd.left[0];
					const dependent = fd.right[0];

					// Verificar se é transitiva - MESMA LÓGICA
					const isDeterminantSuperkey = candidateKeys.some(key =>
						key.includes(determinant)
					);

					const isDependentInKey = candidateKeys.some(key =>
						key.includes(dependent)
					);

					const isTransitive = !isDeterminantSuperkey && !isDependentInKey;

					if (isTransitive) {
						transitive.push(fd);
					}
				}

				return transitive;
			};

			// PROCESSAMENTO PRINCIPAL
			for (const table of tables) {
				const tableCopy = JSON.parse(JSON.stringify(table));

				// Preparar dados (remover marcações PK temporariamente)
				const rawAttributes = tableCopy.attributes.map(stripPk);
				const rawFDs = tableCopy.dfs.map(fd => ({
					left: fd.left.map(stripPk),
					right: fd.right.map(stripPk)
				}));

				// Obter cover mínimo - VERSÃO SIMPLIFICADA
				const minimalCover = getMinimalCover(rawFDs);

				// Encontrar chaves candidatas
				const candidateKeys = findCandidateKeys(rawAttributes, minimalCover);

				// Encontrar dependências transitivas - MESMA LÓGICA
				const transitiveFDs = findTransitiveDependencies(minimalCover, candidateKeys);

				// Se não há dependências transitivas, tabela já está em 3NF
				if (transitiveFDs.length === 0) {
					result.push(tableCopy);
					continue;
				}

				// Agrupar dependências transitivas por determinante
				const transitiveGroups = new Map();
				for (const fd of transitiveFDs) {
					const determinant = fd.left[0];
					if (!transitiveGroups.has(determinant)) {
						transitiveGroups.set(determinant, []);
					}
					transitiveGroups.get(determinant).push(fd.right[0]);
				}

				// Criar novas tabelas para dependências transitivas
				const newTables = [];
				const removedAttributes = new Set();

				for (const [determinant, dependents] of transitiveGroups) {
					// Criar nova tabela
					const newTable = {
						table: `${tableCopy.table}_3NF_${determinant}`,
						attributes: [
							markPk(determinant),
							...dependents
						],
						dfs: [{
							left: [markPk(determinant)],
							right: dependents
						}]
					};
					newTables.push(newTable);

					// Marcar atributos para remoção (apenas os dependentes)
					dependents.forEach(dep => removedAttributes.add(dep));
				}

				// Atualizar tabela original
				const updatedOriginal = {
					table: tableCopy.table,
					attributes: tableCopy.attributes.filter(attr =>
						!removedAttributes.has(stripPk(attr))
					),
					dfs: tableCopy.dfs
						.map(fd => ({
							left: fd.left,
							right: fd.right.filter(attr => !removedAttributes.has(stripPk(attr)))
						}))
						.filter(fd => fd.right.length > 0)
				};

				// Adicionar ao resultado
				result.push(updatedOriginal.dfs.length == 1 ?
					{
						...updatedOriginal,
						attributes: updatedOriginal.attributes.map(attr => {
							if (updatedOriginal.dfs.some(fd => fd.left.includes(attr))) {
								return `${attr.split(':')[0].trim()}: PK`;
							}
							return attr;
						}),
						dfs: updatedOriginal.dfs.map(fd => ({
							left: fd.left.map(attr => {
								return attr + ': PK';
							}),
							right: fd.right
						}))
					} :
					updatedOriginal, ...newTables);
			}

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

		if (contextTable && contextTable.every(t => t.dfs.length > 0)) {
			(to3NF(to2NF(contextTable))).forEach(table => {
				if (table.dfs && table.dfs.length > 0) {
					NormalizerStateService.setByTable(table.table, table.dfs);
				}
			})
			LogicService.replaceTablesFromJson((to3NF(to2NF(contextTable))));
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

import angular from "angular";
import template from "./normalizerModal.html";

const app = angular.module("app.normalizerModal", []);

function Controller(SqlNormalizerService, LogicService) {
  const $ctrl = this;

  $ctrl.tables = [];
  $ctrl.selectedTable = null;
  $ctrl.attributes = [];
  $ctrl.functionalDependencies = [];
  $ctrl.normalizedModel = "";
  $ctrl.newAttribute = "";

  $ctrl.$onInit = () => {
		// Carrega as tabelas do modelo
    $ctrl.tables = SqlNormalizerService.generate(LogicService.buildTablesJson());
		$ctrl.selectedTable = $ctrl.tables[0];
		$ctrl.attributes = $ctrl.tables[0].columns.map(c=>c.split(':')[0]);
  };

  // Seleciona uma tabela e carrega seus atributos
  $ctrl.selectTable = (table) => {
    $ctrl.selectedTable = table;
    $ctrl.attributes = [...table.columns.map(c=>c.split(':')[0])];
    $ctrl.functionalDependencies = [];
    $ctrl.normalizedModel = "";
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
    $ctrl.functionalDependencies = $ctrl.functionalDependencies.filter(df =>
      df.left !== attr && df.right !== attr
    );
  };

  // === Dependências Funcionais ===
  $ctrl.addDependency = () => {
    $ctrl.functionalDependencies.push({ left: "", right: "" });
  };

  $ctrl.removeDependency = (index) => {
    $ctrl.functionalDependencies.splice(index, 1);
  };

  // === Normalização ===
  $ctrl.applyNormalization = () => {
    $ctrl.normalizedModel = `Normalização da tabela "${$ctrl.selectedTable?.name}" com ${$ctrl.attributes.length} atributos e ${$ctrl.functionalDependencies.length} DFs:\n` +
      JSON.stringify($ctrl.functionalDependencies, null, 2);

    $ctrl.close({
      table: $ctrl.selectedTable,
      attributes: $ctrl.attributes,
      dependencies: $ctrl.functionalDependencies
    });
  };

  $ctrl.cancel = () => {
    $ctrl.dismiss({ reason: "cancel" });
  };
}

export default app.component("normalizerModal", {
  template,
  bindings: {
    close: "&",
    dismiss: "&"
  },
  controller: Controller
}).name;

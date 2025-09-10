import angular from "angular";

const sqlNormalizerService = () => {

  const _normalizer = function (model) {
    // model é esperado como Map ou objeto com tabelas
    const tablesArray = [];

    const keys = model.keys();
    for (const key of keys) {
      const table = model.get(key);

      // transforma cada tabela para passar para o modal
      tablesArray.push({
        name: table.name,
        columns: table.columns.map(col => col.name || col), // pega o nome dos atributos
      });
    }

    return tablesArray; // retorna array de tabelas
  }

  return {
    generate: _normalizer
  }
}

export default angular
  .module("app.SqlNormalizerService", [])
  .factory("SqlNormalizerService", sqlNormalizerService)
  .name;

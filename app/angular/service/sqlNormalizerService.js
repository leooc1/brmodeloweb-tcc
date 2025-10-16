import angular from "angular";

const sqlNormalizerService = () => {
  const _normalizer = function (model) {
    const tablesArray = [];

    const keys = model.keys();
    for (const key of keys) {
      const table = model.get(key);

      tablesArray.push({
        id: key,
        name: table.name,
        columns: table.columns, // mantém objetos completos (com PK, FK, type etc.)
        dependencies: table.dependencies || []
      });
    }

    // console.log("Tables normalizer:", tablesArray);
    return tablesArray;
  };

  return {
    generate: _normalizer
  }
};

export default angular
  .module("app.SqlNormalizerService", [])
  .factory("SqlNormalizerService", sqlNormalizerService)
  .name;

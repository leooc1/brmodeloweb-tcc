// normalizerStateService.js
import angular from "angular";

const state = {
  dependenciesByTable: {}
};

function NormalizerStateService() {
  return {
    getAll: () => state.dependenciesByTable,

    getByTable: (tableName) => state.dependenciesByTable[tableName] || [],

    setByTable: (tableName, dependencies) => {
      state.dependenciesByTable[tableName] = dependencies;
    },

    clear: () => {
      state.dependenciesByTable = {};
    }
  };
}

export default angular
  .module("app.NormalizerStateService", [])
  .factory("NormalizerStateService", NormalizerStateService)
  .name;

window.pr = window.console.log.bind(window.console);
angular.module('notesFilters', []);
angular.module('notes', ['notesFilters']);

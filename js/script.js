// Code goes here

var app = angular.module('app', []);

app.service('FileService', function($http) {
  var service = {};
  service.get = function(filepath) {
    return $http.get(filepath).then(function(res) {
      return res.data;
    });
  };
  return service;
});

app.directive('code', code);

code.inject = ['FileService', '$q', '$timeout'];

function code(FileService, $q, $timeout) {
  var directive = {
    restrict: 'E',
    scope: {
      code: '='
    },
    template: '<div></div>',
    replace: true,
    controller: function($scope, $element, $attrs) {
      const typeLetter = (editor, letter) => {
        return function() {
          return $timeout(function() {
            editor.insert(letter);
            console.log('proof of deploy');
          }, (~~(Math.random()*50))+35);
        }
      };
      var DEFAULT_HEIGHT = '200px';
      var DEFAULT_WIDTH = '400px';
      // var e = angular.element('<p class="editor"></p>');
      $element.css('height', $attrs.height || DEFAULT_HEIGHT);
      $element.css('width', $attrs.width || DEFAULT_WIDTH);
      // $element.append(e);
      var editor = ace.edit($element[0]);
      editor.setTheme("ace/theme/tomorrow_night");
      editor.getSession().setOptions({
        mode: "ace/mode/javascript",
        tabSize: 4
      });
      editor.setBehavioursEnabled(false);
      if ($attrs.filepath === undefined || $attrs.filepath === '') {
        return;
      }
      editor.setReadOnly(true);
      FileService.get($attrs.filepath).then(function(fileContents) {

        var promiseChain = $q.when();

        for (var i = 0; i < fileContents.length; i++) {
          promiseChain = promiseChain.then(typeLetter(editor, fileContents.charAt(i)));
        }

      }).catch(function(err) {
        console.log('Error: ', err);
      }).finally(function() {
        editor.setReadOnly(false);
      });
    }
  };
  return directive;
}

'use strict';

angular.module('ui.canon.cog', [])
  .controller('rsCogController', function($scope, $document) {
    var element;

    function getToggleEmelemt(element) {
      return element.children()[0];
    }

    this.init = function(el) {
      element = el;
    };
    $scope.showDropdown = false;

    $scope.clickHandler = function(item) {
      if(item.disabled) {
        return;
      }
      $scope.actionHandler({item:item});
    };

    $scope.toggleDropdown = function() {
      if($scope.showDropdown) {
        $document.unbind('click', closeDropdown);
        $scope.showDropdown = false;
      }
      else {
        $scope.showDropdown = true;
        $document.bind('click', closeDropdown);
      }
    };

    function closeDropdown(evt) {
      var toggleElement = getToggleEmelemt(element);
      if ( evt && toggleElement && toggleElement.contains(evt.target)) {
        return;
      }
      $document.unbind('click', closeDropdown);
      $scope.$apply(function() {
        $scope.showDropdown = false;
      });
    }
  })
  .directive('rsCog', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        'menu': '=',
        'label': '@',
        'actionHandler': '&'
      },
      templateUrl: '/views/directives/rs-cog.html',
      controller: 'rsCogController',
      link: function(scope, el, attrs, rsCogCtrl) {
        rsCogCtrl.init(el);
      }
    };
});

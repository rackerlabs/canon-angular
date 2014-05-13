'use strict';

angular.module('ui.canon.cog', [])
  .controller('rsCogController', function($scope, $document) {
    var element;

    this.init = function(el) {
      element = el;
    $scope.showDropdown = false;
    };

    $scope.clickHandler = function(item) {
      if(!$scope.showDropdown || item.disabled) {
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

    function getToggleElement(element) {
      return element.children()[0];
    }

    function closeDropdown(evt) {
      var toggleElement = getToggleElement(element);

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

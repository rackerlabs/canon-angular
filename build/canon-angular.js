'use strict';
angular.module('ui.canon.button', []).directive('rsButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      btnText: '@',
      state: '=',
      btnClickHandler: '&'
    },
    templateUrl: '/views/directives/rs-button.html',
    link: function (scope) {
      scope.onClick = function () {
        scope.state = 'disabled';
        scope.btnClickHandler();
      };
    }
  };
});
'use strict';
angular.module('ui.canon.cog', []).controller('rsCogController', [
  '$scope',
  '$document',
  function ($scope, $document) {
    var element;
    this.init = function (el) {
      element = el;
      $scope.showDropdown = false;
    };
    $scope.clickHandler = function (item) {
      if (!$scope.showDropdown || item.disabled) {
        return;
      }
      $scope.actionHandler({ item: item });
    };
    $scope.toggleDropdown = function () {
      if ($scope.showDropdown) {
        $document.unbind('click', closeDropdown);
        $scope.showDropdown = false;
      } else {
        $scope.showDropdown = true;
        $document.bind('click', closeDropdown);
      }
    };
    function getToggleElement(element) {
      return element.children()[0];
    }
    function closeDropdown(evt) {
      var toggleElement = getToggleElement(element);
      if (evt && toggleElement && toggleElement.contains(evt.target)) {
        return;
      }
      $document.unbind('click', closeDropdown);
      $scope.$apply(function () {
        $scope.showDropdown = false;
      });
    }
  }
]).directive('rsCog', function () {
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
    link: function (scope, el, attrs, rsCogCtrl) {
      rsCogCtrl.init(el);
    }
  };
});
'use strict';
angular.module('ui.canon.dropdown', []).directive('rsDropdown', [
  '$document',
  function ($document) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element) {
        var candidates, classes, body, menu, container, position, width, i, e;
        classes = element.attr('class');
        element.addClass('rs-dropdown');
        position = element[0].getBoundingClientRect();
        candidates = element.children();
        for (i = 0; i < candidates.length; i++) {
          e = angular.element(candidates[i]);
          if (e.hasClass('rs-dropdown-menu')) {
            menu = e;
          }
        }
        if (typeof menu !== 'object') {
          throw 'Missing required .rs-dropdown-menu element!';
        }
        // Detach the menu and re-attach it to the document body.
        width = menu.css('width');
        body = angular.element($document[0].body);
        menu.remove();
        container = angular.element('<div class="' + classes + '"></div>');
        container.append(menu);
        body.append(container);
        menu.css({
          'top': position.bottom,
          'left': position.left,
          'width': width,
          'min-width': 0
        });
        function showDropdown() {
          menu.addClass('visible').removeClass('hidden');
        }
        function hideDropdown() {
          menu.addClass('hidden').removeClass('visible');
        }
        console.log('setting up click');
        $document.on('click', function (event) {
          console.log('click.menu');
          var t = angular.element(event.target);
          if (t.scope() === scope) {
            showDropdown();
          } else {
            hideDropdown();
          }
        });
        element.on('$destroy', function () {
          $document.off('click.menu');
        });
      }
    };
  }
]);
'use strict';
angular.module('ui.canon.list', []).directive('rsList', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: { listItems: '=' },
    templateUrl: '/views/directives/rs-list.html',
    link: function () {
    }
  };
});
'use strict';
angular.module('ui.canon.tooltip', []).directive('rsTooltip', [
  '$document',
  function ($document) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element) {
        var position, tooltip, content, title, boundingRect, body;
        scope.showTooltip = function () {
          title = element.attr('title');
          boundingRect = element[0].getBoundingClientRect();
          body = angular.element($document[0].body);
          element.removeAttr('title');
          position = {
            top: '',
            left: ''
          };
          position.top = Math.round(boundingRect.top + boundingRect.height) + 'px';
          position.left = Math.round(boundingRect.left + 10) + 'px';
          content = angular.element('<div class="rs-tooltip-inner"></div>');
          content.html(title);
          tooltip = angular.element('<div class="rs-tooltip"></div>');
          tooltip.addClass('visible');
          tooltip.attr('id', 'current-tip');
          tooltip.css({
            'top': position.top,
            'left': position.left
          });
          tooltip.append(content);
          body.append(tooltip);
        };
        scope.hideTooltip = function () {
          element.attr('title', title);
          tooltip.remove();
        };
        element.bind('mouseenter', scope.showTooltip);
        element.bind('mouseleave', scope.hideTooltip);
      }
    };
  }
]);
angular.module('ui.canon', [
  'ui.canon.tooltip',
  'ui.canon.button',
  'ui.canon.cog',
  'ui.canon.list'
]);
angular.module('templates-main', [
  '/views/directives/rs-button.html',
  '/views/directives/rs-cog.html',
  '/views/directives/rs-list.html'
]);
angular.module('/views/directives/rs-button.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('/views/directives/rs-button.html', '<button class=rs-btn ng-click=onClick() ng-class="state === \'disabled\' ? \'disabled\' : \'\'">{{btnText}}</button>');
  }
]);
angular.module('/views/directives/rs-cog.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('/views/directives/rs-cog.html', '<div class=rs-dropdown><span ng-if=!label class="rs-cog rs-dropdown-toggle" ng-click=toggleDropdown()></span> <button ng-if=label class="rs-btn rs-btn-action rs-dropdown-toggle" ng-click=toggleDropdown()><span class=rs-cog></span> {{label}} <span class=rs-caret></span></button><ul ng-show=showDropdown class="rs-dropdown-menu visible"><li ng-repeat="item in menu" class=rs-dropdown-item><span ng-if=item.header class=rs-dropdown-category>{{item.label}}</span> <a ng-if="!item.header && !item.href" class=rs-dropdown-link ng-class="{disabled: item.disabled}" href="" ng-click=clickHandler(item)>{{item.label}}\u2026</a> <a ng-if="!item.header && item.href" class=rs-dropdown-link ng-class="{disabled: item.disabled}" href={{item.href}}>{{item.label}}\u2026</a></li></ul></div>');
  }
]);
angular.module('/views/directives/rs-list.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('/views/directives/rs-list.html', '<table class=rs-list-table><tbody><tr ng-repeat="item in listItems"><td class=rs-table-link><a ng-href={{item.url}} target="{{item.target || \'_self\'}}">{{item.label}}</a></td></tr></tbody></table>');
  }
]);
'use strict';

angular.module('ui.canon.dropdown', [])
  .directive('rsDropdown', function($document) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element) {
        var candidates, classes,
          body, menu, container,
          position, width,
          i, e;

        classes = element.attr('class');
        element.addClass('rs-dropdown');

        position = element[0].getBoundingClientRect();

        candidates = element.children();
        for(i = 0; i < candidates.length; i++) {
          e = angular.element(candidates[i]);
          if (e.hasClass('rs-dropdown-menu')) {
            menu = e;
          }
        }

        if (typeof menu !== 'object') {
          throw('Missing required .rs-dropdown-menu element!');
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

        $document.on('click.menu', function (event) {
          var t = angular.element(event.target);
          if(t.scope() === scope) {
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
});

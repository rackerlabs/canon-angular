"use strict";

angular.module('ui.canon.tooltip', []);

angular.module('ui.canon.tooltip')
  .directive('tooltip', [function() {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs, ctrl) {          
          var position,
            tooltip,
            content,
            title,
            showTooltip,
            hideTooltip,
            toggleTooltip;

          $(element).hover(function() {
            showTooltip();
          },function() {
            hideTooltip();
          });

          //$(element).on('click', toggleTooltip);

          showTooltip = function() {
            title = $(element).attr("title");
            $(element).removeAttr('title');

            position = { top: '', left: '' };
            position.top = Math.round($(element).offset().top+$(element).height()+5) + 'px';
            position.left = Math.round($(element).offset().left+10) + 'px';

            content = $('<div class="rs-tooltip-inner"></div>');
            content.html(title);

            tooltip = $('<div class="rs-tooltip"></div>');
            tooltip.addClass('visible');
            tooltip.attr('id', 'current-tip');
            tooltip.css({ 'top': position.top, 'left': position.left });
            tooltip.append(content);
            tooltip.appendTo('body');
          };

          hideTooltip = function() {
            $(element).attr('title', title);
            tooltip.remove();
          };

          toggleTooltip = function() {
            if(tooltip.hasClass('visible')){
              return hideTooltip();
            } else {
              return showTooltip();
            }
          };
        }
    };
}]);
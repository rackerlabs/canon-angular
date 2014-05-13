'use strict';

describe('rs-cog', function() {
  var element,
    $scope,
    $compile,
    $directiveScope;

  beforeEach(module('ui.canon.cog'));
   // Load the templates.
  beforeEach(module('/views/directives/rs-cog.html'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.actionHandler = jasmine.createSpy();
  }));

  function setupDirective(html) {
    element = angular.element(html);
    $compile(element)($scope);
    $scope.$digest();
    $directiveScope = element.scope().$$childHead;
  }

  function getToggleElement() {
    return element.children().eq(0);
  }

  describe('labeled', function() {
    beforeEach(function() {
      setupDirective(
        '<rs-cog action-handler="actionHandler(item)" ' +
          'label="Labeled Cog!" ' +
          'menu="[{label: \'jump\'}]"></rs-cog>'
      );
    });

    it('loads the template', function() {
      expect(element).toBeDefined();
    });

    it('root element is a div', function() {
      expect(element[0].tagName).toBe('DIV');
    });

    it('has one button', function() {
      expect(element.find('button').length).toBe(1);
    });

    it('sets text for the button', function() {
      expect(getToggleElement().text().trim()).toEqual('Labeled Cog!');
    });

    it('calls action-handler on click', function() {
      getToggleElement().triggerHandler('click');
      element.find('a').triggerHandler('click');
      expect($scope.actionHandler.mostRecentCall.args[0].label).toBe('jump');
    });
  });

  describe('unlabeled', function() {
    beforeEach(function() {
      setupDirective(
        '<rs-cog action-handler="actionHandler()" ' +
          'menu="[{label: \'jump\'}]"></rs-cog>'
      );
    });

    it('no button', function() {
      expect(element.find('button').length).toBe(0);
    });

    it('does not call action-handler when dropdown is closed', function() {
      element.find('a').triggerHandler('click');
      expect($scope.actionHandler).not.toHaveBeenCalled();
    });
  });

});

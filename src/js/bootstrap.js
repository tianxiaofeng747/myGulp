/*  angular rendering  */
angular.element(document).ready(function() {
    $(document.body).attr('ng-controller', 'EMAPP.controller as EMAPP').html('<section ui-view></section>');
    angular.bootstrap(document, ['EMAPP']);
});

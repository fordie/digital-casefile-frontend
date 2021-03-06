'use strict';

/**
 * @ngdoc function
 * @name digitalCasefileApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the digitalCasefileApp
 */
angular.module('digitalCasefileApp')
  .controller('DashboardCtrl', function ($scope, localstore, NgTableParams, $filter, $location) {

    var defGetAll = localstore.getAll();

    defGetAll.then(function (obj) {
      $scope.data = obj.data;
    });

    $scope.tableParams = new NgTableParams({
      page: 1, // show first page
      count: 10, // count per page
      // filter: {
      //   name: 'M' // initial filter
      // },
      sorting: {
        updated_at: 'desc' // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function ($defer, params) {

        defGetAll.then(function () {
          // use build-in angular filter
          var filteredData = params.filter() ?
            $filter('filter')($scope.data, params.filter()) :
            $scope.data;

          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.data;

          params.total(orderedData.length); // set total for recalc pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

        });
      }
    });


    $scope.newCasefile = function () {
      localstore.newCasefile().then(function (response) {
        $location.path('casefile/' + response.data.id);
      });
    };

  });

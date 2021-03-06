
var dataApp = angular.module('dataApp', [])
    .controller('databaseControl', dataControl);

dataControl.$inject = ['$http'];

function dataControl($http){
    var dCtrl = this;

    dCtrl.getData = function() {
        $http.get('/showdata')
            .then(function(success){
                console.log('Retreived database info!');




            }, function(error){
                console.log('Error retrieving data: ' + error);
            });
    };
};

var dataSet = [
        ["1", "cannabis", "joeschmoe", "5421", "Mexico", "4", "2017/03/24", "2017/03/24"],
        ["2", "muscle pain", "JenniferLuvsHew", "679", "Norway", "1", "2017/03/24", "2017/03/24"],
        ["3", "cannabis", "ladiesman4000", "82,098", "New York", "1", "2017/03/24", "2017/03/24"]
    ];

    $(document).ready(function() {
        $('#example').DataTable({
            data: dataSet,
            columns: [{
                title: "ID"
            }, {
                title: "Keyword"
            }, {
                title: "Screen Name"
            }, {
                title: "Followers"
            }, {
                title: "Location"
            }, {
                title: "Keyword Count"
            }, {
                title: "First Tweet"
            }, {
                title: "Latest Tweet"
            }]
        });
    });
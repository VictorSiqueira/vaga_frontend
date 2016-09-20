var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', function($scope){
  $scope.dayList = mountDayList();
  $scope.investedValue = 0;
  $scope.dateSelected = 1;
  $scope.rowchart = 50;
  $scope.rowchartList = [{value : 80000},{value : 40000},{value : 20000},{value : 10000},{value : 5000}]

  /**
   * funcao para calular os valores a serem apresentados em ambos graficos
   */
  $scope.calculateChartValues = function(){
    $scope.top5 = getGreatest5(cloneObject($scope.list));
    $scope.barList = [];

    if($scope.investedValue == ''|| $scope.investedValue == undefined){
      $scope.investedValue = 0;
    }
    for(i in $scope.top5){
      item = {
        name :  $scope.top5[i].name,
        value : ((($scope.top5[i].currentInterestPercentageValue/ 12) * parseFloat($scope.investedValue) * $scope.dateSelected) + parseFloat($scope.investedValue)).toFixed(2)
      }
      $scope.setHeight(item)
      $scope.barList.push(item)
    }

    desenhaGrafico($scope.barList)

    if(!$scope.$$phase){
      $scope.$digest();
    }
  }

  /**
   * funcao para calular a altura da barra no grafico feito na mão
   */
  $scope.setHeight = function(item){
    for(r in $scope.rowchartList){
      if($scope.rowchartList[r].value < parseFloat(item.value)){
        item.height = $scope.rowchart * ($scope.rowchartList.length - parseInt(r));
        break;
      }
    }
  }

  /**
   * funcao para obter os dados necessarios do teste
   */
  $scope.startData =function(){
    sendRequest('http://private-anon-4bf860d3c0-ricocomvc.apiary-mock.com/treasury',
    function(result){
       $scope.list = JSON.parse(result);
       if($scope.list.length > 0 ){
        $scope.calculateChartValues();
       }
    },
    function(result){
      console.log('Error: ' + result )
    });
  }

  /**
   * funcao de inicializaçao do controller
   */
  $scope.init = function(){
    $scope.startData();
    
  }

  $scope.init();
}]);

/**
 * funcao para montagem das opções de dias
 */
function mountDayList (){
  var days = 30;
  var maxMonths = 24;
  var list = [];
  var i = 0
  while(i < maxMonths){
    list.push({
      days: (i+1)*days+ " dias",
      months: i+1
    })
    i++;
  }
  return list;
}

/**
 * funcao para clonar um objeto para tratar os dados de forma especifica
 */
function cloneObject (obj){
  return JSON.parse(JSON.stringify(obj));
}

/**
 * funcao obter os 5 maiores investimentos
 */
function getGreatest5 (list){
  list.sort(function(a, b){return b.currentInterestRate - a.currentInterestRate});
  top5 = [];
  i = 0
  while(i < 5){
    top5.push(list[i]);
    i++;
  }
  return top5;
}

/**
 * funcao realizar chamadas rest via ajax
 */
function sendRequest ( url,  successCallback, errorCalback){	
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.setRequestHeader("Content-Type","application/json");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
	        if(request.status == 200){
	            successCallback(request.responseText)
	        }else{
	            errorCalback(request.responseText)
	        }
	    }
	}
	request.send({});
}

google.load('visualization','1',{'packages' : ['corechart']});

/**
 * funcao para montar o grafico a partir da biblioteca do google
 */
function desenhaGrafico(list){
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Mês');
  data.addColumn('number', 'Gastos');
  data.addRows(12);

  for(i in list){
    data.setValue(parseInt(i), 0, list[i].name);
    data.setValue(parseInt(i),1, list[i].value); 
  }        

  var chart = new google.visualization.ColumnChart(document.getElementById('myChart'));
  var options ={
    width: 500,
    height: 250,
    title:'Gastos',
    vAxis: {title : 'Valor'}
  }
  chart.draw(data,options);
}


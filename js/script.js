let local = JSON.parse(localStorage.getItem("sesion"));
let currencies = data;
//Variables
var baseCurrency = 'USD';
var baseNumber = 1;
var targetCurrency = 'MXN';
var targetNumber;
var url;
//Current locale variable
var currentCurrency = [];
//vue stuff
var extra1, extra2, extra3;
var containers = [];

/* TODO: IMPLEMENT TABLE WITH LOCALSTORAGE 

  Localstorage array is obtained on the "local" variable
*/


$(document).ready(function () {
  //iniciamos los contenedores de vue y obtenemos el currency por defecto
  initVue();
  getCurrentCurrency();
  // valor  de la moneda base
  $("#base").change(function () {
    currentCurrency = [];
    // base currency
    baseCurrency = $(this).children("option:selected").val();
    getCurrentCurrency();
  });

  // Obtenemos el numero de la moneda base

  $("#baseNumber").change(function () {
    // base number
    baseNumber = $(this).val()
    // llamamos a la funcion calculate
    calculate();
  });

  // obtenemos el valor de la moneda a la que se quiere convertir
  $("#target").change(function () {
    // target currency
    targetCurrency = $(this).children("option:selected").val();
    // llamamos a la funcion calculate
    calculate();
  });

  // obtenemos el numero de la moneda a la que se quiere convertir
  $("#targetNumber").change(function () {
    // target number
    targetNumber = $(this).val()
    // llamamos a la funcion inverseCalculate()
    inverseCalculate()
  });
});

//obteniendo la moneda seleccionada de base
function getCurrentCurrency() {
  // api url
  url = "https://api.exchangeratesapi.io/latest?base=" + baseCurrency
  // mandamos una request a la api
  $.get(url, function (data) {
    currentCurrency = data.rates;
    calculate();
    getLucky();
  });

}

//calculando las transacciones y almacenando en localstorage
function calculate() {
  var result = (baseNumber * currentCurrency[targetCurrency]).toFixed(2);
  $("#targetNumber").val(result);
  if (result != 0) {
    var trans = new transaction(baseNumber, result);
    try {
      local.push(trans);
    } catch {
      local = [];
      local.push(trans);
    }
    localStorage.setItem("sesion", JSON.stringify(local));
  }
}

//para calcular inverso
function inverseCalculate() {
  $("#baseNumber").val((targetNumber / currentCurrency[targetCurrency]).toFixed(2));
}

//inicializando contenedores de vue
function initVue() {
  extra1 = new Vue({
    el: '#extra1',
    data: {
      result: "",
      base: ""
    }
  });
  containers.push(extra1);
  extra2 = new Vue({
    el: '#extra2',
    data: {
      result: "",
      base: ""
    }
  });
  containers.push(extra2);
  extra3 = new Vue({
    el: '#extra3',
    data: {
      result: "",
      base: ""
    }
  });
  containers.push(extra3);
}

//funcion para generar aleatorios de sugerencias
function getLucky() {
  var tempCurrencies = [];
  var log = [];
  for (var i = 0; i < currencies.length; i++) {
    if (currencies[i].iso != baseCurrency && currencies[i].iso != targetCurrency) {
      tempCurrencies.push(currencies[i]);
    }
  }
  console.table(tempCurrencies);
  var log = [];
  for (var i = 0; i < 3; i++) {
    var rand = Math.floor(Math.random() * 10);
    var temp = tempCurrencies[rand];
    while (log.indexOf(temp.iso) > -1) {
      rand = Math.floor(Math.random() * 10);
      temp = tempCurrencies[rand];
    }
    log.push(temp.iso);
    fillContainers(temp, containers[i]);
  }
}

//llenando contenedores de sugerencias
function fillContainers(temp, container) {
  container.base = temp.name;
  container.result = (baseNumber * currentCurrency[temp.iso]).toFixed(2);
}

//objeto de transacciones
function transaction(base, result) {
  this.base = base;
  this.result = result;
}
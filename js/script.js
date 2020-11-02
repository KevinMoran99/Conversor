let local;
let reverseLocal;
try {
  local = JSON.parse(localStorage.getItem("sesion"));
  //Copiando historial para reversarlo
  reverseLocal = [...local];
  reverseLocal.reverse();
}
catch {
  localStorage.setItem("sesion", []);
  local = [];
  reverseLocal = [];
}
let currencies = data;
//Variables
var baseCurrency = document.getElementById('base').value;
var baseNumber = 1;
var targetCurrency = document.getElementById('target').value;
var targetNumber;
var url;
//Current locale variable
var currentCurrency = [];
//vue stuff
var extra1, extra2, extra3, historyList;
var containers = [];

/* TODO: IMPLEMENT TABLE WITH LOCALSTORAGE 

  Localstorage array is obtained on the "local" variable
*/


$(document).ready(function () {

  document.getElementById('baseNumber').value = "1.00";

  //iniciamos los contenedores de vue y obtenemos el currency por defecto
  initVue();
  getCurrentCurrency();

  //Actualizando símbolos mostrados
  var cur1 = currencies.find(element => element.iso == baseCurrency);
  $("#baseSymbol").html(cur1.symbol);
  var cur2 = currencies.find(element => element.iso == targetCurrency);
  $("#targetSymbol").html(cur2.symbol);

  $("#baseLabel").html(cur1.name);
  $("#targetLabel").html(cur2.name);

  // valor  de la moneda base
  $("#base").change(function () {
    currentCurrency = [];
    // base currency
    baseCurrency = $(this).children("option:selected").val();
    const curr = currencies.find(element => element.iso == baseCurrency);
    $("#baseSymbol").html(curr.symbol);
    $("#baseLabel").html(curr.name);
    getCurrentCurrency();
  });

  // Obtenemos el numero de la moneda base

  $("#baseNumber").change(function () {
    formatCurrency($(this));
    // base number
    baseNumber = $(this).val().replace(/,/g,"");
    // llamamos a la funcion calculate
    calculate();

    console.log(local)
  });

  // obtenemos el valor de la moneda a la que se quiere convertir
  $("#target").change(function () {
    // target currency
    targetCurrency = $(this).children("option:selected").val();
    const curr = currencies.find(element => element.iso == targetCurrency);
    $("#targetSymbol").html(curr.symbol);
    $("#targetLabel").html(curr.name);
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

  $("#swap").click(function() {
    event.preventDefault();

    baseNumber = $("#targetNumber").val();
    baseCurrency = $("#target").val();
    targetNumber = $("#baseNumber").val();
    targetCurrency = $("#base").val();
    
    document.getElementById("base").value = baseCurrency;
    $("#baseNumber").val(baseNumber);
    document.getElementById("target").value = targetCurrency;
    $("#targetNumber").val(targetNumber);

    var cur1 = currencies.find(element => element.iso == baseCurrency);
    $("#baseSymbol").html(cur1.symbol);
    var cur2 = currencies.find(element => element.iso == targetCurrency);
    $("#targetSymbol").html(cur2.symbol);

    $("#baseLabel").html(cur1.name);
    $("#targetLabel").html(cur2.name);

    getCurrentCurrency();
  })

  $("#delHist").click(function() {
    localStorage.setItem('sesion', []);
    location.reload();  
  })
});

//obteniendo la moneda seleccionada de base
function getCurrentCurrency() {
  // api url
  url = "https://api.exchangeratesapi.io/latest?base=" + baseCurrency
  // mandamos una request a la api
  $.get(url, function (data) {
    currentCurrency = data.rates;
    calculate();
  });

}

//calculando las transacciones y almacenando en localstorage
function calculate() {
  var result = (baseNumber * currentCurrency[targetCurrency]).toFixed(2);
  $("#targetNumber").val(result);
  if (result != 0) {
    var trans = new transaction(formatCompleteNumber(baseNumber.toString()), baseCurrency, formatCompleteNumber(result.toString()), targetCurrency);
    try {
      local.push(trans);
      reverseLocal.unshift(trans);
    } catch {
      local = [];
      local.push(trans);
      reverseLocal.unshift(trans);
    }
    localStorage.setItem("sesion", JSON.stringify(local));
  }
  formatCurrency($("#targetNumber"));
  
  //Recargando cards inferiores
  getLucky();
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

  historyList = new Vue({
    el: '#historyList',
    data: {
      conversions: reverseLocal,
      currencies: currencies
    },
    methods: {
      select: function (conversion) {
        $("#baseNumber").val(conversion.base);
        $("#base").val(conversion.baseCurr);
        $("#targetNumber").val(conversion.result);
        $("#target").val(conversion.resultCurr);
        $("#baseLabel").html(currencies.find(element => element.iso == conversion.baseCurr).name);
        $("#targetLabel").html(currencies.find(element => element.iso == conversion.resultCurr).name);
        $('#historial').modal('toggle');
        baseCurrency = document.getElementById('base').value;
        targetCurrency = document.getElementById('target').value;
      }
    }
  });
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
  //console.table(tempCurrencies);
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
  container.result = temp.symbol + " " + (baseNumber * currentCurrency[temp.iso]).toFixed(2);
}

//Formatea números para que tengan la estructura 1,234,567.89
function formatCompleteNumber(n) {
  let parts = n.split(".");
  if (parts.length > 1) {
    return formatNumber(parts[0]) + "." + parts[1];
  }
  else {
    return formatNumber(parts[0]) + ".00";
  }
}

//objeto de transacciones
function transaction(base, baseCurr, result, resultCurr) {
  this.base = base;
  this.baseCurr = baseCurr;
  this.result = result;
  this.resultCurr = resultCurr;
}
$(document).ready(function () {
  //Variables

  var baseCurrency = 'USD';

  var baseNumber = 1;

  var targetCurrency = 'MXN';

  var targetNumber;

  var url;

  currencyConverter(baseCurrency, baseNumber,targetCurrency,targetNumber)

  // valor  de la moneda base

  $("#base").change(function () {
    // base currency

    baseCurrency = $(this).children("option:selected").val();

    // llamamos a la funcion CurrencyConverter

    currencyConverter(baseCurrency,baseNumber,targetCurrency,targetNumber)


  });

  // Obtenemos el numero de la moneda base

  $("#baseNumber").change(function(){

    // base number

    baseNumber = $(this).val()

    // llamamos a la funcion CurrencyConverter

    currencyConverter(baseCurrency,baseNumber,targetCurrency,targetNumber)

  })

  // obtenemos el valor de la moneda a la que se quiere convertir

  $("#target").change(function () {
    // target currency

    targetCurrency = $(this).children("option:selected").val();

    // llamamos a la funcion CurrencyConverter

    currencyConverter(baseCurrency,baseNumber,targetCurrency,targetNumber)

  });

  // obtenemos el numero de la moneda a la que se quiere convertir

  $("#targetNumber").change(function(){

    // target number

    targetNumber = $(this).val()

    // llamamos a la funcion CurrencyConverter

    currencyConverter2(baseCurrency,baseNumber,targetCurrency,targetNumber)

  })


  // Conversion de da la moneda base a la moneda destino

  function currencyConverter(baseCurrency, baseNumber,targetCurrency,targetNumber)
  {
      // api url

      url = "https://api.exchangeratesapi.io/latest?symbols="+targetCurrency+"&base="+baseCurrency

      // mandamos una request a la api

    

      $.get(url,function(data){
          console.log(data.rates)

          for (let [key, value] of Object.entries(data.rates)) {
            
            var result = value * baseNumber

           $("#targetNumber").val(result)

          }
          console.log(`data.rates.${targetCurrency}`)
      })
  }

  function currencyConverter2(baseCurrency, baseNumber,targetCurrency,targetNumber)
  {
      // api url

      url = "https://api.exchangeratesapi.io/latest?symbols="+baseCurrency+"&base="+targetCurrency

      // le pedimos a la api el resultado de la conversion

      $.get(url,function(data){
          console.log(data.rates)

          for (let [key, value] of Object.entries(data.rates)) {

            console.log(value)
            
            var result = value * targetNumber

           $("#baseNumber").val(result)

          }
          console.log(`data.rates.${targetCurrency}`)
      })
  }


});
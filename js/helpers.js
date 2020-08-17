function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function replace() {
    while(true){
        for(var i = 0; i<5;i++){
            var options = ["Peso mexicano","Dolar estadounidense", "Peso argentino", "Quetzal", "Libra esterlina"];
            //var random = Math.floor(Math.random() * 3);
            await sleep(1500);
            let container = $('#swapable');
            var text = container.text();
            container.text(text.replace(text, options[i]));
        }
    }
}

replace();
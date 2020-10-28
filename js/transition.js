function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function replace() {
    while (true) {
        for (var i = 0; i < 11; i++) {

            var options = data;
            //var random = Math.floor(Math.random() * 3);
            await sleep(3000);

            let container = $('#swapable');

            container.fadeOut(550, function () {
                var text = container.text();
                container.text(text.replace(text, options[i].name)).fadeIn(550);
            });

        }
    }
}
replace();


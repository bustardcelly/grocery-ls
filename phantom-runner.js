var page = new WebPage();
var url = "https://raw.github.com/bustardcelly/grocery-ls/master/test/jasmine/specrunner.html";
phantom.viewportSize = {width: 800, height: 600};
page.onConsoleMessage = function (msg) { console.log(msg); };
page.open(url, function (status) {
        if (status !== 'success') {
                console.log('Unable to load the address!');
        } else {
               window.setTimeout(function () {
                    page.render("output.png");
                    phantom.exit();
               }, 200);
        }
});

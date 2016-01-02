(function () {

    "use strict";

    function stockComponent($attrs, apiKey, fetch) {
        var self = this;

        Object.defineProperty(self, "stockName", {
            "get": function() { return $attrs["stockName"]}
        });

        self.onInit = function () {
            fetch.fromService({
                url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + self.stockName + '.json?api_key=' + apiKey,
                method:"GET"
            }).then(function (results) {
                self.stockPrice = results.data.dataset.data[0][4];
            });
        }

        return self;
    }

    ngX.Component({
        selector:"stock",
        component: stockComponent,
        styles: [
            ".stock { ",
            "   position:relative; float:left; margin: 30px;",
            " } ",
            " .stockSymbol { ",
            "   font-size: 40px ",
            "   font-weight: 300; ",
            "   padding: 40px 0; ",
            " } ",
            "  ",
            " .stockPrice { ",
            "   font-size: 32px; ",
            "   font-weight: bold; ",
            " } ",
        ],
        template: [
            "<div class='stock'>",            
            "   <h1 class='stockSymbol'>{{ vm.stockName }}</h1>",
            "   <i data-ng-if='!vm.stockPrice' class='fa fa-cog fa-spin'></i> ",
            "   <h2 class'stockPrice'>{{ vm.stockPrice }}</h1>",
            "</div>"
        ],
        providers:[
            '$attrs', 'apiKey', 'fetch'
        ]
    })
})();
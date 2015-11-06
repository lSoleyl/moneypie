define(['jquery', 'model', 'portfolio', 'lodash'], function ($, model, portfolio, _) {
    var listAsset = {};

    function formatPrice(price) {
       var symbol = model.currencies[price.currency].symbol
       return "" + price.value + " " + symbol
    }


    listAsset.onShow = function () {
        var newHTML = [];

        _.each(portfolio.assets, function(asset) {
            newHTML.push('<tr>');
            newHTML.push('<td>' + asset.type + '</td>');
            newHTML.push('<td>' + asset.name + '</td>');
            newHTML.push('<td>' + formatPrice(asset.price) + '</td>');
            newHTML.push('<td>' + asset.amount + '</td>');
            newHTML.push('<td>' + asset.volume().toFixed(2) + '&euro;</td>');
            newHTML.push('</tr>');
        })


        $("#listAssetsPortfolios").html(newHTML.join(""));
    };

    return listAsset;
});
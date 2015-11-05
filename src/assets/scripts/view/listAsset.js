define(['jquery', '../model'], function ($, model) {
    var listAsset = {};

    listAsset.init = function () {
        var newHTML = [];

        for (var i = 0; i < model.examplePortfolio.length; i++) {
            newHTML.push('<tr>');
            newHTML.push('<td>' + model.examplePortfolio[i].type + '</td>');
            newHTML.push('<td>' + model.examplePortfolio[i].name + '</td>');
            newHTML.push('<td>' + model.examplePortfolio[i].value + '</td>');
            newHTML.push('<td>' + model.examplePortfolio[i].amount + '</td>');
            newHTML.push('</tr>');
        }


        $("#portfolios").html(newHTML.join(""));
    };

    return listAsset;
});
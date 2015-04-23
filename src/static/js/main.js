'use strict';

var Grapnel = require('grapnel');

var navCollapsedClass = 'navigation--collapsed';
var nav = document.getElementById('navigation');
var navToggle = document.getElementById('navigation-toggle');

var Countries = require('./countries/countries');
var ConsituencyLeadingParties = require('./constituencies/leading-parties');
var ConstituencyResults = require('./constituencies/results');
var Chartist = require('chartist');
var _ = require('lodash');
var VFP_DATA_CONFIG = require('./config');

var router = new Grapnel({
    pushState: true,
    root: '/'
});

// Hide navgation by default
nav.classList.add(navCollapsedClass);

// Handle toggling of navigation
navToggle.onclick = function(e) {
    if (nav.classList.contains(navCollapsedClass)) {
        nav.classList.remove(navCollapsedClass);
    } else {
        nav.classList.add(navCollapsedClass);
    }
};


/**
 * Country routes
 */
router.get(/^$/, function () {
    // homepage specific js
    // (insert i don't know what I'm doing meme)
    // This all needs moving but time and stuff

    var responsiveOptions = [
        ['screen and (min-width: 100px)', {
            chartPadding: 0,
            labelOffset: 30,
            labelDirection: 'explode',
            labelInterpolationFnc: function (value) {
                return value;
            }
        }]
    ];

    var setUpData = function (data) {
        // Turn the data provided into one the chart can use;
        var chartData = { labels: [], series: []};

        var total = _.reduce(_.pluck(data.series, 'amount' ), function (sum, num) {
            return parseInt(sum,10) + parseInt(num, 10);
        });

        _.forEach(data.series, function (segment) {
            var percent = Math.round((( parseInt(segment.amount,10) / total) * 100) * 10) /10;
            chartData.labels.push('');
            chartData.series.push({
                data: parseInt(segment.amount,10), className: 'pie-chart--' + segment.party.slug
            });
        });

        return chartData;
    };

    var options = {
        labelInterpolationFnc: function (value) {
            return value[0];
        }
    };

    // base results
    var ukResults = {"series":[{"amount":787243,"party":{"name":"Labour","slug":"labour"}},{"amount":582462,"party":{"name":"Liberal Democrats","slug":"liberal-democrats"}},{"amount":574147,"party":{"name":"Green Party","slug":"green-party"}},{"amount":432055,"party":{"name":"UKIP","slug":"ukip"}},{"amount":407010,"party":{"name":"Conservatives","slug":"conservatives"}},{"amount":36031,"party":{"name":"Scottish Green Party","slug":"scottish-green-party"}},{"amount":35126,"party":{"name":"Scottish National Party","slug":"scottish-national-party"}},{"amount":12566,"party":{"name":"Plaid Cymru","slug":"plaid-cymru"}}]};

    var totalCompletedSurveysEl = document.querySelector('[data-total-completed-surveys]');

    var ukResultsChart = new Chartist.Pie(document.querySelector('#pie-chart-home'), setUpData(ukResults), options, responsiveOptions);

    // When endpoint is available we'd call it and update the chart
    // $.getJSON(VFP_DATA_CONFIG.apiBaseUrl + '/countries/all/results.json').then(function (data) {
    // ukResultsChart.update(setupData(data));
    // });

    // When endpoint is available we'd call it and update the total count
    // Would quite like to use https://inorganik.github.io/countUp.js/ here
    // $.getJSON(VFP_DATA_CONFIG.apiBaseUrl + '/surveys/count.json').then(function (data) {
    // totalCompletedSurveysEl.innerHTML = data
    // });
    //
});

/**
 *
 */
/**
 * Country routes
 */
router.get(/countries\/results/, function () {
    new Countries();
});

/**
 * Constituency routes
 */
router.get(/constituencies\/leading-parties/, function () {
    new ConsituencyLeadingParties();
});

router.get(/constituencies\/results/, function () {
    new ConstituencyResults();
});

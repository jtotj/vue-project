import { fetchOhlcList } from '@/api/asset'

export function generateGUID() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === 'function') {
        d += window.performance.now(); // use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

// called by chart to fetch initial data
export function fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    var intervals = { 'minute': 60, 'day': 86400, 'hour': 3600, }
    var asset = params.symbol.replace(/USDT/g, 'KRW');

    fetchOhlcList(asset, {
        interval: params.period * intervals[params.interval],
        from: suggestedStartDate.getTime(),
to: suggestedEndDate.getTime()
    }).then(({ logs }) => {
        cb({
            quotes: formatChartData(logs),
            moreAvailable: true,
            attribution: {
                source: 'real',
                exchange: 'REAL-TIME'
            }
        });
    }).catch((error) => {
        cb({ error: error.message });
    })
};

// called by chart to fetch update data
export function fetchUpdateData(symbol, startDate, params, cb) {}

// called by chart to fetch pagination data
export function fetchPaginationData(symbol, suggestedStartDate, endDate, params, cb) {
    var intervals = { 'minute': 60, 'day': 86400, 'hour': 3600, }
    var asset = params.symbol.replace(/USDT/g, 'KRW');

    fetchOhlcList(asset, {
        interval: params.period * intervals[params.interval],
        from: suggestedStartDate.getTime(),
        to: endDate.getTime()
    }).then(({ logs, moreAvailable }) => {
        cb({
            quotes: formatChartData(logs),
            moreAvailable,
            attribution: {
                source: 'real',
                exchange: 'REAL-TIME'
            }
        });
    }).catch((error) => {
        cb({ error: error.message });
    })
};

// utility function to format data for chart input; given demo was designed to work with library, very little formatting is needed
function formatChartData(feeddata) {
    var newQuotes = [];
    for(var i = 0; i < feeddata.length; i++) {
        newQuotes[i] = {};
        newQuotes[i].DT = new Date(feeddata[i].timestamp); // DT is a string in ISO format, make it a Date instance
        newQuotes[i].Open = feeddata[i].open * 1;
        newQuotes[i].High = feeddata[i].high;
        newQuotes[i].Low = feeddata[i].low;
        newQuotes[i].Close = feeddata[i].close * 1;
        newQuotes[i].Volume = feeddata[i].volume * 1;
    }
    return newQuotes;
};

import historyProvider from './historyProvider'
import stream from './stream'

// const supportedResolutions = ["1", "60", "D"]
const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]
const config = {
    supported_resolutions: supportedResolutions
}; 

export default {
	onReady: cb => {
		setTimeout(() => cb(config), 0)
	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		var symbol_stub = {
			name: symbolName,
			description: symbolName,
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: 'COCOFX',
			minmov: 1,
			pricescale: 1,
			has_intraday: true,
			intraday_multipliers: ['1', '60'],
			supported_resolution:  supportedResolutions,
			has_no_volume: true,
			volume_precision: 8,
			data_status: 'streaming',
			currency_code: 'CCE'
		}
		// if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
		// 	symbol_stub.pricescale = 100
		// }
		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			// console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		// onResolveErrorCallback('Not feeling it today')
	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
	
		historyProvider.getBars(symbolInfo, resolution, from * 1000, to * 1000, firstDataRequest)
		.then(bars => {
			if (bars.length) {
				onHistoryCallback(bars, {noData: false})
			} else {
				onHistoryCallback(bars, {noData: true})
			}
		}).catch(err => {
			console.log({err})
			onErrorCallback(err)
		})

	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
	},
	unsubscribeBars: subscriberUID => {
		stream.unsubscribeBars(subscriberUID)
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
	},
	getServerTime: cb => {
	}
}
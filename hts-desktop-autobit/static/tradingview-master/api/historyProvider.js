import { fetchOhlcList } from '@/api/asset'

const history = {}

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		
		var intervals = resolution === '1D' ? 86400 : resolution >= 60 ? Number(resolution)*60 : 60
		var pass_prams = {
			interval: intervals,
			from: from,
			to: to,
		}
		var symbolKRW = symbolInfo.name.replace('/USDT', 'KRW');
		const ohlc = fetchOhlcList( symbolKRW, pass_prams)
            .then((data) => {
				if (data.error === 1) {
					console.log('asset API error:',data.error)
					return []
				}
				if (!data.logs.length) {
					console.log('asset API is empty');
					return []
				} 	
				if (data.logs.length) {
					var bars = data.logs.map(el => {
						return {
							time: el.timestamp,
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volume,
							isBarClosed: false,
							isLastBar: true
						}
					})
					if (first) {
						var lastBar = bars[bars.length - 1]
						history[symbolInfo.name] = {lastBar: lastBar}
					}
					return bars
				} else {
					return []
				}
		})
		return ohlc
	}
}
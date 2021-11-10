// api/stream.js
import historyProvider from './historyProvider.js'

var _subs = []
var channelString = null

export default {
  subscribeBars: function(symbolInfo, resolution, updateCb, uid, resetCache) {
  channelString = symbolInfo.name
  var newSub = {
    uid,
    resolution,
    symbolInfo,
    lastBar: historyProvider.history[symbolInfo.name].lastBar,
    listener: updateCb,
  }
  _subs[channelString] = newSub
  var evtSource = new EventSource(process.env.BASE_API + '/api/stream')
  evtSource.addEventListener ('marketUpdate', handleEvent)
 },
 unsubscribeBars: function(uid) {
  var subIndex = _subs.findIndex(e => e.uid === uid)
  if (subIndex === -1) {
   return
  }
  var sub = _subs[subIndex]
  _subs.splice(subIndex, 1)
 }
}

function handleEvent ({ type, data }){
  data = JSON.parse(data);
  const sub = _subs[channelString];
  var symbolKRW = sub.symbolInfo.name.replace('/USDT', 'KRW'); 

  if(data.symbol === symbolKRW){
    if (data.timestamp < sub.lastBar.time) {
      return
    }
    var _lastBar = updateBar(data, sub)
      // update bar 
    sub.listener(_lastBar)
      // update our own record of lastBar
    sub.lastBar = _lastBar
  }
}

function updateBar(data, sub) {

  var lastBar = sub.lastBar
  var nextDailyBarTime = getNextDailyBarTime(lastBar.time, sub.resolution);
  var rounded = Math.round(data.timestamp/10000)*10000;
  var _lastBar
 
  if (rounded >= nextDailyBarTime) {
    _lastBar = {
      time: rounded,
      open: lastBar.close,
      high: lastBar.close,
      low: lastBar.close,
      close: data.lastPrice,
      volume: 1
    }
  } else {
    // update lastBar candle!
    if (data.lastPrice < lastBar.low) {
      lastBar.low = data.lastPrice
    } else if (data.lastPrice > lastBar.high) {
      lastBar.high = data.lastPrice
    }
  
    lastBar.volume = 1
    lastBar.close = data.lastPrice
    _lastBar = lastBar
  }
  return _lastBar
}

function getNextDailyBarTime(barTime, resolution) {
  const date = new Date(barTime);
  switch (resolution) {
    case '1' :
      date.setMinutes(date.getMinutes() + 1);
      return date.getTime();
      break;
    case '60' :
      date.setHours(date.getHours() + 1);
      return date.getTime();
      break;
    case '1D' :
      date.setDate(date.getDate() + 1);
      return date.getTime();
      break;			
  }
}

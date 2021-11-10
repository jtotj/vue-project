export const encodeRoomName = (type, params) => {
  switch (type) {
    case 'aggtrade':
      return `aggtrade@${params.market_seq}`
    case 'memberdata':
      return `memberdata@${params.member_seq}`
    case 'marketdepth':
      return `marketdepth@${params.market_seq}:${params.interval}`
    default:
      break
  }

  return null
}

export const parseRoomName = () => {}

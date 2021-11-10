import Decimal from 'decimal.js'
import store from '@state/store'
import find from 'lodash/find'

export default function AssetDecimal(asset_seq, amount) {
  const asset_info = find(store.state.assets.assets, { seq: asset_seq })
  const DecimalClone = Decimal.clone()

  DecimalClone.prototype.toString = function() {
    return this.toFixed(asset_info.decimal_point)
  }

  const oDecimal = new DecimalClone(amount)

  return oDecimal
}

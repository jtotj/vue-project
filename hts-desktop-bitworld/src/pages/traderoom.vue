<template>
    <div>
        <div class="left_panel">
            <div class="info_panel">
                <div class="tab_cnt" data-tab="info">
                    <div class="on">
                        <div class="summary">
                            <h2 :class="[s_asset_info.updown]">
                                <div class="tit">
                                    <strong class="name">
                                        <button type="button">
                                            <em :class="['symbol', 'iCoin', s_asset]"></em>
                                            <strong class="bit-name">{{ s_asset_info.asset_title }}</strong>
                                            <span>{{ s_asset_info.asset_code }}</span>
                                        </button>
                                    </strong>
                                    <!-- <div class="tab_btn" data-tab="info">
                                        <a href="#" @click.prevent class="on">{{ $t('quotation') }}</a>
                                        <a href="" v-if="0">{{ $t('information') }}</a>
                                    </div> -->
                                </div>
                                <p class="tit-mid">
                                    <span class="current-price-1">{{ $t('present_price') }}</span>
                                    <strong>{{ php.number_format(premium) }}<i>{{ $t('symbol_defalt') }}</i></strong>
                                </p>
                                <p>
                                    <span class="current-price-2">{{ $t('net_change') }}</span>
                                    <b>{{ s_asset_info.today_vs > 0 ? '+' : '' }}{{ s_asset_info.percentage }}%</b>
                                    <em>{{ s_asset_info.today_vs > 0 ? '+' : '' }}{{ php.number_format(s_asset_info.today_vs) }}</em>
                                </p>
                            </h2>
                            <div class="graph" v-if="0">graph</div>
                            <div class="right">
                                <div class="change_log change_log-1">
                                    <dl>
                                        <dt>{{ $t('high_price') }}</dt>
                                        <dd class="up">{{ php.number_format(s_asset_info.today_high) }}</dd>
                                    </dl>
                                    <dl>
                                        <dt>{{ $t('low_price') }}</dt>
                                        <dd class="down">{{ php.number_format(s_asset_info.today_low) }}</dd>
                                    </dl>
                                </div>
                                <div class="change_log">
                                    <dl>
                                        <dt>{{ $t('volume_24h') }}</dt>
                                        <dd>{{ php.number_format(s_asset_info.today_volume) }}<i>{{ fromPairs(constants.asset.asset_codes)[s_asset].split('/')[0] }}</i></dd>
                                    </dl>
                                    <dl>
                                        <dt>{{ $t('trading_value_24h') }}</dt>
                                        <dd>{{ php.number_format((s_asset_info.today_high + s_asset_info.today_low) / 2 * s_asset_info.today_volume) }}<i>{{ $t('symbol_defalt') }}</i></dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div v-if="s_chart == 'basicChart'" class="market_price">
                            <div> 
                                <dl v-if="0">
                                    <dt>Bitfinex</dt>
                                    <dd><b>8,457,056</b><span class="currency">($7,545.00)</span></dd>
                                </dl>
                                <dl>
                                    <dt>{{ $t('assistance_index') }}</dt>
                                    <dd><button class="support_btn" @click="show_study_modal = true">{{ $t('selection') }}</button></dd>
                                </dl>
                                <dl>
                                    <dt>{{ $t('candle_type') }}</dt>
                                    <dd>
                                        <select v-model="s_periodicity_type_idx">
                                            <option v-for="(val, idx) in periodicity_types" :value="idx">{{ val.title }}</option>
                                        </select>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>{{ $t('chart_type') }}</dt>
                                    <dd>
                                        <select v-model="s_chart_style" style="width: 88px;">
                                            <option v-for="([ style, title ]) in chart_styles" :value="style">{{ title }}</option>
                                        </select>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div class="select_chart">
                            <span>
                                <label for="basicChart"><input type="radio" id="basicChart" name="drone" value="basicChart" v-model="s_chart" checked><span>{{ $t('basic_chart') }}</span></label>
                            </span>
                            <span>
                                <label for="tradingView"><input type="radio" id="tradingView" name="drone" value="tradingView" v-model="s_chart"><span>{{ $t('trading_view') }}</span></label>
                            </span>
                        </div>
                        <ChartIQ ref="CIQ" v-if="s_chart === 'basicChart'" class="chart" :studies="s_studies" :asset="s_asset_info.asset" :chart-style="s_chart_style" :periodicity="periodicity_types[s_periodicity_type_idx]"></ChartIQ>
                        <TVChartContainer v-if="s_chart === 'tradingView'" class="chart" :symbol="s_asset_info.asset" :chartSwitch="s_chart" v-on:setChart="showBasicChart"/>
                    </div>
                    <div>
                        <div class="info_wrap">
                            <strong class="info_tit">
                                Bitcoin
                                <div class="link">
                                    <a href="">{{ $t('website') }}</a>
                                    <a href="">{{ $t('white_paper') }}</a>
                                    <a href="">{{ $t('block_check') }}</a>
                                </div>
                            </strong>
                            <table class="info_tb">
                                <tbody>
                                    <tr>
                                        <th>{{ $t('first_issue') }}</th>
                                        <td>2009년 1월</td>
                                        <th>{{ $t('market_capitalization') }}</th>
                                        <td>126.4조원(18.08.24 기준)</td>
                                    </tr>
                                    <tr>
                                        <th>{{ $t('exchange_listing') }}</th>
                                        <td>103개(17.11.06 기준)</td>
                                        <th>{{ $t('block_cteation_cycle') }}</th>
                                        <td>{{ $t('min_10') }}</td>
                                    </tr>
                                    <tr>
                                        <th>{{ $t('digging_reward_amount') }}</th>
                                        <td>현재 12.5BTC (반감기 일정에따라 감소예정)</td>
                                        <th>{{ $t('total_issue_limit') }}</th>
                                        <td>21,000,000</td>
                                    </tr>
                                    <tr>
                                        <th>{{ $t('agreement_protocol') }}</th>
                                        <td colspan="3">PoW</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
             
            <vue-modaltor :visible="show_study_modal" defaultWidth="1100px">
                <template slot="close-icon">
                </template>
                <div class="modal-title" style="margin-left: 5px;">{{ $t('msg_assistance_index_infinity') }}</div>
                <ul class="modal-box"  v-if="show_study_modal">
                    <li v-for="(name, title) in $refs.CIQ.getStudyList()">
                        <label><input type="checkbox" v-model="s_studies" :value="name" name="s_studies"><span>{{ title }}</span></label>
                    </li>
                </ul>
                <div class="modal-btn">
                    <button  @click="show_study_modal = false">{{ $t('save') }}</button>
                </div>
            </vue-modaltor>
        </div>
            <div class="order_panel">
                <div class="live_price">
                    <div>
                        <div class="tab_btn" data-tab="price">
                            <button type="button" v-for="tab in price_tabs" @click.prevent="selected_price_tab = tab[0]" :class="{ 'on': tab[0] === selected_price_tab }">{{ tab[1] }}</button>
                        </div>
                        <div class="tab_cnt" data-tab="price">
                            <div :class="[selected_price_tab === 'GENERAL' ? 'order_normal' : 'order_click', 'on']">
                                <div class="sc_remote" v-if="selected_price_tab === 'ORDER'">
                                    <div class="type_select">
                                        <label v-for="val in [['A',$t('possibility')], ['M',$t('sum')]]"><input type="radio" v-model="click_params.type" :value="val[0]" name="type"><span>{{ val[1] }}</span></label>
                                    </div>
                                    <template v-if="click_params.type === 'A'">
                                        <div class="range_slider" style="display: block" v-if="click_params.show_slider">
                                            <div class="range">
                                                <vue-slider tooltip-dir="left" ref="slider" v-model="click_params.percentage"></vue-slider>
                                            </div>
                                            <button @click.prevent="click_params.show_slider = false" type="button" class="ok_btn">{{ $t('confirmation') }}</button>
                                        </div>
                                        <div class="ratio_select" v-else>
                                            <button v-for="val in percentage_types" @click.prevent="click_params.percentage = val" type="button" :class="{ 'on': click_params.percentage === val }">{{ val }}%</button>
                                            <button v-if="!~percentage_types.indexOf(click_params.percentage)" @click.prevent="click_params.show_slider = true" class="on" type="button">{{ click_params.percentage }}%</button>
                                            <button v-else @click.prevent="click_params.show_slider = true" type="button" class="self_btn">{{ $t('direct_input') }}</button>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="ratio_select">
                                            <button @click="click_params.trade_margin === ''  ? click_params.trade_margin = 100000 : click_params.trade_margin += 100000">{{ $t('plus_hundred_thousand') }}</button>
                                            <button @click="click_params.trade_margin === ''  ? click_params.trade_margin = 1000000  : click_params.trade_margin += 1000000">{{ $t('plus_million') }}</button>
                                            <button @click="click_params.trade_margin === ''  ? click_params.trade_margin = 10000000  : click_params.trade_margin += 10000000">{{ $t('plus_ten_million') }}</button>
                                            <span style="display: inline-block; width: 137px; height: 26px; margin-left: 3px; border: 1px solid #95959e; border-radius: .1em; overflow: hidden; vertical-align: top;">
                                                <input type="text" v-model.number="click_params.trade_margin" style="float: left; display: block; width: 92px; height: 26px; border: 0; padding: 0 4px 0 0; color: #2b2b2b; font-family: Dotum; text-align: right;" name="">
                                                <em style="float: right; width: 40px; height: 26px; margin: 0; padding: 0; border: 0; border-left: 1px solid #dfe0e5; line-height: 26px; text-align: center;">{{ $t('symbol_defalt') }}</em>
                                            </span>
                                        </div>
                                    </template>
                                </div>
                                <perfect-scrollbar tag="div" class="sc_container bottom">
                                    <div class="container">
                                        <div class="table_sec left">
                                            <table>
                                                <colgroup><col width="42px"><col width="*"><col width="50%"></colgroup>
                                                <tbody>
                                                    <tr @click="doClickTrade('PUT', tick.premium)" v-for="tick in c_orderbooks.PUT" data-status="down" :class="[{ selected: current_tick == tick.premium }]">
                                                        <td></td>
                                                        <td class="rate">
                                                            <i class="bar" :style="{ width: tick.ratio + '%' }"></i>
                                                            <span>{{ php.number_format(tick.amount, asset_setting.amount_decimal_point) }}</span>
                                                        </td>
                                                        <td class="price" data-price="down"><strong>{{ php.number_format(tick.premium) }}</strong><span>{{ tick.ratio_today_first > 0 ? '+' : '' }}{{ php.number_format(tick.ratio_today_first, 2) }}%</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="info_sec">
                                            <div class="box">
                                                <p>
                                                    <b>{{ $t('volume') }}</b>
                                                    <span>{{ php.number_format(s_asset_info['today_volume']) }}</span>
                                                </p>
                                                <p v-if="0">
                                                    <b>{{ $t('transaction_money') }}</b>
                                                    <span>98,282 백만원</span>
                                                </p>
                                                <p class="disc">
                                                    <span>{{ $t('recently_24h') }}</span>
                                                </p>
                                            </div>
                                            <div class="box">
                                                <p>
                                                    <b>{{ $t('high_52week') }}</b>
                                                    <span class="up">{{ php.number_format(s_asset_info['52week_high']) }}</span>
                                                </p>
                                                <p class="disc" v-if="0">
                                                    <span>(2018.01.06)</span>
                                                </p>
                                                <p>
                                                    <b>{{ $t('low_52week') }}</b>
                                                    <span class="down">{{ php.number_format(s_asset_info['52week_low']) }}</span>
                                                </p>
                                                <p class="disc" v-if="0">
                                                    <span>(2017.09.25)</span>
                                                </p>
                                            </div>
                                            <div class="box">
                                                <p>
                                                    <b>{{ $t('previous_market_price') }}</b>
                                                    <span>{{ php.number_format(s_asset_info['yesterday_first']) }}</span>
                                                </p>
                                                <p>
                                                    <b>{{ $t('today_high_price') }}</b>
                                                    <span class="up">{{ php.number_format(s_asset_info['today_high']) }}</span>
                                                </p>
                                                <p class="disc" v-if="0">
                                                    <span class="up">+0.09%</span>
                                                </p>
                                                <p>
                                                    <b>{{ $t('today_low_price') }}</b>
                                                    <span class="down">{{ php.number_format(s_asset_info['today_low']) }}</span>
                                                </p>
                                                <p class="disc" v-if="0">
                                                    <span class="down">-2.46%</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container">
                                        <div class="info_sec">

                                            <div v-if="0" class="box">
                                                <p>
                                                    <b>{{ $t('conclusion_strength') }}</b>
                                                    <span>+88.94%</span>
                                                </p>
                                            </div>
                                            <div class="box table">
                                                <p class="header">
                                                    <b>{{ $t('execution_price') }}</b>
                                                    <span>{{ $t('execution_amount') }}</span>
                                                </p>
                                                <p v-for="val in c_linkbooks">
                                                    <b :class="[val.position == 'CALL' ? 'up' : 'down']">{{ php.number_format(val.premium) }}</b>
                                                    <span :class="[val.position == 'CALL' ? 'up' : 'down']">{{ php.number_format(val.amount, 5) }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="table_sec right">
                                            <table>
                                                <colgroup><col width="50%"><col width="*"><col width="42px"></colgroup>
                                                <tbody>
                                                    <tr @click="doClickTrade('CALL', tick.premium)" v-for="tick in c_orderbooks.CALL" data-status="up" :class="[{ selected: current_tick == tick.premium }]">
                                                        <td class="price" data-price="up"><strong>{{ php.number_format(tick.premium) }}</strong><span>{{ tick.ratio_today_first > 0 ? '+' : '' }}{{ php.number_format(tick.ratio_today_first, 2) }}%</span></td>
                                                        <td class="rate">
                                                            <i class="bar" :style="{ width: tick.ratio + '%' }"></i>
                                                            <span>{{ php.number_format(tick.amount, asset_setting.amount_decimal_point) }}</span>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </perfect-scrollbar>
                                <div class="sc_total">
                                    <table>
                                        <colgroup><col width="33.33%"><col width="33.33%"><col width="33.33%"></colgroup>
                                        <tbody>
                                            <tr>
                                                <td>{{ php.number_format(_.sumBy(c_orderbooks.PUT, 'amount'), 2) }}</td>
                                                <td>{{ $t('order_total') }}<span>({{ fromPairs(constants.asset.asset_codes)[s_asset].split('/')[0] }})</span></td>
                                                <td>{{ php.number_format(_.sumBy(c_orderbooks.CALL, 'amount'), 2) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="control_panel" v-loading="s_trade_loading">
                    <div class="order_control">
                        <div class="tab_btn" data-tab="order">
                            <button @click.prevent="selected_tab = tab[0]" type="button" :class="[{ on: tab[0] === selected_tab }, tab[0].toLowerCase()]" v-for="tab in tabs">{{ tab[1] }}</button>
                        </div>
                        <div class="tab_cnt" data-tab="order">
                            <div :class="{ 'on': tab[0] === selected_tab }" v-for="tab in tabs" v-loading="(tab[0] != 'HISTORY' && trade_loading) || (tab[0] === 'HISTORY' && history_loading)">
                                <template v-if="tab[0] === 'HISTORY'">
                                    <perfect-scrollbar class="history_tb" v-if="is_logged">
                                        <div class="tbody">
                                            <table>
                                                <tbody>
                                                    <tr v-for="val in trade_history">
                                                        <td class="a_l">{{ func.zdate(val.regdate, 'Y.m.d') }}<br/>{{ func.zdate(val.regdate, 'H:i') }}</td>
                                                        <td :class="[val.position == 'CALL' ? 'plus' : 'minus']">{{ fromPairs(constants.trade.positions)[val.position] }}</td>
                                                        <td>
                                                            <em>{{ val.amount }}</em>
                                                            <span class="unit">{{ fromPairs(constants.asset.asset_codes)[val.asset].split('/')[0] }}</span>
                                                        </td>
                                                        <td>
                                                            <em>{{ php.number_format(val.trade_margin) }}</em>
                                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                                        </td>
                                                        <td>
                                                            <em>{{ php.number_format(val.gain_profit) }}</em>
                                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </perfect-scrollbar>
                                    <p class="login_msg" :style="{ 'display': is_logged ? '' : 'block' }">{{ $t('msg_login_check_possibility') }}</p>
                                    <div class="login_btn_box" :style="{ 'display': is_logged ? '' : 'block' }">
                                        <button type="button" @click="$router.push({ name: 'join' })" class="joinBtn">{{ $t('membership') }}</button>
                                        <button type="button" @click="$router.push({ name: 'login' })" class="loginBtn">{{ $t('login') }}</button>
                                    </div>
                                </template>
                                <template v-else>
                                <dl>
                                    <dt>{{ $t('order_possibility') }}</dt>
                                    <dd v-if="trade_method === 'MARGIN'">
                                        <strong>{{ php.number_format(c_account_info.margin - c_account_info.holding_balance) }}</strong>
                                        <em>CCE</em>
                                    </dd>
                                    <dd v-else>
                                        <strong>{{ php.number_format(c_account_info.available_amount) }}</strong>
                                        <em>{{ $t('count') }}</em>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt v-if="trade_method === 'MARGIN'">{{ tab[1] === $t('buy') ? $t('buy_amount') : $t('sell_amount') }}({{ fromPairs(constants.asset.asset_codes)[s_asset].split('/')[0] }})</dt>
                                    <dt v-else>{{ tab[1] }}{{ $t('amount') }}</dt>
                                    <dd>
                                        <input type="text" class="txt" v-restrict.number.decimal v-model.number="target_amount[c_postition]">
                                        <button type="button" @click.prevent="setTradeRatio(100)" class="sel_per">{{ $t('possibility') }}</button>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt v-if="trade_method === 'MARGIN'">{{ tab[1] === $t('buy') ? $t('buy_price') : $t('sell_price') }}</dt>
                                    <dt v-else>{{ tab[1] }}{{ $t('price_symbol_defalt') }}</dt>
                                    <dd>
                                        <vue-numeric type="text" class="txt" v-restrict.number v-model.number="target_tick[c_postition]"></vue-numeric>
                                        <button @click.prevent="target_tick[c_postition] = Math.max(target_tick[c_postition] * 1 - asset_setting.tick_unit * 1, 0)" type="button" class="spin minus">-</button>
                                        <button @click.prevent="target_tick[c_postition] = target_tick[c_postition] * 1 + asset_setting.tick_unit * 1" type="button" class="spin plus">+</button>
                                    </dd>
                                </dl>
                                <dl v-if="trade_method === 'FUTURES'">
                                    <dt>{{ $t('futures') }}</dt>
                                    <dd>
                                        <select v-model="selected_future_srl" class="future_list">
                                            <option selected disabled value=null>({{ $t('mypage.select') }})</option>
                                            <option v-for="future in futures" :key="future.future_srl" :label="future.title" :value="future.future_srl">{{ future.title }}</option>
                                        </select>
                                        
                                    </dd>
                                </dl>
                                <dl class="total">
                                    <dt>{{ $t('order_total_amount') }}</dt>
                                    <dd>
                                        <strong v-if="trade_method === 'MARGIN'">{{ php.number_format(target_tick[c_postition] * target_amount[c_postition] / (c_account_info.leverage || 1)) }}</strong>
                                        <strong v-else>{{ php.number_format((asset_setting.futures_price * target_amount[c_postition]) / (c_account_info.leverage || 1)) }}</strong>
                                        <em>{{ $t('symbol_defalt') }}</em>
                                    </dd>
                                </dl>
                                <p class="note">
                                    <span>{{ $t('traderoom.min_trade_margin', [s_account_info ? php.number_format(asset_setting.min_trade_margin[s_account_info.trade_type]) : '-', 1]) }}</span>
                                    <span>{{ $t('price_symbol_fee') }}{{ c_total_fee_ratio }}%</span>
                                </p>
                                <ul class="order_btn">
                                    <li><button type="button" class="reset" @click.prevent="clear"><i class="fa fa-refresh" aria-hidden="true"></i>{{ $t('reset') }}</button></li>
                                    <li><button type="button" @click.prevent="trade()" :class="[tab[0].toLowerCase()]">{{ tab[1] }}</button></li>
                                    <li><button type="button" @click.prevent="trade(true)" :class="[tab[0].toLowerCase() + 'Now']">{{ tab[1] === $t('buy') ? $t('market_order') : $t('market_sell') }}</button></li>
                                </ul>
                            </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="live_trade">
                <div class="tab_btn" data-tab="live_trade">
                    <button v-for="([key, title], idx) in live_trade_tabs" type="button" @click.prevent="selected_live_trade_tab = key" :class="{ on: selected_live_trade_tab === key }">{{ title }}</button>
                </div>
                <div class="tab_cnt" data-tab="live_trade">
                    <div v-for="([key, title], idx) in live_trade_tabs" :class="['tab_sec', { on: selected_live_trade_tab === key }]" :data-tab="key">
                        <template v-if="key === 'conclusion'">
                            <div class="tb_header">
                                <table>
                                    <colgroup><col width="20%"><col width="25%"><col width="25%"><col width="20%"></colgroup>
                                    <thead>
                                        <tr>
                                            <th>{{ $t('execution_time') }}</th>
                                            <th>{{ $t('execution_price_symbol_defalt') }}</th>
                                            <th>{{ $t('execution_amount') }}({{ fromPairs(constants.asset.asset_codes)[s_asset].split('/')[0] }})</th>
                                            <th>{{ $t('execution_sum_symbol_defalt') }}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <perfect-scrollbar class="tb_body">
                                <table>
                                    <colgroup><col width="20%"><col width="25%"><col width="25%"><col width="20%"></colgroup>
                                    <tbody>
                                        <tr v-for="val in c_linkbooks">
                                            <td>{{ php.date('H:i:s', val.timestamp / 1000) }}</td>
                                            <td :class="[val.position == 'CALL' ? 'up' : 'down', 'price']">{{ php.number_format(val.premium) }}</td>
                                            <td :class="[val.position == 'CALL' ? 'up' : 'down', 'tradecost']">{{ php.number_format(val.amount, 8) }}</td>
                                            <td>{{ php.number_format(val.premium * val.amount) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </perfect-scrollbar>
                        </template>
                        <template v-if="key === 'daily'">
                            <div class="tb_header">
                                <table>
                                    <colgroup><col width="20%"><col width="28%"><col width="28%"><col width="20%"></colgroup>
                                    <thead>
                                        <tr>
                                            <th>{{ $t('date') }}</th>
                                            <th>{{ $t('closing_price_symbol_defalt') }}</th>
                                            <th>{{ $t('previous_closing_price_contrast') }}</th>
                                            <th>{{ $t('volume') }}({{ fromPairs(constants.asset.asset_codes)[s_asset].split('/')[0] }})</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <perfect-scrollbar class="tb_body">
                                <table>
                                    <colgroup><col width="20%"><col width="28%"><col width="28%"><col width="20%"></colgroup>
                                    <tbody>
                                        <tr v-for="val in c_daily_candles" :class="val.updown">
                                            <td>{{ php.date('m.d', val.timestamp / 1000) }}</td>
                                            <td class="price">{{ php.number_format(val.close) }}</td>
                                            <td class="per">{{ val.updown === 'down' ? '' : '+' }}{{ php.number_format(val.percentage, 2) }}%</td>
                                            <td class="tradecost">{{ php.number_format(val.volume) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </perfect-scrollbar>
                        </template>
                    </div>
                </div>
            </div>
            </div>
            <div class="have_panel">
                                    <perfect-scrollbar tag="div" class="invest">
                        <!--p style="text-align:center; font-size:25px"><br /><br />미니차트<br /><br /></p-->
                                            <div v-if="trade_method === 'MARGIN'" class="profile profile-box">
                        <div class="tb_header">
                            <table>
                                <colgroup><col width="120"><col width="140"><col width="50"><col width="140"><col width="140"><col width="135"><col width="100"></colgroup>
                                <thead>
                                    <tr>
                                        <th>{{ $t('holding_coin') }}</th>
                                        <th>{{ $t('holding_amount') }}</th>
                                        <th>{{ $t('position') }}</th>
                                        <th>{{ $t('entry_payment') }}</th>
                                        <th>{{ $t('evaluated_price') }}</th>
                                        <th>{{ $t('valuation_profit_loss_percent') }}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tb_body" v-if="c_trade_list.length">
                            <table>
                                <colgroup><col width="120"><col width="140"><col width="50"><col width="140"><col width="140"><col width="135"><col width="100"></colgroup>
                                <tbody>
                                    <template v-for="val in c_trade_list">
                                        <tr>
                                            <td>
                                                <span :class="['symbol', 'iCoin', s_asset]"></span>
                                                <p class="coin_name">
                                                    <strong class="ko_name">{{ fromPairs(constants.asset.assets)[val.asset] }}</strong>
                                                    <span class="en_name">{{ fromPairs(constants.asset.asset_codes)[val.asset] }}</span>
                                                </p>
                                            </td>
                                            <td><b>{{ php.number_format(val.amount, 8) }}</b><span class="unit">{{ fromPairs(constants.asset.asset_codes)[val.asset].split('/')[0] }}</span></td>
                                            <td>
                                                <em>{{ fromPairs(constants.trade.positions)[val.position] }}</em>
                                            </td>
                                            <td>
                                                <em>{{ php.number_format(val.tick) }}</em>
                                                <span class="unit">CCE</span>
                                            </td>
                                            <td>
                                                <strong>{{ php.number_format(val.evaluated_estate) }} <span class="unit">CCE</span></strong>
                                            </td>
                                            <td>
                                                <em :class="[val.evaluated_percentage > 0 ? 'up' : 'down']">{{ val.evaluated_percentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_percentage, 8) }}</em><span class="unit">%</span>
                                                <br />
                                                <em>{{ val.evaluated_percentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_gain_loss) }}</em>
                                                <span class="unit">{{ $t('symbol_defalt') }}</span>
                                            </td>
                                            <td class="order_btn">
                                                <button v-if="val.status === 'PENDING'" @click.prevent="cancelTrade(val.trade_srl)" type="button">{{ $t('cancel') }}</button>
                                                <button v-else @click.prevent="s_trade_srl = s_trade_srl == val.trade_srl ? null : val.trade_srl" type="button">{{ $t('order') }}</button>
                                            </td>
                                        </tr>
                                        <tr class="order_tb" v-if="s_trade_srl == val.trade_srl">
                                            <td colspan="7">
                                                <div class="order_tb_input">
                                                    <p>
                                                        <template v-if="val.use_auto_clear === 'N'">
                                                            <vue-numeric v-restrict.number v-model.number="s_trade_params.auto_clear_tick" type="text"></vue-numeric>
                                                            <button type="button" @click.prevent="setAutoClear">{{ $t('limit_price_check') }}</button>
                                                        </template>
                                                        <template v-else>
                                                            <vue-numeric :value="val.auto_clear_tick" disabled type="text"></vue-numeric>
                                                            <button type="button" @click.prevent="unsetAutoClear">{{ $t('limit_price_cancel') }}</button>
                                                        </template>
                                                        <button type="button" @click.prevent="clearTrade" class="sell">{{ $t('market_price_liquidation') }}</button>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="none_list">{{ $t('msg_no_possessed_item') }}</div>
                    </div>
                    <div v-else-if="trade_method === 'FUTURES'" class="profile profile-box">
                        <div class="tb_header">
                            <table>
                                <colgroup><col width="120"><col width="100"><col width="50"><col width="100"><col width="120"><col width="120"><col width="120"><col width="120"><col width="80"></colgroup>
                                <thead>
                                    <tr>
                                        <th>{{ $t('holding_coin') }}</th>
                                        <th>{{ $t('future_name') }}</th>
                                        <th>{{ $t('position') }}</th>
                                        <th>{{ $t('holding_amount') }}</th>
                                        <th>{{ $t('average_price') }}</th>
                                        <th>{{ $t('current_price') }}</th>
                                        <th>{{ $t('valuation_profit_loss_rate') }}</th>
                                        <th>{{ $t('realization_net_profit') }}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tb_body" v-if="c_trade_list.length">
                            <table>
                                <colgroup><col width="120"><col width="100"><col width="50"><col width="100"><col width="120"><col width="120"><col width="120"><col width="120"><col width="80"></colgroup>
                                <tbody>
                                    <template v-for="(val,idx) in c_trade_list">
                                        <tr>
                                            <td>
                                                <span :class="['symbol', 'iCoin', s_asset]"></span>
                                                <p class="coin_name">
                                                    <strong class="ko_name">{{ fromPairs(constants.asset.assets)[val.asset] }}</strong>
                                                    <span class="en_name">{{ fromPairs(constants.asset.asset_codes)[val.asset] }}</span>
                                                </p>
                                            </td>
                                            <td v-if="c_filter_futures.length">{{ c_filter_futures[idx].title }}</td>
                                            <td>
                                                <em>{{ fromPairs(constants.trade.positions)[val.position] }}</em>
                                            </td>
                                            <td><b>{{ php.number_format(val.amount, 8) }}</b><span class="unit">{{ fromPairs(constants.asset.asset_codes)[val.asset].split('/')[0] }}</span></td>
                                            
                                            <td>
                                                <em>{{ php.number_format(val.tick) }}</em>
                                                <span class="unit">CCE</span>
                                            </td>
                                            <td>
                                                <strong>{{ php.number_format(0) }} <span class="unit">CCE</span></strong>
                                            </td>
                                            <td>
                                                <em :class="[val.evaluated_precentage > 0 ? 'up' : 'down']">{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_precentage, 2) }}</em><span class="unit">%</span>
                                                <br />
                                                <em>{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_gain_loss) }}</em>
                                                <span class="unit">{{ $t('symbol_defalt') }}</span>
                                            </td>
                                            <td>{{ php.number_format(val.holding_gain_loss) }}  <span class="unit">CCE</span></td>

                                            <td class="order_btn">
                                                <button v-if="val.status === 'PENDING'" @click.prevent="cancelTrade(val.trade_srl)" type="button">{{ $t('cancel') }}</button>
                                                <button v-else @click.prevent="s_trade_srl = s_trade_srl == val.trade_srl ? null : val.trade_srl" type="button">{{ $t('order') }}</button>
                                            </td>
                                        </tr>
                                        <tr class="order_tb" v-if="s_trade_srl == val.trade_srl">
                                            <td colspan="7">
                                                <div class="order_tb_input">
                                                    <p>
                                                        
                                                        <button type="button" @click.prevent="clearFutureBalance" class="sell">{{ $t('market_price_liquidation') }}</button>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="none_list">{{ $t('msg_no_possessed_item') }}</div>
                    </div>

                    </perfect-scrollbar>

            </div>
    </div>
</template>

<style scoped>
.modal-title{ width:90%; height: 50px; line-height: 50px; color: #fff; background: #2d3d51; vertical-align: center;font-size: 20px; padding-left: 30px; margin: 10px 0 50px 30px; border-top-left-radius: 10px; border-top-right-radius: 10px;}
.modal-box{margin-top: 10px; margin-left:50px; }
.modal-item{float: left; margin: 5px 150px 10px 50px; width: 280px;  border-bottom: 1px solid #ddd; padding: 0 0 10px 5px;}
.modal-btn{ text-align: center; clear: both; padding-top: 20px;}
.modal-btn button{text-align: center; background: #2d3d51; width: 120px; padding: 10px; display: inline-block; height: 100%; text-align: center;  font-size: 16px; color: #fff; margin-top: 20px;}

select {display: inline-block; width: 85px;height: 18px;padding: 0 10px;border: 1px solid #ddd;line-height: 18px;color: #222;font-size: 11px;}

.wrapper section {
    display: inline-block;
    clear: none;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import * as assetApi from '@/api/asset'
import * as tradeApi from '@/api/trade'
import * as futureApi from '@/api/futures'
import ChartIQ from '@/components/ChartIQ'
import TVChartContainer from '@/components/TVChartContainer.vue'
import _ from 'lodash'
import php from 'phpjs'
import func from '@/classes/func.inc'
import vueSlider from 'vue-slider-component/src/vue2-slider.vue'
import VueNumeric from 'vue-numeric'
import Cookies from 'js-cookie';

export default {
    name: 'traderoom',
    data () {
        return {
            past_tick: null,
            target_tick: { CALL: 0, PUT: 0 },
            target_amount: { CALL: 0, PUT: 0 },
            tabs: [['BUY', this.$t('buy')], ['SELL', this.$t('sell')], ['HISTORY', this.$t('transactional_information')]],
            history_tabs: [['PENDING', this.$t('no_execution')], ['LINKED', this.$t('execution')]],
            price_tabs: [['ORDER', this.$t('asking_price')], ['GENERAL', this.$t('general')]],
            live_trade_tabs: [['conclusion', this.$t('conclusion')], ['daily', this.$t('daily')]],
            selected_price_tab: 'ORDER',
            selected_history_tab: 'PENDING',
            selected_tab: 'BUY',
            selected_live_trade_tab: 'conclusion',
            selected_account_srl: 0,
            accounts: [],
            is_loaded: false,
            orderbooks: {
                call: [],
                put: [],
            },
            linkbooks: [],
            futures: [],
            selected_future_srl: null,
            trade_ratio: 0,
            listen_events: ['tradeRequest', 'tradeClear', 'tradeLink', 'tradeCancel', 'withdrawApprove', 'depositApprove', 'orderbooks', 'tradeamount'],
            call_params: {},
            put_params: {},
            trade_loading: false,
            history_loading: false,
            s_trade_srl: null,
            s_trade_params: {},
            s_trade_loading: false,
            trade_history: [],
            click_params: { type: 'A', percentage: 50, trade_margin: 0, show_slider: false },
            percentage_types: [10, 25, 50, 100],
            periodicity_types: [
                { period: 1, timeUnit: 'minute', title: this.$t('min_1') },
                { period: 5, timeUnit: 'minute', title: this.$t('min_5') },
                { period: 1, timeUnit: 'minute', interval: 10, title: this.$t('min_10') },
                { period: 1, timeUnit: 'minute', interval: 15, title: this.$t('min_15') },
                { period: 2, timeUnit: 'minute', interval: 15, title: this.$t('min_30') },
                { period: 1, timeUnit: 'hour', title: this.$t('hour_1') },
                { period: 4, timeUnit: 'hour', interval: 1, title: this.$t('hour_4') },
                { period: 1, timeUnit: 'day', title: this.$t('day_1') },
            ],
            chart_styles: [['candle', 'Candle'], ['bar', 'Bar'], ['colored_bar', 'Colored Bar'], ['line', 'Line'], ['hollow_candle', 'Hollow Candle'], ['mountain', 'Mountain'], ['baseline_delta', 'Baseline'], ['volume_candle', 'Volume Candle'], ['heikinashi', 'Heikin Ashi'], ['kagi', 'Kagi'], ['linebreak', 'Line Break'], ['renko', 'Renko'], ['rangebars', 'Range Bars']],
            s_chart_style: 'candle',
            s_periodicity_type_idx: 0,
            daily_candles: [],
            show_study_modal: false,
            s_studies: [],
            func,
            s_chart: Cookies.get('c_chart') ? Cookies.get('c_chart') : 'tradingView',
        };
    },
    components: { ChartIQ, vueSlider, VueNumeric, TVChartContainer },
    created() {
        this.past_tick = this.current_tick;
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    mounted() {
        // this.$nextTick(() => {

        //     var parent_rect = this.$refs.price_info.getBoundingClientRect();
        //     var target_y = this.$refs.price_info.querySelector('tr.selected').getBoundingClientRect().y;
        //     target_y = target_y - parent_rect.y - parent_rect.height / 2 + this.$refs.price_info.querySelector('tr.selected').getBoundingClientRect().height;

        //     this.$refs.price_info.scrollTo(0, target_y);
        // })

    },
    methods: {
        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        setPosition(position, tick) {
            console.log(this.$t('tick_click'), arguments)
            this.target_tick[position] = tick;
            this.selected_tab = position == 'CALL' ? 'BUY' : 'SELL';
        },

        clear() {
            this.target_tick[this.c_postition] = 0;
            this.target_amount[this.c_postition] = 0;
        },

        trade(market_price = false) {
            var vm = this;

            if(!vm.is_logged) {
                vm.$toasted.error(this.$t('msg_login_use'));
                return this.$router.push({ name: 'login' });
            }

            if(!vm.s_account_info) return vm.$toasted.error(this.$t('msg_account_select'));

            this.trade_loading = true;
            tradeApi.createTrade({
                account_srl: vm.s_account_info.account_srl,
                asset: vm.selected_asset,
                tick: market_price ? null : vm.target_tick[vm.c_postition],
                amount: vm.target_amount[vm.c_postition],
                position: vm.c_postition,
                future_srl: vm.selected_future_srl
            }).then(() => {
                vm.clear();
                this.trade_loading = false;
            }).catch(() => {
                this.trade_loading = false;
            })
        },

        cancelTrade(trade_srl) {
            this.s_trade_loading = true;
            tradeApi.cancelTrade(trade_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            })
        },

        clearTrade() {
            this.s_trade_loading = true;
            tradeApi.clearTrade(this.s_trade_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            })
        },
        clearFutureBalance() {
            var vm = this;
            this.s_trade_loading = true;
            var future_balance_info = _.find(vm.future_balances, { balance_srl: this.s_trade_srl });
            tradeApi.clearFutureBalance({
                account_srl: future_balance_info.account_srl,
                asset: future_balance_info.asset,
                tick: null,
                amount: Math.abs(future_balance_info.amount),
                position: future_balance_info.amount < 0 ? 'CALL' : 'PUT',
                future_srl: future_balance_info.future_srl
            }).then(({message}) => {
                this.s_trade_loading = false;
            }).catch((e) => {
                this.s_trade_loading = false;
            })
        },
        setAutoClear() {
            this.s_trade_loading = true;
            this.$store.dispatch('setAutoClear', {
                trade_srl: this.s_trade_srl,
                auto_clear_tick: this.s_trade_params.auto_clear_tick
            }).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            });
        },

        unsetAutoClear() {
            this.s_trade_loading = true;
            this.$store.dispatch('unsetAutoClear', this.s_trade_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            });
        },

        init() {
            if(this.trade_method === 'MARGIN') {
                Promise.all([this.loadOrderbooks(), this.loadLinkbooks(), this.loadDailyCandles()]).then(() => {
                this.is_loaded = true;
                this.attachListener();
                })
            }else if(this.trade_method === 'FUTURES') {
                Promise.all([this.loadOrderbooks(), this.loadLinkbooks(), this.loadDailyCandles(), this.loadFutures()]).then(() => {
                this.is_loaded = true;
                this.attachListener();
                })
            }
        },

        doClickTrade(position, tick) {
            if(this.selected_price_tab != 'ORDER' || !this.s_account_info) return;
            var position_tabs = { 'CALL': 'BUY', 'PUT': 'SELL' }

            this.target_tick[position] = tick;
            this.selected_tab = position_tabs[position];

            // 수수료를 더하여 가능 수량을 지정
            tick *= 1 + this.c_total_fee_ratio / 100;
            switch(this.click_params.type) {
                case 'A':
                    this.target_amount[position] = this.c_account_info.available_amount / 100 * this.click_params.percentage;
                    break;

                case 'M':
                    this.target_amount[position] = this.click_params.trade_margin / (tick / this.s_account_info.leverage);
                    break;
            }

            this.target_amount[position] = this.toFixedFloor(this.target_amount[position], this.asset_setting.amount_decimal_point) * 1;
        },

        async loadDailyCandles() {
            var { logs } = await assetApi.fetchOhlcList(this.s_asset, { interval: 86400, limit: 31 });
            logs.reverse();

            this.daily_candles = logs.reverse();
        },

        toFixedFloor(num, length) {
            const multiplyer = Math.pow(10, length);

            return Math.floor(num * multiplyer) / multiplyer;
        },
        loadFutures(callback) {
            if(!this.is_logged) return
            return futureApi.fetchFutures({ asset: this.selected_asset }).then(({ data }) => {
                this.futures = data
            })
        },
        loadFutureBalances(callback) {
            return futureApi.fetchFutureBalance({ asset: this.selected_asset }).then(({data}) => {
                this.future_balances = data
            })
        },
        loadLinkbooks(callback) {

            this.linkbooks = []
            return assetApi.fetchLinkbook(this.selected_asset).then(({ linkbooks }) => {
                this.linkbooks = linkbooks;
            })
        },

        loadOrderbooks() {

            this.orderbooks = { call: [], put: [] }
            return assetApi.fetchOrderbook(this.selected_asset).then(({ orderbooks }) => {
                this.orderbooks.call = orderbooks.CALL;
                this.orderbooks.put = orderbooks.PUT;
            })
        },

        loadTradeHistory() {
            if(this.selected_tab != 'HISTORY' || !this.is_logged || !this.s_account_info) return Promise.resolve();

            this.history_loading = true;
            return tradeApi.fetchHistory({ account_srl: this.s_account_info.account_srl }).then(({ data }) => {
                this.trade_history = data;
                this.history_loading = false;
            }).catch(() => {

                this.history_loading = false;
            });
        },

        setTradeRatio(trade_ratio) {

            this.target_amount[this.c_postition] = this.c_account_info.available_amount / 100 * trade_ratio;
            this.target_amount[this.c_postition] = this.target_amount[this.c_postition].toFixed(this.asset_setting.amount_decimal_point) * 1;
            this.trade_ratio = 0;
        },
        setTradeRatioFutures(trade_ratio) {
            this.target_amount[this.c_postition] = this.c_account_info.available_amount / 100 * trade_ratio;
                        this.target_amount[this.c_postition] = this.target_amount[this.c_postition].toFixed(this.asset_setting.amount_decimal_point) * 1;

            this.trade_ratio = 0;
        },

        // 호가단위 갯수의 차를 구함
        diffTickUnitCount(tick_unit, tick1, tick2) {

            return tick1 / tick_unit - tick2 / tick_unit;
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'tradeClear':
                case 'tradeCancel':
                    this.loadTradeHistory();
                    break;
                case 'orderbooks':
                    if(data.asset != this.selected_asset) {
                        return;
                    }
                    this.orderbooks.call = data.orderbooks.CALL;
                    this.orderbooks.put = data.orderbooks.PUT;

                    break;

                case 'tradeamount':
                    if(data.asset != vm.selected_asset) return;

                    vm.linkbooks.unshift(data);

                    if(vm.linkbooks.length > 30) {
                        vm.linkbooks.pop();
                    }

                    break;
            }
        },

        avoidDecimal() {
            this.target_tick[this.c_postition]
        },

        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        },
        showBasicChart() {
            this.s_chart = 'basicChart'
        }
    },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            trade_list: state => state.trade.unclosed_trades,
            s_asset: state => state.asset.s_asset,
            trade_method: state => state.common.trade_method,
            future_balances: state => state.future.future_balances
        }),
        ...mapGetters(['s_asset_info', 's_account_info', 'is_logged', 's_asset_fee']),
        _() {
            return _;
        },
        c_filter_futures() {
            const futures_title = []
            _.forEach(this.c_trade_list, (data) => {
                let future = _.find(this.futures, (e) => {
                    return e.future_srl === data.future_srl
                })
                if(future) {
                    futures_title.push(future)
                }
            })
            return futures_title
        },
        pending_total_fee_sum() {
            return _.sumBy(_.filter(this.c_future_trade_list, { status: 'PENDING' }), 'total_fee')
        },
        linked_total_fee_sum() {
            return _.sumBy(_.filter(this.c_future_trade_list, { status: 'LINKED' }), 'total_fee')
        },
        op_position_linked_amount() {
            return _.sumBy(_.filter(this.c_future_trade_list, { status: 'LINKED', position: this.c_postition === 'CALL' ? 'PUT' : 'CALL' }), 'amount')
        },
        op_position_pending_amount() {
            return _.sumBy(_.filter(this.c_future_trade_list, { status: 'PENDING', position: this.c_postition === 'CALL' ? 'PUT' : 'CALL' }), 'amount')
        },
        php() {
            return php;
        },
        c_total_fee_ratio() {
            const { use_seperate_fee = 'N' } = this.s_account_info || {};
            const total = _.chain(this.s_asset_fee)
                .pick('handling_fee', 'market_fee')
                .toPairs()
                .map(([key, val]) => {
                    val *= 1;

                    if (use_seperate_fee != 'Y') return val;

                    val *= this.s_account_info[key] / 100 + 1;

                    return val;
                })
                .sum()
                .value();

            return total;
        },
        c_postition() {

            return this.selected_tab === 'BUY' ? 'CALL' : 'PUT';
        },
        c_account_info() {
            var account_info = _.defaults(this.s_account_info, { account_srl: 0, margin: 0, holding_balance: 0, account_type: 'DEMO', leverage: 1, trade_type: 'MARGIN' });

            // 수수료를 더하여 가능 수량을 지정
            var tick = this.target_tick[this.c_postition] * 1;
            tick *= 1 + this.c_total_fee_ratio / 100;
            if(this.trade_method === 'MARGIN') {
                account_info.available_amount = tick ? (account_info.margin - account_info.holding_balance) / (tick / account_info.leverage) : 0;
                account_info.available_amount = this.toFixedFloor(account_info.available_amount, this.asset_setting.amount_decimal_point) * 1;

                return account_info;

            }else if(this.trade_method === 'FUTURES') {
                account_info.available_amount = Math.max(Math.floor(((account_info.margin - account_info.holding_balance + this.pending_total_fee_sum + this.linked_total_fee_sum) * account_info.leverage) / this.asset_setting.futures_price) + this.op_position_linked_amount + this.op_position_pending_amount, this.op_position_linked_amount + this.op_position_pending_amount)
                account_info.available_amount = this.toFixedFloor(account_info.available_amount, this.asset_setting.amount_decimal_point) * 1;
                return account_info
            }
        },
        orderbook_high() {

            return {
                CALL: _.chain(this.orderbooks.call).fromPairs().values().max().value(),
                PUT: _.chain(this.orderbooks.put).fromPairs().values().max().value(),
            }
        },
        ticks() {
            var premium = this.premium;
            if(!premium) return [];

            var asset_setting = this.asset_setting;
            var ticked_premium = this.current_tick;

            var ticks = [];
            var orderbooks = {
                CALL: _.fromPairs(this.orderbooks.call),
                PUT: _.fromPairs(this.orderbooks.put),
            }

            // 매도 호가
            for(var i = (this.current_tick > this.past_tick ? 9 : 8); i > 0; i--) {
                ticks.push({ premium: ticked_premium + i * asset_setting.tick_unit, type: 'PUT' });
            }

            // 현재 호가
            ticks.push({ premium: ticked_premium, type: this.current_tick > this.past_tick ? 'CALL' : 'PUT' });

            // 매수 호가
            for(i = 1; i <= (this.current_tick > this.past_tick ? 8 : 9); i++) {
                ticks.push({ premium: ticked_premium - i * asset_setting.tick_unit, type: 'CALL' });
            }

            ticks = _.map(ticks, (tick) => {
                return {
                    ...tick,
                    ratio: (orderbooks[tick.type][tick.premium] || 0) / this.orderbook_high[tick.type] * 100,
                    amount: orderbooks[tick.type][tick.premium] || 0,
                }
            })

            return ticks;
        },
        premium() {

            return this.premiums[this.selected_asset];
        },
        asset_setting() {

            return this.asset_settings[this.selected_asset];
        },
        selected_asset() {

            return this.s_asset;
        },
        current_tick() {

            return this.premiumToTick(this.asset_setting, this.premium);
        },
        c_future_trade_list() {
            var trade_list = [];
            var vm = this;

            if(!vm.s_account_info) return [];

            var target_datas = [].concat(vm.s_account_info.trade_type == 'FUTURES' ? vm.future_balances : [], this.trade_list);
            var account_info = vm.s_account_info;

            target_datas = _.filter(target_datas, { account_srl: account_info.account_srl, asset: this.s_asset_info.asset });
            _.each(target_datas, (val, key) => {
                var trade = {};
                var asset_setting = vm.asset_settings[val.asset];
                var current_tick = vm.current_tick;
                var tick_unit_count_diff = 0;
                switch(account_info.trade_type) {
                    case 'MARGIN':
                        trade = _.extend({}, val);
                        tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);
                        var trade_margin = trade.trade_margin;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

                        trade.trade_margin = trade_margin;
                        break;

                    case 'FUTURES':
                        _.extend(trade, {
                            trade_srl: val.trade_srl || val.balance_srl,
                            asset: val.asset,
                            future_srl: val.future_srl,
                            future_title: val.future_title,
                            trade_margin: val.trade_margin || (val.unit_price * Math.abs(val.amount) / val.leverage),
                            tick: val.tick || val.average_tick,
                            amount: Math.abs(val.amount),
                            position: val.position || (val.amount < 0 ? 'PUT' : 'CALL'),
                            evaluated_gain_loss: 0,
                            evaluated_estate: 0,
                            evaluated_percentage: 0,
                            total_fee: val.unit_fee * Math.abs(val.amount),
                            status: val.balance_srl ? 'LINKED' : 'PENDING'
                        })

                        tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);

                        if(val.trade_srl && val.status != 'PENDING') return;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

                        break;
                }

                trade.evaluated_gain_loss = asset_setting.tick_unit_profit[account_info.trade_type] * tick_unit_count_diff * trade.amount; // 평가 손익
                trade.tick_unit_count_diff = tick_unit_count_diff;
                trade.holding_gain_loss = trade.evaluated_gain_loss - trade.total_fee;
                trade.evaluated_estate = trade.trade_margin + trade.evaluated_gain_loss; // 평가 금액
                trade.evaluated_percentage = trade.evaluated_estate / trade.trade_margin * 100 - 100; // 손익률

                trade_list.push(trade);
            })

            return trade_list;
        },
        c_trade_list() {
            var trade_list = [];
            var vm = this;

            if(!vm.c_account_info) return [];

            var target_datas = [].concat(vm.c_account_info.trade_type == 'FUTURES' ? vm.future_balances : [], this.trade_list);
            var account_info = vm.c_account_info;

            target_datas = _.filter(target_datas, { account_srl: account_info.account_srl, asset: this.s_asset_info.asset });
            _.each(target_datas, (val, key) => {
                var trade = {};
                var asset_setting = vm.asset_settings[val.asset];
                var current_tick = vm.current_tick;
                var tick_unit_count_diff = 0;
                switch(account_info.trade_type) {
                    case 'MARGIN':
                        trade = _.extend({}, val);
                        tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);
                        var trade_margin = trade.trade_margin;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

                        trade.trade_margin = trade_margin;
                        break;

                    case 'FUTURES':
                        _.extend(trade, {
                            trade_srl: val.trade_srl || val.balance_srl,
                            asset: val.asset,
                            future_srl: val.future_srl,
                            future_title: val.future_title,
                            trade_margin: val.trade_margin || (val.unit_price * Math.abs(val.amount) / val.leverage),
                            tick: val.tick || val.average_tick,
                            amount: Math.abs(val.amount),
                            position: val.position || (val.amount < 0 ? 'PUT' : 'CALL'),
                            evaluated_gain_loss: 0,
                            evaluated_estate: 0,
                            evaluated_percentage: 0,
                            total_fee: val.unit_fee * Math.abs(val.amount),
                            status: val.balance_srl ? 'LINKED' : 'PENDING'
                        })

                        tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);

                        if(val.trade_srl && val.status != 'PENDING') return;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

                        break;
                }

                trade.evaluated_gain_loss = asset_setting.tick_unit_profit[account_info.trade_type] * tick_unit_count_diff * trade.amount; // 평가 손익
                trade.tick_unit_count_diff = tick_unit_count_diff;
                trade.holding_gain_loss = trade.evaluated_gain_loss - trade.total_fee;
                trade.evaluated_estate = trade.trade_margin + trade.evaluated_gain_loss; // 평가 금액
                trade.evaluated_percentage = trade.evaluated_estate / trade.trade_margin * 100 - 100; // 손익률

                trade_list.push(trade);
            })

            return trade_list;
        },
        c_accounts() {
            var accounts = [];
            var vm = this;

            _.each(vm.accounts, (val, key) => {
                var account = _.extend({}, val);
                var account_trades = _.filter(vm.c_trade_list, { account_srl: account.account_srl });

                // var trade_margin = _.chain(account_trades).map('trade_margin').sum().value(); // 주문 시 사용된 증거금의 합계 (수수료 제외)

                account.evaluated_gain_loss = _.chain(account_trades).filter({ status: 'LINKED' }).map('evaluated_gain_loss').sum().value(); // 주문의 손익금 합계
                account.evaluated_estate = account.margin + account.evaluated_gain_loss; // 평가 자산
                account.evaluated_percentage = (account.margin + account.evaluated_gain_loss) / account.margin * 100 - 100; // 손익률

                accounts.push(account);
            })

            return accounts;
        },
        c_selectable_accounts() {
            return _.filter(this.accounts, { trade_type: 'MARGIN', trader_type: 'DIRECT' })
        },
        c_histories() {
            return _.chain(this.c_trade_list).filter({ status: this.selected_history_tab }).map((trade_info) => {
                trade_info.action_icon = trade_info.status === 'PENDING' ? 'xi-close-thin' : 'xi-check-thin';

                return trade_info;
            }).value();
        },
        c_history_nodata_msg() {
            return this.selected_history_tab == 'PENDING' ? this.$t('msg_no_execution_no_history') : this.$t('msg_no_execution_history');
        },

        c_linkbooks() {

            return this.linkbooks.slice(0, 15);
        },

        c_orderbooks() {
            var orderbooks = {
                CALL: _.fromPairs(this.orderbooks.call),
                PUT: _.fromPairs(this.orderbooks.put),
            }

            var c_orderbooks = { CALL: [], PUT: [] }

            this.ticks.forEach((val) => {
                c_orderbooks[val.type].push({
                    premium: val.premium,
                    type: val.type,
                    ratio: (orderbooks[val.type][val.premium] || 0) / this.orderbook_high[val.type] * 100,
                    amount: orderbooks[val.type][val.premium] || 0,
                    ratio_today_first: val.premium / this.s_asset_info['today_first'] * 100 - 100,
                })
            })

            return c_orderbooks;
        },
        cs_trade_info() {
            return _.find(this.trade_list, { trade_srl: this.s_trade_srl });
        },
        c_daily_candles() {
            const daily_candles = [];

            this.daily_candles.forEach((val, idx) => {
                if (!this.daily_candles[idx + 1]) return false;

                daily_candles.push({
                    ...this.daily_candles[idx],
                    yesterday_close: this.daily_candles[idx + 1].close,
                })
            })
            return _.map(daily_candles, val => ({
                ...val,
                percentage: val.close / val.yesterday_close * 100 - 100,
                updown: val.close < val.yesterday_close ? 'down' : 'up',
            }));
        },
    },
    watch: {
        current_tick(to, from) {
            this.past_tick = from;
        },
        's_asset_info.asset': function() {
            this.target_tick = { CALL: 0, PUT: 0 };
            this.target_amount = { CALL: 0, PUT: 0 };
            this.dettachListener();
            this.init();
        },
        's_account_info.account_srl': function() {
            this.loadTradeHistory();
        },
        s_trade_srl() {
            this.s_trade_params = {};
        },
        selected_tab(to) {
            this.loadTradeHistory();
        },
        s_chart() {
            Cookies.set('c_chart', this.s_chart);
        }
    }
}
</script>

<template>
    <div :id="`chartHolder`"></div>
</template>
<script>
import _ from 'lodash'
import php from 'phpjs'
// import 'expose-loader?!assets/javascripts/rMateStockChartH5.js'
export default {
    name: 'StockChart',
    props: {
        chartId: null,
        chartData: { default: () => [] },
        chartType: { default: 'hloc' },
        axisType: { default: 'Linear' },
        dataTipMode: { default: 'normal' },
        overlays: { default: () => [] },
        sideCharts: { default: () => [] },
        isZoomByWheel: { default: true },
        showCrossHair: { default: true },
        showLegend: { default: true },
    },
    data() {
        return {
            php
        }
    },
    watch: {
        chartData(to, from) {
            var vm = this;
            var to_last = to[to.length - 1];
            var is_equal = _.isEqual(from.slice(0, to.length - 2), to.slice(0, to.length - 2));

            if(to.length && is_equal) {
                if(to.length === from.length) {
                    vm.updateLastPoint(to_last);

                } else if(to.length > from.length) {
                    vm.addDataAfter(to_last);
                }
            } else {

                vm.setData(to);
            }
        },
        chartType(to) {
            var vm = this;
            console.log(vm.sideCharts);
            window.rMateStock.setChartType(vm.chartId, to);
        },
        axisType(to) {
            window.rMateStock.setYAxisType(this.chartId, to);
        },
        dataTipMode(to) {
            window.rMateStock.setProperty(this.chartId, 'dataTipMode', to);
        },
        overlays(to, from) {
            var deleted = _.values(php.array_diff(from, to));
            var added = _.values(php.array_diff(to, from));

            if(~['lineBreak', 'pnf'].indexOf(this.chartType)) return;

            _.each(deleted, (val) => {
                window.rMateStock.toggleOverlay(this.chartId, val, false);
            })

            _.each(added, (val) => {
                window.rMateStock.toggleOverlay(this.chartId, val, true);
            })
        },
        sideCharts(to, from) {
            var vm = this;
            var deleted = _.values(php.array_diff(from, to));
            var added = _.values(php.array_diff(to, from));

            if(~['lineBreak', 'pnf'].indexOf(this.chartType)) return;

            console.log('test');

            _.each(deleted, (val) => {
                console.log(`this.$t('off_side_chart'): ${val}`)
                window.rMateStock.toggleSideChart(vm.chartId, val, false);
            })

            _.each(added, (val) => {
                console.log(`this.$t('turn_side_chart'): ${val}`)
                window.rMateStock.toggleSideChart(vm.chartId, val, true);
            })
        },
        isZoomByWheel(to) {

            window.rMateStock.setProperty(this.chartId, 'isZoomByWheel', to);
        },
        showCrossHair(to) {

            window.rMateStock.setProperty(this.chartId, 'showCrossHair', to);
        },
        showLegend(to) {

            window.rMateStock.setProperty(this.chartId, 'showLegend', to, true);
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            var vm = this;
            window.rMateStock.create(this.chartId, `chartHolder`, {
                callback: {
                    overlayAddedEventHandler: vm.overlayAddedEventHandler,
                    overlayRemovedEventHandler: vm.overlayRemovedEventHandler,
                    sideChartAddedEventHandler: vm.sideChartAddedEventHandler,
                    sideChartRemovedEventHandler: vm.sideChartRemovedEventHandler
                }
            }, this.chartData);

            window.rMateStock.setTimeFrame(this.chartId, 'minute');
            window.rMateStock.setChartType(this.chartId, this.chartType);
            window.rMateStock.setYAxisType(this.chartId, this.axisType);
            window.rMateStock.setProperty(this.chartId, 'dataTipMode', this.dataTipMode);
            window.rMateStock.setProperty(this.chartId, 'isZoomByWheel', this.isZoomByWheel);
            window.rMateStock.setProperty(this.chartId, 'showCrossHair', this.showCrossHair);
            window.rMateStock.setProperty(this.chartId, 'showLegend', this.showLegend, true);

            window.rMateStock.toggleOverlay(this.chartId, 'movingAvgLine', false);
            _.each(vm.overlays, (val) => {
                window.rMateStock.toggleOverlay(vm.chartId, val, true);
            })

            window.rMateStock.toggleSideChart(this.chartId, 'volumeChart', false);
            _.each(vm.sideCharts, (val) => {
                window.rMateStock.toggleSideChart(vm.chartId, val, true);
            })

        },
        setData() {
            window.rMateStock.setData(this.chartId, this.chartData);
        },
        addDataAfter(point) {
            window.rMateStock.addDataAfter(this.chartId, [point]);
        },
        updateLastPoint(point) {
            window.rMateStock.changeAfterData(this.chartId, [point]);
        },
        overlayAddedEventHandler(uid, name) {
            if(!uid) return;
            console.log(arguments);
            var vm = this;
            vm.$emit('overlayadd', { uid, name });
        },
        overlayRemovedEventHandler(uid, name) {
            if(!uid) return;
            var vm = this;
            vm.$emit('overlayremove', { uid, name });
        },
        sideChartAddedEventHandler(uid, name) {
            if(!uid) return;
            var vm = this;

            vm.$emit('sidechartadd', { uid, name });
        },
        sideChartRemovedEventHandler(uid, name) {
            if(!uid) return;
            var vm = this;

            vm.$emit('sidechartremove', { uid, name });
        },
        getDataGenValues(overlay_name, is) {
            return window.rMateStock.getDataGenValues(this.chartId, overlay_name, is);
        },
        setOverlayDataValues(overlay_name, values) {
            window.rMateStock.setOverlayDataValues(this.chartId, overlay_name, values);
        },
        setSideChartDataValues(chart_name, values) {
            window.rMateStock.setSideChartDataValues(this.chartId, chart_name, values);
        },
        zoomIn() {
            window.rMateStock.zoomIn(this.chartId);
        },
        zoomOut() {
            window.rMateStock.zoomOut(this.chartId);
        },
        setDrawingTool(tool) {
            window.rMateStock.setDrawingTool(this.chartId, tool);
        },
        deleteLastDrawingElement() {
            window.rMateStock.deleteLastDrawingElement(this.chartId);
        },
        changeDrawingColor(code, number) {
            window.rMateStock.changeDrawingColor(this.chartId, code, number);
        }
    }
}
</script>

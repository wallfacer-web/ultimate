// ====== 预处理与颜色配置 ======
// advData.scatterPre / scatterPost 项对应: [Cap, Val, Tot, Grade, State]
const cyberTheme = {
    textColor: '#94a3b8',
    axisColor: 'rgba(0, 255, 204, 0.2)',
    tooltipBg: 'rgba(3, 7, 18, 0.9)'
};

// 工具：整理数据格式给散点动画用
const gradesList = ['19级', '21级', '22级'];
const generateGradeSeries = (dataList) => {
    return gradesList.map(grade => {
        return {
            name: grade,
            data: dataList.filter(d => d[3] === grade)
        };
    });
};

function initTimelineAnimation() {
    const dom = document.getElementById('timeline-chart');
    const myChart = echarts.init(dom);
    
    // 按班级切分 Pre 和 Post
    const preSeries = generateGradeSeries(advData.scatterPre);
    const postSeries = generateGradeSeries(advData.scatterPost);
    
    // 生成系列配置
    const buildSeries = (mappedData, glowColor) => {
        return mappedData.map(group => ({
            name: group.name,
            type: 'scatter',
            symbolSize: (data) => data[2]/3.5, // 用总分控制气泡大小
            encode: { x: 0, y: 1 },
            itemStyle: {
                shadowBlur: 20,
                shadowColor: glowColor,
                opacity: 0.8
            },
            data: group.data
        }));
    };

    const option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                orient: 'horizontal',
                autoPlay: true,
                playInterval: 3000,
                left: '10%', right: '10%', bottom: '0%',
                data: ['教学前 (Baseline)', '强介导教学后 (Post-Intervention)'],
                label: { color: '#00ffcc', fontSize: 14 },
                controlStyle: { color: '#00ffcc', borderColor: '#00ffcc' },
                lineStyle: { color: 'rgba(0, 255, 204, 0.3)' },
                checkpointStyle: { color: '#ff007f', borderColor: '#fff' }
            },
            backgroundColor: 'transparent',
            tooltip: {
                padding: 10, backgroundColor: cyberTheme.tooltipBg,
                borderColor: '#00ffcc', borderWidth: 1, textStyle: { color: '#fff' },
                formatter: (p) => `${p.seriesName} ${p.data[4]}<br>能力: ${p.data[0]} | 价值观: ${p.data[1]} | 总分: ${p.data[2]}`
            },
            legend: { top: '0%', textStyle: { color: cyberTheme.textColor } },
            grid: { top: '15%', bottom: '15%', left: '8%', right: '8%' },
            xAxis: {
                name: '【X轴】能力储备跃迁', nameTextStyle: { color: '#00ffcc', fontSize: 12 },
                type: 'value', min: 20, max: 50,
                axisLabel: { color: cyberTheme.textColor },
                splitLine: { lineStyle: { color: cyberTheme.axisColor, type: 'dashed' } }
            },
            yAxis: {
                name: '【Y轴】全人价值观升华', nameTextStyle: { color: '#ff007f', fontSize: 12 },
                type: 'value', min: 55, max: 85,
                axisLabel: { color: cyberTheme.textColor },
                splitLine: { lineStyle: { color: cyberTheme.axisColor, type: 'dashed' } }
            },
            animationDurationUpdate: 2000, // 气泡平滑飞行的灵魂参数，设长动画
            animationEasingUpdate: 'cubicInOut'
        },
        options: [
            // 第一帧：课前
            {
                title: { text: "教学前原生集群", textStyle: { color: '#fff', opacity: 0.3, fontSize: 40 }, left: 'center', top: 'center', z: -1 },
                color: ['#ff4d4f', '#ff7a45', '#ffa940'], // 暖色系预设
                series: buildSeries(preSeries, 'rgba(255, 77, 79, 0.6)')
            },
            // 第二帧：课后
            {
                title: { text: "教学后多维扩张矩阵", textStyle: { color: '#00ffcc', opacity: 0.2, fontSize: 40 }, left: 'center', top: 'center', z: -1 },
                color: ['#00e5ff', '#1890ff', '#722ed1'], // 科技色系预设
                series: buildSeries(postSeries, 'rgba(0, 229, 255, 0.6)')
            }
        ]
    };
    
    myChart.setOption(option);
    return myChart;
}

function initGLScatter() {
    const dom = document.getElementById('gl-chart');
    const myChart = echarts.init(dom);
    
    // 合并前后的3D点
    // scatterPre: [Cap, Val, Tot, Grade, State]
    const pre3D = advData.scatterPre.map(d => [d[0], d[1], d[2], '课前原点']);
    const post3D = advData.scatterPost.map(d => [d[0], d[1], d[2], '课后跃迁']);

    const option = {
        tooltip: { backgroundColor: cyberTheme.tooltipBg, textStyle: { color: '#fff' } },
        visualMap: [
            {
                show: false, dimension: 2, min: 90, max: 150,
                inRange: { symbolSize: [5, 20] } // 总分决定体积
            }
        ],
        xAxis3D: { name: '能力', type: 'value', min: 20, nameTextStyle: { color: '#00ffcc' } },
        yAxis3D: { name: '价值观', type: 'value', min: 50, nameTextStyle: { color: '#ff007f' } },
        zAxis3D: { name: '总体总分', type: 'value', min: 90, nameTextStyle: { color: '#0088ff' } },
        grid3D: {
            axisLine: { lineStyle: { color: '#fff' } },
            axisPointer: { lineStyle: { color: '#ff007f' } },
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 15,
                projection: 'perspective',
                alpha: 20, beta: 40
            },
            environment: '#030712', // 深色宇宙背景
            light: {
                main: { intensity: 1.2, shadow: true },
                ambient: { intensity: 0.6 }
            }
        },
        series: [
            {
                type: 'scatter3D',
                name: '课前基础集群 (红色暗星)',
                symbol: 'circle',
                itemStyle: { color: '#ff007f', opacity: 0.6 },
                data: pre3D
            },
            {
                type: 'scatter3D',
                name: '课后觉醒集群 (青色光海)',
                symbol: 'circle',
                itemStyle: { color: '#00ffcc', opacity: 0.9 },
                data: post3D
            }
        ]
    };
    
    myChart.setOption(option);
    return myChart;
}

function initRoseArray() {
    const dom = document.getElementById('rose-chart');
    const myChart = echarts.init(dom);
    
    // 汇总各班后验总分与前验总分作为南丁格尔玫瑰图数据
    // 简单基于原始数据聚合
    const getAvg = (grade, stIndex) => {
        let list = [];
        if(stIndex === 'pre') list = advData.scatterPre.filter(d=>d[3]===grade);
        else list = advData.scatterPost.filter(d=>d[3]===grade);
        const sum = list.reduce((acc, val) => acc + val[2], 0);
        return parseFloat((sum / list.length).toFixed(2));
    };

    const roseData = [
        { value: getAvg('19级', 'post'), name: '19级 (达成)' },
        { value: getAvg('21级', 'post'), name: '21级 (达成)' },
        { value: getAvg('22级', 'post'), name: '22级 (达成)' },
        { value: Math.max(0, getAvg('19级', 'pre')-30), name: '19级基线', itemStyle: {opacity: 0.3} },
        { value: Math.max(0, getAvg('21级', 'pre')-30), name: '21级基线', itemStyle: {opacity: 0.3} },
        { value: Math.max(0, getAvg('22级', 'pre')-30), name: '22级基线', itemStyle: {opacity: 0.3} },
    ];

    const option = {
        tooltip: { trigger: 'item', formatter: '{b} : {c}分' },
        color: ['#00e5ff', '#1890ff', '#ff00ea', '#94a3b8', '#94a3b8', '#94a3b8'],
        series: [
            {
                name: '班级全人面积',
                type: 'pie',
                radius: ['20%', '80%'],
                center: ['50%', '50%'],
                roseType: 'area', // 南丁格尔玫瑰核心
                itemStyle: {
                    borderRadius: 8,
                    shadowBlur: 15,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: { color: '#fff' },
                data: roseData
            }
        ]
    };

    myChart.setOption(option);
    return myChart;
}

window.onload = () => {
    const charts = [
        initTimelineAnimation(),
        initGLScatter(),
        initRoseArray()
    ];
    window.addEventListener('resize', () => charts.forEach(c => c.resize()));
};

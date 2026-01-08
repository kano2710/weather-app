import ReactECharts from 'echarts-for-react'

interface WeatherDataPoint {
    timestamp: string;
    temperature: number;
    humidity: number;
    clouds: number;
    wind_speed: number;
    wind_direction: number;
    pressure: number;
}

interface WeatherChartProps {
    data: WeatherDataPoint[];
    locationName: string;
}

function WeatherChart({ data }: WeatherChartProps) {
    if (!data || data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                No historical data available yet
            </div>
        )
    }

    const currentPressure = data.length > 0 ? data[0].pressure : 1013
    const currentHumidity = data.length > 0 ? data[0].humidity : 0
    const currentClouds = data.length > 0 ? data[0].clouds : 0
    const currentWindSpeed = data.length > 0 ? data[0].wind_speed : 0
    const currentWindDirection = data.length > 0 ? (data[0].wind_direction ?? 0) : 0

    const displayWindDirection = (currentWindDirection + 180) % 360

    // Wind Compass
    const windCompassOption = {
        graphic: [
            {
                type: 'circle',
                left: 'center',
                top: '38%',
                shape: {
                    r: 15
                },
                style: {
                    fill: '#fff',
                    stroke: '#ddd',
                    lineWidth: 2
                },
                z: 100
            },
            {
                type: 'text',
                left: 'center',
                top: '44%',
                style: {
                    text: (currentWindSpeed * 3.6).toFixed(1),
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: '#333',
                    textAlign: 'center'
                },
                z: 101
            },
            {
                type: 'text',
                left: 'center',
                top: '56%',
                style: {
                    text: 'kph',
                    fontSize: 10,
                    fill: '#666',
                    textAlign: 'center'
                },
                z: 101
            }
        ],
        series: [
            {
                type: 'gauge',
                center: ['50%', '55%'],
                radius: '90%',
                startAngle: 90,
                endAngle: -270,
                min: 0,
                max: 360,
                splitNumber: 12,
                pointer: {
                    show: true,
                    length: '80',
                    width: 80,
                    offsetCenter: [0, '87%'],
                    icon: 'image:///arrow.svg',
                    itemStyle: {
                        color: '#333'
                    }
                },
                progress: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [0.03, 'transparent'],
                            [0.215, '#e0e0e0'],
                            [0.28, 'transparent'],
                            [0.465, '#e0e0e0'],
                            [0.53, 'transparent'],
                            [0.72, '#e0e0e0'],
                            [0.785, 'transparent'],
                            [0.965, '#e0e0e0'],
                            [1, 'transparent'],
                        ]
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    distance: -15,
                    length: 15,
                    lineStyle: {
                        width: 3,
                        color: 'transparent'
                    }
                },
                axisLabel: {
                    distance: 0,
                    fontSize: 16,
                    formatter: (value: number) => {
                        const directions = ['N', '', 'E', '', 'S', '', 'W', '']
                        const index = Math.round(value / 45) % 8
                        return directions[index]
                    }
                },
                detail: {
                    show: false,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333',
                    offsetCenter: [0, '50%'],
                    formatter: '{value}°'
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'],
                    fontSize: 18,
                    color: '#333'
                },
                data: [
                    {
                        value: displayWindDirection
                    }
                ]
            }
        ]
    }

    // Pressure Gauge
    const pressureOption = {
        title: {
            left: 'left',
            textStyle: {
                fontSize: 10,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            formatter: '{a} <br/>{b} : {c} hPa'
        },
        graphic: [
            {
                type: 'text',
                left: '0%',
                bottom: '0%',
                style: {
                    text: 'Low',
                    textAlign: 'center',
                    fill: '#000',
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            {
                type: 'text',
                right: '0%',
                bottom: '0%',
                style: {
                    text: 'High',
                    textAlign: 'center',
                    fill: '#000',
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            }
        ],
        series: [
            {
                type: 'gauge',
                radius: '70%',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: 950,
                max: 1050,
                progress: {
                    show: false,
                },
                pointer: {
                    show: true,
                    icon: 'rectangle',
                    length: '50%',
                    width: 3,
                    offsetCenter: [0, '-125%'],
                    itemStyle: {
                        color: '#000',
                        shadowBlur: 5
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 0
                    }
                },
                axisTick: {
                    distance: -20,
                    splitNumber: 5,
                    lineStyle: {
                        width: 1,
                    }
                },
                splitLine: {
                    distance: -25,
                    length: 14,
                    lineStyle: {
                        width: 2,
                    }
                },
                axisLabel: {
                    show: false,
                },
                anchor: {
                    show: false,
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: false,
                    offsetCenter: [0, '30%'],
                    fontSize: 20,
                    fontWeight: 'bolder',
                    formatter: '{value}\n{unit|hPa}',
                    color: '#000',
                    rich: {
                        unit: {
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: '#666',
                            padding: [-20, 0, 0, 0]
                        }
                    }
                },
                data: [
                    {
                        value: currentPressure
                    }
                ]
            },
        ]
    }

    return (
        <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    minHeight: '150px',
                    position: 'relative'
                }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                        Clouds
                    </div>
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        margin: '10px auto 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/cloud.svg" alt="cloud" style={{ width: '150%', height: '150%', position: 'absolute' }} />
                        <div style={{
                            position: 'relative',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#000',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                            marginTop: '25px',
                            zIndex: 1
                        }}>
                            {currentClouds}%
                        </div>
                    </div>
                </div>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    minHeight: '150px'
                }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                        Wind
                    </div>
                    <ReactECharts option={windCompassOption} style={{ height: '100px' }} opts={{ renderer: 'svg' }} />
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    minHeight: '150px',
                    position: 'relative'
                }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                        Humidity
                    </div>
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        margin: '10px auto 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/humidity.svg" alt="humidity" style={{ width: '120%', height: '120%', position: 'absolute' }} />
                        <div style={{
                            position: 'relative',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#000',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                            zIndex: 1
                        }}>
                            {currentHumidity}%
                        </div>
                    </div>
                </div>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    minHeight: '150px'
                }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                        Pressure
                    </div>
                    <ReactECharts option={pressureOption} style={{ height: '100px' }} />
                </div>
            </div>
        </div>
    )
}

export default WeatherChart

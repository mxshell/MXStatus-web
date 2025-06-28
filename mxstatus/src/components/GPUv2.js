import React from 'react'
import PropTypes from 'prop-types'
import DisplayPercent from './DisplayPercent'
import DisplayTemp from './DisplayTemp'
import DisplayRAM from './DisplayRAM'
import CopyableText from './CopyableText'

const GPUv2 = props => {
    const getUtilizationColor = (percent) => {
        if (percent < 0.3) return 'var(--hacker-info)'
        if (percent < 0.7) return 'var(--hacker-warning)'
        return 'var(--hacker-danger)'
    }

    const getTemperatureColor = (temp) => {
        if (temp < 60) return 'var(--hacker-info)'
        if (temp < 80) return 'var(--hacker-warning)'
        return 'var(--hacker-danger)'
    }

    const getMemoryColor = (percent) => {
        if (percent < 0.5) return 'var(--hacker-info)'
        if (percent < 0.8) return 'var(--hacker-warning)'
        return 'var(--hacker-danger)'
    }

    return (
        <div className="hacker-card" style={{
            marginBottom: '0.75rem',
            border: '1px solid var(--hacker-border)',
            backgroundColor: 'var(--hacker-surface)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* GPU Header */}
            <div className="gpu-header d-flex align-items-center justify-content-between mb-2" style={{
                borderBottom: '1px solid var(--hacker-border)',
                paddingBottom: '0.5rem'
            }}>
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getUtilizationColor(props.data.gpu_usage),
                        boxShadow: `0 0 8px ${getUtilizationColor(props.data.gpu_usage)}`
                    }}></div>
                    <span style={{
                        color: 'var(--hacker-text-accent)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        GPU {props.data.index}
                    </span>
                    <CopyableText className="hacker-badge" style={{
                        fontSize: '0.7rem',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {props.data.gpu_name}
                    </CopyableText>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span className="hacker-badge" style={{
                        borderColor: getTemperatureColor(props.data.temperature),
                        color: getTemperatureColor(props.data.temperature),
                        fontSize: '0.7rem'
                    }}>
                        <DisplayTemp temp={props.data.temperature} />
                    </span>
                </div>
            </div>

            {/* GPU Metrics Grid */}
            <div className="gpu-metrics">
                {/* Core Utilization */}
                <div className="metric-row mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                        }}>
                            Core Utilization
                        </span>
                        <span style={{
                            color: getUtilizationColor(props.data.gpu_usage),
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            <DisplayPercent percent={props.data.gpu_usage} />
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'var(--hacker-border)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${props.data.gpu_usage * 100}%`,
                            height: '100%',
                            backgroundColor: getUtilizationColor(props.data.gpu_usage),
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>

                {/* Memory Utilization */}
                <div className="metric-row mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                        }}>
                            Memory Utilization
                        </span>
                        <span style={{
                            color: getMemoryColor(props.data.memory_usage),
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            <DisplayPercent percent={props.data.memory_usage} />
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'var(--hacker-border)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${props.data.memory_usage * 100}%`,
                            height: '100%',
                            backgroundColor: getMemoryColor(props.data.memory_usage),
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>

                {/* Memory Details */}
                <div className="memory-details" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'var(--hacker-bg)',
                    borderRadius: '0.25rem',
                    border: '1px solid var(--hacker-border)'
                }}>
                    <div className="memory-item">
                        <div style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.65rem',
                            marginBottom: '0.2rem'
                        }}>
                            Used
                        </div>
                        <div style={{
                            color: 'var(--hacker-success)',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            <DisplayRAM ram={props.data.memory_total - props.data.memory_free} />
                        </div>
                    </div>
                    <div className="memory-item">
                        <div style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.65rem',
                            marginBottom: '0.2rem'
                        }}>
                            Free
                        </div>
                        <div style={{
                            color: 'var(--hacker-info)',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            <DisplayRAM ram={props.data.memory_free} />
                        </div>
                    </div>
                    <div className="memory-item">
                        <div style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.65rem',
                            marginBottom: '0.2rem'
                        }}>
                            Total
                        </div>
                        <div style={{
                            color: 'var(--hacker-text-primary)',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            <DisplayRAM ram={props.data.memory_total} />
                        </div>
                    </div>
                    <div className="memory-item">
                        <div style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.65rem',
                            marginBottom: '0.2rem'
                        }}>
                            Efficiency
                        </div>
                        <div style={{
                            color: props.data.memory_usage > 0.8 ? 'var(--hacker-warning)' : 'var(--hacker-success)',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                        }}>
                            {((props.data.memory_total - props.data.memory_free) / props.data.memory_total * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Performance Indicators */}
                <div className="performance-indicators mt-2" style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div className="indicator" style={{
                        padding: '0.3rem 0.5rem',
                        backgroundColor: 'var(--hacker-bg)',
                        border: '1px solid var(--hacker-border)',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                    }}>
                        <div style={{ color: 'var(--hacker-text-secondary)' }}>Core</div>
                        <div style={{
                            color: getUtilizationColor(props.data.gpu_usage),
                            fontWeight: '600'
                        }}>
                            {(props.data.gpu_usage * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className="indicator" style={{
                        padding: '0.3rem 0.5rem',
                        backgroundColor: 'var(--hacker-bg)',
                        border: '1px solid var(--hacker-border)',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                    }}>
                        <div style={{ color: 'var(--hacker-text-secondary)' }}>Memory</div>
                        <div style={{
                            color: getMemoryColor(props.data.memory_usage),
                            fontWeight: '600'
                        }}>
                            {(props.data.memory_usage * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className="indicator" style={{
                        padding: '0.3rem 0.5rem',
                        backgroundColor: 'var(--hacker-bg)',
                        border: '1px solid var(--hacker-border)',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                    }}>
                        <div style={{ color: 'var(--hacker-text-secondary)' }}>Temp</div>
                        <div style={{
                            color: getTemperatureColor(props.data.temperature),
                            fontWeight: '600'
                        }}>
                            {props.data.temperature}°C
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

GPUv2.propTypes = {
    "data": PropTypes.object
}

GPUv2.defaultProps = {
    "data": {
        "index": 0,
        "gpu_name": "GeForce RTX xxxx xx",
        "gpu_usage": 0.0,
        "temperature": 0.0,
        "memory_total": 0.0,
        "memory_free": 0.0,
        "memory_usage": 0.0,
    }
}

export default GPUv2

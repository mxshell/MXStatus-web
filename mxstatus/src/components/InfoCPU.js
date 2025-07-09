import React from 'react'
import DisplayPercent from './DisplayPercent'
import CopyableText from './CopyableText'
import { getUtilizationColor } from '../utils/DataColor'
import DisplayRAM from './DisplayRAM'


const InfoCPU = props => {
    const { cpu_model, cpu_usage, cpu_cores, ram_usage, ram_free, ram_total } = props.data
    const ramUsed = ram_total - ram_free
    const ramPercent = ram_total > 0 ? (ramUsed / ram_total) * 100 : 0

    return (
        <div style={{
            marginBottom: '0.75rem',
            padding: '0.75rem',
            border: '1px solid var(--hacker-border)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--hacker-surface)'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.4rem'
            }}>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    CPU Model:
                </span>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    <CopyableText className="hacker-badge" style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--hacker-text-secondary)' }}>{cpu_model}</CopyableText>
                </span>
            </div>
            {/* RAM Total */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.4rem'
            }}>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    CPU Threads:
                </span>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    <CopyableText className="hacker-badge" style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--hacker-text-secondary)' }}>{cpu_cores}</CopyableText>
                </span>
            </div>



            {/* CPU Utilization */}
            <div className="metric-row mb-2 mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                    }}>
                        CPU Utilization
                    </span>
                    <span style={{
                        color: getUtilizationColor(cpu_usage),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        <DisplayPercent percent={cpu_usage} />
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
                        width: `${cpu_usage}%`,
                        height: '100%',
                        backgroundColor: getUtilizationColor(cpu_usage),
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>
            {/* RAM Utilization */}
            <div className="metric-row mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                    }}>
                        RAM Utilization
                    </span>
                    <span style={{
                        color: getUtilizationColor(ram_usage),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        <DisplayPercent percent={ram_usage} />
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
                        width: `${ramPercent}%`,
                        height: '100%',
                        backgroundColor: getUtilizationColor(ram_usage),
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                <div style={{ color: 'var(--hacker-text-secondary)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                    <DisplayRAM ram={ramUsed} /> / <DisplayRAM ram={ram_total} />
                </div>
            </div>
        </div>
    )
}

export default InfoCPU
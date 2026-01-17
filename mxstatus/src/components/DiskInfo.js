import React from 'react'
import PropTypes from 'prop-types'
import CopyableText from './CopyableText'
import DisplayPercent from './DisplayPercent'
import { getUtilizationColor } from '../utils/DataColor'

const DiskInfo = ({ disks }) => {
    const normalizedDisks = Array.isArray(disks) ? disks : []
    const hasData = normalizedDisks.length > 0

    const getUsageValue = (disk) => {
        if (typeof disk.usage === 'number' && !Number.isNaN(disk.usage)) {
            return disk.usage
        }
        if (
            typeof disk.used === 'number' &&
            typeof disk.size === 'number' &&
            disk.size > 0
        ) {
            return disk.used / disk.size
        }
        return 0
    }

    const renderDiskCard = (disk, idx) => {
        const usageValue = Math.min(Math.max(getUsageValue(disk), 0), 1)
        const usageColor = getUtilizationColor(usageValue)
        const mountLabel = disk.mounted_on || disk.filesystem || `disk-${idx + 1}`

        return (
            <div className="disk-card" key={`${mountLabel}-${idx}`}>
                <div className="d-flex align-items-center justify-content-between mb-1" style={{ gap: '0.4rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                        <CopyableText className="hacker-badge" style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            color: 'var(--hacker-text-secondary)',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {mountLabel}
                        </CopyableText>
                        <span style={{
                            color: 'var(--hacker-text-muted)',
                            fontSize: '0.7rem',
                            fontWeight: 600
                        }}>
                            {disk.filesystem || 'N/A'} {disk.type ? `• ${disk.type}` : ''}
                        </span>
                    </div>
                    <span className="hacker-badge" style={{
                        borderColor: usageColor,
                        color: usageColor,
                        fontSize: '0.7rem',
                        fontWeight: '700'
                    }}>
                        <DisplayPercent percent={usageValue} />
                    </span>
                </div>

                <div className="disk-usage-bar">
                    <div
                        className="disk-usage-fill"
                        style={{
                            width: `${(usageValue * 100).toFixed(1)}%`,
                            background: usageColor
                        }}
                    />
                </div>

                <div className="disk-stats-row">
                    <span style={{ color: 'var(--hacker-warning)', fontWeight: 700 }}>
                        Used {disk.used_str || (typeof disk.used === 'number' ? `${disk.used.toFixed(0)}G` : 'N/A')}
                    </span>
                    <span style={{ color: 'var(--hacker-info)', fontWeight: 700 }}>
                        Free {disk.avail_str || (typeof disk.avail === 'number' ? `${disk.avail.toFixed(0)}G` : 'N/A')}
                    </span>
                    <span style={{ color: 'var(--hacker-text-secondary)', fontWeight: 700 }}>
                        Total {disk.size_str || (typeof disk.size === 'number' ? `${disk.size.toFixed(0)}G` : 'N/A')}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            marginBottom: '0.75rem',
            padding: '0.75rem',
            border: '1px solid var(--hacker-border)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--hacker-surface)'
        }}>
            <div className="d-flex align-items-center justify-content-between mb-2" style={{ gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--hacker-info), var(--hacker-text-accent))',
                        boxShadow: '0 0 10px rgba(0,255,65,0.35)'
                    }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem' }}>
                        <span style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em'
                        }}>
                            STORAGE
                        </span>
                        <span style={{
                            color: 'var(--hacker-text-muted)',
                            fontSize: '0.72rem',
                            fontWeight: 600
                        }}>
                            Volumes & mount points
                        </span>
                    </div>
                </div>
                <span className="hacker-badge" style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.5rem'
                }}>
                    {hasData ? `${normalizedDisks.length} volume${normalizedDisks.length > 1 ? 's' : ''}` : 'No data'}
                </span>
            </div>

            {hasData ? (
                <div className="disk-grid">
                    {normalizedDisks.map((disk, idx) => renderDiskCard(disk, idx))}
                </div>
            ) : (
                <div style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.5rem 0.4rem',
                    border: '1px dashed var(--hacker-border)',
                    borderRadius: '0.4rem',
                    backgroundColor: 'var(--hacker-bg)'
                }}>
                    Disk metrics not reported by this agent yet.
                </div>
            )}
        </div>
    )
}

DiskInfo.propTypes = {
    disks: PropTypes.arrayOf(PropTypes.shape({
        filesystem: PropTypes.string,
        type: PropTypes.string,
        size_str: PropTypes.string,
        size: PropTypes.number,
        used_str: PropTypes.string,
        used: PropTypes.number,
        avail_str: PropTypes.string,
        avail: PropTypes.number,
        usage_str: PropTypes.string,
        usage: PropTypes.number,
        mounted_on: PropTypes.string
    }))
}

DiskInfo.defaultProps = {
    disks: []
}

export default DiskInfo

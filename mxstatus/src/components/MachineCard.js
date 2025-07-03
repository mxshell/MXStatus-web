import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import IP from './IP'
import GpuCard from './GpuCard'
import UsersLine from './UsersLine'
import DisplayPercent from './DisplayPercent'
import DisplayRAM from './DisplayRAM'
import CopyableText from './CopyableText'

const MachineCard = props => {

    // const secondsToHms = (d) => {
    //     d = Number(d);
    //     let h = Math.floor(d / 3600);
    //     let m = Math.floor(d % 3600 / 60);
    //     let s = Math.floor(d % 3600 % 60);

    //     let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    //     let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    //     let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    //     return hDisplay + mDisplay + sDisplay;
    // }

    const secondsToShortString = (x) => {
        x = Number(x);
        let d = Math.floor(x / 86400);
        let h = Math.floor(x % 86400 / 3600);
        let m = Math.floor(x % 86400 % 3600 / 60);
        let s = Math.floor(x % 86400 % 3600 % 60);

        let dDisplay = d > 0 ? d + "d " : "";
        let hDisplay = h > 0 ? h + "h " : "";
        let sDisplay = s > 0 ? s + "s " : "";
        let mDisplay = m > 0 ? m + "m " : sDisplay;

        return dDisplay + hDisplay + mDisplay;
    }


    const getTimestamp = () => {
        let v = props.data.created_at
        let options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }

        if (typeof v === 'string' || v instanceof String) {
            let d = new Date(v)
            return d.toLocaleTimeString("en-GB", options)
        } else {
            return "N.A."
        }
    }

    const isOnline = () => {
        let v = props.data.created_at
        let now = new Date()

        if (typeof v === 'string' || v instanceof String) {
            let d = new Date(v)
            let i = now - d
            // 2 Minutes = 120000 Milliseconds
            if (i <= 120000) {
                // console.log("is online")
                return true
            }
        }

        return false
    }

    const singleLine = (s) => {
        // keep string to single line
        // remove all newlines
        // remove all tabs
        // remove all leading and trailing spaces
        return s.replace(/(\r\n|\n|\r)/gm, " ").replace(/\t/g, ' ').trim()
    }

    const [showDetails, SetShowDetails] = useState(false)
    const handleShowDetails = () => {
        SetShowDetails((state) => {
            if (state) {
                return false
            } else {
                return true
            }
        })
    }

    // Handle click on interactive elements to prevent bubbling
    const handleInteractiveClick = (e) => {
        e.stopPropagation()
    }

    const isEmpty = (s) => {
        if (s == null || s === undefined || s === "" || s.length === 0) {
            return true
        } else {
            return false
        }
    }

    const numItems = (s) => {
        if (s == null || s === undefined || s === "" || s.length === 0) {
            return 0
        } else {
            return s.length
        }
    }




    const getStatusColor = () => {
        return isOnline() ? 'var(--hacker-success)' : 'var(--hacker-text-secondary)'
    }

    return (
        <div className="hacker-card fade-in" style={{
            borderLeft: `4px solid ${getStatusColor()}`,
            opacity: isOnline() ? 1 : 0.7
        }} >
            <div className="server-header d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                    <h3 className="mb-0" style={{
                        color: getStatusColor(),
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        textShadow: isOnline() ? '0 0 8px var(--hacker-success)' : 'none',
                        lineHeight: '1.2',
                        letterSpacing: '0.025em'
                    }}>
                        {props.data.hostname}
                    </h3>
                </div>

                <div className="d-flex gap-1">
                    {/* <CopyableText
                        className="hacker-badge"
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--hacker-text-secondary)',
                            fontWeight: '600',
                            lineHeight: '1.3'
                        }}
                        onClick={handleInteractiveClick}
                    >
                        {props.data.hostname}
                    </CopyableText> */}

                    {isOnline() ? (
                        <span className="hacker-badge success">
                            <span className="pulse" style={{ marginRight: '0.4rem' }}>●</span>
                            ONLINE
                        </span>
                    ) : (
                        <span className="hacker-badge danger">OFFLINE</span>
                    )}

                    {isEmpty(props.data.gpu_status) ? (
                        <span className="hacker-badge">GPU N/A</span>
                    ) : (
                        <span className="hacker-badge info">GPU x{numItems(props.data.gpu_status)}</span>
                    )}

                    <button
                        className="hacker-badge"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleShowDetails()
                        }}
                        style={{
                            cursor: 'pointer',
                            border: '1px solid var(--hacker-border)',
                            background: 'transparent'
                        }}
                    >
                        {showDetails ? 'HIDE DETAILS' : 'DETAILS'}
                    </button>
                </div>
            </div>

            <div className={`details-anim${showDetails ? ' expanded' : ' collapsed'}`}>
                <div className="server-details" style={{
                    borderTop: '1px solid var(--hacker-border)',
                    paddingTop: '0.75rem',
                    marginTop: '0.75rem'
                }}>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>Last seen:</span>
                                <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                    {getTimestamp()}
                                </CopyableText>
                            </p>
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>Uptime:</span>
                                <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                    {props.data.uptime_str}
                                </CopyableText>
                            </p>
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>Arch:</span>
                                <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                    {props.data.architecture}
                                </CopyableText>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>System:</span>
                                <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                    {props.data.linux_distro}
                                </CopyableText>
                            </p>
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>CPU:</span>
                                <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                    {props.data.cpu_model}
                                </CopyableText>
                            </p>
                        </div>
                    </div>

                    <IP data={props.data.ipv4s} onClick={handleInteractiveClick} />
                    <UsersLine users_info={props.data.users_info} onClick={handleInteractiveClick} />

                    <div className="row mt-2">
                        <div className="col-md-6">
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>CPU Util:</span>
                                <span className="hacker-badge ms-2">
                                    <DisplayPercent percent={props.data.cpu_usage} />
                                </span>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-1">
                                <span style={{ color: 'var(--hacker-text-secondary)' }}>RAM Util:</span>
                                <span className="hacker-badge ms-2">
                                    <DisplayPercent percent={props.data.ram_usage} />
                                </span>
                                <span className="hacker-badge ms-2" style={{ fontSize: '0.65rem' }}>
                                    <DisplayRAM ram={props.data.ram_free} /> / <DisplayRAM ram={props.data.ram_total} />
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {isEmpty(props.data.gpu_status) || !showDetails ? null :
                <div className="gpu-section mt-2">
                    {props.data.gpu_status.map((gpu_data, idx) => <GpuCard key={idx} data={gpu_data} />)}
                </div>
            }

            {isEmpty(props.data.gpu_compute_processes) || showDetails || (!isOnline() && !showDetails) ? null :
                <div className="processes-section mt-2" style={{
                    borderTop: '1px solid var(--hacker-border)',
                    paddingTop: '0.75rem'
                }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <h6 style={{
                                color: 'var(--hacker-text-secondary)',
                                margin: '0',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                letterSpacing: '0.04em',
                                lineHeight: '1.3'
                            }}>
                                ACTIVE PROCESSES
                            </h6>
                            <span className="hacker-badge info" style={{
                                fontSize: '0.6rem',
                                fontWeight: '700',
                                lineHeight: '1.2'
                            }}>
                                {props.data.gpu_compute_processes.length} running
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '0.75rem',
                        marginTop: '0.75rem'
                    }}>
                        {props.data.gpu_compute_processes.map((process, idx) =>
                            <div key={idx} className="process-item" style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--hacker-bg)',
                                border: '1px solid var(--hacker-border)',
                                borderRadius: '0.5rem',
                                transition: 'var(--hacker-transition)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                minHeight: '120px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Status indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    height: '2px',
                                    backgroundColor: 'var(--hacker-border-light)',
                                    opacity: 0.6
                                }}></div>

                                {/* First line: breathing dot, GPU x and PID */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--hacker-info)',
                                        opacity: 0.8,
                                        flexShrink: 0,
                                        animation: 'breathe 2s ease-in-out infinite'
                                    }}></div>
                                    <span style={{
                                        color: 'var(--hacker-info)',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        lineHeight: '1.2',
                                        letterSpacing: '0.015em',
                                        opacity: 0.8
                                    }}>
                                        GPU {process.gpu_index}
                                    </span>
                                    <span style={{
                                        color: 'var(--hacker-text-secondary)',
                                        fontSize: '0.6rem',
                                        fontWeight: '600',
                                        lineHeight: '1.2'
                                    }}>•</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <span style={{
                                            color: 'var(--hacker-text-secondary)',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            lineHeight: '1.2',
                                            letterSpacing: '0.015em',
                                            opacity: 0.7
                                        }}>PID</span>
                                        <CopyableText style={{
                                            color: 'var(--hacker-text-secondary)',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            lineHeight: '1.2',
                                            letterSpacing: '0.015em',
                                            opacity: 0.7
                                        }} onClick={handleInteractiveClick}>
                                            {process.pid}
                                        </CopyableText>
                                    </div>
                                </div>

                                {/* Second line: Runtime and username */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <CopyableText style={{
                                        padding: '0.15rem 0.35rem',
                                        backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                        border: '1px solid var(--hacker-text-secondary)',
                                        borderRadius: '1rem',
                                        color: 'var(--hacker-text-secondary)',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        lineHeight: '1.2',
                                        letterSpacing: '0.02em',
                                        fontFamily: 'var(--hacker-font-mono)',
                                        transition: 'var(--hacker-transition)',
                                        display: 'inline-block',
                                        opacity: 0.8
                                    }} onClick={handleInteractiveClick}>
                                        {process.user}
                                    </CopyableText>
                                    <span style={{
                                        color: 'var(--hacker-text-secondary)',
                                        fontSize: '0.6rem',
                                        fontWeight: '600',
                                        lineHeight: '1.2'
                                    }}>•</span>
                                    <div style={{
                                        padding: '0.15rem 0.35rem',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.7rem',
                                        color: 'var(--hacker-warning)',
                                        fontWeight: '600',
                                        lineHeight: '1.2',
                                        letterSpacing: '0.02em',
                                        fontFamily: 'var(--hacker-font-mono)',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                    }}>
                                        {secondsToShortString(process.proc_uptime)}
                                    </div>
                                </div>

                                {/* Command section */}
                                {process.command && (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            padding: '0.4rem',
                                            backgroundColor: 'var(--hacker-surface)',
                                            border: '1px solid var(--hacker-border)',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.65rem',
                                            fontFamily: 'var(--hacker-font-mono)',
                                            color: 'var(--hacker-text-secondary)',
                                            fontWeight: '600',
                                            lineHeight: '1.3',
                                            letterSpacing: '0.01em',
                                            overflow: 'hidden',
                                            wordBreak: 'break-word',
                                            minHeight: '2.6rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}>
                                            <CopyableText
                                                maxLength={60}
                                                style={{
                                                    color: 'var(--hacker-text-secondary)',
                                                    fontSize: '0.65rem',
                                                    fontWeight: '600',
                                                    lineHeight: '1.3'
                                                }}
                                                onClick={handleInteractiveClick}
                                            >
                                                {singleLine(process.command)}
                                            </CopyableText>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            }

            {isEmpty(props.data.gpu_compute_processes) || !showDetails ? null :
                <div className="processes-table mt-2">
                    <h6 style={{
                        color: 'var(--hacker-text-accent)',
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        letterSpacing: '0.025em'
                    }}>DETAILED PROCESSES</h6>
                    <div style={{
                        overflowX: 'auto',
                        border: '1px solid var(--hacker-border)',
                        borderRadius: '0.5rem'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.75rem'
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: 'var(--hacker-surface)',
                                    borderBottom: '1px solid var(--hacker-border)'
                                }}>
                                    <th style={{
                                        padding: '0.6rem',
                                        textAlign: 'left',
                                        color: 'var(--hacker-text-secondary)',
                                        fontWeight: '700',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.015em'
                                    }}>GPU</th>
                                    <th style={{
                                        padding: '0.6rem',
                                        textAlign: 'left',
                                        color: 'var(--hacker-text-secondary)',
                                        fontWeight: '700',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.015em'
                                    }}>PID</th>
                                    <th style={{
                                        padding: '0.6rem',
                                        textAlign: 'left',
                                        color: 'var(--hacker-text-secondary)',
                                        fontWeight: '700',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.015em'
                                    }}>User</th>
                                    <th style={{
                                        padding: '0.6rem',
                                        textAlign: 'left',
                                        color: 'var(--hacker-text-secondary)',
                                        fontWeight: '700',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.015em'
                                    }}>UpTime</th>
                                    <th style={{
                                        padding: '0.6rem',
                                        textAlign: 'left',
                                        color: 'var(--hacker-text-secondary)',
                                        fontWeight: '700',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.015em'
                                    }}>CMD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.data.gpu_compute_processes.map((process, idx) =>
                                    <tr key={idx} style={{
                                        borderBottom: '1px solid var(--hacker-border)',
                                        transition: 'var(--hacker-transition)'
                                    }}>
                                        <td style={{
                                            padding: '0.6rem',
                                            color: 'var(--hacker-info)',
                                            fontWeight: '700',
                                            lineHeight: '1.3'
                                        }}>{process.gpu_index}</td>
                                        <td style={{ padding: '0.6rem' }}>
                                            <CopyableText style={{
                                                color: 'var(--hacker-text-accent)',
                                                fontWeight: '700',
                                                lineHeight: '1.3'
                                            }} onClick={handleInteractiveClick}>{process.pid}</CopyableText>
                                        </td>
                                        <td style={{ padding: '0.6rem' }}>
                                            <CopyableText style={{
                                                padding: '0.15rem 0.35rem',
                                                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                                border: '1px solid var(--hacker-text-secondary)',
                                                borderRadius: '1rem',
                                                color: 'var(--hacker-text-secondary)',
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                lineHeight: '1.2',
                                                letterSpacing: '0.02em',
                                                fontFamily: 'var(--hacker-font-mono)',
                                                transition: 'var(--hacker-transition)',
                                                display: 'inline-block',
                                                opacity: 0.8
                                            }} onClick={handleInteractiveClick}>
                                                {process.user}
                                            </CopyableText>
                                        </td>
                                        <td style={{
                                            padding: '0.6rem',
                                            color: 'var(--hacker-warning)',
                                            fontWeight: '700',
                                            lineHeight: '1.3'
                                        }}>{process.proc_uptime_str}</td>
                                        <td style={{
                                            padding: '0.6rem',
                                            color: 'var(--hacker-text-secondary)',
                                            maxWidth: '300px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: '600',
                                            lineHeight: '1.3'
                                        }}>
                                            <CopyableText
                                                maxLength={120}
                                                style={{
                                                    color: 'var(--hacker-text-secondary)',
                                                    fontWeight: '600',
                                                    lineHeight: '1.3'
                                                }}
                                                onClick={handleInteractiveClick}
                                            >
                                                {singleLine(process.command)}
                                            </CopyableText>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

MachineCard.propTypes = {
    "data": PropTypes.object,
}

MachineCard.defaultProps = {
    "data": {
        "gpu_status": []
    }
}

export default MachineCard

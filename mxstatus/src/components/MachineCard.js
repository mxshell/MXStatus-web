import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import InfoInterfaces from './InfoInterfaces'
import GpuCard from './GpuCard'
import UsersLine from './UsersLine'
import CopyableText from './CopyableText'
import InfoCPU from './InfoCPU'
import GcpCard from './GcpCard'

const MachineCard = props => {

    const [showDetails, SetShowDetails] = useState(false)
    const [showGPUs, SetShowGPUs] = useState(false)
    const [showActiveGCP, SetShowActiveGCP] = useState(false) // GCP: GPU Compute Processes
    const [isHiding, setIsHiding] = useState(false)


    ///////////////////////////////////////////////////////////////////////////
    // UTILITIES
    ///////////////////////////////////////////////////////////////////////////

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


    ///////////////////////////////////////////////////////////////////////////
    // HANDLERS
    ///////////////////////////////////////////////////////////////////////////



    const handleShowDetails = () => {
        SetShowDetails((state) => {
            if (state) {
                SetShowGPUs(false)
                SetShowActiveGCP(false)
                return false
            } else {
                SetShowGPUs(true)
                SetShowActiveGCP(true)
                return true
            }
        })
    }

    const handleShowGPUs = () => {
        SetShowGPUs((state) => {
            if (state) {
                return false
            } else {
                return true
            }
        })
    }

    const handleShowActiveGCP = () => {
        SetShowActiveGCP((state) => {
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

    // Handle hiding with animation
    const handleHideWithAnimation = (e) => {
        e.stopPropagation()
        setIsHiding(true)
        // Delay the actual hiding until after animation completes
        setTimeout(() => {
            if (props.onHide) {
                props.onHide()
            }
        }, 250) // Match the animation duration (0.25s)
    }






    const getStatusColor = () => {
        return isOnline() ? 'var(--hacker-success)' : 'var(--hacker-text-secondary)'
    }

    return (
        <div className={`hacker-card ${isHiding ? 'fade-out' : 'fade-in'}`} style={{
            borderLeft: `4px solid ${getStatusColor()}`,
            opacity: isOnline() ? 1 : 0.7
        }} >
            <div className="server-header d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                    <h3 className="mb-0" onClick={(e) => {
                        e.stopPropagation()
                        handleShowDetails()
                    }} style={{
                        color: getStatusColor(),
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        textShadow: isOnline() ? '0 0 8px var(--hacker-success)' : 'none',
                        lineHeight: '1.2',
                        letterSpacing: '0.025em'
                    }}>
                        {props.data.name}
                    </h3>
                </div>

                <div className="d-flex align-items-center gap-1" style={{ justifyContent: 'flex-end', flex: 1 }}>
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
                        <span className="hacker-badge danger">
                            OFFLINE
                        </span>
                    )}

                    {isEmpty(props.data.gpu_status) ? (
                        <span className="hacker-badge">GPU N/A</span>
                    ) : (
                        <button className="hacker-badge info" onClick={(e) => {
                            e.stopPropagation()
                            handleShowGPUs()
                        }}>GPU x{numItems(props.data.gpu_status)}</button>
                    )}

                    {isEmpty(props.data.gpu_compute_processes) ? (
                        <span className="hacker-badge">AGC: 0</span>
                    ) : (
                        <button className="hacker-badge success" onClick={(e) => {
                            e.stopPropagation()
                            handleShowActiveGCP()
                        }}>AGC: {numItems(props.data.gpu_compute_processes)}</button>
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
                    {props.onHide && (
                        <>
                            <span style={{
                                display: 'inline-block',
                                width: '1px',
                                height: '1.3em',
                                background: 'var(--hacker-border)',
                                margin: '0 0.5rem',
                                opacity: 0.7,
                                borderRadius: '1px',
                                alignSelf: 'center',
                            }} />
                            <button
                                onClick={handleHideWithAnimation}
                                title="Hide this machine"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '1.8em',
                                    height: '1.8em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.1em',
                                    color: 'var(--hacker-text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s, box-shadow 0.15s',
                                    padding: 0,
                                    outline: 'none',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(108,117,125,0.10)'; e.currentTarget.style.boxShadow = '0 1px 6px 0 rgba(0,0,0,0.10)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                                tabIndex={0}
                                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { handleHideWithAnimation(e); } }}
                            >
                                x
                            </button>
                        </>
                    )}
                </div>
            </div>



            <div className={`details-anim${showDetails ? ' expanded' : ' collapsed'}`}>

                <div className="row">
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
                            <span style={{ color: 'var(--hacker-text-secondary)' }}>Hostname:</span>
                            <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                {props.data.hostname}
                            </CopyableText>
                        </p>

                    </div>
                    <div className="col-md-6">
                        <p className="mb-1">
                            <span style={{ color: 'var(--hacker-text-secondary)' }}>Arch:</span>
                            <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                {props.data.architecture}
                            </CopyableText>
                        </p>
                        <p className="mb-1">
                            <span style={{ color: 'var(--hacker-text-secondary)' }}>System:</span>
                            <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                {props.data.linux_distro}
                            </CopyableText>
                        </p>
                        <p className="mb-1">
                            <span style={{ color: 'var(--hacker-text-secondary)' }}>UID:</span>
                            <CopyableText className="hacker-badge ms-2" onClick={handleInteractiveClick}>
                                {props.data.machine_id}
                            </CopyableText>
                        </p>
                    </div>
                </div>


                <div className="server-details" style={{
                    // borderTop: '1px solid var(--hacker-border)',
                    paddingTop: '0.75rem',
                    // marginTop: '0.5rem',
                }}>


                    <InfoCPU data={{
                        cpu_model: props.data.cpu_model,
                        cpu_usage: props.data.cpu_usage,
                        cpu_cores: props.data.cpu_cores,
                        ram_usage: props.data.ram_usage,
                        ram_free: props.data.ram_free,
                        ram_total: props.data.ram_total
                    }} />
                    <InfoInterfaces data={props.data.ipv4s} mac_address={props.data.mac_address} onClick={handleInteractiveClick} />
                    <UsersLine users_info={props.data.users_info} onClick={handleInteractiveClick} />
                </div>
            </div>

            {isEmpty(props.data.gpu_status) || !showGPUs ? null :
                <div className="gpu-section mt-2">
                    {props.data.gpu_status.map((gpu_data, idx) => <GpuCard key={idx} data={gpu_data} />)}
                </div>
            }

            {isEmpty(props.data.gpu_compute_processes) || !showActiveGCP ? null :
                <div className="mt-2" style={{
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
                                ACTIVE GPU COMPUTE
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
                    <div className="gcp-section">
                        {props.data.gpu_compute_processes.map((process, idx) =>
                            <GcpCard
                                key={idx}
                                process={process}
                                handleInteractiveClick={handleInteractiveClick}
                                secondsToShortString={secondsToShortString}
                                singleLine={singleLine}
                            />
                        )}
                    </div>
                </div>
            }

            {/* {isEmpty(props.data.gpu_compute_processes) || !showDetails ? null :
                <div className="processes-table mt-2">
                    <h6 style={{
                        color: 'var(--hacker-text-accent)',
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        letterSpacing: '0.025em'
                    }}>Active GPU Compute Processes</h6>
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
            } */}
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

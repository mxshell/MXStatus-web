import React from 'react'
import PropTypes from 'prop-types'
import CopyableText from './CopyableText'

const GcpCard = ({ process, handleInteractiveClick, secondsToShortString, singleLine }) => {
    return (
        <div className="process-item" style={{
            padding: '0.75rem',
            backgroundColor: 'var(--hacker-surface)',
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(136,136,136,0.07) 0 2px, transparent 2px 8px)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        lineHeight: '1.2',
                        letterSpacing: '0.015em',
                        opacity: 0.7
                    }}>PROC</span>
                    <CopyableText style={{
                        color: 'var(--hacker-text-accent)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        lineHeight: '1.2',
                        letterSpacing: '0.015em',
                        opacity: 0.7
                    }} onClick={handleInteractiveClick}>
                        {process.pid}
                    </CopyableText>
                </div>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.6rem',
                    fontWeight: '600',
                    lineHeight: '1.2'
                }}>on</span>
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
                        >
                            {singleLine(process.command)}
                        </CopyableText>
                    </div>
                </div>
            )}
        </div>
    )
}

GcpCard.propTypes = {
    process: PropTypes.object.isRequired,
    handleInteractiveClick: PropTypes.func.isRequired,
    secondsToShortString: PropTypes.func.isRequired,
    singleLine: PropTypes.func.isRequired
}

export default GcpCard
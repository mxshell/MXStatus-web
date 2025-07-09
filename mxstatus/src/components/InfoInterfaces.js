import React from 'react'
import PropTypes from 'prop-types'
import SingleIP from './SingleIP'
import CopyableText from './CopyableText'

const InfoInterfaces = props => {
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
                gap: '0.4rem'
            }}>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    Interfaces:
                </span>
                {props.data.map((ip, index) => {
                    if (ip[0] === 'lo' || ip[0] === 'docker0' || ip[0] === 'tailscale0') {
                        return null;
                    }
                    else {
                        return (
                            <SingleIP key={index} name={ip[0]} ip={ip[1]} onClick={props.onClick} />
                        )
                    }
                })}
            </div>

            <div style={{
                marginTop: '0.4rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.4rem'
            }}>
                <span style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>
                    MAC Addresses:
                </span>
                <CopyableText className="hacker-badge" style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--hacker-text-secondary)' }}>{props.mac_address}</CopyableText>
            </div>
        </div>
    )
}

InfoInterfaces.propTypes = {
    data: PropTypes.array,
    mac_address: PropTypes.string,
    onClick: PropTypes.func
}

InfoInterfaces.defaultProps = {
    data: [],
    mac_address: '',
    onClick: () => { }
}

export default InfoInterfaces

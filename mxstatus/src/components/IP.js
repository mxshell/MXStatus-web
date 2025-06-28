import React from 'react'
import PropTypes from 'prop-types'
import SingleIP from './SingleIP'

const IP = props => {
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
                    Private IP Address:
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
        </div>
    )
}

IP.propTypes = {
    data: PropTypes.array,
    onClick: PropTypes.func
}

IP.defaultProps = {
    data: [],
    onClick: () => { }
}

export default IP

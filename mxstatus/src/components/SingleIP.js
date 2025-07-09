import React from 'react'
import PropTypes from 'prop-types'
import CopyableText from './CopyableText'

const SingleIP = props => {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            margin: '0 0.25rem'
        }}>
            <CopyableText style={{
                padding: '0.2rem 0.45rem',
                borderRadius: '0.25rem 0 0 0.25rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--hacker-font-mono)',
                color: 'var(--hacker-text-secondary)',
                border: '1px solid var(--hacker-border)',
                borderRight: 'none',
                backgroundColor: 'var(--hacker-surface)',
                userSelect: 'all',
                cursor: 'pointer',
                transition: 'var(--hacker-transition)'
            }} onClick={props.onClick}>
                {props.name}
            </CopyableText>
            <CopyableText style={{
                padding: '0.2rem 0.45rem',
                borderRadius: '0 0.25rem 0.25rem 0',
                fontSize: '0.75rem',
                fontFamily: 'var(--hacker-font-mono)',
                color: 'var(--hacker-info)',
                border: '1px solid var(--hacker-info)',
                backgroundColor: 'rgba(0, 128, 255, 0.1)',
                userSelect: 'all',
                cursor: 'pointer',
                transition: 'var(--hacker-transition)'
            }} onClick={props.onClick}>
                {props.ip}
            </CopyableText>
        </div>
    )
}

SingleIP.propTypes = {
    "name": PropTypes.string,
    "ip": PropTypes.string,
    "onClick": PropTypes.func
}

SingleIP.defaultProps = {
    "name": "xx",
    "ip": "xxx.xxx.xxx.xxx",
    "onClick": () => { }
}

export default SingleIP

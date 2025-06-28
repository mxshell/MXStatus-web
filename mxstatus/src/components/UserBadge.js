import React from 'react'
import PropTypes from 'prop-types'

const UserBadge = props => {
    const getBadgeStyle = () => {
        const baseStyle = {
            padding: '0.15rem 0.35rem',
            borderRadius: '1rem',
            fontSize: '0.7rem',
            fontFamily: 'var(--hacker-font-mono)',
            border: '1px solid',
            transition: 'var(--hacker-transition)',
            display: 'inline-block',
            margin: '0 0.15rem',
            fontWeight: '600',
            letterSpacing: '0.02em',
            lineHeight: '1.2'
        }

        if (props.online) {
            return {
                ...baseStyle,
                color: 'var(--hacker-info)',
                borderColor: 'var(--hacker-info)',
                backgroundColor: 'rgba(0, 123, 255, 0.1)'
            }
        } else {
            return {
                ...baseStyle,
                color: 'var(--hacker-text-secondary)',
                borderColor: 'var(--hacker-border)',
                backgroundColor: 'var(--hacker-surface)'
            }
        }
    }

    return (
        <span style={getBadgeStyle()}>
            {props.name}
        </span>
    )
}

UserBadge.propTypes = {
    name: PropTypes.string,
    online: PropTypes.bool,
}

export default UserBadge

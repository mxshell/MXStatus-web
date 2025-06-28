import React from 'react'
import PropTypes from 'prop-types'
import UserBadge from './UserBadge'

const UsersLine = props => {
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
                    Online:
                </span>
                {props.users_info.online_users.map((name, index) =>
                    <UserBadge key={index} name={name} online={true} />
                )}
            </div>

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
                    Offline:
                </span>
                {props.users_info.offline_users.map((name, index) =>
                    <UserBadge key={index} name={name} online={false} />
                )}
            </div>
        </div>
    )
}

UsersLine.propTypes = {
    users_info: PropTypes.object,
    onClick: PropTypes.func
}

UsersLine.defaultProps = {
    users_info: {
        all_users: [],
        online_users: [],
        offline_users: [],
    },
    onClick: () => { }
}

export default UsersLine

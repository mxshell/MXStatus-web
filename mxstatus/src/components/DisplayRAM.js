import React from 'react'

const DisplayRAM = (props) => {
    return (
        <span style={{ color: 'var(--hacker-text-secondary)' }}>
            {(props.ram / 1000).toFixed(0)} GB
        </span>
    )
}

export default DisplayRAM

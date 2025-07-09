import React from 'react'

const DisplayRAM = (props) => {
    return (
        <span style={{ color: 'var(--hacker-text-secondary)' }}>
            {(props.ram / 1024).toFixed(1)} GB
        </span>
    )
}

export default DisplayRAM

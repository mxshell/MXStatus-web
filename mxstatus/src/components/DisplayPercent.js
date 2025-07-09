import React from 'react'

const DisplayPercent = (props) => {
    const getUtilizationColor = (percent) => {
        if (percent < 0.5) return 'var(--hacker-info)'
        if (percent < 0.9) return 'var(--hacker-warning)'
        if (percent >= 0.9 && percent <= 1.0) return 'var(--hacker-danger)'
        return "var(--hacker-text-secondary)"
    }

    return (
        <span style={{ color: getUtilizationColor(props.percent) }}>
            {(props.percent * 100).toFixed(1)}%
        </span>
    )
}

export default DisplayPercent

import React from 'react'

const DisplayPercent = (props) => {
    const getColor = () => {
        if (props.percent < 0.7) {
            return "var(--hacker-info)"
        } else if (props.percent >= 0.7 && props.percent < 0.9) {
            return "var(--hacker-warning)"
        } else if (props.percent >= 0.9 && props.percent <= 1.0) {
            return "var(--hacker-danger)"
        } else {
            return "var(--hacker-text-secondary)"
        }
    }

    return (
        <span style={{ color: getColor() }}>
            {(props.percent * 100).toFixed(1)}%
        </span>
    )
}

export default DisplayPercent

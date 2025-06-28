import React from 'react'

const DisplayTemp = (props) => {
    const getColor = () => {
        if (props.temp < props.warningTemp) {
            return "var(--hacker-info)"
        } else if (props.temp >= props.warningTemp && props.temp < props.dangerTemp) {
            return "var(--hacker-warning)"
        } else if (props.temp >= props.dangerTemp) {
            return "var(--hacker-danger)"
        } else {
            return "var(--hacker-text-secondary)"
        }
    }

    return (
        <span style={{ color: getColor() }}>
            {props.temp}°C
        </span>
    )
}

DisplayTemp.defaultProps = {
    "temp": 0.0,
    "warningTemp": 80,
    "dangerTemp": 85,
}

export default DisplayTemp


const getUtilizationColor = (percent) => {
    if (percent < 0.5) return 'var(--hacker-info)'
    if (percent < 0.9) return 'var(--hacker-warning)'
    if (percent >= 0.9 && percent <= 1.0) return 'var(--hacker-danger)'
    return "var(--hacker-text-secondary)"
}

const getTemperatureColor = temp => {
    if (temp < 70) return "var(--hacker-info)";
    if (temp < 85) return "var(--hacker-warning)";
    if (temp >= 85) return "var(--hacker-danger)";
    return "var(--hacker-text-secondary)";
};


export { getUtilizationColor, getTemperatureColor }
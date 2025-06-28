import React, { useState } from 'react'
import PropTypes from 'prop-types'

const CopyableText = ({ children, className, style, showCopyIcon = true, maxLength }) => {
    const [copied, setCopied] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleClick = async () => {
        try {
            // Always copy the full text, not the truncated display text
            await navigator.clipboard.writeText(children)
            setCopied(true)

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const getDisplayText = () => {
        if (maxLength && children.length > maxLength) {
            return children.substring(0, maxLength) + '...'
        }
        return children
    }

    const getCopyIcon = () => {
        if (copied) {
            return (
                <span style={{
                    color: 'var(--hacker-success)',
                    marginLeft: '0.3rem',
                    fontSize: '0.7rem',
                    opacity: 1,
                    transition: 'opacity 0.2s ease'
                }}>
                    ✓
                </span>
            )
        }

        if (showCopyIcon && isHovered) {
            return (
                <span style={{
                    color: 'var(--hacker-text-accent)',
                    marginLeft: '0.3rem',
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease'
                }}>
                    📋
                </span>
            )
        }

        return null
    }

    return (
        <span
            className={className}
            style={{
                ...style,
                cursor: 'pointer',
                userSelect: 'text',
                position: 'relative',
                transition: 'all 0.2s ease',
                ...(isHovered && {
                    color: 'var(--hacker-text-accent)',
                    textShadow: '0 0 4px var(--hacker-text-accent)'
                }),
                ...(copied && {
                    color: 'var(--hacker-success)',
                    textShadow: '0 0 6px var(--hacker-success)'
                })
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={copied ? "Copied!" : maxLength && children.length > maxLength ? `Click to copy full command (${children.length} chars)` : "Click to copy"}
        >
            {getDisplayText()}
            {getCopyIcon()}
        </span>
    )
}

CopyableText.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    showCopyIcon: PropTypes.bool,
    maxLength: PropTypes.number
}

export default CopyableText 
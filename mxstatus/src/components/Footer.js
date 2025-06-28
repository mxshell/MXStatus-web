import React from 'react'

const Footer = () => {
    return (
        <footer style={{
            marginTop: '3rem',
            padding: '1.5rem 0',
            borderTop: '1px solid var(--hacker-border)',
            textAlign: 'center',
            color: 'var(--hacker-text-secondary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--hacker-font-mono)'
        }}>
            <p>MXStatus © 2025. All rights reserved.</p>
        </footer>
    )
}

export default Footer

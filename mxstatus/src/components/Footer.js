import React from 'react'

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            marginTop: '3rem',
            padding: '1.5rem 0',
            borderTop: '1px solid var(--hacker-border)',
            textAlign: 'center',
            color: 'var(--hacker-text-secondary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--hacker-font-mono)',
            background: 'rgba(0, 20, 0, 0.02)'
        }}>
            <p style={{ margin: '0', lineHeight: '1.6' }}>
                <a
                    href="https://github.com/mxshell/MXStatus-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--hacker-text-secondary)',
                        textDecoration: 'none',
                        borderBottom: '1px solid transparent',
                        transition: 'all 0.2s ease',
                        padding: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = 'var(--hacker-primary, #00ff41)';
                        e.target.style.borderBottomColor = 'var(--hacker-primary, #00ff41)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = 'var(--hacker-text-secondary)';
                        e.target.style.borderBottomColor = 'transparent';
                    }}
                >
                    MXStatus
                </a>
                {' '} © {currentYear}. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer

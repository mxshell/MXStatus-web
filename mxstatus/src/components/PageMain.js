import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import MachineCard from "./MachineCard"

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_API_ROOT = "https://api.mxshell.dev";

const LOCALE_CONFIG = {
    locale: "en-SG",
    options: {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        year: "numeric",
        month: "short",
        day: "numeric",
    }
};

const REFRESH_INTERVALS = {
    INFINITY: 360000, // 360000 seconds = 100 hours (almost infinite)
    DEFAULT: 60, // seconds
    FAST: 5,
    MEDIUM: 10,
    SLOW: 60
};

const STORAGE_KEYS = {
    DYNAMIC: 'gpu_servers_dynamic',
    DYNAMIC_INTERVAL: 'gpu_servers_dynamic_interval',
    OPTION_A_CHECKED: 'gpu_servers_option_a_checked',
    OPTION_B_CHECKED: 'gpu_servers_option_b_checked',
    OPTION_C_CHECKED: 'gpu_servers_option_c_checked',
    VIEW_KEY: 'gpu_servers_view_key',
    HIDDEN_MACHINE_IDS: 'mxstatus_hidden_machine_ids'
};

const CODE_SNIPPETS = [
    // Python Dijkstra's
    'def dijkstra(graph, start):',
    '    import heapq',
    '    queue = [(0, start)]',
    '    distances = {v: float("inf") for v in graph}',
    '    distances[start] = 0',
    '    while queue:',
    '        (dist_u, u) = heapq.heappop(queue)',
    '        for v, weight in graph[u]:',
    '            alt = dist_u + weight',
    '            if alt < distances[v]:',
    '                distances[v] = alt',
    '                heapq.heappush(queue, (alt, v))',
    '    return distances',
    // Python Quicksort
    'def quicksort(arr):',
    '    if len(arr) <= 1:',
    '        return arr',
    '    pivot = arr[len(arr) // 2]',
    '    left = [x for x in arr if x < pivot]',
    '    middle = [x for x in arr if x == pivot]',
    '    right = [x for x in arr if x > pivot]',
    '    return quicksort(left) + middle + quicksort(right)',
    // Python Merge Sort
    'def merge_sort(arr):',
    '    if len(arr) > 1:',
    '        mid = len(arr) // 2',
    '        L = arr[:mid]',
    '        R = arr[mid:]',
    '        merge_sort(L)',
    '        merge_sort(R)',
    '        i = j = k = 0',
    '        while i < len(L) and j < len(R):',
    '            if L[i] < R[j]:',
    '                arr[k] = L[i]',
    '                i += 1',
    '            else:',
    '                arr[k] = R[j]',
    '                j += 1',
    '            k += 1',
    '        while i < len(L):',
    '            arr[k] = L[i]',
    '            i += 1',
    '            k += 1',
    '        while j < len(R):',
    '            arr[k] = R[j]',
    '            j += 1',
    '            k += 1',
    // Python Binary Search
    'def binary_search(arr, target):',
    '    left, right = 0, len(arr) - 1',
    '    while left <= right:',
    '        mid = (left + right) // 2',
    '        if arr[mid] == target:',
    '            return mid',
    '        elif arr[mid] < target:',
    '            left = mid + 1',
    '        else:',
    '            right = mid - 1',
    '    return -1',
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Local storage helper functions
const getFromStorage = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key)
        return item !== null ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error(`Error reading from localStorage for key ${key}:`, error)
        return defaultValue
    }
}

const setToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(`Error writing to localStorage for key ${key}:`, error)
    }
}

// Machine status helper
const isMachineOnline = (machineData) => {
    let v = machineData.created_at
    let now = new Date()

    if (typeof v === 'string' || v instanceof String) {
        let d = new Date(v)
        let i = now - d
        // 2 Minutes = 120000 Milliseconds
        if (i <= 120000) {
            return true
        }
    }
    return false
}

// Custom hook for intervals
const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Animated code flow background for welcome page
function CodeFlowBackground() {
    // Compose lines for the effect
    const lines = Array.from({ length: 18 }, (_, i) => {
        // Randomly pick 1-2 snippets and join with spacing/indent
        let n = Math.floor(Math.random() * 2) + 1;
        let line = '';
        for (let j = 0; j < n; j++) {
            let snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
            if (j > 0) line += '    ';
            line += snippet;
        }
        return line;
    });

    return (
        <div style={{
            position: 'fixed',
            zIndex: 0,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #0a0f0a 80%, #0f1a0f 100%)',
        }}>
            {lines.map((line, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        top: `calc(${(idx / lines.length) * 100}% - 1.2rem)`,
                        left: 0,
                        width: '100vw',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--hacker-font-mono, monospace)',
                        fontSize: '1.05rem',
                        color: 'rgba(0,255,65,0.13)',
                        textShadow: '0 0 8px #00ff41, 0 0 2px #00ff41',
                        opacity: 0.7,
                        letterSpacing: '0.08em',
                        animation: `codeflow-left 12s linear infinite`,
                        animationDelay: `${idx * 0.7}s`,
                        userSelect: 'none',
                    }}
                >
                    {line}
                </div>
            ))}
            {/* Overlay for extra darkness and contrast */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(120deg, rgba(10,16,10,0.92) 80%, rgba(16,26,16,0.97) 100%)',
                zIndex: 1,
            }} />
            <style>{`
                @keyframes codeflow-left {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100vw); }
                }
            `}</style>
        </div>
    );
}

// Loading Animation Component
const LoadingAnimation = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-logo">
                    <div className="loading-logo-text">MXStatus</div>
                    <div className="loading-logo-subtitle">INITIALIZING...</div>
                </div>
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <div className="loading-status">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="loading-text">CONNECTING TO SERVERS</div>
                </div>
            </div>
        </div>
    )
}

// Error Message Component
const ErrorMessage = ({ error, onRetry }) => {
    return (
        <div className="hacker-card" style={{
            textAlign: 'center',
            padding: '2rem',
            borderColor: 'var(--hacker-danger)',
            borderWidth: '2px'
        }}>
            <div style={{
                color: 'var(--hacker-danger)',
                fontSize: '1.2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                letterSpacing: '0.02em'
            }}>
                ⚠️ CONNECTION ERROR
            </div>
            <p style={{
                margin: '0 0 1.5rem 0',
                fontSize: '0.9rem',
                fontWeight: '600',
                lineHeight: '1.5',
                letterSpacing: '0.015em',
                color: 'var(--hacker-text-secondary)'
            }}>
                {error}
            </p>
            <button
                onClick={onRetry}
                style={{
                    backgroundColor: 'var(--hacker-surface)',
                    border: '1px solid var(--hacker-danger)',
                    color: 'var(--hacker-danger)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--hacker-font-mono)',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    transition: 'var(--hacker-transition)',
                    textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--hacker-danger)';
                    e.target.style.color = 'var(--hacker-bg)';
                    e.target.style.textShadow = '0 0 8px var(--hacker-danger)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--hacker-surface)';
                    e.target.style.color = 'var(--hacker-danger)';
                    e.target.style.textShadow = 'none';
                }}
            >
                Retry Connection
            </button>
        </div>
    )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PageMain = () => {

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    // API and Loading State
    const [dataSnapshot, setDataSnapshot] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStartTime, setLoadingStartTime] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [error, setError] = useState(null);

    // Server Configuration State
    const [apiRoot, setApiRoot] = useState(DEFAULT_API_ROOT);
    const [serverMode, setServerMode] = useState("default"); // 'default' or 'custom'
    const [pendingServer, setPendingServer] = useState("");
    const [pendingViewKey, setPendingViewKey] = useState(() =>
        getFromStorage(STORAGE_KEYS.VIEW_KEY, ""));
    const [welcomeError, setWelcomeError] = useState("");

    // Refresh and Auto-update State
    const [dynamicInterval, setDynamicInterval] = useState(() =>
        getFromStorage(STORAGE_KEYS.DYNAMIC_INTERVAL, REFRESH_INTERVALS.INFINITY)
    )
    const [dynamic, setDynamic] = useState(() =>
        getFromStorage(STORAGE_KEYS.DYNAMIC, false)
    )

    // View Preferences State
    const [optionAChecked, setOptionAChecked] = useState(() =>
        getFromStorage(STORAGE_KEYS.OPTION_A_CHECKED, false)
    )
    const [optionBChecked, setOptionBChecked] = useState(() =>
        getFromStorage(STORAGE_KEYS.OPTION_B_CHECKED, false)
    )
    const [optionCChecked, setOptionCChecked] = useState(() =>
        getFromStorage(STORAGE_KEYS.OPTION_C_CHECKED, false)
    )
    const [viewKey, setViewKey] = useState(() =>
        getFromStorage(STORAGE_KEYS.VIEW_KEY, "")
    )

    // Machine Visibility State
    const [hiddenMachineIds, setHiddenMachineIds] = useState(() => {
        try {
            const item = localStorage.getItem(STORAGE_KEYS.HIDDEN_MACHINE_IDS);
            return item ? JSON.parse(item) : [];
        } catch {
            return [];
        }
    });
    const [showAllMachines, setShowAllMachines] = useState(false);

    // ========================================================================
    // API FUNCTIONS
    // ========================================================================

    const getData = async (customRoot, customKey) => {
        setError(null);
        setWelcomeError("");
        const root = customRoot || apiRoot;
        const key = customKey || viewKey;
        const config = {
            method: "GET",
            url: root + "/view",
            headers: { "accept": "application/json" },
            params: { view_key: key }
        };
        await axios(config)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        setDataSnapshot(response.data)
                        setError(null)
                    } else {
                        setDataSnapshot([])
                        setError("No data found for this view key. Please check if the key is correct or if there are any active servers.")
                    }
                    setIsLoading(false)
                } else {
                    setDataSnapshot([])
                    setError("Server returned an unexpected response. Please try again.")
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                setDataSnapshot([])
                if (error.response) {
                    if (error.response.status === 404) {
                        setError("View key not found. Please check if the key is correct.")
                    } else if (error.response.status === 403) {
                        setError("Access denied. This view key may be invalid or expired.")
                    } else if (error.response.status >= 500) {
                        setError("Server error. Please try again later.")
                    } else {
                        setError(`Server error (${error.response.status}). Please try again.`)
                    }
                } else if (error.request) {
                    setError("Network error. Please check your connection and try again.")
                } else {
                    setError("An unexpected error occurred. Please try again.")
                }
                setIsLoading(false)
            })
    }

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    // Refresh and Reset Handlers
    const handleRefresh = () => {
        setViewKey(pendingViewKey.trim())
        getData()
    }

    const resetToDefaults = () => {
        // Clear all local storage
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key)
        })

        // Reset all states to default values
        setDynamicInterval(REFRESH_INTERVALS.INFINITY)
        setDynamic(false)
        setOptionAChecked(false)
        setOptionBChecked(false)
        setOptionCChecked(false)
        setViewKey("")
        setPendingViewKey("")
        setError(null)
        setDataSnapshot([])

        // Trigger data fetch with default view key
        setTimeout(() => {
            getData()
        }, 100)
    }

    // Auto-refresh Handlers
    const handleDynamicOptions = (e) => {
        setDynamic(true)
        setDynamicInterval(e.target.value)
        showRadioCheck(e.target.value)
    }

    const showRadioCheck = (value) => {
        // cast value to int
        const intValue = parseInt(value);

        if (intValue === REFRESH_INTERVALS.FAST) {
            setOptionAChecked(true)
            setOptionBChecked(false)
            setOptionCChecked(false)
        } else if (intValue === REFRESH_INTERVALS.MEDIUM) {
            setOptionAChecked(false)
            setOptionBChecked(true)
            setOptionCChecked(false)
        } else if (intValue === REFRESH_INTERVALS.SLOW) {
            setOptionAChecked(false)
            setOptionBChecked(false)
            setOptionCChecked(true)
        } else {
            console.log(intValue)
        }
    }

    const uncheckRadioAll = () => {
        setOptionAChecked(false)
        setOptionBChecked(false)
        setOptionCChecked(false)
    }

    const toggleDynamic = () => {
        setDynamic((s) => {
            if (s) {
                console.log("Auto Refresh turned off")
                setDynamicInterval(REFRESH_INTERVALS.INFINITY)
                uncheckRadioAll()
                return false
            } else {
                console.log("Auto Refresh turned on")
                setDynamicInterval(REFRESH_INTERVALS.DEFAULT)
                showRadioCheck(REFRESH_INTERVALS.DEFAULT)
                return true
            }
        })
    }

    // Machine Visibility Handlers
    const hideMachine = (machine_id) => {
        setHiddenMachineIds(ids => ids.includes(machine_id) ? ids : [...ids, machine_id]);
    };

    const handleShowAllMachines = () => {
        setHiddenMachineIds([]);
        setShowAllMachines(true);
        setTimeout(() => setShowAllMachines(false), 100); // reset after render
    };

    const handleHideOfflineMachines = () => {
        const offlineIds = dataSnapshot.filter(m => !isMachineOnline(m)).map(m => m.machine_id);
        setHiddenMachineIds(ids => Array.from(new Set([...ids, ...offlineIds])));
    };

    // Welcome Page Handler
    function handleWelcomeEnter() {
        setWelcomeError("");
        const serverToTest = serverMode === "default" ? DEFAULT_API_ROOT : pendingServer.trim();
        const keyToTest = pendingViewKey.trim();
        if (!keyToTest) {
            setWelcomeError("Please enter a view key.");
            return;
        }
        if (serverMode === "custom" && !/^https?:\/\//.test(serverToTest)) {
            setWelcomeError("Please enter a valid server address (must start with http:// or https://)");
            return;
        }
        setIsLoading(true);
        setShowContent(false); // Show loading animation
        const loadingStart = Date.now();
        axios({
            method: "GET",
            url: serverToTest + "/view",
            headers: { "accept": "application/json" },
            params: { view_key: keyToTest }
        })
            .then((response) => {
                const elapsed = Date.now() - loadingStart;
                const finish = () => {
                    if (response.status === 200 && Array.isArray(response.data)) {
                        setApiRoot(serverToTest);
                        setViewKey(keyToTest);
                        setPendingViewKey(keyToTest);
                        setDataSnapshot(response.data);
                        setWelcomeError("");
                    } else {
                        setWelcomeError("Invalid response from server. Please check your server and view key.");
                    }
                    setShowContent(true);
                    setIsLoading(false);
                };
                if (elapsed < 1000) {
                    setTimeout(finish, 1000 - elapsed);
                } else {
                    finish();
                }
            })
            .catch((error) => {
                const elapsed = Date.now() - loadingStart;
                const finish = () => {
                    let msg = "Failed to verify server or view key.";
                    if (error.response && error.response.status === 404) {
                        msg = "View key not found. Please check if the key is correct.";
                    } else if (error.response && error.response.status === 403) {
                        msg = "Access denied. This view key may be invalid or expired.";
                    } else if (error.code === 'ERR_NETWORK') {
                        msg = "Network error. Please check your server address and connection.";
                    }
                    setWelcomeError(msg);
                    setIsLoading(false);
                    setShowContent(true);
                };
                if (elapsed < 1000) {
                    setTimeout(finish, 1000 - elapsed);
                } else {
                    finish();
                }
            });
    }

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    // Filter machines: hide if in hiddenMachineIds, unless showAllMachines is true
    const filteredMachines = (showAllMachines
        ? dataSnapshot
        : dataSnapshot.filter(machine => !hiddenMachineIds.includes(machine.machine_id))
    );

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Persistence Effects
    useEffect(() => {
        setToStorage(STORAGE_KEYS.DYNAMIC_INTERVAL, dynamicInterval)
    }, [dynamicInterval])

    useEffect(() => {
        setToStorage(STORAGE_KEYS.DYNAMIC, dynamic)
    }, [dynamic])

    useEffect(() => {
        setToStorage(STORAGE_KEYS.OPTION_A_CHECKED, optionAChecked)
    }, [optionAChecked])

    useEffect(() => {
        setToStorage(STORAGE_KEYS.OPTION_B_CHECKED, optionBChecked)
    }, [optionBChecked])

    useEffect(() => {
        setToStorage(STORAGE_KEYS.OPTION_C_CHECKED, optionCChecked)
    }, [optionCChecked])

    useEffect(() => {
        setToStorage(STORAGE_KEYS.VIEW_KEY, viewKey)
    }, [viewKey])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.HIDDEN_MACHINE_IDS, JSON.stringify(hiddenMachineIds));
    }, [hiddenMachineIds]);

    // Data Loading Effects
    useEffect(() => {
        getData();
        setLoadingStartTime(Date.now());
        // eslint-disable-next-line react-hooks/exhaustive-deps       
    }, [viewKey]);

    // Loading Animation Effect
    useEffect(() => {
        if (!isLoading && loadingStartTime) {
            const elapsedTime = Date.now() - loadingStartTime;
            const minimumLoadingTime = 1000; // 1 second

            if (elapsedTime < minimumLoadingTime) {
                const remainingTime = minimumLoadingTime - elapsedTime;
                setTimeout(() => {
                    setShowContent(true);
                }, remainingTime);
            } else {
                setShowContent(true);
            }
        }
    }, [isLoading, loadingStartTime]);

    // Auto-refresh Effect
    useInterval(() => {
        getData()
    }, dynamicInterval * 1000);

    // ========================================================================
    // RENDER HELPERS
    // ========================================================================

    const renderWelcomePage = () => (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            margin: 0,
            padding: 0,
        }} className="fade-in">
            <CodeFlowBackground />
            <div className="hacker-card mb-3" style={{
                maxWidth: 480,
                width: '100%',
                textAlign: "left",
                padding: '2.5rem 2.5rem 2.2rem 2.5rem',
                boxSizing: 'border-box',
                borderRadius: '1.25rem',
                boxShadow: '0 8px 32px 0 rgba(0,255,65,0.10), 0 1.5px 8px 0 rgba(0,255,65,0.08)',
                border: '1.5px solid var(--hacker-border)',
                background: 'linear-gradient(135deg, rgba(20,30,20,0.98) 60%, rgba(0,255,65,0.04) 100%)',
                position: 'relative',
                animation: 'fadeInUp 0.7s cubic-bezier(.4,1.4,.6,1)'
            }}>
                {/* Logo/Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
                    <img src="/favicon-32x32.png" alt="MXStatus Logo" style={{ width: 40, height: 40, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,255,65,0.10)' }} />
                </div>
                {/* Heading with accent underline */}
                <h2 style={{
                    color: 'var(--hacker-text-accent)',
                    fontWeight: 900,
                    marginBottom: '0.7rem',
                    textAlign: 'center',
                    fontSize: '2.1rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    position: 'relative',
                }}>
                    Welcome to MXStatus
                    <span style={{
                        display: 'block',
                        width: 56,
                        height: 4,
                        background: 'linear-gradient(90deg, var(--hacker-text-accent) 60%, transparent 100%)',
                        borderRadius: 2,
                        margin: '0.5rem auto 0',
                        opacity: 0.7
                    }}></span>
                </h2>
                <div className="mb-4" style={{ fontWeight: 600, color: 'var(--hacker-text-secondary)', fontSize: '1.05rem', letterSpacing: '0.01em', textAlign: 'center', marginBottom: '2.2rem' }}>
                    Please enter your view key and server to access your dashboard.
                </div>
                {/* Server Selection */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3 control-center-row" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-check-label me-2" style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        minWidth: '80px',
                        letterSpacing: '0.01em',
                    }}>
                        Select:
                    </label>
                    <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                        <div className="form-check d-flex align-items-center" style={{ marginRight: '1.2rem' }}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="serverMode"
                                value="default"
                                checked={serverMode === "default"}
                                onChange={() => { setServerMode("default"); setPendingServer(""); }}
                                style={{ marginRight: 6 }}
                                id="server-default"
                            />
                            <label className="form-check-label ms-1" htmlFor="server-default" style={{
                                color: 'var(--hacker-text-secondary)',
                                fontSize: '0.95rem',
                                fontWeight: '700'
                            }}>Default Server</label>
                        </div>
                        <div className="form-check d-flex align-items-center" style={{ marginRight: '1.2rem' }}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="serverMode"
                                value="custom"
                                checked={serverMode === "custom"}
                                onChange={() => setServerMode("custom")}
                                style={{ marginRight: 6 }}
                                id="server-custom"
                            />
                            <label className="form-check-label ms-1" htmlFor="server-custom" style={{
                                color: 'var(--hacker-text-secondary)',
                                fontSize: '0.95rem',
                                fontWeight: '700'
                            }}>Custom Server</label>
                        </div>
                    </div>
                </div>
                {serverMode === "custom" && (
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-3 control-center-row" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-check-label me-2" style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            minWidth: '80px',
                            letterSpacing: '0.01em',
                        }}>
                            Server:
                        </label>
                        <input
                            type="text"
                            value={pendingServer}
                            onChange={e => setPendingServer(e.target.value)}
                            placeholder="Enter server address"
                            style={{
                                backgroundColor: 'var(--hacker-surface)',
                                border: '1.5px solid var(--hacker-border)',
                                color: 'var(--hacker-text-primary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.4rem',
                                fontSize: '1rem',
                                fontFamily: 'var(--hacker-font-mono)',
                                fontWeight: '600',
                                letterSpacing: '0.02em',
                                minWidth: '220px',
                                transition: 'var(--hacker-transition)',
                                boxShadow: '0 1.5px 8px 0 rgba(0,255,65,0.07)'
                            }}
                            autoFocus
                        />
                    </div>
                )}
                {/* View Key Input */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3 control-center-row" style={{ marginBottom: '2.1rem' }}>
                    <label className="form-check-label me-2" style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        minWidth: '80px',
                        letterSpacing: '0.01em',
                    }}>
                        View Key:
                    </label>
                    <input
                        type="text"
                        value={pendingViewKey}
                        onChange={e => setPendingViewKey(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleWelcomeEnter(); }}
                        style={{
                            backgroundColor: 'var(--hacker-surface)',
                            border: '1.5px solid var(--hacker-border)',
                            color: 'var(--hacker-text-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.4rem',
                            fontSize: '1rem',
                            fontFamily: 'var(--hacker-font-mono)',
                            fontWeight: '600',
                            letterSpacing: '0.02em',
                            minWidth: '220px',
                            transition: 'var(--hacker-transition)',
                            boxShadow: '0 1.5px 8px 0 rgba(0,255,65,0.07)'
                        }}
                        placeholder="Enter view key"
                    />
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-2 control-center-row" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <button
                        onClick={handleWelcomeEnter}
                        style={{
                            background: 'linear-gradient(90deg, var(--hacker-text-accent) 0%, var(--hacker-success) 100%)',
                            border: 'none',
                            color: 'var(--hacker-bg)',
                            padding: '0.7rem 2.2rem',
                            borderRadius: '0.5rem',
                            fontSize: '1.08rem',
                            fontFamily: 'var(--hacker-font-mono)',
                            fontWeight: '800',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            boxShadow: '0 2px 12px 0 rgba(0,255,65,0.10)',
                            transition: 'all 0.18s cubic-bezier(.4,1.4,.6,1)',
                            textTransform: 'uppercase',
                            marginTop: '0.5rem',
                            outline: 'none',
                        }}
                        onMouseOver={e => {
                            e.target.style.background = 'linear-gradient(90deg, var(--hacker-success) 0%, var(--hacker-text-accent) 100%)';
                            e.target.style.color = 'var(--hacker-bg)';
                            e.target.style.boxShadow = '0 4px 18px 0 rgba(0,255,65,0.18)';
                        }}
                        onMouseOut={e => {
                            e.target.style.background = 'linear-gradient(90deg, var(--hacker-text-accent) 0%, var(--hacker-success) 100%)';
                            e.target.style.color = 'var(--hacker-bg)';
                            e.target.style.boxShadow = '0 2px 12px 0 rgba(0,255,65,0.10)';
                        }}
                        disabled={pendingViewKey.trim() === "" || (serverMode === "custom" && pendingServer.trim() === "")}
                    >
                        Enter
                    </button>
                </div>
                {welcomeError && (
                    <div style={{ color: 'var(--hacker-danger)', marginTop: '1rem', fontWeight: 600, textAlign: 'center', fontSize: '1.05rem', letterSpacing: '0.01em' }}>{welcomeError}</div>
                )}
            </div>
        </div>
    );

    const renderControlCenter = () => (
        <div className="hacker-card mb-3">
            <h6 style={{
                color: 'var(--hacker-text-accent)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                lineHeight: '1.3'
            }}>
                CONTROL CENTER
            </h6>

            {/* View Key Configuration */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center">
                    <label className="form-check-label me-2" style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        minWidth: '80px'
                    }}>
                        View Key:
                    </label>
                    <input
                        type="text"
                        value={pendingViewKey}
                        onChange={(e) => setPendingViewKey(e.target.value)}
                        style={{
                            backgroundColor: 'var(--hacker-surface)',
                            border: '1px solid var(--hacker-border)',
                            color: 'var(--hacker-text-primary)',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--hacker-font-mono)',
                            fontWeight: '600',
                            letterSpacing: '0.02em',
                            minWidth: '140px',
                            transition: 'var(--hacker-transition)'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--hacker-text-accent)';
                            e.target.style.boxShadow = '0 0 0 1px var(--hacker-text-accent)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--hacker-border)';
                            e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter view key"
                    />
                </div>
                <button
                    className="hacker-badge"
                    onClick={handleRefresh}
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        padding: '0.3rem 0.8rem',
                        border: 'none',
                        background: 'none',
                        color: 'var(--hacker-text-secondary)',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        transition: 'color 0.15s',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--hacker-text-accent)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--hacker-text-secondary)'}
                >
                    Refresh
                </button>
                <button
                    className="hacker-badge"
                    onClick={resetToDefaults}
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        padding: '0.3rem 0.8rem',
                        border: 'none',
                        background: 'none',
                        color: 'var(--hacker-text-secondary)',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        transition: 'color 0.15s',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--hacker-text-accent)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--hacker-text-secondary)'}
                    title="Reset all settings to default values and clear local storage"
                >
                    Reset All Settings
                </button>
            </div>

            {/* Auto Refresh Controls */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3 " style={{
                borderTop: '1px solid var(--hacker-border)',
                paddingTop: '1rem'
            }}>
                <div className="d-flex align-items-center">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={dynamic}
                        onChange={toggleDynamic}
                        style={{
                            backgroundColor: 'var(--hacker-surface)',
                            borderColor: 'var(--hacker-border)',
                            accentColor: 'var(--hacker-text-accent)'
                        }}
                    />
                    <label className="form-check-label ms-2" style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        Auto refresh every:
                    </label>
                </div>
                <div className="d-flex gap-3">
                    <div className="d-flex align-items-center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="dynamicOptions"
                            value={REFRESH_INTERVALS.FAST}
                            checked={optionAChecked}
                            onChange={handleDynamicOptions}
                            style={{
                                backgroundColor: 'var(--hacker-surface)',
                                borderColor: 'var(--hacker-border)',
                                accentColor: 'var(--hacker-text-accent)'
                            }}
                        />
                        <label className="form-check-label ms-1" style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>5s</label>
                    </div>
                    <div className="d-flex align-items-center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="dynamicOptions"
                            value={REFRESH_INTERVALS.MEDIUM}
                            checked={optionBChecked}
                            onChange={handleDynamicOptions}
                            style={{
                                backgroundColor: 'var(--hacker-surface)',
                                borderColor: 'var(--hacker-border)',
                                accentColor: 'var(--hacker-text-accent)'
                            }}
                        />
                        <label className="form-check-label ms-1" style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>10s</label>
                    </div>
                    <div className="d-flex align-items-center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="dynamicOptions"
                            value={REFRESH_INTERVALS.SLOW}
                            checked={optionCChecked}
                            onChange={handleDynamicOptions}
                            style={{
                                backgroundColor: 'var(--hacker-surface)',
                                borderColor: 'var(--hacker-border)',
                                accentColor: 'var(--hacker-text-accent)'
                            }}
                        />
                        <label className="form-check-label ms-1" style={{
                            color: 'var(--hacker-text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>60s</label>
                    </div>
                </div>
            </div>

            {/* Display Controls */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3 " style={{
                borderTop: '1px solid var(--hacker-border)',
                paddingTop: '1rem'
            }}>
                <div className="d-flex align-items-center gap-2">
                    {/* Hidden count badge - now first, neutral style */}
                    <span style={{
                        color: 'var(--hacker-text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        letterSpacing: '0.01em',
                        lineHeight: '1.3'
                    }}>Machines Hidden:</span>
                    <span className="hacker-badge ms-0" style={{
                        fontSize: '0.8rem',
                        padding: '0.18rem 0.7rem',
                        background: 'var(--hacker-surface)',
                        color: 'var(--hacker-text-secondary)',
                        border: '1px solid var(--hacker-border)',
                        fontWeight: 600,
                        letterSpacing: '0.01em',
                        boxShadow: 'none',
                        marginRight: '0.5rem'
                    }}>
                        {hiddenMachineIds.length}
                    </span>
                    {/* Subtle, modern buttons */}
                    <button
                        className="hacker-badge"
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            padding: '0.3rem 0.8rem',
                            border: 'none',
                            background: 'none',
                            color: 'var(--hacker-text-secondary)',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            transition: 'color 0.15s',
                            marginRight: '0.2rem',
                        }}
                        onClick={handleHideOfflineMachines}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--hacker-text-accent)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--hacker-text-secondary)'}
                    >
                        Hide offline
                    </button>
                    <button
                        className="hacker-badge"
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            padding: '0.3rem 0.8rem',
                            border: 'none',
                            background: 'none',
                            color: 'var(--hacker-text-secondary)',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            transition: 'color 0.15s',
                        }}
                        onClick={handleShowAllMachines}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--hacker-text-accent)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--hacker-text-secondary)'}
                    >
                        Show all
                    </button>
                </div>
            </div>
        </div>
    );

    const renderMainDashboard = () => (
        <div className="hacker-container fade-in">
            <header className="mb-3">
                <h1 className="mb-1" style={{
                    color: 'var(--hacker-text-accent)',
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    textShadow: '0 0 10px var(--hacker-text-accent)',
                    letterSpacing: '0.08em',
                    lineHeight: '1.2'
                }}>
                    MXStatus
                </h1>
                <p className="mb-0" style={{
                    color: 'var(--hacker-text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    letterSpacing: '0.015em'
                }}>
                    Last updated: {new Date().toLocaleString(LOCALE_CONFIG.locale, LOCALE_CONFIG.options)}
                </p>
            </header>

            {renderControlCenter()}

            <hr style={{ borderColor: 'var(--hacker-border)', margin: '1.5rem 0' }} />

            {error ? (
                <ErrorMessage error={error} onRetry={getData} />
            ) : (
                <>
                    <div className="servers-grid">
                        {
                            filteredMachines.map((data, index) => {
                                return <MachineCard data={data} key={data.machine_id || index} onHide={() => hideMachine(data.machine_id)} />
                            })
                        }
                    </div>

                    {filteredMachines.length === 0 && dataSnapshot.length === 0 && (
                        <div className="hacker-card" style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: 'var(--hacker-text-secondary)'
                        }}>
                            <p style={{
                                margin: '0',
                                fontSize: '1rem',
                                fontWeight: '600',
                                lineHeight: '1.5',
                                letterSpacing: '0.015em'
                            }}>
                                No data available. Please check your view key or try refreshing.
                            </p>
                        </div>
                    )}

                    {filteredMachines.length === 0 && dataSnapshot.length > 0 && (
                        <div className="hacker-card" style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: 'var(--hacker-text-secondary)'
                        }}>
                            <p style={{
                                margin: '0',
                                fontSize: '1rem',
                                fontWeight: '600',
                                lineHeight: '1.5',
                                letterSpacing: '0.015em'
                            }}>
                                No machines to show.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    return (
        <>
            {!showContent ? (
                <LoadingAnimation />
            ) : viewKey === "" ? (
                renderWelcomePage()
            ) : (
                renderMainDashboard()
            )}
        </>
    )
}

export default PageMain

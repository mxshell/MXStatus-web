import React from 'react'
import PropTypes from 'prop-types'

const GPU = props => {
    return (
        <div className="my-2 px-2 py-2 text-info card bg-dark">
            <p className="py-0 mb-1 card-header text-warning">
                <span className="badge fw-light text-warning">GPU: </span>
                <span className="badge p-1 bg-secondary text-dark align-middle ">{props.data.index}</span> 
                {/* <span className="badge fw-light text-warning"> Model:</span> */}
                <span className="badge fw-light text-warning">{props.data.gpu_name}</span>
            </p>
            <div className="card-body pb-0 pt-2">
                <p className="mb-1">Core Util: <span className="badge fw-light fs-6">{props.data.gpu_usage}</span> Core Temp: <span className="badge fw-light fs-6">{props.data.temperature}</span></p>
                <p className="mb-1">
                    Memory Util: <span className="badge fw-light fs-6">{props.data.memory_usage}</span>
                    (free: <span className="badge fw-light fs-6">{props.data.memory_free}</span> | total: <span className="badge fw-light fs-6">{props.data.memory_total}</span>)
                </p>
            </div>
            
        </div>
    )
}

GPU.propTypes = {
    "data": PropTypes.object
}

GPU.defaultProps = {
    "data": {
        "index": "x",
        "gpu_name": "GeForce RTX xxxx xx",
        "gpu_usage": "xx%",
        "temperature": "xxx°C",
        "memory_total": "xxx GiB",
        "memory_free": "xxx GiB",
        "memory_usage": "xxx%",
    }
}

export default GPU

import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import IP from './IP'
import GPU from './GPU'
import UsersLine from './UsersLine'

const Workstation = props => {

    const getPlatformVersion = () => {
        let v = props.data.platform_version

        if (typeof v === 'string' || v instanceof String) {
            return props.data.platform_version.substring(4, 18)
        } else {
            return ""
        }

    }

    const getTimestamp = () => {
        let v = props.data.created_at
        let options = {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}

        if (typeof v === 'string' || v instanceof String) {
            let d = new Date(v)
            return d.toLocaleTimeString("en-GB", options)
        } else {
            return "N.A."
        }
    }

    const isOnline = () => {
        let v = props.data.created_at
        let now = new Date()

        if (typeof v === 'string' || v instanceof String) {
            let d = new Date(v)
            let i = now - d
            // 5 Minutes = 300000 Milliseconds
            if (i <= 300000){
                // console.log("is online")
                return true
            }
        }

        return false
    }

    const [showDetails, SetShowDetails] = useState(false)
    const handleShowDetails = () => {
        SetShowDetails((state) => {
            if (state){
                return false
            } else {
                return true
            }
        })
    }


    return (
        <div className={isOnline()?"text-success":"text-secondary"} style={{fontFamily: "Source Code Pro"}}>
            
            <p className="mt-2 mb-1">
                {/* <span className="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"></span> */}
                <span className="fs-3">{props.data.name} </span>
                <span className="p-1 m-1 align-middle  badge bg-secondary text-dark user-select-all">{props.data.hostname}</span> 
                {
                   isOnline()? 
                   <span className="p-1 m-1 align-middle badge bg-success text-dark user-select-none">online</span>
                   :
                   <span className="p-1 m-1 align-middle badge bg-danger user-select-none">offline</span>
                }
                <span className="p-1 m-1 align-middle badge btn btn-outline-secondary text-light fw-light user-select-none" onClick={handleShowDetails}>details</span>
                
            </p> 
            {
                showDetails?
                <>
                <p className="mb-1">Status Updated at: <span className="badge fw-light fs-6">{getTimestamp()}</span></p>
                <p className="mb-1">Architecture: <span className="badge fw-light fs-6">{props.data.architecture}</span> Platform: <span className="badge fw-light fs-6">{props.data.platform} ({getPlatformVersion()})</span></p>
                <p className="mb-1">Public IP: <span className="badge fw-light fs-6">{props.data.public_ip}</span> MAC Address: <span className="badge fw-light fs-6">{props.data.mac_address}</span></p>
                <IP data={props.data.ipv4s} />
                <UsersLine users_info={props.data.users_info} />
                </>:null
            }
            

            {/* <hr className="" style={{maxWidth: "50%"}}/> */}

            <p className="mb-1">CPU Util: <span className="badge fw-light fs-6">{props.data.cpu_usage}</span></p>
            <p className="mb-1">RAM Util: <span className="badge fw-light fs-6">{props.data.ram_usage}</span>
                (free:<span className="badge fw-light fs-6">{props.data.ram_available}</span>|
                total:<span className="badge fw-light fs-6">{props.data.ram_installed}</span>)
            </p> 

            {/* <hr className="" style={{maxWidth: "50%"}}/> */}

            

            {props.data.gpu_status.map((gpu_data) => <GPU key={gpu_data.index} data={gpu_data}/>)}

            <hr className="mt-4 text-white"/>

        </div>
    )
}

Workstation.propTypes = {
    "data": PropTypes.object,
}

Workstation.defaultProps = {
    "data": {
        "gpu_status": []
    }
}

export default Workstation

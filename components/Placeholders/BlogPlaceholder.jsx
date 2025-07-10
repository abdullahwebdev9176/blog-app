'use client'

import React from 'react'


const skeletonLoader = () => {
    
    return (
        <div className="row justify-content-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-md-4 mb-4" key={i}>
                    <div className="card" style={{ minHeight: 420, borderRadius: 16, overflow: 'hidden' }}>
                        <div className="placeholder-glow" style={{height: 180, background: '#e0e0e0'}}></div>
                        <div className="card-body">
                            <span className="placeholder col-4 mb-2 d-block" style={{height: 18}}></span>
                            <span className="placeholder col-8 mb-2 d-block" style={{height: 22}}></span>
                            <span className="placeholder col-10 mb-2 d-block" style={{height: 16}}></span>
                            <span className="placeholder col-7 mb-2 d-block" style={{height: 16}}></span>
                            <span className="placeholder col-6 mb-2 d-block" style={{height: 16}}></span>
                            <span className="placeholder col-5 mb-2 d-block" style={{height: 16}}></span>
                            <span className="placeholder col-4 mb-2 d-block" style={{height: 16}}></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default skeletonLoader
import React from 'react'

const SectionHeader = ({title,subtitle}) => {
  return (
    <div>
        <div className="text-center my-5">
            <h2 className="fw-bold">{title}</h2>
            {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
    </div>
  )
}

export default SectionHeader

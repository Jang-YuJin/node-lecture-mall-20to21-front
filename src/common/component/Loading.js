import React from 'react'
import "./Loading.style.css";

const Loading = ({ message = "강의를 불러오는 중이에요" }) => {
  return (
    <div className="cs-loading">
      <div className="cs-loading-spinner" />
      <p className="cs-loading-text">{message}</p>
    </div>
  )
}

export default Loading

import React from 'react'
import '../style/BannerCard.style.css'
import { Button } from 'react-bootstrap'

const BannerCard = ({ data, deleteItem, openEditForm }) => {
  return (
    <div className="banner-table-wrapper">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={item._id} className="banner-row">
            {/* 썸네일 */}
            <div className="banner-img">
              <img src={item.img} alt={item.name} />
            </div>

            {/* 정보 */}
            <div className="banner-info">
              <div className={`banner-post ${item.postYn ? 'on' : 'off'}`}>
                {item.postYn ? '게시 중' : '미게시'}
              </div>
            </div>

            {/* 액션 */}
            <div className="banner-actions">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => openEditForm(item)}
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => deleteItem(item)}
              >
                삭제
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">등록된 배너가 없습니다 🍪</div>
      )}
    </div>
  )
}

export default BannerCard

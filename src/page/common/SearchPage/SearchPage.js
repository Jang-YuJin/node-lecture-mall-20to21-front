import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ProductCard from '../LandingPage/components/ProductCard'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getLectureList } from '../../../features/lecture/lectureSlice';
import Loading from '../../../common/component/Loading';

const SearchPage = () => {
  const dispatch = useDispatch();
  const { lectureList, loading } = useSelector((state) => state.lecture);
  const [query] = useSearchParams();
  const name = query.get("name");
  useEffect(() => {
    dispatch(
      getLectureList({
        name,
      })
    );
  }, [query]);

  if(loading){
    return(
      <Container>
        <Loading message="강의를 불러오는 중이에요"/>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        {lectureList.length > 0 ? (
          lectureList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <Col md={12}>
            <div className="empty-lecture">
              <div className="empty-lecture-icon">📚</div>

              {name ? (
                <>
                  <h3 className="empty-lecture-title">
                    “{name}”에 대한 강의를 찾지 못했어요
                  </h3>
                  <p className="empty-lecture-desc">
                    다른 키워드로 검색해보거나, 곧 추가될 강의를 기대해주세요!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="empty-lecture-title">
                    아직 등록된 강의가 없습니다
                  </h3>
                  <p className="empty-lecture-desc">
                    첫 번째 강의가 곧 업로드될 예정이에요 🚀
                  </p>
                </>
              )}
            </div>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default SearchPage

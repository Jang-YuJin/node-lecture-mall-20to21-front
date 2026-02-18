import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMainLectureList } from "../../../features/lecture/lectureSlice";
import Loading from "../../../common/component/Loading";
import CategorySection from "./components/CategorySection";
import MainBanner from "./components/MainBanner";
import { getMainBanners } from "../../../features/mainBanner/mainBannerSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { webLecture, aiLecture, dbLecture, devLecture, javaLecture, springLecture, loading: lectureLoading } = useSelector((state) => state.lecture);
  const { banners, loading: bannerLoading } = useSelector((state) => state.mainBanner);

  useEffect(() => {
    dispatch(getMainLectureList());
    dispatch(getMainBanners({postYn: true}));
  }, []);

  console.log('webLecture: ', webLecture);

  if(lectureLoading || bannerLoading){
    return(
      <Container>
        <Loading message="데이터를 불러오는 중이에요"/>
      </Container>
    )
  }

  return (
    <>
      <MainBanner banners={banners} />

      {webLecture && 
      <CategorySection
        title="🍪 웹 개발, 지금 가장 핫한 코드 스낵"
        items={webLecture}
      />}
      {dbLecture &&
      <CategorySection
        title="🗄️ 데이터 다루는 감각, DB 코드 스낵"
        items={dbLecture}
      />}
      {aiLecture &&
      <CategorySection
        title="🤖 요즘 대세 AI, 한 입에 배우는 코드 스낵"
        items={aiLecture}
      />}
      {devLecture &&
      <CategorySection
        title="⚙️ 배포부터 자동화까지, 데브옵스 스낵"
        items={devLecture}
      />}
      {javaLecture &&
      <CategorySection
        title="☕ 자바는 기본이지, 필수 코드 스낵"
        items={javaLecture}
      />}
      {springLecture &&
      <CategorySection
        title="🌱 스프링으로 만드는 탄탄한 백엔드"
        items={springLecture}
      />}
    </>
  );
};

export default LandingPage;

import { Carousel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MainBanner.style.css";

const MainBanner = ({banners}) => {
  const navigate = useNavigate();

  return (
    <Carousel className="cs-main-banner" fade interval={4000} controls={false}>
      {banners?.length > 0 ? (
        banners.map((banner) => (
          <Carousel.Item key={banner._id}>
            <div
              className="banner-slide"
              style={{ backgroundImage: `url(${banner.img})` }}
            >
            </div>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <div className="banner-slide banner-empty">
            <div className="banner-content center">
              <div className="banner-logo-box">
                <span className="banner-logo-emoji">🍪</span>
                <div className="banner-logo-text">
                  <strong>CodeSnack</strong>
                  <div>개발 지식을 한 입에</div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      )}
    </Carousel>
  );
};

export default MainBanner;

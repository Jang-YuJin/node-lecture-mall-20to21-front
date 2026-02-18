import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Sidebar.style.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  if (!user) {
    return null;
  }

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link to="/" className="sidebar-logo">
          <div className="logo-box">
            <span className="logo-emoji">🍪</span>
            <div className="logo-text">
              <strong>CodeSnack</strong>
            </div>
          </div>
        </Link>
        {user.lvl === 'admin' ? 
        <div>
          <div className="sidebar-title">관리자 센터</div>
          <ul className="sidebar-area">
            <li
              className={`sidebar-item ${isActive('/admin/sellerApproval') ? 'active' : ''}`}
              onClick={() => handleSelectMenu("/admin/sellerApproval?page=1")}
            >
              지식제공자 회원 승인
            </li>
            <li
              className={`sidebar-item ${isActive('/admin/statistics') ? 'active' : ''}`}
              onClick={() => handleSelectMenu("/admin/statistics?page=1")}
            >
              강의 통계
            </li>
            <li
              className={`sidebar-item ${isActive('/admin/banner') ? 'active' : ''}`}
              onClick={() => handleSelectMenu("/admin/banner?page=1")}
            >
              배너 등록
            </li>
          </ul>
        </div> :
        <div>
          <div className="sidebar-title">지식 제공자 센터</div>
          <ul className="sidebar-area">
            <li
              className={`sidebar-item ${isActive('/seller/product') ? 'active' : ''}`}
              onClick={() => handleSelectMenu(`/seller/product?userId=${user._id}&page=1`)}
            >
              강의 관리
            </li>
            <li
              className={`sidebar-item ${isActive('/seller/order') ? 'active' : ''}`}
              onClick={() => handleSelectMenu("/seller/order?page=1")}
            >
              교재 주문
            </li>
          </ul>
        </div>}

      </div>
    );
  };
  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <Link to="/" className="mobile-logo">
            <span className="logo-emoji">🍪</span>
            <strong>CodeSnack</strong>
          </Link>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
            onHide={() => setShow(false)}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;

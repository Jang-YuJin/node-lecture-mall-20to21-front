import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../../utils/CloudinaryUploadWidget";
import "../style/NewItemDialog.style.css";
import {
  clearError,
  createMainBanner,
  editMainBanner
} from "../../../../features/mainBanner/mainBannerSlice";

const RequiredLabel = ({ children }) => (
  <span>
    {children} <span className="text-danger">*</span>
  </span>
);

const InitialFormData = {
  img: '',
  postYn: true
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedBanner } = useSelector(
    (state) => state.mainBanner
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedBanner
  );
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedBanner);
      } else {
        setFormData({ ...InitialFormData });
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    //모든걸 초기화시키고;
    setFormData({ ...InitialFormData });
    setImgError(false);
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 배너 이미지 업로드 안하면 에러
    if (!formData.img) {
      setImgError(true);
    }
    if (imgError) {
      return;
    }

    if (mode === "new") {
      //새 배너 만들기
      dispatch(createMainBanner({...formData}));
    } else {
      // 배너 수정하기
      dispatch(editMainBanner({...formData, id: selectedBanner._id}));
    }
  };

  const handleChange = (event) => {
    //form에 데이터 넣어주기
    const {name, value} = event.target;
    setFormData({...formData, [name]: value});
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({...formData, img: url});
    setImgError(false);
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "메인 배너 등록" : "메인 배너 수정"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="cs-form">
          {/* 배너 이미지 */}
          <div className="cs-section">
            <div className="cs-section-title">
              <RequiredLabel>배너 이미지</RequiredLabel>
            </div>

            <CloudinaryUploadWidget uploadImage={uploadImage} />

            {imgError && (
              <div className="invalid-feedback d-block">
                배너 이미지를 업로드해주세요.
              </div>
            )}

            {formData.img && (
              <img
                src={formData.img}
                alt="banner preview"
                className="cs-banner-preview"
              />
            )}
          </div>

          {/* 게시 여부 */}
          <div className="cs-section">
            <div className="cs-section-title">
              <RequiredLabel>게시 여부</RequiredLabel>
            </div>

            <div className="cs-radio-group">
              <Form.Check
                type="radio"
                id="post-true"
                label="게시"
                name="postYn"
                checked={formData.postYn === true}
                onChange={() =>
                  setFormData({ ...formData, postYn: true })
                }
              />
              <Form.Check
                type="radio"
                id="post-false"
                label="미게시"
                name="postYn"
                checked={formData.postYn === false}
                onChange={() =>
                  setFormData({ ...formData, postYn: false })
                }
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="cs-modal-actions">
            <Button
              variant="outline-secondary" className='cancel-btn'
              onClick={handleClose}
            >
              취소
            </Button>
            <Button type="submit" className="cs-submit-btn">
              {mode === "new" ? "배너 등록" : "배너 수정"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewItemDialog;

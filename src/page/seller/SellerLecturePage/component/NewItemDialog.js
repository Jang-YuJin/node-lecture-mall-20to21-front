import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../../constants/product.constants";
import "../style/sellerLecture.style.css";
import {
  clearError,
  createLecture,
  editLecture,
  getLectureSno,
} from "../../../../features/lecture/lectureSlice";

const RequiredLabel = ({ children }) => (
  <span>
    {children} <span className="text-danger">*</span>
  </span>
);

const InitialFormData = {
  sno: "",
  name: "",
  img: "",
  ctgry: [],
  desc: "",
  price: 0,
  txtbkStck: {},
  fileTxtbk: [],
  status: "active",
  items: [],
  dscnt: false,
  dscntRt: 0
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedLecture, lectureSno } = useSelector(
    (state) => state.lecture
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedLecture
  );
  const [lectureVideo, setLectureVideo] = useState([]);
  const [bindCnt, setBindCnt] = useState(0);
  const [bookCnt, setBookCnt] = useState(0);
  const [fileTxtbk, setFileTxtbk] = useState([]);
  const dispatch = useDispatch();
  const [lectureVideoError, setLectureVideoError] = useState(false);
  const [fileTxtbkError, setFileTxtbkError] = useState(false);
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
        setFormData(selectedLecture);
        // 배열객체형태로 온 강의영상을  다시 배열로 세팅해주기
        const videoArray = selectedLecture.items.map((video) => [
          video.title,
          video.url
        ]);
        setLectureVideo(videoArray);
        setBindCnt(selectedLecture.txtbkStck.bind);
        setBookCnt(selectedLecture.txtbkStck.book);
        setFileTxtbk(
          Array.isArray(selectedLecture.fileTxtbk)
            ? selectedLecture.fileTxtbk.map((v) => String(v).toUpperCase())
            : []
        );
      } else {
        dispatch(getLectureSno());
        setFormData({ ...InitialFormData });
        setLectureVideo([]);
        setFileTxtbk([]);
        setBindCnt(0);
        setBookCnt(0);
      }
    }
  }, [showDialog]);

  useEffect(() => {
    if (mode === "new" && lectureSno) {
      setFormData((prev) => ({
        ...prev,
        sno: lectureSno,
      }));
    }
  }, [lectureSno]);

  useEffect(() => {
    if (
      lectureVideo.length > 0 &&
      lectureVideo.every((v) => v[0] && v[1])
    ) {
      setLectureVideoError(false);
    }
  }, [lectureVideo]);

  const handleClose = () => {
    //모든걸 초기화시키고;
    setFormData({ ...InitialFormData });
    setLectureVideo([]);
    setFileTxtbk([]);
    setBindCnt(0);
    setBookCnt(0);
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isLectureVideoValid = lectureVideo.length > 0 && lectureVideo.every(v => v[0] && v[1]);
    // 강의 썸네일 업로드 안하면 에러
    if (!formData.img) {
      setImgError(true);
    }
    // 강의 영상 추가 안하거나 추가했는데 제목과 url이 빈칸인 경우 에러
    if (!isLectureVideoValid) {
      setLectureVideoError(true);
    }
    // 파일 교재 체크 아무것도 안하면 에러
    if (fileTxtbk.length === 0) {
      setFileTxtbkError(true);
    }

    if (imgError || lectureVideoError || fileTxtbkError) {
      return;
    }

    // 강의 영상을 배열에서 객체 배열로 바꿔주기
    const totalLectureVideo = lectureVideo.map(([title, url]) => ({
      title,
      url,
    }));
    // 실물 교재 객체로 바꿔주기
    const realTxtbkStck = {bind: bindCnt, book: bookCnt};
    if (mode === "new") {
      //새 상품 만들기
      dispatch(createLecture({...formData, txtbkStck: realTxtbkStck, fileTxtbk: fileTxtbk, items: totalLectureVideo}));
    } else {
      // 상품 수정하기
      dispatch(editLecture({...formData, txtbkStck: realTxtbkStck, fileTxtbk: fileTxtbk, items: totalLectureVideo, id: selectedLecture._id}));
    }
  };

  const handleChange = (event) => {
    //form에 데이터 넣어주기
    const {name, value} = event.target;
    setFormData({...formData, [name]: value});
  };

  const addLectureVideo = () => {
    //강의영상타입 추가시 배열에 새 배열 추가
    setLectureVideo([...lectureVideo, []]);
  };

  const deleteLectureVideo = (idx) => {
    //강의 영상 삭제하기
    const newLectureVideo = lectureVideo.filter((item, index) => index != idx);
    setLectureVideo(newLectureVideo);
  };

  const handleLectureVideoTitleChange = (value, index) => {
    //강의 영상 제목 변환하기
    const newLectureVideo = [...lectureVideo];
    newLectureVideo[index][0] = value;
    setLectureVideo(newLectureVideo);
  };

  const handleLectureVideoUrlChange = (value, index) => {
    //강의 영상 URL 변환하기
    const newLectureVideo = [...lectureVideo];
    newLectureVideo[index][1] = value;
    setLectureVideo(newLectureVideo);
  };

  const handleFileTxbkChange = (e) => {
    const {value, checked} = e.target;
    if(checked){
      setFileTxtbk([...fileTxtbk, value]);
      setFileTxtbkError(false);
    } else {
      setFileTxtbk(fileTxtbk.filter((v) => v !== value));
    }
  }

  const handleDscntChange = (value) => {
    setFormData({ ...formData, dscnt: value, dscntRt: 0 });
  };

  const onHandleCategory = (event) => {
    if (formData.ctgry.includes(event.target.value)) {
      const newCategory = formData.ctgry.filter(
        (item) => item !== event.target.value
      );
      setFormData({
        ...formData,
        ctgry: [...newCategory],
      });
    } else {
      setFormData({
        ...formData,
        ctgry: [...formData.ctgry, event.target.value],
      });
    }
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({...formData, img: url});
    setImgError(false);
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>강의 추가</Modal.Title>
        ) : (
          <Modal.Title>강의 수정</Modal.Title>
        )}
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <div className="cs-section">
          <div className="cs-section-title">📌 강의 기본 정보</div>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label>강의 ID</Form.Label>
              <Form.Control name="sno" readOnly value={formData.sno} />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>
                <RequiredLabel>강의명</RequiredLabel>
              </Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: React 완전 정복"
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>
                <RequiredLabel>강의 설명</RequiredLabel>
              </Form.Label>
              <Form.Control
                name="desc"
                as="textarea"
                rows={4}
                placeholder="강의에 대한 간단한 소개를 입력해주세요"
                value={formData.desc}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Label>
            <RequiredLabel>강의 썸네일</RequiredLabel>
          </Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          {imgError && (
            <div className="invalid-feedback d-block">
              강의 썸네일을 업로드 해주세요.
            </div>
          )}

          {formData.img && <img
            id="uploadedimage"
            src={formData.img}
            className="upload-image mt-2"
            alt="uploadedimage"
          ></img>}
        </div>

        <div className="cs-section">
          <div className="cs-section-title">
            🎬 강의 영상 <span className="text-danger">*</span>
            <Button size="sm" variant="outline-primary" onClick={addLectureVideo}>
              + 영상 추가
            </Button>
          </div>
          {lectureVideoError && (
            <div className="invalid-feedback d-block">
              강의 영상을 최소 1개 이상 추가해주세요.
            </div>
          )}
          {lectureVideo.map((item, index) => (
            <div
              key={index}
              className="lecture-video-card"
            >
              <Row className="g-2">
                <Col xs={4} md={4}>
                  <Form.Control
                    placeholder="영상 제목 *"
                    value={item[0]}
                    onChange={(e) =>
                      handleLectureVideoTitleChange(e.target.value, index)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={6}>
                  <Form.Control
                    placeholder="영상 URL *"
                    value={item[1]}
                    onChange={(e) =>
                      handleLectureVideoUrlChange(e.target.value, index)
                    }
                    required
                  />
                </Col>
                <Col xs={2} md={2} className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteLectureVideo(index)}
                  >
                    삭제
                  </Button>
                </Col>
              </Row>
            </div>
          ))}


        </div>

        <div className="cs-section">
          <div className="cs-section-title">📚 교재 제공</div>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label>제본 교재</Form.Label>
              <InputGroup>
                <Form.Control name="bind" type="number" min={0} value={bindCnt} onChange={(e) => setBindCnt(e.target.value)} />
                <InputGroup.Text>개</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>책</Form.Label>
              <InputGroup>
                <Form.Control name="book" type="number" min={0} value={bookCnt} onChange={(e) => setBookCnt(e.target.value)} />
                <InputGroup.Text>개</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          <Form.Label>
            <RequiredLabel>파일 교재</RequiredLabel>
          </Form.Label>
          <Form.Group className="d-flex gap-3">
            <div className="d-flex gap-3">
              {["PPT", "PDF", "WORD"].map((type) => (
                <Form.Check
                  key={type}
                  name="fileTxtbk"
                  type="checkbox"
                  value={type}
                  label={type}
                  onChange={handleFileTxbkChange}
                  isInvalid={fileTxtbkError}
                  checked={fileTxtbk.includes(type)}
                />
              ))}
            </div>

            {fileTxtbkError && (
              <div className="invalid-feedback d-block">
                파일 교재를 최소 1개 이상 선택해주세요.
              </div>
            )}
          </Form.Group>
        </div>

        <div className="cs-section">
          <div className="cs-section-title">💰 가격 및 할인</div>

          <Row>
            <Col xs={12} md={5}>
              <InputGroup>
                <Form.Control name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" min={1} required/>
                <InputGroup.Text>원</InputGroup.Text>
              </InputGroup>
            </Col>

            <Col xs={12} md={3}>
              <Form.Check
                type="switch"
                name="dscnt"
                label="할인 강의"
                checked={formData.dscnt}
                onChange={(e) => handleDscntChange(e.target.checked)}
              />
            </Col>

            <Col xs={12} md={4}>
              <InputGroup id="dscnt">
                <Form.Control
                  name="dscntRt"
                  type="number"
                  disabled={!formData.dscnt}
                  value={formData.dscntRt}
                  onChange={handleChange}
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className="cs-section">
          <div className="cs-section-title">⚙️ 강의 설정</div>

          <Row>
            {/* 카테고리 */}
            <Col xs={12} md={6}>
              <Form.Label>
                <RequiredLabel>카테고리</RequiredLabel>
                <span className="text-muted ms-2" style={{ fontSize: "13px" }}>
                  (복수 선택 가능)
                </span>
              </Form.Label>

              <Form.Select
                name="ctgry"
                multiple
                value={formData.ctgry}
                onChange={onHandleCategory}
                style={{ height: "140px" }}
                required
              >
                {CATEGORY.map((item, idx) => (
                  <option key={idx} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* 상태 */}
            <Col xs={12} md={6}>
              <Form.Label>
                강의 상태
                <span className="text-muted ms-2" style={{ fontSize: "13px" }}>
                  (노출 여부)
                </span>
              </Form.Label>

              <Form.Select
                name='status'
                value={formData.status}
                onChange={handleChange}
                required
              >
                {STATUS.map((item, idx) => (
                  <option key={idx} value={item.toLowerCase()}>
                    {item === "active" ? "판매중" : "비공개"}
                  </option>
                ))}
              </Form.Select>

              <small className="text-muted">
                비공개 설정 시 사용자에게 노출되지 않습니다
              </small>
            </Col>
          </Row>
        </div>

        <div className="text-muted mb-2" style={{ fontSize: "13px" }}>
          <span className="text-danger">*</span> 표시는 필수 입력 항목입니다
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button className='cancel-btn' variant="outline-secondary" onClick={handleClose}>
            취소
          </Button>
          <Button className="cs-submit-btn" type="submit">
            {mode === "new" ? "강의 등록하기" : "강의 수정하기"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewItemDialog;

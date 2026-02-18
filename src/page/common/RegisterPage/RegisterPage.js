import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./style/register.style.css";

import { registerUser } from "../../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    lvl: 'customer',
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError } = useSelector((state) => state.user);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, lvl, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, lvl, navigate }));
  };

  const handleChange = (event) => {
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}
      <Form className="register-form" onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label className="register-label">이메일</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요."
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="register-label">이름</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="이름을 입력해주세요."
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="register-label">비밀번호</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="register-label">비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요."
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="register-label">
            가입 유형
          </Form.Label>

          <Form.Check
            type="radio"
            label="수강생 (강의를 듣고 싶어요)"
            name="lvl"
            id="customer"
            checked={formData.lvl === "customer"}
            onChange={() => setFormData({ ...formData, lvl: "customer" })}
          />

          <Form.Check
            type="radio"
            label="지식 공유자 (강의를 판매하고 싶어요)"
            name="lvl"
            id="seller"
            checked={formData.lvl === "seller"}
            onChange={() => setFormData({ ...formData, lvl: "seller" })}
          />

          <p className="role-hint">
            ※ 지식 공유자는 관리자 승인 후 강의를 등록할 수 있어요
          </p>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
        </Form.Group>
        <Button className="register-btn" type="submit">
          CodeSnack 시작하기
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;

import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./ConfirmDeleteModal.style.css";

const ConfirmDeleteModal = ({ show, onClose, onConfirm, message }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="cs-confirm-modal"
    >
      <Modal.Body className="text-center p-4">
        <div className="cs-warning-icon">⚠️</div>

        <h5 className="mt-3">{message}</h5>
        <p className="cs-confirm-desc">
          삭제 후 복구할 수 없습니다.
        </p>

        <div className="cs-confirm-actions">
          <Button
            variant="outline-secondary"
            className="cs-cancel-btn"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="danger"
            className="cs-delete-btn"
            onClick={onConfirm}
          >
            삭제
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;
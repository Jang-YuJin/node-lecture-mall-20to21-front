import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../../utils/number";

const OrderReceipt = ({cartList, totalPrice}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">🧾 주문 내역</h3>
      <ul className="receipt-list">
        {cartList.length > 0 && cartList.map((item, index) => (
        <li className="receipt-item" key={index}>
          <span>{item.lectureId.name}</span>
          <span>₩ {currencyFormat(item.lectureId.price + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1))}</span>
        </li>
        ))}
        {/* <li className="receipt-item">
          <span>강의 합계</span>
          <span>₩ 45,000</span>
        </li> */}
      </ul>

      <div className="receipt-total">
        <span>Total</span>
        <strong>₩ {currencyFormat(totalPrice)}</strong>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          결제 계속하기 →
        </Button>
      )}

      <p className="receipt-desc">
        결제 단계에서 최종 금액 및 배송비가 확정됩니다.<br />
        30일 반품 가능 🍪
      </p>
    </div>
  );
};

export default OrderReceipt;

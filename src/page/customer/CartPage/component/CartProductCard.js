import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../../utils/number";
const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleChange = (id, value, key) => {
  };

  const deleteCart = (id) => {
  };
  return (
    <div className="cart-item-card">
      <Row className="g-3 align-items-center">
        <Col md={3} xs={12}>
          <img src={item.lectureId.img} width={112} alt={item.lectureId.name} />
        </Col>
        <Col md={9} xs={12}>
          <div className="cart-item-header">
            <h3>{item.lectureId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className="cart-item-price">
            <strong>₩ {currencyFormat(item.lectureId.price)}</strong>
          </div>

          <div className="cart-item-option">
            📁 파일 교재: 
            <Form.Select
              onChange={(event) =>
                handleChange(item._id, event.target.value, 'fileTxtbk')
              }
              required
              defaultValue={item.fileTxtbk}
              className="qty-dropdown"
            >
              {item.lectureId.fileTxtbk.map((item, i) => (
                <option key={i + 1} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="cart-item-option">
            📚 실물 교재: 
            <Form.Select
              onChange={(event) =>
                handleChange(item._id, event.target.value, 'txtbk')
              }
              required
              defaultValue={item.txtbk}
              className="qty-dropdown"
            >
              {Object.keys(item.lectureId.txtbkStck).map((bk, i) => (
                <option key={i + 1} value={bk}>
                  {bk === 'bind' ? '제본(스프링) 교재' : '책 교재'} (₩ {currencyFormat(Number(item.lectureId.txtbkPrice[bk]))})
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="cart-item-option">
            📦 실물교재 수량:
            <Form.Select
              onChange={(event) =>
                handleChange(item._id, event.target.value, 'qty')
              }
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="cart-item-option">
            총 가격: 
            <strong>₩ {currencyFormat(item.lectureId.price + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1))}</strong>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;

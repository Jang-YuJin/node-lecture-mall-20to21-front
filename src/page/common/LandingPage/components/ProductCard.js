import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/lecture/${id}`);
  };
  return (
    <div
      className="lecture-card"
      onClick={() => showProduct(item._id)}
    >
      <div className="thumbnail-wrapper">
        {item.dscnt && (
          <div className="discount-badge">
            {item.dscntRt}% 할인
          </div>
        )}
        <img src={item?.img} alt={item?.name} />
      </div>

      <div className="lecture-info">
        <h3 className="lecture-title">{item?.name}</h3>

        <div className="price-area">
          {item.dscnt ? (
            <>
              <span className="sale-price">
                ₩ {currencyFormat(item.price * (1 - Number(item.dscntRt) * 0.01))}
              </span>
              <span className="origin-price">
                ₩ {currencyFormat(item.price)}
              </span>
            </>
          ) : (
            <span className="normal-price">
              ₩ {currencyFormat(item.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

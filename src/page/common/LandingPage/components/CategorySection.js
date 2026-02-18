import { Row, Col } from "react-bootstrap";
import './CategorySection.style.css';
import ProductCard from "./ProductCard";

const CategorySection = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="cs-section">
      <h3 className="cs-section-title">{title}</h3>
      <Row>
        {items.map((item) => (
          <Col md={3} sm={12} key={item._id}>
            <ProductCard item={item} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default CategorySection;

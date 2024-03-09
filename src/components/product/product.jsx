import { Link } from 'react-router-dom';
import './product.css';
import treasures from '../../images/treasures.png';

function Product({ theProduct, prescientPathname }) {
	const {
		product = 'none',
		id = 'none',
		brand = 'none',
		price = 'none',
	} = theProduct;
	return (
		<article className="product">
			<img src={treasures} alt="сундук со сказками" className="product__img" />
			<div className="product__text-box">
				<h3 className="product__title">{product}</h3>
				<span>id: {id}</span>
				{brand && <span>Бренд: {brand}</span>}
				<span>Цена: {price}</span>
			</div>
			<Link to={prescientPathname} className="product__link">
				Назад
			</Link>
		</article>
	);
}

export default Product;

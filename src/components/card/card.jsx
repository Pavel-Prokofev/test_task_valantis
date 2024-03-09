import { Link } from 'react-router-dom';

import './card.css';
import treasures from '../../images/treasures.png';

function Card({ item = {} }) {
	const {
		product = 'none',
		id = 'none',
		brand = 'none',
		price = 'none',
	} = item;

	return (
		<li className="card">
			<Link to={`/${id}`} className="card__link">
				<img src={treasures} alt="сундук со сказками" className="card__img" />
				<div className="card__text-box">
					<h3 className="card__title">{product}</h3>
					<span>id: {id}</span>
					{brand && <span>Бренд: {brand}</span>}
					<span>Цена: {price}</span>
				</div>
			</Link>
		</li>
	);
}

export default Card;

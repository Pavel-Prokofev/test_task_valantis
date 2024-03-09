import { Link } from 'react-router-dom';

import './notFound.css';

function NotFound() {
	return (
		<main className="not-found">
			<h1 className="not-found__title">404</h1>
			<p>Страница по данному запросу не обнаружена.</p>
			<Link to="/">Перейти на главную</Link>
		</main>
	);
}

export default NotFound;

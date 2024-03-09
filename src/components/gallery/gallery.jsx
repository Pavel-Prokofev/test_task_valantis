import Card from '../card/card';

import './gallery.css';

function Gallery({ actualPageList = [] }) {
	return (
		<section className="gallery" aria-label="Галерея">
			{actualPageList.length ? (
				<ul className="gallery__list">
					{actualPageList.map((item) => (
						<Card key={item.id} item={item} />
					))}
				</ul>
			) : (
				<span className="gallery__empti-text">
					По вашему запросу ничего не обнаружено
				</span>
			)}
		</section>
	);
}

export default Gallery;

import Card from '../card/card';

import './gallery.css';

function Gallery({ actualPageList = [] }) {
	return (
		<section className="gallery" aria-label="Галерея">
			<ul className="gallery__list">
				{actualPageList.map((item) => (
					<Card key={item.id} item={item} />
				))}
			</ul>
		</section>
	);
}

export default Gallery;

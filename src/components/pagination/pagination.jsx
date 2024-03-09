import React from 'react';
import { NavLink } from 'react-router-dom';

import './pagination.css';

function PaginationLi({ pageNum, lastFilterFields }) {
	return (
		<li>
			<NavLink
				to={`/${encodeURI(lastFilterFields)}/${String(pageNum)}`}
				className={({ isActive }) =>
					`${isActive ? 'pagination__link pagination__link_active' : 'pagination__link'}`
				}
			>
				{pageNum}
			</NavLink>
		</li>
	);
}

function Pagination({ isPageCount = 0, lastFilterFields, isActivePage = 1 }) {
	const [actualArrPageCount, setActualArrPageCount] = React.useState([]);

	React.useEffect(() => {
		const arrPageCount = [];
		for (let i = 0; i < isPageCount; i += 1) {
			arrPageCount[i] = i + 1;
		}
		setActualArrPageCount(arrPageCount);
	}, [isPageCount, lastFilterFields]);

	// Проверяем есть ли вообще что выводить
	if (actualArrPageCount.length) {
		return (
			<article className="pagination" aria-label="Пагинация">
				<ul className="pagination__list">
					{/* Если страниц меньше 10ти выводим весь список. */}
					{actualArrPageCount.length <= 10 ? (
						actualArrPageCount.map((pageNum) => (
							<PaginationLi
								key={pageNum}
								pageNum={pageNum}
								lastFilterFields={lastFilterFields}
							/>
						))
					) : (
						// Если станиц больше 10ти:
						<>
							{/* выводим ссылку на первую страницу */}
							<PaginationLi pageNum={1} lastFilterFields={lastFilterFields} />
							{/* если необходимо ставим многоточие */}
							{isActivePage > 4 && (
								<li>
									<span className="pagination__text">...</span>
								</li>
							)}
							{/* выводим ссылку с номером активной страницы и по 3 страницы до и после */}
							{actualArrPageCount.map(
								(pageNum) =>
									pageNum !== 1 &&
									pageNum !== actualArrPageCount.length &&
									((isActivePage - pageNum < 3 && isActivePage > pageNum) ||
										(pageNum - isActivePage < 3 && isActivePage < pageNum) ||
										isActivePage === pageNum) && (
										<PaginationLi
											key={pageNum}
											pageNum={pageNum}
											lastFilterFields={lastFilterFields}
										/>
									)
							)}
							{/* если необходимо ставим многоточие */}
							{actualArrPageCount.length - isActivePage > 3 && (
								<li>
									<span className="pagination__text">...</span>
								</li>
							)}
							{/* выводим ссылку напоследнюю страницу */}
							<PaginationLi
								pageNum={actualArrPageCount[actualArrPageCount.length - 1]}
								lastFilterFields={lastFilterFields}
							/>
						</>
					)}
				</ul>{' '}
			</article>
		);
	}
}

export default Pagination;

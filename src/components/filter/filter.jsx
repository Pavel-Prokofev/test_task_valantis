import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

import './filter.css';

function Filter({ lastFilterFields, isPageCount, isActivePage }) {
	const navigate = useNavigate();

	const [filterTypeValue, setFilterTypeValue] = React.useState('');
	const [filterParamValue, setFilterParamValue] = React.useState('');
	const [actualArrPageCount, setActualArrPageCount] = React.useState([]);

	const handleChange = (evt) => {
		if (evt.target.name === 'filter-type') {
			setFilterTypeValue(evt.target.value);
			setFilterParamValue('');
		} else if (evt.target.name === 'filter-param') {
			setFilterParamValue(evt.target.value);
		}
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		navigate(
			`/filter=${filterTypeValue}&filterparam=${filterTypeValue === 'none' ? 'none' : filterParamValue}/1`
		);
	};

	React.useEffect(() => {
		// Определяем тип фильтрации.
		const filter = lastFilterFields.split('&')[0].split('=')[1];
		// Определяем параметр фильтрации.
		const filterParam = lastFilterFields.split('&')[1].split('=')[1];
		setFilterTypeValue(filter);
		setFilterParamValue(filterParam);
	}, [lastFilterFields]);

	React.useEffect(() => {
		const arrPageCount = [];
		for (let i = 0; i < isPageCount; i += 1) {
			arrPageCount[i] = i + 1;
		}
		setActualArrPageCount(arrPageCount);
	}, [isPageCount, lastFilterFields]);

	return (
		<>
			{/* Форма фильтрации */}
			<form className="filter" onSubmit={handleSubmit}>
				<label htmlFor="filter-type" className="filter__type-lable">
					Тип&nbsp;фильтра
					<select
						name="filter-type"
						id="filter-type"
						className="filter__type"
						value={filterTypeValue}
						onChange={handleChange}
					>
						<option value="none">Всё</option>
						<option value="product">Название</option>
						<option value="brand">Брэнд</option>
						<option value="price">Цена</option>
						<option value="id">id</option>
					</select>
				</label>
				{filterTypeValue !== 'none' && (
					<label htmlFor="filter-param" className="filter__param-lable">
						Параметр&nbsp;фильтра
						<input
							name="filter-param"
							type="search"
							id="filter-param"
							className="filter__param"
							value={filterParamValue}
							onChange={handleChange}
							placeholder={
								filterTypeValue === 'price'
									? 'Введите стоимость товара'
									: filterTypeValue === 'id'
										? 'Введите id товара'
										: filterTypeValue === 'brand'
											? 'Введите бренд товара'
											: filterTypeValue === 'product'
												? 'Введите название товара'
												: ''
							}
						/>
					</label>
				)}

				<button type="submit" className="filter__submit-button">
					Поиск
				</button>
			</form>

			{/* Пагинация */}
			{actualArrPageCount.length ? (
				<ul className="page-list">
					{actualArrPageCount.length <= 10 ? (
						actualArrPageCount.map((pageNum) => (
							<li key={pageNum}>
								<NavLink
									to={`/${lastFilterFields}/${String(pageNum)}`}
									className={({ isActive }) =>
										`${isActive ? 'page-list__link page-list__link_active' : 'page-list__link'}`
									}
								>
									{pageNum}
								</NavLink>
							</li>
						))
					) : (
						<>
							<li>
								<NavLink
									to={`/${lastFilterFields}/1`}
									className={({ isActive }) =>
										`${isActive ? 'page-list__link page-list__link_active' : 'page-list__link'}`
									}
								>
									1
								</NavLink>
							</li>

							{isActivePage > 4 && (
								<li>
									<span className="page-list__link">...</span>
								</li>
							)}

							{actualArrPageCount.map(
								(pageNum) =>
									pageNum !== 1 &&
									pageNum !== actualArrPageCount.length &&
									((isActivePage - pageNum < 3 && isActivePage > pageNum) ||
										(pageNum - isActivePage < 3 && isActivePage < pageNum) ||
										isActivePage === pageNum) && (
										<li key={pageNum}>
											<NavLink
												to={`/${lastFilterFields}/${String(pageNum)}`}
												className={({ isActive }) =>
													`${isActive ? 'page-list__link page-list__link_active' : 'page-list__link'}`
												}
											>
												{pageNum}
											</NavLink>
										</li>
									)
							)}

							{actualArrPageCount.length - isActivePage > 3 && (
								<li>
									<span className="page-list__link">...</span>
								</li>
							)}

							<li>
								<NavLink
									to={`/${lastFilterFields}/${String(actualArrPageCount[actualArrPageCount.length - 1])}`}
									className={({ isActive }) =>
										`${isActive ? 'page-list__link page-list__link_active' : 'page-list__link'}`
									}
								>
									{actualArrPageCount[actualArrPageCount.length - 1]}
								</NavLink>
							</li>
						</>
					)}
				</ul>
			) : (
				<span>По вашему запросу ничего не обнаружено</span>
			)}

			<Outlet />
		</>
	);
}

export default Filter;

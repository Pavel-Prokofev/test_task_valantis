import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Pagination from '../pagination/pagination';

import './filter.css';

import SeparationPazname from '../../utils/separationPazname';

function Filter({ lastFilterFields, isPageCount, isActivePage }) {
	const navigate = useNavigate();
	const location = useLocation();

	const [filterTypeValue, setFilterTypeValue] = React.useState('');
	const [filterParamValue, setFilterParamValue] = React.useState('');

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
		const { filter, filterParam } = SeparationPazname(location);

		setFilterTypeValue(filter);
		setFilterParamValue(filterParam);
	}, [lastFilterFields]);

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

			<Pagination
				isPageCount={isPageCount}
				lastFilterFields={lastFilterFields}
				isActivePage={isActivePage}
			/>
			<Outlet />
			<Pagination
				isPageCount={isPageCount}
				lastFilterFields={lastFilterFields}
				isActivePage={isActivePage}
			/>
		</>
	);
}

export default Filter;

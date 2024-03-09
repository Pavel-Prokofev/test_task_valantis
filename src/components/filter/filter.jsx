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
	const [filterParamError, setFilterParamError] = React.useState('');
	const [filterParamValid, setFilterParamValid] = React.useState(false);

	const whitespaceStartRegex = /^\s+/;
	const whitespaceEndRegex = /\s$/;
	const priseRegex = /^\d+(\.\d*)?$/;
	const notPriseRegex = /^([\wа-яёА-ЯЁ.&]+[\wа-яёА-ЯЁ.\s&]*)$/;

	const checkValid = (evt) => {
		const { value } = evt.target;
		if (filterTypeValue !== 'none') {
			if (!evt.target.validity.valid) {
				// Сначала браузерная проверка.
				setFilterParamValid(evt.target.validity.valid);
				setFilterParamError(
					evt.target.validity.valid ? '' : evt.target.validationMessage
				);
			} else {
				// Потом кастомные начтройки.

				if (whitespaceStartRegex.test(value)) {
					setFilterParamValid(false);
					setFilterParamError('Строка не должна начинаться пробелом.');
					return;
				}

				if (whitespaceEndRegex.test(value)) {
					setFilterParamValid(false);
					setFilterParamError('Строка не должна начинаться пробелом.');
					return;
				}

				if (filterTypeValue === 'price' && !priseRegex.test(value)) {
					setFilterParamValid(false);
					setFilterParamError('Значение должно быть числом формата: n или n.n');
					return;
				}

				if (filterTypeValue !== 'price' && !notPriseRegex.test(value)) {
					setFilterParamValid(false);
					setFilterParamError(
						'Допустмые символы: а-яё, a-z, цифры, пробелы, -, _, &.'
					);
					return;
				}

				setFilterParamValid(true);
				setFilterParamError('');
			}
		}
	};

	const handleChange = (evt) => {
		const { filter, filterParam } = SeparationPazname(location);
		if (evt.target.name === 'filter-type') {
			if (evt.target.value === 'none' && filter !== 'none') {
				setFilterParamValid(true);
			} else {
				setFilterParamValid(false);
			}
			setFilterTypeValue(evt.target.value);
			setFilterParamValue('');
			setFilterParamError('');
		} else if (evt.target.name === 'filter-param') {
			if (filterParam === evt.target.value) {
				setFilterParamValid(false);
				setFilterParamError('Обновите параметр поиска');
			} else {
				checkValid(evt);
			}
			setFilterParamValue(evt.target.value);
		}
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (filterParamValid) {
			navigate(
				`/filter=${filterTypeValue}&filterparam=${filterTypeValue === 'none' ? 'none' : filterParamValue}/1`
			);
		}
	};

	React.useEffect(() => {
		const { filter, filterParam } = SeparationPazname(location);
		setFilterTypeValue(filter);
		setFilterParamValue(filterParam);
		setFilterParamError('');
		setFilterParamValid(false);
	}, [lastFilterFields]);

	return (
		<>
			{/* Форма фильтрации */}
			<form className="filter" onSubmit={handleSubmit} noValidate>
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
						<option value="brand">Бренд</option>
						<option value="price">Цена</option>
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
									: filterTypeValue === 'brand'
										? 'Введите бренд товара'
										: filterTypeValue === 'product'
											? 'Введите название товара'
											: ''
							}
							minLength="1"
							required
						/>
						<span className="filter__error">{filterParamError}</span>
					</label>
				)}
				<button
					type="submit"
					className={
						filterParamValid
							? 'filter__submit-button'
							: 'filter__submit-button filter__submit-button_disabled'
					}
				>
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

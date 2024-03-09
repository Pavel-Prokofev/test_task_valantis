import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Layout from './pages/layout/layout';
import Gallery from './components/gallery/gallery';
import Filter from './components/filter/filter';
import NotFound from './pages/notFound/notFound';
import Loader from './components/loader/loader';

import './App.css';

import ApiValantis from './utils/api/apiValantis';
import SeparationPazname from './utils/separationPazname';

function App() {
	const apiValantis = ApiValantis();

	const location = useLocation();
	const navigate = useNavigate();

	const filterRegex =
		/^(filter=(none|product|price|brand)&filterparam=([\wа-яёА-ЯЁ.\s&]+))$/;
	const priseRegex = /^\d+(\.\d*)?$/;

	const onlyFilterRegex =
		/^(\/filter=(none|product|price|brand)&filterparam=([\wа-яёА-ЯЁ.\s&]+)\/?)$/;
	const normalPathnameRegex =
		/^(\/filter=(none|product|price|brand)&filterparam=([\wа-яёА-ЯЁ.\s&]+)\/[1-9]\d*)$/;

	const [lastFilterFields, setLastFilterFields] = React.useState('');
	const actualItemsIdList = React.useRef([]);
	const isActivePage = React.useRef(0);
	const [actualPageList, setActualPageList] = React.useState([]);
	const [isNotFound, setIsNotFound] = React.useState(true);
	const [isPageCount, setIsPageCount] = React.useState(0);
	const [isLoaderOpen, setIsLoaderOpen] = React.useState(true);

	// Формируем список id которые нужно запросить с бэка для отрисовки
	const creatIdList = (pageNumber) => {
		const idList = [];
		const pageCount = Math.ceil(actualItemsIdList.current.length / 50);
		if (isPageCount !== pageCount) {
			setIsPageCount(pageCount);
		}
		if (pageCount >= pageNumber) {
			const startPoint = pageNumber * 50 - 50;
			const endPoint =
				pageNumber * 50 > actualItemsIdList.current.lenght
					? actualItemsIdList.current.lenght
					: pageNumber * 50;
			for (let i = startPoint; i < endPoint; i += 1) {
				idList.push(actualItemsIdList.current[i]);
			}
		} else {
			// Перестраховка.
			console.log('слишком мало итемов для этого номера страницы');
			setIsNotFound(true);
			setIsLoaderOpen(false);
		}
		return idList;
	};

	// Запрос при смене отображаемой страницы.
	const databaseChangePageQuery = (actualBody) => {
		const { actionPage, pageNumber } = actualBody;
		// Формируем список id которые нужно запросить с бэка для отрисовки
		const idList = creatIdList(pageNumber);
		if (idList.length) {
			apiValantis
				.getItems({ action: actionPage, params: { ids: idList } })
				.then((result) => {
					const noRepetitionPage = [];
					// Убираем повторы по id и пришедшего результата.
					result.result.forEach((item) => {
						if (!noRepetitionPage.some((elem) => elem.id === item.id)) {
							noRepetitionPage.push(item);
						}
					});
					setActualPageList(noRepetitionPage);
					setIsNotFound(false);
					setIsLoaderOpen(false);
				})
				.catch((err) => {
					console.log(`При выполнении запрса произошла ошибка: ${err}`);
					if (Number(String(err).charAt(0)) === 5) {
						databaseChangePageQuery(actualBody);
					}
				});
		} else {
			console.log(
				'По данным настройкам фильтрации найдено слишком мало товаров, для вывода на страницу с настолько большим номером =)'
			);
			setIsNotFound(true);
			setIsLoaderOpen(false);
		}
	};

	// Запрос при смене фильтра.
	const databaseChangeFilterQuery = (actualBody) => {
		const { actionFilter, paramsFilter, pageNumber } = actualBody;
		apiValantis
			.getItems({ action: actionFilter, params: paramsFilter })
			.then((res) => {
				// Убираем дубли id из полученного списка.
				const noRepetitionList = Array.from(new Set(res.result));
				// Записываем список в переменную, чтобы меняя страницы без смены фильтра не совершать лишних запросов.
				actualItemsIdList.current = noRepetitionList;
				if (!noRepetitionList.length) {
					return Promise.reject(new Error('404'));
				}
				return Promise.resolve();
			})
			.then(() => databaseChangePageQuery(actualBody))
			.catch((err) => {
				console.log(`При выполнении запрса произошла ошибка: ${err}`);
				if (Number(String(err).charAt(0)) === 5) {
					databaseChangeFilterQuery(actualBody);
				} else {
					console.log('по данному запросу ничего не обнаружено');
					setActualPageList([]);
					setIsPageCount(0);
					if (Number(pageNumber) !== 1) {
						setIsNotFound(true);
						setIsLoaderOpen(false);
					}
				}
			});
	};

	const actualizationLocation = () => {
		// Тело запроса на бэк который мы ретурним.
		const returningBody = {};

		// Определяем поле фильтрации для проверки. Определяем тип фильтра, параметр фильтра и номер актуальной страницы.
		const { filterFields, filter, filterParam, actualPageNumber } =
			SeparationPazname(location);

		// Добавляем в посылаемый в запрос объект поля необходимые для отображения нужной страницы.
		returningBody.actionPage = 'get_items';
		returningBody.pageNumber = actualPageNumber;

		// Проверяем изменился ли фольтр или его параметр и определяем, что с этим делать.
		const hasChangedFilterFields = () => {
			// Проверяем изменился ли фольтр или его параметр.
			if (lastFilterFields !== filterFields || !actualItemsIdList.length) {
				setLastFilterFields(filterFields);
				isActivePage.current = actualPageNumber;
				databaseChangeFilterQuery(returningBody);
			} else {
				isActivePage.current = actualPageNumber;
				databaseChangePageQuery(returningBody);
			}
		};

		// Проверяем соответствует ли поле фильтра в адресе нашему формату (перестраховка).
		if (filterRegex.test(filterFields)) {
			// Проверяем соответствие параметра фильтрации её типу. Формируем параметры фильтрации для тела запроса на бэк.
			if (filter === 'none' && filterParam === 'none') {
				// Фильтр отсутствует: запрашиваем с бэка весь перечень.
				returningBody.actionFilter = 'get_ids';
				returningBody.paramsFilter = {};
				// Проверяем изменился ли фольтр или его параметр и определяем, что с этим делать.
				hasChangedFilterFields();
			} else if (
				// Фильтр продукт или брэнд: в пораметре строка которая может содержать пробелы, цифры, точки и нижние подчёркивания.
				filter === 'product' ||
				filter === 'brand' ||
				// Фильтр цена: в пораметре десятичное число, возможно с указанием копеек после точки (проверяем это условие регулярным выражением).
				(filter === 'price' && priseRegex.test(filterParam))
			) {
				returningBody.actionFilter = 'filter';
				returningBody.paramsFilter = {};
				returningBody.paramsFilter[filter] =
					filter === 'price' ? Number(filterParam) : filterParam;
				// Проверяем изменился ли фольтр или его параметр и определяем, что с этим делать.
				hasChangedFilterFields();
			} else {
				// Параметр фильтра не соответствует его типу.
				setIsNotFound(true);
				setIsLoaderOpen(false);
			}
		} else {
			// Что то не так с форматом записи фильтра и типа.
			setIsNotFound(true);
			setIsLoaderOpen(false);
		}
	};

	// actualizationLocation();

	// Следим за изменением адресной строки и предпринимаем соответствующие действия, проверяя формат строки.
	React.useEffect(() => {
		setIsLoaderOpen(true);
		const actualLocation = decodeURI(location.pathname);
		if (actualLocation === '/') {
			// Если мы только вошли и ничего ещё не задавали то говорим, что отображаем всё без фильтра, с первой страницы.
			navigate('/filter=none&filterparam=none/1');
		} else if (onlyFilterRegex.test(actualLocation)) {
			// Если по каким то причинам у нас введён только фильтр, но корректно, то говорим, что будем отображать найденное по нему с первой стрницы.
			navigate(`${location.pathname.replace(/\/$/, '')}/1`);
		} else if (normalPathnameRegex.test(actualLocation)) {
			// Если адрес в строке корректен, то начинаем с ним работать.
			setIsNotFound(false);
			actualizationLocation();
		} else {
			setIsNotFound(true);
			setIsLoaderOpen(false);
		}
	}, [location.pathname]);

	return (
		<div className="App">
			<Loader isLoaderOpen={isLoaderOpen} />
			<Routes>
				{!isNotFound && (
					<Route path="/" element={<Layout />}>
						<Route
							path="/:filter"
							element={
								<Filter
									lastFilterFields={lastFilterFields}
									isPageCount={isPageCount}
									isActivePage={isActivePage.current}
								/>
							}
						>
							<Route
								path="/:filter/:page"
								element={<Gallery actualPageList={actualPageList} />}
							/>
						</Route>
					</Route>
				)}
				<Route path="/*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;

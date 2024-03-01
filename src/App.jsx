import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
// import React from 'react';

import Layout from './pages/layout/layout';
import Gallery from './components/gallery/gallery';
import NotFound from './pages/notFound/notFound';

import './App.css';
import ApiValantis from './utils/api/apiValantis';

function App() {
	const apiValantis = ApiValantis();

	const location = useLocation();
	const navigate = useNavigate();

	const filterRegex =
		/^(filter=(none|product|price|brand)&filterparam=([\wа-яё.\s&]+))$/;
	const priseRegex = /^\d+(\.\d*)?$/;

	const onlyFilterRegex =
		/^(\/filter=(none|product|price|brand)&filterparam=([\wа-яё.\s&]+)\/?)$/;
	const normalPathnameRegex =
		/^(\/filter=(none|product|price|brand)&filterparam=([\wа-яё.\s&]+)\/[1-9]\d*)$/;

	const [lastFilterFields, setLastFilterFields] = React.useState('');
	const [actualItemsIdList, setActualItemsIdList] = React.useState([]);
	const [isNotFound, setIsNotFound] = React.useState(true);

	// function log() {
	// 	console.log(apiValantis.creatingAuthorizationString());
	// }

	// log();

	const creatIdList = (pageNumber, itemsIdList) => {
		const idList = [];
		if (Math.ceil(itemsIdList.length / 50) >= pageNumber) {
			const startPoint = pageNumber * 50 - 50;
			const endPoint =
				pageNumber * 50 > itemsIdList.lenght
					? itemsIdList.lenght
					: pageNumber * 50;
			for (let i = startPoint; i < endPoint; i += 1) {
				idList.push(itemsIdList[i]);
			}
		} else {
			console.log('слишком мало итемов для этого номера страницы');
		}
		return idList;
	};

	const databaseOldFilterQuery = (actualBody) => {
		console.log('фильтр не изменился', actualBody);
	};

	const databaseNewFilterQuery = (actualBody) => {
		const { actionFilter, paramsFilter, actionPage, pageNumber } = actualBody;
		console.log(actionPage, pageNumber);
		apiValantis
			.getItems({ action: actionFilter, params: paramsFilter })
			.then((res) => {
				// Убираем дубли id из полученного списка.
				const noRepetitionList = Array.from(new Set(res.result));
				console.log(noRepetitionList.length);
				// Записываем список в переменную, чтобы меная страницы без смены фильтра не совершать лишних запросов.
				setActualItemsIdList(noRepetitionList);
				if (!noRepetitionList.length) {
					console.log('по данному запросу ничего не обнаружено');
				} else {
					// Формируем список id которые нужно запросить с бэка для отрисовки
					const idList = creatIdList(pageNumber, noRepetitionList);
					if (idList.length) {
						apiValantis
							.getItems({ action: actionPage, params: { ids: idList } })
							.then((result) => {
								console.log(result['result'].lenght, result.result);
							})
							.catch((err) =>
								console.log(`При выполнении запрса произошла ошибка: ${err}`)
							);
					}
					console.log(idList);
				}
			})
			.catch((err) =>
				console.log(`При выполнении запрса произошла ошибка: ${err}`)
			);
	};

	const actualizationLocation = () => {
		// Тело запроса на бэк который мы ретурним.
		const returningBody = {};
		// Узнаём актуальный pathname и сразу декодируем для дальнейшей работы.
		const actualLocation = decodeURI(location.pathname);
		// Присваеваем переменной поле с фильтром и его параметром из pathname
		const filterFields = actualLocation.split('/')[1];
		// Узнаём актуальную страницу отображаемого результата поиска из pathname если он не указана то отображаем страницу 1 (перестраховка).
		const actualPageNumber =
			actualLocation.split('/')[2] &&
			Number.isInteger(Number(actualLocation.split('/')[2]))
				? Number(actualLocation.split('/')[2])
				: 1;

		// Проверяем изменился ли фольтр или его параметр и определяем, что с этим делать.
		const hasChangedFilterFields = () => {
			// Добавляем в посылаемый в запрос объект поля необходимые для отображения нужной страницы.
			returningBody.actionPage = 'get_items';
			returningBody.pageNumber = actualPageNumber;
			setIsNotFound(false);
			// Проверяем изменился ли фольтр или его параметр.
			if (lastFilterFields !== filterFields || !actualItemsIdList.length) {
				setLastFilterFields(filterFields);
				databaseNewFilterQuery(returningBody);
			} else {
				databaseOldFilterQuery(returningBody);
			}
		};

		// Проверяем соответствует ли поле фильтра в адресе нашему формату (перестраховка).
		if (filterRegex.test(filterFields)) {
			// Определяем тип фильтрации.
			const filter = filterFields.split('&')[0].split('=')[1];
			// Определяем параметр фильтрации.
			const filterParam = filterFields.split('&')[1].split('=')[1];
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
			}
		} else {
			// Что то не так с форматом записи фильтра и типа.
			setIsNotFound(true);
		}
	};

	// actualizationLocation();

	// Следим за изменением адресной строки и предпринимаем соответствующие действия, проверяя формат строки.
	React.useEffect(() => {
		console.log(location.pathname);
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
		}
	}, [location.pathname]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Layout isNotFound={isNotFound} />}>
					<Route path="/:filter" element={<Gallery />}>
						<Route path="/:filter/:page" element={<Gallery />} />
					</Route>
				</Route>
				<Route path="/*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;

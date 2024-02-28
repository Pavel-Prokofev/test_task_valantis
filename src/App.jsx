import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// import React from 'react';

import Layout from './pages/layout/layout';
import Gallery from './components/gallery/gallery';
import NotFound from './pages/notFound/notFound';

import './App.css';
import ApiValantis from './utils/api/apiValantis';

function App() {
	const apiValantis = ApiValantis();

	const location = useLocation();
	const filterRegex =
		/^(filter=(none|product|prise|brand)&filterparam=([\wа-яё]+))$/;

	const [lastfilterFields, setLastfilterFields] = React.useState('');
	const [isNotFound, setIsNotFound] = React.useState(false);

	// function log() {
	// 	console.log(apiValantis.creatingAuthorizationString());
	// }

	// log();

	const actualizationLocation = () => {
		// Узнаём актуальный pathname и сразу декодируем для дальнейшей работы.
		const actualLocation = decodeURI(location.pathname);
		// Присваеваем переменной поле с фильтром и его параметрами из pathname
		const filterFields = actualLocation.split('/')[1];
		// Проверяем изменился ли фольтр или его параметр.
		if (lastfilterFields !== filterFields) {
			setLastfilterFields(filterFields);
			// Проверяем соответствует ли поле фильтра в адресе нашему формату.
			if (filterRegex.test(filterFields)) {
				console.log(filterRegex.test(filterFields));
			} else {
				setIsNotFound(true);
			}
		}
	};

	const initial = () => {
		actualizationLocation();
		if (false) {
			apiValantis
				.getItems({ action: 'get_ids', params: {} })
				.then((res) => {
					// console.log(res.lenght, res);
					const noRepetitionList = Array.from(new Set(res.result));
					return noRepetitionList;
					// console.log(noRepetitionList.length, noRepetitionList);
				})
				.catch((err) =>
					console.log(`При выполнении запрса произошла ошибка: ${err}`)
				);
		}
	};

	initial();

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

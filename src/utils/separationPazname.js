function separationPazname(location) {
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

	const filterFieldsArr = filterFields.split('&');

	// filterFieldsArr.splice(0,1).join('&');
	//

	console.log(filterFieldsArr.slice(1).join('&'));

	// Определяем тип фильтрации.
	const filter = filterFields.split('&')[0].split('=')[1];

	// Определяем параметр фильтрации.
	// const filterParam = filterFields.split('&')[1].split('=')[1];
	const filterParam = filterFieldsArr.slice(1).join('&').split('=')[1];

	return {
		actualLocation,
		filterFields,
		filter,
		filterParam,
		actualPageNumber,
	};
}

export default separationPazname;

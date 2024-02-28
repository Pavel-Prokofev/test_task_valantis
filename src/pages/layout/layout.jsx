/* eslint-disable react/jsx-no-useless-fragment */
import { Outlet } from 'react-router-dom';

import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import NotFound from '../notFound/notFound';

function Layout({ isNotFound }) {
	// const { isNotFound = false, setIsNotFound } = props;
	// const isNotFound = true;
	console.log(isNotFound);
	return (
		<>
			{!isNotFound ? (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			) : (
				<NotFound />
			)}
		</>
	);
}

export default Layout;

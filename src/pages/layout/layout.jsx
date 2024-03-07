import { Outlet } from 'react-router-dom';

import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

import './layout.css';

function Layout({ isNotFound }) {
	// const { isNotFound = false, setIsNotFound } = props;
	// const isNotFound = true;
	console.log(isNotFound);
	return (
		<>
			<Header />
			<main className="main">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}

export default Layout;

import './loader.css';

function Loader({ isLoaderOpen }) {
	return (
		<aside className={`loader ${isLoaderOpen && 'loader_opened'}`}>
			<div className="loader__ring" />
			<div className="loader__ring" />
			<div className="loader__ring" />
			<div className="loader__ring" />
			<div className="loader__ring" />
		</aside>
	);
}

export default Loader;

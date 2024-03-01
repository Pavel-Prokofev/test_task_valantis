import { useNavigate } from 'react-router-dom';

function Header() {
	const navigate = useNavigate();

	return (
		<>
			<p>Тут будет хедер</p>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/11');
				}}
			>
				/filter=none&filterparam=none/11
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1.');
				}}
			>
				/filter=none&filterparam=none/1.
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=no');
				}}
			>
				/filter=none&filterparam=no
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=product&filterparam=кольцо/1');
				}}
			>
				/filter=product&filterparam=кольцо/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
			<button
				type="button"
				onClick={() => {
					navigate('/filter=none&filterparam=none/1');
				}}
			>
				/filter=none&filterparam=none/1
			</button>
		</>
	);
}

export default Header;

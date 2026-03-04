import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoIndividual from '../TodoIndividual';

describe('TodoIndividual component', () => {
	const doneInfo = (
		<>
			<span>This todo is done</span>
			<span>
				<button> Delete </button>
			</span>
		</>
	);

	const notDoneInfo = (
		<>
			<span>This todo is not done</span>
			<span>
				<button> Delete </button>
				<button> Set as done </button>
			</span>
		</>
	);

	it('render and display not done todo', () => {
		const todo = {
			text: 'Test todo',
			done: false,
		};

		render(<TodoIndividual todo={todo} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />);

		const title = screen.getByText(/Test todo/);
		expect(title).toBeInTheDocument();
		// expect(screen.getByText('This todo is not done')).toBeInTheDocument();
	});

	it('render and display done todo', () => {
		const todo = {
			text: 'Already done',
			done: true,
		};

		render(<TodoIndividual todo={todo} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />);

		expect(screen.getByText('This todo is done')).toBeInTheDocument();
	});
});

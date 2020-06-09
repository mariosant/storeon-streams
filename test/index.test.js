import {createStoreon} from 'storeon';
import {never, merge} from 'kefir';
import {fromStoreon} from '../src';

const dispatchHandle = jest.fn();
const changeHandle = jest.fn();

const initialState = {active: true};

const sampleModule = (store) => {
	store.on('@init', () => initialState);

	store.on('toggle', (state) => ({active: !state.active}));

	fromStoreon(store, ({changeStream, dispatchStream}) =>
		merge([
			dispatchStream
				.map(([state, action]) => dispatchHandle(state, action))
				.flatMap(() => never()),
			changeStream
				.map(([state, change]) => changeHandle(state, change))
				.flatMap(() => never())
		])
	);
};

const store = createStoreon([sampleModule]);

beforeEach(() => jest.clearAllMocks());

describe('fromStoreon', () => {
	test('dispatch gets called on event', () => {
		store.dispatch('test', true);

		expect(dispatchHandle).toHaveBeenCalledWith({active: true}, [
			'test',
			true,
			undefined
		]);
	});

	test('change gets called on event', () => {
		store.dispatch('toggle', true);

		expect(changeHandle).toHaveBeenCalledWith({active: false}, {active: false});
	});
});

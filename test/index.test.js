import {createStoreon} from 'storeon';
import {never, merge} from 'kefir';
import {fromStoreon} from '../src';

const dispatchHandle = jest.fn();
const changeHandle = jest.fn();
const actionHandle = jest.fn();

const initialState = {active: true};

const sampleModule = (store) => {
	store.on('@init', () => initialState);

	store.on('toggle', (state) => ({active: !state.active}));

	fromStoreon(store, ({actionStream, changeStream, dispatchStream}) =>
		merge([
			actionStream('action')
				.map(([state, action]) => actionHandle(state, action))
				.flatMap(() => never()),
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

		expect(actionHandle).not.toHaveBeenCalled();
	});

	test('change gets called on event', () => {
		store.dispatch('toggle', true);

		expect(changeHandle).toHaveBeenCalledWith({active: false}, {active: false});
		expect(actionHandle).not.toHaveBeenCalled();
	});

	test('actionStream handles stuff correctly', () => {
		store.dispatch('action', true);

		expect(actionHandle).toHaveBeenCalled();
	});
});

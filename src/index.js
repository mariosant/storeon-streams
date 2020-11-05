import {stream, never} from 'kefir';

const noop = () => {};

export const fromStoreon = (store, callback = noop) => {
	const dispatchStream = stream((emitter) => {
		const off = store.on('@dispatch', (state, action) => {
			emitter.value([state, action]);
		});

		return off;
	});

	const changeStream = stream((emitter) => {
		const off = store.on('@changed', (state, change) => {
			emitter.value([state, change]);
		});

		return off;
	});

	const actionStream = (action) => {
		const filterAction = isAction(action);
		return dispatchStream.filter((event) => filterAction(event));
	};

	const epic =
		callback({actionStream, dispatchStream, changeStream}) || never();

	epic.observe(([action, payload]) => store.dispatch(action, payload));
};

export const fromStoreonModule = (callback) => (store) =>
	fromStoreon(store, callback);

export const isAction = (action) => ([, [actionSubject]]) =>
	action === actionSubject;

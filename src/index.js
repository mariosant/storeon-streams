import {stream, never} from 'kefir';

export const fromStoreon = (store, callback) => {
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

	const epic = callback({dispatchStream, changeStream}) ?? never();

	epic.observe(([action, payload]) => store.dispatch(action, payload));
};

export const fromStoreonModule = (callback) => (store) =>
	fromStoreon(store, callback);

export const isAction = (action) => ([, [actionSubject]]) =>
	action === actionSubject;

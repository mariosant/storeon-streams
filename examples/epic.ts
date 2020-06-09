import {never} from 'kefir';
import {createStoreon} from 'storeon';
import {fromStoreon, fromStoreonModule} from '../src';

const sideEffectsIsolated = fromStoreonModule(
	({dispatchStream, _changeStream}) =>
		dispatchStream
			.filter(([_state, [action]]) => action === 'db/set')
			.log('dispatch')
			.flatMapLatest(() => never())
);

const moduleWithSideEffects = (store) => {
	store.on('db/set', () => {
		// Does something
		console.log('db/set');
	});

	fromStoreon(store, ({dispatchStream, _changeStream}) =>
		dispatchStream
			.filter(([_state, [action]]) => action === 'db/set')
			.log('dispatch')
			.flatMapLatest(() => never())
	);
};

export default createStoreon([sideEffectsIsolated, moduleWithSideEffects]);

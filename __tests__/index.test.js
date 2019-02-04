// @flow
import '@babel/polyfill';
import asyncMemoizeLast from '../';

describe('async-memoize-last', () => {
	it('memoizes-last-call', async () => {
		expect.assertions(2);
		let i = 0;
		const call = async (...args) => {
			return args.reduce((total, current) => total + current) + i;
		};
		const memoizedCall = asyncMemoizeLast(call);
		const firstResponse = await memoizedCall(1, 2, 3);
		// Perform first call
		expect(firstResponse).toEqual(6);
		// Increment i to equal 20
		i = 20;
		// Perform second call, i should equal 0 as it remembers the previous.
		const secondResponse = await memoizedCall(1, 2, 3);
		expect(secondResponse).toEqual(6);
	});
	it('does-not-use-cache-on-new-params', async () => {
		expect.assertions(2);
		let i = 0;
		const call = async (...args) => {
			return args.reduce((total, current) => total + current) + i;
		};
		const memoizedCall = asyncMemoizeLast(call);
		const firstResponse = await memoizedCall(1, 2, 3);
		// Perform first call
		expect(firstResponse).toEqual(6);
		// Increment i to equal 20
		i = 20;
		// Perform second call, because the params are different it should do a fresh call.
		const secondResponse = await memoizedCall(1, 2, 4);
		expect(secondResponse).toEqual(27);
	});
	it('deep-equals-true', async () => {
		expect.assertions(2);
		let i = 0;
		const call = async (...args) => {
			return { result: args[0].query + args[0].option, num: args[1].coordinates.x + args[1].coordinates.y + i };
		};

		const memoizedCall = asyncMemoizeLast(call);

		const testArgs = [
			{ query: 'foo', option: 'bar' },
			{ coordinates: { x: 100, y: 200 }, settings: ['bum', 'boo'] }
		];

		const firstResponse = await memoizedCall(...testArgs);

		const expected = { result: 'foobar', num: 300 };
		// Perform first call
		expect(firstResponse).toMatchObject(expected);
		// Increment i to equal 20
		i = 200;
		// Perform second call, because the params are the same it should return the previous result.
		const secondResponse = await memoizedCall(...testArgs);
		expect(secondResponse).toMatchObject(expected);
	});
	it('deep-equals-false', async () => {
		expect.assertions(2);
		let i = 0;
		const call = async (...args) => {
			return { result: args[0].query + args[0].option, num: args[1].coordinates.x + args[1].coordinates.y + i };
		};

		const memoizedCall = asyncMemoizeLast(call);

		const testArgs = [
			{ query: 'foo', option: 'bar' },
			{ coordinates: { x: 100, y: 200 }, settings: ['bum', 'bee'] }
		];

		const firstResponse = await memoizedCall(...testArgs);

		const expected = { result: 'foobar', num: 300 };
		// Perform first call
		expect(firstResponse).toMatchObject(expected);
		// Increment i to equal 20
		i = 200;
		// Perform second call, because the params are the same it should return the previous result.
		const secondExpected = { result: 'foobar', num: 500 };
		const secondResponse = await memoizedCall(...testArgs);
		expect(secondResponse).toMatchObject(expected);
	});
});

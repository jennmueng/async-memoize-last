// @flow
import deepEqual from 'fast-deep-equal';

export default function asyncMemoizeLast(call: Function, customEqual?: Function): Function {
	let prevArgs;
	let prevResult;
	let checkPrev = false;
	const equalityFunction = customEqual || deepEqual;

	function memoizedCall(...args: Array<mixed>): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (checkPrev && equalityFunction(prevArgs, args)) {
					// Called before and previous arguments and the new arguments are exactly the same.
					return resolve(prevResult);
				}
				prevResult = await call(...args);
				prevArgs = args;
				checkPrev = true;
				return resolve(result);
			} catch (e) {
				// On an error, clear the previous result and args to force a refresh on next call.
				checkPrev = false;
				prevResult = undefined;
				prevArgs = undefined;
				// Pass on the error.
				return reject(e);
			}
		});
	}

	return memoizedCall;
}

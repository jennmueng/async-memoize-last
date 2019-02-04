# async-memoize-last

Memoize your last most api calls.

## How Does it Work?

It memoizes and compares to your last call, if the parameters are exactly the same then it will resolve the promise with the previous response. This reduces load time (not having to wait for an api response) and data usage.

This if to be used for making asynchronous requests that, if given the same parameters in a reasonable amount of time, will return the same response. This (obviously) will mess up api calls that return different results when called with the same params at different times. Use at your own descretion.

## Equality Fuction

## Api

```
// Basic Usage
const memoizedCall = asyncMemoize(call);

// With custom equality function
const equalityFunction = (a, b) => {
    return a - b
};
const memoizedCallWithCustomEqual = asyncMemoize(call, equalityFunction);
```

## Options

### Equality Function

```
    equalityFunction: (prevArgs, newArgs) => prevArgs[0] === newArgs[0] // args array
```

A custom equality function to compare the parameters of the function. Default is a deep equality function.

By default, this uses the deep equality function provided by `fast-deep-equal`. You are free to supply your own equality function to the second parameter of the asyncMemoizeLast function.

/**
 * Test to check if utils is working as expected
 */
/* global it expect jest */
import 'react-native';

import AppUtil from '@lib/util';

/*   Remove empty values from a given associative array */
it('removeEmptyValues', () => {
  var obj = null;
  var res = AppUtil.removeEmptyValues(obj);
  expect(AppUtil.objIsEmpty(res)).toBeTruthy();

  obj = { a: null, b: null, c: null };
  res = AppUtil.removeEmptyValues(obj);
  expect(AppUtil.objIsEmpty(res)).toBeTruthy();

  obj = { a: 'a', b: null, c: null };
  res = AppUtil.removeEmptyValues(obj);
  expect(res).toEqual({ a: 'a' });

  obj = { a: 'a', b: null, c: null };
  obj.d = undefined; obj.e = undefined;
  res = AppUtil.removeEmptyValues(obj);
  expect(res).toEqual({ a: 'a' });
});

it('objIsEmpty', () => {
  var obj = null;
  var res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();

  obj = {};
  res = AppUtil.objIsEmpty(obj);
  expect(res).toBeTruthy();

  obj = [];
  res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();

  obj = { a: 5 };
  res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();
});

it('limitChars', () => {
  var str = null;
  var res = AppUtil.limitChars(str);
  expect(res).toBeNull();

  str = 'HelloHelloHello';
  res = AppUtil.limitChars(str);
  expect(res).toEqual(str);

  str = 'HelloHelloHelloA';
  res = AppUtil.limitChars(str);
  expect(res).not.toEqual(str);
  expect(res).toHaveLength(15 + 4);

  str = 'HelloHelloHelloA';
  res = AppUtil.limitChars(str, 5);
  expect(res).not.toEqual(str);
  expect(res).toHaveLength(5 + 4);
});

it('debug test', () => {
  var str = null;
  var title = null;
  AppUtil.debug(str, title);
  // nothing to expect here
  title = 'hello';
  AppUtil.debug(str, title);
  title = null;
  str = 'body here';
  AppUtil.debug(str, title);
  title = 'app details';
  str = { id: 5, val: 'hello' };
  AppUtil.debug(str, title);
});

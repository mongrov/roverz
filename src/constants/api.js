/**
 * API Config
 */

export default {
  // The URL we're connecting to
  hostname: 'http://wp-api.mcnam.ee',

  // Map shortnames to the actual endpoints, so that we can
  // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
  //  NOTE: They should start with a /
  //    eg.
  //    - AppAPI.users.post()
  //    - AppAPI.favourites.patch()
  //    - AppAPI.blog.delete()
  endpoints: new Map([
    ['login', '/wp-json/jwt-auth/v1/token'], // If you change the key, update the reference below
    ['users', '/wp-json/wp/v2/users'],
    ['me', '/wp-json/wp/v2/users/me'],
  ]),

  // Which 'endpoint' key deals with our tokens?
  tokenKey: 'login',
};

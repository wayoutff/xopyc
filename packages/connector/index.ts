/**
 * This package will be connect any additional packages
 */

export function pkgConnector (expressApp, schema) {
  const { packages, middlewares } = schema
  
  for (const path in packages) {
    if (packages.hasOwnProperty(path) && typeof packages[path] === 'function') {
      const initPackageFn = packages[path]
      initPackageFn(expressApp)
    }
  }
  for (const middleware of middlewares) {
    expressApp.use(middleware)
  }
}

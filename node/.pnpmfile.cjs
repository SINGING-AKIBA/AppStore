/**
 * This is a pnpmfile that is used to modify the resolution of dependencies
 * in the pnpm workspace.
 */

function readPackage(pkg) {
  // You can modify the package manifest here
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
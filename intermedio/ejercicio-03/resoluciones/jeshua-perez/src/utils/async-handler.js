/**
 * Envuelve un controlador async para no repetir try/catch en cada uno.
 * @param {(req: import("express").Request, res: import("express").Response) => Promise<void>} fn
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

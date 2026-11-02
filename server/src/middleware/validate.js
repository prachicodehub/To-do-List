// Validates req[source] against a zod schema and replaces it with the parsed value.
// Express 5 makes req.query a getter, so parsed values land on req.valid instead.
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    req.valid = { ...req.valid, [source]: result.data };
    next();
  };

export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req[source]);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      // Replace validated source with parsed/sanitized data
      req[source] = result.data;

      next();
    } catch (err) {
      next(err);
    }
  };
};

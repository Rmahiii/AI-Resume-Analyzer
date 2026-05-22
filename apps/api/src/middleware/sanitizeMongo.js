const forbidden = new Set(["__proto__", "constructor", "prototype"]);

function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;
  return Object.entries(value).reduce((safe, [key, nested]) => {
    if (!key.startsWith("$") && !key.includes(".") && !forbidden.has(key)) {
      safe[key] = sanitize(nested);
    }
    return safe;
  }, {});
}

export function sanitizeMongo(req, _res, next) {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
}

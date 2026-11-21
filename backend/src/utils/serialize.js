// Keeps the JSON shape the mobile app was built against with Mongoose:
// every record exposes `_id`, and foreign keys are also exposed as `user` / `destination`
// when the relation itself is not included.
const serialize = (value) => {
  if (Array.isArray(value)) return value.map(serialize);
  if (!value || typeof value !== 'object' || value instanceof Date) return value;

  const out = {};
  for (const [key, val] of Object.entries(value)) out[key] = serialize(val);

  if (out.id !== undefined) out._id = out.id;
  if (out.userId !== undefined && out.user === undefined) out.user = out.userId;
  if (out.destinationId !== undefined && out.destination === undefined) out.destination = out.destinationId;
  return out;
};

module.exports = serialize;

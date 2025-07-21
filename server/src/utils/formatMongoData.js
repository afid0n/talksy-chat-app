const formatMongoData = (doc) => {
  if (Array.isArray(doc)) {
    return doc.map(formatDocument);
  } else if (doc && typeof doc === "object") {
    return formatDocument(doc);
  }
  return doc;
};

const formatDocument = (item) => {
  const obj = item.toObject ? item.toObject({ virtuals: true }) : { ...item };

  const { _id, __v, public_id, ...rest } = obj;
  const formatted = {
    id: _id?.toString(),
    ...rest,
  };

  Object.keys(formatted).forEach((key) => {
    if (Array.isArray(formatted[key])) {
      formatted[key] = formatted[key].map(formatMongoData);
    } else if (
      formatted[key] &&
      typeof formatted[key] === "object" &&
      formatted[key]._id
    ) {
      formatted[key] = formatMongoData(formatted[key]);
    }
  });

  return formatted;
};

module.exports = formatMongoData;
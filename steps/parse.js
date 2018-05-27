const Parser = require('xml2js').Parser;

module.exports = xml => {
  return new Promise((resolve, reject) => {
    new Parser({ mergeAttrs: true }).parseString(xml, (err, json) => {
      if (err) {
        reject(err);
      }

      resolve(json);
    });
  });
};

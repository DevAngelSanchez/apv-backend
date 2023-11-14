const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) {
      // This origin is allowed
      callback(null, true);
    } else {
      callback(new Error('No allowed by cors'))
    }
  }
}

export default corsOptions;
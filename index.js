const fastify = require("fastify")({
  logger: true
});

fastify.register(require("./routes/routes"));

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

async function routes(fastify, options) {
  fastify.get("/", async (req, res) => {
    return { hello: "world" };
  });
}

module.exports = routes;

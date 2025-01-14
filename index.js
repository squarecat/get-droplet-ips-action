const core = require("@actions/core");
const digitalocean = require("digitalocean");

try {
  // `who-to-greet` input defined in action metadata file
  const apiKey = core.getInput("digital-ocean-key");
  const tag = core.getInput("tag");
  const networkType = core.getInput("network_type") || "public";
  const client = digitalocean.client(apiKey);

  console.log(`Fetching droplets for tag ${JSON.stringify(tag)}`);

  client.droplets
    .list()
    .then((drops) => {
      return drops.filter((d) => d.tags.includes(tag));
    })
    .then((drops) => {
      console.log(`Found ${drops.length} matching droplets`);

      return drops.map((d) => {
        return d.networks.v4.find((i) => i.type === networkType).ip_address;
      });
    })
    .then((ips) => {
      core.setOutput("server_ips", ips || []);
    })
    .catch((err) => {
      core.setFailed(err.message);
    });
} catch (error) {
  core.setFailed(error.message);
}

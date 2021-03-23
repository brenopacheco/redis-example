// https://github.com/luin/ioredis
const Redis = require("ioredis");

// Create connection
const redis = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: "auth",
    db: 0,
});

// INSERT / GET DATA
redis
    .set("foo", "bar")
    .then((res) => {
        console.log(`${res}: Inserted "foo" in "bar"`);
        redis
            .get("foo")
            .then((res) => {
                console.log(`Get "foo": ${res}`);
            })
            .catch((err) => {
                console.log(`${err}: Failed to get "foo"`);
            });
    })
    .catch((err) => {
        console.log(`${err}: Failed to insert "foo" in "bar"`);
    });

// PUB-SUB
const sub = new Redis();
const pub = new Redis();

// Publish to my-channel-1 or my-channel-2 randomly.
setInterval(() => {
    const message = { foo: Math.random() };
    const channel = `my-channel-${1 + Math.round(Math.random())}`;
    pub.publish(channel, JSON.stringify(message));
    console.log("Published %s to %s", message, channel);
}, 1000);

// Subscribe to channels
sub.subscribe("my-channel-1", "my-channel-2", (err, count) => {
    if (err) {
        console.error("Failed to subscribe: %s", err.message);
    } else {
        console.log(
            `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
    }
});

sub.on("message", (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
});

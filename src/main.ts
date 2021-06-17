import * as https from "https";
import * as QueryString from "querystring";
import md5 = require("md5");

export const translate = word => {
    const appid = "???", appSecret = "??", salt = Math.random();
    const sign = md5(appid + word + salt + appSecret);

    const query: String = QueryString.stringify({
        q: word,
        from: "en",
        to: "zh",
        appid,
        salt,
        sign
    });

    const options = {
        hostname: "api.fanyi.baidu.com",
        port: 443,
        path: `/api/trans/vip/translate?${query}`,
        method: "GET"
    };

    const req = https.request(options, (res) => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);

        res.on("data", (d) => {
            process.stdout.write(d);
        });
    });

    req.on("error", (e) => {
        console.error(e);
    });
    req.end();
};

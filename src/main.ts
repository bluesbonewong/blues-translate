import * as https from "https";
import * as QueryString from "querystring";
import md5 = require("md5");
import {appid, appSecret} from "./private";

export const translate = word => {
    const salt = Math.random();
    const sign = md5(appid + word + salt + appSecret);

    const query: string = QueryString.stringify({
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

    // https请求
    const req = https.request(options, (res) => {
        let chunks = [];
        res.on("data", chunk => {
            chunks.push(chunk);
        });
        res.on("end", () => {
            type BaiduResult = {
                error_code?: string,
                error_msg?: string,
                from: string,
                to: string,
                trans_result: { src: string, dst: string }[]
            }

            const str = Buffer.concat(chunks).toString();
            const obj: BaiduResult = JSON.parse(str);
            console.log(obj.trans_result[0].dst);
        });
    });

    req.on("error", (e) => {
        console.error(e);
    });
    req.end();
};

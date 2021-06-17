import * as https from "https";
import * as QueryString from "querystring";
import md5 = require("md5");
import {appid, appSecret} from "./private";

type ErrorMap = {
    [key: number]: string
}

const errorMap: ErrorMap = {
    52001: "请求超时",
    52002: "系统错误",
    52003: "未授权用户"
};

export const translate = (word: string) => {
    const salt = Math.random();
    const sign = md5(appid + word + salt + appSecret);
    let [from, to] = ["zh", "en"]; // 默认中译英

    // 英译中
    if (/[a-zA-Z]/.test(word[0])) [from, to] = ["en", "zh"];

    const query: string = QueryString.stringify({
        q: word,
        from,
        to,
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
        let chunks: Buffer[] = [];
        res.on("data", chunk => {
            chunks.push(chunk);
        });
        res.on("end", () => {
            type BaiduResult = {
                error_code?: number,
                error_msg?: string,
                from: string,
                to: string,
                trans_result: { src: string, dst: string }[]
            }

            const str = Buffer.concat(chunks).toString();
            const obj: BaiduResult = JSON.parse(str);

            if (obj.error_code) {
                console.error(errorMap[obj.error_code] || obj.error_msg);
                process.exit(2); // 退出当前进程
            } else {
                obj.trans_result.forEach(item => console.log(item.dst));
                process.exit(0); // 退出当前进程
            }
        });
    });

    req.on("error", (e) => {
        console.error(e);
    });
    req.end();
};

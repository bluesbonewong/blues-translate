#!/usr/bin/env node
import {Command} from "commander";
import * as process from "process";
import {translate} from "./main";

const program = new Command();
program.version("0.0.1")
    .name("fy")
    .usage("<English>")
    .arguments("<English>")
    .description("输入说明：", {
        English: "英文单词"
    })
    .action(word => {
        console.log(translate(word));
    });

program.parse(process.argv); // 解析参数

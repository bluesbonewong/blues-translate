#!/usr/bin/env node
import {Command} from "commander";
import * as process from "process";

const program = new Command();
program.version("0.0.1")
    .name("fy")
    .usage("<English>");

program.parse(process.argv); // 解析参数

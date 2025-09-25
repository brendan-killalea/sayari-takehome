import { Command } from "commander";
import {runSimulator} from "./transactions";

const program = new Command();
program
    .name("transactionSimulator")
    .version("1.0.0")
    .option(
        "-c, --count <count>",
        "Number of transactions to create.",
        "1")
    .option(
        "-i, --interval <interval>",
        "Interval in seconds at which transactions will be created. If not specified, it will be run only once.",
        "0")
    .option(
        "-m, --maxAmount <max amount>",
        "Max amount per transaction.",
        "10000")
    .parse(process.argv);

const count = parseInt(program.opts()["count"]);
const interval = parseInt(program.opts()["interval"]);
const maxAmount = parseInt(program.opts()["maxAmount"]);

console.log(`Simulating ${count} transactions with a max value of ${maxAmount} every ${interval} seconds`);
runSimulator(count, maxAmount, interval);
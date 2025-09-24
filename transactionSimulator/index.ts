import axios, {AxiosResponse} from 'axios';
import {randomInt} from "node:crypto";

const DEFAULT_MAX_AMOUNT = 10_000;

interface Business {
    id: number;
    business_id: string;
    name: string;
    industry: string;
}

async function run() {
    // Process command line arguments
    let numTransactions: number;
    let maxAmount: number = DEFAULT_MAX_AMOUNT;
    try {
        numTransactions = parseInt(process.argv[2]);
        if (process.argv.length >= 4) maxAmount = parseInt(process.argv[3]);
    } catch (error) {
        console.error("Error parsing args, see readme for proper usage:", error);
        return;
    }

    // Get existing businesses
    let businessIds: string[] = []
    try {
        const businessesResponse = await axios.get('http://localhost:3001/api/businesses');
        businessesResponse?.data['data'].forEach((b: Business) => {
            businessIds.push(b.business_id);
        });
    } catch (error) { //todo: strict error types
        console.error("Error during /businesses call:", error);
    }

    // Create random transactions
    createTransactions(businessIds, numTransactions, maxAmount)
        .then(() => console.log("Successfully created transactions"))
        .catch(error => console.error("Failed while creating transactions:", error));
}

function createTransactions(businessIds: string[], count: number, maxAmount: number) {
    const requests: Promise<AxiosResponse>[] = [];
    for (let i = 0; i < count; ++i) {
        let from = getRandomInt(businessIds.length);
        let to: number;
        do {
            to = getRandomInt(businessIds.length);
        } while (to == from);

        // TODO: batching on server side
        requests.push(
            axios.post('http://localhost:3001/api/transactions',
                {
                    from: businessIds[from],
                    to: businessIds[to],
                    amount: randomInt(maxAmount),
                    timestamp: Date.now(),
                }
            )
        );
    }
    return Promise.all(requests);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

run();
import axios, {AxiosResponse} from 'axios';
import {randomInt} from "node:crypto";

//TODO: pull into config
const HOST: string = "http://host.docker.internal:3001";
// const HOST: string = "http://localhost:3001";

interface Business {
    business_id: string;
}

export async function runSimulator(numTransactions: number, maxAmount: number, interval: number) {
    do {
        runTransactions(numTransactions, maxAmount);
        await new Promise(r => setTimeout(r, 1000 * interval));
    } while (interval > 0)
}

async function runTransactions(numTransactions: number, maxAmount: number) {
    // Get existing businesses
    let businessIds: string[] = []
    try {
        const businessesResponse = await axios.get(`${HOST}/api/businesses`);
        businessesResponse?.data['data'].forEach((b: Business) => {
            businessIds.push(b.business_id);
        });
    } catch (error) {
        //TODO: strict error types and retries
        console.error("Error during /businesses call:", error);
    }

    // Create random transactions
    createTransactions(businessIds, numTransactions, maxAmount)
        .then(() => console.log(`Created ${numTransactions} transactions`))
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

        //TODO: batching on server side
        requests.push(
            axios.post(`${HOST}/api/transactions`,
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

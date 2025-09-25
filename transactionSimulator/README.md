# Run the transaction simulator

Build image
```
cd transactionSimulator
docker build -t simulator .
```

Create container, run program, remove container
```
docker run --rm simulator -- [options]

Options:
  -V, --version                 output the version number
  -c, --count <count>           Number of transactions to create. (default: 1)
  -i, --interval <interval>     Interval in seconds at which transactions will be created. If not specified, it will be run only once. (default: 0)
  -m, --maxAmount <max amount>  Max amount per transaction. (default: 10000)
  -h, --help                    output usage information

```

Build and run once
```
docker build -t simulator . && docker run --rm simulator

```
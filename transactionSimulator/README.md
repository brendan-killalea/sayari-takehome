# Run the transaction simulator
### Build image
```
cd transactionSimulator
docker build -t simulator .
```

### Create container, run program, remove container
```
docker run --rm simulator <number or transactions> [optional max transaction amount]
```
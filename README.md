# Senior Full Stack Engineer Assessment

**Please be sure that you do not fork this repo, or try to commit changes to it. Once you have read this brief, go to the [setup guide](SETUP.md) to get started.** 

This assessment allows you to demonstrate your ability to build or modify features in an existing codebase. You'll be working with a React/TypeScript frontend and a Node/Express/SQLite backend that records transactions between businesses. 

The scope is designed to take around 4-5 hours to complete; please plan the tasks with this in mind.


## Overview

<img width="1774" height="925" alt="Screenshot 2025-08-20 at 11 51 08 AM" src="https://github.com/user-attachments/assets/24e92ebe-d7c0-4386-be8a-7e30b9dcedc0" />

This is an example real-time business transaction monitoring application that visualizes financial transactions between businesses. The application displays transaction data in both tabular and graph formats, providing insights into business relationships and transaction patterns.

Note that the codebase is not perfect; feel free to refactor areas outside of the scope of your tasks if it helps you to achieve your goal.

## Deliverables

1. Clone the repo: Please do not fork the repo; instead clone into your own github repo.

2. User Stories: There are 3 Issues to choose from, **you only need to complete 2 of them**, however your submission should contain one frontend and one backend story. You can find these user stories in the [issues](https://github.com/sayari-puzzles/app-eng-mid-takehome/issues) tab of this GitHub repository.

3. Commit your solutions to your repo, and share the link with your recruiter.

The team will assess your submission and get back to you with next steps.

## Context

### Architecture

The application consists of:
- **Frontend**: React application with Material-UI components
- **Backend**: Node.js/Express API server
- **Databases**: 
  - SQLite for business metadata (name, industry)
  - Memgraph for transaction graph data

### Features

- **Real-time Transaction Monitoring**: View transactions as they happen with live updates via WebSocket connections
- **Business Overview**: See all businesses with their industries and transaction counts
- **Transaction Details**: Detailed view of all transactions including sender, receiver, amount, and timestamp
- **Visual Graph**: Interactive graph visualization showing business relationships and transaction flows


### Generating Data

One of your tasks will be to create a service to insert transaction data. It is recommended that you start with this task.

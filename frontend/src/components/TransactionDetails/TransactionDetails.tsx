import {useState, useEffect} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import {getSocket} from "../../services/socket";
import "./TransactionDetails.css";

type Transaction = {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
};

const TransactionDetailsTable = () => {
  const [transactionsData, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Transaction | null>(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Filter State
  const [timeRange, setTimeRange] = useState<{ start: string, end: string }>({
    start: '',
    end: ''
  });
  const [businessFromFilter, setBusinessFromFilter] = useState<string>('');
  const [businessToFilter, setBusinessToFilter] = useState<string>('');
  const [amountRange, setAmountRange] = useState<{ min: string, max: string }>({
    min: '',
    max: ''
  });

  // Sorting State - default to timestamp descending (newest first)
  const [sortBy, setSortBy] = useState<keyof Transaction>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Initial data fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/businesses/transactions/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // WebSocket connection for live updates
  useEffect(() => {
    // Get the shared socket instance
    const socket = getSocket();

    // Define event handler
    const handleGraphUpdate = async (data: any) => {
      if (data && data.newTransaction) {
        const transaction = data.newTransaction;

        // Add the new transaction to our data
        setData(prevData => {
          // Create a new array with the new transaction at the beginning
          const newData = [transaction, ...prevData];
          return newData;
        });

        // Set new transaction for highlighting
        setNewTransaction(transaction);

        // Clear the highlight effect after 3 seconds
        setTimeout(() => {
          setNewTransaction(null);
        }, 3000);
      }
    };

    // Register event listener
    socket.on('graphUpdate', handleGraphUpdate);

    // Cleanup: remove event listener on unmount
    return () => {
      socket.off('graphUpdate', handleGraphUpdate);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Handle Pagination Changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Format Timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format Amount as Dollar
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle Sorting
  const handleSort = (property: keyof Transaction) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  // Apply Filtering and Sorting
  const filteredAndSortedData = [...transactionsData]
    .filter(transaction => {
      // Time range filter
      if (timeRange.start && new Date(transaction.timestamp) < new Date(timeRange.start)) return false;
      if (timeRange.end && new Date(transaction.timestamp) > new Date(timeRange.end)) return false;

      // Business name filter
      if (businessFromFilter && !transaction.from.toLowerCase().includes(businessFromFilter.toLowerCase())) return false;
      if (businessToFilter && !transaction.to.toLowerCase().includes(businessToFilter.toLowerCase())) return false;

      // Amount range filter
      if (amountRange.min && transaction.amount < parseFloat(amountRange.min)) return false;
      if (amountRange.max && transaction.amount > parseFloat(amountRange.max)) return false;

      return true;
    })
    .sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      // Special handling for timestamp (date) sorting
      if (sortBy === "timestamp") {
        const dateA = new Date(valueA as string).getTime();
        const dateB = new Date(valueB as string).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });

  // Paginated Data
  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="transaction-details-container">

      {/* Header Section */}
      <Box className="header-section">
        <Typography sx={{fontWeight: "bold"}}>
          Transactions
        </Typography>
      </Box>

      {/* Filter Section */}
      <TableContainer>
        <Table
          aria-label="Filter Table"
          size="small"
          className="filter-table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Time Range</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="datetime-local"
                  value={timeRange.start}
                  onChange={(e) => {
                    setTimeRange(prev => ({...prev, start: e.target.value}));
                    setPage(0);
                  }}
                  />
              </TableCell>
              <TableCell>
                <input
                  type="datetime-local"
                  value={timeRange.end}
                  onChange={(e) => {
                    setTimeRange(prev => ({...prev, end: e.target.value}));
                    setPage(0);
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Business From and To</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={businessFromFilter}
                  onChange={(e) => {
                    setBusinessFromFilter(e.target.value);
                    setPage(0);
                  }}
                  placeholder="From business name"
                  style={{width: '100%'}}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={businessToFilter}
                  onChange={(e) => {
                    setBusinessToFilter(e.target.value);
                    setPage(0);
                  }}
                  placeholder="To business name"
                  style={{width: '100%'}}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Amount Range</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  value={amountRange.min}
                  onChange={(e) => {
                    setAmountRange(prev => ({...prev, min: e.target.value}));
                    setPage(0);
                  }}
                  placeholder="Min"
                  style={{width: '100%'}}
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  value={amountRange.max}
                  onChange={(e) => {
                    setAmountRange(prev => ({...prev, max: e.target.value}));
                    setPage(0);
                  }}
                  placeholder="Max"
                  style={{width: '100%'}}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <button
                  onClick={() => {
                    setTimeRange({start: '', end: ''});
                    setBusinessFromFilter('');
                    setBusinessToFilter('');
                    setAmountRange({min: '', max: ''});
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1d6e6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Reset All Filters
                </button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>


      {/* Table Section */}
      <TableContainer component={Paper} className="table-container">
        <Table
          aria-label="Detailed Transactions Table"
          size="small"
          className="transaction-table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "timestamp"}
                  direction={sortDirection}
                  onClick={() => handleSort("timestamp")}
                  // Set to active by default to show sort direction
                  sx={{'& .MuiTableSortLabel-icon': {opacity: 1}}}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "from"}
                  direction={sortDirection}
                  onClick={() => handleSort("from")}
                >
                  From
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "to"}
                  direction={sortDirection}
                  onClick={() => handleSort("to")}
                >
                  To
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === "amount"}
                  direction={sortDirection}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              // Check if this is the new transaction that just came in
              const isNewTransaction = newTransaction &&
                row.from === newTransaction.from &&
                row.to === newTransaction.to &&
                row.amount === newTransaction.amount &&
                row.timestamp === newTransaction.timestamp;

              return (
                <TableRow
                  key={index}
                  className={isNewTransaction ? 'new-transaction-row' : ''}
                >
                  <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                  <TableCell>{row.from}</TableCell>
                  <TableCell>{row.to}</TableCell>
                  <TableCell align="right">{formatAmount(row.amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TransactionDetailsTable;

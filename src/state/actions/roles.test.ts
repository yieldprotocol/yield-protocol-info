import { eventSort } from './roles'


const eventMocksSorted = [
  {
    blockNumber: 0,
    transactionIndex: 0,
    logIndex: 0,
  },
  {
    blockNumber: 0,
    transactionIndex: 1,
    logIndex: 0,
  },
  {
    blockNumber: 0,
    transactionIndex: 1,
    logIndex: 1,
  },
  {
    blockNumber: 0,
    transactionIndex: 1,
    logIndex: 2,
  },
  {
    blockNumber: 1,
    transactionIndex: 1,
    logIndex: 0,
  },
  {
    blockNumber: 1,
    transactionIndex: 2,
    logIndex: 0,
  },
  {
    blockNumber: 2,
    transactionIndex: 0,
    logIndex: 0,
  },
  {
    blockNumber: 3,
    transactionIndex: 0,
    logIndex: 0,
  },
  {
    blockNumber: 3,
    transactionIndex: 0,
    logIndex: 1,
  },
  {
    blockNumber: 3,
    transactionIndex: 0,
    logIndex: 2,
  },
]

const eventMocksUnsorted = [9, 2, 3, 7, 1, 4, 0, 8, 5, 6].map(idx => eventMocksSorted[idx])

test('eventSort sorts by block => transactionIndex => logIndex', () => {
  expect(eventMocksUnsorted.sort(eventSort)).toEqual(eventMocksSorted);
});
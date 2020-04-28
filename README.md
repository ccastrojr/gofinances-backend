# Transaction APP Backend

## Availiable Scripts

```
build - Compile typescript files
dev:server - Run test server
test - Run tests
typeorm - Run TypeOrm CLI
start - Start test server
```

### Testing specification

- **`should be able to create a new transaction`**: For this test to pass, the application must allow a transaction to be created, and return a json with the created transaction.

* **`should create tags when inserting new transactions`**: For this test to pass, the application must allow that when creating a new transaction with a category that does not exist, it is created and inserted in the category_id field of the transaction with the `id` just created.

- **`should not create tags when they already exists`**: For this test to pass, the application must allow that when creating a new transaction with a category that already exists, it is assigned to the category_id field of the transaction with the `id` of that existing category, not allowing the creation of categories with the same` title `.

* **`should be able to list the transactions`**: For this test to pass, the application must allow an array of objects to be returned containing all transactions along with the balance of income, outcome and total transactions that have been created so far.

- **`should not be able to create outcome transaction without a valid balance`**: For this test to pass, the application must not allow a transaction of the `outcome` type to exceed the total amount the user has in cash (total income), returning a response with HTTP 400 code and an error message in the following format : `{error: string}`.

* **`should be able to delete a transaction`**: For this test to pass, you must allow your delete route to delete a transaction, and when deleting it, it returns an empty response, with status 204.

- **`should be able to import transactions`**: For this test to pass, your application must allow a csv file to be imported (model below). With the imported file, you must allow all records and categories that were present in that file to be created in the database, and return all transactions that were imported.

**Important**: To run the test you must create a database named __"gostack_desafio06_tests"__.

// Load saved data

let transactions =
    JSON.parse(
        localStorage.getItem(
            "transactions"
        )
    ) || [];


let monthlyBudget =
    Number(
        localStorage.getItem(
            "budget"
        )
    ) || 0;


let expenseChart;


// Set Budget

function setBudget() {


    const budgetInput =
        Number(
            document
                .getElementById(
                    "budget"
                )
                .value
        );


    if (budgetInput <= 0) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    monthlyBudget =
        budgetInput;


    localStorage.setItem(
        "budget",
        monthlyBudget
    );


    updateDashboard();

}



// Add Transaction

function addTransaction() {


    const description =
        document
            .getElementById(
                "description"
            )
            .value;


    const amount =
        Number(
            document
                .getElementById(
                    "amount"
                )
                .value
        );


    const type =
        document
            .getElementById(
                "type"
            )
            .value;


    const category =
        document
            .getElementById(
                "category"
            )
            .value;



    if (
        description === "" ||
        amount <= 0
    ) {


        alert(
            "Please enter valid details."
        );


        return;

    }



    const transaction = {


        id:
            Date.now(),


        description:
            description,


        amount:
            amount,


        type:
            type,


        category:
            category

    };



    transactions.push(
        transaction
    );



    saveData();



    document
        .getElementById(
            "description"
        )
        .value = "";


    document
        .getElementById(
            "amount"
        )
        .value = "";



    updateDashboard();


    displayTransactions();


    updateChart();

}



// Update Dashboard

function updateDashboard() {


    let income = 0;

    let expenses = 0;



    transactions.forEach(
        function(transaction) {


            if (
                transaction.type
                === "income"
            ) {


                income +=
                    transaction.amount;


            } else {


                expenses +=
                    transaction.amount;


            }

        }
    );



    const balance =
        income -
        expenses;



    const budgetRemaining =
        monthlyBudget -
        expenses;



    document
        .getElementById(
            "total-income"
        )
        .textContent =
        "₹" + income;



    document
        .getElementById(
            "total-expenses"
        )
        .textContent =
        "₹" + expenses;



    document
        .getElementById(
            "balance"
        )
        .textContent =
        "₹" + balance;



    document
        .getElementById(
            "monthly-budget"
        )
        .textContent =
        "₹" +
        monthlyBudget;



    document
        .getElementById(
            "budget-remaining"
        )
        .textContent =
        "₹" +
        budgetRemaining;



    // Progress Bar


    let percentage = 0;


    if (
        monthlyBudget > 0
    ) {


        percentage =
            (
                expenses /
                monthlyBudget
            ) *
            100;


        if (
            percentage > 100
        ) {

            percentage = 100;

        }

    }



    document
        .getElementById(
            "budget-progress"
        )
        .style.width =
        percentage +
        "%";



    const message =
        document
            .getElementById(
                "budget-message"
            );



    if (
        monthlyBudget === 0
    ) {


        message.textContent =
            "Set a budget to start tracking.";


    } else if (
        expenses >
        monthlyBudget
    ) {


        message.textContent =
            "⚠️ You have exceeded your budget!";


    } else {


        message.textContent =
            "✅ You are within your budget.";

    }

}



// Display Transactions

function displayTransactions() {


    const list =
        document
            .getElementById(
                "transaction-list"
            );


    const search =
        document
            .getElementById(
                "search"
            )
            .value
            .toLowerCase();



    list.innerHTML = "";



    const filteredTransactions =
        transactions.filter(
            function(transaction) {


                return (

                    transaction
                        .description
                        .toLowerCase()
                        .includes(
                            search
                        )

                    ||

                    transaction
                        .category
                        .toLowerCase()
                        .includes(
                            search
                        )

                );

            }
        );



    filteredTransactions.forEach(
        function(transaction) {


            const li =
                document
                    .createElement(
                        "li"
                    );



            li.className =
                "transaction";



            li.innerHTML = `


                <div>

                    <strong>

                        ${transaction.description}

                    </strong>


                    <br>


                    <small>

                        Category:
                        ${transaction.category}

                    </small>

                </div>



                <span
                    class="${transaction.type}"
                >

                    ${
                        transaction.type
                        === "income"
                        ? "+"
                        : "-"
                    }

                    ₹${transaction.amount}

                </span>



                <div>


                    <button
                        class="edit-btn"
                        onclick="
                            editTransaction(
                                ${transaction.id}
                            )
                        "
                    >

                        Edit

                    </button>



                    <button
                        class="delete-btn"
                        onclick="
                            deleteTransaction(
                                ${transaction.id}
                            )
                        "
                    >

                        Delete

                    </button>


                </div>


            `;



            list.appendChild(
                li
            );

        }
    );

}



// Delete Transaction

function deleteTransaction(
    id
) {


    transactions =
        transactions.filter(
            function(transaction) {


                return (
                    transaction.id
                    !== id
                );

            }
        );



    saveData();


    updateDashboard();


    displayTransactions();


    updateChart();

}



// Edit Transaction

function editTransaction(
    id
) {


    const transaction =
        transactions.find(
            function(transaction) {


                return (
                    transaction.id
                    === id
                );

            }
        );



    const newDescription =
        prompt(
            "Enter new description:",
            transaction.description
        );



    if (
        newDescription === null
    ) {

        return;

    }



    const newAmount =
        Number(
            prompt(
                "Enter new amount:",
                transaction.amount
            )
        );



    if (
        newAmount <= 0
    ) {


        alert(
            "Invalid amount."
        );


        return;

    }



    transaction.description =
        newDescription;


    transaction.amount =
        newAmount;



    saveData();


    updateDashboard();


    displayTransactions();


    updateChart();

}



// Save Data

function saveData() {


    localStorage.setItem(

        "transactions",

        JSON.stringify(
            transactions
        )

    );

}



// Expense Chart

function updateChart() {


    const categories = {};


    transactions.forEach(
        function(transaction) {


            if (
                transaction.type
                === "expense"
            ) {


                if (
                    categories[
                        transaction.category
                    ]
                    === undefined
                ) {


                    categories[
                        transaction.category
                    ] = 0;

                }



                categories[
                    transaction.category
                ] +=
                    transaction.amount;

            }

        }
    );



    const ctx =
        document
            .getElementById(
                "expenseChart"
            );



    if (
        expenseChart
    ) {


        expenseChart.destroy();

    }



    expenseChart =
        new Chart(
            ctx,
            {

                type:
                    "doughnut",


                data:
                    {

                        labels:
                            Object.keys(
                                categories
                            ),


                        datasets:
                            [

                                {

                                    data:
                                        Object.values(
                                            categories
                                        )

                                }

                            ]

                    },


                options:
                    {

                        responsive:
                            true

                    }

            }
        );

}



// Load App

updateDashboard();

displayTransactions();

updateChart();
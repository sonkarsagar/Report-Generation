const amount = document.getElementById("expense");
const description = document.getElementById("description");
const category = document.getElementById("category");
const list = document.getElementById("list");
const submit = document.getElementById("submit");
const premium = document.getElementById("premium");
const logOut = document.getElementById("logout");
const tBody = document.getElementById("tbody");
const download=document.getElementById('download')

logOut.addEventListener("click", (e) => {
  e.preventDefault()
  location.replace("http://127.0.0.1:5501/logIn/login.html");
  localStorage.removeItem("token");
});

download.addEventListener('click',(e)=>{
  e.preventDefault()
  axios
    .get("http://127.0.0.1:3000/expense/download", {
      headers: { Authorization: localStorage.getItem("token") },
    }).then((result) => {
    location.replace(result.data.Location)
  }).catch((err) => {
    console.log(err);
  });
})

premium.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .get("http://127.0.0.1:3000/expense/premium", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      let options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: function (response) {
          axios.post(
            "http://127.0.0.1:3000/expense/successTransaction",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: localStorage.getItem("token") } }
          );
          alert("You are a Premium User");
          location.replace("http://127.0.0.1:5501/loggedIn/premiumIndex.html");
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on("payment.failed", function (response) {
        axios.post(
          "http://127.0.0.1:3000/expense/failTransaction",
          {
            order_id: options.order_id,
          },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        alert("Something went wrong");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

submit.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .post(
      "http://127.0.0.1:3000/expense",
      {
        date: new Date().toString().slice(4, 15),
        description: description.value,
        category: category.value,
        amount: amount.value,
      },
      { headers: { Authorization: localStorage.getItem("token") } }
    )
    .then((res) => {
      const deleteb = document.createElement("button");
      deleteb.setAttribute("class", "btn btn-danger btn-sm");
      deleteb.setAttribute("type", "button");
      deleteb.appendChild(document.createTextNode("Delete"));

      const tableRow = document.createElement("tr");
      tableRow.setAttribute("id", res.data.id);

      const date = document.createElement("td");
      date.appendChild(document.createTextNode(res.data.date));

      const cdescreption = document.createElement("td");
      cdescreption.appendChild(document.createTextNode(res.data.description));

      const ccategory = document.createElement("td");
      ccategory.appendChild(document.createTextNode(res.data.category));

      const income = document.createElement("td");
      income.appendChild(document.createTextNode(res.data.income));

      const expense = document.createElement("td");
      expense.appendChild(document.createTextNode(res.data.expense));

      const kuchBhi = document.createElement("td");
      kuchBhi.appendChild(deleteb);

      tableRow.appendChild(date);
      tableRow.appendChild(cdescreption);
      tableRow.appendChild(ccategory);
      tableRow.appendChild(income);
      tableRow.appendChild(expense);
      tableRow.appendChild(kuchBhi);

      tBody.appendChild(tableRow);
    })
    .catch((err) => {
      console.log(err);
    });
});

tBody.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e.target.parentElement.parentElement);
  if (e.target.classList.contains("btn-danger")) {
    tbody.removeChild(e.target.parentElement.parentElement);

    axios
      .delete(
        `http://127.0.0.1:3000/expense/${e.target.parentElement.parentElement.id}`
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://127.0.0.1:3000/user", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      if (result.data[0].premiumUser == true) {
        location.replace("http://127.0.0.1:5501/loggedIn/premiumIndex.html");
      }
    })
    .catch((err) => {
      console.log(err);
    });
 
  axios
    .get("http://127.0.0.1:3000/expense", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((res) => {
      res.data.forEach((element) => {
        const deleteb = document.createElement("button");
        deleteb.setAttribute("class", "btn btn-danger btn-sm");
        deleteb.setAttribute("type", "button");
        deleteb.appendChild(document.createTextNode("Delete"));

        const tableRow = document.createElement("tr");
        tableRow.setAttribute("id", element.id);

        const date = document.createElement("td");
        date.appendChild(document.createTextNode(element.date));

        const cdescreption = document.createElement("td");
        cdescreption.appendChild(document.createTextNode(element.description));

        const ccategory = document.createElement("td");
        ccategory.appendChild(document.createTextNode(element.category));

        const income = document.createElement("td");
        income.appendChild(document.createTextNode(element.income));

        const expense = document.createElement("td");
        expense.appendChild(document.createTextNode(element.expense));

        const kuchBhi = document.createElement("td");
        kuchBhi.appendChild(deleteb);

        tableRow.appendChild(date);
        tableRow.appendChild(cdescreption);
        tableRow.appendChild(ccategory);
        tableRow.appendChild(income);
        tableRow.appendChild(expense);
        tableRow.appendChild(kuchBhi);

        tBody.appendChild(tableRow);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/Order")

    .then((response) => {
      let content = "";
      let parent = document.getElementById("orderItems");
      let child = document.createElement("div");
      child.className = "orderCont";
      for (let i = 39; i < response.data.data.length; i++) {
        let orderId = response.data.data[i].Orders.id;
        let productName;
        let productPrice;
        let products = response.data.data[i].Products;
        for (let j = 0; j < products.length; j++) {
          productName = response.data.data[i].Products[j].title;
          productPrice = response.data.data[i].Products[j].price;
          content = `<div class='orderTable'>
          
                 <div class="orderId"><span class='orderEle'>${orderId}</span></div>
                 <div class="orderName"><span class='orderEle'>${productName}</span></div>
                 <div class="orderPrice"><span class='orderEle'>${productPrice}</span></div>
                
                </div>`;

          child.innerHTML += content;
          parent.append(child);
        }
      }
    })
    .catch(err)
});

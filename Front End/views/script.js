let c = 0;
let cc = 1;
let pag = document.getElementById('pagination');

// Show products on front end

window.addEventListener("DOMContentLoaded", () => {
  axios.get("http://localhost:3000/limited?page=0")
  .then((productInfo) => {
    console.log(productInfo)
    if (productInfo.request.status === 200) {
      let products = productInfo.data.products;
      let childHTML = "";
      let parent = document.getElementById("products");
    
      products.forEach((product) => {
         childHTML += ` <div class="albums">
                <input type="hidden" id="hidden" value="${product.id}">
                <h3 class="title">${product.title}</h3>
                <img
                  class="images"
                  src="${product.imageUrl}"
                  alt="${product.title}"
                />
                <div class="price">
                  <h4 class="amount">${product.price}$</h4>
                  <button class="addcart" onclick="addtocart(${product.id})">Add to Cart</button>
                  
                </div>
              </div>`;

        });
        parent.innerHTML = childHTML;
    }
  })
  .catch(err=> notifyusers(err))
  showingCart();
  pagination()
  
 
});

function pagination(e) {
  axios.get("http://localhost:3000/products")
  .then((productInfo)=>{
    let number_of_pages;
    if(productInfo.data.products.length % 2 == 0) {
       number_of_pages = Math.trunc(((productInfo.data.products.length)/2))
    } else {
       number_of_pages = Math.trunc(((productInfo.data.products.length)/2)+1)
    }
   
    for (let i = 0; i < number_of_pages; i++) {
      pag.innerHTML += `<button class="pagebtn" id="?page=${c++}">${cc++}</button> `;
    }
  })
  .catch(err=> notifyusers(err))
}

pag.addEventListener('click', (e)=>{
  let id = e.target.id;
  console.log(id)
  axios.get(`http://localhost:3000/limited${id}`)
  .then(productInfo=>{
    let products = productInfo.data.products;
     let childHTML="";
      let parent = document.getElementById("products");
      // console.log(products,parent)
      products.forEach((product) => {
         childHTML += ` <div class="albums">
                <input type="hidden" id="hidden" value="${product.id}">
                <h3 class="title">${product.title}</h3>
                <img
                  class="images"
                  src="${product.imageUrl}"
                  alt="${product.title}"
                />
                <div class="price">
                  <h4 class="amount">${product.price}$</h4>
                  <button class="addcart" onclick="addtocart(${product.id})">Add to Cart</button>
                  
                </div>
              </div>`;

        
      });
      parent.innerHTML = childHTML;
  })
  .catch(err=> notifyusers(err))
})

function addtocart(productId) {
 let albums = document.querySelectorAll('.albums')


//  for(let i=0;i<albums.length;i++) {
//  if(productId == albums[i].querySelector('#hidden').value)
//  {
//   return alert('Product Already Exists')
//  }
//  } 
  axios
    .post("http://localhost:3000/cart", { productId: productId })
    .then((response) => {
      
      if (response.status === 200) {
        showingCart();
        notifyusers(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      notifyusers(err);
    });
}

function notifyusers(message) {
  alert(message)
}

function showingCart() {
  axios
    .get("http://localhost:3000/cart")
    .then((data) => {
      if (data.status === 200) {
        let products = data.data.products;
        
        let cartItems = document.getElementsByClassName("cart-items")[0];
        cartItems.innerHTML = ''
        // console.log(cartItems)
        products.forEach((product) => {
          let cartRow = document.createElement("div");
           cartRow.className = "cart-row2";
           
          let content = ` <div class="cart-item cart-column">
               <div class="divider">
               <img class="cart-item-image" src=${product.imageUrl} width="100" height="100">
               
               <span class="cart-item-title">${product.title}</span>
               </div>
               <span class="cart-price cart-column">${product.price}</span>
               <div class="cart-quantity cart-column">
               <input class="cart-quantity-input" type="number" value="${product.cartItem.quantity}" change="addtocart${product.id}">
              
               <button class="btn btn-danger" type="button" onclick="removeItem(${product.id})">REMOVE</button>
               </div>
               </div>`;

          cartRow.innerHTML = content;
          cartItems.append(cartRow);
        });

        
       
        updateCartTotal();
        qtyChanged()
        
      } else {
        throw new Error("Something went wrong");
      }
    })
    .catch((err) => {
      notifyusers(err);
    });
}



// removing item from cart

function removeItem(productId) {
  // console.log(productId)
 axios.delete(`http://localhost:3000/cart-delete-item/${productId}`)
 .then(response=>{
  showingCart()
  updateCartTotal()
 })
}

function qtyChanged() {
  let qtyval = document.getElementsByClassName("cart-quantity-input");
  // console.log(qtyval)
  for (let i = 0; i < qtyval.length; i++) {
    let qty = qtyval[i];
    qty.addEventListener("change", quantityChanges);
  }
}

function quantityChanges(event) {
  let value = event.target;
  if (isNaN(value.value) || value.value <= 0) {
    value.value = 1;
  }

  updateCartTotal();
}

// updating cart total

function updateCartTotal() {
  let cartItems = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItems.querySelectorAll(".cart-row2");
  // console.log(cartRows)
  let total = 0;
  for (
    let i = 0;
    i < cartRows.length;
    i++
  ) {
    total +=
      Number(
        cartRows[i].querySelector(".cart-price").innerText
      ) *
      Number(
        cartRows[i].querySelector(".cart-quantity-input").value
      );
  }
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
  // console.log(document.getElementsByClassName("cart-total-price")[0].innerText);
}

// cart pop-up model

let open = document.getElementsByClassName("seecart");
const close = document.getElementById("close");
const container = document.getElementById("container");

for (let i = 0; i < open.length; i++) {
  let btn = open[i];
  btn.addEventListener("click", showcart);
}

function showcart() {
  container.classList.add("active");
}

close.addEventListener("click", () => {
  container.classList.remove("active");
});


// Purchase Button

let purchasebtn =  document.getElementById('purchasebtn')

purchasebtn.addEventListener('click',()=>{
axios.post('http://localhost:3000/Order',{cartId:1})
.then(response=>{
  let orderId=response.data.data[0][0].orderId
  alert(`Your Order has been successfully placed with order Id ${orderId}, Thanks for Shopping from The Biker Zone`)
  showingCart()
  updateCartTotal()
})
})




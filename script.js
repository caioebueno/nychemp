
var firebaseConfig = {
    apiKey: "AIzaSyC3bX7CaBDPOTTzzqWJpdDk2BSBO0hsh_0",
    authDomain: "nyc-hemp.firebaseapp.com",
    databaseURL: "https://nyc-hemp.firebaseio.com",
    projectId: "nyc-hemp",
    storageBucket: "nyc-hemp.appspot.com",
    messagingSenderId: "566563586804",
    appId: "1:566563586804:web:2c838945fa9d4014ad94a1",
    measurementId: "G-9K24GN8XSD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



//UNIVERSAL FUNCTION

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function  newObjVar(response){
    
    var y = 0;

    var obj = {};
    
    for (el in response) {

        obj[y] = response[el];
        y++;

    }
    return obj
}

//use index on a object ->

function  indexObj(response){
    
    var y = 0;
    
    for (el in response) {

        response[y] = response[el];
        y++;

    }
}

//checks if has more of the same number on a array

function arrayCount(array){

    var obj = {};

    for(x = 0; x < array.length; x++){

        var count = 0;
        var currentIten = array[x];
        
        for(y = 0; y < array.length; y++){

            if(currentIten == array[y]){
            
                count = count + 1;
            }else{
                
                obj[currentIten] = 0;
            }

        }
        obj[currentIten] = count;

    }

    return obj;

}

// get keys by value 

function getKeyByValue(object, value) { 

    return Object.keys(object).find(key =>  
            object[key] === value); 

} 



//DISPLAY PRODUCTS ON SHOP

 function displayProducts(){

    var starCountRef = firebase.database().ref('products');
    starCountRef.on('value', async function(snapshot) {
        
    
    var response = snapshot.val();
    var y = 0;
        
   var responseEl = newObjVar(response);
   console.log( Object.keys(response).length);
   console.log(response);
   console.log(responseEl);

        for(i = 0; i < Object.keys(response).length; i++){

            
            var imgUrl = responseEl[i].img;
            var storageRef = firebase.storage().ref("img/" + imgUrl + "");
            var title = responseEl[i].name;
            var price = responseEl[i].price;
            var desc = responseEl[i].desc;
            
           
        
            console.log(title);     
            var productDiv = document.createElement("div");
            productDiv.setAttribute("class", "col-lg-6 col-12 row align-items-center justify-content-center");
            var dataName = "getAttribute('data-name')";
            var id = i;
            var innerText = "<div class='col-md-6 col-12 align-self-center cellCenter'><img class='imgProductB' id='imgProductB' src='" + imgUrl  + "' alt=''></div><div class='col-md-5 col-12 cellCenter' id='infoDiv'><div class='row prodcutNameRow productPadding' id='prodcutNameRow'>" + title + "</div><div class='row productPriceRow productPadding' id='productPriceRow'>" + price + "</div><div class='row productDescRow productPadding' id='productDescRow'>" + desc + "</div><div class='row productBtnRow productPadding' ><button id='" + id + "' onclick='showProduct(event, this.id)' class='productBtn'>See product</button></div></div>";
            productDiv.innerHTML = innerText;
            var shopContainer = document.getElementById("shopContainer");
            shopContainer.append(productDiv);
            
        
    };    
        });
        

    };


if (document.title == "Shop"){
    displayProducts();
}   

if(document.title == "Log In"){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            location.replace("user.html");
        }else{

        }
})}

//LOG IN AND SIGN UP

function logIn(event){
    
    event.preventDefault();

    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;

    console.log(email);
    console.log(password);

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
       
        var errorCode = error.code;
        var errorMessage = error.message;
       
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        
          var email = user.email;
          console.log(email);
          location.replace("user.html")
          
        } else {

        }
      });
      

}

function signUp(event){

    event.preventDefault();

    var email = document.getElementById("emailSignUp").value;
    var password = document.getElementById("passwordSignUp").value;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        
        var errorCode = error.code;
        var errorMessage = error.message;
        
      });

}

function logOut(){
    firebase.auth().signOut()
    location.replace("login.html")
}

function userPage(){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        
          var email = user.email;
          console.log(email);
          var userInfo = document.getElementById("userInfo");
          userInfo.innerHTML = email + "<button class='btn btn-primary' onclick='logOut()' id='logOutBtn'>Log Out</button>";

          var orders = user.orders;
          console.log(orders);

          var starCountRef = firebase.database().ref('orders');
          starCountRef.on('value', async function(snapshot) {
          

            console.log(snapshot.val());
            var response = snapshot.val();
            indexObj(response);
            

           
             for(x = 0; x < Object.keys(response).length - 1; x++){
                 console.log(Object.keys(response).length)
                 var orederNumber = response[x];
                 if(response[x].email == user.email){

                    var container = document.getElementById("userOrders");
                    var div = document.createElement("div");
                    indexObj(response[x].Products);
                    var innerText = x + 1;

                    for(i = 0; i < Object.keys(response[x].Products).length/2; i++){

                    console.log(response[x].Products);
                    var text = response[x].Products[i].id + response[x].Products[i].quantity + response[x].price;
                    

                 }
                 div.innerHTML = innerText;
                 container.append(div);
             }
          }});
          
        } else {

        }
      });

}

if(document.title == "User"){
    userPage();
}


//SINGLE PRODUCT PAGE 

function showProduct(event, id){

    event.preventDefault();

    location.replace("product.html?id=" + id + "");
}

function singleProduct(){
    
    var productContainer = document.getElementById("productContainer");
    
    var starCountRef = firebase.database().ref('products');

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);

    var id = urlParams.get("id");
    console.log(id);
    starCountRef.on('value', async function(snapshot) {

        var response = snapshot.val();
        var y = 0;
    
        for (el in response) {

            response[y] = response[el];
            y++;

        }
        
        console.log(response[parseInt(id)]);

        var imgUrl = response[id].img;
        var name = response[id].name;
        var price = response[id].price;
        var desc = response[id].desc;
       
       

        
        var innerText =  "<div class='col-3'> <img src='" + imgUrl + "' class='singleImg' alt=''></div><div class='col-4 row align-items-center singleTextDiv'><div class='col-12'><H2 class='singleName'>" + name + "</H2></div><div class='col-12'><h4 class='singlePrice'>$8.50 - $15.75</h4></div><div class='col-12'><p>" + desc +"</p></div><div class='col-12'>size</div><div class='col-12'>" + price + "</div><div class='col-12'><button onclick='addToCart()' class='singleCartBtn'>Add to cart</button></div></div>"
        productContainer.innerHTML = innerText;
        console.log(url);
        
    });
}
if(document.title == "Product"){
    singleProduct();
}



//CART FUNCTIONS

function addToCart(){

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    var id = parseInt(urlParams.get("id"));

    console.log(id);
    var cart = localStorage.getItem("cart");
    if(cart == null){
        localStorage.setItem("cart", id);
    }
    else{
        localStorage.setItem("cart", id +  "," + cart);
    }

}

function showCart(){

    var totalPrice = 0;
    var itens = localStorage.getItem("cart");
    var itensArray = itens.split(",");
    var arrayCountVar = arrayCount(itensArray);
    console.log(arrayCountVar);
    var starCountRef = firebase.database().ref('products');
    starCountRef.on('value', function(snapshot) {

    var response = snapshot.val();
    indexObj(response);
    
    var table = document.getElementById("cartTable");
    var trTitle = document.createElement("tr");
    var thProduct = document.createElement("th");
    var thQuantity = document.createElement("th");
    var thPrice = document.createElement("th");
    thProduct.innerHTML = "Product";
    thQuantity.innerHTML = "Quantity";
    thPrice.innerHTML = "Price";
    trTitle.append(thProduct,thQuantity,thPrice);
    table.append(trTitle);
    
    
    for(var i = 0; i < Object.keys(arrayCountVar).length; i++){
        var jk = newObjVar(arrayCountVar);
        console.log(Object.keys(arrayCountVar).length);
        
        var keyId = Object.keys(arrayCountVar)[i];  
       
       
        var tr = document.createElement("tr");
        var nameTh = document.createElement("th");
        var priceTh = document.createElement("th");
        var quantity = document.createElement("th");
        quantity.innerHTML = jk[i];
        nameTh.innerHTML = response[parseInt(keyId)].name;
        priceTh.innerHTML = response[parseInt(keyId)].price.replace(",",".");
        tr.append(nameTh, quantity, priceTh);
        table.append(tr);
        
        var newPrice = parseFloat(response[parseInt(keyId)].price.replace(",",".")) * parseInt(jk[i]);
      
        totalPrice = totalPrice + newPrice;

    }
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.innerHTML = totalPrice;
    var thFill1 = document.createElement("th");
    var thFill2 = document.createElement("th");
    tr.append(thFill1, thFill2, th);
    table.append(tr);

    

});






function checkOut(){
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        
         var email = user.email;

         var starCountRef = firebase.database().ref('orders');
         starCountRef.once('value').then(async function(snapshot) {
         
            var response = snapshot.val();
            var products = localStorage.getItem("cart");
            var productsObj = arrayCount(localStorage.getItem("cart"));
            console.log(products);
            
            console.log(productsObj);
            
           
            console.log(parseInt(Object.keys(response).length) + 1);
            var idNum = parseInt(Object.keys(response).length) + 1;
            firebase.database().ref('orders/' + idNum).set({

                email: email,
                price: totalPrice,

              });

              indexObj(productsObj);
              console.log(Object.keys(productsObj).length);
            for(i = 0; i < Object.keys(productsObj).length/2; i++){
                
                
                
                firebase.database().ref('orders/' + idNum +  "/Products").push({
                    
                     id: getKeyByValue(productsObj, productsObj[i]),
                     quantity: productsObj[i],
                  });
            }

           

           
        }); 
        } else {
            console.log("error");
        }
      });

      
}
var checkOutBtn = document.getElementById("checkOutBtn");
      console.log(checkOutBtn);
        checkOutBtn.addEventListener("click",  checkOut);
}
if(document.title == "Cart"){
    showCart();
}



function clearCart(){

    localStorage.clear("cart");
    showCart();
}

var btnClearCart = document.getElementById("clearCart");
btnClearCart.addEventListener("click", clearCart);






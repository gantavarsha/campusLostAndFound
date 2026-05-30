// FIREBASE IMPORTS
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAoafBiph7yJTJlNcQZwW_7jW48OqEUCdg",
  authDomain: "campus-lost-and-found-e6bc4.firebaseapp.com",
  databaseURL: "https://campus-lost-and-found-e6bc4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "campus-lost-and-found-e6bc4",
  storageBucket: "campus-lost-and-found-e6bc4.firebasestorage.app",
  messagingSenderId: "1025912033313",
  appId: "1:1025912033313:web:5fa5a8a0b789b552125360",
  measurementId: "G-67WREB2M9D"
};


// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

console.log("Firebase Connected Successfully!");


// ==============================
// LOST ITEM FORM
// ==============================

const lostForm = document.getElementById("lostForm");

if (lostForm) {

lostForm.addEventListener("submit", async (e) => {

e.preventDefault();

const file =
document.getElementById("lostImage").files[0];

let imageURL = "";

if(file){

const formData = new FormData();

formData.append("file", file);

formData.append("upload_preset", "campus_upload");

const response = await fetch(
"https://api.cloudinary.com/v1_1/dofnes1kd/image/upload",
{
method:"POST",
body:formData
}
);

const data = await response.json();

imageURL = data.secure_url;

}

const itemData = {

type:"Lost",

status:"Pending",

name:
document.getElementById("lostName").value,

description:
document.getElementById("lostDescription").value,

location:
document.getElementById("lostLocation").value,

contact:
document.getElementById("lostContact").value,

date:
new Date().toLocaleString(),

image:imageURL

};
if(
!itemData.name ||
!itemData.description ||
!itemData.location ||
!itemData.contact
){
    Swal.fire(
      "Error",
      "Please fill all fields",
      "error"
    );
    return;
}

push(ref(db,"lostItems"), itemData);

Swal.fire({
icon:"success",
title:"Success!",
text:"Lost Item Submitted!"
});

lostForm.reset();

});
}



// ==============================
// FOUND ITEM FORM
// ==============================
const foundForm = document.getElementById("foundForm");
if (foundForm) {

foundForm.addEventListener("submit", async (e) => {

e.preventDefault();

const file =
document.getElementById("foundImage").files[0];

let imageURL = "";

if(file){

const formData = new FormData();

formData.append("file", file);

formData.append("upload_preset", "campus_upload");

const response = await fetch(
"https://api.cloudinary.com/v1_1/dofnes1kd/image/upload",
{
method:"POST",
body:formData
}
);

const data = await response.json();

imageURL = data.secure_url;

}

const itemData = {

type:"Found",

status:"Pending",

name:
document.getElementById("foundName").value,

description:
document.getElementById("foundDescription").value,

location:
document.getElementById("foundLocation").value,

contact:
document.getElementById("foundContact").value,

date:
new Date().toLocaleString(),

image:imageURL

};
if(
!itemData.name ||
!itemData.description ||
!itemData.location ||
!itemData.contact
){
    Swal.fire(
      "Error",
      "Please fill all fields",
      "error"
    );
    return;
}
push(ref(db,"foundItems"), itemData);

Swal.fire({
icon:"success",
title:"Success!",
text:"Found Item Submitted Successfully!"
});

foundForm.reset();

});
}


// ==============================
// DISPLAY ITEMS
// ==============================

const lostContainer =
document.getElementById("lostContainer");

const foundContainer =
document.getElementById("foundContainer");
if(lostContainer){

onValue(ref(db,"lostItems"), (snapshot)=>{

lostContainer.innerHTML = "";

snapshot.forEach((child)=>{

const item = child.val();
const key = child.key;

if(
!item ||
!item.name ||
!item.description ||
!item.location ||
!item.contact
){
return;
}

lostContainer.innerHTML += `


<div class="card"
data-type="Lost"
data-status="${item.status}">


<h2 style="color:red;">Lost Item</h2>

${item.image ?
`<img src="${item.image}" class="item-image">`
: ""}

<h3>${item.name}</h3>

<p><b>Description:</b> ${item.description}</p>

<p><b>Location:</b> ${item.location}</p>

<p><b>Status:</b> ${item.status}</p>

<p><b>Reported:</b> ${item.date}</p>

<p><b>Contact:</b> ${item.contact}</p>

<button class="claim-btn"
onclick="claimItem('${key}','lostItems')">
Claim Item
</button>

<button class="delete-btn"
onclick="deleteItem('${key}','lostItems')">
Remove
</button>

</div>

`;

});

});

}

// FOUND SECTION
if(foundContainer){

onValue(ref(db,"foundItems"), (snapshot)=>{

foundContainer.innerHTML = "";

snapshot.forEach((child)=>{

const item = child.val();
const key = child.key;

if(
!item ||
!item.name ||
!item.description ||
!item.location ||
!item.contact
){
return;
}

foundContainer.innerHTML += `

<div class="card"
data-type="Found"
data-status="${item.status}">

<h2 style="color:green;">Found Item</h2>

${item.image ?
`<img src="${item.image}" class="item-image">`
: ""}

<h3>${item.name}</h3>

<p><b>Description:</b> ${item.description}</p>

<p><b>Location:</b> ${item.location}</p>

<p><b>Status:</b> ${item.status}</p>

<p><b>Reported:</b> ${item.date}</p>

<p><b>Contact:</b> ${item.contact}</p>

<button class="claim-btn"
onclick="claimItem('${key}','foundItems')">
Claim Item
</button>

<button class="delete-btn"
onclick="deleteItem('${key}','foundItems')">
Remove
</button>

</div>

`;

});

});

}

// SEARCH FUNCTION

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup", ()=>{

const value =
searchInput.value.toLowerCase();

const cards =
document.querySelectorAll(".card");

cards.forEach((card)=>{

card.style.display =
card.innerText.toLowerCase().includes(value)
? "block"
: "none";

});

});

}


// ==============================
// ADMIN PANEL
// ==============================

const lostAdminItems =
document.getElementById("lostAdminItems");

const foundAdminItems =
document.getElementById("foundAdminItems");
// ==============================
// ADMIN PANEL
// ==============================

if(lostAdminItems && foundAdminItems){

let totalLost = 0;
let totalFound = 0;
let recovered = 0;
let pending = 0;


// LOST ITEMS
onValue(ref(db,"lostItems"), (snapshot)=>{

lostAdminItems.innerHTML = "";

totalLost = 0;
recovered = 0;
pending = 0;

snapshot.forEach((child)=>{

const item = child.val();

const key = child.key;

totalLost++;

if(item.status === "Claimed"){

recovered++;

}
else{

pending++;

}

lostAdminItems.innerHTML += `

<div class="admin-card">

<h2>Lost Item</h2>

<h3>${item.name}</h3>

<p>${item.description}</p>

<p><b>Status:</b> ${item.status}</p>

<button class="claim-btn"
onclick="claimItem('${key}','lostItems')">

Claim Item

</button>

<button class="delete-btn"
onclick="deleteItem('${key}','lostItems')">

Delete

</button>

</div>

`;

});


document.getElementById("totalLost").innerText =
totalLost;

document.getElementById("claimedCount").innerText =
recovered;

document.getElementById("pendingCount").innerText =
pending;

});




// FOUND ITEMS
onValue(ref(db,"foundItems"), (snapshot)=>{

foundAdminItems.innerHTML = "";

totalFound = 0;

snapshot.forEach((child)=>{

const item = child.val();

const key = child.key;

totalFound++;

if(item.status !== "Claimed"){

pending++;

}

foundAdminItems.innerHTML += `

<div class="admin-card">

<h2>Found Item</h2>

<h3>${item.name}</h3>

<p>${item.description}</p>

<p><b>Status:</b> ${item.status}</p>

<button class="claim-btn"
onclick="claimItem('${key}','foundItems')">

Claim Item

</button>

<button class="delete-btn"
onclick="deleteItem('${key}','foundItems')">

Delete

</button>

</div>

`;

});


document.getElementById("totalFound").innerText =
totalFound;

document.getElementById("claimedCount").innerText =
recovered;

document.getElementById("pendingCount").innerText =
pending;

});

}


// ==============================
// DELETE ITEM
// ==============================

window.deleteItem = function(id, type) {

  const itemRef = ref(db, `${type}/${id}`);

  remove(itemRef);

  Swal.fire({
  icon: "success",
  title: "Deleted!",
  text: "Item Removed Successfully!",
  confirmButtonColor:"#0077cc"
});

};
// CLAIM ITEM

window.claimItem = function(id, type) {

update(ref(db, type + "/" + id), {

status: "Claimed"

})

.then(() => {


// IF LOST ITEM CLAIMED
if(type === "lostItems"){

onValue(ref(db, "foundItems"), (snapshot)=>{

snapshot.forEach((child)=>{

const foundItem = child.val();

const foundKey = child.key;


// MATCH SAME ITEM NAME
if(foundItem.name.toLowerCase() ===
document.querySelectorAll(".card h3")[0]
.innerText.toLowerCase()){

update(ref(db,
"foundItems/" + foundKey), {

status:"Claimed"

});

}

});

},{
onlyOnce:true
});

}


Swal.fire({
  icon: "success",
  title: "Claimed!",
  text: "Item Claimed Successfully!",
  confirmButtonColor:"#0077cc"
});

})

.catch((error)=>{

console.log(error);

});

};
window.filterItems = function(filter){

const lostCards =
document.querySelectorAll(
"#lostContainer .card"
);

const foundCards =
document.querySelectorAll(
"#foundContainer .card"
);

const lostHeading =
document.getElementById("lostHeading");

const foundHeading =
document.getElementById("foundHeading");

const lostWrapper =
document.querySelector("#lostContainer")
.parentElement;

const foundWrapper =
document.querySelector("#foundContainer")
.parentElement;


// RESET
lostHeading.style.display = "block";
foundHeading.style.display = "block";

lostWrapper.style.display = "flex";
foundWrapper.style.display = "flex";


// SHOW ALL
if(filter === "all"){

lostCards.forEach(card=>{
card.style.display="block";
});

foundCards.forEach(card=>{
card.style.display="block";
});

return;

}


// LOST
if(filter === "Lost"){

lostCards.forEach(card=>{
card.style.display="block";
});

foundCards.forEach(card=>{
card.style.display="none";
});

foundHeading.style.display="none";
foundWrapper.style.display="none";

return;

}


// FOUND
if(filter === "Found"){

foundCards.forEach(card=>{
card.style.display="block";
});

lostCards.forEach(card=>{
card.style.display="none";
});

lostHeading.style.display="none";
lostWrapper.style.display="none";

return;

}


// CLAIMED or PENDING
let lostVisible = false;
let foundVisible = false;

lostCards.forEach(card=>{

if(card.dataset.status === filter){

card.style.display="block";
lostVisible = true;

}else{

card.style.display="none";

}

});

foundCards.forEach(card=>{

if(card.dataset.status === filter){

card.style.display="block";
foundVisible = true;

}else{

card.style.display="none";

}

});


lostHeading.style.display =
lostVisible ? "block" : "none";

lostWrapper.style.display =
lostVisible ? "flex" : "none";

foundHeading.style.display =
foundVisible ? "block" : "none";

foundWrapper.style.display =
foundVisible ? "flex" : "none";

};
window.slideLeft = function(containerId){

const container =
document.getElementById(containerId);

container.scrollBy({
left:-1000,
behavior:"smooth"
});

}

window.slideRight = function(containerId){

const container =
document.getElementById(containerId);

container.scrollBy({
left:1000,
behavior:"smooth"
});

}
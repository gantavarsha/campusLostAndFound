const searchInput = document.getElementById("searchInput");

if(searchInput){

  searchInput.addEventListener("keyup", ()=>{

    let filter = searchInput.value.toLowerCase();

    let cards = document.querySelectorAll(".item-card");


    cards.forEach((card)=>{

      let text = card.innerText.toLowerCase();

      if(text.includes(filter)){
        card.style.display = "block";
      }
      else{
        card.style.display = "none";
      }

    });
  });
}
let city = [
  "Ang Mo Kio",
  "Bedok",
  "Bishan",
  "Boon Lay",
  "Bukit Batok",
  "Bukit Merah",
  "Bukit Panjang",
  "Bukit Timah",
  "Central Water Catchment",
  "Changi",
  "Choa Chu Kang",
  "Clementi",
  "City",
  "Geylang",
  "Hougang",
  "Jalan Bahar",
  "Jurong East",
  "Jurong Island",
  "Jurong West",
  "Kallang",
  "Lim Chu Kang",
  "Mandai",
  "Marine Parade",
  "Novena",
  "Pasir Ris",
  "Paya Lebar",
  "Pioneer",
  "Pulau Tekong",
  "Pulau Ubin",
  "Punggol",
  "Queenstown",
  "Sembawang",
  "Sengkang",
  "Sentosa",
  "Serangoon",
  "Southern Islands",
  "Sungei Kadut",
  "Tampines",
  "Tanglin",
  "Tengah",
  "Toa Payoh",
  "Tuas",
  "Western Islands",
  "Western Water Catchment",
  "Woodlands",
  "Yishun",
];

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}


let userInput;
function expandContainer() {
  let expandBtn = document.querySelector(".fa-magnifying-glass");
  let container = document.querySelector(".container");
  let image_container=document.querySelector(".image-container");
  let weather_container=document.querySelector(".weather-box");
  expandBtn.addEventListener("click", () => {
    userInput = document.getElementById("myInput").value;
    if(userInput===""){
      alert("Please enter a location");
      return;
    }
    container.classList.toggle("container-expand");

    image_container.classList.toggle("image-container-visible");
    weather_container.classList.toggle("weather-container-visible");


    //data filtering based on required area
    let filteredData =forecastData.items[0].forecasts;
    let selectedData=filteredData.filter((data)=>data.area===userInput);
    console.log(selectedData);
    let location = document.querySelector(".Location");
    let weather = document.querySelector(".Temeprature");
    //replace location and weather with selectedData
    location.innerHTML = selectedData[0].area;
    weather.innerHTML = selectedData[0].forecast;
  });
}


//get data from https://api.data.gov.sg/v1/environment/2-hour-weather-forecast
async function getData() {
  let response = await fetch(
    "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"
  );
  let data = await response.json();
  return data;
}

//once data is fetched, place data into global variable forecastData
let forecastData;
getData().then((data) => {
  forecastData = data;
});

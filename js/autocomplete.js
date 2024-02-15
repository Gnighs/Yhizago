function autocomplete(inp, dict) {
    var currentFocus;
    
    // Function to populate autocomplete options
    function populateOptions(val) {
        var a, b;
        closeAllLists();
        currentFocus = -1;
        
        a = document.createElement("DIV");
        a.setAttribute("id", inp.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        // Set the max height and overflow property for scroll
        a.style.maxHeight = "200px"; // Adjust as needed
        a.style.overflowY = "auto";
        inp.parentNode.appendChild(a);
        
        // If no value is typed, show all options
        if (!val) {
            for (var key in dict) {
                if (dict.hasOwnProperty(key)) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + key.substr(0, 0) + "</strong>";
                    b.innerHTML += key;
                    b.innerHTML += "<input type='hidden' value='" + key.replace("'", "&#39;") + "'>";
                    
                    b.addEventListener("click", function(e) {
                        inp.value = this.getElementsByTagName("input")[0].value; // Set the selected key as the value
                        closeAllLists();
                    });
                    
                    a.appendChild(b);
                }
            }
            return;
        }
        
        // Loop through the keys of the dictionary
        for (var key in dict) {
            if (dict.hasOwnProperty(key) && key.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + key.substr(0, val.length) + "</strong>";
                b.innerHTML += key.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + key.replace("'", "&#39;") + "'>";
                
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value; // Set the selected key as the value
                    closeAllLists();
                });
                
                a.appendChild(b);
            }
        }
    }

    // Event listener for input event
    inp.addEventListener("input", function(e) {
        populateOptions(this.value);
    });

    // Event listener for keydown event
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    // Function to add active class to option
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
        // Ensure the active option is visible in the dropdown
        x[currentFocus].scrollIntoView({behavior: "auto", block: "nearest"});
    }

    // Function to remove active class from option
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    // Function to close all lists except the clicked element
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    // Event listener for click event to close lists
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    // Event listener for focus event to populate options
    inp.addEventListener("focus", function() {
        populateOptions(this.value);
    });
}

var dictionary;
var verbsAndGroup = {};

const baseUrl = "https://script.google.com/macros/s/AKfycbylT-9rBTb0c7FeKKYfgXxoTqc-wQM8aEAP1b332NCP65yIQUtfgUKjOP-0Dv9RFdlt/exec";  // Please set your Web Apps URL.
const para = {
  spreadsheetId: "1UGaoVI-6SvUeJ-Ysdpdsg04bebRy3kfz5v9TYiUEHsk",  // Please set your Google Spreadsheet ID.
  sheetName: "convertedDictionary"  // Please set the sheet name you want to retrieve the values.
};

const q = new URLSearchParams(para);
const url = baseUrl + "?" + q;
fetch(url)
  .then(res => res.json())
  .then(res => {
    dictionary = res.values;
    for(let i of dictionary){
        if(i[4] == '1.1 v.' || i[4] == '1.2 v.' || i[4] == '1.3 v.' || i[4] == '2 v.'||  i[4] == '3.1 v.' || i[4] == '3.2 v.'){
            verbsAndGroup[i[1].toLowerCase()] = i[4].slice(0,-3);
        }
    }
    document.getElementById("loadingDictionary").style.display = "none";
    document.getElementById("conjugationDisplay").style.display = "block";
  });
function displayWord(){
    const word = document.getElementById("searchedWord").value.toLowerCase();
    if(word == '' || !(word in dictionary)) return;
    document.getElementById("selectedWord").innerHTML = word;
    document.getElementById("lahapek").innerHTML = "<strong>Lahapek spelling: </strong>" + word;
    document.getElementById("ippek").innerHTML = "<strong>Ippek spelling: </strong>" + dictionary[word][1];
    document.getElementById("ipa").innerHTML = "<strong>Pronunciation: </strong>/" + dictionary[word][2] + "/";
    
    if(dictionary[word][0] == "\\entry"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> From " + dictionary[word][4]
        + " /" + dictionary[word][5] + "/ meaning <em>" + dictionary[word][6] + "</em>";
    }
    else if(dictionary[word][0] == "\\entryNoMeaning"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> From " + dictionary[word][4]
        + " <em>" + dictionary[word][5] + "</em>";
    }
    else if(dictionary[word][0] == "\\entryUnkownOrigin"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> of unknown origin";
    }
    else if(dictionary[word][0] == "\\entryFreeEtymology"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> "
        + latexBasedintoHTMLbased(dictionary[word][4]);
    }

    document.getElementById("meaning").innerHTML = "<br><strong>" + dictionary[word][3] + " </strong>"
     + latexBasedintoHTMLbased(dictionary[word][dictionary[word].length-1]);

     if(dictionary[word][3].includes(" v.")){
        conjugateVerb();
        document.getElementById("conjugationButton").style.display = "inline-block";
     }
     else{
        document.getElementById("VerbAndGroup").innerHTML = "";
        document.getElementById("verbTables").innerHTML = "";
        document.getElementById("conjugationButton").style.display = "none";
     }
}

function latexBasedintoHTMLbased(string){
    let editedString = string.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    editedString = editedString.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    editedString = editedString.replace(/\\continue{([^}]*)}{([^}]*)}/, '<br><strong>$1</strong> $2');
    return editedString;
}
function displayWord(){
    const word = document.getElementById("searchedWord").value.toLowerCase();
    if(word == '' || !(word in dictionary)) return;
    document.getElementById("selectedWord").innerHTML = word;
    document.getElementById("lahapek").innerHTML = "<strong>Lahapek spelling: </strong>" + word;
    document.getElementById("ippek").innerHTML = "<strong>Ippek spelling: </strong>" + dictionary[word][1];
    document.getElementById("ipa").innerHTML = "<strong>Pronunciation: </strong>/" + dictionary[word][2] + "/";
    
    if(dictionary[word][0] == "\\entry"){
        document.getElementById("etymology").innerHTML = "<strong>Etymology: </strong> From " + dictionary[word][4]
        + " <em class='normalFont'>/" + dictionary[word][5] + "/</em> meaning <em>" + dictionary[word][6] + "</em>";
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
     if(dictionary[word][3].includes("n.")){
        document.getElementById("reduplicatedForm").innerHTML = "<strong>Reduplicated form: </strong>" + getReduplicatedForm(word,dictionary[word][2]);
     }
     else{
        document.getElementById("reduplicatedForm").innerHTML = "<strong>Reduplicated form: none</strong>";
     }
    // document.getElementById("reduplicatedForm").innerHTML = "<strong>Reduplicated form: none</strong>";
}

function latexBasedintoHTMLbased(string){
    let editedString = string.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    editedString = editedString.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    editedString = editedString.replace(/\\continue{([^}]*)}{([^}]*)}/, '<br><strong>$1</strong> $2');
    //editedString = editedString.replace(/\/([^\/]*)\//g, '<em class="normalFont">/$1/</em>');
    return editedString;
}

var nasalCounterparts = {
    "ã":"ə",
    "ẽ":"ɛ",
    "ĩ":"ɪ",
    "õ":"ɔ",
    "ũ":"ʊ"
}

function getReduplicatedForm(word, pronunciation){
    let lastLetter = word[word.length-1];
    if(['a','e','i','o','u'].includes(lastLetter)){
        return "WIP";
    }
    else{
        if(lastLetter == 't') return word + 'je <em class="normalFont">/' + pronunciation.slice(0,-1) + 't͡s/</em>';
        else if(lastLetter == 'k') return word += 'je <em class="normalFont">/' + pronunciation.slice(0,-1) + 't͡ʃ/</em>';
        else if(lastLetter == 'p') return word += 'pe <em class="normalFont">/' + pronunciation.slice(0,-1) + 'ɸ/</em>';
        else if(['m','n','s', 'r', 'l', 'j', 'w'].includes(lastLetter)){

            let plural = word + word[word.length-2];
            if(lastLetter == 's' || lastLetter == 'r') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'r/</em>';
            if(lastLetter == 'l'){
                if(pronunciation[pronunciation.length-1] == 'u'){
                    let lastV = getPronunciation(word.slice(0,-1));
                    lastV = lastV[lastV.length-1];
                    return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + lastV + 'l/</em>';
                } 
                return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'l/</em>';
            } 
            if(lastLetter == 'j') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'j/</em>';
            if(lastLetter == 'w') return plural + ' <em class="normalFont">/' + pronunciation.slice(0,-1) + 'ɸ/</em>';
            if(lastLetter == 'n'){
                return plural + ' <em class="normalFont">/' + 
                pronunciation.slice(0,-1) + nasalCounterparts[pronunciation[pronunciation.length-1]] + 'n/</em>';
            } 
        } 
        else return word + ' <em class="normalFont">/' + pronunciation + '/</em>';
    }
}
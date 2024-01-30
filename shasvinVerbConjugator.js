var verbsAndGroup = {
    "tihatal":"1.3",
    "upalil":"2.P",
    "ajul":"3.1"
}

var tenses = {
  "PRS": [0, 0, 0],
  "HAB": [0, 0, 1],
  "PRET": [1, 0, 0],
  "IMPF": [1, 0, 1],
  "FUT": [0, 1, 0],
  "H.FUT": [0, 1, 1],
  "COND": [1, 1, 0],
  "H.COND": [1, 1, 1]
};
var perfective_equivalents = {
  "HAB": "PRS",
  "IMPF": "PRET",
  "H.FUT": "FUT",
  "H.COND": "COND"
};
var voiced_equivalents = {
  "p": "b",
  "t": "d",
  "k": "g"
};
var pronouns = {
  "ang": 0,
  "ngak": 1,
  "ip": 2,
  "se": 3,
  "ane": 4,
  "anak": 5,
  "akje": 6,
  "pip": 7,
  "sese": 8
};
var conj_one_one_np = ["a", "kak", "ip", "s", "ane", "anak", "kje", "pi", "ase"];
var conj_one_two_np = ["e", "kak", "ip", "s", "ene", "enak", "kje", "pi", "ese"];
var conj_one_three_np = ["e", "kak", "ip", "s", "ane", "anak", "kje", "pi", "ese"];
var conj_two_P_np = ["i", "ik/ikak", "ip", "is", "ine", "inak", "ikje", "ipe/ippe", "ise"];
var conj_two_G_np = ["ia", "ik/ikak", "iip", "ias", "iane", "ianak", "ikje", "iipe/iippe", "iese"];
var conj_three_one_np = ["uf", "uk/ukak", "up", "us", "une", "unak", "ukje", "upe/uppe", "use"];
var conj_three_two_np = ["of", "uk/ukak", "up", "us", "one", "onak", "ukje", "upe/uppe", "ose"];
var conj_one = [conj_one_one_np, conj_one_two_np, conj_one_three_np];
var conj_two = [conj_two_P_np, conj_two_G_np];
var conj_three = [conj_three_one_np, conj_three_two_np];
var non_past = [conj_one, conj_two, conj_three];

function updateTitle(verb){
    var group = verbsAndGroup[verb];
    var upperCaseVerb = verb.charAt(0).toUpperCase() + verb.slice(1);
    if(verb in verbsAndGroup){
        var title = upperCaseVerb + ": conjugation group " + group;
        document.getElementById("VerbAndGroup").innerHTML = title;
        return true;
    }
    document.getElementById("VerbAndGroup").innerHTML = "We couldn't fin the verb: " + upperCaseVerb;
    return false; 
}

function conjugateVerb(){
    const verb = document.getElementById("infinitive").value.toLowerCase();
    if(!updateTitle(verb)){
        document.getElementById("tables").innerHTML = "";
        return;
    } 
    var stem = verb.slice(0,-2);
    
    document.getElementById("tables").innerHTML = get_post_reduced_form(stem);
}

//gets two variables group and subgroup from a string of the type A.B
function get_group(group){
    var indexes = group.split('.');
    var subgroup = indexes[1];
    if(subgroup == 'P') subgroup = '1';
    if(subgroup == 'G') subgroup = '2';
    return [int(indexes[0],int(subgroup))]
}
//given an array of rows, makes a simple html table with the given values
function makeTable(rows){
    var content = "<table cellspacing='2px'>\n<tbody>\n";
    for(let r in rows){
        var rowToPaste = "";
        for(let el in rows[r]){
            rowToPaste += "<td>" + rows[r][el] + "</td>\n";
        }
        content += "<tr>\n" + rowToPaste + "</tr>\n";
    }
    content += "\n</tbody>\n</table>\n";
    return content;
}
function is_vowel(c){
    return is_in(c,['a','e','i','o','u']);
}
function is_in(c, array){
    for(let i in array) if(c == array[i]) return true;
    return false;
}
//gets the post reduced form of a verb from its stem
function get_post_reduced_form(stem){
    var size = Math.min(stem.length,4);
    var new_str = stem.slice(-size);
    var count = 0;
    var found = false;
    var reversedStem = new_str.split('').reverse().join('');
    //read backwars until a second vowel is found
    for(let c in reversedStem){
        if(is_vowel(reversedStem[c]) && !found) found = true;
        else if(is_vowel(reversedStem[c])) break;
        count += 1;
    }
    //select the right substring with only one vowel
    var one_vowel = new_str.slice(-count);
    if (one_vowel.length < 1) return ""
    var req_len = 3;
    //if there is a second consonant on offset make length 4
    if(is_vowel(!one_vowel[one_vowel.length-1])) req_len += 1;
    //if the second cosnonant isnt allowed in second onset position, slice it
    if(one_vowel.length == req_len && is_in(one_vowel[1],['w','j','l','r','f'])) return one_vowel.slice(1);
    return one_vowel;
}
//returns the stem with the infix -o- applied and updates the subgroup
//to trick the rest of the code to apply the correct suffix
function apply_past_o(stem,group,subgroup,pronoun){
    //if its 2.G we change it to 2.P, if its 3.2, to 3.1
    if(group == 2 || group == 3) return [stem+'o',group,1];
    //if its 1.3 with ang we change it to 1.1 so we get oa and not oe
    if(pronoun == 'ang' && subgroup == 3) return [stem+'o',group,1];
    //if its ngak or akje we add 'oa' to get oakak and oakje
    if(pronoun == 'ngak' || pronoun == 'akje') return [stem+'oa',group,subgroup];
    //if its pip we change it to 2.P
    if(pronoun == 'pip') return [stem+'o',2,1];
    //else we just add the infix
    return [stem+'o',group,subgroup];
}

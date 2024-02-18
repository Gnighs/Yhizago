//[past, future, imperfective]
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
var voiced_equivalents = {"p": "b", "t": "d", "k": "g"};
var unvoiced_equivalents = {"b": "p", "d": "t", "g": "k"};
var pronouns = {"ang": 0, "ngak": 1, "ip": 2, "se": 3, "ane": 4, "anak": 5, "akje": 6, "pip": 7, "sese": 8};

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
var conjugating_suffixes = [conj_one, conj_two, conj_three];

function updateTitle(verb){
    let group = verbsAndGroup[verb];
    let upperCaseVerb = verb.charAt(0).toUpperCase() + verb.slice(1);
    if(verb in verbsAndGroup){
        let title = upperCaseVerb + ": conjugation group " + group;
        document.getElementById("VerbAndGroup").innerHTML = title;
        return true;
    }
    document.getElementById("VerbAndGroup").innerHTML = "Sorry, we couldn't find the verb: " + upperCaseVerb;
    return false; 
}

function conjugateVerb(){
    const verb = document.getElementById("searchedWord").value.toLowerCase();
    if(verb == '') return;
    if(!updateTitle(verb)){
        document.getElementById("verbTables").innerHTML = "";
        return;
    } 
    let tables = conjugate_all_forms(verb,verbsAndGroup[verb]);
    let tableString = "";
    tableString += '<div class="table-pair">' + tables[0] + '</div>';
    for(let i = 1; i < tables.length; i += 2){
        tableString += make_table_pair(tables[i],tables[i+1]);
    }
    document.getElementById("verbTables").innerHTML = tableString;
}

//gets two variables group and subgroup from a string of the type A.B
function get_group(group){
    if(group == '2') return [2,1];
    let indexes = group.split('.');
    let subgroup = indexes[1];
    if(subgroup == 'P') subgroup = '1';
    if(subgroup == 'G') subgroup = '2';
    return [parseInt(indexes[0]),parseInt(subgroup)]
}
//given an array of rows, makes a simple html table with the given values and a title
function make_table(title, rows){
    let content = "<table cellspacing='2px'>\n<tbody>\n";
    content += '<th colspan="4">' + title + '</th>\n</tbody>\n';
    for(let r of rows){
        let rowToPaste = "";
        for(let el of r){
            rowToPaste += "<td>" + el + "</td>\n";
        }
        content += "<tr>\n" + rowToPaste + "</tr>\n";
    }
    content += "\n</tbody>\n</table>\n";
    return content;
}
//returns a div class="table-pair" with two given tables
function make_table_pair(table1, table2){
    return '<div class="table-pair">\n' + table1 + table2 + '</div>';
}
function is_vowel(c){
    return is_in(c,['a','e','i','o','u']);
}
function is_in(c, array){
    return array.includes(c);
}
//gets the post reduced form of a verb from its stem
function get_post_reduced_form(stem, devoiceStart = true){
    let new_str = stem;
    if(stem.length > 4) new_str = stem.slice(-4);
    let reversedStem = new_str.split('').reverse().join('');
    
    let count = 0;
    let found = false;
    
    //read backwars until a second vowel is found
    for(let c of reversedStem){
        if(is_vowel(c) && !found) found = true;
        else if(is_vowel(c)) break;
        count += 1;
    }
    //select the right substring with only one vowel
    new_str = new_str.slice(-count);
    //devoice start if needed
    if(devoiceStart && is_in(new_str.charAt(0),['b','d','g'])){
        new_str = unvoiced_equivalents[new_str.charAt(0)] + new_str.slice(1);
    }
    if (new_str.length < 2) return new_str;
    let req_len = 2;
    //if it ends in a consonant make length longer
    if(!is_vowel(new_str[new_str.length-1])) req_len += 1;
    //if there is a second acceptable consonant on offset make length longer
    if(is_in(new_str[1],['w','j','l','r','f'])) req_len += 1;
    return new_str.slice(-req_len);
}
//returns the stem with the infix -o- applied and updates the subgroup
//to trick the rest of the code to apply the correct suffix
function apply_past_o(stem, group, subgroup, pronoun){
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
//applies a suffix to a stem and may or not apply voicing
function apply_suffix(stem, suffix, voicing = false){
    //if there are more than one suffix compute both
    if(suffix.includes('/')){
        let split = suffix.split('/');
        return apply_suffix(stem, split[0], voicing)  + '<br>' + apply_suffix(stem, split[1], voicing);
    }
    //if voicing is true, apply the voicing if needed
    if(voicing && suffix.length > 1){
        //stem ends in a vowel and suffix starts with <PV>
        if(is_vowel(stem.charAt(stem.length-1)) && is_in(suffix.charAt(0),['p','t','k']) && is_vowel(suffix.charAt(1))){
            let new_suffix = voiced_equivalents[suffix.charAt(0)] + suffix.slice(1);
            return stem + new_suffix;
        }
        //stem ends in <VP> and the suffix starts in a vowel
        if(is_vowel(stem.charAt(stem.length-2)) && is_in(stem.charAt(stem.length-1),['p','t','k']) && is_vowel(suffix.charAt(0))){
            let new_stem = stem.slice(0,-1) + voiced_equivalents[stem.charAt(stem.length-1)];
            return new_stem + suffix;
        }
    }
    //resolve <PP> clusters
    if(is_in(stem.charAt(stem.length-1),['p','t','k']) && is_in(suffix.charAt(0),['p','t','k']) && stem.charAt(stem.length-1) != suffix.charAt(0)){
        return stem.slice(0,-1) + suffix;
    }
    //else just add the suffix normally
    return stem + suffix;
}
//returns the correct form(s) of the verb for one person (and number) in a specified tense
function conjugate_one_tense_one_person(stem, group, pronoun, tense, post_reduced){
    //get the group and subgroup as separate variables
    let cj_group, cj_subgroup; [cj_group,cj_subgroup] = get_group(group);
    //get the ID for the pronoun (0-8)
    let person_and_number = pronouns[pronoun];
    
    let conjugated_form = stem;
    //if its imperfective, reduplicate (meso-reduplication)
    if(tenses[tense][2] == 1) conjugated_form = apply_suffix(conjugated_form,post_reduced,true);
    //if its future, add -kan-
    if(tenses[tense][1] == 1) conjugated_form = apply_suffix(conjugated_form,'kan');
    //if tis past, add -o-
    if(tenses[tense][0] == 1) [conjugated_form,cj_group,cj_subgroup] = apply_past_o(conjugated_form,cj_group,cj_subgroup,pronoun);

    //add person suffix
    conjugated_form = apply_suffix(conjugated_form, conjugating_suffixes[cj_group-1][cj_subgroup-1][person_and_number]);
    if(conjugated_form.includes('<br>')){
        let twoParts = conjugated_form.split('<br>');
        conjugated_form = twoParts[0] + '<br> <em class="normalFont">/' + getPronunciation(twoParts[0]) + '/</em>'
        + '<br>' + twoParts[1] + '<br> <em class="normalFont">/' + getPronunciation(twoParts[1]) + '/</em>';
    }
    else{
        let firstPronunciation = getPronunciation(conjugated_form);
        conjugated_form += '<br> <em class="normalFont">/' + firstPronunciation + '/</em>'; 
    }

    //if its imperfective, make post-reduplication by conjugating in perfective followed by post reduced form
    /*if(tenses[tense][2] == 1){
        let post_reduplicated = conjugate_one_tense_one_person(stem,group,pronoun,perfective_equivalents[tense]);
        //check if two suffixes were applied
        if(post_reduplicated.includes('<br>')){
            let two_forms = post_reduplicated.split('<br>');
            conjugated_form += '<br>' + two_forms[0] + ' ' + post_reduced + '<br>' + two_forms[1] + ' ' + post_reduced;
        }
        else{
            conjugated_form += '<br>' + post_reduplicated + ' ' + post_reduced;
        }
    }*/
    //let pronunciation = getPronunciation(conjugated_form);
    //return conjugated_form + ' <br> /' + pronunciation + '/';
    return conjugated_form;
}
//returns a table with the entire conjugation for a given tense
function conjugate_one_tense(stem, group, tense, title,  post_reduced){
    let table_values = [];
    let pronoun_pairs = [['ang','ane'],['---','anak'],['ngak','akje'],['ip','pip'],['se','sese']];
    //treat pronouns as pairs to have them in the same table row
    for(let pair of pronoun_pairs){
        if(pair[0] == '---') table_values.push(['---','---',pair[1],conjugate_one_tense_one_person(stem,group,pair[1],tense,post_reduced)])
        else{
            let row = [pair[0],conjugate_one_tense_one_person(stem,group,pair[0],tense,post_reduced),pair[1],conjugate_one_tense_one_person(stem,group,pair[1],tense,post_reduced)];
            table_values.push(row);
        }
    }
    return make_table(title, table_values);
}
function conjugate_all_forms(infinitive, group){
    let stem = infinitive.slice(0,-2);
    let post_reduced = get_post_reduced_form(stem);
   
    let all_tenses_tables = [];

    //impersonal forms tables
    
    all_tenses_tables.push(conjugate_infinitives(infinitive,post_reduced));
    all_tenses_tables.push(conjugate_stand_alones(stem,post_reduced));
    //personal forms tables
    let tense_pairs = [['PRS','Present'],['HAB','Habitual (Meso-reduplicated)'],['PRET','Preterite'],['IMPF','Imperfect (Meso-reduplicated)'],
    ['FUT','Future'],['H.FUT','Habitual Future (Meso-reduplicated)'],['COND','Conditional'],['H.COND','Habitual Conditional (Meso-reduplicated)']];

    for(let pair of tense_pairs) all_tenses_tables.push(conjugate_one_tense(stem,group,pair[0],pair[1],post_reduced));
    all_tenses_tables.unshift(make_table("Post reduced form",[["Form",post_reduced + ' <em class="normalFont">/' + getPronunciation(post_reduced) + '/</em>']]));
    return all_tenses_tables;
}
//returns a table with all of the infinitive forms
function conjugate_infinitives(infinitive, post_reduced){
    let stem = infinitive.slice(0,-2);
    let suffix = infinitive.slice(-2);
    let infinitives = [];
    
    //reuse calculations
    let reduplicated_stem = apply_suffix(stem,post_reduced,true);
    let future_stem = apply_suffix(stem,'kan');
    let reduplicated_future = apply_suffix(reduplicated_stem,'kan');
    //present and habitual
    infinitives.push(['Present',infinitive,'Habitual',reduplicated_stem + suffix]);
    //preterite and imperfect
    infinitives.push(['Preterite',stem + 'o' + suffix,'Imperfect',reduplicated_stem + 'o' + suffix]);
    //future and habitual future
    infinitives.push(['Future',future_stem+suffix,'H. Future',reduplicated_future+suffix]);
    //conditional and habitual conditional
    infinitives.push(['Conditional',future_stem+'o'+suffix,'H. Conditional',reduplicated_future+'o'+suffix]);

    for(row of infinitives){
        for(let i in row){
            if(i%2 != 0){
                row[i] = row[i] + '<br> <em class="normalFont">/' + getPronunciation(row[i]) + '/</em>';
            }
        }
    }

    return make_table('Infinitives', infinitives);
}

function conjugate_stand_alones(stem, post_reduced){
    let standalones = [];
    //reuse calculations
    let reduplicated_stem = apply_suffix(stem,post_reduced,true);
    let future_stem = apply_suffix(stem,'kan');
    let reduplicated_future = apply_suffix(reduplicated_stem,'kan');
    //present and habitual
    standalones.push(['Present',stem,'Habitual',reduplicated_stem/* + '<br> ' + stem + ' ' + post_reduced*/]);
    //preterite and imperfect
    standalones.push(['Preterite',stem + 'o','Imperfect',reduplicated_stem + 'o'/* + '<br>' + stem + 'o ' + post_reduced*/]);
    //future and habitual future
    standalones.push(['Future',future_stem,'H. Future',reduplicated_future/* + '<br>' + future_stem + ' ' + post_reduced*/]);
    //conditional and habitual conditional
    standalones.push(['Conditional',future_stem+'o','H. Conditional',reduplicated_future+'o'/* + '<br>' + future_stem+'o '+post_reduced*/]);

    for(row of standalones){
        for(let i in row){
            if(i%2 != 0){
                row[i] = row[i] + '<br> <em class="normalFont">/' + getPronunciation(row[i]) + '/</em>';
            }
        }
    }

    return make_table('Stand-alone forms (Meso-reduplicated)', standalones);
}
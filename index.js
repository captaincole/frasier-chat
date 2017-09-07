var request = require("request");
var requestNative = require("request-promise-native");
var fs = require('fs');
// Script parser
var page1url = 'http://www.kacl780.net/frasier/transcripts/season_1/episode_1/the_good_son.html';
var pageURLS = [
    // 'http://www.kacl780.net/frasier/transcripts/season_1/episode_1/the_good_son.html',
    'http://www.kacl780.net/frasier/transcripts/season_1/episode_2/space_quest.html',
    'http://www.kacl780.net/frasier/transcripts/season_1/episode_3/dinner_at_eight.html',
    'http://www.kacl780.net/frasier/transcripts/season_1/episode_4/i_hate_frasier_crane.html'
];
var corpus = [];
pullFromSite();

function pullFromSite() {
    let promiseList = [];
    pageURLS.forEach( (url) => {
        // Fill
        console.log('Parsing url', url);
        promiseList.push(requestNative(url).then(parseWebsite, onError));
    });
    Promise.all(promiseList).then( (data) => {
        console.log('All the promises', corpus.length);
        reformatToCorpus();
    });
}

function onError(err) {
    console.log('There was an error');
}

function parseWebsite(body) {
   // Find Fraisers Line
   let frasierSplit = body.split('<b>Frasier: </b>');
   console.log('Frasier Split', frasierSplit[0]);
   console.log('Line Numbers: ' , frasierSplit.length);
   frasierSplit.forEach( (lineSet) => {
    // Find the last line spoken, set it as the response. If no line, dont include and continue
    let previousLine = lineSet.split('<b>');
    // console.log('Frasier Response:', previousLine[0]);
    // Remove Name from Question
    let questionArr = previousLine[previousLine.length - 1];
    // console.log('Question Arr: ' , questionArr);
    let question = questionArr.split('</b>')[1];
    if (question && (question.indexOf('Scene') > 0 || question.indexOf('<pre>') > 0)) {
        question = undefined;
    }

    if (corpus.length === 0) {
        corpus.push({ question: question});
    } else {
        corpus[corpus.length - 1]['response'] = previousLine[0];
        corpus.push({question: question});
    }
   });

   console.log('Corpus: ' , corpus.length);
   reformatToCorpus();
}

function reformatToCorpus() {
    console.log('corpus', corpus);
    // Start with question - response format, reformat to chatterbot corpus format
    // Create Fraiser File!
    let startingLine = 'categories:\n-fraiser\nconversations:\n';
    fs.writeFile('fraisercrane.yml' , startingLine, function (err) {
        console.log('File Written');
        console.log('Attempting to write corpus' , corpus.length);
        corpus.forEach( ( pairs ) => {
            // Combine pairs
            if (!pairs.question || !pairs.response) {
                // Do Nothing
                console.log('Undefined response');
            } else {
                let lineToAppend = '- - ' + pairs.question.replace(/[\r\n\[\]\:\/]+/g,"").replace(/  +/g, ' ') + '\n  - ' 
                + pairs.response.replace(/[\r\n\[\]\:]+/g,"").replace(/  +/g, ' ') + '\n';
                fs.appendFile('fraisercrane.yml', lineToAppend);
            }
        });
    });
}
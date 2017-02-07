var questions;
var currentQuestion = 0;
var answers = [];
var important = [];
var parties = [];

$(document).ready(function(){


  $("#go").click(function(){
    showSection("loading");

    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Ftweedekamer2017.stemwijzer.nl%2F'%20and%20xpath%3D%20'%2F%2Fdiv%5B%40class%3D%22statement%20js-statement%22%5D'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(result){
        questions = result.query.results.div.splice(0,30);

        console.log(questions);

        questions.forEach(function(item, index){
          $("#important-list").append('<div class="col-sm-4 form-check important-item"><label class="form-check-label"><input class="form-check-input" type="checkbox" data-index="' + index + '" value=""> ' + questions[index].div[0].h1.content +  '</label></div>')
        });

        questions[2].details.div.div[0].details.forEach(function(item, index){
          parties[item.summary.content] = 0;
        });

        questions[2].details.div.div[1].details.forEach(function(item, index){
          parties[item.summary.content] = 0;
        });

        questions[2].details.div.div[2].details.forEach(function(item, index){
          parties[item.summary.content] = 0;
        });

        console.log("parties");

        showSection("question");
        loadQuestion(0);
    });

  });

  $("#buttons button").click(function(){
    answers[currentQuestion] = $(this).attr("id");
    console.log(answers);
    currentQuestion ++;
    loadQuestion(currentQuestion);
  });

  $("#to-results").click(loadResults);



});

function showSection(id){
  $(".main-container > div").hide();
  $("#" + id).show();
}

function loadResults(){
  $(".important-item input").each(function(){
    if($(this).is(":checked")){
      important.push(true);
    }
    else{
      important.push(false);
    }
  });

  questions.forEach(function(item, index){
    pushAnswers(item.details.div.div[0].details, answers[index], "agree", important[index]);
    pushAnswers(item.details.div.div[1].details, answers[index], "neither", important[index]);
    pushAnswers(item.details.div.div[2].details, answers[index], "disagree", important[index]);
  })

  sortedKeys = getSortedKeys(parties);

  counter = 1;
  $("#results tbody").empty();

  sortedKeys.forEach(function(item){

    $("#results tbody").append("<tr><td>" + counter + "</td><td>" + item + "</td><td>" + Math.round(parties[item]) + "%</td></tr>");
    counter ++;
  });



  showSection("results");
}

function getSortedKeys(obj) {
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}


function pushAnswers(array, answer, arrayType, importantornot){

  if(array.constructor === Array){
    console.log("this is array");
    array.forEach(function(item, index){
      var tempparty = item.summary.content;

      if(arrayType == answer){
        parties[tempparty] += 100 / 30;
        if(importantornot){
          parties[tempparty] += 100 / 30;
        }
      }
      else if(importantornot){
        parties[tempparty] -= 100 / 30;
      }

    });
  }
  else{
    item = array;

    var tempparty = item.summary.content;

    if(arrayType == answer){
      parties[tempparty] += 100 / 30;
      if(importantornot){
        parties[tempparty] += 100 / 30;
      }
    }
    else if(importantornot){
      parties[tempparty] -= 100 / 30;
    }

  }
}

function loadQuestion(index){

  if(currentQuestion >= 30){
    showSection("important")
    return;
  }

  console.log("loading question");
  $("#question h2").text(questions[index].div[0].h1.content);
  $("#question #description").text(questions[index].div[0].p.content);
}

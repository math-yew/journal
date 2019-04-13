var categories = [];
let today = new Date().toLocaleDateString();
var masterText = "";
var currentCategories = [];
// $("#textarea").autogrow();

function process(){
  var text = $("#text").val();
  if(text == null || text == ""){
    text = localStorage.getItem("masterText");
    $("#text").val(text);
  }
  masterText = text;
  var trimmedDates = [];
  if(masterText != null){
    var dateArr = text.match(/date:\s?\S+/gi);
    if(dateArr != null){
      var trimmedDates = dateArr.map(x => x.replace(/date::\s?/i,""));
    }
  }

  if(trimmedDates.indexOf(today) == -1){
    console.log("false");
    $("#newDay").show();
    $("#today").text(today);
    masterText += "\n" + "date::" + today + "\n"
  } else{
      console.log("true");
      searchDate(today)
  }

}

function addCategory(categoryName){
  if(!categoryName){
   var categoryName = $("#newCategory").val();
  }
  console.log("catName: " + categoryName);
  var textArea = $('<div><label>'+categoryName+'</label><br/><textarea class="editable-text" id="'+categoryName+'"/></div>');
  $(".newDay").show();
  $("#newDayMain").append(textArea);
  currentCategories.push(categoryName);
}

function save(){
  for (var i = 0; i < currentCategories.length; i++) {
    var category = currentCategories[i]
    var text = category + "::\n" + $("#" + category).val() + "\n\n";
    masterText += text;
    console.log(text);
  }

  $("#result").val(masterText);
}

function searchDate(date){
  var text = masterText;
  var reg = new RegExp("date::"+date+"(.|\n)*\S+:", "gi");
  console.log("reg: " + reg);
  var dateData = text.match(reg);
  if(!dateData){
    reg = new RegExp("date::"+date+"(.|\n)*$", "gi");
    dateData = text.match(reg);
  }
  if(!dateData){
    console.log("Date not Found")
  }else{
    $("#newDayMain").empty();
    dateData += "";
    console.log("dd: " + dateData);

    var subData = dateData.match(/\w+::.*?((?=\s*\w+::)|(?=\s*$))/gs);

    for (var i = 0; i < subData.length; i++) {
      var sectionArray = subData[i].split("::");
      console.log("0: " + sectionArray[0]);
      console.log("1: " + sectionArray[1]);
      if(sectionArray[0] == "date"){
        $("#today").text(sectionArray[1]);
      }else{
        addCategory(sectionArray[0]);
        $("#"+sectionArray[0]).text(sectionArray[1]);
      }
    }

  }
}

function searchCat(cat){
  var text = $("#text").val();
  var array = text.split(cat + "::");
  console.log("length: " + array.length);
  console.log("[1]: " + array[1]);
  var string = array[1];
  string = string.replace(/\s*\w+\:\:(\s|\S)*$/,"");
  string = string.replace(/^\s*/,"");
  console.log("string: " + string);
  $("#result").val(string);
}

function saveDay() {
  var textareas = $("#newDay textarea");
  console.log('textareas: ', textareas);
  var date = $("#today").text();
  var dayString = "date::" + date + "\n";
  console.log($("#today").text(), 'date: ', date);
  date = date.replace(/\//g,"\\/");
  for (var i = 0; i < textareas.length; i++) {
    if(textareas[i].id.toLowerCase() != "date"){
      dayString += textareas[i].id + "::" + textareas[i].value + "\n";
    }
  }
console.log('dayString: ', dayString);

// date::\s?3\/20\/2019.*?((?=\s*date::)|(?=\s*$))
var reg = new RegExp("date::\s?"+date+".*?((?=\s*date::)|(?=\s*$))", "gs");
masterText = masterText.replace(reg,dayString);
console.log("masterText:" + masterText);
localStorage.setItem("masterText", masterText);
  $("#result").val(masterText);
}

function copy(){
  var copyText = document.getElementById("result");
  copyText.select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function paste(){
  var text = document.getElementById("text");
  text.focus();
  text.innerHTML = "";
  // text.select();
  //
  console.log('paste: ', document.execCommand("paste"));
  document.execCommand("paste");
}

var emailAddress = localStorage.getItem("emailAddress");
$("#emailAddress").val(emailAddress);

function setEmailAddress(){
  emailAddress = $("#emailAddress").val();
  localStorage.setItem("emailAddress", emailAddress);
}

function email(){
  var body = localStorage.getItem("masterText");
  var mailto = "mailto:"+emailAddress+"?subject=Journal&body="+body;
  window.open(mailto);

  // var mail = document.createElement("a");
  //   mail.href = mailto;
  //   mail.click();

}

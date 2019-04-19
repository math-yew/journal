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
  var textArea = $('<div><label>'+categoryName+'</label><br/><textarea class="editable-text" id="'+categoryName+'"/></div>');
  $(".newDay").show();
  $("#newDayMain").prepend(textArea);
  currentCategories.push(categoryName);
  $("#newCategory").val("");
  $("#"+categoryName).focus();
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
  $("#newDayMain").empty();
  var text = masterText;
  // var reg = new RegExp("date::"+date+"(.|\n)*\S+:", "gi");
  var reg = new RegExp("date::\s?"+date+".*?(?=date::)", "gsi");
  console.log('reg: ', reg);
  var dateData = text.match(reg);
  console.log('dateData: ', dateData);
  // /*
  if(!dateData){
    reg = new RegExp("date::"+date+"(.|\n)*$", "gi");
    dateData = text.match(reg);
  }
  console.log('reg: ', reg);
  // */
  if(!dateData){
    console.log("Date not Found")
  }else{
    $("#newDayMain").empty();
    dateData += "";

    var subData = dateData.match(/\w+\s?::.*?((?=\s*\w+\s?::)|(?=\s*$))/gsi);
    console.log("subData: " + subData);
    for (var i = 0; i < subData.length; i++) {
      var sectionArray = subData[i].split("::");
      var name = sectionArray[0].replace(/\s*$/,"");
      var innerText = sectionArray[1].replace(/^\s*/,"");
      console.log(i + ": " + name + ": " + innerText);
      if(name == "date"){
        $("#today").text(innerText);
      }else{
        addCategory(name);
        $("#"+name).text(innerText);
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
      dayString += textareas[i].id + "::\n" + textareas[i].value + "\n";
    }
  }
console.log('dayString: ', dayString);

// date::\s?3\/20\/2019.*?((?=\s*date::)|(?=\s*$))
var reg = new RegExp("date::\s?"+date+".*?((?=\s*date::)|(?=\s*$))", "gs");
masterText = masterText.replace(reg,dayString);
masterText = masterText.replace(/s:/gi,"s :"); //bug fix

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

function dateSearch(){
  saveDay();
  var date = $("#searchDate").val();
  var dateArr = date.split("-");
  var newDate = dateArr[1].replace(/^0/,"") + "/" + dateArr[2].replace(/^0/,"") + "/" + dateArr[0];
  searchDate(newDate);
}

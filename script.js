var categories = [];
let today = new Date().toLocaleDateString();
var masterText = "";
var currentCategories = [];

function process(){
  var text = $("#text").val();
  if(text == null || text == ""){
    text = localStorage.getItem("masterText");
    $("#text").val(text);
  }
  masterText = text;
  var cc = masterText.match(/\w+\s*(?=::)/g);
  for (var i = 0; i < cc.length; i++) {
    var cat = cc[i];
    if(currentCategories.indexOf(cat) == -1 && cat != "date"){
      currentCategories.push(cat);
      $("#searchCat").append(new Option(cat, cat))
    }
  }
  console.log("currentCategories: " + currentCategories);
  var trimmedDates = [];
  if(masterText != null){
    var dateArr = text.match(/date:\s?\S+/gi);
    if(dateArr != null){
      var trimmedDates = dateArr.map(x => x.replace(/date::\s?/i,""));
    }
  }
  $("#newDay").show();
  if(trimmedDates.indexOf(today) == -1){
    console.log("false");
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
  var reg = new RegExp("date::\s?"+date+".*?(?=date::)", "gsi");
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
    console.log("Date not Found");
    $("#today").text(date+" NOT FOUND");
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
  $("#result").removeClass("gray");
  $("#result").addClass("blink");
  setTimeout(function(){$("#result").removeClass("blink");},2000);
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
  body = body.replace(/\n/g," ");
  var mailto = "mailto:"+emailAddress+"?subject=Journal&body="+body;
  window.open(mailto);

}

function dateSearch(){
  saveDay();
  var date = $("#searchDate").val();
  var dateArr = date.split("-");
  var newDate = dateArr[1].replace(/^0/,"") + "/" + dateArr[2].replace(/^0/,"") + "/" + dateArr[0];
  searchDate(newDate);
}

function searchCat(cat){
  $("#newDayMain").empty();
  var text = masterText;
  var cat = $("#searchCat").val();
  var reg = new RegExp("date::.*?" + cat + "\\s?::.*?((?=\\s*\\w+\\s?::)|(?=\\s*$))", "gsi");
  // var reg = new RegExp(cat + "\\s?::.*?((?=\\s*\\w+\\s?::)|(?=\\s*$))", "gsi");
  var catArr = text.match(reg);
  console.log('catArr: ', catArr);

  for (var i = 0; i < catArr.length; i++) {
    var str = catArr[i];
    var dateReg = new RegExp("(?!=date::\\s?)\\d+\/\\d+\/\\d+", "gsi");
    var dateArr = str.match(dateReg);

    var catReg = new RegExp(cat + "\\s?::.*?((?=\\s*\\w+\\s?::)|(?=\\s*$))", "gsi");
    // var catReg = new RegExp("(?!=test\\s?::).*?((?=\\s*\\w+\\s?::)|(?=\\s*$))", "gsi");
    var textArr = str.match(catReg);
    var replaceReg = new RegExp(cat + "\\s?::\\s*", "gsi");
    catText = textArr[0].replace(replaceReg,"");

    console.log('dateArr[0]: ', dateArr[0]);
    var date = dateArr[0];
    console.log('catText: ', catText);
    // console.log('textArr[0]: ', textArr[0]);


    var p = $('<div><span onclick="searchDate(\''+date+'\')"><u><b>'+date+'</b></u></span><br/><p id="'+date+'">'+catText+'</p></div>');
    $(".newDay").show();
    $("#newDayMain").append(p);
  }
}

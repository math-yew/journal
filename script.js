var categories = [];
let today = new Date().toLocaleDateString();
console.log('today: ', today);
var masterText = "";
var currentCategories = [];

function process(){
  var text = $("#text").val();
  masterText = text;
  var dateArr = text.match(/date:\s?\S+/g);
  var trimmedDates = dateArr.map(x => x.replace(/date::\s?/,""));
  // var lastDate = dateArr[dateArr.length - 1];
  console.log('dateArr: ', dateArr);
  console.log('trimmedDates:' + trimmedDates + "::");
  console.log("index of: " + trimmedDates.indexOf(today));
  if(trimmedDates.indexOf(today) == -1){
    console.log("false");
    $("#newDay").show();
    $("#today").text(today);
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
  var textArea = $('<div><label>'+categoryName+'</label><br/><textarea style="padding-left:100px" id="'+categoryName+'" /></div>');
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
  var reg = new RegExp("date::"+date+"(.|\n)*\S+:", "g");
  console.log("reg: " + reg);
  var dateData = text.match(reg);
  if(!dateData){
    reg = new RegExp("date::"+date+"(.|\n)*$", "g");
    dateData = text.match(reg);
  }
  if(!dateData){
    console.log("Date not Found")
  }else{
    dateData += "";
    console.log("dd: " + dateData);

    var subData = dateData.match(/\w+::.*?((?=\s*\w+::)|(?=\s*$))/gs);
    console.log('subData: ', subData);

    for (var i = 0; i < subData.length; i++) {
      var sectionArray = subData[i].split("::");
      console.log("0: " + sectionArray[0]);
      console.log("1: " + sectionArray[1]);
      addCategory(sectionArray[0]);
      $("#"+sectionArray[0]).text(sectionArray[1]);
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
  // console.log('textareas: ', textareas);
  var dayString = "";
  for (var i = 0; i < textareas.length; i++) {
    console.log('textareas [0] id ', textareas[i].id);
    console.log('textareas [0] innerHTML ', textareas[i].innerHTML);
    dayString += textareas[i].id + "::" + textareas[i].innerHTML + "\n";
  }
console.log('dayString: ', dayString);
}

var token = 'TOKEN';
var url = 'https://api.telegram.org/bot' + token;
var webappurl = 'google scipts app url';
var ssId = 'spreadsheets ssid';

function getMe() {
  var response = UrlFetchApp.fetch(url + '/getMe');
  Logger.log(response.getContentText());
}

function setWebhook() {
  var response = UrlFetchApp.fetch(url + '/setWebhook?url=' + webappurl);
  Logger.log(response.getContentText());
}

function sendText(id, text) {
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + text + "&parse_mode=html");
  Logger.log(response.getContentText());
}

function askForReply(id, text) {
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + text + "&parse_mode=html&reply_markup=ForceReply");
  Logger.log(response.getContentText());
}

function doGet(e){
  return HtmlService.createHtmlOutput("hello" + JSON.stringify(e));
}

function logBitch(first, second, third, fifth, sixth, seventh){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logs = ss.getSheetByName("logs");
  logs.activate().appendRow([new Date, first, second, third, fifth, sixth, seventh]);
 /** SpreadsheetApp.openById(ssId).getActiveSheet("logs").appendRow([new Date, first, second, third, fifth, sixth, seventh]);**/
}

function doPost(e){

  var contents = JSON.parse(e.postData.contents);
  var text = contents.message.text;
  var id = contents.message.from.id;
  var first_name = contents.message.from.first_name;
  var firstChar = text.substr(0,1);
  
  if (firstChar === '/'){
    
    var preCommand = text.slice(1);
    var command = preCommand.split(" ");
    var final_command = command[0];
    switch (final_command) {
        
      case "start":
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
        if (searchUser(first_name) == null){
          sheet.appendRow([id, first_name, "0"]);
          sendText(id, "registered");
        } else {
          sendText(id, "You are already in the database");
        }
        break;
        
      case "write":
        sendText(id, "this is write");
        logBitch(id, first_name, text);
        break;
        
      case "help":
        var helpMessage = "/help - shows this list%0A/write - returns this is write%0A/test is a test command%0A/check username - displays current users karma points";
        sendText(id, helpMessage);
        logBitch(id, first_name, text);
        break;
        
      case "test":
        var htmlOutput = "/test%0A/flower";
        sendText(id, htmlOutput);
        logBitch(id, first_name, text);
        break;
        
      case "flower":
        sendText(id, "🌿");
        break;
        
      case "channel":
        if(typeof command[1] !== "undefined"){
          sendToChannel(command[1]);
        } else {
          sendText(id, "enter text");
        }
        break;
        
      case "check":
        if (typeof command[1] !== "undefined" && typeof command[2] === "undefined"){
          var karma = checkKarma(command[1]);
          if (karma === undefined) {
            sendText(id, "Such user does not exist");
          } else {
            var answer = "User " + command[1] + " has " + checkKarma(command[1]) + " karma points";
            sendText(id, answer);            
          }
        } else {
          sendText(id, "Enter username to check!");
        }
        break;
        
      case "have":
        if (typeof command[1] === "undefined") {
          sendText(id, "undefined");
        } else if (typeof command[2] !== "undefined") {
          sendText(id, "defined 2nd");
        } else if (command[1].match(/^[0-9]+$/) == null) {
          sendText(id, "enter only digits");
        } else {
          SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users").getRange(searchUser(id),4).setValue(command[1]);
          sendText(id, "set");
        }
        break;
        
      default:
        var defaultMessage = "There is no such command! Try /help";
        sendText(id, defaultMessage);
        logBitch(id, first_name, text);
        break;
    }
  }
  SpreadsheetApp.openById(ssId).appendRow([new Date(),id,first_name,text]);
  commands(id,text);
}

function searchUser(name){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
  var textFinder = sheet.createTextFinder(name);
  var x = textFinder.matchEntireCell(true).findNext();
  if (x !== null) {
    x = x.getRow();
  }
  return x;
}

function checkKarma(name){
  var karma;
  if (searchUser(name) !== null) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
    karma = sheet.getRange(searchUser(name), 3).getValue();
  }
  return karma;
}

function sendToChannel(x){
  UrlFetchApp.fetch(url + "/sendMessage?chat_id=@testchannel1221&text=" + x + "&parse_mode=html");
}

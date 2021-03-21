let boot = 0;
function getLeaderboard(theUrl){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", theUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            var json = JSON.parse(xhr.responseText);
            console.log("data", json);
            let text = "<h1>Leaderboard</h1><ol>";
            for(let i = 0; i < json.data.length; i++){
              text += "<li>";
              text += json.data[i].name.givenName+" "+json.data[i].name.familyName.charAt(0)+"  : "+json.data[i].eggsFound+" Eggs";
              if(i == 0 || i == 1){
                text += " - up to $100 dinner";
              }
              if(i == 2 || i == 3){
                text += " - up to $75 dinner";
              }
              if(i == 4 || i == 5){
                text += " - up to $50 dinner";
              }
              if(i == 6 || i == 7){
                text += " - up to $25 dinner";
              }
              text += "</li>"
            }
            text += "</ol>";
            $("#leaderboard").append(text);
          }
    }
    xhr.send(null);
}
function checkDig(val){
  if(boot >= 2){
    window.location.href = "/rabbit/out";
  }
  let code = document.getElementById("code").value;
  let digitVal = 11;
  for(let i = 0; i < code.length; i++){
    digitVal += code.charCodeAt(i);
  }
  if(digitVal % 11 != 2){
    alert("Don't put in bad codes");
    boot++;
    document.getElementById("code").value = "";
    return false;
  }else{
    var xhr = new XMLHttpRequest();
    var url = "/rabbit/foundEgg";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify({"userid": "<%=user.userid%>", "code": code});
    xhr.send(data);
    xhr.onload = function() {
      if(data.msg === "success!"){
        alert("We got it! Keep it up!");
        window.location.href = "/rabbit";
      }
      if(data.msg === "nse"){
        alert("That egg doesn't exist");
        boot++;
      }
      if(data.msg === "fAl"){
        alert("Someone has already found this egg");
        boot++;
      }
      if(data.msg === "bad request!"){
        alert("Bad Internet Connection. Please try again later");
      }
      document.getElementById("code").value = "";
    }
  }
}

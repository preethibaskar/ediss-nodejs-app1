var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'root',
   database : 'ediss'
 });
 
 connection.connect();
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})
app.get('/survey.htm', function (req, res) {
   var user = req.query.user;
   res.render( 'survey', { user:user } );
})
app.get('/answers.htm', function (req, res) {
  
   connection.query("SELECT * from responses",function(err, rows, fields) {
    res.render( 'answers', { rows:rows } );
   });
   //res.sendFile( __dirname + "/" + "answers.htm" );
})
app.get('/results.htm',function (req, res){
  var ans1 = req.query.ans1;
  var ans2 = req.query.ans2;
  var ans3 = req.query.ans3;
  var feedback = req.query.feedback
  res.render('results', {ans1:ans1, ans2:ans2,ans3:ans3,feedback:feedback});
})
app.get('/process_get', function (req, res) {

   // Prepare output in JSON format
   response = {
       first_name:req.param('username'),
       last_name:req.param('password')
   };
   console.log(response);
   //res.end(JSON.stringify(response));
   connection.query("SELECT * FROM users WHERE username ='" + req.param('username') + "' and  password = '" + req.param('password') + "'", function(err, rows, fields) {
   if(!err){
    
    res.send({rows:rows})
    res.end();
   }
   // if (!err){
   //  if(rows.length > 0){
   //   console.log('The solution is: ', rows[0].type);
   //   if(rows[0].type == "user"){
   //    res.redirect("/survey.htm?user=" +req.param('username'));
   //    res.end();
   //   }
   //   else{
   //    res.redirect("/answers.htm");
   //    res.end();
   //   }
   //  }
   //  else{
      
   //    res.end();
   //  }
   // }
   else{
     console.log('Error while performing Query.');
     res.end();
   }
 });
 
 //connection.end();
})


app.get('/survey_form', function (req, res) {
 
  var mark = 0;
  var ans1 = "Wrong!";
  var ans2 = "Wrong!";
  var ans3 = "Wrong!";
  if(req.param('q1') == 4){
    mark = mark +1;
    ans1 = "Right!";
  }
  if(req.param('q2') == 12){
    mark = mark + 1;
    ans2 = "Right!";
  }
  if(req.param('q3') == 1){
    mark = mark + 1;
    ans3 = "Right!";
  }
  var feedback = mark +"/3 answers are correct";
  var post  = {
  username: req.param('user'),
  q1: req.param('q1'),
  q2: req.param('q2'),
  q3: req.param('q3'),
  q1_result: ans1,
  q2_result: ans2,
  q3_result: ans3,
  feedback: feedback
};
var json = {ans1 : ans1, ans2:ans2, ans3:ans3, feedback:feedback};
connection.query('INSERT INTO responses SET ? ', post, function (err, result) {
  if(!err){
    console.log("Response recorded");
    //res.redirect(307, '/' + req.path);
    res.send(json);
    //res.redirect("/results.htm?ans1="+ans1+"&ans2="+ans2+"&ans3="+ans3+"&feedback="+feedback);
    //res.end();
  }
  else{
    console.log("Error!");
  }
  res.end();
});
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})


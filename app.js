//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");

// main().catch(err => console.log(err));

// async function main() {
  mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  const itemsSchema = new mongoose.Schema({
    name: String
  });
  
  const Item = mongoose.model('Item', itemsSchema);
  
  

  const item1 = new Item({name : "welcome to your todolist" });
  const item2 = new Item({name : "hit + button to add new item" });
  const item3 = new Item({name : "hit <-- button to delete an item" });

  const defaultItems = [item1,item2,item3];
  
  
  const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
  });

  const List = mongoose.model('List', listSchema);




// }

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


let items = [] ;
app.get("/", function(req, res) {

  
  
    async function main(){
      try {
        items = await Item.find();

        if(items.length === 0){
          Item.insertMany(defaultItems);
          items = await Item.find();
        }

        res.render("list", {listTitle: "Today", newListItems: items});

      } catch (err){
        console.log(err);
      }
    }    
    main();
// const day = date.getDate();

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const listName = req.body.list;

  const item = new Item({name : itemName });

  if(listName === "Today"){
    
  item.save();

  res.redirect("/");
  
  } else {

    async function main4(){
      try {
        
        const foundList = await List.findOne({name: listName });

        foundList.items.push(item);
        foundList.save();
  
        res.redirect("/" + listName);
  
      } catch (err){
        console.log(err);
      }
    }    
    main4();     

  }


});

app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  
    async function main2(){
      try {
        
        if(listName === "Today"){
          await Item.findByIdAndDelete(checkedItemId);
  
          res.redirect("/");

        } else {

          await List.findOneAndUpdate({name : listName},{ $pull: { items: {_id : checkedItemId} } });

          res.redirect("/" + listName);

        }

  
      } catch (err){
        console.log(err);
      }
    }    
    main2(); 

 

  

  

});

app.get("/:customListName", function(req,res){

  const customListName = _.capitalize(req.params.customListName);

  async function main3(){
    try {
      

      const foundList = await List.findOne({name:customListName});

      if(!foundList){
        //create new list
        const list = new List({
          name : customListName,
          items : defaultItems
        });
      
        list.save();

        res.redirect("/"+customListName);
      } else {
        // show existing list
        res.render("list", {listTitle: foundList.name , newListItems: foundList.items});
      }

      

    } catch (err){
      console.log(err);
    }
  }    
  main3();    



  

});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

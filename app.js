let server=require('express');
let mongoose=require('mongoose');
let _=require('lodash');
let app=server();



app.set('view engine','ejs');

let port=process.env.PORT||5000;

let bodyparser=require('body-parser');

app.use(bodyparser.urlencoded({extended:true}));
app.use(server.static("public"));

const MONGOD_URI='mongodb+srv://santhosh:san123@cluster0.pxdm0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGOD_URI ||"mongodb://localhost:27017/listDB");

mongoose.connection.on('connected',()=>{
    console.log("mongoose sucessfully");
})

let listSchema={
    name:String,
}

let listmodel=mongoose.model("all",listSchema);

let listdoc1=new listmodel({
    name:"wakeup",
});

let listdoc2=new listmodel({
    name:"exercise",
});

let defaultarray=[listdoc1,listdoc2];

app.get('/',(req,res)=>{
    let tdy=new Date();
let options={
    weekday:'long',
    day:'numeric',
    month:'long'
};
let day=tdy.toLocaleDateString("en-US",options);

listmodel.find({},(err,foundlist)=>{
    if(!err){
if(foundlist.length===0){
   listmodel.insertMany(defaultarray,(err)=>{
       if(!err){
           console.log("inserted sucessfully");
       }else{
           console.log(err);
       }
   });
}else{

   res.render('list',{listTitle:day,kindofList:foundlist});

}
    }
});

});

app.post('/',(req,res)=>{
    let item=req.body.newitem;

    let insert=new listmodel({
        name:item,
    });

    insert.save();
    res.redirect('/');
});

app.post('/delete',(req,res)=>{

    let dele=req.body.checkbox;

    listmodel.findByIdAndDelete(dele,(err)=>{
        if(!err){
            console.log("deleted sucessfully");
            res.redirect('/');
        }else{
            console.log(err);
        }
    });


});

app.listen(port,(res)=>{
console.log(`the local host runs on ${port}`);
});
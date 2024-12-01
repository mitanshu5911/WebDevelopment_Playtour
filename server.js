var express = require("express");
var app = express();
var mysql2 = require("mysql2");
var cloudinary = require("cloudinary").v2;
var fileuploader = require("express-fileupload");

app.use(express.static("public"));
app.use(express.static("public/playerprofile"));
app.use(fileuploader());
app.use(express.urlencoded({ extended: true }));

app.listen(786, function () {
    console.log("Server Started");
})

cloudinary.config({
    cloud_name: 'dww5caj7u',
    api_key: '534154286537995',
    api_secret: 'sKuNTFoEfyBEmpI8Soxs_pUyQKo'
});

let config = "mysql://avnadmin:AVNS_1OfzFkin3gdRa0RKuVx@playtour-playtour.c.aivencloud.com:12731/PLAYTOUR";

let mysqlserver = mysql2.createConnection(config);
mysqlserver.connect(function (err) {
    if (err == null) {
        console.log("Connected to Your database");
    }
    else {
        console.log(err.message);
    }
})



// ------------------------------API----------------------

app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
})

app.get("/signup", function (req, resp) {
    let email = req.query.txtEmail;
    let password = req.query.txtPwd;
    let usertype = req.query.utype;

    mysqlserver.query(
        "INSERT INTO users (email, pwd, usertype, status) VALUES (?,?,?,1)", [email, password, usertype], function (err, jsonArray) {
            if (err == null) {
                resp.send("Successfully inserted");
                // console.log(jsonArray);
            }
            else {
                resp.status(500).send("Error: " + err.message);
            }
        }
    )
})

app.get("/login", function (req, resp) {
    let email = req.query.txtEmail;
    let password = req.query.txtPwd;

    mysqlserver.query("select pwd,usertype from users where email=?", [email], function (err, jsonArray) {
        //  resp.send(jsonArray);
        if (jsonArray.length > 0) {
            let existingPassword = jsonArray[0].pwd;
            let user = jsonArray[0].usertype;

            if (existingPassword === password) {
                resp.send(user);
            }
            else {
                resp.send("Invalid Password");
            }
        }
        else {
            resp.send("User doesn't exist");
        }
    })
})

app.get("/checkUser", function (req, resp) {
    let email = req.query.txtEmail;
    mysqlserver.query("select * from users where email=?", [email], function (err, jsonArray) {
        if (err != null) {
            resp.send(err.message);
        }
        if (jsonArray.length == 1) {
            resp.send("Already Taken!!!");
        }
        if (jsonArray.length == 0) {
            resp.send("Not");
        }
    })
})
app.get("/playerdetials", function (req, resp) {
    let path = __dirname + "/public/playerProfile/playerProfile.html";
    resp.sendFile(path);
})
app.post("/player-information", async function (req, resp) {
    let email = req.body.inputEmail;
    let playerName = req.body.inputName;
    let DOB = req.body.inputDOB;
    let gender = req.body.inputGender;
    let game = req.body.inputGame;
    let mobileno = req.body.inputMobileNo;
    let address = req.body.inputAddress;
    let zipCode = req.body.inputZipcode;
    let city = req.body.inputCity;
    let idProof = req.body.selectIdProof;
    let otherinfo = req.body.inputOtherInfo;
    // -------------------------------------------------Profile--------------------------------------------
    let filenameProfile = "";
    if (req.files != null) {
        filenameProfile = req.files.profilePicFile.name;
        let path = __dirname + "/public/uploads/" + filenameProfile;
        console.log(path);
       await req.files.profilePicFile.mv(path);

        await cloudinary.uploader.upload(path).then(function (result) {
            filenameProfile = result.url;
            console.log(filenameProfile);
        });
    }
    else {
        filenameProfile = "nopic.png";
    }
    req.body.profilePicPath = filenameProfile;
    let profile = req.body.profilePicPath;
    // -------------------------------------------------Profile--------------------------------------------

    // -------------------------------------------------Proof--------------------------------------------

    let filenameProof = "";
    if (req.files != null) {
        filenameProof = req.files.proofPicFile.name;
        let path = __dirname + "/public/uploads/" + filenameProof;
        console.log(path);
        await req.files.proofPicFile.mv(path);

        await cloudinary.uploader.upload(path).then(function (result) {
            filenameProof = result.url;
            console.log(filenameProof);
        });
    }
    else {
        filenameProof = "./public/images/userprofilepic.png";
    }
    req.body.profilePicPath = filenameProof;
    let proofpic = req.body.profilePicPath;
    // -------------------------------------------------Proof--------------------------------------------
    mysqlserver.query("INSERT INTO players VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, email, playerName, DOB, game, gender, mobileno, address, city, zipCode, profile, idProof, proofpic, otherinfo], function (err) {
        if (err) {
            resp.status(500).send("Database error: " + err.message);
        } else {
            resp.send("Record Saved Successfully");
            // resp.send(DOB);
        }
    })
})

app.get("/fetchUser",function(req,resp){
    let email=req.query.inputEmail;

    mysqlserver.query("select * from players where email=?",[email],function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message);
        }
        else{
            // console.log(jsonArray[0].DOB);
            resp.send(jsonArray);

        }  
    })
})

app.get("/changePwd",function(req,resp){
    let email=req.query.inputEmail;
    let oldpwd=req.query.inputoldPwd;
    let newpwd=req.query.inputNewPwd;

    mysqlserver.query("SELECT * from users WHERE email=? and pwd=?",[email,oldpwd],function(err,jsonArray){
        if(jsonArray.length==0){
            resp.send("User not available");
        }
        else if(jsonArray.length>=1){
            mysqlserver.query("UPDATE users SET pwd=? where email=? and pwd=?",[newpwd,email,oldpwd],function(err){
                if (err) {
                    resp.status(500).send("Database error: " + err.message);
                } else {
                    resp.send("Record update Successfully");
                    // resp.send(DOB);
                }
            })
        }
        else{
            resp.send(err.message);
        }
    })
})

app.post("/updatePlayerinfo",async function(req,resp){
    let email = req.body.inputEmail;
    let playerName = req.body.inputName;
    let DOB = req.body.inputDOB;
    let gender = req.body.inputGender;
    let game = req.body.inputGame;
    let mobileno = req.body.inputMobileNo;
    let address = req.body.inputAddress;
    let zipCode = req.body.inputZipcode;
    let city = req.body.inputCity;
    let idProof = req.body.selectIdProof;
    let otherinfo = req.body.inputOtherInfo;
    // -------------------------------------------------Profile--------------------------------------------
    let filenameProfile = "";
    if (req.files != null) {
        filenameProfile = req.files.profilePicFile.name;
        let path = __dirname + "/public/uploads/" + filenameProfile;
        console.log(path);
       await req.files.profilePicFile.mv(path);

        await cloudinary.uploader.upload(path).then(function (result) {
            filenameProfile = result.url;
            console.log(filenameProfile);
        });
    }
    else {
        filenameProfile = "nopic.png";
    }
    req.body.profilePicPath = filenameProfile;
    let profile = req.body.profilePicPath;
    // -------------------------------------------------Profile--------------------------------------------

    // -------------------------------------------------Proof--------------------------------------------

    let filenameProof = "";
    if (req.files != null) {
        filenameProof = req.files.proofPicFile.name;
        let path = __dirname + "/public/uploads/" + filenameProof;
        console.log(path);
        await req.files.proofPicFile.mv(path);

        await cloudinary.uploader.upload(path).then(function (result) {
            filenameProof = result.url;
            console.log(filenameProof);
        });
    }
    else {
        filenameProof = "./public/images/userprofilepic.png";
    }
    req.body.profilePicPath = filenameProof;
    let proofpic = req.body.profilePicPath;
    // -------------------------------------------------Proof--------------------------------------------

    mysqlserver.query(
        "UPDATE players SET pname=?, DOB=?, game=?, gender=?, mobileno=?, address=?, city=?, zipcode=?, profilepic=?, idproof=?, proofpic=?, otherinfo=? WHERE email=?",
        [playerName, DOB, game, gender, mobileno, address, city, zipCode, profile, idProof, proofpic, otherinfo, email],
        function (err) {
            if (err) {
                resp.status(500).send("Database error: " + err.message);
            } else {
                resp.send("Record updated successfully");
            }
        }
    );
    
})
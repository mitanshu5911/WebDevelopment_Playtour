var express = require("express");
var app = express();
var mysql2 = require("mysql2");
var cloudinary = require("cloudinary").v2;
var fileuploader = require("express-fileupload");

app.use(express.static("public"));
app.use(express.static("public/playerprofile"));
app.use(express.static("public/organizerProfile"));
app.use(express.static("public/postTournament"));
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
        if (jsonArray.length >0) {
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

// app.post("/updatePlayerinfo",async function(req,resp){
//     let email = req.body.inputEmail;
//     let playerName = req.body.inputName;
//     let DOB = req.body.inputDOB;
//     let gender = req.body.inputGender;
//     let game = req.body.inputGame;
//     let mobileno = req.body.inputMobileNo;
//     let address = req.body.inputAddress;
//     let zipCode = req.body.inputZipcode;
//     let city = req.body.inputCity;
//     let idProof = req.body.selectIdProof;
//     let otherinfo = req.body.inputOtherInfo;
//     // -------------------------------------------------Profile--------------------------------------------
//     let filenameProfile = "hello";
//     if (req.files != null) {
//         filenameProfile = req.files.profilePicFile.name;
//         let path = __dirname + "/public/uploads/" + filenameProfile;
//         console.log(path);
//        await req.files.profilePicFile.mv(path);

//         await cloudinary.uploader.upload(path).then(function (result) {
//             filenameProfile = result.url;
//             console.log(filenameProfile);
//         });
//     }
//     else {
//         filenameProfile = "nopic.png";
//     }
//     req.body.profilePicPath = filenameProfile;
//     let profile = req.body.profilePicPath;
//     // -------------------------------------------------Profile--------------------------------------------

//     // -------------------------------------------------Proof--------------------------------------------

//     let filenameProof = "hello";
//     if (req.files != null) {
//         filenameProof = req.files.proofPicFile.name;
//         let path = __dirname + "/public/uploads/" + filenameProof;
//         console.log(path);
//         await req.files.proofPicFile.mv(path);

//         await cloudinary.uploader.upload(path).then(function (result) {
//             filenameProof = result.url;
//             console.log(filenameProof);
//         });

//     }
//     else {
//         filenameProof = "./public/images/userprofilepic.png";
//     }
//     req.body.profilePicPath = filenameProof;
//     let proofpic = req.body.profilePicPath;
//     // -------------------------------------------------Proof--------------------------------------------

//     mysqlserver.query(
//         "UPDATE players SET pname=?, DOB=?, game=?, gender=?, mobileno=?, address=?, city=?, zipcode=?, profilepic=?, idproof=?, proofpic=?, otherinfo=? WHERE email=?",
//         [playerName, DOB, game, gender, mobileno, address, city, zipCode, profile, idProof, proofpic, otherinfo, email],
//         function (err) {
//             if (err) {
//                 resp.status(500).send("Database error: " + err.message);
//             } else {
//                 resp.send("Record updated successfully");
//             }
//         }
//     );
    
// })
app.post("/updatePlayerinfo", async function (req, resp) {
    try {
      const {
        inputEmail: email,
        inputName: playerName,
        inputDOB: DOB,
        inputGender: gender,
        inputGame: game,
        inputMobileNo: mobileno,
        inputAddress: address,
        inputZipcode: zipCode,
        inputCity: city,
        selectIdProof: idProof,
        inputOtherInfo: otherinfo,
      } = req.body;
  
      // Utility function to handle file uploads
      async function handleFileUpload(file, existingPath) {
        if (file) {
          const filename = `${Date.now()}-${file.name}`;
          const filePath = `${__dirname}/public/uploads/${filename}`;
          await file.mv(filePath); // Save file to server
          const result = await cloudinary.uploader.upload(filePath); // Upload to Cloudinary
          return result.url; // Return Cloudinary URL
        } else {
          return existingPath; // Return existing path if no new file
        }
      }
  
      // File upload handling for profile picture
      const profilePicPath = await handleFileUpload(
        req.files?.profilePicFile,
        "nopic.png"
      );
  
      // File upload handling for proof picture
      const proofPicPath = await handleFileUpload(
        req.files?.proofPicFile,
        "./public/images/userprofilepic.png"
      );
  
      // MySQL query to update player information
      mysqlserver.query(
                "UPDATE players SET pname=?, DOB=?, game=?, gender=?, mobileno=?, address=?, city=?, zipcode=?, profilepic=?, idproof=?, proofpic=?, otherinfo=? WHERE email=?",
                [playerName, DOB, game, gender, mobileno, address, city, zipCode, profilePicPath, idProof, proofPicPath, otherinfo, email],
                 function (err) {
                     if (err) {
                         resp.status(500).send("Database error: " + err.message);
                     } else {
                         resp.send("Record updated successfully");
                     }
                }
            );
            
     }
     catch (err) {
      console.error(err);
      resp.status(500).send("Server error: " + err.message);
    }
  });
  

app.post("/organizerInformation",async function(req,resp){
    let email=req.body.inputEmail;
    let organizationName=req.body.inputOrganizationName;
    let representativeName=req.body.inputRepresentativeName;
    let repPhoneNo=req.body.inputRepresentativeNo;
    let secondMbrName=req.body.inputSecondName;
    let secondPhoneNo=req.body.inputSecondNo;
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
    mysqlserver.query("INSERT INTO organizers VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[null,email,organizationName,representativeName,repPhoneNo,secondMbrName,secondPhoneNo,address,city,zipCode,profile,idProof,proofpic,otherinfo],function(err){
            if (err) {
                resp.status(500).send("Database error: " + err.message);
            } else {
                resp.send("Record save successfully");
            }
        });
})

app.get("/fetchOrgaizer",function(req,resp){
    let email=req.query.inputEmail;

    mysqlserver.query("select * from organizers where email=?",[email],function(err,jsonArray){
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

// app.post("/updateOrganizerinfo",async function(req,resp){
//     let email=req.body.inputEmail;
//     let organizationName=req.body.inputOrganizationName;
//     let representativeName=req.body.inputRepresentativeName;
//     let repPhoneNo=req.body.inputRepresentativeNo;
//     let secondMbrName=req.body.inputSecondName;
//     let secondPhoneNo=req.body.inputSecondNo;
//     let address = req.body.inputAddress;
//     let zipCode = req.body.inputZipcode;
//     let city = req.body.inputCity;
//     let idProof = req.body.selectIdProof;
//     let otherinfo = req.body.inputOtherInfo;

//     let alprofile=req.body.profilePicFile;
//     let alproof=req.body.proofPicFile;
//     // -------------------------------------------------Profile--------------------------------------------
//     let filenameProfile = "hello";
//     if (req.files != null) {
//         filenameProfile = req.files.filenameProfile.name;
//         let path = __dirname + "/public/uploads/" + filenameProfile;

//         console.log(path);
//        await req.files.profilePicFile.mv(path);

//         await cloudinary.uploader.upload(path).then(function (result) {
//             filenameProfile = result.url;
//             console.log(filenameProfile);
//         });
        
//     }
//     else {
//         filenameProfile = alprofile;
//     }
//     req.body.profilePicPath = filenameProfile;
//     let profile = req.body.profilePicPath;
//     // -------------------------------------------------Profile--------------------------------------------

//     // -------------------------------------------------Proof--------------------------------------------

//     let filenameProof = "hello";
//     if (req.files != null) {
//         filenameProof = req.files?.proofPicFile.name;
//         let path = __dirname + "/public/uploads/" + filenameProof;
//         console.log(path);
//         await req.files.proofPicFile.mv(path);

//         await cloudinary.uploader.upload(path).then(function (result) {
//             filenameProof = result.url;
//             console.log(filenameProof);
//         });
//     }
//     else {
//         filenameProof = alproof;
//     }
//     req.body.profilePicPath = filenameProof;
//     let proofpic = req.body.profilePicPath;
//     // -------------------------------------------------Proof--------------------------------------------

//     mysqlserver.query(
//         "UPDATE organizers SET oname=?, RepName=?, Repno=?, SecName=?, SecNo=?, address=?, city=?, zipcode=?, profilepic=?, idproof=?, proofpic=?, otherinfo=? WHERE email=?",
//         [organizationName,representativeName,repPhoneNo,secondMbrName,secondPhoneNo,address,city,zipCode,profile,idProof,proofpic,otherinfo,email],
//         function (err) {
//             if (err) {
//                 resp.status(500).send("Database error: " + err.message);
//             } else {
//                 resp.send("Record updated successfully");
//             }
//         }
//     );
// })

app.post("/updateOrganizerinfo", async function (req, resp) {
  try {
    const {
      inputEmail: email,
      inputOrganizationName: organizationName,
      inputRepresentativeName: representativeName,
      inputRepresentativeNo: repPhoneNo,
      inputSecondName: secondMbrName,
      inputSecondNo: secondPhoneNo,
      inputAddress: address,
      inputZipcode: zipCode,
      inputCity: city,
      selectIdProof: idProof,
      inputOtherInfo: otherinfo,
      profilePicFile: alprofile,
      proofPicFile: alproof,
    } = req.body;

    // Helper function for handling files
    async function handleFileUpload(file, existingPath) {
      if (file) {
        const filename = `${Date.now()}-${file.name}`;
        const filePath = `${__dirname}/public/uploads/${filename}`;
        await file.mv(filePath); // Save file to server
        const result = await cloudinary.uploader.upload(filePath); // Upload to Cloudinary
        return result.url; // Return Cloudinary URL
      } else {
        return existingPath; // Return existing path if no new file
      }
    }

    // Handle profile picture
    const profilePicPath = await handleFileUpload(
      req.files?.profilePicFile,
      alprofile
    );

    // Handle proof picture
    const proofPicPath = await handleFileUpload(
      req.files?.proofPicFile,
      alproof
    );

    // Update database
    mysqlserver.query(
      "UPDATE organizers SET oname=?, RepName=?, Repno=?, SecName=?, SecNo=?, address=?, city=?, zipcode=?, profilepic=?, idproof=?, proofpic=?, otherinfo=? WHERE email=?",
      [
        organizationName,
        representativeName,
        repPhoneNo,
        secondMbrName,
        secondPhoneNo,
        address,
        city,
        zipCode,
        profilePicPath,
        idProof,
        proofPicPath,
        otherinfo,
        email,
      ],
      function (err) {
        if (err) {
          resp.status(500).send("Database error: " + err.message);
        } else {
          resp.send("Record updated successfully");
        }
      }
    );
  } catch (err) {
    console.error(err);
    resp.status(500).send("Server error: " + err.message);
  }
});


app.post("/postTournament",async function(req,resp){
    let email=req.body.inputEmail;
    let title=req.body.inputTitle;
    let oname=req.body.inputOrganization;
    let hostName=req.body.inputHostName;
    let hostno=req.body.inputHostno;
    let game=req.body.inputGame;
    let registerby=req.body.inputRegDate;
    let startdate=req.body.inputStart;
    let entryFee=req.body.inputEntryFee;
    let gender=req.body.inputGender;
    let location=req.body.inputAddress;
    let city=req.body.inputCity;
    let otherinfo=req.body.inputOtherInfo;

    let filenamePoster = "";
    if (req.files != null) {
        filenamePoster = req.files.posterPicFile.name;
        let path = __dirname + "/public/uploads/" + filenamePoster;
        console.log(path);
        await req.files.posterPicFile.mv(path);

        await cloudinary.uploader.upload(path).then(function (result) {
            filenamePoster = result.url;
            console.log(filenamePoster);
        });
    }
    else {
        filenamePoster = "./public/images/Poster.png";
    }
    req.body.posterPicFile = filenamePoster;
    let posterPic = req.body.posterPicFile;

    mysqlserver.query(
        "INSERT INTO tournaments (email, title, oname, hostName, hostNo, game, registrationDate, startingDate, entryFee, player, location, city, otherinfo, posterpic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [email, title, oname, hostName, hostno, game, registerby, startdate, entryFee, gender, location, city, otherinfo, posterPic],
        function (err) {
            if (err) {
                resp.status(500).send("Database error: " + err.message);
            } else {
                resp.send("Tournament Post Successfully");
            }
        }
    );
    
    
})
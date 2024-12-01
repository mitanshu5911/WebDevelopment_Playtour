$(document).ready(function(){
// --------------------------------------Signup side------------------------   
    $("#btnSignup").click(function(){
        let email=$("#signupTxtEmail").val();
        let password=$("#signupTxtPwd").val();;
        let usertype=$("#userType").val();

        let errEmail=$("#singupEmailErr").html();
        let errPwd=$("#signupPwdErr").html();
        if(errEmail==="Its Valid" && errPwd==="Strong" && usertype!=="none")
        {
            let OBJ={
                type:"get",
                url:"/checkUser",
                data:{
                    txtEmail:email,
                }
            }
            $.ajax(OBJ).done(function(response){
                if(response==="Not"){
                    let obj={
                        type:"get",
                        url:"/signup",
                        data:{
                            txtEmail:email,
                            txtPwd:password,
                            utype:usertype
                        }
                    }
                    $.ajax(obj).done(function(response){
                        alert(response);
                    }).fail(function(err){
                        alert("Server error :"+err.message);
                    })
                }
                else{
                    alert(response);
                }
            }).fail(function(err){
                alert(err.message);
            })
        }
        else{
            alert("Enter the right credentials");
        }
    }) 
    
    $("#signupTxtEmail").blur(function(){
        let email=$("#signupTxtEmail").val().toLowerCase();
        $("#signupTxtEmail").val(email);

        let eexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(eexp.test(email)==false){
            $("#singupEmailErr").html("Not Valid").addClass("notOk").removeClass("ok");
        }
        else{
            $("#singupEmailErr").html("Its Valid").addClass("ok").removeClass("notOk");

        }
    })
    
    $("#signupTxtPwd").keyup(function(){
        let password=$(this).val();
        let numeric=/\d/.test(password);
        let character=/[!@#$%^&*(),.?":{}|<>]/.test(password);
        let alpha=/[A-Z]/.test(password);
        if(password.length<8){
            $("#signupPwdErr").html("Less than 8 char.").addClass("notOk").removeClass("ok");
        }
        else if(numeric==false){
            $("#signupPwdErr").html("easy").addClass("notOk").removeClass("ok");

        }
        else if(character==false){
            $("#signupPwdErr").html("Medium").addClass("notOk").removeClass("ok");

        }
        else if(alpha==false){
            $("#signupPwdErr").html("Medium").addClass("notOk").removeClass("ok");
            
        }
        else{
            $("#signupPwdErr").html("Strong").addClass("ok").removeClass("notOk");

        }
    })
// --------------------------------------Signup side------------------------ 


// ---------------------------------------Login side----------------------
    $("#btnLogin").click(function(){
        let email=$("#loginTxtEmail").val();
        let password=$("#loginTxtPwd").val();

        // alert("Hello");

        let obj={
            type:"get",
            url:"/login",
            data:{
                txtEmail:email,
                txtPwd:password
            }
        }
        $.ajax(obj).done(function(response){
            alert(response);
            if(response=="Organizer"){
                location.href="./organizerDashboard/organizerDashboard.html";
                localStorage.setItem("activeUser",email);
            }
            else if(response=="Player"){
                location.href="./playerDashboard/playerDashboard.html";
                localStorage.setItem("activeUser",email);
                    
            }
            else{
                alert("invalid.credentials");
            }
        }).fail(function(){
            alert("Server error");
        })
    })

    $("#loginTxtEmail").blur(function(){
        let email=$("#loginTxtEmail").val().toLowerCase();
        $("#loginTxtEmail").val(email);

        let eexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(eexp.test(email)==false){
            $("#loginEmailErr").html("Not Valid").addClass("notOk").removeClass("ok");
        }
        else{
            $("#loginEmailErr").html("Its Valid").addClass("ok").removeClass("notOk");

        }
    })

    $("#loginTxtPwd").keyup(function(){
        let password=$(this).val();

        if(password.length<8){
            $("#loginPwdErr").html("Less than 8 char.").addClass("notOk").removeClass("ok");
        }
        else{
            $("#loginPwdErr").html("");

        }
    })

// ---------------------------------------Login side----------------------



// ------------------------Password visibility-----------------------------
    $("#loginBtnEye").mousedown(function(){
        $("#loginTxtPwd").prop("type","text");
        $("#loginIconEye").removeClass("fa-eye-slash").addClass("fa-eye");
    })
    $("#loginBtnEye").mouseup(function(){
        $("#loginTxtPwd").prop("type","password");
        $("#loginIconEye").addClass("fa-eye-slash").removeClass("fa-eye");
    })

    $("#signupBtnEye").mousedown(function(){
        $("#signupTxtPwd").prop("type","text");
        $("#signupIconEye").removeClass("fa-eye-slash").addClass("fa-eye");
    })
    $("#signupBtnEye").mouseup(function(){
        $("#signupTxtPwd").prop("type","password");
        $("#signupIconEye").addClass("fa-eye-slash").removeClass("fa-eye");
    })
// ------------------------Password visibility-----------------------------

})
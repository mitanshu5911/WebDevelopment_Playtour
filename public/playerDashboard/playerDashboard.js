$(document).ready(function() {
    let email=localStorage.getItem("activeUser");

    $("#logoutBtn").click(function(){
        localStorage.removeItem("activeUser");
        email="";
        $("#items").css("display","none");
        $("#activeUser").html("");

        location.href="../index.html";
    })

    let obj={
        type:"get",
        url:"/fetchUser",
        data:{
            inputEmail:email
        }
    }
    $.ajax(obj).done(function(responseAry){
        if(responseAry.length==0){
            $("#activeUser").html(localStorage.getItem("activeUser"));
        }
        else{
            let name = responseAry[0].pname;
            name = name.toUpperCase();
            $("#activeUser").html(name);
        }
    }).fail(function(){
        // alert("Server Error");
    })



    $("#newPwd").keyup(function(){
        let password=$(this).val();
        let numeric=/\d/.test(password);
        let character=/[!@#$%^&*(),.?":{}|<>]/.test(password);
        let alpha=/[A-Z]/.test(password);
        if(password.length<8){
            $("#newPwdErr").html("Less than 8 char.").addClass("notOk").removeClass("ok");
        }
        else if(numeric==false){
            $("#newPwdErr").html("easy").addClass("notOk").removeClass("ok");

        }
        else if(character==false){
            $("#newPwdErr").html("Medium").addClass("notOk").removeClass("ok");

        }
        else if(alpha==false){
            $("#newPwdErr").html("Medium").addClass("notOk").removeClass("ok");
            
        }
        else{
            $("#newPwdErr").html("Strong").addClass("ok").removeClass("notOk");

        }
    })




    $("#setting").hover(
        function() {
            $("#settingIcon").css("animation", "infiniteRotate 1.5s linear infinite");
        },
        function() {
            $("#settingIcon").css("animation", "none");
        }
    );


    // ------------------------Password visibility-----------------------------
    $("#oldBtnEye").mousedown(function(){
        $("#oldPwd").prop("type","text");
        $("#oldIconEye").removeClass("fa-eye-slash").addClass("fa-eye");
    })
    $("#oldBtnEye").mouseup(function(){
        $("#oldPwd").prop("type","password");
        $("#oldIconEye").addClass("fa-eye-slash").removeClass("fa-eye");
    })

    $("#newBtnEye").mousedown(function(){
        $("#newPwd").prop("type","text");
        $("#newIconEye").removeClass("fa-eye-slash").addClass("fa-eye");
    })
    $("#newBtnEye").mouseup(function(){
        $("#newPwd").prop("type","password");
        $("#newIconEye").addClass("fa-eye-slash").removeClass("fa-eye");
    })

    $("#renewBtnEye").mousedown(function(){
        $("#renewPwd").prop("type","text");
        $("#renewIconEye").removeClass("fa-eye-slash").addClass("fa-eye");
    })
    $("#renewBtnEye").mouseup(function(){
        $("#renewPwd").prop("type","password");
        $("#renewIconEye").addClass("fa-eye-slash").removeClass("fa-eye");
    })
// ------------------------Password visibility-----------------------------

    $("#renewPwd").keyup(function(){
        let newpassword=$("#newPwd").val();
        let renewpassword=$(this).val();

        if(newpassword===renewpassword){
            $("#renewPwdErr").html("Match!").addClass("ok").removeClass("notOk");
            $("#chkrmb").prop("disabled",false);
           $("#rmbPwd").removeClass("notOk");


        }
        else{
            $("#renewPwdErr").html("Not Match!").addClass("notOk").removeClass("ok");
            $("#chkrmb").prop("disabled",true);
            
        }

    })

    $("#change").click(function(){
        let oldpwd= $("#oldPwd").val();
        let newpwd= $("#newPwd").val();
        let renewpwd= $("#renewPwd").val();


        if (!chkrmb.checked) {
           $("#rmbPwd").addClass("notOk");
           return;
        }

        if(oldpwd===newpwd){
            alert("Old and new passwords are same");
            return;
        }
        let obj={
            type:"get",
            url:"/changePwd",
            data:{
                inputEmail:email,
                inputoldPwd:oldpwd,
                inputNewPwd:newpwd
            }
        }
        $.ajax(obj).done(function(response){
            alert(response);
        }).fail(function(err){
            alert(err.message);
        })
        
    })

    
});

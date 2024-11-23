$(document).ready(function(){
   
    $("#btnSignup").click(function(){
        let email=$("#signupTxtEmail").val();
        let password=$("#signupTxtPwd").val();;
        let usertype=$("#userType").val();

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
    })    

})
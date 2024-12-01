$(document).ready(function() {
    $("#inputEmail").val(localStorage.getItem("activeUser")).attr("readonly",true);


        let email=$("#inputEmail").val();

        let obj={
            type:"get",
            url:"/fetchUser",
            data:{
                inputEmail:email
            }
        }
        $.ajax(obj).done(function(responseAry){
            if(responseAry.length==0){
                return;
            }
            $("#inputName").val(responseAry[0].pname);
            // $("#inputDOB").val(responseAry[0].DOB);
            $("#inputGender").val(responseAry[0].gender);
            $("#inputGame").val(responseAry[0].game);
            $("#inputMobileNo").val(responseAry[0].mobileno);
            $("#inputAddress").val(responseAry[0].address);
            $("#inputZipcode").val(responseAry[0].zipcode);
            $("#inputCity").val(responseAry[0].city);
            $("#selectIdProof").val(responseAry[0].idproof);
            $("#inputOtherInfo").val(responseAry[0].otherinfo);


            $("#prevProofPic").prop("src",responseAry[0].proofpic);
            $("#prevProfilePic").prop("src",responseAry[0].profilepic);
           
            let utcDate = responseAry[0].DOB;
            let localDate = new Date(utcDate);


            localDate.setDate(localDate.getDate() + 1);

            let formattedDate = localDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
            
            $("#inputDOB").val(formattedDate);

        }).fail(function(){
                alert("enter Your details");
        })


    $("#setting").hover(
        function() {
            // On mouse enter, apply animation
            $("#settingIcon").css("animation", "infiniteRotate 1.5s linear infinite");
        },
        function() {
            // On mouse leave, reset animation
            $("#settingIcon").css("animation", "none");
        }
    );

});
function preview(prevProfilePic){
    prevProfilePic.src=URL.createObjectURL(event.target.files[0]);
}
function proofpreview(prevProofPic){
    prevProofPic.src=URL.createObjectURL(event.target.files[0]);
}

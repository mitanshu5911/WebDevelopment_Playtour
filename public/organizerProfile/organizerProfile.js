$(document).ready(function() {
    $("#inputEmail").val(localStorage.getItem("activeUser")).attr("readonly",true);


        let email=$("#inputEmail").val();

        let obj={
            type:"get",
            url:"/fetchOrgaizer",
            data:{
                inputEmail:email
            }
        }
        $.ajax(obj).done(function(responseAry){
            if(responseAry.length==0){
                return;
            }
            $("#inputOrganizationName").val(responseAry[0].oname);
            $("#inputRepresentativeName").val(responseAry[0].RepName);
            $("#inputRepresentativeNo").val(responseAry[0].Repno);
            $("#inputSecondName").val(responseAry[0].SecName);
            $("#inputSecondNo").val(responseAry[0].SecNo);
            

            $("#inputAddress").val(responseAry[0].address);
            $("#inputZipcode").val(responseAry[0].zipcode);
            $("#inputCity").val(responseAry[0].city);
            $("#selectIdProof").val(responseAry[0].idproof);
            $("#inputOtherInfo").val(responseAry[0].otherinfo);


            $("#prevProofPic").prop("src",responseAry[0].proofpic);
            $("#prevProfilePic").prop("src",responseAry[0].profilepic);
           
            

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
    $("#inputOtherInfo").keyup(function(){
        let text=$(this).val();
        let len=text.length;

        $("#count").html(len);
    });

    const zipcode=[
        { city: "Amritsar", zip: "143001" },
        { city: "Raman", zip: "151301" },
        
          { city: "Ludhiana", zip: "141001" },
          { city: "Jalandhar", zip: "144001" },
          { city: "Patiala", zip: "147001" },
          { city: "Bathinda", zip: "151001" },
          { city: "Mohali", zip: "140301" },
          { city: "Hoshiarpur", zip: "146001" },
          { city: "Pathankot", zip: "145001" },
          { city: "Gurdaspur", zip: "143521" },
          { city: "Barnala", zip: "148101" },
          { city: "Malerkotla", zip: "148023" },
          { city: "Kapurthala", zip: "144601" },
          { city: "Fazilka", zip: "152123" },
          { city: "Ferozepur", zip: "152001" },
          { city: "Moga", zip: "142001" },
          { city: "Nawanshahr", zip: "144514" },
          { city: "Mumbai", zip: "400001" },
          { city: "Delhi", zip: "110001" },
          { city: "Bangalore", zip: "560001" },
          { city: "Kolkata", zip: "700001" },
          { city: "Chennai", zip: "600001" },
          { city: "Hyderabad", zip: "500001" },
          { city: "Ahmedabad", zip: "380001" },
          { city: "Pune", zip: "411001" },
          { city: "Jaipur", zip: "302001" },
          { city: "Lucknow", zip: "226001" },
          { city: "Kanpur", zip: "208001" },
          { city: "Nagpur", zip: "440001" },
          { city: "Bhopal", zip: "462001" },
          { city: "Indore", zip: "452001" },
          { city: "Patna", zip: "800001" },
          { city: "Ranchi", zip: "834001" },
          { city: "Raipur", zip: "492001" },
          { city: "Surat", zip: "395001" },
          { city: "Vadodara", zip: "390001" },
          { city: "Guwahati", zip: "781001" },
          { city: "Shillong", zip: "793001" },
          { city: "Gangtok", zip: "737101" },
          { city: "Shimla", zip: "171001" },
          { city: "Dehradun", zip: "248001" },
          { city: "Chandigarh", zip: "160001" },
          { city: "Thiruvananthapuram", zip: "695001" },
          { city: "Cochin", zip: "682001" },
          { city: "Mysore", zip: "570001" },
          { city: "Udaipur", zip: "313001" },
          { city: "Zirakpur", zip: "140603" },
          { city: "Khanna", zip: "141401" },
          { city: "Gobindgarh", zip: "147301" },
          { city: "Tarn Taran", zip: "143401" },
          { city: "Sangrur", zip: "148001" },
          { city: "Ropar (Rupnagar)", zip: "140001" },
          { city: "Muktsar", zip: "152026" },
          { city: "Faridkot", zip: "151203" },
          { city: "Kotkapura", zip: "151204" },
          { city: "Mansa", zip: "151505" },
          { city: "Sultanpur Lodhi", zip: "144626" },
          { city: "Phillaur", zip: "144410" },
          { city: "Balachaur", zip: "144521" },
          { city: "Dasuya", zip: "144205" },
          { city: "Garhshankar", zip: "144527" },
          { city: "Samrala", zip: "141114" },
          { city: "Banga", zip: "144505" },
          { city: "Bhogpur", zip: "144201" },
          { city: "Qadian", zip: "143516" },
          { city: "Shahkot", zip: "144702" },
          { city: "Nakodar", zip: "144040" },
          { city: "Dhuri", zip: "148024" },
          { city: "Bagha Purana", zip: "142038" },
          { city: "Malout", zip: "152107" },
          { city: "Abohar", zip: "152116" },
          { city: "Budhlada", zip: "151502" },
          { city: "Patti", zip: "143416" },
          { city: "Nabha", zip: "147201" },
          { city: "Sunam", zip: "148028" }
        ]
        
            $("#inputZipcode").keyup(function(){
                let code=$(this).val();
        
                for(let i=0;i<zipcode.length;i++){
                    if(zipcode[i].zip===code){
                        $("#inputCity").val(zipcode[i].city);
                        break;
                    }
                }
            })

});
function preview(prevProfilePic){
    prevProfilePic.src=URL.createObjectURL(event.target.files[0]);
}
function proofpreview(prevProofPic){
    prevProofPic.src=URL.createObjectURL(event.target.files[0]);
}

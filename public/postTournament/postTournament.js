$(document).ready(function(){
    $("#inputEmail").val(localStorage.getItem("activeUser")).attr("readonly",true);

    $("#post").click(function(){
        $(".deleteTournament").css("display","none");
        $(".infoTournament").css("display","block");
        $(this).css("background","white");
        $("#delete").css("background","#09c1a2");
        


    })
    $("#delete").click(function(){
        $(".deleteTournament").css("display","block");
        $(".infoTournament").css("display","none");
        $(this).css("background","white");
        $("#post").css("background","#09c1a2");
       

    })
    $("#inputOtherInfo").keyup(function(){
        let text=$(this).val();
        let len=text.length;

        $("#count").html(len);
    });
})

function preview(prevPosterPic){
    prevPosterPic.src=URL.createObjectURL(event.target.files[0]);
}
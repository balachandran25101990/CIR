var test;

function SetErrorMessage(Text) {
    toastr["error"](Text);
    return false;
}

function SetSuccessMessage(Text) {
    toastr["success"](Text);
    return false;
}

function SetWarningMessage(Text) {
    toastr["warning"](Text);
    return false;
}

function validateEmail(email) {
  
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

$(document).ready(function () {
    $("#menu-toggle").click(function () {
        
        if ($("#wrapper").hasClass("toggled"))
            $("#logoHide").fadeIn();
        else
            $("#logoHide").fadeOut();
    });
});

function getlogin() {
    //$('#modalLogin').modal('show');
    var data = {
        requestUrl: "Account/DoAction",
        obj2send:
            {
                action: "user",
                type: "getlogin"
            },
        returnDataContainer: "",
        additionalActions: AfterGetLogin,
        objparameter: ""
    };
    if (document.location.pathname.indexOf('Account') > -1 ||
        document.location.pathname.indexOf('Management') > -1) {
        data.requestUrl = "DoAction";
    }
    PostData(data);
}
function AfterGetLogin(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Autentificare');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#modalLogin').modal('show');
    $('input[type=text]').val("");
    $('input[type=password]').val("");
}
function setlogin() {
    var user = $('input[type=text]').val();
    var parola = $('input[type=password]').val();
    if (user.length <= 1 || parola.length <= 1) {
        AlertMessage("Completati toate campurile!");
    } else {
        var data = {
            requestUrl: "Account/DoAction",
            obj2send:
            {
                action: "user",
                type: "login",
                user: user,
                parola: parola
            },
            returnDataContainer: "",
            additionalActions: AfterLogin,
            objparameter: ""
        };
        PostData(data);
    }
}
function changePass() {
    var old = $('input[type=password]:eq(0)').val();
    var now = $('input[type=password]:eq(1)').val();
    var repeat = $('input[type=password]:eq(2)').val();
    if (old.length <= 1 || now.length <= 1 || repeat <= 1) {
        AlertMessage("Completati toate campurile!");
    } else {
        var data = {
            requestUrl: "Account/DoAction",
            obj2send:
            {
                action: "user",
                type: "changePass",
                old: old,
                now: now,
                repeat: repeat//,
                //user: User.Identity.Name
            },
            returnDataContainer: "",
            additionalActions: AfterChangePass,
            objparameter: ""
        };
        PostData(data);
    }
}
function AfterChangePass() {
    $("#modalLogin").modal("hide");
}
function AfterLogin() {
    $("#modalLogin").modal("hide");
    window.location.reload();
}
function logOut() {
    $.post("LogOut").done(function () {
        window.location.reload();
    });
}
function AfterLogOut() {
}
function getChangePass() {
    var data = {
        requestUrl: "Account/DoAction",
        obj2send:
            {
                action: "user",
                type: "getchangepass"
            },
        returnDataContainer: "",
        additionalActions: AfterGetChangePass,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetChangePass(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Resetare parola');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#modalLogin').modal('show');
}

//////////////////////////  UTILIZATORI     ///////////////////////////////////////////////////////////////////////////////////
function GetUsersTable() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "getuserstable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetUsersTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetUsersTable(result) {
    $("#table-users").html("");
    $("#table-users").html(result.content[0]);
    var btnAdauga = "<ul style='height:20px'><content style='list-style-type:none'><button id='btnAdauga' class='btn btn-xs btn-white btn-transparent tip' onclick='adauga()' style='float:left;min-width: 100px !important;' title='Adauga un utilizator nou!'><span class='glyphicon glyphicon-floppy-open'></span>ADAUGA</button></content></ul>";
    if ($("#btnAdauga").exists() == false) {
        $('header').append(btnAdauga);
    }
    tip();
}
function EditUser(btn) {
    var idUser = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "getuserinfo",
                idUser: idUser
            },
        returnDataContainer: "",
        additionalActions: AfterGetUserInfo,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetUserInfo(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Informatii utilizator');
    $('#modalLogin .modal-body').html(result.content[0]);
    var idRol = $('input[name=ddlrol-selectedValue]').val();
    var idReprezentanta = $('input[name=ddlreprezentanta-selectedValue]').val();
    $('#ddlrol li').find('a[data-value=' + idRol + ']').click();
    $('#ddlreprezentanta li').find('a[data-value=' + idReprezentanta + ']').click();
    $("#ddlrol, #ddlreprezentanta, #saveModif").css('display', 'none');
    $('#modalLogin').modal('show');
}
function rolChanged(elem) {
    DdlChanged(elem);
}
function reprezentantaChanged(elem) {
    DdlChanged(elem);
}
function enablModif(btn) {
    $("#enableModif").fadeOut();
    $("#saveModif").fadeIn();
    $('#modalLogin .modal-body input[type=text]').removeAttr('disabled');
    $("#ddlrol, #ddlreprezentanta").fadeIn('slow');
    $('#reprezentanta, #rol').parent().fadeOut('slow');
}
function adauga() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "openadauga"
            },
        returnDataContainer: "",
        additionalActions: AfterOpenAdauga,
        objparameter: ""
    };
    PostData(data);
}
function AfterOpenAdauga(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Adauga utilizator');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#modalLogin .modal-body input[type=text]').removeAttr('disabled');
    //$("#ddlrol, #ddlreprezentanta").fadeIn('slow');
    $('#enableModif').remove();
    $('#reprezentanta, #rol').parent().fadeOut('slow');
    $('#modalLogin').modal('show');
}
function savModif() {
    var idUser = $('#modalLogin form').attr('data-value');
    var nume = $("#nume").val().trim().toUpperCase();
    var prenume = $("#prenume").val().trim().toUpperCase();
    var telefon = $("#telefon").val().trim().toUpperCase();
    var email = $("#email").val().trim().toUpperCase();
    var idLogin = $("#idLogin").val().trim().toUpperCase();
    var rol = $('input[name=ddlrol-selectedValue]').val(); ;
    var reprezentanta = $('input[name=ddlreprezentanta-selectedValue]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "savenewuser",
                idUser: idUser,
                nume: nume,
                pr: prenume,
                tel: telefon,
                em: email,
                idLogin: idLogin,
                idRol: rol,
                idRepr: reprezentanta
            },
        returnDataContainer: "",
        additionalActions: AfterSaveNewUser,
        objparameter: ""
    };
    PostData(data);
}
function AfterSaveNewUser(result) {
    if (result.ok) {
        $("#modalLogin").modal("hide");
    }
    GetUsersTable();
}
function resetUser(btn) {
    var idUser = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "resetpass",
                idUser: idUser
            },
        returnDataContainer: "",
        additionalActions: tip,
        objparameter: ""
    };
    PostData(data);
}
function DeleteUser(btn) {
    var idUser = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "user",
                type: "deleteuser",
                idUser: idUser
            },
        returnDataContainer: "",
        additionalActions: AfterDeleteUser,
        objparameter: ""
    };
    PostData(data);
}
function AfterDeleteUser() {
    GetUsersTable();
}

/////////////////////////////////////////////   REPREZENTANTE   ////////////////////////////////////////////////////////////
function GetReprezentanteTable(tabel) {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "repr",
                type: "getreprtable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetReprTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetReprTable(result) {
    $("#table-reprezentante").html("");
    $("#table-reprezentante").html(result.content[0]);
    var btnAdauga = "<ul style='height:20px'><content style='list-style-type:none'><button id='btnAdaugaRepr' class='btn btn-xs btn-white btn-transparent tip' onclick='adaugaRepr()' style='float:left;min-width: 100px !important;' title='Adauga o reprezentanta noua!'><span class='glyphicon glyphicon-floppy-open'></span>ADAUGA</button></content></ul>";
    if ($("#btnAdaugaRepr").exists() == false) {
        $('header').append(btnAdauga);
    }
    tip();
}
function EditRepr(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "repr",
                type: "getrepr",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterGetRepr,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetRepr(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Informatii reprezentanta');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#modalLogin').modal('show');
}
function adaugaRepr() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "repr",
                type: "getrepr",
                id: "-1"
            },
        returnDataContainer: "",
        additionalActions: AfterGetRepr,
        objparameter: ""
    };
    PostData(data);
}
function saveRepr() {
    var id = $('#modalLogin form').attr('data-value');
    var denumire = $("#denumire").val().trim().toUpperCase();
    var oras = $("#oras").val().trim().toUpperCase();
    var adresa = $("#adresa").val().trim().toUpperCase();
    var telefon = $("#telefon").val().trim().toUpperCase();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "repr",
                type: "save",
                id: id,
                denumire: denumire,
                oras: oras,
                adresa: adresa,
                telefon: telefon
            },
        returnDataContainer: "",
        additionalActions: AfterSaveRepr,
        objparameter: ""
    };
    PostData(data);
}
function AfterSaveRepr() {
    GetReprezentanteTable();
    $("#modalLogin").modal("hide");
}
function DeleteRepr(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "repr",
                type: "delete",
                id: id
            },
        returnDataContainer: "",
        additionalActions: GetReprezentanteTable,
        objparameter: ""
    };
    PostData(data);
}

//////////////////////////////////////////////  MASINI      //////////////////////////////////////////////////////////////////////////////
function viewDetalii(btn) {
    var dotari = $(btn).attr('data-dotari');
    var descriere = $(btn).attr('data-descriere');
    var glyphDotari = "<span title='Dotari' class='tip alert alert-success glyphicon glyphicon-list' style='margin-bottom:0px'></span>";
    var glyphDescr = "<span title='Descriere' class='tip alert alert-success glyphicon glyphicon-stats' style='margin-bottom:0px'></span>";
    var div = "<div class='alert alert-success' style='margin-top: 10px;position: initial;font-size: 12px;float: left; width: 100%; padding: 10px; margin-bottom: 0px; left: 3%; font-weight: 600; font-family: comic sans ms;'></div>";
    $('#modalLogin .modal-body').html(div);
    $('#modalLogin .modal-body div:first').html(dotari);
    $('#modalLogin .modal-body div:first').prepend(glyphDotari);
    $('#modalLogin .modal-body').append(div);
    $('#modalLogin .modal-body div:last').html(descriere);
    $('#modalLogin .modal-body div:last').prepend(glyphDescr);
    $('#modalLogin .modal-header h2').html("Detalii");
    tip();
    $('#modalLogin').modal('show');
}
function GetMasiniTable() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "masini",
                type: "getmasinitable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetMasiniTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetMasiniTable(result) {
    $("#table-masini").html("");
    $("#table-masini").html(result.content[0]);
    var btnAdauga = "<ul style='height:20px'><content style='list-style-type:none'><button id='btnAdaugaMasina' class='btn btn-xs btn-white btn-transparent tip' onclick='adaugaMasina()' style='float:left;min-width: 100px !important;' title='Adauga o masina noua!'><span class='glyphicon glyphicon-floppy-open'></span>ADAUGA</button></content></ul>";
    if ($("#btnAdaugaMasina").exists() == false) {
        $('header').append(btnAdauga);
    }
    tip();
}
function veziMasina(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "masini",
                type: "getmasinainfo",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterGetMasinaInfo,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetMasinaInfo(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Informatii masina');
    $('#modalLogin .modal-body').html(result.content[0]);
    var idReprezentanta = $('input[name=ddlreprezentanta-selectedValue]').val();
    $('#ddlreprezentanta li').find('a[data-value=' + idReprezentanta + ']').click();
    $("#saveModifMasina, #ddlreprezentanta").css('display', 'none');
    $('#modalLogin').modal('show');
}
function enablModifMasina() {
    $("#enableModifMasina, #divTestdrive").fadeOut();
    $("#saveModifMasina").fadeIn();
    $('#modalLogin .modal-body input[type=text], #modalLogin .modal-body textarea').removeAttr('disabled');
    $("#ddlreprezentanta").fadeIn('slow');
    $('#divCheckbox').fadeIn('slow');
    $('#repr').parent().fadeOut('slow');
    $('input[name=an]').removeClass('form-control').datepicker(
    {
        //    monthNamesShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        //    , dayNamesMin: ["D", "L", "Ma", "Mi", "J", "V", "S"]
        firstDay: 1
        , dateFormat: 'yy-mm-dd'
        //, changeMonth: true
        , changeYear: true
        , showAnim: 'show'
        , maxDate: 1
        , minDate: "-10y"
    }
);
}
function adaugaMasina() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "masini",
                type: "openadauga"
            },
        returnDataContainer: "",
        additionalActions: AfterOpenAdaugaMasina,
        objparameter: ""
    };
    PostData(data);
}
function AfterOpenAdaugaMasina(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Informatii masina');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#km').val("");
    enablModifMasina();
    $('#modalLogin').modal('show');
}
function savModifMasina() {
    var id = $('#modalLogin form').attr('data-value');
    var model = $("#model").val().trim().toUpperCase();
    var pret = $("#pret").val().trim().toUpperCase();
    var km = $("#km").val().trim().toUpperCase();
    var an = $("#an").val().trim().toUpperCase();
    var idLocal = $("#idLocal").val().trim().toUpperCase();
    var dotari = $("#dotari").val().trim().toUpperCase();
    var descriere = $("#descriere").val().trim().toUpperCase();
    var drive = $("input[type=checkbox]").prop('checked');
    var idRepr = $('input[name=ddlreprezentanta-selectedValue]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "masini",
                type: "save",
                id: id,
                model: model,
                pret: pret,
                km: km,
                an: an,
                idLocal: idLocal,
                dotari: dotari,
                descriere: descriere,
                drive: drive,
                idRepr: idRepr
            },
        returnDataContainer: "",
        additionalActions: AfterSaveMasina,
        objparameter: ""
    };
    if (isNaN(pret) == true || isNaN(km)) {
        AlertMessage("Pretul si nr. de km trebuie sa fie numere intregi!");
        return;
    }
    PostData(data);
}
function AfterSaveMasina(result) {
    if (result.ok) {
        $("#modalLogin").modal("hide");
    }
    GetMasiniTable();
}
function sendMsg() {
    var telefon = $('#telefonM input').val().trim();
    var email = $('#emailM input').val().trim();
    var mesaj = $('div#mesaje textarea').val().trim();
    if (telefon.length <= 1 || email.length <= 1 || mesaj.length <= 1) {
        AlertMessage("Completati toate campurile");
    } else {
        var data = {
            requestUrl: "DoAction",
            obj2send:
            {
                action: "mesaje",
                type: "save",
                telefon: telefon,
                email: email,
                mesaj: mesaj
            },
            returnDataContainer: "",
            additionalActions: GetMasiniTable,
            objparameter: ""
        };
        PostData(data);
    }
}
function sendTest() {
    var id = $('#ddlrepr input').val();
    var telefon = $('#telefonM input').val().trim();
    var mesaj = $('div#mesaje textarea').val().trim();
    if (telefon.length <= 1 || id == "-1" || mesaj.length <= 1) {
        AlertMessage("Completati toate campurile");
    }
    else {
        var data = {
            requestUrl: "DoAction",
            obj2send:
            {
                action: "testDrive",
                type: "save",
                id: id,
                telefon: telefon,
                mesaj: mesaj
            },
            returnDataContainer: "",
            additionalActions: empty,
            objparameter: ""
        };
        PostData(data);
    }
}
function abonare() {
    var email = $('#emailN input').val().trim();
    if (email.length <= 1) {
        AlertMessage("Completati toate campurile");
    } else {
        var data = {
            requestUrl: "DoAction",
            obj2send:
            {
                action: "news",
                type: "save",
                email: email
            },
            returnDataContainer: "",
            additionalActions: GetMasiniTable,
            objparameter: ""
        };
        PostData(data);
    }
}
function empty() {
    //DismissAlert();
}

/////////////////////////////////////////////   NEWSLETTER      ////////////////////////////////////////////////////////////////////////
function GetNewsletterTable() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "news",
                type: "getnewstable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetNewsTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetNewsTable(result) {
    $("#table-newsletter").html("");
    $("#table-newsletter").html(result.content[0]);
}
function DeleteEmail(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "news",
                type: "sterge",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterDeleteNews,
        objparameter: ""
    };
    PostData(data);
}
function AfterDeleteNews() {
    GetNewsletterTable();
}

/////////////////////////////////////////////   TESTDRIVE      ////////////////////////////////////////////////////////////////////////
function GetTestdriveTable() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "testdrive",
                type: "gettestdrivetable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetTestdriveTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetTestdriveTable(result) {
    $("#table-testdrive").html("");
    $("#table-testdrive").html(result.content[0]);
    tip();
}
function DeleteTest(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "testdrive",
                type: "sterge",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterDeleteTest,
        objparameter: ""
    };
    PostData(data);
}
function AfterDeleteTest(result) {
    GetTestdriveTable();
}
function getTestDriveForm() {
}

/////////////////////////////////////////////   MESAJE       ////////////////////////////////////////////////////////////////////////////////
function GetMesajeTable() {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "mesaje",
                type: "getmesajetable"
            },
        returnDataContainer: "",
        additionalActions: AfterGetMesajeTable,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetMesajeTable(result) {
    $("#table-mesaje").html("");
    $("#table-mesaje").html(result.content[0]);
    $('button#edit').attr('title', 'Vizualizeaza mesajul!')
    tip();
    $('table tr').find('td:last-child').prev().each(function (index, el) {
        if ($(el).text() == "nou") {
            $(el).parent().css('background-color', '#ffbbbb');
        }
    })
}
function veziMesaj(btn) {
    var id = $(btn).parents('tr').find('input[type=hidden]').val();
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "mesaje",
                type: "getmesaj",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterGetMesaj,
        objparameter: ""
    };
    PostData(data);
}
function AfterGetMesaj(result) {
    $('#modalLogin .modal-body').html('');
    $('#modalLogin h2').html('').html('Continut mesaj');
    $('#modalLogin .modal-body').html(result.content[0]);
    $('#modalLogin').modal('show');
}
function setAsRead(id) {
    var data = {
        requestUrl: "DoAction",
        obj2send:
            {
                action: "mesaje",
                type: "setasread",
                id: id
            },
        returnDataContainer: "",
        additionalActions: AfterSetasread,
        objparameter: ""
    };
    PostData(data);
}
function AfterSetasread() {
    $("#modalLogin").modal('hide');
    GetMesajeTable();
}

/////////////////////////////////////////////   UTILE       ////////////////////////////////////////////////////////////////////////////////
function PostData(data) {
    ShowHideLoader(true);
    $.post(data.requestUrl, data.obj2send).success(function (result) {
        if (result.ok) {
            $(data.returnDataContainer).html(result.content[0]);
            data.additionalActions(result, data.objparameter);
            if (result.message.length > 0) {
                ShowMessage(result.message);
            }
        }
        else if (result.message != null) {
            AlertMessage(result.message);
        }
    }).fail(function () {
        AlertMessage("Eroare la procesarea cererii");
    }).always(function () {
        ShowHideLoader(false);
    });
}
function ShowHideLoader(show) {
    if (show) {
        $('.loader2').fadeIn();
        $('.backdrop').fadeIn();
    }
    else {
        $('.loader2').fadeOut();
        $('.backdrop').fadeOut();
    }
}
function DdlChanged(selectedItem) {
    var span = $(selectedItem).parents('div:first').find('button span:first');
    $(span).text($(selectedItem).text());
    $(selectedItem).parents('div:first').find('input[type=hidden]:first').val($(selectedItem).attr('data-value'));
}
function tip() {
    $('.tip').uitooltip(
            {
                show: { effect: 'slideDown', delay: 500 },
                hide: 'slideUp'
            });
}
function DismissAlert() {
    $('div#message-alerter').css('top', '-20%');
    $('div#message-alerter').fadeOut();
    $('div#messages').css('top', '-20%');
    $('div#messages').fadeOut();
    $('div#messages span:last').text('');
    $('div#message-alerter span:last').text('');
}
function ShowMessage(message) {
    $('div#messages').fadeOut();
    $('div#messages span:last').text(message);
    $('div#messages').fadeIn();
    $('div#messages').css('top', '20%');
}
function AlertMessage(message) {
    $('div#message-alerter').fadeOut();
    $('div#message-alerter span:last').text(message);
    $('div#message-alerter').fadeIn();
    $('div#message-alerter').css('top', '20%');
}
jQuery.fn.exists = function () {
    return this.length > 0;
}
/// changeYear in modal
var enforceModalFocusFn = $.fn.modal.Constructor.prototype.enforceFocus;
$.fn.modal.Constructor.prototype.enforceFocus = function () { };

$(document).keyup(function (e) {
    if (e.keyCode == '27') //ESC KEY
    {
        DismissAlert();
    }
});
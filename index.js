jQuery(document).ready(function() { 
    
    $("#formRepo").hide();
    $("#BTNescribir").hide();
    $("#formFichero").hide();
    $("#CogerTexto").click(escribirFichero);
    $("#LeerTexto").click(leerFichero);

    hello.init({
        github : '2f82665cf03c27a65f97'
    },{
        redirect_uri : 'redirect.html',
        oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
    });

    access = hello("github");
    access.login({response_type: 'code'}).then( function(){
	    auth = hello("github").getAuthResponse();
	    token = auth.access_token;
	    github = new Github({
	        token: token,
	        auth: "oauth"
	    });
        $("#formRepo").show();
        $("#CogerRepo").click(cogerRepo);
    }, function( e ){
	    alert('Signin error: ' + e.error.message);
    });
});

var github;
var repo;

function cogerRepo(){
    var username = $("#NombreUsuario").val();
    var reponame = $("#NombreRepo").val();
    mirepo = github.getRepo(username, reponame);
    mirepo.show(mostrarRepo);
}

function mostrarRepo(err, repo) {
    if(err){
        $("#ficherosRepo").html("Ha habido un error!<br>"+err);
    }else{
        $("#infoRepo").html("<p>Datos del repositorio:</p><ul><li>Descripción del repositorio: " + repo.description + "</li>" + "<li>Fecha de creación: " + repo.created_at + "</li>" + "<li>Nombre completo: " + repo.full_name + "</li></ul>");
        mirepo.contents('master', '', listarInfo);
    }
}

function listarInfo(err, contents){
    var ficherosRepo = $("#ficherosRepo");
    if (err) {
	    ficherosRepo.html("<p>Código de error: " + err.error + "</p>");
    } else {
        var ficheros = [];
        for (var i = 0, len = contents.length; i < len; i++) {
            ficheros.push(contents[i].name);
        };
        ficherosRepo.html("<p>Aquí puede seleccionar el fichero que quiere leer o escribir; o puede crear uno nuevo:</p>" + "<ul id='ficheros'><li>" + ficheros.join("</li><li>") + "</li></ul>");
        $("#formFichero").show();
        $("#ficheros li").click(seleccionarFichero);
    }
}

function seleccionarFichero() {
    element = $(this);
    console.log (element);
    $("#NombreFichero").val(element.text());
};

function escribirFichero() {
    var nombreFichero = $("#NombreFichero").val();
    var contenidoFichero = $("#ContenidoFichero").val();
    var mensajeCommit = $("#MensajeCommit").val();
    if (mensajeCommit == ""){
        mensajeCommit = "Actualizado desde prueba con OAuth!";
    }
    console.log(nombreFichero);
    console.log(contenidoFichero);
    console.log(mensajeCommit);
    mirepo.write('master', nombreFichero, contenidoFichero, mensajeCommit, 
        function(err) {
            if(!err){
                $("#done").html("<p>Escritura realizada con éxito!</p>");
            }else{
                $("#done").html("<p>error:" + err + "</p>");
        }
    });
};

function leerFichero() {
    var filename = $("#NombreFichero").val();
    mirepo.read('master', filename, function(err, data) {
	    $("#ContenidoFichero").val(data);
        $("#done").html("Lectura realizada con éxito!");
    });
};

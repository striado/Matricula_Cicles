"use strict";

function generarId(){
    let nom = $('#newNom').val();
    let cognom1 = $('#newCognom1').val();

    if (nom != '' && cognom1 != '') {
        let idTemp = `${nom.substring(0,1)}.${cognom1}`;

        let params =  JSON.stringify({accio:"read", matricula:`all`});
        let request = setRequest();

        try {
            request.send(params);
        } catch(error){
            console.log(error);
        }
    
        request.onload = function() {
            if (request.status != 200) {
                alert(`Error ${request.status}: ${request.statusText}`);
            } else {
                let response = JSON.parse(request.responseText);
                let newNumber = checkMatricula(response, idTemp); 
                if (newNumber != false){
                    $('#newId').val(`${nom.substring(0,1)}.${cognom1}${newNumber}`)
                } else {
                    $('#newId').val(`${nom.substring(0,1)}.${cognom1}`)
                }
            }
        }
    }
}

function checkMatricula(matricules, idTemp){
    let coincidents = [];
    let higher;
    matricules.forEach(matricula => {
        var id_sense_numeros =  matricula.id.replace(/[^a-z]/g, '');
        var idTemp_sense_numeros = idTemp.replace(/[^a-z]/g, '');
        if (id_sense_numeros === idTemp_sense_numeros) {
            coincidents.push(matricula.id.replace(/[^0-9]/g, ''));
        }
    });
    higher = Math.max(...coincidents);
    let newNumber = parseInt(higher) + 1;

    if (coincidents.length > 0) {
        return newNumber 
    } 
    return false;
}

// $('#novaMatricula').submit(function() {
    
// });

function formManager(){
    var errors = 0;
    $("#novaMatricula :input").map(function(){
        if ($(this).attr('name') != $('#novaMatricula :input[name="upload_img"]').attr('name') 
            && $(this).attr('name') != $('#novaMatricula :input[name="pagat"]').attr('name')
            && $(this).attr('name') != $('#novaMatricula :input[name="cognom2"]').attr('name')
            && $(this).attr('name') != $('#novaMatricula :input[name="id"]').attr('name')) {
            
                if( !$(this).val() ) {
                     $(this).addClass('is-invalid');
                     errors++;
               } else if ($(this).val()) {
                     $(this).removeClass('is-invalid');
               }   
        }
    });
    if(errors > 0){
        $('#errorwarn').text("Sisplau, emplena tots el camps.");
    } else {
        enviarFormulari();
    }
}

function enviarFormulari(){
    const form = document.getElementById("novaMatricula");
    const fd = new FormData(form);

    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:8080", true);
    request.setRequestHeader("Content-Type", "multipart/form-data");

    try {
        request.send(fd);
    } catch(error){
        console.log(error);
    }

    request.onload = function() {
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            let response = JSON.parse(request.responseText);
            console.log(response);
        }
    }

}
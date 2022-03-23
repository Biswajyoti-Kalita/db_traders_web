const fs = require('fs');
const path = require('path');
const { makePluralize, makeCapital, makeSingular, makeCamelCase, makeLowerCase } = require('./helper');


function getFields(fields) {
    var data = '';
    fields.map((item) => {
        data += `
            ${item} : req.body.${item},
        `;
    });
    return `{
        ${data},
        token: Cookies.get("token")
    }`;
}
module.exports = {
    generateScript: function(config_controllers) {

        for (item in config_controllers) {
            console.log("controller -> ", config_controllers[item].name);
            var current_controller = config_controllers[item];
            var file_data = `
                var limit = 25;
                var _offset = 0;
            `;


            if(current_controller.is_add){
                file_data += `
                    function add${makeCapital( current_controller.name ,1)}() {
                      $.ajax({
                        url: "/${makeLowerCase(current_controller.name,1)}/add${makeLowerCase(current_controller.name)}",
                        method: "POST",
                        data: ${getFields(current_controller.add_fields)},
                        success: function (result) {
                          console.log(result);
                          if(result.status == "success"){
                            swal({
                              title: "${makeCapital(current_controller.name)} Added successfully",
                              text: result.message,
                              icon: "success",
                              button: "Okay",
                            });
                            getBoards();
                          }
                          else 
                            swal({
                              title: "Unsuccessfully",
                              text: result.message,
                              icon: "error",
                              button: "Okay",
                            });
                        },
                      });
                    }
                `;
            }

            if(current_controller.is_edit){
                file_data += `
                    function update${makeCapital( current_controller.name ,1)}() {
                      $.ajax({
                        url: "/${makeLowerCase(current_controller.name,1)}/update${makeLowerCase(current_controller.name)}",
                        method: "POST",
                        data: ${getFields(current_controller.edit_fields)},
                        success: function (result) {
                          console.log(result);
                          if(result.status == "success"){
                            swal({
                              title: "${makeCapital(current_controller.name)} edited successfully",
                              text: result.message,
                              icon: "success",
                              button: "Okay",
                            });
                            getBoards();
                          }
                          else 
                            swal({
                              title: "Unsuccessfully",
                              text: result.message,
                              icon: "error",
                              button: "Okay",
                            });
                        },
                      });
                    }
                `;
            }
            if(current_controller.is_delete){
                file_data += `
                    function delete${makeCapital( current_controller.name ,1)}(id) {
                      $.ajax({
                        url: "/${makeLowerCase(current_controller.name,1)}/delete${makeLowerCase(current_controller.name)}",
                        method: "POST",
                        data: {
                            id: id,
                            token : Cookies.get("token")
                        },
                        success: function (result) {
                          console.log(result);
                          if(result.status == "success"){
                            swal({
                              title: "${makeCapital(current_controller.name)} deleted successfully",
                              text: result.message,
                              icon: "success",
                              button: "Okay",
                            });
                            getBoards();
                          }
                          else 
                            swal({
                              title: "Unsuccessfully",
                              text: result.message,
                              icon: "error",
                              button: "Okay",
                            });
                        },
                      });
                    }


                    async function delete${makeCapital(current_controller.name,1)}Modal(id) {                      
                        const res = await swal({
                                  title: "Are you sure?",
                                  text: "",
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                                });
                        console.log(res);
                        if(res){
                            deleteBoard(id);
                        }
                    }

                `;
            }


            fs.writeFile(__dirname + '/../release/public/scriptss.js', file_data, function(err) {
                if (err) return console.log(err);
            });

        }

    
    }

}










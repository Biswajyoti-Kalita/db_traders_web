


  // BOARDS


function getBoards() {
  $.ajax({
    url: "/secure/generic/getboards",
    method: "POST",
    data: {
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);      
      $("#boardTableBody , #addGradeBoard , #editGradeBoard").html('');
      $("#addQuestionBoards , #editQuestionBoard ").html('');
      for (var i = 0; i < result.length; i++) {

        $("#addGradeBoard , #editGradeBoard  ").append(`
          <option value="${result[i].id}" >${result[i].name}</option>
        `);

        $("#boardTableBody").append(`
          <tr>
            <td>${i+1}</td>
            <td>${result[i].name}</td>
            <td>
              <span class="btn btn-link btn-sm" onclick="editBoardModal(${result[i].id} , '${result[i].name}')">Edit</span>
              <span class="btn btn-link btn-sm" onclick="deleteBoardModal(${result[i].id})">Delete</span>
            </td>
          </tr>
        `);
        $("#addQuestionBoards , #editQuestionBoard").append(`
          <option value="${result[i].id}">${result[i].name}</option>
        `);
      }

      $('#addQuestionBoards').select2({        dropdownParent: $('#addQuestionModal')});

    },
  });
}
function addBoards() {
  $.ajax({
    url: "/secure/generic/addboard",
    method: "POST",
    data: {
      name : $("#addBoardInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if(result.status == "success"){
        $("#addBoardInput").val('')
        $("#addBoardModal").modal('hide');
        swal({
          title: "Board Added successfully",
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
function updateBoards() {
  $.ajax({
    url: "/secure/generic/updateboard",
    method: "POST",
    data: {
      name : $("#editBoardInput").val(),
      id : $("#editBoardId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if(result.status == "success"){
        $("#editBoardInput , #editBoardId").val('')
        $("#editBoardModal").modal('hide');
        swal({
          title: "Board Updated successfully",
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
function deleteBoards(id) {
  $.ajax({
    url: "/secure/generic/deleteboard",
    method: "POST",
    data: {
      id : id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if(result.status == "success"){
        swal({
          title: "Board Deleted successfully",
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
async function deleteBoardModal(id) {
  
  const res = await swal({
              title: "Are you sure?",
              text: "",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            });
  console.log(res);

  if(res){
    deleteBoards(id);
  }
}
function editBoardModal(id,name) {
  $("#editBoardModal").modal('show');
  $("#editBoardId").val(id);
  $("#editBoardInput").val(name);
}
$("#addBoardForm").on('submit',(ev) => {
  ev.preventDefault();
  addBoards();
})
$("#editBoardForm").on('submit',(ev) => {
  ev.preventDefault();
  updateBoards();
})
$("#addBoardBtn").on('click',(ev) => {
  $("#addBoardModal").modal('show');
})






async function getDefaults() {
  getBoards();
}

getDefaults();




			$(document).ready(function(){
				getCategorys();
			});

			var CategoryTableOffset = 0;
			var CategoryTableLimit = 10;
			var CategoryTableOrderField = 'id';
			var CategoryTableOrderFieldBy = 'DESC';

			function updateCategorysTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+CategoryTableOrderField+"Sort"+CategoryTableOrderFieldBy).removeClass("fade-l");
			}

			function getCategorys(searchObj) {
				
				updateCategorysTableHeaderSort();


				  	const data = {
				    	offset: CategoryTableOffset,
				    	limit : CategoryTableLimit,
				    	order: CategoryTableOrderField,
				    	order_by: CategoryTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/client/getcategories",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#categoryTableBody").html('');

				       $("#addCategory").html("");  
				       $("#editCategory").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#categoryTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Category')" type="checkbox" class=" checkbox-Category "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].parent ? result[i].parent : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].image_url ? result[i].image_url : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editCategoryModal(  '${result[i].name}', '${result[i].parent}', '${result[i].image_url}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteCategoryModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeCategorysTableOffset,CategoryTableLimit,CategoryTableOffset,'Category')
				    },
				  });
				}


				function changeCategorysTableOffset(num) {
					CategoryTableOffset  = num;
					getCategorys();
				}
				function changeCategorysTableLimit(num) {
					CategoryTableLimit  = num;
					getCategorys();
				}
				function changeCategorysTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					CategoryTableOrderField  = order_field;
					CategoryTableOrderFieldBy  = order_field_by;
					getCategorys();
				}


		
				var tempForm = "";
				$("#searchCategoryForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchCategoryForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getCategorys(searchObj);
				})
			
				function addCategory() {
				  $.ajax({
				    url: "/client/addcategory",
				    method: "POST",
				    data: {
				    	name :  $("#addCategoryNameInput").val() ,parent :  $("#addCategoryParentInput").val() ,image_url :  $("#addCategoryImageUrlInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addCategoryForm input, #addCategoryForm textarea").val('')
				        $("#addCategoryModal").modal('hide');
				        swal({
				          title: "Category Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCategorys();
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
			
				$("#addCategoryForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addCategory();
				})
				function addCategoryModal(){
				  $("#addCategoryModal").modal('show');					
				}
			
				function updateCategory()  {
				  $.ajax({
				    url: "/client/updatecategory",
				    method: "POST",
				    data: {
				    	name : $("#editCategoryNameInput").val(),parent : $("#editCategoryParentInput").val(),image_url : $("#editCategoryImageUrlInput").val(),id : $("#editCategoryCategoryId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editCategoryForm input, #editCategoryForm textarea").val('')
				        $("#editCategoryModal").modal('hide');
				        swal({
				          title: "Category Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCategorys();
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
			
				function editCategoryModal(name,parent,image_url,id) {
				  $("#editCategoryModal").modal('show');
				  $("#editCategoryCategoryId").val(id);
				  $("#editCategoryNameInput").val(name);$("#editCategoryParentInput").val(parent);$("#editCategoryImageUrlInput").val(image_url);
				}
				$("#editCategoryForm").on('submit',(ev) => {
					ev.preventDefault();
					updateCategory();
				})

			
				function deleteCategory(id) {
				  $.ajax({
				    url: "/client/deletecategory",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Category Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCategorys();
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
			

				async function deleteCategoryModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteCategory(id);
				  }
				}
			
				function bulkDeleteCategory(ids) {
				  $.ajax({
				    url: "/client/bulkdeletecategory",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Categories Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCategorys();
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
			

				async function bulkDeleteCategoryModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteCategory(ids);
				  }
				};

			
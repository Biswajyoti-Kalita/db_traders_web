

			$(document).ready(function(){
				getCarts();
			});

			var CartTableOffset = 0;
			var CartTableLimit = 10;
			var CartTableOrderField = 'id';
			var CartTableOrderFieldBy = 'DESC';

			function updateCartsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+CartTableOrderField+"Sort"+CartTableOrderFieldBy).removeClass("fade-l");
			}

			function getCarts(searchObj) {
				
				updateCartsTableHeaderSort();


				  	const data = {
				    	offset: CartTableOffset,
				    	limit : CartTableLimit,
				    	order: CartTableOrderField,
				    	order_by: CartTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/client/getcarts",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#cartTableBody").html('');

				       $("#addCart").html("");  
				       $("#editCart").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#cartTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Cart')" type="checkbox" class=" checkbox-Cart "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].product_id ? result[i].product_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].quantity ? result[i].quantity : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].status ? result[i].status : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editCartModal(  '${result[i].product_id}', '${result[i].quantity}', '${result[i].status}', '${result[i].user_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteCartModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeCartsTableOffset,CartTableLimit,CartTableOffset,'Cart')
				    },
				  });
				}


				function changeCartsTableOffset(num) {
					CartTableOffset  = num;
					getCarts();
				}
				function changeCartsTableLimit(num) {
					CartTableLimit  = num;
					getCarts();
				}
				function changeCartsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					CartTableOrderField  = order_field;
					CartTableOrderFieldBy  = order_field_by;
					getCarts();
				}


		
				var tempForm = "";
				$("#searchCartForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchCartForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getCarts(searchObj);
				})
			
				function addCart() {
				  $.ajax({
				    url: "/client/addcart",
				    method: "POST",
				    data: {
				    	product_id :  $("#addCartProductIdInput").val() ,quantity :  $("#addCartQuantityInput").val() ,status :  $("#addCartStatusInput").val() ,user_id :  $("#addCartUserIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addCartForm input, #addCartForm textarea").val('')
				        $("#addCartModal").modal('hide');
				        swal({
				          title: "Cart Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCarts();
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
			
				$("#addCartForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addCart();
				})
				function addCartModal(){
				  $("#addCartModal").modal('show');					
				}
			
				function updateCart()  {
				  $.ajax({
				    url: "/client/updatecart",
				    method: "POST",
				    data: {
				    	product_id : $("#editCartProductIdInput").val(),quantity : $("#editCartQuantityInput").val(),status : $("#editCartStatusInput").val(),user_id : $("#editCartUserIdInput").val(),id : $("#editCartCartId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editCartForm input, #editCartForm textarea").val('')
				        $("#editCartModal").modal('hide');
				        swal({
				          title: "Cart Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCarts();
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
			
				function editCartModal(product_id,quantity,status,user_id,id) {
				  $("#editCartModal").modal('show');
				  $("#editCartCartId").val(id);
				  $("#editCartProductIdInput").val(product_id);$("#editCartQuantityInput").val(quantity);$("#editCartStatusInput").val(status);$("#editCartUserIdInput").val(user_id);
				}
				$("#editCartForm").on('submit',(ev) => {
					ev.preventDefault();
					updateCart();
				})

			
				function deleteCart(id) {
				  $.ajax({
				    url: "/client/deletecart",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Cart Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCarts();
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
			

				async function deleteCartModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteCart(id);
				  }
				}
			
				function bulkDeleteCart(ids) {
				  $.ajax({
				    url: "/client/bulkdeletecart",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Carts Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCarts();
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
			

				async function bulkDeleteCartModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteCart(ids);
				  }
				};

			
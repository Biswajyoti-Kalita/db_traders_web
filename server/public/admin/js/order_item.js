

			$(document).ready(function(){
				getOrder_items();
			});

			var Order_itemTableOffset = 0;
			var Order_itemTableLimit = 10;
			var Order_itemTableOrderField = 'id';
			var Order_itemTableOrderFieldBy = 'DESC';

			function updateOrder_itemsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Order_itemTableOrderField+"Sort"+Order_itemTableOrderFieldBy).removeClass("fade-l");
			}

			function getOrder_items(searchObj) {
				
				updateOrder_itemsTableHeaderSort();


				  	const data = {
				    	offset: Order_itemTableOffset,
				    	limit : Order_itemTableLimit,
				    	order: Order_itemTableOrderField,
				    	order_by: Order_itemTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getorder_items",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#order_itemTableBody").html('');

				       $("#addOrder_item").html("");  
				       $("#editOrder_item").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#order_itemTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order_item')" type="checkbox" class=" checkbox-Order_item "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].product_id ? result[i].product_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_id ? result[i].order_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].quantity ? result[i].quantity : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].cost_price ? result[i].cost_price : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].selling_price ? result[i].selling_price : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].tax ? result[i].tax : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].cgst ? result[i].cgst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].sgst ? result[i].sgst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].igst ? result[i].igst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].discount ? result[i].discount : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].coupon_id ? result[i].coupon_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editOrder_itemModal(  '${result[i].product_id}', '${result[i].user_id}', '${result[i].order_id}', '${result[i].quantity}', '${result[i].cost_price}', '${result[i].selling_price}', '${result[i].tax}', '${result[i].cgst}', '${result[i].sgst}', '${result[i].igst}', '${result[i].discount}', '${result[i].coupon_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteOrder_itemModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeOrder_itemsTableOffset,Order_itemTableLimit,Order_itemTableOffset,'Order_item')
				    },
				  });
				}


				function changeOrder_itemsTableOffset(num) {
					Order_itemTableOffset  = num;
					getOrder_items();
				}
				function changeOrder_itemsTableLimit(num) {
					Order_itemTableLimit  = num;
					getOrder_items();
				}
				function changeOrder_itemsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Order_itemTableOrderField  = order_field;
					Order_itemTableOrderFieldBy  = order_field_by;
					getOrder_items();
				}


		
				var tempForm = "";
				$("#searchOrder_itemForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchOrder_itemForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getOrder_items(searchObj);
				})
			
				function addOrder_item() {
				  $.ajax({
				    url: "/admin/addorder_item",
				    method: "POST",
				    data: {
				    	product_id :  $("#addOrderItemProductIdInput").val() ,user_id :  $("#addOrderItemUserIdInput").val() ,order_id :  $("#addOrderItemOrderIdInput").val() ,quantity :  $("#addOrderItemQuantityInput").val() ,cost_price :  $("#addOrderItemCostPriceInput").val() ,selling_price :  $("#addOrderItemSellingPriceInput").val() ,tax :  $("#addOrderItemTaxInput").val() ,cgst :  $("#addOrderItemCgstInput").val() ,sgst :  $("#addOrderItemSgstInput").val() ,igst :  $("#addOrderItemIgstInput").val() ,discount :  $("#addOrderItemDiscountInput").val() ,coupon_id :  $("#addOrderItemCouponIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addOrder_itemForm input, #addOrder_itemForm textarea").val('')
				        $("#addOrder_itemModal").modal('hide');
				        swal({
				          title: "Order_item Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_items();
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
			
				$("#addOrder_itemForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addOrder_item();
				})
				function addOrder_itemModal(){
				  $("#addOrder_itemModal").modal('show');					
				}
			
				function updateOrder_item()  {
				  $.ajax({
				    url: "/admin/updateorder_item",
				    method: "POST",
				    data: {
				    	product_id : $("#editOrderItemProductIdInput").val(),user_id : $("#editOrderItemUserIdInput").val(),order_id : $("#editOrderItemOrderIdInput").val(),quantity : $("#editOrderItemQuantityInput").val(),cost_price : $("#editOrderItemCostPriceInput").val(),selling_price : $("#editOrderItemSellingPriceInput").val(),tax : $("#editOrderItemTaxInput").val(),cgst : $("#editOrderItemCgstInput").val(),sgst : $("#editOrderItemSgstInput").val(),igst : $("#editOrderItemIgstInput").val(),discount : $("#editOrderItemDiscountInput").val(),coupon_id : $("#editOrderItemCouponIdInput").val(),id : $("#editOrderItemOrder_itemId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editOrder_itemForm input, #editOrder_itemForm textarea").val('')
				        $("#editOrder_itemModal").modal('hide');
				        swal({
				          title: "Order_item Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_items();
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
			
				function editOrder_itemModal(product_id,user_id,order_id,quantity,cost_price,selling_price,tax,cgst,sgst,igst,discount,coupon_id,id) {
				  $("#editOrder_itemModal").modal('show');
				  $("#editOrderItemOrder_itemId").val(id);
				  $("#editOrderItemProductIdInput").val(product_id);$("#editOrderItemUserIdInput").val(user_id);$("#editOrderItemOrderIdInput").val(order_id);$("#editOrderItemQuantityInput").val(quantity);$("#editOrderItemCostPriceInput").val(cost_price);$("#editOrderItemSellingPriceInput").val(selling_price);$("#editOrderItemTaxInput").val(tax);$("#editOrderItemCgstInput").val(cgst);$("#editOrderItemSgstInput").val(sgst);$("#editOrderItemIgstInput").val(igst);$("#editOrderItemDiscountInput").val(discount);$("#editOrderItemCouponIdInput").val(coupon_id);
				}
				$("#editOrder_itemForm").on('submit',(ev) => {
					ev.preventDefault();
					updateOrder_item();
				})

			
				function deleteOrder_item(id) {
				  $.ajax({
				    url: "/admin/deleteorder_item",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order_item Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_items();
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
			

				async function deleteOrder_itemModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteOrder_item(id);
				  }
				}
			
				function bulkDeleteOrder_item(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteorder_item",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order_items Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrder_items();
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
			

				async function bulkDeleteOrder_itemModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteOrder_item(ids);
				  }
				};

			


			$(document).ready(function(){
				getOrders();
			});

			var OrderTableOffset = 0;
			var OrderTableLimit = 10;
			var OrderTableOrderField = 'id';
			var OrderTableOrderFieldBy = 'DESC';

			function updateOrdersTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+OrderTableOrderField+"Sort"+OrderTableOrderFieldBy).removeClass("fade-l");
			}

			function getOrders(searchObj) {
				
				updateOrdersTableHeaderSort();


				  	const data = {
				    	offset: OrderTableOffset,
				    	limit : OrderTableLimit,
				    	order: OrderTableOrderField,
				    	order_by: OrderTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/client/getorders",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#orderTableBody").html('');

				       $("#addOrder").html("");  
				       $("#editOrder").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#orderTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Order')" type="checkbox" class=" checkbox-Order "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].bill_no ? result[i].bill_no : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].delivery_status ? result[i].delivery_status : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].payment_status ? result[i].payment_status : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_items ? result[i].order_items : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].address_id ? result[i].address_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_status ? result[i].order_status : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].payment_method ? result[i].payment_method : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].coupon_id ? result[i].coupon_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].total_price ? result[i].total_price : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editOrderModal(  '${result[i].bill_no}', '${result[i].delivery_status}', '${result[i].payment_status}', '${result[i].order_items}', '${result[i].user_id}', '${result[i].address_id}', '${result[i].order_status}', '${result[i].payment_method}', '${result[i].coupon_id}', '${result[i].total_price}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteOrderModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeOrdersTableOffset,OrderTableLimit,OrderTableOffset,'Order')
				    },
				  });
				}


				function changeOrdersTableOffset(num) {
					OrderTableOffset  = num;
					getOrders();
				}
				function changeOrdersTableLimit(num) {
					OrderTableLimit  = num;
					getOrders();
				}
				function changeOrdersTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					OrderTableOrderField  = order_field;
					OrderTableOrderFieldBy  = order_field_by;
					getOrders();
				}


		
				var tempForm = "";
				$("#searchOrderForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchOrderForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getOrders(searchObj);
				})
			
				function addOrder() {
				  $.ajax({
				    url: "/client/addorder",
				    method: "POST",
				    data: {
				    	bill_no :  $("#addOrderBillNoInput").val() ,delivery_status :  $("#addOrderDeliveryStatusInput").val() ,payment_status :  $("#addOrderPaymentStatusInput").val() ,order_items :  $("#addOrderOrderItemsInput").val() ,user_id :  $("#addOrderUserIdInput").val() ,address_id :  $("#addOrderAddressIdInput").val() ,order_status :  $("#addOrderOrderStatusInput").val() ,payment_method :  $("#addOrderPaymentMethodInput").val() ,coupon_id :  $("#addOrderCouponIdInput").val() ,total_price :  $("#addOrderTotalPriceInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addOrderForm input, #addOrderForm textarea").val('')
				        $("#addOrderModal").modal('hide');
				        swal({
				          title: "Order Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			
				$("#addOrderForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addOrder();
				})
				function addOrderModal(){
				  $("#addOrderModal").modal('show');					
				}
			
				function updateOrder()  {
				  $.ajax({
				    url: "/client/updateorder",
				    method: "POST",
				    data: {
				    	bill_no : $("#editOrderBillNoInput").val(),delivery_status : $("#editOrderDeliveryStatusInput").val(),payment_status : $("#editOrderPaymentStatusInput").val(),order_items : $("#editOrderOrderItemsInput").val(),user_id : $("#editOrderUserIdInput").val(),address_id : $("#editOrderAddressIdInput").val(),order_status : $("#editOrderOrderStatusInput").val(),payment_method : $("#editOrderPaymentMethodInput").val(),coupon_id : $("#editOrderCouponIdInput").val(),total_price : $("#editOrderTotalPriceInput").val(),id : $("#editOrderOrderId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editOrderForm input, #editOrderForm textarea").val('')
				        $("#editOrderModal").modal('hide');
				        swal({
				          title: "Order Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			
				function editOrderModal(bill_no,delivery_status,payment_status,order_items,user_id,address_id,order_status,payment_method,coupon_id,total_price,id) {
				  $("#editOrderModal").modal('show');
				  $("#editOrderOrderId").val(id);
				  $("#editOrderBillNoInput").val(bill_no);$("#editOrderDeliveryStatusInput").val(delivery_status);$("#editOrderPaymentStatusInput").val(payment_status);$("#editOrderOrderItemsInput").val(order_items);$("#editOrderUserIdInput").val(user_id);$("#editOrderAddressIdInput").val(address_id);$("#editOrderOrderStatusInput").val(order_status);$("#editOrderPaymentMethodInput").val(payment_method);$("#editOrderCouponIdInput").val(coupon_id);$("#editOrderTotalPriceInput").val(total_price);
				}
				$("#editOrderForm").on('submit',(ev) => {
					ev.preventDefault();
					updateOrder();
				})

			
				function deleteOrder(id) {
				  $.ajax({
				    url: "/client/deleteorder",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Order Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			

				async function deleteOrderModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteOrder(id);
				  }
				}
			
				function bulkDeleteOrder(ids) {
				  $.ajax({
				    url: "/client/bulkdeleteorder",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Orders Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getOrders();
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
			

				async function bulkDeleteOrderModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteOrder(ids);
				  }
				};

			
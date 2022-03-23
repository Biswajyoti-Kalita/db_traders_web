

			$(document).ready(function(){
				getPayments();
			});

			var PaymentTableOffset = 0;
			var PaymentTableLimit = 10;
			var PaymentTableOrderField = 'id';
			var PaymentTableOrderFieldBy = 'DESC';

			function updatePaymentsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+PaymentTableOrderField+"Sort"+PaymentTableOrderFieldBy).removeClass("fade-l");
			}

			function getPayments(searchObj) {
				
				updatePaymentsTableHeaderSort();


				  	const data = {
				    	offset: PaymentTableOffset,
				    	limit : PaymentTableLimit,
				    	order: PaymentTableOrderField,
				    	order_by: PaymentTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/others/getpayments",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#paymentTableBody").html('');

				       $("#addPayment").html("");  
				       $("#editPayment").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#paymentTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Payment')" type="checkbox" class=" checkbox-Payment "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].order_id ? result[i].order_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].payment_id ? result[i].payment_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].oid ? result[i].oid : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].payment_status ? result[i].payment_status : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPaymentModal(  '${result[i].order_id}', '${result[i].payment_id}', '${result[i].oid}', '${result[i].payment_status}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePaymentModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePaymentsTableOffset,PaymentTableLimit,PaymentTableOffset,'Payment')
				    },
				  });
				}


				function changePaymentsTableOffset(num) {
					PaymentTableOffset  = num;
					getPayments();
				}
				function changePaymentsTableLimit(num) {
					PaymentTableLimit  = num;
					getPayments();
				}
				function changePaymentsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					PaymentTableOrderField  = order_field;
					PaymentTableOrderFieldBy  = order_field_by;
					getPayments();
				}


		
				var tempForm = "";
				$("#searchPaymentForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPaymentForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPayments(searchObj);
				})
			
				function addPayment() {
				  $.ajax({
				    url: "/others/addpayment",
				    method: "POST",
				    data: {
				    	order_id :  $("#addPaymentOrderIdInput").val() ,payment_id :  $("#addPaymentPaymentIdInput").val() ,oid :  $("#addPaymentOidInput").val() ,payment_status :  $("#addPaymentPaymentStatusInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPaymentForm input, #addPaymentForm textarea").val('')
				        $("#addPaymentModal").modal('hide');
				        swal({
				          title: "Payment Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPayments();
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
			
				$("#addPaymentForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPayment();
				})
				function addPaymentModal(){
				  $("#addPaymentModal").modal('show');					
				}
			
				function updatePayment()  {
				  $.ajax({
				    url: "/others/updatepayment",
				    method: "POST",
				    data: {
				    	order_id : $("#editPaymentOrderIdInput").val(),payment_id : $("#editPaymentPaymentIdInput").val(),oid : $("#editPaymentOidInput").val(),payment_status : $("#editPaymentPaymentStatusInput").val(),id : $("#editPaymentPaymentId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPaymentForm input, #editPaymentForm textarea").val('')
				        $("#editPaymentModal").modal('hide');
				        swal({
				          title: "Payment Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPayments();
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
			
				function editPaymentModal(order_id,payment_id,oid,payment_status,id) {
				  $("#editPaymentModal").modal('show');
				  $("#editPaymentPaymentId").val(id);
				  $("#editPaymentOrderIdInput").val(order_id);$("#editPaymentPaymentIdInput").val(payment_id);$("#editPaymentOidInput").val(oid);$("#editPaymentPaymentStatusInput").val(payment_status);
				}
				$("#editPaymentForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePayment();
				})

			
				function deletePayment(id) {
				  $.ajax({
				    url: "/others/deletepayment",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Payment Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPayments();
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
			

				async function deletePaymentModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePayment(id);
				  }
				}
			
				function bulkDeletePayment(ids) {
				  $.ajax({
				    url: "/others/bulkdeletepayment",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Payments Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPayments();
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
			

				async function bulkDeletePaymentModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePayment(ids);
				  }
				};

			
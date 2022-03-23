

			$(document).ready(function(){
				getCoupons();
			});

			var CouponTableOffset = 0;
			var CouponTableLimit = 10;
			var CouponTableOrderField = 'id';
			var CouponTableOrderFieldBy = 'DESC';

			function updateCouponsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+CouponTableOrderField+"Sort"+CouponTableOrderFieldBy).removeClass("fade-l");
			}

			function getCoupons(searchObj) {
				
				updateCouponsTableHeaderSort();


				  	const data = {
				    	offset: CouponTableOffset,
				    	limit : CouponTableLimit,
				    	order: CouponTableOrderField,
				    	order_by: CouponTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getcoupons",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#couponTableBody").html('');

				       $("#addCoupon").html("");  
				       $("#editCoupon").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#couponTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Coupon')" type="checkbox" class=" checkbox-Coupon "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].code ? result[i].code : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].valid_till ? result[i].valid_till : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].discount_amount ? result[i].discount_amount : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editCouponModal(  '${result[i].code}', '${result[i].valid_till}', '${result[i].discount_amount}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteCouponModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeCouponsTableOffset,CouponTableLimit,CouponTableOffset,'Coupon')
				    },
				  });
				}


				function changeCouponsTableOffset(num) {
					CouponTableOffset  = num;
					getCoupons();
				}
				function changeCouponsTableLimit(num) {
					CouponTableLimit  = num;
					getCoupons();
				}
				function changeCouponsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					CouponTableOrderField  = order_field;
					CouponTableOrderFieldBy  = order_field_by;
					getCoupons();
				}


		
				var tempForm = "";
				$("#searchCouponForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchCouponForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getCoupons(searchObj);
				})
			
				function addCoupon() {
				  $.ajax({
				    url: "/admin/addcoupon",
				    method: "POST",
				    data: {
				    	code :  $("#addCouponCodeInput").val() ,valid_till :  $("#addCouponValidTillInput").val() ,discount_amount :  $("#addCouponDiscountAmountInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addCouponForm input, #addCouponForm textarea").val('')
				        $("#addCouponModal").modal('hide');
				        swal({
				          title: "Coupon Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCoupons();
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
			
				$("#addCouponForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addCoupon();
				})
				function addCouponModal(){
				  $("#addCouponModal").modal('show');					
				}
			
				function updateCoupon()  {
				  $.ajax({
				    url: "/admin/updatecoupon",
				    method: "POST",
				    data: {
				    	code : $("#editCouponCodeInput").val(),valid_till : $("#editCouponValidTillInput").val(),discount_amount : $("#editCouponDiscountAmountInput").val(),id : $("#editCouponCouponId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editCouponForm input, #editCouponForm textarea").val('')
				        $("#editCouponModal").modal('hide');
				        swal({
				          title: "Coupon Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCoupons();
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
			
				function editCouponModal(code,valid_till,discount_amount,id) {
				  $("#editCouponModal").modal('show');
				  $("#editCouponCouponId").val(id);
				  $("#editCouponCodeInput").val(code);$("#editCouponValidTillInput").val(valid_till);$("#editCouponDiscountAmountInput").val(discount_amount);
				}
				$("#editCouponForm").on('submit',(ev) => {
					ev.preventDefault();
					updateCoupon();
				})

			
				function deleteCoupon(id) {
				  $.ajax({
				    url: "/admin/deletecoupon",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Coupon Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCoupons();
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
			

				async function deleteCouponModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteCoupon(id);
				  }
				}
			
				function bulkDeleteCoupon(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletecoupon",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Coupons Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getCoupons();
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
			

				async function bulkDeleteCouponModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteCoupon(ids);
				  }
				};

			
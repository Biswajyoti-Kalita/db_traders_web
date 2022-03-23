

			$(document).ready(function(){
				getAddresss();
			});

			var AddressTableOffset = 0;
			var AddressTableLimit = 10;
			var AddressTableOrderField = 'id';
			var AddressTableOrderFieldBy = 'DESC';

			function updateAddresssTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+AddressTableOrderField+"Sort"+AddressTableOrderFieldBy).removeClass("fade-l");
			}

			function getAddresss(searchObj) {
				
				updateAddresssTableHeaderSort();


				  	const data = {
				    	offset: AddressTableOffset,
				    	limit : AddressTableLimit,
				    	order: AddressTableOrderField,
				    	order_by: AddressTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/others/getaddresses",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#addressTableBody").html('');

				       $("#addAddress").html("");  
				       $("#editAddress").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#addressTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Address')" type="checkbox" class=" checkbox-Address "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].landmark ? result[i].landmark : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].address_line_1 ? result[i].address_line_1 : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].address_line_2 ? result[i].address_line_2 : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].pincode ? result[i].pincode : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].tag ? result[i].tag : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editAddressModal(  '${result[i].landmark}', '${result[i].address_line_1}', '${result[i].address_line_2}', '${result[i].city}', '${result[i].state}', '${result[i].pincode}', '${result[i].user_id}', '${result[i].tag}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteAddressModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeAddresssTableOffset,AddressTableLimit,AddressTableOffset,'Address')
				    },
				  });
				}


				function changeAddresssTableOffset(num) {
					AddressTableOffset  = num;
					getAddresss();
				}
				function changeAddresssTableLimit(num) {
					AddressTableLimit  = num;
					getAddresss();
				}
				function changeAddresssTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					AddressTableOrderField  = order_field;
					AddressTableOrderFieldBy  = order_field_by;
					getAddresss();
				}


		
				var tempForm = "";
				$("#searchAddressForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchAddressForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getAddresss(searchObj);
				})
			
				function addAddress() {
				  $.ajax({
				    url: "/others/addaddress",
				    method: "POST",
				    data: {
				    	landmark :  $("#addAddressLandmarkInput").val() ,address_line_1 :  $("#addAddressAddressLine1Input").val() ,address_line_2 :  $("#addAddressAddressLine2Input").val() ,city :  $("#addAddressCityInput").val() ,state :  $("#addAddressStateInput").val() ,pincode :  $("#addAddressPincodeInput").val() ,user_id :  $("#addAddressUserIdInput").val() ,tag :  $("#addAddressTagInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addAddressForm input, #addAddressForm textarea").val('')
				        $("#addAddressModal").modal('hide');
				        swal({
				          title: "Address Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAddresss();
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
			
				$("#addAddressForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addAddress();
				})
				function addAddressModal(){
				  $("#addAddressModal").modal('show');					
				}
			
				function updateAddress()  {
				  $.ajax({
				    url: "/others/updateaddress",
				    method: "POST",
				    data: {
				    	landmark : $("#editAddressLandmarkInput").val(),address_line_1 : $("#editAddressAddressLine1Input").val(),address_line_2 : $("#editAddressAddressLine2Input").val(),city : $("#editAddressCityInput").val(),state : $("#editAddressStateInput").val(),pincode : $("#editAddressPincodeInput").val(),user_id : $("#editAddressUserIdInput").val(),tag : $("#editAddressTagInput").val(),id : $("#editAddressAddressId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editAddressForm input, #editAddressForm textarea").val('')
				        $("#editAddressModal").modal('hide');
				        swal({
				          title: "Address Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAddresss();
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
			
				function editAddressModal(landmark,address_line_1,address_line_2,city,state,pincode,user_id,tag,id) {
				  $("#editAddressModal").modal('show');
				  $("#editAddressAddressId").val(id);
				  $("#editAddressLandmarkInput").val(landmark);$("#editAddressAddressLine1Input").val(address_line_1);$("#editAddressAddressLine2Input").val(address_line_2);$("#editAddressCityInput").val(city);$("#editAddressStateInput").val(state);$("#editAddressPincodeInput").val(pincode);$("#editAddressUserIdInput").val(user_id);$("#editAddressTagInput").val(tag);
				}
				$("#editAddressForm").on('submit',(ev) => {
					ev.preventDefault();
					updateAddress();
				})

			
				function deleteAddress(id) {
				  $.ajax({
				    url: "/others/deleteaddress",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Address Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAddresss();
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
			

				async function deleteAddressModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteAddress(id);
				  }
				}
			
				function bulkDeleteAddress(ids) {
				  $.ajax({
				    url: "/others/bulkdeleteaddress",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Addresses Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAddresss();
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
			

				async function bulkDeleteAddressModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteAddress(ids);
				  }
				};

			
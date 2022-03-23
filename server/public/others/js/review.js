

			$(document).ready(function(){
				getReviews();
			});

			var ReviewTableOffset = 0;
			var ReviewTableLimit = 10;
			var ReviewTableOrderField = 'id';
			var ReviewTableOrderFieldBy = 'DESC';

			function updateReviewsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+ReviewTableOrderField+"Sort"+ReviewTableOrderFieldBy).removeClass("fade-l");
			}

			function getReviews(searchObj) {
				
				updateReviewsTableHeaderSort();


				  	const data = {
				    	offset: ReviewTableOffset,
				    	limit : ReviewTableLimit,
				    	order: ReviewTableOrderField,
				    	order_by: ReviewTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/others/getreviews",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#reviewTableBody").html('');

				       $("#addReview").html("");  
				       $("#editReview").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#reviewTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Review')" type="checkbox" class=" checkbox-Review "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].rating ? result[i].rating : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].comments ? result[i].comments : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].product_id ? result[i].product_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editReviewModal(  '${result[i].rating}', '${result[i].comments}', '${result[i].user_id}', '${result[i].product_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteReviewModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeReviewsTableOffset,ReviewTableLimit,ReviewTableOffset,'Review')
				    },
				  });
				}


				function changeReviewsTableOffset(num) {
					ReviewTableOffset  = num;
					getReviews();
				}
				function changeReviewsTableLimit(num) {
					ReviewTableLimit  = num;
					getReviews();
				}
				function changeReviewsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					ReviewTableOrderField  = order_field;
					ReviewTableOrderFieldBy  = order_field_by;
					getReviews();
				}


		
				var tempForm = "";
				$("#searchReviewForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchReviewForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getReviews(searchObj);
				})
			
				function addReview() {
				  $.ajax({
				    url: "/others/addreview",
				    method: "POST",
				    data: {
				    	rating :  $("#addReviewRatingInput").val() ,comments :  $("#addReviewCommentsInput").val() ,user_id :  $("#addReviewUserIdInput").val() ,product_id :  $("#addReviewProductIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addReviewForm input, #addReviewForm textarea").val('')
				        $("#addReviewModal").modal('hide');
				        swal({
				          title: "Review Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getReviews();
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
			
				$("#addReviewForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addReview();
				})
				function addReviewModal(){
				  $("#addReviewModal").modal('show');					
				}
			
				function updateReview()  {
				  $.ajax({
				    url: "/others/updatereview",
				    method: "POST",
				    data: {
				    	rating : $("#editReviewRatingInput").val(),comments : $("#editReviewCommentsInput").val(),user_id : $("#editReviewUserIdInput").val(),product_id : $("#editReviewProductIdInput").val(),id : $("#editReviewReviewId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editReviewForm input, #editReviewForm textarea").val('')
				        $("#editReviewModal").modal('hide');
				        swal({
				          title: "Review Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getReviews();
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
			
				function editReviewModal(rating,comments,user_id,product_id,id) {
				  $("#editReviewModal").modal('show');
				  $("#editReviewReviewId").val(id);
				  $("#editReviewRatingInput").val(rating);$("#editReviewCommentsInput").val(comments);$("#editReviewUserIdInput").val(user_id);$("#editReviewProductIdInput").val(product_id);
				}
				$("#editReviewForm").on('submit',(ev) => {
					ev.preventDefault();
					updateReview();
				})

			
				function deleteReview(id) {
				  $.ajax({
				    url: "/others/deletereview",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Review Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getReviews();
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
			

				async function deleteReviewModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteReview(id);
				  }
				}
			
				function bulkDeleteReview(ids) {
				  $.ajax({
				    url: "/others/bulkdeletereview",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Reviews Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getReviews();
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
			

				async function bulkDeleteReviewModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteReview(ids);
				  }
				};

			
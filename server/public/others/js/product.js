

			$(document).ready(function(){
				getProducts();
			});

			var ProductTableOffset = 0;
			var ProductTableLimit = 10;
			var ProductTableOrderField = 'id';
			var ProductTableOrderFieldBy = 'DESC';

			function updateProductsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+ProductTableOrderField+"Sort"+ProductTableOrderFieldBy).removeClass("fade-l");
			}

			function getProducts(searchObj) {
				
				updateProductsTableHeaderSort();


				  	const data = {
				    	offset: ProductTableOffset,
				    	limit : ProductTableLimit,
				    	order: ProductTableOrderField,
				    	order_by: ProductTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/others/getproducts",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#productTableBody").html('');

				       $("#addProduct").html("");  
				       $("#editProduct").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#productTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Product')" type="checkbox" class=" checkbox-Product "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].uuid ? result[i].uuid : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].barcode ? result[i].barcode : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].category_id ? result[i].category_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].sub_category_id ? result[i].sub_category_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].tags ? result[i].tags : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].brand_id ? result[i].brand_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].colors ? result[i].colors : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].cost_price ? result[i].cost_price : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].selling_price ? result[i].selling_price : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].tax ? result[i].tax : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].cgst ? result[i].cgst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].sgst ? result[i].sgst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].igst ? result[i].igst : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].discount ? result[i].discount : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].description ? result[i].description : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].images ? result[i].images : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editProductModal(  '${result[i].uuid}', '${result[i].barcode}', '${result[i].name}', '${result[i].category_id}', '${result[i].sub_category_id}', '${result[i].tags}', '${result[i].brand_id}', '${result[i].colors}', '${result[i].cost_price}', '${result[i].selling_price}', '${result[i].tax}', '${result[i].cgst}', '${result[i].sgst}', '${result[i].igst}', '${result[i].discount}', '${result[i].description}', '${result[i].images}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteProductModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeProductsTableOffset,ProductTableLimit,ProductTableOffset,'Product')
				    },
				  });
				}


				function changeProductsTableOffset(num) {
					ProductTableOffset  = num;
					getProducts();
				}
				function changeProductsTableLimit(num) {
					ProductTableLimit  = num;
					getProducts();
				}
				function changeProductsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					ProductTableOrderField  = order_field;
					ProductTableOrderFieldBy  = order_field_by;
					getProducts();
				}


		
				var tempForm = "";
				$("#searchProductForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchProductForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getProducts(searchObj);
				})
			
				function addProduct() {
				  $.ajax({
				    url: "/others/addproduct",
				    method: "POST",
				    data: {
				    	uuid :  $("#addProductUuidInput").val() ,barcode :  $("#addProductBarcodeInput").val() ,name :  $("#addProductNameInput").val() ,category_id :  $("#addProductCategoryIdInput").val() ,sub_category_id :  $("#addProductSubCategoryIdInput").val() ,tags :  $("#addProductTagsInput").val() ,brand_id :  $("#addProductBrandIdInput").val() ,colors :  $("#addProductColorsInput").val() ,cost_price :  $("#addProductCostPriceInput").val() ,selling_price :  $("#addProductSellingPriceInput").val() ,tax :  $("#addProductTaxInput").val() ,cgst :  $("#addProductCgstInput").val() ,sgst :  $("#addProductSgstInput").val() ,igst :  $("#addProductIgstInput").val() ,discount :  $("#addProductDiscountInput").val() ,description :  $("#addProductDescriptionInput").val() ,images :  $("#addProductImagesInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addProductForm input, #addProductForm textarea").val('')
				        $("#addProductModal").modal('hide');
				        swal({
				          title: "Product Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getProducts();
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
			
				$("#addProductForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addProduct();
				})
				function addProductModal(){
				  $("#addProductModal").modal('show');					
				}
			
				function updateProduct()  {
				  $.ajax({
				    url: "/others/updateproduct",
				    method: "POST",
				    data: {
				    	uuid : $("#editProductUuidInput").val(),barcode : $("#editProductBarcodeInput").val(),name : $("#editProductNameInput").val(),category_id : $("#editProductCategoryIdInput").val(),sub_category_id : $("#editProductSubCategoryIdInput").val(),tags : $("#editProductTagsInput").val(),brand_id : $("#editProductBrandIdInput").val(),colors : $("#editProductColorsInput").val(),cost_price : $("#editProductCostPriceInput").val(),selling_price : $("#editProductSellingPriceInput").val(),tax : $("#editProductTaxInput").val(),cgst : $("#editProductCgstInput").val(),sgst : $("#editProductSgstInput").val(),igst : $("#editProductIgstInput").val(),discount : $("#editProductDiscountInput").val(),description : $("#editProductDescriptionInput").val(),images : $("#editProductImagesInput").val(),id : $("#editProductProductId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editProductForm input, #editProductForm textarea").val('')
				        $("#editProductModal").modal('hide');
				        swal({
				          title: "Product Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getProducts();
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
			
				function editProductModal(uuid,barcode,name,category_id,sub_category_id,tags,brand_id,colors,cost_price,selling_price,tax,cgst,sgst,igst,discount,description,images,id) {
				  $("#editProductModal").modal('show');
				  $("#editProductProductId").val(id);
				  $("#editProductUuidInput").val(uuid);$("#editProductBarcodeInput").val(barcode);$("#editProductNameInput").val(name);$("#editProductCategoryIdInput").val(category_id);$("#editProductSubCategoryIdInput").val(sub_category_id);$("#editProductTagsInput").val(tags);$("#editProductBrandIdInput").val(brand_id);$("#editProductColorsInput").val(colors);$("#editProductCostPriceInput").val(cost_price);$("#editProductSellingPriceInput").val(selling_price);$("#editProductTaxInput").val(tax);$("#editProductCgstInput").val(cgst);$("#editProductSgstInput").val(sgst);$("#editProductIgstInput").val(igst);$("#editProductDiscountInput").val(discount);$("#editProductDescriptionInput").val(description);$("#editProductImagesInput").val(images);
				}
				$("#editProductForm").on('submit',(ev) => {
					ev.preventDefault();
					updateProduct();
				})

			
				function deleteProduct(id) {
				  $.ajax({
				    url: "/others/deleteproduct",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Product Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getProducts();
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
			

				async function deleteProductModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteProduct(id);
				  }
				}
			
				function bulkDeleteProduct(ids) {
				  $.ajax({
				    url: "/others/bulkdeleteproduct",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Products Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getProducts();
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
			

				async function bulkDeleteProductModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteProduct(ids);
				  }
				};

			
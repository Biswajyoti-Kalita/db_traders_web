$(document).ready(function () {
  getCategories();
  getBrands();
});
const categories = {};
const categoriesArr = [];
const brands = {};

function getBrands() {
  $.ajax({
    url: "/admin/getbrands",
    method: "POST",
    data: {
      token: Cookies.get("token"),
    },
    success: function (resultData) {
      var result = resultData.rows;
      $("#addProductBrandIdInput, #editProductBrandIdInput").html(
        `<option value="">SELECT</option>`
      );

      for (var i = 0; i < result.length; i++) {
        brands[result[i].name] = {};
        $("#addProductBrandIdInput , #editProductBrandIdInput").append(
          `<option value="${result[i].id}">${result[i].name}</option>`
        );
      }
    },
  });
}
function getCategories() {
  $.ajax({
    url: "/admin/getcategories",
    method: "POST",
    data: {
      token: Cookies.get("token"),
    },
    success: function (resultData) {
      let result = resultData.rows;
      console.log("categories ", result);
      $("#addProductCategoryIdInput , #editProductCategoryIdInput").html(
        `<option value="">SELECT</option>`
      );
      for (var i = 0; i < result.length; i++) {
        categoriesArr[result[i].id] = result[i].name;
        if (result[i].parent === null || result[i].parent == -1) {
          if (!categories[result[i].name]) categories[result[i].name] = {};
          $("#addProductCategoryIdInput , #editProductCategoryIdInput").append(
            `<option value="${result[i].id}">${result[i].name}</option>`
          );
        } else {
          if (!categories[result[i].parent.name])
            categories[result[i].parent.name] = {};
          categories[result[i].parent.name][result[i].name] = {
            id: result[i].id,
          };
        }
      }
      getProducts();
    },
  });
}
function showSubCategory() {
  let cat = $("#addProductCategoryIdInput").val();
  if (cat) {
    $("#addProductSubCategoryIdInput").html(`<option value="">SELECT</option>`);
    console.log(categories[categoriesArr[cat]]);
    for (let item in categories[categoriesArr[cat]]) {
      console.log(categories[categoriesArr[cat]][item]);
      $("#addProductSubCategoryIdInput").append(
        `<option value="${
          categories[categoriesArr[cat]][item].id
        }">${item}</option>`
      );
    }
  }
}
function showSubCategoryForEdit() {
  let cat = $("#editProductCategoryIdInput").val();
  if (cat) {
    $("#editProductSubCategoryIdInput").html(
      `<option value="">SELECT</option>`
    );
    console.log(categories[categoriesArr[cat]]);
    for (let item in categories[categoriesArr[cat]]) {
      console.log(categories[categoriesArr[cat]][item]);
      $("#editProductSubCategoryIdInput").append(
        `<option value="${
          categories[categoriesArr[cat]][item].id
        }">${item}</option>`
      );
    }
  }
}
var ProductTableOffset = 0;
var ProductTableLimit = 10;
var ProductTableOrderField = "id";
var ProductTableOrderFieldBy = "DESC";

function updateProductsTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $(
    "#" + ProductTableOrderField + "Sort" + ProductTableOrderFieldBy
  ).removeClass("fade-l");
}

function getProducts(searchObj) {
  updateProductsTableHeaderSort();

  const data = {
    offset: ProductTableOffset,
    limit: ProductTableLimit,
    order: ProductTableOrderField,
    order_by: ProductTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/admin/getproducts",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#productTableBody").html("");

      $("#addProduct").html("");
      $("#editProduct").html("");

      for (var i = 0; i < result.length; i++) {
        let imagesLink = "#";
        if (result[i].images) {
          imagesLink = "";
          result[i].images.map((item) => (imagesLink += item.image_url + ","));
        }
        console.log(imagesLink);

        $("#productTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Product')" type="checkbox" class=" checkbox-Product "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${result[i] ? (result[i].uuid ? result[i].uuid : " ") : " "}</td>
					<td>${result[i] ? (result[i].barcode ? result[i].barcode : " ") : " "}</td>
					<td>${result[i] ? (result[i].name ? result[i].name : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].category
                ? result[i].category.name
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].sub_category
                ? result[i].sub_category.name
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].tags ? result[i].tags : " ") : " "}</td>
					<td>${result[i] ? (result[i].brand ? result[i].brand.name : " ") : " "}</td>
					<td>${result[i] ? (result[i].colors ? result[i].colors : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].cost_price
                ? result[i].cost_price
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].selling_price
                ? result[i].selling_price
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].tax ? result[i].tax : " ") : " "}</td>
					<td>${result[i] ? (result[i].cgst ? result[i].cgst : " ") : " "}</td>
					<td>${result[i] ? (result[i].sgst ? result[i].sgst : " ") : " "}</td>
					<td>${result[i] ? (result[i].igst ? result[i].igst : " ") : " "}</td>
					<td>${result[i] ? (result[i].discount ? result[i].discount : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].description
                ? result[i].description
                : " "
              : " "
          }</td>
					<td>${
            result[i]
              ? result[i].images
                ? "<span onclick=\"showProductImages( '" +
                  result[i].id +
                  "','" +
                  imagesLink +
                  "')\"   >images</span>"
                : " "
              : " "
          }</td>
          <td>${
            result.status != null
              ? ["In-stock", "Out of stock"][result.status]
              : ""
          }</td>
          <td><span class="btn btn-link btn-sm" onclick="editProductModal(  '${
            result[i].uuid
          }', '${result[i].barcode}', '${result[i].name}', '${
          result[i].category_id
        }', '${result[i].sub_category_id}', '${result[i].tags}', '${
          result[i].brand_id
        }', '${result[i].colors}', '${result[i].cost_price}', '${
          result[i].selling_price
        }', '${result[i].tax}', '${result[i].cgst}', '${result[i].sgst}', '${
          result[i].igst
        }', '${result[i].discount}', '${result[i].description}', '${
          result[i].status
        }', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteProductModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeProductsTableOffset,
        ProductTableLimit,
        ProductTableOffset,
        "Product"
      );
    },
  });
}
function showProductImages(product_id, imagesLink) {
  console.log("product id ", product_id);
  console.log(imagesLink);
  $("#imageModal").modal("show");
  $("#imageModalBody").html("");
  let items = imagesLink.split(",");
  let temp = "";
  items.map((item) => {
    if (item)
      temp += `
		<div class="col-md-4 text-center border m-1">
			<img src="${item}" />
			<span onclick="deleteProductImage( '${product_id}','${item}')" class="btn btn-sm btn-danger">remove</span>
		</div>
	`;
  });
  $("#imageModalBody").html(`<div class="row"> ${temp} </div>`);
}

function deleteProductImage(product_id, image_url) {}
function changeProductsTableOffset(num) {
  ProductTableOffset = num;
  getProducts();
}
function changeProductsTableLimit(num) {
  ProductTableLimit = num;
  getProducts();
}
function changeProductsTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  ProductTableOrderField = order_field;
  ProductTableOrderFieldBy = order_field_by;
  getProducts();
}

var tempForm = "";
$("#searchProductForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchProductForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getProducts(searchObj);
});

function addProduct() {
  let formData = new FormData();
  let files = $("#addProductImagesInput").get(0).files;
  if (files[0]) {
    for (let i = 0; i < files.length; i++) formData.append("image", files[i]);
  }

  formData.append("uuid", $("#addProductUuidInput").val());
  formData.append("barcode", $("#addProductBarcodeInput").val());
  formData.append("name", $("#addProductNameInput").val());
  formData.append("category_id", $("#addProductCategoryIdInput").val());
  formData.append("sub_category_id", $("#addProductSubCategoryIdInput").val());
  formData.append("tags", $("#addProductTagsInput").val());
  formData.append("brand_id", $("#addProductBrandIdInput").val());
  formData.append("colors", $("#addProductColorsInput").val());
  formData.append("cost_price", $("#addProductCostPriceInput").val());
  formData.append("selling_price", $("#addProductSellingPriceInput").val());
  formData.append("tax", $("#addProductTaxInput").val());
  formData.append("cgst", $("#addProductCgstInput").val());
  formData.append("sgst", $("#addProductSgstInput").val());
  formData.append("igst", $("#addProductIgstInput").val());
  formData.append("discount", $("#addProductDiscountInput").val());
  formData.append("description", $("#addProductDescriptionInput").val());
  formData.append("status", $("#addProductStatus").val());

  $.ajax({
    url: "/admin/addproduct",
    method: "POST",
    headers: {
      token: Cookies.get("token"),
    },
    processData: false,
    contentType: false,
    data: formData,
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#addProductForm input, #addProductForm textarea").val("");
        $("#addProductModal").modal("hide");
        swal({
          title: "Product Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getProducts();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

$("#addProductForm").on("submit", (ev) => {
  ev.preventDefault();
  addProduct();
});
function addProductModal() {
  $("#addProductModal").modal("show");
}

function updateProduct() {
  $.ajax({
    url: "/admin/updateproduct",
    method: "POST",
    data: {
      uuid: $("#editProductUuidInput").val(),
      barcode: $("#editProductBarcodeInput").val(),
      name: $("#editProductNameInput").val(),
      category_id: $("#editProductCategoryIdInput").val(),
      sub_category_id: $("#editProductSubCategoryIdInput").val(),
      tags: $("#editProductTagsInput").val(),
      brand_id: $("#editProductBrandIdInput").val(),
      colors: $("#editProductColorsInput").val(),
      cost_price: $("#editProductCostPriceInput").val(),
      selling_price: $("#editProductSellingPriceInput").val(),
      tax: $("#editProductTaxInput").val(),
      cgst: $("#editProductCgstInput").val(),
      sgst: $("#editProductSgstInput").val(),
      igst: $("#editProductIgstInput").val(),
      discount: $("#editProductDiscountInput").val(),
      description: $("#editProductDescriptionInput").val(),
      status: $("#editProductStatusInput").val(),
      id: $("#editProductProductId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#editProductForm input, #editProductForm textarea").val("");
        $("#editProductModal").modal("hide");
        swal({
          title: "Product Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getProducts();
      } else
        swal({
          title: "Unsuccessfully",
          text: result.message,
          icon: "error",
          button: "Okay",
        });
    },
  });
}

function editProductModal(
  uuid,
  barcode,
  name,
  category_id,
  sub_category_id,
  tags,
  brand_id,
  colors,
  cost_price,
  selling_price,
  tax,
  cgst,
  sgst,
  igst,
  discount,
  description,
  status,
  id
) {
  console.log("\n\n edit ", category_id, "  ", sub_category_id);
  $("#editProductModal").modal("show");
  $("#editProductProductId").val(id);
  $("#editProductUuidInput").val(uuid);
  $("#editProductBarcodeInput").val(barcode);
  $("#editProductNameInput").val(name);
  $("#editProductCategoryIdInput").val(category_id);
  $("#editProductSubCategoryIdInput").val(sub_category_id);
  $("#editProductTagsInput").val(tags);
  $("#editProductBrandIdInput").val(brand_id);
  $("#editProductColorsInput").val(colors);
  $("#editProductCostPriceInput").val(cost_price);
  $("#editProductSellingPriceInput").val(selling_price);
  $("#editProductTaxInput").val(tax);
  $("#editProductCgstInput").val(cgst);
  $("#editProductSgstInput").val(sgst);
  $("#editProductIgstInput").val(igst);
  $("#editProductDiscountInput").val(discount);
  $("#editProductDescriptionInput").val(description);
  $("#editProductStatusInput").val(status);
}
$("#editProductForm").on("submit", (ev) => {
  ev.preventDefault();
  updateProduct();
});

function deleteProduct(id) {
  $.ajax({
    url: "/admin/deleteproduct",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Product Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getProducts();
      } else
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
  if (res) {
    deleteProduct(id);
  }
}

function bulkDeleteProduct(ids) {
  $.ajax({
    url: "/admin/bulkdeleteproduct",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Products Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getProducts();
      } else
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
  if (res) {
    bulkDeleteProduct(ids);
  }
}

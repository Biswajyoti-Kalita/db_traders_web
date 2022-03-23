$(document).ready(function () {
  getBrands();
});

var BrandTableOffset = 0;
var BrandTableLimit = 10;
var BrandTableOrderField = "id";
var BrandTableOrderFieldBy = "DESC";

function updateBrandsTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $("#" + BrandTableOrderField + "Sort" + BrandTableOrderFieldBy).removeClass(
    "fade-l"
  );
}

function getBrands(searchObj) {
  updateBrandsTableHeaderSort();

  const data = {
    offset: BrandTableOffset,
    limit: BrandTableLimit,
    order: BrandTableOrderField,
    order_by: BrandTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/admin/getbrands",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#brandTableBody").html("");

      $("#addBrand").html("");
      $("#editBrand").html("");

      for (var i = 0; i < result.length; i++) {
        $("#brandTableBody").append(`
							<tr>
								<td> <input onclick="checkSelected('Brand')" type="checkbox" class=" checkbox-Brand "  data-id="${
                  result[i].id
                }" /> </td>
					  <td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					  <td>${result[i] ? (result[i].name ? result[i].name : " ") : " "}</td>
					  <td>${
              result[i]
                ? result[i].image
                  ? '<img src="' + result[i].image + '" class="brand-image" />'
                  : " "
                : " "
            }</td><td><span class="btn btn-link btn-sm" onclick="editBrandModal(  '${
          result[i].name
        }', '${result[i].image}', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteBrandModal(${
          result[i].id
        })">Delete</span></td>
							</tr>
						  `);
      }
      getPaginate(
        count,
        changeBrandsTableOffset,
        BrandTableLimit,
        BrandTableOffset,
        "Brand"
      );
    },
  });
}

function changeBrandsTableOffset(num) {
  BrandTableOffset = num;
  getBrands();
}
function changeBrandsTableLimit(num) {
  BrandTableLimit = num;
  getBrands();
}
function changeBrandsTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  BrandTableOrderField = order_field;
  BrandTableOrderFieldBy = order_field_by;
  getBrands();
}

var tempForm = "";
$("#searchBrandForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchBrandForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getBrands(searchObj);
});

function addBrand() {
  let formData = new FormData();
  if ($("#addBrandImageInput").get(0).files[0])
    formData.append("image", $("#addBrandImageInput").get(0).files[0]);
  console.log("image added");
  formData.append("name", $("#addBrandNameInput").val());
  console.log("brand name added");
  $.ajax({
    url: "/admin/addbrand",
    method: "POST",
    processData: false,
    contentType: false,
    headers: {
      token: Cookies.get("token"),
    },
    data: formData,
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#addBrandForm input, #addBrandForm textarea").val("");
        $("#addBrandModal").modal("hide");
        swal({
          title: "Brand Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getBrands();
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

$("#addBrandForm").on("submit", (ev) => {
  ev.preventDefault();
  addBrand();
});
function addBrandModal() {
  $("#addBrandModal").modal("show");
}

function updateBrand() {
  $.ajax({
    url: "/admin/updatebrand",
    method: "POST",
    data: {
      name: $("#editBrandNameInput").val(),
      image: $("#editBrandImageInput").val(),
      id: $("#editBrandBrandId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#editBrandForm input, #editBrandForm textarea").val("");
        $("#editBrandModal").modal("hide");
        swal({
          title: "Brand Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getBrands();
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

function editBrandModal(name, image, id) {
  $("#editBrandModal").modal("show");
  $("#editBrandBrandId").val(id);
  $("#editBrandNameInput").val(name);
  $("#editBrandImageInput").val(image);
}
$("#editBrandForm").on("submit", (ev) => {
  ev.preventDefault();
  updateBrand();
});

function deleteBrand(id) {
  $.ajax({
    url: "/admin/deletebrand",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Brand Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getBrands();
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

async function deleteBrandModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteBrand(id);
  }
}

function bulkDeleteBrand(ids) {
  $.ajax({
    url: "/admin/bulkdeletebrand",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Brands Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getBrands();
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

async function bulkDeleteBrandModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteBrand(ids);
  }
}

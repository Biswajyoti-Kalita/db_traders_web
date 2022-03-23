$(document).ready(function () {
  getImages();
});

var ImageTableOffset = 0;
var ImageTableLimit = 10;
var ImageTableOrderField = "id";
var ImageTableOrderFieldBy = "DESC";

function updateImagesTableHeaderSort() {
  $(".sort-icon").addClass("fade-l");
  $("#" + ImageTableOrderField + "Sort" + ImageTableOrderFieldBy).removeClass(
    "fade-l"
  );
}

function getImages(searchObj) {
  updateImagesTableHeaderSort();

  const data = {
    offset: ImageTableOffset,
    limit: ImageTableLimit,
    order: ImageTableOrderField,
    order_by: ImageTableOrderFieldBy,
    token: Cookies.get("token"),
  };

  if (searchObj) {
    for (key in searchObj) {
      data[key] = searchObj[key];
    }
  }

  $.ajax({
    url: "/admin/getimages",
    method: "POST",
    data: data,
    success: function (resultData) {
      console.log(result);
      var result = resultData.rows;
      var count = resultData.count;
      $("#imageTableBody").html("");

      $("#addImage").html("");
      $("#editImage").html("");

      for (var i = 0; i < result.length; i++) {
        $("#imageTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Image')" type="checkbox" class=" checkbox-Image "  data-id="${
                      result[i].id
                    }" /> </td>
					<td>${result[i] ? (result[i].id ? result[i].id : " ") : " "}</td>
					<td>${
            result[i]
              ? result[i].image_url
                ? '<img src="' +
                  result[i].image_url +
                  '" class="product-img" />'
                : " "
              : " "
          }</td>
					<td>${result[i] ? (result[i].size ? result[i].size : " ") : " "}</td>
					<td>${
            result[i] ? (result[i].product ? result[i].product.name : " ") : " "
          }</td><td><span class="btn btn-link btn-sm" onclick="editImageModal(  '${
          result[i].image_url
        }', '${result[i].size}', '${result[i].product_id}', ${
          result[i].id
        } )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteImageModal(${
          result[i].id
        })">Delete</span></td>
				          </tr>
				        `);
      }
      getPaginate(
        count,
        changeImagesTableOffset,
        ImageTableLimit,
        ImageTableOffset,
        "Image"
      );
    },
  });
}

function changeImagesTableOffset(num) {
  ImageTableOffset = num;
  getImages();
}
function changeImagesTableLimit(num) {
  ImageTableLimit = num;
  getImages();
}
function changeImagesTableOrder(order_field, order_field_by) {
  console.log(order_field, order_field_by);

  ImageTableOrderField = order_field;
  ImageTableOrderFieldBy = order_field_by;
  getImages();
}

var tempForm = "";
$("#searchImageForm").on("submit", (ev) => {
  ev.preventDefault();
  console.log(ev);
  tempForm = ev;
  var searchObj = {};
  $("#searchImageForm")
    .serializeArray()
    .map((i) => {
      if (i.value) searchObj[i.name] = i.value;
    });
  getImages(searchObj);
});

function addImage() {
  $.ajax({
    url: "/admin/addimage",
    method: "POST",
    data: {
      image_url: $("#addImageImageUrlInput").val(),
      size: $("#addImageSizeInput").val(),
      product_id: $("#addImageProductIdInput").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#addImageForm input, #addImageForm textarea").val("");
        $("#addImageModal").modal("hide");
        swal({
          title: "Image Added successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getImages();
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

$("#addImageForm").on("submit", (ev) => {
  ev.preventDefault();
  addImage();
});
function addImageModal() {
  $("#addImageModal").modal("show");
}

function updateImage() {
  $.ajax({
    url: "/admin/updateimage",
    method: "POST",
    data: {
      image_url: $("#editImageImageUrlInput").val(),
      size: $("#editImageSizeInput").val(),
      product_id: $("#editImageProductIdInput").val(),
      id: $("#editImageImageId").val(),
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        $("#editImageForm input, #editImageForm textarea").val("");
        $("#editImageModal").modal("hide");
        swal({
          title: "Image Updated successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getImages();
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

function editImageModal(image_url, size, product_id, id) {
  $("#editImageModal").modal("show");
  $("#editImageImageId").val(id);
  $("#editImageImageUrlInput").val(image_url);
  $("#editImageSizeInput").val(size);
  $("#editImageProductIdInput").val(product_id);
}
$("#editImageForm").on("submit", (ev) => {
  ev.preventDefault();
  updateImage();
});

function deleteImage(id) {
  $.ajax({
    url: "/admin/deleteimage",
    method: "POST",
    data: {
      id: id,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Image Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getImages();
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

async function deleteImageModal(id) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    deleteImage(id);
  }
}

function bulkDeleteImage(ids) {
  $.ajax({
    url: "/admin/bulkdeleteimage",
    method: "POST",
    data: {
      ids: ids,
      token: Cookies.get("token"),
    },
    success: function (result) {
      console.log(result);
      if (result.status == "success") {
        swal({
          title: "Images Deleted successfully",
          text: result.message,
          icon: "success",
          button: "Okay",
        });
        getImages();
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

async function bulkDeleteImageModal(ids) {
  const res = await swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
  console.log(res);
  if (res) {
    bulkDeleteImage(ids);
  }
}

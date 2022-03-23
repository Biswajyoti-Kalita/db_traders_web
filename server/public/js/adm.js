
    var imageIndex=0;
    var maxIndex=0;
    var productImages=[];
    var productId='';



    $(document).ready(function () {

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar, #content').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });

    });



    function showWindow(arg) {
        $(".sub-panes").hide();
        if (arg == 1) {
            $("#productPane").show();
        }
        else if (arg == 2) {
            $("#categoryPane").show();
        }
        else if (arg == 3) {
            $("#orderPane").show();
        }
    }


    function uploadFiles(formData,pid) {
        $.ajax({
            url: '/admin/uploadimage/'+pid,
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function () {
                var xhr = new XMLHttpRequest();

                // Add progress event listener to the upload.
                xhr.upload.addEventListener('progress', function (event) {
                    var progressBar = $('.progress-bar');

                    if (event.lengthComputable) {
                        var percent = (event.loaded / event.total) * 100;
                        progressBar.width(percent + '%');

                        if (percent === 100) {
                            progressBar.removeClass('active');
                        }
                    }
                });

                return xhr;
            }
        }).done(handleSuccess).fail(function (xhr, status) {
            alert(status);
        });
    }
    function uploadFiles2(formData,pid) {
        $.ajax({
            url: '/admin/uploadimage/'+pid,
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function(status) {
            viewImages($("#ModalImageProductId").val());
        }).fail(function (xhr, status) {
            alert(status);
        });
    }
    /**
     * Handle the upload response data from server and display them.
     *
     * @param data
     */
    function handleSuccess(data) {
        showAlert('Item Added');
        loadProducts();
        $("#productModalAdd").modal('hide');
        $("#productModalAdd input").val('');
        $("#productModalAdd textarea").val('');
        $("#album").html('');
        if (data.length > 0) {
        } else {
            showAlert('error uploading images '+data);
        }
        $(".progress").hide();
    }

    // Set the progress bar to 0 when a file(s) is selected.
    $('#photos-input').on('change', function () {
        $(".progress").show(100);
        $('.progress-bar').width('0%');
        var files = $('#photos-input').get(0).files;
        if (files.length>5) {
            showAlert('You can upload only 5 image');
            return;
        }
        $("#album").html('');
        for(var i=0;i<files.length;i++)
        {
            $("#album").append('<div class="col-lg-6">'
                +'<img width="100" src="'+ URL.createObjectURL(files[i])+'">'
                +'</div>');
        }

    });
    $('#photos-input2').on('change', function () {
        var files = $('#photos-input2').get(0).files,
            formData = new FormData();
        var ct=$("#ModalImageCount").val();
        
        if ((files.length + parseInt(ct) )>5) {
            showAlert('You can upload only 5 image');
            return;
        }


        for (var i=0; i < files.length; i++) {
            var file = files[i];
            formData.append('photos', file, file.name);
        }
        formData.append('username',Cookies.get('username'));
        formData.append('token',Cookies.get('token'));
        formData.append('productid', $("#ModalImageProductId").val() );
        uploadFiles2(formData,$("#ModalImageProductId").val());
    });


    function randomString(len) {
        var random="";
        for(var i=0;i<len;i++)
        {
            var divisor=65;
            if(Math.floor((Math.random()*100)%2) == 0)
                divisor=97;
            temp=String.fromCharCode((Math.floor(Math.random()*100))%26+divisor);
            random+=temp;    
        }
        return random;
    }


    function showproductModalAdd() {
        // if ($("#productModalAdd").val() == 0 || $("#productModalAdd").val() == '')
        //     $("#productUniqueId").val(randomString(7));
        $("#productId").val("db"+randomString(10));
        $("#productModalAdd").modal('show');

    }
    function editProduct(id) {
        $("#productModalEdit").modal('show');
        loadImages(id);
        $.ajax({
            url: '/secure/admin/loadproducts',
            type: 'post',
            data: {
              username :  Cookies.get('username'),
              token : Cookies.get('token'),
              productid:id
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
              if (data[0]) {      
                $("#productIdEdit").val(data[0].productid);
                $("#productNameEdit").val(data[0].name);
                $("#productCategoryEdit").val(data[0].category);
                $("#productTagEdit").val(data[0].tag);
                $("#productBrandEdit").val(data[0].brand);
                $("#productColorEdit").val(data[0].color);
                $("#productPriceEdit").val(data[0].price);
                $("#productDiscountEdit").val(data[0].discount);
                $("#productDescriptionEdit").val(data[0].description);
                $("#productStatusEdit").val(data[0].status);
              }
              else
              {
                showAlert('Product not found');
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });


    }
    function loadImages(id) {
        $.ajax({
            url: '/secure/admin/loadimages',
            type: 'post',
            data: {
              username :  Cookies.get('username'),
              token : Cookies.get('token'),
              productid:id
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
              if (data[0]) {                
                for(var i=0;i<data.length;i++)
                $("#albumEdit").append('<div class="col-lg-6">'
                +'<img width="100" src="'+ data[i].url+'">'
                +'</div>');

              }
              else
              {
                showAlert('Product not found');
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });
    }
    function loadAllImages(id) {
      $.ajax({
          url: '/secure/admin/loadallimages',
          type: 'post',
          data: {
            username :  Cookies.get('username'),
            token : Cookies.get('token'),
            productid:id
          },
          dataType: 'json',
          success: function(data) {
              console.log(data);
          },
          error: function(e) {
          }
      });
    }    
    function loadProducts() {
        console.log("loading products");
        $("#productsTable").html('<tr><td colspan="13" > <span class="fa fa-spinner fa-spin"></span> </td></tr>')
        $.ajax({
            url: '/secure/admin/loadproducts',
            type: 'post',
            data: {
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                $("#productsTable").html('');
                $("#categoryList").html('');


              if (data[0]) {
                var cats=[];
                var dataSet=[];
                for(var i=0;i<data.length;i++)
                {
                    $("#brandList").append("<option>"+data[i].brand+"</option>");          


                    if (cats.indexOf(data[i].category)<0) {
                        cats.push(data[i].category);
                        $("#categoryList").append('<option>'+data[i].category+'</option>')
                        console.log("new category found"+data[i].category);
                    }

                    dataSet[i]=[
                        (i+1)
                        ,data[i].name
                        ,data[i].category
                        ,"Tag: "+data[i].tag                        
                        +"<br>Brand: "+data[i].brand
                        +"<br>Color: "+data[i].color
                        ,data[i].price
                        ,data[i].discount
                        ,'<div class="description" >'+data[i].description+'</div>'
                        ,data[i].status
                        ,'<span onclick="viewImages(\''+data[i].productid+'\')" >View/Edit</span>'
                        ,'<span class="fas fa-pencil-alt btn" style="" onclick="editProduct(\''+data[i].productid+'\')" >Edit</span>'
                        ,'<span class="far fa-trash-alt btn" onclick="deleteProduct(\''+data[i].productid+'\')" >Delete</span>'
                    ]
                }

                  $('#productsTable').DataTable( {
                    data:dataSet,
                    responsive:true,
                    columns: [
                        { title: "#"},
                        { title: "Name"},
                        { title: "Category"},
                        { title: "Tag/Brand/Colors"},
                        { title: "Price"},
                        { title: "Discount"},
                        { title: "Description"},
                        { title: "Status"},
                        {
                          title:"Images"
                        },
                        {
                          title:"Edit"
                        },
                        {
                          title:"delete"
                        }
                    ],
                    "bDestroy": true,
                    initComplete: function() {
                        $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
                    }
                  });

              }
              else
              {
                $("#productsTable").html('<tr><td colspan="13" > <center>empty</center> </td></tr>')
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });

    }

    function loadOrders() {
        console.log("loading orders");
        $("#ordersTable").html('<tr><td colspan="13" > <span class="fa fa-spinner fa-spin"></span> </td></tr>')
        $.ajax({
            url: '/secure/admin/loadorders',
            type: 'post',
            data: {
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                var dataSet=[];
                $("#ordersTable").html('');
                for (var i = data.length - 1; i >= 0; i--) {

                    dataSet[i]=[
                        (i+1)
                        ,data[i].orderid
                        ,data[i].productid
                    ]
                }

            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });

    }
    function viewImages(productid) {
        console.log('view images '+productid);
        if (!$("#productModalImages").hasClass('show'))
            $("#productModalImages").modal('show');

        $.ajax({
          url: '/index/productview/'+productid,
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            console.log(data);

                productImages=data;
                $("#totalProductImages").text('Total Image : '+productImages.length)
                $("#ModalImageProductId").val(productid);
                $("#ModalImageCount").val(productImages.length);

            if (data[0]) {                

                $("#productModalImagesBody").html('');
                for(var i=0;i<productImages.length;i++)
                {
                    $("#productModalImagesBody").append(''
                        +'<div class="col">'
                        +'<img src="'+productImages[i].url+'" class="col-lg-12"  >'
                        +'<button onclick="deleteImage(\''+productid+'\',\''+productImages[i].url+'\')"  >delete</button>'
                        +'</div>'
                        );
                }


            }
          }
        });
    }
    function deleteImage(productid,imageid) {
        $.ajax({
          url: '/admin/deleteimage',
          type: 'POST',
          data: {
            productid:productid,
            imageid:imageid,
            username :  Cookies.get('username'),
            token : Cookies.get('token')
          },
          dataType: 'json',
          success: function(data) {
            viewImages(productid);
          }
      });
    }
    function updateProduct() {
        $.ajax({
            url: '/secure/admin/updateproduct',
            type: 'post',
            data: {
              productid : $("#productIdEdit").val(),
              name :  $("#productNameEdit").val(),
              category :  $("#productCategoryEdit").val(),
              brand :  $("#productBrandEdit").val(),
              color :  $("#productColorEdit").val(),
              price :  $("#productPriceEdit").val(),
              discount :  $("#productDiscountEdit").val(),
              status : $("#productStatusEdit").val(),
              description: $("#productDescriptionEdit").val(),
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
              console.log(data);
              if (data.status == 'success') {
                showAlert("Product updated");
                loadProducts();
                $("#productModalEdit").modal('hide');
                $("#productModalEdit input").val('');
                $("#productModalEdit textarea").val('');
              }
              else
              {
                showAlert(data.message);
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });
    }
    function deleteProduct(pid) {
        var sure=confirm("You sure want to delete product with id: "+pid);
        if (!sure)
            return;
        var ict=0;
        $.ajax({
            url: '/secure/admin/deleteproduct',
            type: 'post',
            data: {
                productid : pid,
                username :  Cookies.get('username'),
                token : Cookies.get('token')
            },
            dataType: 'json',
          success: function(data) {
            loadproducts();
          }
        });
    }
    function deleteProductFolder(pid) {

        $.ajax({
            url: '/secure/admin/deleteproduct',
            type: 'post',
            data: {
              productid : pid,
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
                if (data.status == "success")
                    loadProducts();
                else
                    showAlert(data.message);
            }
        });
    }
    function addProduct() {
        $.ajax({
            url: '/secure/admin/addproduct',
            type: 'post',
            data: {
              productid : $("#productId").val(),
              name :  $("#productName").val(),
              category :  $("#productCategory").val(),
              tag: $("#productTag").val(),
              brand :  $("#productBrand").val(),
              color :  $("#productColor").val(),
              price :  $("#productPrice").val(),
              discount :  $("#productDiscount").val(),
              status : $("#productStatus").val(),
              description: $("#productDescription").val(),
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
              console.log(data);
              if (data.status == 'success') {
//                showAlert('Item Added');
//                loadProducts();
                var files = $('#photos-input').get(0).files,
                    formData = new FormData();

                for (var i=0; i < files.length; i++) {
                    var file = files[i];
                    formData.append('photos', file, file.name);
                }
                if(files.length>0)
                uploadFiles(formData,$("#productId").val());
              }
              else
              {
                showAlert(data.message);
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });
    }
    function editCategory(ind,name) {
      $("#editCategoryModal").modal('show');
      $("#editCategoryOldName").text(name);
//      $("#editCategoryText").val(name);
      $("#editCategoryId").val(ind);
    }
    function updateCategory(argument) {
      $.ajax({
          url: '/secure/admin/updatecategory',
          type: 'post',
          data: {
            name: $("#editCategoryText").val(),
            id: $("#editCategoryId").val(),
            username :  Cookies.get('username'),
            token : Cookies.get('token')
          },
          dataType: 'json',
          success: function(data) {
            $("#editCategoryModal").modal('hide');
            loadCategories();
          }
        });
    }
    function deleteCategory(id) {
      $.ajax({
          url: '/secure/admin/deletecategory',
          type: 'post',
          data: {
            id: id,
            username :  Cookies.get('username'),
            token : Cookies.get('token')
          },
          dataType: 'json',
          success: function(data) {
            loadCategories();
          }
        });
    }

    function loadCategories() {
        $.ajax({
            url: '/index/getcategories',
            type: 'post',
            data: {
              username :  Cookies.get('username'),
              token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
              console.log(data);
                $("#categoryCard , #productCategory ,#productCategoryEdit ").html('');
                // $("#addCategoryParent").html('<option value="root" >Root</option>');                
                console.log(data);
                if (data[0]) {
                for (var i = 0; i < data.length; i++) {
                    $("#productCategory, #productCategoryEdit").append('<option>'+data[i].category+'</option>');                

                    if (data[i].image == null || data[i].image == '')
                        data[i].image="images/no-image.png"

                    // $("#categoryCard").append(' <div class="col-md-3"> <div class="card m-1">'
                    //   +'<div class="card-body">'
                    //   +'<h5>'+data[i].category+'</h5>'
                    //   +'<h6>'+data[i].parent+'</h6>'
                    //   +'</div>'
                    // +'</div> </div>');


                    $("#categoryCard").append(`
                        <div class="card m-2" style="width: 18rem;">
                          <div class="card-body">
                            <h5 class="card-title capitalize">${data[i].category}</h5>
                            <a href="#" class="btn btn-primary fas fa-pencil-alt btn-sm" onclick="editCategory(${data[i].id},'${data[i].category}')">Edit</a>
                            <a href="#" class="btn btn-primary btn-sm" onclick="deleteCategory(${data[i].id})" >Delete</a>
                          </div>
                        </div>
                      `);
                }
              }
              else {
                $("#categoryCard").html('<center><h4>No Category Found </h4></center>');
              }
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });
    }
    function addCategory(filepath) {

        $.ajax({
            url: '/secure/admin/addcategories',
            type: 'post',
            data: {
                category:$("#addCategoryText").val(),
                parent: 'root',
                username :  Cookies.get('username'),
                token : Cookies.get('token')
            },
            dataType: 'json',
            success: function(data) {
                loadCategories();
                $("#addCategoryModal").modal('hide');
            },
            error: function(e) {
              $("#alertText").text(e);
              $("#alertBox").show();
              //console.log("Not able to check the users.");
            }
        });



        // if (($("#photos-input3").get(0).files).length>0) {
        //     var files = $('#photos-input3').get(0).files,
        //     formData = new FormData();
        //     formData.append('photos', files[0], files[0].name);
        //     $.ajax({
        //         url: '/admin/uploadimage/category',
        //         method: 'post',
        //         data: formData,
        //         processData: false,
        //         contentType: false,
        //     }).done(function(status) {
        //         console.log(status);
        //         uploadCategory(status[0].publicPath);
        //     }).fail(function (xhr, status) {
        //         alert(status);
        //     });
        // }
        // else{
        //     uploadCategory('images/no-image.png');
        // }
    }    

    function uploadCategory(link) {
        console.log("link found "+link)
    }
    function logout() {
        // body...
        Cookies.remove('username');
        Cookies.remove('token');
        Cookies.remove('usertype');

        location.href="index.html";
    }
    function hideAlertBox() {
        $("#alertText").text('');
        $("#alertBox").hide(300);
    }

    function showAlert(msg) {
      $("#alertText").text(msg);
      $("#alertBox").show();
      setTimeout(function () {
        hideAlertBox();
      },2000);
    }
    $( document ).ready(function() {
        loadProducts();
        loadCategories();
        loadOrders();
    });


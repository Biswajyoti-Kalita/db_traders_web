var productList=[];
var lastIndex=-1;
var _cat='';

$(window).on('load', function () {

    getKeywords();
    checkCat(1);
//    getProducts();

});



function updateIndex() {
  lastIndex=-1;
}
function removeCat() {
  _cat="";
  location.hash="";
  checkCat
}
function showCat() {

  $("#catDiv").html(`
      <center>
        <h4>${_cat.replace("_"," ").replace("and"," &").replace("_"," ").replace("  "," ")}</h4>
        <i class="fa fas-close" onclick="removeCat()"></i>
      </center>
    `)
}

function checkCat(v) {
  var hash=location.hash;
  console.log("hash "+hash);
  if (hash.indexOf("#cat") >=0) {
    var cat=hash.substr(5);
    lastIndex=-1;
    if (cat.indexOf("&")>1)
      cat= cat.substr(0,cat.indexOf("&"));
      _cat=cat;
    showCat();
    getProducts();
  }
  else if(v == 1)
  {
    getProducts();
  }
}
function getProducts() {




  if(lastIndex<0)
    $("#ourProducts").html('');

  $.ajax({
    url: "index/searchproduct",
    data : {
      text: $("#inputQuery").val(),
      limit: 15,
      cat: _cat.replace("_"," ").replace("and"," &").replace("_"," ").replace("  "," "),
      last : lastIndex
    },
    method : "POST",
    success: function(result){
    console.log(result);
    productList=[];


    if (result.length == 0) {
          $("#ourProducts").append('<center style="width:90%;"><h4>Sorry, no result found.</h4></center>');
    }

    if (result.length == 15) 
      $(".btn_box").show();
    else
      $(".btn_box").hide();

      for (var i = 0; i < result.length; i++) {

        lastIndex=result[i].id;


        if (productList.indexOf(result[i].productid) >=0)
          continue;

        productList.push(result[i].productid);


        var temp=result[i].price;
        if(parseFloat(result[i].discount)>0)
        temp=temp-(temp*0.01*parseFloat(result[i].discount));
        temp=temp.toFixed(2);


        var stars="";
          
          var imageurl="assets/img/no-image.png";

          if (result[i].url != null && result[i].url.length>3)
            imageurl=result[i].url;

          
          var dcolor=result[i].color;

          dcolor=dcolor.split(",")[0];


          $("#ourProducts").append(`
            <div class="col-sm-4 col-lg-3">
              <div class="box">
                <div class="img-box">
                  <img src="${imageurl}" alt="" />
                  <span href="#" class="add_cart_btn" onclick="addToCart('${result[i].productid}',1,'${dcolor}')">
                    <span>
                      <i class="fa fa-shopping-cart" style="color:white;" ></i>
                    </span>
                  </span>
                  <a href="#" class="discount_cart_btn">
                    <span>
                      ${result[i].discount}%
                    </span>
                  </a>
                </div>
                <div class="detail-box">
                  <a target="_blank" href="product_details.html#${result[i].productid}" class="no-default" >
                  <h6>
                    ${result[i].name}
                  </h6>
                  <small>${result[i].brand}</small>
                  <div class="product_info">
                    <h6>
                      <span>₹</span>${temp}
                       <del> ₹${result[i].price} </del>
                    </h6>
                    <div class="star_container">
                    </div>
                  </div>
                  </a>
                </div>
              </div>
            </div>`);

      }
    }
  });
}

$(".btn_box").hide();

$(".view_more-link").on('click',function (ev) {
  ev.preventDefault();
})

$("#search_form").on('submit',function (ev) {
  ev.preventDefault();
  getProducts();
})



$(window).scroll(function() {    // this will work when your window scrolled.
    var height = $(window).scrollTop();  //getting the scrolling height of window
    if(height  > 150) {
      $("#search_form").addClass("sticky");
      $(".go-up").removeClass("hide");
    } else{
      $(".go-up").addClass("hide");
      $("#search_form").removeClass("sticky");
    }
  });

$(".go-up").on('click',function () {
  $('html,body').animate({ scrollTop: 0 }, 'slow');
  $(".go-up").addClass("hide");

})





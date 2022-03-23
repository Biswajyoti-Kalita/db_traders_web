var productList=[];


$(window).on('load', function () {
  getLatestProducts();
    getKeywords();

});
  


var textWrapper = document.getElementsByClassName('letters');
for (var i = 0; i < textWrapper.length; i++) {
  textWrapper[i].innerHTML = textWrapper[i].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}



function ml9effect() {
  // body...
// Wrap every letter in a span

  anime.timeline({loop: false})
  .add({
    targets: '.ml9 .letter',
    scale: [0, 1],
    duration: 1500,
    elasticity: 800,
    delay: (el, i) => 45 * (i+1)
  })
}
ml9effect();

$('#customCarousel1').on('slide.bs.carousel', function () {
  console.log("chhaged");
  ml9effect();
})


function getLatestProducts() {
  $("#ourProducts").html('');

  $.ajax({
    url: "index/getproducts",
    data : {
      limit: 15
    },
    method : "POST",
    success: function(result){
    console.log(result);
    productList=[];

      for (var i = 0; i < result.length; i++) {

        if (productList.indexOf(result[i].productid) >=0)
          continue;

        productList.push(result[i].productid);


        var temp=parseFloat(result[i].price);
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
                  <span href="#" class="add_cart_btn prev-default" onclick="addToCart('${result[i].productid}',1,'${dcolor}')">
                    <span>
                      <i class="fa fa-shopping-cart" style="color:white;" ></i>
                    </span>
                  </span>
                  <a href="#" class="discount_cart_btn"  >
                    <span>
                      ${result[i].discount}%
                    </span>
                  </a>
                </div>
                <div class="detail-box">
                  <a href="product_details.html#${result[i].productid}" class="no-default" >
                  <h6>
                    ${result[i].name}
                  </h6>
                  <small>${result[i].brand}</small>
                  <div class="product_info">
                    <h5>
                      <span>₹</span>${temp}
                       <del> ₹${result[i].price} </del>
                    </h5>
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





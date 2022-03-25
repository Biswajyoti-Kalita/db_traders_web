var productList = [];

$(window).on("load", function () {
  getLatestProducts();
});

var textWrapper = document.getElementsByClassName("letters");
for (var i = 0; i < textWrapper.length; i++) {
  textWrapper[i].innerHTML = textWrapper[i].textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );
}

function ml9effect() {
  // body...
  // Wrap every letter in a span

  anime.timeline({ loop: false }).add({
    targets: ".ml9 .letter",
    scale: [0, 1],
    duration: 1500,
    elasticity: 800,
    delay: (el, i) => 45 * (i + 1),
  });
}
ml9effect();

$("#customCarousel1").on("slide.bs.carousel", function () {
  console.log("chhaged");
  ml9effect();
});

function getLatestProducts() {
  $("#ourProducts").html("");

  $.ajax({
    url: "others/getproducts",
    data: {
      limit: 15,
    },
    method: "POST",
    success: function (resultData) {
      console.log(resultData);
      let result = resultData.rows;
      productList = [];

      for (var i = 0; i < result.length; i++) {
        if (productList.indexOf(result[i].id) >= 0) continue;

        productList.push(result[i].id);

        var temp = parseFloat(result[i].selling_price);
        if (parseFloat(result[i].discount) > 0)
          temp = temp - temp * 0.01 * parseFloat(result[i].discount);

        temp = temp.toFixed(2);

        var stars = "";

        var imageurl = result[i].images
          ? result[i].images[0].image_url
          : "assets/img/no-image.png";

        var dcolor = result[i].colors;

        dcolor = dcolor.split(",")[0];

        $("#ourProducts").append(`
            <div class="col-sm-4 col-lg-3">
              <div class="box">
                <div class="img-box">
                  <img src="${imageurl}" alt="" />
                  <span href="#" class="add_cart_btn prev-default" onclick="addToCart('${
                    result[i].id
                  }',1,'${dcolor}')">
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
                  <a href="product_details.html#${
                    result[i].id
                  }" class="no-default" >
                  <h6>
                    ${result[i].name}
                  </h6>
                  <small>${result[i].brand ? result[i].brand.name : ""}</small>
                  <div class="product_info">
                    <h5>
                      <span>₹</span>${temp}
                       <del> ₹${result[i].selling_price} </del>
                    </h5>
                    <div class="star_container">
                    </div>
                  </div>
                  </a>
                </div>
              </div>
            </div>`);
      }
    },
  });
}

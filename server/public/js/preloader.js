var myid = "";

$(window).on("load", function () {
  $("#preloader-active").delay(450).fadeOut("slow");
  $("body").delay(450).css({
    overflow: "visible",
  });

  //   if (Cookies.get('token') == undefined || Cookies.get('token') == null) {

  //   $(".user_option_box").html(`
  // 	  <a href="login.html" target="" class="cart-link">
  // 	    <i class="fa fa-user" aria-hidden="true"></i>
  // 	    <span>
  // 	      Sign In
  // 	    </span>
  // 	  </a>
  // 	  <a href="cart.html" class="cart-link">
  // 	    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
  // 	    <span>
  // 	      Cart
  // 		      	<sup id="cartItems"></sup>
  // 	    </span>
  // 	  </a>
  //     `);

  // 	if (!Cookies.get('guest_id')) {
  // 		myid = uuid();
  // 		Cookies.set('guest_id',myid);
  // 	}
  // 	else{
  // 		myid=Cookies.get('guest_id');
  // 	}

  //   }
  //   else{

  //   		myid = Cookies.get('username');

  // 	$(".user_option_box").html(`
  // 	  	<ul class="dropmenu">
  // 		    <li class=" dropdown">
  // 		      <a href="#" style="color: white;" class="dropdown-toggle prev-default" data-toggle="dropdown">
  // 		        <i class="fa fa-shopping-cart mr-2" aria-hidden="true"></i>
  // 		        ${Cookies.get('name')}<b class="caret"></b></a>
  // 		      <ul class="dropdown-menu">
  // 		        <li><a href="myorders.html" class="prev-default">
  // 		          <i class="far fa-list-alt"></i>
  // 		        My Orders</a></li>
  // 		        <li><a href="#"  class="prev-default">
  // 		        <i class="fas fa-cog"></i>
  // 		        Settings</a></li>
  // 		        <li><a href="#" class="prev-default" onclick="logout()">
  // 		          <i class="fas fa-sign-out-alt"></i>
  // 		        Sign Out</a></li>
  // 		      </ul>
  // 		    </li>
  // 		</ul>
  // 	  <a href="cart.html" class="cart-link">
  // 	    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
  // 	    <span>
  // 	      Cart
  // 		      	<sup id="cartItems"></sup>
  // 	    </span>
  // 	  </a>

  //     `);
  //     	getMyCredentials();
  //   }
  //     getMyCart();

  $("ul li.dropdown").hover(
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(100).fadeIn(500);
    },
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(100).fadeOut(500);
    }
  );
});

function logout() {
  Cookies.remove("username");
  Cookies.remove("token");
  Cookies.remove("usertype");
  Cookies.remove("name");
  location.reload();
}

function getMyCredentials() {
  //  	$.ajax({
  //     url: "index/getkeywords",
  //     data : {
  //       text: $("#inputQuery").val()
  //     },
  //     method : "POST",
  //     success: function(result){
  //     	console.log(result);
  //     	for (var i = result.length - 1; i >= 0; i--) {
  // 	    	$("#nameList").append("<option>"+result[i].name+"</option>");
  //     	}
  //     }
  // });
  console.log("get my creds");
}
function uuid() {
  var temp = "guest_";
  var num = 0;

  for (var i = 15; i >= 0; i--) {
    num = Math.ceil(Math.random() * 100) % 26;

    if (Math.random() * 10 > 5) {
      num = num + 65;
    } else {
      num = num + 97;
    }

    temp += String.fromCharCode(num);
  }

  return temp;
}
function getMyCart() {
  $.ajax({
    url: "index/getmycart",
    data: {
      username: myid,
    },
    method: "POST",
    success: function (result) {
      console.log(result);
      $("#cartItems").text("(" + result.length + ")");
    },
  });
}
function removeFromCart(id, callback) {
  $.ajax({
    url: "index/removefromcart",
    data: {
      productid: id,
      username: myid,
    },
    method: "POST",
    success: function (result) {
      if (result.status == "success") {
        alertify.success(result.message);
        getMyCart();
      } else alertify.error(result.message);

      if (callback) callback();
    },
  });
}

function updateQuantity(id, quan, callback) {
  $.ajax({
    url: "index/updatecartquantity",
    data: {
      productid: id,
      quantity: quan,
      username: myid,
    },
    method: "POST",
    success: function (result) {
      if (result.status == "success") {
        alertify.success(result.message);
        if (callback) callback();
      } else alertify.error(result.message);
    },
  });
}

function addToCart(id, quan, color) {
  $.ajax({
    url: "index/addtocart",
    data: {
      productid: id,
      quantity: quan,
      color: color,
      username: myid,
    },
    method: "POST",
    success: function (result) {
      if (result.status == "success") {
        alertify.success(result.message);
        getMyCart();
      } else alertify.error(result.message);
    },
  });
}

function getKeywords() {
  $.ajax({
    url: "index/getkeywords",
    data: {
      text: $("#inputQuery").val(),
    },
    method: "POST",
    success: function (result) {
      console.log(result);
      for (var i = result.length - 1; i >= 0; i--) {
        $("#nameList").append("<option>" + result[i].name + "</option>");
      }
    },
  });
}

$(".prev-default").on("click", function (ev) {
  ev.preventDefault();
});

$(".scrollDown").on("click", function (ev) {
  ev.preventDefault();

  $("html, body").animate(
    {
      scrollTop: $("#contactUs").offset().top,
    },
    500,
    "linear"
  );
});

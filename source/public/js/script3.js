var productList=[];
var lastIndex=-1;
alertify.set('notifier','position', 'top-center');

var modal = document.getElementById("myModal");

$(window).on('load', function () {
  var _id=location.hash;
  if (_id) {
    if (_id.length>5) {
      _id=_id.substr(1);
      getProduct(_id);

    }

  }

});



function updateIndex() {
  lastIndex=-1;
}

function addToCart1() {
  console.log(
      $("#prod_quan").val()+"  "+$("#prod_id").val()+"  "+$("#prod_color").val()
    )

  addToCart($("#prod_id").val(),$("#prod_quan").val(),$("#prod_color").val());
}

function getProduct(_id) {

  $.ajax({
    url: "index/getproduct",
    data : {
      productid : _id
    },
    method : "POST",
    success: function(result){
      if (result[0]) {
        var item=result[0];

        console.log(item);
        var temp= parseFloat(item.price);
        if(parseFloat(item.discount)>0)
        temp=temp-(temp*0.01*parseFloat(item.discount));
        temp=temp.toFixed(2);


        var colors="<select id='prod_color'>",
        subimages="";
        var splitColors=item.color.split(",");
        for (var i = splitColors.length - 1; i >= 0; i--) {
          colors+="<option> "+splitColors[i]+"</option>";
        }
        colors+="</select>";

        $("#productCat").text(item.category);

        for (var i = result.length - 1; i >= 0; i--) {
          subimages+='<img src="'+result[i].url+'" class="show-small-img" alt="">'
        }


        $("#imageDesc").html(`
             <div class="show" href="${item.url}">
               <img src="${item.url}" id="show-img" onclick="showBigImage()">
             </div>
             <div class="small-img">
              <span id="prev-img" class="icon-left"> 
                <i class="fas fa-arrow-left"></i>
              </span>
               <div class="small-container">
                <div id="small-img-roll" >
                  ${subimages}
                </div>
               </div>
              <span class="icon-right" id="next-img">
                <i class="fas fa-arrow-right"></i>
              </span>
             </div>
          `);





        $("#productDesc").html(`
            <h4>${item.name}</h4>
            <h6>${item.brand}</h6>

            <h2>₹${temp} <del>₹${item.price}</del> <code>${item.discount}% off</code></h2>
            <br>
            <b>About the product : </b><br>
            <p class="pre-line" > ${item.description}</p>
              <h6><b>Colors available: ${colors}</b></h6>
              <h6>${item.status}</h6>
              <div class="row"> 
              <span class="p-2" > <b>Quantity </b></span> <input  type="number" value="1" min="1" max="2000" class="form-control" style="max-width: 100px;" id="prod_quan" />
              <button class="btn btn-danger ml-2" onclick="addToCart1()">
                <i class="fa fa-shopping-cart" ></i>
                ADD TO CART
              </button>
              </div>
              <input type="hidden" id="prod_id" value="${_id}" />

            <br><br>
          `);

      }
      else {
        alertify.error("Product not found !");
      }









$('.show-small-img:first-of-type').css({'border': 'solid 1px #951b25', 'padding': '2px'})
$('.show-small-img:first-of-type').attr('alt', 'now').siblings().removeAttr('alt')



$('.show-small-img').click(function () {
  console.log("clicked")
  $('#show-img').attr('src', $(this).attr('src'))
  $('#big-img').attr('src', $(this).attr('src'))
  $(this).attr('alt', 'now').siblings().removeAttr('alt')
  $(this).css({'border': 'solid 1px #951b25', 'padding': '2px'}).siblings().css({'border': 'none', 'padding': '0'})
  if ($('#small-img-roll').children().length > 4) {
    if ($(this).index() >= 3 && $(this).index() < $('#small-img-roll').children().length - 1){
      $('#small-img-roll').css('left', -($(this).index() - 2) * 76 + 'px')
    } else if ($(this).index() == $('#small-img-roll').children().length - 1) {
      $('#small-img-roll').css('left', -($('#small-img-roll').children().length - 4) * 76 + 'px')
    } else {
      $('#small-img-roll').css('left', '0')
    }
  }
})

//Enable the next button

$('#next-img').click(function (){

  if ($(".show-small-img[alt='now']").next().length>0) {

    $('#show-img').attr('src', $(".show-small-img[alt='now']").next().attr('src'))
    $('#big-img').attr('src', $(".show-small-img[alt='now']").next().attr('src'))

    $(".show-small-img[alt='now']").next().css({'border': 'solid 1px #951b25', 'padding': '2px'}).siblings().css({'border': 'none', 'padding': '0'})
    $(".show-small-img[alt='now']").next().attr('alt', 'now').siblings().removeAttr('alt')

    if ($('#small-img-roll').children().length > 4) {
      if ($(".show-small-img[alt='now']").index() >= 3 && $(".show-small-img[alt='now']").index() < $('#small-img-roll').children().length - 1){
        $('#small-img-roll').css('left', -($(".show-small-img[alt='now']").index() - 2) * 76 + 'px')
      } else if ($(".show-small-img[alt='now']").index() == $('#small-img-roll').children().length - 1) {
        $('#small-img-roll').css('left', -($('#small-img-roll').children().length - 4) * 76 + 'px')
      } else {
        $('#small-img-roll').css('left', '0')
      }
    }

  }
  else{

  }

})

//Enable the previous button

$('#prev-img').click(function (){
  $('#show-img').attr('src', $(".show-small-img[alt='now']").prev().attr('src'))
  $('#big-img').attr('src', $(".show-small-img[alt='now']").prev().attr('src'))
  $(".show-small-img[alt='now']").prev().css({'border': 'solid 1px #951b25', 'padding': '2px'}).siblings().css({'border': 'none', 'padding': '0'})
  $(".show-small-img[alt='now']").prev().attr('alt', 'now').siblings().removeAttr('alt')
  if ($('#small-img-roll').children().length > 4) {
    if ($(".show-small-img[alt='now']").index() >= 3 && $(".show-small-img[alt='now']").index() < $('#small-img-roll').children().length - 1){
      $('#small-img-roll').css('left', -($(".show-small-img[alt='now']").index() - 2) * 76 + 'px')
    } else if ($(".show-small-img[alt='now']").index() == $('#small-img-roll').children().length - 1) {
      $('#small-img-roll').css('left', -($('#small-img-roll').children().length - 4) * 76 + 'px')
    } else {
      $('#small-img-roll').css('left', '0')
    }
  }
})










      
    }
  });




}

$(".btn_box, .big-img-container").hide();

$(".view_more-link").on('click',function (ev) {
  ev.preventDefault();
})

$("#search_form").on('submit',function (ev) {
  ev.preventDefault();
  getProducts();
})
function hideBigImage() {
//  $(".big-img-container").hide(300);
  modal.style.display = "none";

}
function showBigImage() {


  $("#big-img").attr("src",$("#show-img").attr('src'));
//  $(".big-img-container").show(300);
    modal.style.display = "block";


}

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





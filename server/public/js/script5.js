var cartItems=[];
var addressList=[];
var totalPrice=0.0;
var totalDiscount=0.0;
var grandTotal=0.0;

$(window).on('load', function () {
	getMyInfo();
	getMyCartDetails();
	getMyAddress();
});


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
  	console.log("Geo location is not supported");
  }
}

function showPosition(position) {
  console.log( "Latitude: " + position.coords.latitude +" Longitude: " + position.coords.longitude);
}

function setDisable() {

	if(totalPrice != 0)
		$("#confirmOrderBtn").prop("disabled",false);


}
function showCart(items) {
	console.log(items);
	$("#cartContainer").html('');
	totalPrice=0.0;
	totalDiscount=0.0;
	grandTotal=0.0;
	var i=0;


	for (i=0;i<items.length;i++) {


        var temp=items[i].price;

        totalPrice+= parseInt(items[i].quantity)*parseFloat( items[i].price )+0.00;  

        if(parseFloat(items[i].discount)>0){
	        totalDiscount= parseFloat(totalDiscount)+ ( parseInt(items[i].quantity)* parseFloat((temp*0.01*parseFloat(items[i].discount))) );	        
	        temp=temp-(temp*0.01*parseFloat(items[i].discount));
        }


        console.log("total discount"+totalDiscount);
        console.log(typeof(totalDiscount) );

        temp=temp.toFixed(2);
        totalDiscount= totalDiscount.toFixed(2);




		$("#cartContainer").append(`
			<div class="row">
				<div class="col-xs-3 col-md-3  "><img  class="img" src="${items[i].url}">
				</div>
				<div class="col-xs-5   col-md-5  p-2">
					<h5 class="product-name"><strong>${items[i].name}</strong></h5>
					<h6><small>${items[i].description}</small></h6>
					<h6><small>${items[i].color}</small></h6>
					<div class="row">
						<span class="p-2 round" onclick="minSize('${items[i].productid}')" >
							<i class="fas fa-minus" ></i>
						</span>
						<input onchange="checkInput(this.value,'${items[i].productid}')"  type="number" style="max-width:100px;" id="${items[i].productid}" class="form-control" value="${items[i].quantity}" />
						<span class="p-2 round"  onclick="maxSize('${items[i].productid}')" >
							<i class="fas fa-plus" ></i>
						</span>
						<button class="btn btn-danger ml-1" onclick="removeFromCart('${items[i].productid}',getMyCartDetails)" >
							<i class="far fa-trash-alt"> </i>
						</button>
					</div>
				</div>
				<div class="col-xs-4 col-md-4  p-3">
                  	<div class="product_info float-r">
                	    <b> <span>₹</span>${temp} <del> ₹${items[i].price} </del> </b>
                	    <br>
	    	            <code class="float-r"> ${items[i].discount}% off</code>
    	            </div>
				</div>
			</div>
			<hr>
			`);
	}


	console.log(grandTotal+"  "+totalPrice+"  "+totalDiscount);
	grandTotal=totalPrice - totalDiscount;


	if (items.length <1) {
		$("#cartContainer").html(`
			<div class="row">
				<center>
					Your cart is empty.
				</center>
			</div>
			<hr>
			`);

	}

	$("#cartTotalPrice").html(`
			<h4>Price details</h4>
			<table class="table">
			<tr>
				<td>
					Price (${i} items)
				</td>
				<td>
					<span class="float-r"> ₹${totalPrice}</span>
				</td>
			</tr>
			<tr>
				<td>
					Discount
				</td>
				<td>
					<span class="float-r fade-color"> -₹${totalDiscount}</span>					
				</td>
			</tr>
			<tr>
				<td>
					Delivery Charges
				</td>
				<td>
					*
				</td>
			</tr>
			<tr>
				<td>
					<b>Total Price</b>
				</td>
				<td>
					<b>
					<span class="float-r"> ₹${grandTotal}</span>
					</b>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<span class="fade-red">
						You will save ₹${totalDiscount} on this order.
					</span>
				</td>
			</tr>
			</table>
			<br>
			<span> ${convertNumberToWords(grandTotal)} </span>
			<button id="confirmOrderBtn" class="btn btn-primary   btn-block" onclick="confirmOrder()" disabled>Confirm</button>
			<br><br>
			<small>
			<ul>
			<li>
				Within Guwahati Delivery Charges  ₹50 (Free If Amount >500 )  
			</li>
			<li>
				Outside Guwahati Delivery Charges may vary between ₹50 to ₹150 (Free If Amount >1500 ) 
			</li>
			</ul>
			</small>

		`);

	setDisable();
}

function confirmOrder() {

	$.ajax({
	    url: "generic/index/confirmorder",
	    data : {
	    	addressid: $("#addressId").val(),
	    	username: Cookies.get('username'),
	    	token: Cookies.get('token')
	    },
	    method : "POST",
	    success: function(result){
	    	console.log(result);
	    	if (result.status == "success") {
	    		alertify.set('notifier','position', 'top-center');
	    		alertify.success("Thank you for placing order, confirmation mail is sent");
	    		setTimeout(function() {
		    		location.href="index.html";			
	    		}, 3000);
	
	    	}
	    	else {
	    		alertify.error(result.message);
	    	}
	    }
	});


}
function getMyCartDetails() {

	$.ajax({
	    url: "index/getmycartdetails",
	    data : {
	    	username: myid
	    },
	    method : "POST",
	    success: function(result){
	    	console.log(result);
	    	var obj=[];
	    	cartItems=[];
	    	for (var i = result.length - 1; i >= 0; i--) {
	    		if (cartItems.indexOf(result[i].productid)>=0) {
	    			continue;
	    		}
	    		obj.push(result[i]);
	    		cartItems.push(result[i].productid);
	    	}
	    	showCart(obj);
	    }
	});
}


function getMyAddress() {

	$.ajax({
	    url: "generic/index/getmyaddress",
	    data : {
	    	username: Cookies.get('username'),
	    	token: Cookies.get('token')
	    },
	    method : "POST",
	    success: function(result){
	    	addressList=[];
	    	console.log(result);
	    	$("#addressList").html('<option value="1">Select Previous Address</option>');

	    	if (result[0]) {
	    		$("#defaultAddress").html('<b> '+result[0].to+'</b> : '+result[0].contact+', '+result[0].email+', '+result[0].address+', '+result[0].state+', '+result[0].pin );
		    	$("#addressId").val(result[0].addressid);
			   	$("#collapseOne").collapse('hide');
			   	$("#collapseTwo").collapse('show');
			   	setDisable();
		    	$("#addressList").html('<option value="1">Select Previous Address</option>');


			   	for(var i=0;i<result.length;i++)
			   	{

			   		addressList[result[i].addressid] = result[i];

			    	$("#addressList").append(`
			    			<option value="${result[i].addressid}" >  
			    				<b>${result[i].to}</b>: ${result[i].contact}, ${result[i].email}, ${result[i].address}, ${result[i].state}, ${result[i].pin} 
			    			</option>
			    		`);
			   	}
	    	}
	    	else {
	    		$("#collapseOne").collapse('show');
		    	$("#addressList").html('<option value="1">No Previous Address Found</option>');
	    	}

	    }
	});
}

function getMyInfo() {

	$.ajax({
	    url: "generic/index/getmyinfo",
	    data : {
	    	username: Cookies.get('username'),
	    	token: Cookies.get('token')
	    },
	    method : "POST",
	    success: function(result){
	    	console.log(result);
	    	if(result[0])
	    	if (result[0].status == "active") {
	    		$("#sdf1").val(result[0].name);
	    		$("#sdf2").val(result[0].contact);
	    		$("#sdf3").val(result[0].email);

	    	}
	    	else{
	    		alertify.error("Your profile is "+result.status)
	    	}

	    }
	});
}

function addDeliveryAddress() {

	$.ajax({
	    url: "generic/index/adddeliveryaddress",
	    data : {
	    	to: $("#sdf1").val(),
	    	contact: $("#sdf2").val(),
	    	email:$("#sdf3").val(),
	    	address:$("#sdf4").val(),
	    	pin:$("#sdf5").val(),
	    	state:$("#sdf6").val(),
	    	username: Cookies.get('username'),
	    	token: Cookies.get('token')
	    },
	    method : "POST",
	    success: function(result){
	    	console.log(result);
	    	if (result.status == "success") {

	    		$("#defaultAddress").html('<b> '+$("#sdf1").val()+'</b> : '+$("#sdf2").val()+', '+$("#sdf3").val()+', '+$("#sdf4").val()+', '+$("#sdf5").val()+', '+$("#sdf6").val() );
	    		$("#addressId").val(result.addressid);

	    		addressList[result.addressid]={
			    	to: $("#sdf1").val(),
			    	contact: $("#sdf2").val(),
			    	email:$("#sdf3").val(),
			    	address:$("#sdf4").val(),
			    	pin:$("#sdf5").val(),
			    	state:$("#sdf6").val(),	    			
	    		}

	    		$("#sdf4").val('');
	    		$("#sdf5").val('');
	    		$("#sdf6").val('');
			   	$("#collapseOne").collapse('hide');
			   	setDisable();
			   	$("#collapseTwo").collapse('show');

	    	}
	    	else {
	    		alertify.error(result.message)
	    	}

	    }
	});

}

function setAddressFromList(ind) {
	console.log(ind);
	if (addressList[ind] ) {
		$("#defaultAddress").html('<b> '+addressList[ind].to+'</b> : '+addressList[ind].contact
			+', '+addressList[ind].email
			+', '+addressList[ind].address
			+', '+addressList[ind].pin 
			+', '+addressList[ind].state
			);
		$("#addressId").val(ind);		
	   	$("#collapseOne").collapse('hide');
	   	$("#collapseTwo").collapse('show');
	   	setDisable();

	}	
	else {
		alertify.error("Something went wrong, address not found");
	}

}

$("#saveDeliveryForm").on('submit',function (ev) {
	ev.preventDefault();
	addDeliveryAddress();
})
function minSize(id) {
	var oldValue=$("#"+id).val();
	console.log(oldValue);
	if (oldValue>1) {
		oldValue--;
		$("#"+id).val(oldValue);
		updateQuantity(id,oldValue,getMyCartDetails);
	}
}
function maxSize(id) {
	var oldValue=$("#"+id).val();
	console.log(oldValue);
	oldValue++;
	$("#"+id).val(oldValue);
	updateQuantity(id,oldValue,getMyCartDetails)
}
function checkInput(val,_id) {
	console.log(val+"  "+_id);
	updateQuantity(_id,val,getMyCartDetails)

}
function convertNumberToWords(amount) {
    var words = new Array();
    var endText="Only.";
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
	//    amount = amount.toString();
    amount=amount+"";
    var atemp = amount.split(".");
    var ct=0;
    var final_word="";

    while(ct<atemp.length && ct<2)
    {
	    var number = atemp[ct].split(",").join("");

    	if (ct ==1)
    	{

    		if (parseFloat(number) == 0) {
    			break;
    		}

    		final_word+="Rupees ";
    		if (number.length==1) {
    			number=number+"0";
    		}
    	}

	    var n_length = number.length;
	    var words_string = "";
	    if (n_length <= 9) {
	        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
	        var received_n_array = new Array();
	        for (var i = 0; i < n_length; i++) {
	            received_n_array[i] = number.substr(i, 1);
	        }
	        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
	            n_array[i] = received_n_array[j];
	        }
	        for (var i = 0, j = 1; i < 9; i++, j++) {
	            if (i == 0 || i == 2 || i == 4 || i == 7) {
	                if (n_array[i] == 1) {
	                    n_array[j] = 10 + parseInt(n_array[j]);
	                    n_array[i] = 0;
	                }
	            }
	        }
	        value = "";
	        for (var i = 0; i < 9; i++) {
	            if (i == 0 || i == 2 || i == 4 || i == 7) {
	                value = n_array[i] * 10;
	            } else {
	                value = n_array[i];
	            }
	            if (value != 0) {
	                words_string += words[value] + " ";
	            }
	            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
	                words_string += "Crores ";
	            }
	            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
	                words_string += "Lakhs ";
	            }
	            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
	                words_string += "Thousand ";
	            }
	            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
	                words_string += "Hundred and ";
	            } else if (i == 6 && value != 0) {
	                words_string += "Hundred ";
	            }
	        }
	        words_string = words_string.split("  ").join(" ");
	        final_word+=words_string
	    }
		ct++;
	}
	if (ct == 2)
		endText="Paisa Only."
    return final_word+endText;
}


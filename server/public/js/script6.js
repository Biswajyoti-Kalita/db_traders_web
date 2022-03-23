var cartItems=[];
var addressList=[];
var totalPrice=0.0;
var totalDiscount=0.0;
var grandTotal=0.0;
var productList=[];
var orderList=[];

var n=new Date();

$(window).on('load', function () {

	updateYears();
	getMyCartDetails(n.getFullYear());

});


function updateYears() {
	var i=n.getFullYear();

	$("#orderYear").html('');

	for (;i>=2020;i--) {
		console.log(i);

		$("#orderYear").append(`
			<option>${i}</option>
		`);

	}
}
function showStatus(status,pstatus,dstatus) {

	var returnVal='';

	if (status == "received") {
		returnVal=`
			<div class="order-tracking completed">
				<span class="is-complete"></span>
				<p>Ordered</p>
			</div>
			<div class="order-tracking">
				<span class="is-complete"></span>
				<p>Accepted</p>
			</div>
			<div class="order-tracking">
				<span class="is-complete"></span>
				<p>Payment</p>
			</div>
			<div class="order-tracking ">
				<span class="is-complete"></span>
				<p>In-transit</p>
			</div>
			<div class="order-tracking">
				<span class="is-complete"></span>
				<p>Delivered</p>
			</div>
		`;
	} else if (status == "accepted") {

		returnVal=`
			<div class="order-tracking completed">
				<span class="is-complete"></span>
				<p>Ordered</p>
			</div>
			<div class="order-tracking completed">
				<span class="is-complete"></span>
				<p>Accepted</p>
			</div>
			`;

			if (pstatus.toLowerCase() == "paid") {

				returnVal+=`
					<div class="order-tracking" completed>
						<span class="is-complete"></span>
						<p>Payment</p>
					</div>
				`;

				if (dstatus.toLowerCase() == "delivered") {

					returnVal+=`
						<div class="order-tracking completed">
							<span class="is-complete"></span>
							<p>In-transit</p>
						</div>
						<div class="order-tracking completed">
							<span class="is-complete"></span>
							<p>Delivered</p>
						</div>
					`;

				}
				else {
					returnVal+=`
						<div class="order-tracking completed">
							<span class="is-complete"></span>
							<p>In-transit</p>
						</div>
						<div class="order-tracking">
							<span class="is-complete"></span>
							<p>Delivered</p>
						</div>
					`;
				}

			}
			else {
				returnVal+=`
					<div class="order-tracking">
						<span class="is-complete"></span>
						<p>Payment</p>
					</div>
					<div class="order-tracking ">
						<span class="is-complete"></span>
						<p>In-transit</p>
					</div>
					<div class="order-tracking">
						<span class="is-complete"></span>
						<p>Delivered</p>
					</div>
				`;				
			}



	}

	return	returnVal;

}
function getMyCartDetails(year) {

	$.ajax({
	    url: "generic/index/getmycartdetails",
	    data : {
	    	year: year,
	    	username: Cookies.get('username'),
	    	token: Cookies.get('token')
	    },
	    method : "POST",
	    success: function(result){
	    	orderList=productList=[];
	    	console.log(result);
	    	if(result.length == 0)
	    	{

		    		$("#myOrders").html(`
						<div class="card">
							<div class="card-body">
								<center>
									<small> You have not placed any order yet. </small>
								</center>
							</div>
						</div>`);

	    	}
	    	else{
		    	for (var i = result.length - 1; i >= 0; i--) {



		    		if (orderList.indexOf(result[i].orderid)>=0) {

		    			if (productList.indexOf(result[i].orderid+"#"+result[i].productid)<0) {


				    		$("#order_body_"+result[i].orderid).append(`
								<div class="col-sm-12 row">
									<div class="col-sm-4">
										<center>
										<img src="${result[i].url}"  />
										</center>
									</div>
									<div class="col-sm-4">
										<a href="product_details.html#${result[i].productid}">
										<b>${result[i].name}</b>
										<p>${result[i].description}</p>
										</a>
									</div>
									<div class="col-sm-4">
										<span class="capitalize" >${result[i].status}</span>
									</div>
									</div>
			    			`);

				    		productList.push(result[i].orderid+"#"+result[i].productid);
			    		}
		    		}
		    		else{


				    		$("#myOrders").append(`
								<div class="card" id="order_${result[i].orderid}">
									<div class="card-header">
										<small>#${result[i].orderid}</small>
										<small style="float:right;">ORDER PLACED ON ${result[i].createdAt.substr(0,10)}</small>
									</div>
									<div class="card-body" >
										<div class="">
										  	<div class="row">
												<div class="col-12 col-md-10 hh-grayBox pt45 pb20">
													<div class="row justify-content-between">
														${showStatus(result[i].status,result[i].pstatus,result[i].dstatus)}
													</div>
												</div>
											</div>
										</div>
										<br>
										<div  id="order_body_${result[i].orderid}">
											<div class="col-sm-12 row">
												<div class="col-sm-4">
													<center>
													<img src="${result[i].url}"  />
													</center>
												</div>
												<div class="col-sm-4">
													<a href="product_details.html#${result[i].productid}">
													<b>${result[i].name}</b>
													<p>${result[i].description}</p>
													</a>
												</div>
												<div class="col-sm-4">
													<span class="capitalize" >${result[i].status}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
				    		`);
				    	
				    		productList.push(result[i].orderid+"#"+result[i].productid);
			    			orderList.push(result[i].orderid);
		    		
		    		
		    		}



		    	}
		    }



	    }
	});
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


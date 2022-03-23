const fs = require("fs");
const path = require("path");
const helper = require("./helper");
const {
  makeCapital,
  makeSingular,
  makeCamelCase,
  makePluralize,
  removeUnderscore,
  makeLowerCase,
} = require("./helper");

function createMenus(menus, menuItem) {
  var data = `
    <li class="nav-item">
    <a href="dashboard.html" class="nav-link">
      <i class="nav-icon fas fa-columns"></i>
      <p>
        Dashboard
      </p>
    </a>
  </li>

  `;
  menus.map((item, ind) => {
    data += `
	      	<li class="nav-item">
	            <a href="${item.controller_name}.html" class="nav-link ${
      item.controller_name == menuItem?.controller_name ? "active" : ""
    }">
	              <i class="nav-icon ${
                  item.menu_icon ? item.menu_icon : "fas fa-th"
                }"></i>
	              <p>
                	${makeCapital(item.name)}
	              </p>
	            </a>
	        </li>
 
		`;
  });
  return data;
}
function getFilters(filters, models, model_name) {
  var data = "";

  if (filters && filters[0]) {
    var arr = models.filter((i) => {
      if (i.name == model_name) return i;
    });

    arr = arr[0] ? arr[0] : {};

    data += `
	        <div class="card">
	          <form id="search${makeCapital(model_name, 1)}Form" action="#">
	          <div class="card-header">
	            <h3 class="card-title">Filter</h3>
	          </div>
	          <div class="card-body">
	            <div class="row">

		`;
    filters.map((item) => {
      data += `
		              <div class="col-md-4 col-lg-4">
		                <div class="form-group">
		                  <label>${makeCapital(removeUnderscore(item))}</label>
		                  `;
      if (arr.mapping && arr.mapping[item]) {
        data += `
						    <select class="form-control" name="${item}" >
					    		<option value="">All</option>
						    `;

        for (key in arr.mapping[item]) {
          data += `<option value="${key}"> ${makeCapital(
            arr.mapping[item][key]
          )}</option>`;
        }

        data += `</select>`;
      } else {
        for (var p = 0; p < arr.fields.length; p++) {
          if (arr.fields[p][0] == item) {
            if (arr.fields[p][1] == "integer") {
              data += `<input type="number" class="form-control" name="${item}" placeholder="${makeCapital(
                removeUnderscore(item)
              )}">`;
            } else if (arr.fields[p][1] == "date") {
              data += `<input type="date" class="form-control" name="${item}" placeholder="${makeCapital(
                removeUnderscore(item)
              )}">`;
            } else if (arr.fields[p][1] == "dateonly") {
              data += `<input type="date" class="form-control" name="${item}" placeholder="${makeCapital(
                removeUnderscore(item)
              )}">`;
            } else if (arr.fields[p][1] == "string") {
              data += `<input type="text" class="form-control" name="${item}" placeholder="${makeCapital(
                removeUnderscore(item)
              )}">`;
            } else if (arr.fields[p][1] == "boolean") {
              data += `
									    	<select class="form-control" name="${item}"> 
									    		<option value="1">Yes</option>
									    		<option value="0">No</option>
									    	</select>
									    	`;
            } else {
              data += `<input type="text" class="form-control" name="${item}" placeholder="${makeCapital(
                removeUnderscore(item)
              )}">`;
            }
          }
        }
        for (var p = 0; p < arr.join.length; p++) {
          if (arr.join[p]["field"] == item) {
            data += `<input type="text" class="form-control" name="${item}" placeholder="${makeCapital(
              removeUnderscore(item)
            )}">`;
          }
        }
      }

      data += `</div>
		              </div>
			`;
    });

    data += `
	            </div>            
	          </div>
	          <div class="card-footer">
	            <button type="submit" class="btn btn-sm btn-info" >Search</button>
	          </div>
	          </form>
	        </div>
	        `;
  }
  return data;
}
function getBulkDeleteButton(item) {
  var data = `
		<div class="" >
		  <button type="submit" class="btn btn-sm btn-danger" style="display: none;" onclick='bulkDelete("${makeCapital(
        item.controller_name,
        1
      )}")' id='bulkDelete${makeCapital(item.controller_name, 1)}' >
		    <i class="fas fa-trash"></i> 		    
		  </button>
		</div>
	`;
  return data;
}
function getAddButton(item) {
  var data = `
		<div class="ml-2">
		  <button type="submit" class="btn btn-sm btn-primary" onclick="add${makeCapital(
        item.controller_name,
        1
      )}Modal()">
		    <i class="fas fa-plus-circle"></i> 
		  </button>
		</div>
	`;

  return data;
}
function getExportButton(item) {
  var data = `
		<div class="ml-2">
		  <button type="submit" class="btn btn-sm btn-primary" onclick="exportTable('${makeCapital(
        item.controller_name,
        1
      )}')">
		    <i class="fas fa-file-csv"></i> 
		  </button>
		</div>
	`;

  return data;
}

function getTableHeader(item) {
  var data = "";
  if (item.bulkdelete)
    data = `
	      <th style="width: 50px;">
	        <input type="checkbox" id="bulkSelect${makeCapital(
            item.controller_name,
            1
          )}" onclick="bulkSelect('${makeCapital(
      item.controller_name,
      1
    )}')" name="">
	      </th>
		`;

  for (var i = 0; i < item.table_header.length; i++) {
    var th = item.table_header[i];
    var tb = item.table_body[i].split("|")[0];
    data += `<th><div style="display:flex;"> ${makeCapital(
      th
    )} <div style="margin-left: auto;margin-top:3px;">   <i class="bi bi-sort-up sort-icon cursor-p fade-l" style=""  id="${tb}SortASC" onclick="change${makeCapital(
      item.controller_name,
      1
    )}sTableOrder('${tb}','ASC')"  ></i> <i class="bi bi-sort-down cursor-p sort-icon fade-l"  id="${tb}SortDESC" onclick="change${makeCapital(
      item.controller_name,
      1
    )}sTableOrder('${tb}','DESC')"  ></i> </div> </div></th>`;
  }
  if (item.add || item.delete) data += `<th>Action</th>`;

  return data;
}
function createMenuDiv(current_model, item) {
  var data = `
	`;
  var ind = 0;
  data += `
	      <div class="container-fluid panels" id="menu_${
          item.controller_name
        }" style=" ${ind > 0 ? "display:none" : ""} ">
	      	${getFilters(
            item.filters ? item.filters : [],
            current_model,
            item.controller_name
          )}
	        <div class="card">
	          <div class="card-header">
	            <h3 class="card-title mb-1 mt-1">${makeCapital(
                item.name
              )} Table</h3>
	            <div class="card-tools mb-1 mt-1 row">
	            	${item.bulkdelete ? getBulkDeleteButton(item) : ""}
	            	${item.export ? getExportButton(item) : ""}
	            	${item.add ? getAddButton(item) : ""}
	              <div class="ml-2">
	                <select class="btn btn-sm border" onchange="change${makeCapital(
                    makePluralize(item.controller_name),
                    1
                  )}TableLimit(this.value)">
	                  <option>10</option>
	                  <option>25</option>
	                  <option>50</option>
	                  <option>100</option>
	                  <option value=''>All</option>
	                </select>
	              </div>
	            </div>
	          </div>
	          <div class="card-body">
		          <div class="table-responsive">
		            <table class="table table-hover text-nowrap" id="table${makeCapital(
                  item.controller_name
                )}">
		              <thead id="${item.controller_name}TableHead">
		                <tr>
		                	${getTableHeader(item)}
		                </tr>
		              </thead>
		              <tbody id="${item.controller_name}TableBody">
		              </tbody>
		            </table>
		          </div>
		          <div style="float:right;" class="pagination" id="pagination${makeCapital(
                item.controller_name
              )}">
		          </div>

	          </div>
	        </div>
	      </div><!-- /.container-fluid -->
		`;
  return data;
}

function getAddFormFields(item, models) {
  var data = "";
  let i = {
    fields: [[]],
  };

  models.map((j) => {
    if (j.name === item.model) i = j;
  });

  if (item.add_fields && item.add_fields[0]) {
    item.add_fields.map((variable_name_type) => {
      var variable_name = variable_name_type.split("|")[0];
      var variable_type = helper.makeLowerCase(
        variable_name_type.split("|")[1],
        0
      );

      var isRequired;

      if (i.fields[0][0] == variable_name && i.fields[0][3] == "required")
        isRequired = 1;
      var isMapping = "";

      i.fields.map((k) => {
        if (k[0] == variable_name && i.mapping[variable_name]) {
          isMapping = i.mapping[variable_name];
        }
      });
      data += `<label>${makeCapital(variable_name, false, true)}</label>`;
      if (isMapping) {
        data += `<select class="form-control mb-2" id="add${makeCapital(
          item.controller_name,
          true,
          true
        )}${makeCapital(variable_name, true, true)}Input">`;
        for (key in isMapping) {
          data +=
            '<option value="' +
            key +
            '" > ' +
            makeCapital(isMapping[key]) +
            " </option>";
        }
        data += "</select>";
      } else {
        if (variable_type == "textarea") {
          data += `
						<textarea id="add${makeCapital(item.controller_name, true, true)}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true
          )}" ${
            isRequired == "required" ? "required" : ""
          } rows="3" ></textarea>
					`;
        } else if (variable_type == "integer") {
          data += `
						<input type="number" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "date") {
          data += `
						<input type="date" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "dateonly") {
          data += `
						<input type="date" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "email") {
          data += `
						<input type="email" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(variable_name)}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "password") {
          data += `
						<input type="password" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "file") {
          data += `
						 <input type="hidden" name="${i}"  value="0" id="add${makeCapital(
            variable_name,
            true,
            true
          )}Input" />
						<input type="file" onchange="uploadFile("add${makeCapital(
              variable_name,
              true,
              true
            )}Input")" id="add${makeCapital(
            item.controller_name,
            true,
            true
          )}${makeCapital(
            variable_name,
            true,
            true
          )}InputFile" name="${makeCamelCase(
            i
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "boolean") {
          data += `
						<div class="form-check form-switch">
						  <input type="hidden" name="${i}"  value="0" id="add${makeCapital(
            item.controller_name,
            true,
            true
          )}${makeCapital(variable_name, true, true)}Input" />
						  <input class="form-check-input" type="checkbox" onchange="document.getElementById('add${makeCapital(
                item.controller_name
              )}${makeCapital(
            variable_name,
            true,
            true
          )}Input').value = this.value? 1 : 0 ; " >
						  <label class="form-check-label" for="add${makeCapital(
                item.controller_name,
                true,
                true
              )}${makeCapital(variable_name, true, true)}Input"> ${makeCapital(
            variable_name,
            true,
            true
          )} </label>
						</div>
					`;
        } else
          data += `
						<input type="text" id="add${makeCapital(
              item.controller_name,
              true,
              true
            )}${makeCapital(
            variable_name,
            true,
            true
          )}Input" name="${variable_name}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
      }
    });
    data +=
      '<button type="submit" class="btn btn-primary btn-sm mt-2" >Submit</button>';
  }
  return data;
}
function getEditFormFields(item, models) {
  var data = "";
  let i = {
    fields: [[]],
  };

  models.map((j) => {
    if (j.name === item.name) i = j;
  });

  if (item.edit_fields && item.edit_fields[0]) {
    item.edit_fields.map((variable_name_type) => {
      var variable_name = variable_name_type.split("|")[0];
      var variable_type = variable_name_type.split("|")[1];

      var isRequired;
      if (i.fields[0][0] == variable_name && i.fields[0][3] == "required")
        isRequired = 1;
      var isMapping = "";

      i.fields.map((k) => {
        if (k[0] == variable_name && i.mapping[variable_name]) {
          isMapping = i.mapping[variable_name];
        }
      });

      data += `<label>${makeCapital(variable_name, false, true)}</label>`;

      if (isMapping) {
        data += `<select class="form-control mb-2" id="edit${makeCapital(
          item.controller_name
        )}${makeCapital(variable_name, true, true)}Input">`;
        for (key in isMapping) {
          data +=
            '<option value="' +
            key +
            '" > ' +
            makeCapital(isMapping[key]) +
            " </option>";
        }
        data += "</select>";
      } else {
        if (variable_type == "textarea") {
          data += `
						<textarea id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${
            isRequired == "required" ? "required" : ""
          } rows="3" ></textarea>
					`;
        } else if (variable_type == "integer") {
          data += `
						<input type="number" id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "date") {
          data += `
						<input type="date" id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "dateonly") {
          data += `
						<input type="date" id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "email") {
          data += `
						<input type="email" id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "password") {
          data += `
						<input type="password" id="edit${makeCapital(
              item.controller_name
            )}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${makeCamelCase(
            variable_name
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
        } else if (variable_type == "file") {
          data += `
						 <input type="hidden" name="${i}"  value="0" id="edit${makeCapital(
            item.controller_name
          )}${makeCapital(variable_name, true, true, 1)}Input" />
						<input type="file" onchange="uploadFile("edit${makeCapital(
              variable_name,
              true,
              true,
              1
            )}Input")" id="edit${makeCapital(
            variable_name,
            true,
            true,
            1
          )}InputFile" name="${makeCamelCase(
            i
          )}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            false,
            true
          )}" ${isRequired == "required" ? "" : ""}>
					`;
        } else if (variable_type == "boolean") {
          data += `
						<div class="form-check form-switch">
						  <input type="hidden" name="${i}"  value="0" id="edit${makeCapital(
            item.controller_name
          )}${makeCapital(variable_name, true, true, 1)}Input" />
						  <input class="form-check-input" type="checkbox" onchange="document.getElementById('edit${makeCapital(
                item.controller_name
              )}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input').value = this.value? 1 : 0 ; " >
						  <label class="form-check-label" for="edit${makeCapital(
                item.controller_name
              )}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input"> ${makeCapital(variable_name, true, true)} </label>
						</div>
					`;
        } else
          data += `
						<input type="text" id="edit${makeCapital(item.controller_name)}${makeCapital(
            variable_name,
            true,
            true,
            1
          )}Input" name="${variable_name}" class="form-control mb-2" placeholder="${makeCapital(
            variable_name,
            true
          )}" ${isRequired == "required" ? "required" : ""}>
					`;
      }
    });
    data += `<input type='hidden' id= 'edit${makeCapital(
      item.controller_name
    )}${makeCapital(item.controller_name, 1)}Id' > `;
    data +=
      '<button type="submit" class="btn btn-primary btn-sm mt-2" >Submit</button>';
  }
  return data;
}

function createAddModals(models, item) {
  var data = "";
  if (item.add)
    data += `
			<!-- ADD MODAL ${makeCapital(item.name)} -->
			<div class="modal fade" id="add${makeCapital(
        item.controller_name,
        1
      )}Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-sm">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" id="exampleModalLabel">Add ${makeCapital(
                item.controller_name
              )}</h5>
			        <button type="button" class="close" data-bs-dismiss="modal"  data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">×</span>
			        </button>
			      </div>
			      <div class="modal-body">
			          <form action="#" id="add${makeCapital(item.controller_name, 1)}Form">
			          	${getAddFormFields(item, models)}
			          </form>
			      </div>
			    </div>
			  </div>
			</div>
		`;
  return data;
}
function createEditModals(models, item) {
  var data = "";
  if (item.edit)
    data += `
			<!-- EDIT MODAL ${makeCapital(item.name)} -->`;
  data += `
			<div class="modal fade" id="edit${makeCapital(
        item.controller_name,
        1
      )}Modal" tabindex="-1" aria-labelledby="${makeCapital(
    item.controller_name
  )}ModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-sm">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" id="${makeCapital(
                item.controller_name
              )}ModalLabel">Edit ${makeCapital(item.controller_name)}</h5>
			        <button type="button" class="close" data-bs-dismiss="modal"  data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">×</span>
			        </button>
			      </div>
			      <div class="modal-body">
			          <form action="#" id="edit${makeCapital(item.controller_name, 1)}Form">
			          	${getEditFormFields(item, models)}
			          </form>
			      </div>
			    </div>
			  </div>
			</div>
		`;
  return data;
}

function addMenuScripts(item) {
  var data = "";
  data += `
			<script src="./js/${item.controller_name}.js"></script>
		`;
  return data;
}
function getEditFieldsParams(item) {
  var data = [];
  item.edit_fields.map((i) => {
    var variable_name = i.split("|")[0];
    data.push(" '${result[i]." + variable_name + "}'");
  });
  return data.toString();
}
function checkNullValue(val, separator, defaultVal) {
  var items = val.split(".");
  var data = ``;
  var datay = ``;
  var datax = ``;
  for (var i = 0; i < items.length; i++) {
    data += items[i];
    datay += data + " ? ";
    data += i < items.length ? "." : "";
    // console.log(datay);
  }
  var data = ``;
  for (var i = 0; i < items.length; i++) {
    data += items[i];
    data += i < items.length - 1 ? "." : "";
    // console.log(datax);
  }

  // console.log(datay,data);
  if (defaultVal) datay += defaultVal;
  else datay += data;

  for (var i = 0; i < items.length; i++) {
    datay += " : '" + separator + "' ";
  }
  // console.log(datay);

  return datay;
}

function getBodyFields(item, mappings) {
  var data = "";
  if (item.bulkdelete)
    data +=
      "<td> <input onclick=\"checkSelected('" +
      makeCapital(item.controller_name, 1) +
      '\')" type="checkbox" class=" checkbox-' +
      makeCapital(item.controller_name, 1) +
      ' "  data-id="${result[i].id}" /> </td>';

  item.table_body.map((i) => {
    var variable_name = i.split("|")[0];
    var variable_type = i.split("|")[1];

    switch (variable_type) {
      case "link":
        data +=
          `
						<td> <a href= "'` +
          "${" +
          `${checkNullValue("result[i]." + variable_name, "#")} ` +
          "}" +
          ` '">Link</a> </td>`;
        break;
      case "image":
        data +=
          `
						<td><div class="image-td-div text-center"> <img class="image-fluid" width="80"  src="` +
          "${" +
          `${checkNullValue(
            "result[i]." + variable_name,
            "#"
          )}}" /> </div></td>`;
        break;
      case "switch":
        data +=
          `
						<td> <div class="custom-control custom-switch"> <input type="checkbox" class="custom-control-input" ` +
          "${" +
          ` ${checkNullValue(
            "result[i]." + variable_name,
            "#",
            "checked"
          )}}  disabled  > </div></td>`;
        break;
      case "string":
        data +=
          `
						<td>` +
          "${" +
          ` ${checkNullValue("result[i]." + variable_name, " ")}  }</td>`;
        break;
      case "mapping":
        if (mappings[variable_name]) {
          data += "<td>";
          var tempMappingList = [];
          for (key in mappings[variable_name]) {
            tempMappingList[key] = '"' + mappings[variable_name][key] + '"';
          }
          for (var i = 0; i < tempMappingList.length; i++) {
            tempMappingList[i] =
              tempMappingList[i] === undefined ? '" "' : tempMappingList[i];
          }
          data +=
            "${ [ " +
            tempMappingList.toString() +
            " ][result[i]." +
            variable_name +
            "]}";

          data += "</td>";
        } else
          data +=
            `
					<td>` +
            "${" +
            ` ${checkNullValue("result[i]." + variable_name, " ")} }</td>`;
        break;
      default:
        data +=
          `
					<td>` +
          "${" +
          ` ${checkNullValue("result[i]." + variable_name, " ")} }</td>`;
    }
  });
  if (item.edit || item.delete) {
    data += "<td>";
    if (item.edit)
      data +=
        `<span class="btn btn-link btn-sm" onclick="edit${makeCapital(
          item.controller_name,
          1
        )}Modal( ${getEditFieldsParams(item)}, ` +
        "${result[i].id}" +
        ` )">Edit</span>`;
    if (item.delete)
      data +=
        '<span class="btn btn-link btn-sm" onclick="delete' +
        makeCapital(item.controller_name, 1) +
        'Modal(${result[i].id})">Delete</span>';
    data += "</td>";
  }

  return data;
}
function getAddFields(item) {
  var data = "";

  item.add_fields.map((i) => {
    var variable_name = i.split("|")[0];
    data += `${variable_name} :  $("#add${makeCapital(
      item.model,
      true,
      true
    )}${makeCapital(variable_name, true, true, 1)}Input").val() ,`;
  });
  return data;
}
function getEditFields(item) {
  var data = "";

  item.edit_fields.map((i) => {
    var variable_name = i.split("|")[0];
    data += `${variable_name} : $("#edit${makeCapital(
      item.model,
      true,
      true
    )}${makeCapital(variable_name, 1, true)}Input").val(),`;
  });
  if (item.edit_fields.indexOf("id") < 0)
    data += `id : $("#edit${makeCapital(item.model, true, true)}${makeCapital(
      item.controller_name,
      1
    )}Id").val()`;

  return data;
}
function getPreEditFields(item) {
  var data = "";
  item.edit_fields.map((i) => {
    var variable_name = i.split("|")[0];
    data += `$("#edit${makeCapital(
      item.controller_name,
      true,
      true
    )}${makeCapital(
      variable_name,
      true,
      true,
      1
    )}Input").val(${variable_name});`;
  });
  return data;
}
function createMenusScript(current_portal, config_models) {
  var menus = current_portal.menus;

  menus.map((item) => {
    var mappings = {};
    config_models.map((i) => {
      if (i.name == item.controller_name) mappings = i.mapping;
    });

    var data = "";
    // get table is default
    data +=
      `

			$(document).ready(function(){
				get${makeCapital(item.controller_name, 1)}s();
			});

			var ${makeCapital(item.controller_name, 1)}TableOffset = 0;
			var ${makeCapital(item.controller_name, 1)}TableLimit = 10;
			var ${makeCapital(item.controller_name, 1)}TableOrderField = 'id';
			var ${makeCapital(item.controller_name, 1)}TableOrderFieldBy = 'DESC';

			function update${makeCapital(item.controller_name, 1)}sTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+${makeCapital(
          item.controller_name,
          1
        )}TableOrderField+"Sort"+${makeCapital(
        item.controller_name,
        1
      )}TableOrderFieldBy).removeClass("fade-l");
			}

			function get${makeCapital(item.controller_name, 1)}s(searchObj) {
				
				update${makeCapital(item.controller_name, 1)}sTableHeaderSort();


				  	const data = {
				    	offset: ${makeCapital(item.controller_name, 1)}TableOffset,
				    	limit : ${makeCapital(item.controller_name, 1)}TableLimit,
				    	order: ${makeCapital(item.controller_name, 1)}TableOrderField,
				    	order_by: ${makeCapital(item.controller_name, 1)}TableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/${makeLowerCase(current_portal.name)}/get${makeLowerCase(
        makePluralize(item.controller_name),
        1
      )}",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#${makeCamelCase(item.controller_name)}TableBody").html('');

				      ${
                item.add
                  ? ' $("#add' +
                    makeCapital(item.controller_name, 1) +
                    '").html("");  '
                  : ""
              }
				      ${
                item.edit
                  ? ' $("#edit' +
                    makeCapital(item.controller_name, 1) +
                    '").html("");  '
                  : ""
              }


				      for (var i = 0; i < result.length; i++) {
				        $("#${makeCamelCase(item.controller_name)}TableBody").append(` +
      "`" +
      `
				          <tr>
				          	${getBodyFields(item, mappings)}
				          </tr>
				        ` +
      "`" +
      `);
				      }
				      getPaginate(count,change${makeCapital(
                item.controller_name,
                1
              )}sTableOffset,${makeCapital(
        item.controller_name,
        1
      )}TableLimit,${makeCapital(
        item.controller_name,
        1
      )}TableOffset,'${makeCapital(item.controller_name)}')
				    },
				  });
				}


				function change${makeCapital(item.controller_name, 1)}sTableOffset(num) {
					${makeCapital(item.controller_name, 1)}TableOffset  = num;
					get${makeCapital(item.controller_name, 1)}s();
				}
				function change${makeCapital(item.controller_name, 1)}sTableLimit(num) {
					${makeCapital(item.controller_name, 1)}TableLimit  = num;
					get${makeCapital(item.controller_name, 1)}s();
				}
				function change${makeCapital(
          item.controller_name,
          1
        )}sTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					${makeCapital(item.controller_name, 1)}TableOrderField  = order_field;
					${makeCapital(item.controller_name, 1)}TableOrderFieldBy  = order_field_by;
					get${makeCapital(item.controller_name, 1)}s();
				}


		`;

    if (item.filter) {
      data += `
				var tempForm = "";
				$("#search${makeCapital(item.controller_name, 1)}Form").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#search${makeCapital(
            item.controller_name,
            1
          )}Form").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					get${makeCapital(item.controller_name, 1)}s(searchObj);
				})
			`;
    }

    if (item.add) {
      data += `
				function add${makeCapital(item.controller_name, 1)}() {
				  $.ajax({
				    url: "/${makeLowerCase(current_portal.name)}/add${makeLowerCase(
        item.controller_name,
        1
      )}",
				    method: "POST",
				    data: {
				    	${getAddFields(item)}
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#add${makeCapital(
                  item.controller_name,
                  1
                )}Form input, #add${makeCapital(
        item.controller_name,
        1
      )}Form textarea").val('')
				        $("#add${makeCapital(item.controller_name, 1)}Modal").modal('hide');
				        swal({
				          title: "${makeCapital(item.controller_name)} Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        get${makeCapital(item.controller_name, 1)}s();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			`;

      data += `
				$("#add${makeCapital(item.controller_name, 1)}Form").on('submit',(ev) => {
				  ev.preventDefault();
				  add${makeCapital(item.controller_name, 1)}();
				})
				function add${makeCapital(item.controller_name, 1)}Modal(){
				  $("#add${makeCapital(item.controller_name, 1)}Modal").modal('show');					
				}
			`;
    }
    if (item.edit) {
      data += `
				function update${makeCapital(item.controller_name, 1)}()  {
				  $.ajax({
				    url: "/${makeLowerCase(current_portal.name)}/update${makeLowerCase(
        item.controller_name,
        1
      )}",
				    method: "POST",
				    data: {
				    	${getEditFields(item)},				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#edit${makeCapital(
                  item.controller_name,
                  1
                )}Form input, #edit${makeCapital(
        item.controller_name,
        1
      )}Form textarea").val('')
				        $("#edit${makeCapital(item.controller_name, 1)}Modal").modal('hide');
				        swal({
				          title: "${makeCapital(item.controller_name)} Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        get${makeCapital(item.controller_name, 1)}s();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });

				    },
				  });
				}
			`;

      data += `
				function edit${makeCapital(item.controller_name, 1)}Modal(${item.edit_fields
        .toString()
        .split(",")
        .map((i) => {
          return i.split("|")[0];
        })
        .toString()},id) {
				  $("#edit${makeCapital(item.controller_name, 1)}Modal").modal('show');
				  $("#edit${makeCapital(item.controller_name, 1, 1)}${makeCapital(
        item.controller_name,
        1
      )}Id").val(id);
				  ${getPreEditFields(item)}
				}
				$("#edit${makeCapital(item.controller_name, 1)}Form").on('submit',(ev) => {
					ev.preventDefault();
					update${makeCapital(item.controller_name, 1)}();
				})

			`;
    }
    if (item.delete) {
      data += `
				function delete${makeCapital(item.controller_name, 1)}(id) {
				  $.ajax({
				    url: "/${makeLowerCase(current_portal.name)}/delete${makeLowerCase(
        item.controller_name,
        1
      )}",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "${makeCapital(item.controller_name)} Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        get${makeCapital(item.controller_name, 1)}s();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			`;

      data += `

				async function delete${makeCapital(item.controller_name, 1)}Modal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    delete${makeCapital(item.controller_name, 1)}(id);
				  }
				}
			`;
    }

    if (item.bulkdelete) {
      data += `
				function bulkDelete${makeCapital(item.controller_name, 1)}(ids) {
				  $.ajax({
				    url: "/${makeLowerCase(current_portal.name)}/bulkdelete${makeLowerCase(
        item.controller_name,
        1
      )}",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "${makeCapital(
                    makePluralize(item.controller_name)
                  )} Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        get${makeCapital(item.controller_name, 1)}s();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			`;

      data += `

				async function bulkDelete${makeCapital(item.controller_name, 1)}Modal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDelete${makeCapital(item.controller_name, 1)}(ids);
				  }
				};

			`;
    }

    fs.writeFileSync(
      __dirname +
        "/../release/public/" +
        current_portal.name +
        "/js/" +
        item.controller_name +
        ".js",
      data,
      function (err) {
        if (err) return console.log(err);
      }
    );
  });
}
module.exports = {
  generatePortal: async function (
    config_portals,
    config_env,
    config_models,
    config_roles
  ) {
    for (item in config_portals) {
      var current_portal = config_portals[item];
      var file_data = "",
        login_data = "",
        dashboard_data = "",
        script_data = "",
        auth_data = "";
      file_data = `
				const fs = require('fs');
				const path = require('path');
				const basename = path.basename(__filename);
				const { Sequelize, DataTypes } = require('sequelize');
				require("dotenv").config();
				var controllers = [];

				fs.readdirSync(__dirname)
				.filter((file) => {
				    return (
				        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
				    );
				})
				.forEach((file) => {
				    var controller = require(path.join(__dirname, file));
				    controllers.push(controller);
				});
				module.exports = {
				 initializeApi: function (app) {
				   controllers.forEach((item) => item.initializeApi(app))
				 },
				}
			`;

      login_data = `


				<html>
				  <head>
				    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				    <link
				      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
				      rel="stylesheet"
				      integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
				      crossorigin="anonymous"
				    />

				    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				    <script
				      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
				      integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
				      crossorigin="anonymous"
				    ></script>
				    <script src="../js/cookie.umd.min.js"></script>
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">    

				  </head>
				  <body class="bg-light">


				  	<div class="row justify-content-md-center m-2 mt-5">
				  		<div class="col-md-4 text-center">
				  			<h4 class="text-center mt-5">${
                  config_env.company_name
                    ? config_env.company_name
                    : "Umbrella Solution"
                }</h4>
				  			<div class="card shadow p-3 pb-4">
						          <form action="#" class="form" id="loginForm">
						            <h4>LOGIN</h4>
							        <div class="input-group mt-2 mb-3">
							            <input
							              type="email"
							              class="form-control"
							              placeholder="Email id"
							              id="email"
							              required
							            />
							          <div class="input-group-append">
							            <div class="input-group-text">
							              <span class="fas fa-envelope"></span>
							            </div>
							          </div>
						            </div>
							        <div class="input-group mb-3">
							            <input
							              type="password"
							              class="form-control"
							              placeholder="Password"
							              id="password"
							              required
							            />
							          <div class="input-group-append">
							            <div class="input-group-text">
							              <span class="fas fa-lock"></span>
							            </div>
							          </div>
							        </div>						            
						            <button class="btn btn-primary btn-sm ml-2 btn-block">LOGIN</button>
						          </form>


				  			</div>

				  		</div>
				  	</div>



				    <script>
				      $("#loginForm").on("submit", (ev) => {
				        ev.preventDefault();
				        $.ajax({
				          type: "POST",
				          url: "/${current_portal.name}/login",
				          data: {
				            email: $("#email").val(),
				            password: $("#password").val(),
				            role_id : ${config_roles[current_portal.name]}
				          },
				          success: (response) => {
				            console.log(response);
				            if (response.status == "success") {
				              Cookies.set("token", response.token);
				              location.href = response.redirect;
				            } else {
				              alert(response.message);
				            }
				          },
				          fail: (err) => {
				            console.log(err);
				          },
				        });
				      });
				    </script>
				    <style type="text/css">
				    	.input-group-text {
				    		height: 100%;
				    		background-color: white;
				    	}
				    	.input-group input {
				    		border-right: 0px;
				    		font-size: 14px;
				    	}
				    	.btn-block {
				    		width: 100%;
				    		font-size: 14px;
				    	}
				    	.input-group-text span{
				    		border-left: 0px;
				    		color: #7B7B7B;
				    	}
				    	.form {
				    		color: #555;
				    	}
				    	.card {
				    		border: 1px solid #cdcdf7;
				    	}
				    </style>
				  </body>
				</html>
			
			`;

      dashboard_data = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="author"
    content="Umbrella Solution"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${makeCapital(current_portal.name)} Dashboard</title>
  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">    
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="./../css/adminlte.css">
  <link rel="stylesheet" href="./../css/style.css">
  <script src="./../js/cookie.umd.min.js"></script>
</head>
<body class="hold-transition sidebar-mini">
<div class="wrapper">

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Navbar Search -->
      <li class="nav-item">
        <span class="nav-link" onclick="logout()" role="button">
          <i class="fas fa-sign-out-alt"></i> Logout
        </span>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="/" class="brand-link text-center">
      <span class="brand-text font-weight-light">${
        config_env.company_name ? config_env.company_name : "Umbrella Solution"
      }</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="./../image/default-pic.webp" class="img-circle elevation-2" id="userImage" alt="User Image">
        </div>
        <div class="info">
          <a href="dashboard.html" class="d-block">${makeCapital(
            current_portal.name
          )}</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
        	${createMenus(current_portal.menus)}
          <li class="nav-item">
            <a href="change_password.html" class="nav-link">
              <i class="nav-icon fas fa-key"></i>
              <p>
                Change Password
              </p>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h3 class="m-0" id="currentMenuTitle" ></h3>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
          
    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
    <div class="p-3">
      <h5>Title</h5>
      <p>Sidebar content</p>
    </div>
  </aside>
  <!-- /.control-sidebar -->

  <!-- Main Footer -->
  <footer class="main-footer">
    <!-- To the right -->
    <div class="float-right d-none d-sm-inline">
    </div>
    <!-- Default to the left -->
    <small>Copyright &copy; 2021 <a href="https://umbrellasolution.in">Umbrella Solution</a>. All rights reserved.</small>
  </footer>
</div>
<!-- ./wrapper -->


<!-- REQUIRED SCRIPTS -->

<!-- jQuery -->
<script src="./../js/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="./../js/bootstrap.bundle.min.js"></script>
<!-- Sweet Alert 4 -->
<script src="./../js/sweetalert.min.js"></script>
<!-- AdminLTE App -->
<script src="./../js/adminlte.js"></script>
<script src="./../js/dashboard.js"></script>
<script src="./../js/common_script.js"></script>
<script src="./js/script.js"></script>

</body>
</html>

			`;

      change_password_data = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="author"
    content="Umbrella Solution"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${makeCapital(current_portal.name)} Change Password</title>
  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">    
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="./../css/adminlte.css">
  <link rel="stylesheet" href="./../css/style.css">
  <script src="./../js/cookie.umd.min.js"></script>
</head>
<body class="hold-transition sidebar-mini">
<div class="wrapper">

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Navbar Search -->
      <li class="nav-item">
        <span class="nav-link" onclick="logout()" role="button">
          <i class="fas fa-sign-out-alt"></i> Logout
        </span>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="/" class="brand-link text-center">
      <span class="brand-text font-weight-light">${
        config_env.company_name ? config_env.company_name : "Umbrella Solution"
      }</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="./../image/default-pic.webp" class="img-circle elevation-2" id="userImage" alt="User Image">
        </div>
        <div class="info">
          <a href="dashboard.html" class="d-block">${makeCapital(
            current_portal.name
          )}</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
        	${createMenus(current_portal.menus)}
          <li class="nav-item">
            <a href="change_password.html" class="nav-link">
              <i class="nav-icon fas fa-key"></i>
              <p>
                Change Password
              </p>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h3 class="m-0" id="currentMenuTitle" ></h3>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid panels" id="change_password" style="display: none;">
        <div class="card p-2">
            <form action="#" class="col-sm-12 col-md-6" id="passwordForm">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">New Password</label>
                <input type="password" class="form-control" id="newPassword1" placeholder="">
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="newPassword2" placeholder="">
              </div>
              <button class="btn btn-primary">Submit</button>
            </form>          
        </div>
      </div><!-- /.container-fluid -->

    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
    <div class="p-3">
      <h5>Title</h5>
      <p>Sidebar content</p>
    </div>
  </aside>
  <!-- /.control-sidebar -->

  <!-- Main Footer -->
  <footer class="main-footer">
    <!-- To the right -->
    <div class="float-right d-none d-sm-inline">
    </div>
    <!-- Default to the left -->
    <small>Copyright &copy; 2021 <a href="https://umbrellasolution.in">Umbrella Solution</a>. All rights reserved.</small>
  </footer>
</div>
<!-- ./wrapper -->



<!-- REQUIRED SCRIPTS -->

<!-- jQuery -->
<script src="./../js/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="./../js/bootstrap.bundle.min.js"></script>
<!-- Sweet Alert 4 -->
<script src="./../js/sweetalert.min.js"></script>
<!-- AdminLTE App -->
<script src="./../js/adminlte.js"></script>
<script src="./../js/dashboard.js"></script>
<script src="./../js/common_script.js"></script>
<script src="./js/script.js"></script>

</body>
</html>

			`;

      script_data = `
				function logout() {
				  Cookies.remove("token");
				  location.href = "/${current_portal.name}/index.html";
				}
			`;

      auth_data = `
					"use strict";
					var express = require("express");
					var router = express.Router();
					var passport = require("passport");
					var app = express();
					app.use(passport.initialize());
					app.use(passport.session());
					var randomstring = require("randomstring");
					var jwt = require("jsonwebtoken");
					var Sequelize = require("sequelize");
					const Op = Sequelize.Op;
					var db = require("./../../models");
					var file_upload = require('./../../services/upload');
					var roleService = require('./../../services/roleService');
					var passwordService = require('./../../services/passwordService');

					module.exports = {
					    initializeApi: function(app) {
					        const basic_attributes = ["createdAt","updatedAt"];

					`;

      if (current_portal.login) {
        auth_data += `
				        app.post("/${current_portal.name}/login", async function(req, res) {
				            try {

				                const { email, password } = req.body;
				                const user = await db.user.findOne({
				                    where: {
				                        email: email,
				                        role_id: ${config_roles[current_portal.name]} 
				                    },
				                    raw:true
				                });

				                if (!user) {
				                    return res.send({
				                        status: "error",
				                        message: "Email ID does not exist"
				                    })
				                }

				                const isSame = await passwordService.comparePassword(password, user.password);

				                if (isSame) {
				                    delete user["password"];
				                    var token = jwt.sign(user, process.env.SECRET_KEY, {});
				                    res.send({
				                        status: "success",
				                        token: token,
				                        redirect : "/${current_portal.name}/dashboard.html"
				                    })
				                } else {
				                    res.send({
				                        status: "error",
				                        message: "Email ID and password does not match"
				                    })
				                }


				            } catch (error) {
				                console.log(error)
				                res.send({
				                    status: "error",
				                    message: error,
				                });
				            }
				        });


					`;
      }

      auth_data += `


						}
					}

					`;

      // CREATING INDEX.JS FOR CONTROLLERS

      if (
        await !fs.existsSync(
          __dirname + "/../release/controllers/" + current_portal.name
        )
      ) {
        await fs.mkdirSync(
          __dirname + "/../release/controllers/" + current_portal.name
        );
      }

      fs.writeFileSync(
        __dirname +
          "/../release/controllers/" +
          current_portal.name +
          "/index.js",
        file_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      // CREATING LOGIN FOR PORTAL

      if (
        await !fs.existsSync(
          __dirname + "/../release/public/" + current_portal.name
        )
      ) {
        await fs.mkdirSync(
          __dirname + "/../release/public/" + current_portal.name
        );
        await fs.mkdirSync(
          __dirname + "/../release/public/" + current_portal.name + "/css"
        );
        await fs.mkdirSync(
          __dirname + "/../release/public/" + current_portal.name + "/js"
        );
      }

      fs.writeFileSync(
        __dirname + "/../release/public/" + current_portal.name + "/index.html",
        login_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      // CREATING DASHBOARD FOR PORTAL

      if (
        await !fs.existsSync(
          __dirname + "/../release/public/" + current_portal.name
        )
      ) {
        await fs.mkdirSync(
          __dirname + "/../release/public/" + current_portal.name
        );
      }

      fs.writeFileSync(
        __dirname +
          "/../release/public/" +
          current_portal.name +
          "/dashboard.html",
        dashboard_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      fs.writeFileSync(
        __dirname +
          "/../release/public/" +
          current_portal.name +
          "/change_password.html",
        change_password_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      if (
        !fs.existsSync(
          __dirname + "/../release/public/" + current_portal.name + "/js"
        )
      ) {
        fs.mkdirSync(
          __dirname + "/../release/public/" + current_portal.name + "/js"
        );
      }

      fs.writeFileSync(
        __dirname +
          "/../release/public/" +
          current_portal.name +
          "/js/script.js",
        script_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      fs.writeFileSync(
        __dirname +
          "/../release/controllers/" +
          current_portal.name +
          "/auth.js",
        auth_data,
        function (err) {
          if (err) return console.log(err);
        }
      );

      for (let i = 0; i < current_portal.menus.length; i++) {
        let menuItem = current_portal.menus[i];
        let other_menu_data = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta
            name="author"
            content="Umbrella Solution"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${makeCapital(current_portal.name)} ${menuItem.name}</title>
          <!-- Google Font: Source Sans Pro -->
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
          <!-- Font Awesome Icons -->
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">    
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
          <!-- Theme style -->
          <link rel="stylesheet" href="./../css/adminlte.css">
          <link rel="stylesheet" href="./../css/style.css">
          <script src="./../js/cookie.umd.min.js"></script>
        </head>
        <body class="hold-transition sidebar-mini">
        <div class="wrapper">
        
          <!-- Navbar -->
          <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
              </li>
            </ul>
        
            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
              <!-- Navbar Search -->
              <li class="nav-item">
                <span class="nav-link" onclick="logout()" role="button">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </span>
              </li>
            </ul>
          </nav>
          <!-- /.navbar -->
        
          <!-- Main Sidebar Container -->
          <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Brand Logo -->
            <a href="/" class="brand-link text-center">
              <span class="brand-text font-weight-light">${
                config_env.company_name
                  ? config_env.company_name
                  : "Umbrella Solution"
              }</span>
            </a>
        
            <!-- Sidebar -->
            <div class="sidebar">
              <!-- Sidebar user panel (optional) -->
              <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                  <img src="./../image/default-pic.webp" class="img-circle elevation-2" id="userImage" alt="User Image">
                </div>
                <div class="info">
                  <a href="dashboard.html" class="d-block">${makeCapital(
                    current_portal.name
                  )}</a>
                </div>
              </div>
        
              <!-- Sidebar Menu -->
              <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                  <!-- Add icons to the links using the .nav-icon class
                       with font-awesome or any other icon font library -->
                  ${createMenus(current_portal.menus, menuItem)}
                  <li class="nav-item">
                    <a href="change_password.html" class="nav-link">
                      <i class="nav-icon fas fa-key"></i>
                      <p>
                        Change Password
                      </p>
                    </a>
                  </li>
                </ul>
              </nav>
              <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
          </aside>
        
          <!-- Content Wrapper. Contains page content -->
          <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div class="col-sm-6">
                    <h3 class="m-0" id="currentMenuTitle" ></h3>
                  </div><!-- /.col -->
                </div><!-- /.row -->
              </div><!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->
        
            <!-- Main content -->
            <div class="content">
              ${createMenuDiv(config_models, menuItem)}
            </div>
            <!-- /.content -->
          </div>
          <!-- /.content-wrapper -->
        
          <!-- Control Sidebar -->
          <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
            <div class="p-3">
              <h5>Title</h5>
              <p>Sidebar content</p>
            </div>
          </aside>
          <!-- /.control-sidebar -->
        
          <!-- Main Footer -->
          <footer class="main-footer">
            <!-- To the right -->
            <div class="float-right d-none d-sm-inline">
            </div>
            <!-- Default to the left -->
            <small>Copyright &copy; 2021 <a href="https://umbrellasolution.in">Umbrella Solution</a>. All rights reserved.</small>
          </footer>
        </div>
        <!-- ./wrapper -->
        
        
        
        
        
        <!--Modals-->
        
        ${createAddModals(config_models, menuItem)}
        
        
        ${createEditModals(config_models, menuItem)}
        
        
        <!-- REQUIRED SCRIPTS -->
        
        <!-- jQuery -->
        <script src="./../js/jquery.min.js"></script>
        <!-- Bootstrap 4 -->
        <script src="./../js/bootstrap.bundle.min.js"></script>
        <!-- Sweet Alert 4 -->
        <script src="./../js/sweetalert.min.js"></script>
        <!-- AdminLTE App -->
        <script src="./../js/adminlte.js"></script>
        <script src="./../js/dashboard.js"></script>
        <script src="./../js/common_script.js"></script>
        <script src="./js/script.js"></script>
        
        
          ${addMenuScripts(menuItem)}
        
        </body>
        </html>
        
              `;

        fs.writeFileSync(
          __dirname +
            "/../release/public/" +
            current_portal.name +
            `/${menuItem.controller_name}.html`,
          other_menu_data,
          function (err) {
            if (err) return console.log(err);
          }
        );
      }

      // CREATING MENUS SCRIPT.JS
      createMenusScript(current_portal, config_models);
    }

    var index_data_header = "";
    var controller_names = [];
    for (item in config_portals) {
      var current_portal = config_portals[item];
      index_data_header += `
			const ${makeCamelCase(current_portal.name)}Controller = require("./${
        current_portal.name
      }/index");
			`;
      controller_names.push(`${makeCamelCase(current_portal.name)}Controller`);
    }
    index_data_header += `
		`;
    var index_data = `
			${index_data_header}
			module.exports = function initializeApi(app) {
			    const allControllers = [ ${controller_names.toString()} ];
				allControllers.forEach(item => item.initializeApi(app))
			    return app;
			};
		`;
    fs.writeFileSync(
      __dirname + "/../release/controllers/index.js",
      index_data,
      function (err) {
        if (err) return console.log(err);
      }
    );
  },
};

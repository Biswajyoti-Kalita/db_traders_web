let mainCategories = {};
let categoriesArr = [];
$(document).ready(function () {
  console.log("load menu bar");
  $.ajax({
    url: "/others/getallcategories",
    data: {},
    method: "POST",
    success: function (resultData) {
      console.log(resultData);
      resultData.map((item) => {
        categoriesArr[item.id] = item.name;

        if (item.parent) {
          if (!mainCategories[item.parent.name])
            mainCategories[item.parent.name] = {};
          mainCategories[item.parent.name][item.name] = { id: item.id };
        } else {
          if (!mainCategories[item.name]) mainCategories[item.name] = {};
        }

        showMenuItems();
      });
    },
    error: function (err) {
      console.log("Error occured while loading categories", err);
    },
  });
});

function showMenuItems() {
  let menu_items = "";

  for (let item in mainCategories) {
    console.log(item);

    let sub_li = "";

    for (let sub_item in mainCategories[item]) {
      sub_li += `
        <li>
            <a href="product.html#cat=${sub_item}"
            >${sub_item}</a
            >
        </li>
        <li class="divider"></li>
        `;
    }
    menu_items += `
        <li class="nav-item dropdown">
            <a
            href="product.html#cat=${item}"
            class="dropdown-toggle"
            data-toggle="dropdown"
            >${item} <b class="caret"></b
            ></a>
            <ul class="dropdown-menu">
                ${sub_li}
            </ul>
        </li>
    `;
  }

  $("#ulMainMenu").html(`
        <li class="nav-item">
            <a href="/">Home</a>
        </li>
        ${menu_items}
        <li class="nav-item dropdown">
        <a href="#" class="scrollDown"> Contact Us</a>
        </li>
    `);
}

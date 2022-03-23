module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define("product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.STRING,
    },
    barcode: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.STRING,
    },
    colors: {
      type: DataTypes.STRING,
    },
    cost_price: {
      type: DataTypes.DOUBLE,
    },
    selling_price: {
      type: DataTypes.DOUBLE,
    },
    tax: {
      type: DataTypes.DOUBLE,
    },
    cgst: {
      type: DataTypes.DOUBLE,
    },
    sgst: {
      type: DataTypes.DOUBLE,
    },
    igst: {
      type: DataTypes.DOUBLE,
    },
    discount: {
      type: DataTypes.DOUBLE,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  product.associate = function (models) {
    product.belongsTo(models.category, {
      foreignKey: "category_id",
      as: "category",
      constraints: false,
    });

    product.belongsTo(models.category, {
      foreignKey: "sub_category_id",
      as: "sub_category",
      constraints: false,
    });

    product.belongsTo(models.brand, {
      foreignKey: "brand_id",
      as: "brand",
      constraints: false,
    });

    product.hasMany(models.image, {
      foreignKey: "product_id",
      as: "images",
      constraints: false,
    });
  };

  return product;
};
